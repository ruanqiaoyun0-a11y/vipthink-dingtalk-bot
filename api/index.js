const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'vipthink-training-secret-key-change-in-production';

let pool;
function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL or DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

async function query(text, params = []) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function getOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

async function getMany(text, params = []) {
  const result = await query(text, params);
  return result.rows;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function parseAuth(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.substring(7), JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function sendJson(res, status, body) {
  res.status(status).json(body);
}

async function initTables() {
  try {
    await query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(50),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await query(`CREATE TABLE IF NOT EXISTS knowledge_points (
      id SERIAL PRIMARY KEY,
      day INTEGER NOT NULL,
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      "order" INTEGER DEFAULT 0
    )`);

    await query(`CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      day INTEGER NOT NULL,
      type VARCHAR(20) NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      answer INTEGER NOT NULL,
      explanation TEXT NOT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS learning_records (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL,
      day INTEGER NOT NULL,
      practiceCount INTEGER DEFAULT 0,
      practiceGroups INTEGER DEFAULT 0,
      examScore INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    await query(`CREATE TABLE IF NOT EXISTS practice_sessions (
      id SERIAL PRIMARY KEY,
      userId INTEGER NOT NULL,
      day INTEGER NOT NULL,
      groupIndex INTEGER NOT NULL,
      totalQuestions INTEGER DEFAULT 10,
      correctCount INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    const userCount = await getOne('SELECT COUNT(*) as c FROM users');
    if (parseInt(userCount.c, 10) === 0) {
      const hashed = await bcrypt.hash('hltn1234', 10);
      await query("INSERT INTO users (name, password, role) VALUES ($1, $2, 'admin')", ['管理员', hashed]);
      await query("INSERT INTO users (name, password, role) VALUES ($1, $2, 'student')", ['张三', hashed]);
    }
  } catch (err) {
    console.error('表初始化警告:', err.message);
  }
}

let initialized = false;

module.exports = async (req, res) => {
  if (!initialized) {
    await initTables();
    initialized = true;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'GET' && !req.body) {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    if (raw) {
      try { req.body = JSON.parse(raw); } catch (e) { req.body = {}; }
    }
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url.split('?')[0].replace(/^\/api/, '').replace(/^\/+/, '/');
  const user = parseAuth(req);

  try {
    if (path === '/users/login' && req.method === 'POST') {
      const { name, password } = req.body || {};
      if (!name || !password) return sendJson(res, 400, { success: false, message: '姓名和密码不能为空' });
      const u = await getOne('SELECT * FROM users WHERE name = $1', [name]);
      if (!u) return sendJson(res, 401, { success: false, message: '用户名或密码错误' });
      const valid = await bcrypt.compare(password, u.password);
      if (!valid) return sendJson(res, 401, { success: false, message: '用户名或密码错误' });
      const token = signToken(u);
      return sendJson(res, 200, {
        success: true,
        data: { id: u.id, name: u.name, role: u.role, createdAt: u.createdat },
        token,
      });
    }

    if (path === '/users/me' && req.method === 'GET') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录或token已过期' });
      const me = await getOne('SELECT id, name, role, createdat FROM users WHERE id = $1', [user.id]);
      return sendJson(res, 200, { success: true, data: me });
    }

    if (path.startsWith('/users')) {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      if (user.role !== 'admin') return sendJson(res, 403, { success: false, message: '无管理员权限' });

      if (req.method === 'GET') {
        const rows = await getMany('SELECT id, name, role, createdat FROM users ORDER BY id');
        return sendJson(res, 200, { success: true, data: rows });
      }
      if (req.method === 'POST') {
        const { name, password, role = 'student' } = req.body || {};
        if (!name || !password) return sendJson(res, 400, { success: false, message: '姓名和密码不能为空' });
        const hashed = await bcrypt.hash(password, 10);
        const result = await query('INSERT INTO users (name, password, role) VALUES ($1, $2, $3) RETURNING id, name, role', [name, hashed, role]);
        return sendJson(res, 200, { success: true, data: result.rows[0] });
      }
      const idMatch = path.match(/\/users\/(\d+)/);
      if (idMatch && req.method === 'PUT') {
        const id = idMatch[1];
        const { name, password } = req.body || {};
        if (name) await query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
        if (password) {
          const hashed = await bcrypt.hash(password, 10);
          await query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);
        }
        const updated = await getOne('SELECT id, name, role FROM users WHERE id = $1', [id]);
        return sendJson(res, 200, { success: true, data: updated, message: '更新成功' });
      }
      if (idMatch && req.method === 'DELETE') {
        const id = idMatch[1];
        await query('DELETE FROM learning_records WHERE userid = $1', [id]);
        await query('DELETE FROM users WHERE id = $1', [id]);
        return sendJson(res, 200, { success: true, message: '删除成功' });
      }
    }

    const learningMatch = path.match(/\/learning\/day\/(\d+)/);
    if (learningMatch && req.method === 'GET') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      const day = parseInt(learningMatch[1], 10);
      const rows = await getMany('SELECT id, day, title, content, "order" FROM knowledge_points WHERE day = $1 ORDER BY "order" ASC, id ASC', [day]);
      return sendJson(res, 200, { success: true, data: rows });
    }

    function shuffleOptions(options, seed) {
      const shuffled = [...options];
      let s = seed;
      const random = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    const questionsMatch = path.match(/\/questions\/(\d+)\/(practice|exam)/);
    if (questionsMatch && req.method === 'GET') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      const day = parseInt(questionsMatch[1], 10);
      const type = questionsMatch[2];
      const allRows = await getMany('SELECT id, day, type, question, options, answer, explanation FROM questions WHERE day = $1 ORDER BY id', [day]);

      if (type === 'practice') {
        const sessionRows = await getMany('SELECT groupindex, totalquestions, correctcount, score FROM practice_sessions WHERE userid = $1 AND day = $2 ORDER BY groupindex', [user.id, day]);
        const completedGroups = sessionRows.length;
        const startIdx = completedGroups * 10;
        let groupQuestions = allRows.slice(startIdx, startIdx + 10);
        if (groupQuestions.length < 10 && allRows.length > 0) {
          const wrapCount = 10 - groupQuestions.length;
          groupQuestions = [...groupQuestions, ...allRows.slice(0, wrapCount)];
        }
        
        const processedQuestions = groupQuestions.map(q => {
          const options = JSON.parse(q.options);
          const shuffledOptions = shuffleOptions(options, q.id);
          const newAnswerIndex = shuffledOptions.indexOf(options[q.answer]);
          return {
            ...q,
            options: shuffledOptions,
            answer: newAnswerIndex,
          };
        });

        const canStartExam = completedGroups >= 3;
        return sendJson(res, 200, {
          success: true,
          data: processedQuestions,
          meta: {
            groupIndex: completedGroups + 1,
            totalGroups: Math.max(3, Math.ceil(allRows.length / 10)),
            completedGroups: completedGroups,
            canStartExam: canStartExam,
            previousScores: sessionRows.map((r, i) => ({ group: i + 1, score: r.score, correct: r.correctcount, total: r.totalquestions })),
          },
        });
      }

      if (type === 'exam') {
        const sessionRows = await getMany('SELECT groupindex FROM practice_sessions WHERE userid = $1 AND day = $2', [user.id, day]);
        if (sessionRows.length < 3) {
          return sendJson(res, 403, { success: false, message: `至少完成3组练习才能参加考核，当前已完成${sessionRows.length}组` });
        }
        let examRows = allRows.slice(0, 20);
        if (examRows.length < 20) {
          examRows = allRows;
        }
        
        const processedExamRows = examRows.map(q => {
          const options = JSON.parse(q.options);
          const shuffledOptions = shuffleOptions(options, q.id);
          const newAnswerIndex = shuffledOptions.indexOf(options[q.answer]);
          return {
            ...q,
            options: shuffledOptions,
            answer: newAnswerIndex,
          };
        });

        return sendJson(res, 200, {
          success: true,
          data: processedExamRows,
          meta: {
            totalQuestions: processedExamRows.length,
            perQuestionScore: Math.floor(100 / processedExamRows.length),
            passingScore: 60,
          },
        });
      }
    }

    if (path === '/practice' && req.method === 'POST') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      const { day, answers } = req.body || {};
      const d = parseInt(day, 10);

      const sessionRows = await getMany('SELECT groupindex FROM practice_sessions WHERE userid = $1 AND day = $2 ORDER BY groupindex', [user.id, d]);
      const completedGroups = sessionRows.length;
      const startIdx = completedGroups * 10;

      const allQuestions = await getMany("SELECT id, options, answer FROM questions WHERE day = $1 ORDER BY id", [d]);
      let groupQuestions = allQuestions.slice(startIdx, startIdx + 10);
      if (groupQuestions.length < 10 && allQuestions.length > 0) {
        const wrapCount = 10 - groupQuestions.length;
        groupQuestions = [...groupQuestions, ...allQuestions.slice(0, wrapCount)];
      }

      if (groupQuestions.length === 0) {
        return sendJson(res, 400, { success: false, message: '该天暂无练习题' });
      }

      let correct = 0;
      for (const a of answers || []) {
        const q = groupQuestions.find(item => item.id === parseInt(a.questionId));
        if (!q) continue;
        const options = JSON.parse(q.options);
        const shuffledOptions = shuffleOptions(options, q.id);
        const correctAnswerIndex = shuffledOptions.indexOf(options[q.answer]);
        if (correctAnswerIndex === a.answer) correct++;
      }
      const total = groupQuestions.length;
      const score = correct * 10;

      const groupIndex = completedGroups + 1;
      await query('INSERT INTO practice_sessions (userid, day, groupindex, totalquestions, correctcount, score) VALUES ($1, $2, $3, $4, $5, $6)', [user.id, d, groupIndex, total, correct, score]);

      const existing = await getOne('SELECT id FROM learning_records WHERE userid = $1 AND day = $2', [user.id, d]);
      if (existing) {
        await query('UPDATE learning_records SET practicecount = practicecount + 1, practicegroups = practicegroups + 1, updatedat = NOW() WHERE id = $1', [existing.id]);
      } else {
        await query('INSERT INTO learning_records (userid, day, practicecount, practicegroups, examscore, completed) VALUES ($1, $2, 1, 1, 0, 0)', [user.id, d]);
      }

      const newCompletedGroups = groupIndex;
      const canStartExam = newCompletedGroups >= 3;

      return sendJson(res, 200, {
        success: true,
        data: {
          total,
          correct,
          score,
          groupIndex,
          canStartExam,
          hasMoreQuestions: true,
          message: `第${groupIndex}组练习完成，答对 ${correct}/${total} 题，得分 ${score} 分`,
        },
      });
    }

    if (path === '/exam' && req.method === 'POST') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      const { day, answers } = req.body || {};
      const d = parseInt(day, 10);
      const allQuestions = await getMany("SELECT id, options, answer FROM questions WHERE day = $1 ORDER BY id", [d]);
      let examQuestions = allQuestions.slice(0, 20);
      if (examQuestions.length < 20) {
        examQuestions = allQuestions;
      }
      let correct = 0;
      for (const a of answers || []) {
        const q = examQuestions.find(item => item.id === parseInt(a.questionId));
        if (!q) continue;
        const options = JSON.parse(q.options);
        const shuffledOptions = shuffleOptions(options, q.id);
        const correctAnswerIndex = shuffledOptions.indexOf(options[q.answer]);
        if (correctAnswerIndex === a.answer) correct++;
      }
      const total = examQuestions.length;
      const perQ = Math.floor(100 / total);
      const score = correct * perQ;
      const passed = score >= 60;
      const existing = await getOne('SELECT id FROM learning_records WHERE userid = $1 AND day = $2', [user.id, d]);
      if (existing) {
        await query('UPDATE learning_records SET examscore = $1, completed = $2, updatedat = NOW() WHERE id = $3', [score, passed ? 1 : 0, existing.id]);
      } else {
        await query('INSERT INTO learning_records (userid, day, practicecount, practicegroups, examscore, completed) VALUES ($1, $2, 0, 0, $3, $4)', [user.id, d, score, passed ? 1 : 0]);
      }
      return sendJson(res, 200, {
        success: true,
        data: { total, correct, score, passed, message: passed ? `通过考核，得分 ${score} 分` : `未通过，得分 ${score} 分，需要达到 60 分` },
      });
    }

    if (path === '/records/stats/daily' && req.method === 'GET') {
      if (!user || user.role !== 'admin') return sendJson(res, 403, { success: false, message: '无权限' });
      const rows = await getMany('SELECT day, COUNT(*) as user_count, ROUND(AVG(examscore)) as avg_score, SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_count FROM learning_records GROUP BY day ORDER BY day');
      return sendJson(res, 200, { success: true, data: rows });
    }

    if (path === '/records/all' && req.method === 'GET') {
      if (!user || user.role !== 'admin') return sendJson(res, 403, { success: false, message: '无权限' });
      const rows = await getMany('SELECT u.id as userid, u.name, r.day, COALESCE(r.practicecount, 0) as practicecount, COALESCE(r.examscore, 0) as examscore, COALESCE(r.completed, 0) as completed, r.updatedat FROM users u LEFT JOIN learning_records r ON u.id = r.userid ORDER BY u.id, r.day');
      return sendJson(res, 200, { success: true, data: rows });
    }

    if (path === '/records' && req.method === 'GET') {
      if (!user) return sendJson(res, 401, { success: false, message: '未登录' });
      const rows = await getMany('SELECT id, userid, day, practicecount, practicegroups, examscore, completed, updatedat FROM learning_records WHERE userid = $1 ORDER BY day', [user.id]);
      return sendJson(res, 200, { success: true, data: rows });
    }

    sendJson(res, 404, { success: false, message: `API not found: ${path}` });
  } catch (err) {
    console.error('API Error:', err);
    sendJson(res, 500, { success: false, message: '服务器错误: ' + err.message });
  }
};
