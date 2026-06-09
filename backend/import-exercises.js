const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');
const mammoth = require('mammoth');

const dbPath = path.join(__dirname, 'database.sqlite');
const baseDir = path.join('C:', 'Users', 'PC', 'Desktop', '产品培训助手', 'DAY1-DAY4联系题目合集');

// 读取 xlsx 文件
function readXlsx(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    let rows = [];
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const lines = csv.split('\n');
      rows = rows.concat(lines);
    });
    return rows.join('\n');
  } catch(e) {
    console.error('读取 xlsx 失败:', filePath, e.message);
    return '';
  }
}

// 读取 docx 文件
async function readDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch(e) {
    console.error('读取 docx 失败:', filePath, e.message);
    return '';
  }
}

// 解析 DAY1 (xlsx - CSV格式)
function parseDay1(text) {
  const questions = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // 跳过表头
    if (line.includes('题目编号') || line.includes('知识点')) continue;
    if (!line.trim()) continue;
    
    // 解析 CSV
    const cols = line.split(',');
    if (cols.length >= 10) {
      const question = cols[2].trim(); // 题目内容
      const optA = cols[4].trim();
      const optB = cols[5].trim();
      const optC = cols[6].trim();
      const optD = cols[7].trim();
      const answer = cols[8].trim().toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      const explanation = cols[9].trim();
      
      if (question && optA && optB && optC && optD) {
        questions.push({
          question,
          options: [optA, optB, optC, optD],
          answer: typeof answer === 'number' && answer >= 0 && answer <= 3 ? answer : 1,
          explanation: explanation.substring(0, 500)
        });
      }
    }
  }
  return questions;
}

// 解析 DAY2/DAY3b/DAY4 (docx 格式)
function parseDocx(text, day) {
  const questions = [];
  
  // 分割每个题目
  const blocks = text.split(/第\d+题|──────────────────────────────────────────────────/);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // 提取题目内容
    let questionMatch = block.match(/[【【]?[题题]*[】】]?\s*(.+?)(?=\s*(?:选项|[A-D][.、)]\s|\n))/s);
    let questionText = questionMatch ? questionMatch[1].trim() : '';
    
    // 清理题目文本
    questionText = questionText.replace(/【.*?】/g, '').replace(/\n/g, ' ').trim();
    questionText = questionText.replace(/^话术[转换]?[:：]/, '').trim();
    
    // 提取选项
    const options = [];
    const optMatches = block.match(/[A-D][.、)]\s*([^\n]+)/g);
    if (optMatches) {
      for (const opt of optMatches) {
        const optText = opt.replace(/^[A-D][.、)]\s*/, '').trim();
        if (optText && optText.length > 0 && optText.length < 200) {
          options.push(optText);
        }
      }
    }
    
    // 提取正确答案
    let answer = 1;
    const answerMatch = block.match(/正确答案[：:]\s*([A-D])/i);
    if (answerMatch) {
      answer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
    }
    
    // 提取解析
    let explanation = '';
    const explainMatch = block.match(/解析[：:]\s*(.+?)(?=【|\n$|$)/s);
    if (explainMatch) {
      explanation = explainMatch[1].trim().substring(0, 500);
    }
    
    // 如果用话术格式的解析
    if (!explanation) {
      const huashuMatch = block.match(/话术[：:]\s*(.+?)(?=\[|$)/s);
      if (huashuMatch) {
        explanation = huashuMatch[1].trim().substring(0, 500);
      }
    }
    
    // 只有有效的题目才添加
    if (questionText && options.length >= 4) {
      questions.push({
        question: questionText,
        options: options.slice(0, 4),
        answer: answer >= 0 && answer <= 3 ? answer : 1,
        explanation: explanation || '无'
      });
    }
  }
  
  return questions;
}

