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

export const submitPractice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { day, answers } = req.body;

    console.log('收到练习提交请求:', { userId, day, answersCount: answers?.length });

    if (!userId || !day || !answers || !Array.isArray(answers)) {
      console.log('参数验证失败:', { userId, day, answers: answers?.length });
      return res.status(400).json({ success: false, message: '参数错误' });
    }

    db.all('SELECT groupIndex FROM practice_sessions WHERE userId = ? AND day = ? ORDER BY groupIndex', [userId, day], (sessionErr, sessionRows: any[]) => {
      if (sessionErr) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      const completedGroups = sessionRows.length;
      const startIdx = completedGroups * 10;

      db.all('SELECT * FROM questions WHERE day = ? ORDER BY id', [day], (err, allQuestions: Question[]) => {
        if (err) {
          return res.status(500).json({ success: false, message: '数据库错误' });
        }

        let groupQuestions = allQuestions.slice(startIdx, startIdx + 10);
        if (groupQuestions.length < 10 && allQuestions.length > 0) {
          const wrapCount = 10 - groupQuestions.length;
          groupQuestions = [...groupQuestions, ...allQuestions.slice(0, wrapCount)];
        }

        if (groupQuestions.length === 0) {
          return res.status(400).json({ success: false, message: '该天暂无练习题' });
        }

        let correctCount = 0;
        const results = answers.map((answer: { questionId: string; answer: number }) => {
          const question = groupQuestions.find(q => q.id.toString() === answer.questionId);
          if (!question) return null;

          const userAnswerIndex = answer.answer;
          const correctAnswerIndex = question.answer;
          const isCorrect = userAnswerIndex === correctAnswerIndex;

          if (isCorrect) correctCount++;
          return {
            questionId: question.id.toString(),
            userAnswer: userAnswerIndex,
            correctAnswer: correctAnswerIndex,
            isCorrect,
          };
        }).filter(Boolean);

        const total = groupQuestions.length;
        const score = correctCount * 10;
        const groupIndex = completedGroups + 1;

        db.run(
          'INSERT INTO practice_sessions (userId, day, groupIndex, totalQuestions, correctCount, score) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, day, groupIndex, total, correctCount, score]
        );

        db.get('SELECT * FROM learning_records WHERE userId = ? AND day = ?', [userId, day], (lerr, row) => {
          if (lerr) {
            return res.status(500).json({ success: false, message: '数据库错误' });
          }
          if (row) {
            db.run('UPDATE learning_records SET practiceCount = practiceCount + 1, practiceGroups = COALESCE(practiceGroups, 0) + 1, updatedAt = CURRENT_TIMESTAMP WHERE userId = ? AND day = ?',
              [userId, day]);
          } else {
            db.run('INSERT INTO learning_records (userId, day, practiceCount, practiceGroups, examScore, completed) VALUES (?, ?, 1, 1, 0, 0)',
              [userId, day]);
          }
          res.json({
            success: true,
            data: {
              total,
              correct: correctCount,
              score,
              groupIndex,
              canStartExam: groupIndex >= 3,
              hasMoreQuestions: true,
              results: results,
              message: `第${groupIndex}组练习完成，答对 ${correctCount}/${total} 题，得分 ${score} 分`,
            },
          });
        });
      });
    });
  } catch (error) {
    console.error('提交练习失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};
