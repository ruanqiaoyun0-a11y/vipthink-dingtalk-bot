import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

interface Question {
  id: number;
  day: number;
  type: string;
  question: string;
  options: string;
  answer: number;
  explanation: string;
}

// Fisher-Yates 洗牌算法
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getQuestionsByDayAndType = async (req: AuthRequest, res: Response) => {
  try {
    const day = parseInt(req.params.day);
    const type = req.params.type as 'practice' | 'exam';
    
    if (isNaN(day) || (type !== 'practice' && type !== 'exam')) {
      return res.status(400).json({ success: false, message: '无效的参数' });
    }
    
    db.all('SELECT * FROM questions WHERE day = ? AND type = ?', [day, type], (err, rows: Question[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      // 如果是练习题，随机抽取5道
      let selectedRows = rows;
      if (type === 'practice' && rows.length > 5) {
        selectedRows = shuffleArray(rows).slice(0, 5);
      }
      
      res.json({
        success: true,
        data: selectedRows.map(q => ({
          id: q.id.toString(),
          day: q.day,
          type: q.type,
          question: q.question,
          options: JSON.parse(q.options),
          answer: q.answer,
          explanation: q.explanation,
        })),
      });
    });
  } catch (error) {
    console.error('获取题目失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { day, type, question, options, answer, explanation } = req.body;
    
    if (!day || !type || !question || !options || answer === undefined || !explanation) {
      return res.status(400).json({ success: false, message: '请填写完整信息' });
    }
    
    const optionsJson = JSON.stringify(options);
    
    db.run(
      'INSERT INTO questions (day, type, question, options, answer, explanation) VALUES (?, ?, ?, ?, ?, ?)',
      [day, type, question, optionsJson, answer, explanation],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: '数据库错误' });
        }
        
        res.json({
          success: true,
          data: {
            id: this.lastID.toString(),
            day,
            type,
            question,
            options: JSON.parse(optionsJson),
            answer,
            explanation,
          },
        });
      }
    );
  } catch (error) {
    console.error('创建题目失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};