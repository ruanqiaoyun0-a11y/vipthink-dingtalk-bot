const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');
const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'exercise-content.json'), 'utf8'));

// 解析 DAY4 - 处理 "选项： - A. xxx - B. xxx - C. xxx - D. xxx" 格式
function parseDay4(text) {
  const questions = [];
  
  // 找到所有 "第X题" 的位置
  const pattern = /第(\d+)题/g;
  const positions = [];
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    positions.push(match.index);
  }
  
  // 提取每道题
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i < positions.length - 1 ? positions[i + 1] : text.length;
    const block = text.substring(start, end);
    
    if (block.length < 50) continue;
    
    // 提取题目内容 - 支持 "题目：" 和 "题目：" 格式
    let question = '';
    const questionMatch = block.match(/题目[：:]\s*(.+?)(?=选项)/s);
    if (questionMatch) {
      question = questionMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }
    
    // 提取选项 - 处理 "选项： - A. xxx - B. xxx - C. xxx - D. xxx" 格式
    const options = [];
    const optionsMatch = block.match(/选项[：:]\s*([\s\S]*?)(?=正确答案)/);
    if (optionsMatch) {
      const optText = optionsMatch[1];
      // 分割选项：按 " - A." " - B." " - C." " - D." 分割
      const optParts = optText.split(/\s*-\s*[A-D]\.\s*/);
      for (const part of optParts) {
        const cleaned = part.trim().replace(/^[A-D][.、)]\s*/, '').trim();
        if (cleaned && cleaned.length > 0 && cleaned.length < 300) {
          options.push(cleaned);
        }
      }
    }
    
    // 找正确答案
    let answer = 1;
    const answerMatch = block.match(/正确答案[：:]\s*([A-D])/i);
    if (answerMatch) {
      answer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
    }
    
    // 提取解析
    let explanation = '';
    const explainMatch = block.match(/解析[：:]\s*([\s\S]*?)$/);
    if (explainMatch) {
      explanation = explainMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 500);
    }
    
    if (question && options.length >= 4) {
      questions.push({
        question: question,
        options: options.slice(0, 4),
        answer: answer >= 0 && answer <= 3 ? answer : 1,
        explanation: explanation || '无'
      });
    }
  }
  
  return questions;
}

function importQuestions(questions, day, type) {
  return new Promise(function(resolve, reject) {
    var db = new sqlite3.Database(dbPath);
    db.run('DELETE FROM questions WHERE day = ? AND type = ?', [day, type], function(err) {
      if (err) {
        reject(err);
        return;
      }
      var count = 0;
      var stmt = db.prepare('INSERT INTO questions (day, type, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?, ?)');
      for (var j = 0; j < questions.length; j++) {
        var q = questions[j];
        stmt.run([day, type, q.question, JSON.stringify(q.options), q.answer, q.explanation], function(err2) {
          if (!err2) count++;
        });
      }
      stmt.finalize(function() {
        console.log('已导入 DAY' + day + ' 共 ' + count + ' 道题目');
        db.close();
        resolve(count);
      });
    });
  });
}

async function main() {
  console.log('解析 DAY4...\n');
  var day4Questions = parseDay4(content.day4);
  console.log('DAY4 解析出 ' + day4Questions.length + ' 道题目');
  
  if (day4Questions.length > 0) {
    console.log('\n========== DAY4 预览 ==========');
    for (var k = 0; k < Math.min(5, day4Questions.length); k++) {
      var q2 = day4Questions[k];
      console.log((k + 1) + '. ' + q2.question.substring(0, 60) + '...');
      console.log('   答案: ' + String.fromCharCode(65 + q2.answer));
    }
    await importQuestions(day4Questions, 4, 'practice');
  }
  
  // 最终统计
  var db2 = new sqlite3.Database(dbPath);
  db2.all('SELECT day, COUNT(*) as count FROM questions WHERE type = "practice" GROUP BY day', [], function(err, rows) {
    console.log('\n========== 最终题库统计 ==========');
    if (rows) {
      var total = 0;
      for (var r = 0; r < rows.length; r++) {
        console.log('DAY' + rows[r].day + ': ' + rows[r].count + ' 题');
        total += rows[r].count;
      }
      console.log('总计: ' + total + ' 题');
    }
    db2.close();
  });
}

main().catch(console.error);
