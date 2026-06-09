const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all('SELECT day, type, question, options, answer, explanation FROM questions ORDER BY day, type', [], (err, rows) => {
  if (err) {
    console.error('查询失败:', err);
    process.exit(1);
  }
  
  const dayNames = { 1: 'DAY1-产品介绍', 2: 'DAY2-电销话术', 3: 'DAY3-跟进与异议处理', 4: 'DAY4-综合应用' };
  
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>VIP THINK培训题库</title>
<style>
  body { font-family: '微软雅黑', Arial, sans-serif; margin: 40px; }
  h1 { text-align: center; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
  h2 { color: #059669; margin-top: 40px; border-left: 4px solid #10b981; padding-left: 10px; }
  h3 { color: #047857; margin-top: 20px; }
  .question { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 15px 0; }
  .question-text { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
  .options { margin-left: 20px; line-height: 1.8; }
  .answer { color: #10b981; font-weight: bold; margin-top: 10px; }
  .explanation { color: #666; font-size: 14px; margin-top: 5px; font-style: italic; }
  .header { text-align: center; margin-bottom: 30px; }
  .stats { text-align: center; color: #666; margin-bottom: 30px; }
</style>
</head>
<body>
<div class="header">
  <h1>VIP THINK 培训练习系统题库</h1>
  <p class="stats">共 ${rows.length} 道练习题</p>
</div>
`;

  // 按 DAY 分组
  const byDay = {};
  rows.forEach(q => {
    if (!byDay[q.day]) byDay[q.day] = [];
    byDay[q.day].push(q);
  });
  
  [1, 2, 3, 4].forEach(day => {
    const questions = byDay[day] || [];
    html += `<h2>${dayNames[day]}（共${questions.length}题）</h2>\n`;
    
    questions.forEach((q, idx) => {
      const opts = JSON.parse(q.options);
      const optionLabels = ['A', 'B', 'C', 'D'];
      
      html += `<div class="question">
  <div class="question-text">${idx + 1}. ${q.question}</div>
  <div class="options">
    ${opts.map((opt, i) => `<div>${optionLabels[i]}. ${opt}</div>`).join('\n    ')}
  </div>
  <div class="answer">正确答案：${optionLabels[q.answer]}</div>
  <div class="explanation">解析：${q.explanation}</div>
</div>\n`;
    });
  });

  html += `</body></html>`;

  const outputPath = path.join(__dirname, '..', 'VIPTHINK题库导出.html');
  fs.writeFileSync(outputPath, '\ufeff' + html, 'utf8'); // \ufeff for BOM
  console.log(`题库已导出到: ${outputPath}`);
  
  db.close();
});
