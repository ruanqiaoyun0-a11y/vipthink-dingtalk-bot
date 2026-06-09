const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

const baseDir = path.join('C:', 'Users', 'PC', 'Desktop', '产品培训助手', 'DAY1-DAY4联系题目合集');

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

// 读取 xlsx 文件
function readXlsx(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      text += XLSX.utils.sheet_to_csv(sheet);
    });
    return text;
  } catch(e) {
    console.error('读取 xlsx 失败:', filePath, e.message);
    return '';
  }
}

// 解析题目
function parseQuestions(text, day) {
  const questions = [];
  // 简单的行分割
  const lines = text.split(/\n|\\n/).filter(l => l.trim());
  
  let currentQuestion = null;
  let currentOptions = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // 跳过标题行和分隔符
    if (trimmed.startsWith('=') || trimmed.includes('VIPThink') || 
        trimmed.includes('练习题') || trimmed.includes('DAY') || 
        trimmed.includes('第一天') || trimmed === '题目' ||
        trimmed.includes('题号') || trimmed.includes('答案') ||
        trimmed.includes('序号')) {
      continue;
    }
    
    // 简单匹配：选项 A. B. C. D.
    const optionMatch = trimmed.match(/^[A-D][.、)]\s*(.+)/i);
    if (optionMatch && currentQuestion) {
      currentOptions.push(optionMatch[1].trim());
      continue;
    }
    
    // 如果已经有题目和选项，可能是一个新题目
    if (currentQuestion && currentOptions.length >= 2 && !optionMatch) {
      // 保存当前题目
      if (currentOptions.length >= 2) {
        questions.push({
          day,
          question: currentQuestion,
          options: currentOptions,
          answer: 0, // 待确定
          explanation: ''
        });
      }
      currentQuestion = null;
      currentOptions = [];
    }
    
    // 如果没有选项，可能是题目内容
    if (!optionMatch && trimmed.length > 10 && trimmed.length < 500) {
      currentQuestion = trimmed;
      currentOptions = [];
    }
  }
  
  // 保存最后一个题目
  if (currentQuestion && currentOptions.length >= 2) {
    questions.push({
      day,
      question: currentQuestion,
      options: currentOptions,
      answer: 0,
      explanation: ''
    });
  }
  
  return questions;
}

// 主函数
async function main() {
  console.log('开始读取练习题文件...\n');
  
  // DAY1
  console.log('读取 DAY1 (xlsx)...');
  const day1Text = readXlsx(path.join(baseDir, 'VIPThink第一天培训练习题.xlsx'));
  console.log('DAY1 内容长度:', day1Text.length);
  console.log('DAY1 前500字符:', day1Text.substring(0, 500));
  
  // DAY2
  console.log('\n读取 DAY2 (docx)...');
  const day2Text = await readDocx(path.join(baseDir, 'DAY2_练习题①.docx'));
  console.log('DAY2 内容长度:', day2Text.length);
  console.log('DAY2 前500字符:', day2Text.substring(0, 500));
  
  // DAY3 (两个文件)
  console.log('\n读取 DAY3a (docx)...');
  const day3aText = await readDocx(path.join(baseDir, 'DAY3_练习题①.docx'));
  console.log('DAY3a 内容长度:', day3aText.length);
  console.log('DAY3a 前500字符:', day3aText.substring(0, 500));
  
  console.log('\n读取 DAY3b (docx)...');
  const day3bText = await readDocx(path.join(baseDir, 'DAY3_练习题②.docx'));
  console.log('DAY3b 内容长度:', day3bText.length);
  console.log('DAY3b 前500字符:', day3bText.substring(0, 500));
  
  // DAY4
  console.log('\n读取 DAY4 (docx)...');
  const day4Text = await readDocx(path.join(baseDir, 'DAY4_练习题.docx'));
  console.log('DAY4 内容长度:', day4Text.length);
  console.log('DAY4 前500字符:', day4Text.substring(0, 500));
  
  // 保存完整内容到文件供后续分析
  const allContent = {
    day1: day1Text,
    day2: day2Text,
    day3a: day3aText,
    day3b: day3bText,
    day4: day4Text
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'exercise-content.json'),
    JSON.stringify(allContent, null, 2),
    'utf8'
  );
  console.log('\n内容已保存到 exercise-content.json');
}

main().catch(console.error);
