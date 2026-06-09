import { Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

interface User {
  id: number;
  name: string;
  phone: string | null;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { name, password } = req.body;
    
    if (!name || !password) {
      return res.status(400).json({ success: false, message: '请输入姓名和密码' });
    }
    
    db.get('SELECT * FROM users WHERE name = ?', [name], async (err, row: User | undefined) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (!row) {
        return res.status(401).json({ success: false, message: '姓名或密码错误' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, row.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: '姓名或密码错误' });
      }
      
      const token = generateToken({
        id: row.id.toString(),
        role: row.role,
      });
      
      res.json({
        success: true,
        data: {
          id: row.id.toString(),
          name: row.name,
          role: row.role,
        },
        token,
      });
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row: User | undefined) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (!row) {
        return res.status(404).json({ success: false, message: '用户不存在' });
      }
      
      res.json({
        success: true,
        data: {
          id: row.id.toString(),
          name: row.name,
          role: row.role,
        },
      });
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    db.all('SELECT id, name, role, createdAt FROM users WHERE role = ?', ['student'], (err, rows: User[]) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      res.json({
        success: true,
        data: rows.map(user => ({
          id: user.id.toString(),
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        })),
      });
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, password, role = 'student' } = req.body;
    
    if (!name || !password) {
      return res.status(400).json({ success: false, message: '请填写完整信息' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (name, password, role) VALUES (?, ?, ?)',
      [name, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, message: '姓名已存在' });
          }
          return res.status(500).json({ success: false, message: '数据库错误' });
        }
        
        res.json({
          success: true,
          data: {
            id: this.lastID.toString(),
            name,
            role,
          },
        });
      }
    );
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, message: '用户ID不能为空' });
    }
    
    if (!name && !password) {
      return res.status(400).json({ success: false, message: '请提供要修改的信息' });
    }
    
    db.get('SELECT * FROM users WHERE id = ?', [id], async (err, row: User | undefined) => {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (!row) {
        return res.status(404).json({ success: false, message: '用户不存在' });
      }
      
      const newName = name || row.name;
      const newPassword = password ? await bcrypt.hash(password, 10) : row.password;
      
      db.run(
        'UPDATE users SET name = ?, password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [newName, newPassword, id],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ success: false, message: '姓名已存在' });
            }
            return res.status(500).json({ success: false, message: '数据库错误' });
          }
          
          res.json({
            success: true,
            message: '更新成功',
            data: {
              id,
              name: newName,
              role: row.role,
            },
          });
        }
      );
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: '用户ID不能为空' });
    }
    
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: '用户不存在' });
      }
      
      res.json({
        success: true,
        message: '删除成功',
      });
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};