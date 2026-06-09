const fs = require('fs');
const path = require('path');

const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'exercise-content.json'), 'utf8'));

// 检查分割结果
const pattern = /第(\d+)题\s*【([^\]]+)】/g;
const blocks = [];
let lastIndex = 0;
let match;
let count = 0;

while ((match = pattern.exec(content.day4)) !== null) {
  console.log('找到第' + match[1] + '题，位置:', match.index);
  if (lastIndex > 0) {
    const block = content.day4.substring(lastIndex, match.index);
    blocks.push(block);
  }
  lastIndex = pattern.lastIndex;
  count++;
  if (count >= 3) break;
}

// 检查第一个块
if (blocks.length > 0) {
  console.log('\n第一个块内容:');
  console.log(blocks[0].substring(0, 200));
  
  // 尝试提取
  const questionMatch = blocks[0].match(/题目[：:]\s*(.+?)(?=选项)/s);
  console.log('\n题目提取结果:', questionMatch ? questionMatch[1] : '未找到');
}
