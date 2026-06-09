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

export const submitExam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { day, answers } = req.body;
    
    if (!userId || !day || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: '参数错误' });
    }
    
    db.all('SELECT * FROM questions WHERE day = ? AND type = "exam"', [day], (err, questions: Question[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      let correctCount = 0;
      const results = answers.map((answer: { questionId: string; answer: number }, index: number) => {
        const question = questions.find(q => q.id.toString() === answer.questionId);
        if (!question) return null;
        
        const userAnswer = answer.answer;
        const isCorrect = userAnswer === question.answer;
        if (isCorrect) correctCount++;
        
        return {
          questionId: question.id.toString(),
          question: question.question,
          userAnswer,
          correctAnswer: question.answer,
          isCorrect,
          explanation: question.explanation,
        };
      }).filter(Boolean);
      
      const score = Math.round((correctCount / questions.length) * 100);
      const completed = score >= 60 ? 1 : 0;
      
      db.get('SELECT * FROM learning_records WHERE userId = ? AND day = ?', [userId, day], (err, row) => {
        if (err) {
          return res.status(500).json({ success: false, message: '数据库错误' });
        }
        
        if (row) {
          db.run(
            'UPDATE learning_records SET examScore = ?, completed = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ? AND day = ?',
            [score, completed, userId, day],
            () => {
              res.json({
                success: true,
                data: {
                  day,
                  score,
                  totalQuestions: questions.length,
                  correctCount,
                  completed: completed === 1,
                  results,
                },
              });
            }
          );
        } else {
          db.run(
            'INSERT INTO learning_records (userId, day, examScore, completed) VALUES (?, ?, ?, ?)',
            [userId, day, score, completed],
            () => {
              res.json({
                success: true,
                data: {
                  day,
                  score,
                  totalQuestions: questions.length,
                  correctCount,
                  completed: completed === 1,
                  results,
                },
              });
            }
          );
        }
      });
    });
  } catch (error) {
    console.error('提交考试失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};