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

function shuffleOptions(options: string[], correctAnswer: number): { options: string[]; newAnswerIndex: number } {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const newAnswerIndex = shuffled.indexOf(options[correctAnswer]);
  return { options: shuffled, newAnswerIndex };
}

export const getQuestionsByDayAndType = async (req: AuthRequest, res: Response) => {
  try {
    const day = parseInt(req.params.day);
    const type = req.params.type as 'practice' | 'exam';
    const userId = req.user?.id;

    if (isNaN(day) || (type !== 'practice' && type !== 'exam')) {
      return res.status(400).json({ success: false, message: '无效的参数' });
    }

    db.all('SELECT * FROM questions WHERE day = ? ORDER BY id', [day], async (err, allRows: Question[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }

      if (type === 'practice') {
        db.all(
          'SELECT groupIndex, totalQuestions, correctCount, score FROM practice_sessions WHERE userId = ? AND day = ? ORDER BY groupIndex',
          [userId, day],
          (sessionErr, sessionRows: any[]) => {
          if (sessionErr) {
            return res.status(500).json({ success: false, message: '数据库错误' });
          }
          const completedGroups = sessionRows.length;
          const startIdx = completedGroups * 10;
          let groupQuestions = allRows.slice(startIdx, startIdx + 10);
          
          if (groupQuestions.length < 10 && allRows.length > 0) {
            const wrapCount = 10 - groupQuestions.length;
            groupQuestions = [...groupQuestions, ...allRows.slice(0, wrapCount)];
          }
          
          const canStartExam = completedGroups >= 3;

          const processedQuestions = groupQuestions.map(q => {
            const options = JSON.parse(q.options);
            const { options: shuffledOptions, newAnswerIndex } = shuffleOptions(options, q.answer);
            return {
              id: q.id.toString(),
              day: q.day,
              type: q.type,
              question: q.question,
              options: shuffledOptions,
              answer: newAnswerIndex,
              explanation: q.explanation,
              originalAnswer: q.answer,
            };
          });

          return res.json({
            success: true,
            data: processedQuestions,
            meta: {
              groupIndex: completedGroups + 1,
              totalGroups: Math.max(3, Math.ceil(allRows.length / 10)),
              completedGroups: completedGroups,
              canStartExam: canStartExam,
              previousScores: sessionRows.map((r: any, i: number) => ({ 
                group: i + 1, 
                score: r.score, 
                correct: r.correctCount, 
                total: r.totalQuestions 
              })),
            },
          });
        }
      );
      } else {
        db.all(
          'SELECT groupIndex FROM practice_sessions WHERE userId = ? AND day = ? ORDER BY groupIndex',
          [userId, day],
          (sessionErr, sessionRows: any[]) => {
            if (sessionErr) {
              return res.status(500).json({ success: false, message: '数据库错误' });
            }
            if (sessionRows.length < 3) {
              return res.status(403).json({ success: false, message: `至少完成3组练习才能参加考核，当前已完成${sessionRows.length}组` });
            }
            let examQuestions = allRows.slice(0, 20);
            if (examQuestions.length < 20) {
              examQuestions = allRows;
            }

            const processedQuestions = examQuestions.map(q => {
              const options = JSON.parse(q.options);
              const { options: shuffledOptions, newAnswerIndex } = shuffleOptions(options, q.answer);
              return {
                id: q.id.toString(),
                day: q.day,
                type: q.type,
                question: q.question,
                options: shuffledOptions,
                answer: newAnswerIndex,
                explanation: q.explanation,
              };
            });

            return res.json({
              success: true,
              data: processedQuestions,
              meta: {
                totalQuestions: processedQuestions.length,
                perQuestionScore: Math.floor(100 / processedQuestions.length),
                passingScore: 60,
              },
            });
          }
        );
      }
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
      function (err) {
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
