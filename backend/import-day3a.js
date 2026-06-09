const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');

// 读取文件内容
const text = fs.readFileSync(path.join(__dirname, '..', 'DAY1-DAY4联系题目合集', 'DAY3_练习题①.txt'), 'utf8');

// 解析 DAY3_练习题① - 处理 "【第N题】题目\n  A. xxx\n  B. xxx\n  ✅ 正确答案：X\n  📖 解析：xxx" 格式
function parseDay3a(text) {
  const questions = [];

  // 找到所有 "【第X题】" 的位置
  const pattern = /【第(\d+)题】/g;
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

    // 提取题目内容 - 匹配 "【第N题】N. 题目内容?" 格式
    let question = '';
    // 先移除题号前缀
    let cleanedBlock = block.replace(/【第\d+题】\s*\d+\.\s*/, '');
    // 提取题目到选项前
    const questionMatch = cleanedBlock.match(/^([\s\S]*?)(?=\n\s+[A-D][\.、)])/);
    if (questionMatch) {
      question = questionMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }

    // 提取选项 - 匹配 "  A. xxx" "  B. xxx" 等格式
    const options = [];
    const optMatches = cleanedBlock.match(/\n\s+[A-D][\.、)]\s*[\s\S]*?(?=\n\s+[A-D][\.、)]|✅|📖|$)/g);
    if (optMatches) {
      for (const opt of optMatches) {
        const optClean = opt.replace(/^\n\s+[A-D][\.、)]\s*/, '').trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
        if (optClean && optClean.length > 0 && optClean.length < 500) {
          options.push(optClean);
        }
      }
    }

    // 找正确答案 - 匹配 "✅ 正确答案：X"
    let answer = 1;
    const answerMatch = block.match(/✅\s*正确答案[：:]\s*([A-D])/i);
    if (answerMatch) {
      answer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
    }

    // 提取解析 - 匹配 "📖 解析：xxx"
    let explanation = '';
    const explainMatch = block.match(/📖\s*解析[：:]\s*([\s\S]*?)$/);
    if (explainMatch) {
      explanation = explainMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/-+$/,'').trim().substring(0, 500);
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
    var count = 0;
    var stmt = db.prepare('INSERT INTO questions (day, type, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?, ?)');
    for (var j = 0; j < questions.length; j++) {
      var q = questions[j];
      stmt.run([day, type, q.question, JSON.stringify(q.options), q.answer, q.explanation], function(err2) {
        if (!err2) count++;
      });
    }
    stmt.finalize(function() {
      console.log('已导入 DAY' + day + ' 新增 ' + count + ' 道题目');
      db.close();
      resolve(count);
    });
  });
}

async function main() {
  console.log('解析 DAY3_练习题①...\n');
  var questions = parseDay3a(text);
  console.log('DAY3_练习题① 解析出 ' + questions.length + ' 道题目\n');

  if (questions.length > 0) {
    console.log('========== 预览 ==========');
    for (var k = 0; k < Math.min(5, questions.length); k++) {
      var q = questions[k];
      console.log((k + 1) + '. ' + q.question.substring(0, 80) + '...');
      console.log('   答案: ' + String.fromCharCode(65 + q.answer));
      console.log('   选项数: ' + q.options.length);
    }
    await importQuestions(questions, 3, 'practice');
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
