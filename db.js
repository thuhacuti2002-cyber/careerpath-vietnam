import Database from 'better-sqlite3';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
const db = new Database(process.env.DATABASE_PATH || './careerpath.sqlite');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS assessments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, answers_json TEXT NOT NULL, result_json TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS chat_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS chat_messages (id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE, role TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id, created_at);
`);
export default db;
