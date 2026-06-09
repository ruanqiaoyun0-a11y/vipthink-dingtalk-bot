import axios from 'axios';
import { User, KnowledgePoint, Question, LearningRecord, PracticeAnswer, ExamAnswer, PracticeResult, ExamResult, DailyStats, AllRecords } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (name: string, password: string): Promise<{ success: boolean; data: User; token: string }> => {
  const response = await axiosInstance.post('/users/login', { name, password });
  return response.data;
};

export const getMe = async (): Promise<{ success: boolean; data: User }> => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const getUsers = async (): Promise<{ success: boolean; data: User[] }> => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const createUser = async (name: string, password: string, role: 'student' | 'admin' = 'student'): Promise<{ success: boolean; data: User }> => {
  const response = await axiosInstance.post('/users', { name, password, role });
  return response.data;
};

export const updateUser = async (id: string, name?: string, password?: string): Promise<{ success: boolean; data: User; message?: string }> => {
  const body: Record<string, string> = {};
  if (name) body.name = name;
  if (password) body.password = password;
  const response = await axiosInstance.put(`/users/${id}`, body);
  return response.data;
};

export const deleteUser = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const getKnowledgePointsByDay = async (day: number): Promise<{ success: boolean; data: KnowledgePoint[] }> => {
  const response = await axiosInstance.get(`/learning/day/${day}`);
  return response.data;
};

export const createKnowledgePoint = async (day: number, title: string, content: string, order: number = 0): Promise<{ success: boolean; data: KnowledgePoint }> => {
  const response = await axiosInstance.post('/learning', { day, title, content, order });
  return response.data;
};

export const getQuestionsByDayAndType = async (day: number, type: 'practice' | 'exam'): Promise<{ success: boolean; data: Question[] }> => {
  const response = await axiosInstance.get(`/questions/${day}/${type}`);
  return response.data;
};

export const createQuestion = async (day: number, type: 'practice' | 'exam', question: string, options: string[], answer: number, explanation: string): Promise<{ success: boolean; data: Question }> => {
  const response = await axiosInstance.post('/questions', { day, type, question, options, answer, explanation });
  return response.data;
};

export const submitPractice = async (day: number, answers: PracticeAnswer[]): Promise<{ success: boolean; data: PracticeResult }> => {
  const response = await axiosInstance.post('/practice', { day, answers });
  return response.data;
};

export const submitExam = async (day: number, answers: ExamAnswer[]): Promise<{ success: boolean; data: ExamResult }> => {
  const response = await axiosInstance.post('/exam', { day, answers });
  return response.data;
};

export const getRecords = async (): Promise<{ success: boolean; data: LearningRecord[] }> => {
  const response = await axiosInstance.get('/records');
  return response.data;
};

export const getAllRecords = async (): Promise<{ success: boolean; data: AllRecords[] }> => {
  const response = await axiosInstance.get('/records/all');
  return response.data;
};

export const getDailyStats = async (): Promise<{ success: boolean; data: DailyStats[] }> => {
  const response = await axiosInstance.get('/records/stats/daily');
  return response.data;
};