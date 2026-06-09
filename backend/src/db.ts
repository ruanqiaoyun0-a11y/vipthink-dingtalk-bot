import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'student',
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS knowledge_points (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          "order" INTEGER DEFAULT 0
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day INTEGER NOT NULL,
          type TEXT NOT NULL,
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          answer INTEGER NOT NULL,
          explanation TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS learning_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          day INTEGER NOT NULL,
          practiceCount INTEGER DEFAULT 0,
          examScore INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      db.run('CREATE INDEX IF NOT EXISTS idx_users_name ON users(name)');
      db.run('CREATE INDEX IF NOT EXISTS idx_kp_day ON knowledge_points(day)');
      db.run('CREATE INDEX IF NOT EXISTS idx_q_day_type ON questions(day, type)');
      db.run('CREATE INDEX IF NOT EXISTS idx_lr_user ON learning_records(userId)');
      db.run('CREATE INDEX IF NOT EXISTS idx_lr_day ON learning_records(day)');

      db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_lr_user_day ON learning_records(userId, day)');

      resolve();
    });
  });
};

export default db;