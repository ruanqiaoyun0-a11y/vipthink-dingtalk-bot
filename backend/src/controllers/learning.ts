import { Response } from 'express';
import db from '../db';
import { AuthRequest } from '../middleware/auth';

interface KnowledgePoint {
  id: number;
  day: number;
  title: string;
  content: string;
  order: number;
}

export const getKnowledgePointsByDay = async (req: AuthRequest, res: Response) => {
  try {
    const day = parseInt(req.params.day);
    
    if (isNaN(day)) {
      return res.status(400).json({ success: false, message: '无效的天数' });
    }
    
    db.all('SELECT * FROM knowledge_points WHERE day = ? ORDER BY "order" ASC', [day], (err, rows: KnowledgePoint[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      res.json({
        success: true,
        data: rows.map(kp => ({
          id: kp.id.toString(),
          day: kp.day,
          title: kp.title,
          content: kp.content,
          order: kp.order,
        })),
      });
    });
  } catch (error) {
    console.error('获取知识点失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const createKnowledgePoint = async (req: AuthRequest, res: Response) => {
  try {
    const { day, title, content, order = 0 } = req.body;
    
    if (!day || !title || !content) {
      return res.status(400).json({ success: false, message: '请填写完整信息' });
    }
    
    db.run(
      'INSERT INTO knowledge_points (day, title, content, "order") VALUES (?, ?, ?, ?)',
      [day, title, content, order],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: '数据库错误' });
        }
        
        res.json({
          success: true,
          data: {
            id: this.lastID.toString(),
            day,
            title,
            content,
            order,
          },
        });
      }
    );
  } catch (error) {
    console.error('创建知识点失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};