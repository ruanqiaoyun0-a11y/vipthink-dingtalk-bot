import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecords } from '../services/api';
import { LearningRecord } from '../types';
import { BookOpen, Trophy, Clock, ChevronRight, LogOut, BarChart3, Users, TrendingUp } from 'lucide-react';

export const Home = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getRecords();
        if (response.success) {
          setRecords(response.data);
        }
      } catch (error) {
        console.error('获取学习记录失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const getRecordForDay = (day: number) => {
    return records.find(r => r.day === day);
  };

  const getProgress = () => {
    const completedDays = records.filter(r => r.completed).length;
    return (completedDays / 4) * 100;
  };

  const days = [1, 2, 3, 4];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">VIP THINK培训练习系统</h1>
              <p className="text-sm text-gray-500">销售话术学习平台</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">欢迎, {user?.name}</span>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">管理后台</span>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">退出</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">学习进度</h2>
              <p className="text-gray-500 mt-1">完成所有天数的学习和考核，获得结业证书</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{Math.round(getProgress())}%</div>
              <div className="text-sm text-gray-500">完成进度</div>
            </div>
          </div>
          
          <div className="progress-bar mb-2">
            <div className="progress-fill" style={{ width: `${getProgress()}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>DAY 1</span>
            <span>DAY 2</span>
            <span>DAY 3</span>
            <span>DAY 4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {days.map((day) => {
            const record = getRecordForDay(day);
            const isCompleted = record?.completed;
            
            return (
              <div
                key={day}
                className="card cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                style={{ borderLeftColor: isCompleted ? '#10b981' : '#3b82f6' }}
                onClick={() => navigate(`/practice/${day}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      DAY {day}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-3">第{day}天学习</h3>
                  </div>
                  {isCompleted && (
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      学习状态
                    </span>
                    <span className={isCompleted ? 'text-success font-medium' : 'text-gray-600'}>
                      {isCompleted ? '已完成' : '未开始'}
                    </span>
                  </div>
                  
                  {record && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          练习次数
                        </span>
                        <span className="text-gray-800 font-medium">{record.practiceCount}次</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">考核成绩</span>
                        <span className={`font-medium ${record.examScore >= 60 ? 'text-success' : 'text-warning'}`}>
                          {record.examScore}分
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-primary-600 font-medium">开始学习</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">学习指南</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">闯关练习</h4>
                <p className="text-sm text-gray-500">完成练习题目巩固知识点</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">考核测试</h4>
                <p className="text-sm text-gray-500">通过考核完成当天学习</p>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8 card bg-gradient-to-r from-primary-50 to-blue-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              管理员快捷入口
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">学员管理</div>
                  <div className="text-sm text-gray-500">查看和管理学员账户</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">数据统计</div>
                  <div className="text-sm text-gray-500">查看学习数据分析</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">内容管理</div>
                  <div className="text-sm text-gray-500">添加知识点和题目</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">学习记录</div>
                  <div className="text-sm text-gray-500">查看学员学习详情</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};