// 导入题目到数据库
function importQuestions(questions, day, type = 'practice') {
  const db = new sqlite3.Database(dbPath);
  
  // 先删除该天的题目
  db.run(`DELETE FROM questions WHERE day = ? AND type = ?`, [day, type], function(err) {
    if (err) {
      console.error(`删除 DAY${day} 题目失败:`, err.message);
      return;
    }
    console.log(`已删除 DAY${day} 原题目`);
    
    // 插入新题目
    const stmt = db.prepare(`INSERT INTO questions (day, type, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?, ?)`);
    
    let count = 0;
    for (const q of questions) {
      stmt.run([day, type, q.question, JSON.stringify(q.options), q.answer, q.explanation], function(err) {
        if (err) {
          console.error(`插入题目失败:`, err.message);
        } else {
          count++;
        }
      });
    }
    
    stmt.finalize(() => {
      console.log(`已导入 DAY${day} 共 ${count} 道题目`);
      db.close();
    });
  });
}

// 主函数
async function main() {
  console.log('开始读取练习题...\n');
  
  // DAY1
  console.log('1. 读取 DAY1 (xlsx)...');
  const day1Text = readXlsx(path.join(baseDir, 'VIPThink第一天培训练习题.xlsx'));
  const day1Questions = parseDay1(day1Text);
  console.log(`   DAY1 解析出 ${day1Questions.length} 道题目`);
  
  // DAY2
  console.log('2. 读取 DAY2 (docx)...');
  const day2Text = await readDocx(path.join(baseDir, 'DAY2_练习题①.docx'));
  const day2Questions = parseDocx(day2Text, 2);
  console.log(`   DAY2 解析出 ${day2Questions.length} 道题目`);
  
  // DAY3 (两个文件合并)
  console.log('3. 读取 DAY3 (两个docx)...');
  const day3aText = await readDocx(path.join(baseDir, 'DAY3_练习题①.docx'));
  const day3bText = await readDocx(path.join(baseDir, 'DAY3_练习题②.docx'));
  let day3Questions = parseDocx(day3bText, 3);
  console.log(`   DAY3b 解析出 ${day3Questions.length} 道题目`);
  
  // DAY4
  console.log('4. 读取 DAY4 (docx)...');
  const day4Text = await readDocx(path.join(baseDir, 'DAY4_练习题.docx'));
  const day4Questions = parseDocx(day4Text, 4);
  console.log(`   DAY4 解析出 ${day4Questions.length} 道题目`);
  
  // 保存解析结果
  const allQuestions = {
    day1: day1Questions,
    day2: day2Questions,
    day3: day3Questions,
    day4: day4Questions
  };
  fs.writeFileSync(path.join(__dirname, 'parsed-questions.json'), JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log('\n解析结果已保存到 parsed-questions.json');
  
  // 显示部分题目预览
  console.log('\n========== DAY1 题目预览 ==========');
  day1Questions.slice(0, 3).forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    console.log(`   选项: ${q.options.join(' | ')}`);
    console.log(`   答案: ${String.fromCharCode(65 + q.answer)}`);
  });
  
  console.log('\n========== DAY2 题目预览 ==========');
  day2Questions.slice(0, 3).forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    console.log(`   选项: ${q.options.join(' | ')}`);
    console.log(`   答案: ${String.fromCharCode(65 + q.answer)}`);
  });
  
  // 确认后导入
  console.log('\n===========================================');
  console.log('题目统计:');
  console.log(`  DAY1: ${day1Questions.length} 题`);
  console.log(`  DAY2: ${day2Questions.length} 题`);
  console.log(`  DAY3: ${day3Questions.length} 题`);
  console.log(`  DAY4: ${day4Questions.length} 题`);
  console.log(`  总计: ${day1Questions.length + day2Questions.length + day3Questions.length + day4Questions.length} 题`);
  console.log('===========================================');
  console.log('\n继续运行将导入数据库...');
  
  // 自动导入
  setTimeout(() => {
    console.log('\n开始导入数据库...\n');
    importQuestions(day1Questions, 1);
    setTimeout(() => importQuestions(day2Questions, 2), 500);
    setTimeout(() => importQuestions(day3Questions, 3), 1000);
    setTimeout(() => importQuestions(day4Questions, 4), 1500);
  }, 1000);
}

main().catch(console.error);
