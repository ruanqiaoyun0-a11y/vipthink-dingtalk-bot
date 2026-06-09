import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecords } from '../services/api';
import { LearningRecord } from '../types';
import { BookOpen, Trophy, ChevronRight, LogOut, BarChart3, Users, Lock, CheckCircle, AlertCircle } from 'lucide-react';

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
              <p className="text-gray-500 mt-1">完成每天的练习和考核，掌握销售话术核心内容</p>
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

        <div className="card bg-blue-50 border-blue-100 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">闯关规则</h3>
              <p className="text-sm text-gray-600">
                每天包含多组练习题，每组 <span className="font-semibold text-primary-600">10题/100分</span>（每题10分）。
                <span className="font-semibold text-amber-600">至少完成3组练习</span>后可参加当天综合考核，
                考核 <span className="font-semibold text-green-600">20题/100分</span>（每题5分），60分及格。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {days.map((day) => {
            const record = getRecordForDay(day);
            const isCompleted = record?.completed;
            const practiceGroups = record?.practicegroups || 0;
            const examReady = practiceGroups >= 3;
            const hasPractice = (record?.practicecount || 0) > 0 || practiceGroups > 0;

            return (
              <div
                key={day}
                className="card cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                style={{ borderLeftColor: isCompleted ? '#10b981' : examReady ? '#16a34a' : '#3b82f6' }}
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
                      练习进度
                    </span>
                    <span className={examReady ? 'text-success font-medium' : 'text-gray-600'}>
                      {practiceGroups}/3 组 {examReady && '✓'}
                    </span>
                  </div>

                  {practiceGroups > 0 && (
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map(groupNum => (
                        <div
                          key={groupNum}
                          className={`h-2 rounded-full ${groupNum <= practiceGroups ? 'bg-primary-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      考核状态
                    </span>
                    <span className={`font-medium ${isCompleted ? 'text-success' : examReady ? 'text-green-600' : 'text-gray-400'}`}>
                      {isCompleted ? '已通过' : examReady ? '可参加' : '未解锁'}
                    </span>
                  </div>

                  {record && (record.examscore || 0) > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">考核成绩</span>
                      <span className={`font-medium ${record.examscore >= 60 ? 'text-success' : 'text-warning'}`}>
                        {record.examscore}分
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-primary-600 font-medium">
                    {isCompleted ? '查看详情' : hasPractice ? '继续学习' : '开始练习'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <span className="font-bold text-gray-800">练习闯关</span>
            </div>
            <p className="text-sm text-gray-600">每天多组练习，每组10题，掌握当天知识点</p>
          </div>

          <div className="card bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-amber-600" />
              <span className="font-bold text-gray-800">解锁考核</span>
            </div>
            <p className="text-sm text-gray-600">完成至少3组练习后解锁当天综合考核</p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="font-bold text-gray-800">通过考核</span>
            </div>
            <p className="text-sm text-gray-600">20题综合考核，每题5分，60分及格通过</p>
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
                  <BarChart3 className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">数据统计</div>
                  <div className="text-sm text-gray-500">查看学习数据分析</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
