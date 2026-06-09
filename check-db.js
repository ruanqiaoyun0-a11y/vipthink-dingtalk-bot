const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'backend/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all('SELECT * FROM users', (err, rows) => {
  if (err) {
    console.error('数据库错误:', err);
    return;
  }
  
  console.log('数据库中的用户:');
  rows.forEach(user => {
    console.log(`  - ${user.name}, role: ${user.role}, phone: ${user.phone}`);
    console.log(`    密码哈希: ${user.password}`);
  });
  
  // 测试密码验证
  const testPassword = 'hltn1234';
  rows.forEach(async (user) => {
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`  ${user.name} 密码验证: ${isValid}`);
  });
  
  db.close();
});
