const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const sqlitePath = path.join(__dirname, 'database.sqlite');

async function exportToPostgres() {
  console.log('从 SQLite 读取题库数据...');

  const sqliteDb = new sqlite3.Database(sqlitePath);

  const questions = await new Promise((resolve, reject) => {
    sqliteDb.all('SELECT day, type, question, options, answer, explanation FROM questions ORDER BY day, type, id', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  sqliteDb.close();

  console.log(`共读取 ${questions.length} 道题目`);

  const escape = (s) => {
    if (s === null || s === undefined) return '';
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "''");
  };

  let sql = '-- VIPTHINK 培训系统 - 题库初始化\n';
  sql += '-- 从 SQLite 导出到 Postgres\n';
  sql += `-- 导出时间: ${new Date().toISOString()}\n\n`;

  sql += '-- 确保表存在\n';
  sql += `CREATE TABLE IF NOT EXISTS questions (\n`;
  sql += `  id SERIAL PRIMARY KEY,\n`;
  sql += `  day INTEGER NOT NULL,\n`;
  sql += `  type VARCHAR(20) NOT NULL,\n`;
  sql += `  question TEXT NOT NULL,\n`;
  sql += `  options TEXT NOT NULL,\n`;
  sql += `  answer INTEGER NOT NULL,\n`;
  sql += `  explanation TEXT NOT NULL\n`;
  sql += `);\n\n`;

  sql += 'BEGIN;\n\n';
  sql += 'TRUNCATE TABLE questions RESTART IDENTITY CASCADE;\n\n';
  sql += 'INSERT INTO questions (day, type, question, options, answer, explanation) VALUES\n';

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const isLast = i === questions.length - 1;
    sql += `  (${q.day}, '${q.type}', '${escape(q.question)}', '${escape(q.options)}', ${q.answer}, '${escape(q.explanation)}')${isLast ? ';' : ','}\n`;
  }

  sql += '\nCOMMIT;\n';
  sql += `\n-- 总计: ${questions.length} 道题目\n`;

  const outputPath = path.join(__dirname, '..', 'scripts', 'seed-questions.sql');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`\nSQL 文件已生成: ${outputPath}`);
  console.log(`\n请在 Vercel Postgres 中执行这个 SQL 文件来导入题库。`);
}

exportToPostgres().catch(console.error);
