import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { generateQuestions } from './generate-questions';

const dbPath = 'C:\\Users\\PC\\Desktop\\产品培训助手\\backend\\database.sqlite';
const db = new sqlite3.Database(dbPath);

const initData = async () => {
  try {
    console.log('正在连接到数据库:', dbPath);
    console.log('正在初始化数据...');

    const hashedPassword = await bcrypt.hash('hltn1234', 10);
    console.log('密码哈希生成成功');

    db.serialize(async () => {
      db.run('DELETE FROM users');
      db.run('DELETE FROM knowledge_points');
      db.run('DELETE FROM questions');
      db.run('DELETE FROM learning_records');

      console.log('创建管理员账户...');
      db.run('INSERT INTO users (name, password, role) VALUES (?, ?, ?)', ['管理员', hashedPassword, 'admin']);

      console.log('创建学员账户...');
      db.run('INSERT INTO users (name, password, role) VALUES (?, ?, ?)', ['张三', hashedPassword, 'student']);
      db.run('INSERT INTO users (name, password, role) VALUES (?, ?, ?)', ['李四', hashedPassword, 'student']);
      db.run('INSERT INTO users (name, password, role) VALUES (?, ?, ?)', ['王五', hashedPassword, 'student']);

      console.log('创建知识点...');
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [1, '产品介绍', 'VIPthink 是专为儿童设计的思维训练课程，通过趣味性的题目提升孩子的逻辑思维能力。', 1]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [1, '沟通技巧', '学员沟通时要先建立信任感，从孩子的兴趣点出发，引导家长了解课程价值。', 2]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [2, '异议处理', '当家长提出价格贵的问题时，不要直接反驳，而是强调课程的长期价值和学习效果。', 1]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [2, '预约方法', '预约试听课时要明确时间、地点，并在结束后及时跟进反馈。', 2]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [3, '跟进技巧', '试听课后24小时内进行首次跟进，询问学习感受，针对反馈给出建议。', 1]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [3, '签约流程', '签约时详细说明课程内容、学习计划、服务承诺，确保家长理解并满意。', 2]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [4, '客户维护', '保持定期联系，分享学习进展，成为家长的教育顾问，建立长期关系。', 1]);
      db.run('INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)', [4, '转介绍', '通过提供优质服务，引导老学员推荐新学员，给予适当奖励。', 2]);

      // 生成练习题
      console.log('生成练习题...');
      await generateQuestions();

      console.log('');
      console.log('✅ 数据初始化成功！');
      console.log('');
      console.log('📝 账户信息：');
      console.log('   管理员：姓名="管理员"，密码="hltn1234"');
      console.log('   学员：姓名="张三"/"李四"/"王五"，密码="hltn1234"');
      console.log('');

      db.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('数据初始化失败:', error);
    process.exit(1);
  }
};

initData();