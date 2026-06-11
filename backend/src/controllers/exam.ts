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

    db.all('SELECT * FROM questions WHERE day = ? ORDER BY id', [day], (err, allQuestions: Question[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }

      let examQuestions = allQuestions.slice(0, 20);
      if (examQuestions.length < 20) {
        examQuestions = allQuestions;
      }

      let correctCount = 0;
      const results = answers.map((answer: { questionId: string; answer: number }) => {
        const question = examQuestions.find(q => q.id.toString() === answer.questionId);
        if (!question) return null;
        const userAnswer = answer.answer;
        const isCorrect = userAnswer === question.answer;
        if (isCorrect) correctCount++;
        return {
          questionId: question.id.toString(),
          userAnswer,
          correctAnswer: question.answer,
          isCorrect,
        };
      }).filter(Boolean);

      const total = examQuestions.length;
      const perQ = Math.floor(100 / total);
      const score = correctCount * perQ;
      const passed = score >= 60;

      db.get('SELECT * FROM learning_records WHERE userId = ? AND day = ?', [userId, day], (lerr, row) => {
        if (lerr) {
          return res.status(500).json({ success: false, message: '数据库错误' });
        }
        if (row) {
          db.run(
            'UPDATE learning_records SET examScore = ?, completed = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ? AND day = ?',
            [score, passed ? 1 : 0, userId, day]
          );
        } else {
          db.run(
            'INSERT INTO learning_records (userId, day, practiceCount, practiceGroups, examScore, completed) VALUES (?, ?, 0, 0, ?, ?)',
            [userId, day, score, passed ? 1 : 0]
          );
        }
        res.json({
          success: true,
          data: {
            total,
            correct: correctCount,
            score,
            passed,
            results: results,
            message: passed ? `通过考核，得分 ${score} 分` : `未通过，得分 ${score} 分，需要达到 60 分`,
          },
        });
      });
    });
  } catch (error) {
    console.error('提交考试失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};
