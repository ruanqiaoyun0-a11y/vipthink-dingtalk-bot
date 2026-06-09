import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDatabase } from './db';
import userRoutes from './routes/user';
import learningRoutes from './routes/learning';
import questionRoutes from './routes/question';
import practiceRoutes from './routes/practice';
import examRoutes from './routes/exam';
import recordRoutes from './routes/record';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/records', recordRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'VIPthink培训系统后端服务运行中' });
});

const startServer = async () => {
  try {
    await initDatabase();
    console.log('SQLite数据库初始化成功');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
};

startServer();