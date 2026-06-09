import schedule from 'node-schedule';
import axios from 'axios';
import db from '../db';

const DINGTALK_WEBHOOK = process.env.DINGTALK_WEBHOOK || '';
const DINGTALK_SECRET = process.env.DINGTALK_SECRET || '';

const generateReport = async (): Promise<string> => {
  return new Promise((resolve) => {
    db.all(`
      SELECT 
        u.name,
        SUM(r.practiceCount) as totalPracticeCount,
        AVG(r.examScore) as avgExamScore,
        SUM(CASE WHEN r.completed = 1 THEN 1 ELSE 0 END) as completedDays
      FROM learning_records r
      RIGHT JOIN users u ON r.userId = u.id AND u.role = 'student'
      GROUP BY u.id, u.name
    `, (err, rows: any[]) => {
      if (err || !rows.length) {
        resolve('今日暂无学习数据');
        return;
      }
      
      let report = `📊 VIPthink培训日报\n\n`;
      report += `今日学习统计：\n`;
      report += `学员总数：${rows.length}人\n\n`;
      report += `学习详情：\n`;
      
      rows.forEach((row: any) => {
        report += `• ${row.name}：练习${row.totalPracticeCount || 0}次，平均成绩${Math.round(row.avgExamScore) || 0}分，完成${row.completedDays || 0}天考核\n`;
      });
      
      resolve(report);
    });
  });
};

const sendDingTalkMessage = async (message: string) => {
  if (!DINGTALK_WEBHOOK) {
    console.log('钉钉Webhook未配置，跳过消息发送');
    console.log(message);
    return;
  }
  
  try {
    await axios.post(DINGTALK_WEBHOOK, {
      msgtype: 'text',
      text: {
        content: message,
      },
    });
    console.log('钉钉消息发送成功');
  } catch (error) {
    console.error('钉钉消息发送失败:', error);
  }
};

schedule.scheduleJob('30 21 * * *', async () => {
  console.log('执行每日学习报告任务...');
  const report = await generateReport();
  await sendDingTalkMessage(report);
});

export const sendDailyReport = async () => {
  const report = await generateReport();
  await sendDingTalkMessage(report);
  return report;
};