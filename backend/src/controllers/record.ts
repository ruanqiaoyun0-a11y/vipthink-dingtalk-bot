import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

interface LearningRecord {
  id: number;
  userId: number;
  day: number;
  practiceCount: number;
  practiceGroups?: number;
  examScore: number;
  completed: number;
  updatedAt: string;
}

export const getRecords = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    db.all('SELECT * FROM learning_records WHERE userId = ?', [userId], (err, rows: LearningRecord[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }

      res.json({
        success: true,
        data: rows.map(record => ({
          id: record.id.toString(),
          day: record.day,
          practiceCount: record.practiceCount,
          practicegroups: record.practiceGroups || 0,
          examScore: record.examScore,
          completed: record.completed === 1,
          updatedAt: record.updatedAt,
        })),
      });
    });
  } catch (error) {
    console.error('获取记录失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const getAllRecords = async (req: AuthRequest, res: Response) => {
  try {
    db.all(`
      SELECT u.name, u.role, r.day, r.practiceCount, r.practiceGroups, r.examScore, r.completed, r.updatedAt
      FROM learning_records r
      JOIN users u ON r.userId = u.id
      WHERE u.role = 'student'
      ORDER BY u.name, r.day
    `, (err, rows: any[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      res.json({
        success: true,
        data: rows.map(row => ({
          name: row.name,
          role: row.role,
          day: row.day,
          practiceCount: row.practiceCount,
          practiceGroups: row.practiceGroups || 0,
          examScore: row.examScore,
          completed: row.completed === 1,
          updatedAt: row.updatedAt,
        })),
      });
    });
  } catch (error) {
    console.error('获取所有记录失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const getDailyStats = async (req: AuthRequest, res: Response) => {
  try {
    db.all(`
      SELECT 
        r.day,
        COUNT(DISTINCT r.userId) as studentCount,
        SUM(r.practiceCount) as totalPracticeCount,
        AVG(r.examScore) as avgExamScore,
        SUM(CASE WHEN r.completed = 1 THEN 1 ELSE 0 END) as completedCount
      FROM learning_records r
      GROUP BY r.day
    `, (err, rows: any[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      res.json({
        success: true,
        data: rows.map(row => ({
          day: row.day,
          studentCount: row.studentCount,
          totalPracticeCount: row.totalPracticeCount,
          avgExamScore: Math.round(row.avgExamScore) || 0,
          completedCount: row.completedCount,
        })),
      });
    });
  } catch (error) {
    console.error('获取每日统计失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};