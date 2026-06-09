const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbPath = 'C:\\Users\\PC\\Desktop\\产品培训助手\\backend\\database.sqlite';
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath);

db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
  if (err) {
    console.error('数据库错误:', err);
    return;
  }
  
  console.log('数据库中的表:', tables);
  
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('查询用户错误:', err);
      return;
    }
    
    console.log('数据库中的用户:');
    rows.forEach(user => {
      console.log(`  - ${user.name}, role: ${user.role}, phone: ${user.phone}`);
      console.log(`    密码哈希: ${user.password}`);
    });
    
    if (rows.length > 0) {
      const testPassword = 'hltn1234';
      bcrypt.compare(testPassword, rows[0].password).then(isValid => {
        console.log(`  ${rows[0].name} 密码验证: ${isValid}`);
        db.close();
      });
    } else {
      console.log('没有找到用户！');
      db.close();
    }
  });
});
