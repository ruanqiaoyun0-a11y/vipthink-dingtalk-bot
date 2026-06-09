import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, getAllRecords, createUser, createQuestion, getDailyStats, updateUser, deleteUser } from '../services/api';
import { User, AllRecords, DailyStats } from '../types';
import { ArrowLeft, Users, BarChart3, Plus, X, TrendingUp, HelpCircle, Clock, Award, Target, Eye, Pencil, Trash2 } from 'lucide-react';

export const Admin = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [records, setRecords] = useState<AllRecords[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'records' | 'addUser' | 'addQuestion'>('overview');
  const [loading, setLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({ name: '', password: '', role: 'student' as 'student' | 'admin' });
  const [newQuestion, setNewQuestion] = useState({ day: 1, type: 'practice' as 'practice' | 'exam', question: '', options: ['', '', '', ''], answer: 0, explanation: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', password: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, recordsResponse, statsResponse] = await Promise.all([
          getUsers(),
          getAllRecords(),
          getDailyStats(),
        ]);
        
        if (usersResponse.success) setUsers(usersResponse.data);
        if (recordsResponse.success) setRecords(recordsResponse.data);
        if (statsResponse.success) setDailyStats(statsResponse.data);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleCreateUser = async () => {
    try {
      const response = await createUser(newUser.name, newUser.password, newUser.role);
      if (response.success) {
        alert('用户创建成功');
        setNewUser({ name: '', password: '', role: 'student' });
        setActiveTab('users');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      const response = await createQuestion(
        newQuestion.day,
        newQuestion.type,
        newQuestion.question,
        newQuestion.options,
        newQuestion.answer,
        newQuestion.explanation
      );
      if (response.success) {
        alert('题目创建成功');
        setNewQuestion({ day: 1, type: 'practice', question: '', options: ['', '', '', ''], answer: 0, explanation: '' });
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('创建题目失败:', error);
    }
  };

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, password: '' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', password: '' });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    if (!editForm.name && !editForm.password) {
      alert('请至少修改姓名或密码');
      return;
    }
    
    try {
      const response = await updateUser(
        editingUser.id,
        editForm.name || undefined,
        editForm.password || undefined
      );
      if (response.success) {
        alert('修改成功');
        handleCancelEdit();
        const usersResponse = await getUsers();
        if (usersResponse.success) setUsers(usersResponse.data);
      }
    } catch (error) {
      console.error('修改用户失败:', error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`确定要删除学员"${user.name}"吗？此操作不可恢复。`)) return;
    
    try {
      const response = await deleteUser(user.id);
      if (response.success) {
        alert('删除成功');
        const usersResponse = await getUsers();
        if (usersResponse.success) setUsers(usersResponse.data);
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const getOverallStats = () => {
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalPractice = records.reduce((sum, r) => sum + (r.totalPracticeCount || 0), 0);
    const avgScore = records.length > 0 
      ? Math.round(records.reduce((sum, r) => sum + (r.averageScore || 0), 0) / records.length)
      : 0;
    const completedDays = records.reduce((sum, r) => sum + (r.completedDays || 0), 0);
    
    return { totalStudents, totalPractice, avgScore, completedDays };
  };

  const stats = getOverallStats();

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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">管理后台</h1>
              <p className="text-sm text-gray-500">培训系统数据监控与管理</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            退出
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <BarChart3 className="w-4 h-4" />
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4" />
            学员管理
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'records' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            <Clock className="w-4 h-4" />
            学习记录
          </button>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setActiveTab('addUser')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              添加学员
            </button>
            <button
              onClick={() => setActiveTab('addQuestion')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" />
              添加题目
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">学员总数</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">{stats.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">总练习次数</p>
                    <p className="text-3xl font-bold text-success mt-2">{stats.totalPractice}</p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">平均成绩</p>
                    <p className="text-3xl font-bold text-warning mt-2">{stats.avgScore}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">完成天数</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.completedDays}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  每日学习统计
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(day => {
                    const stat = dailyStats.find(s => s.day === day);
                    return (
                      <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-primary-600">DAY {day}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">第{day}天学习</p>
                            <p className="text-sm text-gray-500">
                              {stat?.studentCount || 0}位学员参与
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            {stat?.totalPracticeCount || 0}次练习
                          </p>
                          <p className={`text-sm ${(stat?.avgExamScore || 0) >= 60 ? 'text-success' : 'text-warning'}`}>
                            平均分: {Math.round(stat?.avgExamScore || 0)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-600" />
                  学员学习排行
                </h2>
                <div className="space-y-3">
                  {records.slice(0, 5).map((record, index) => (
                    <div key={record._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-300 text-white' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{record.name}</p>
                        <p className="text-sm text-gray-500">
                          练习{record.totalPracticeCount}次 · 平均分{Math.round(record.averageScore)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${record.completedDays >= 4 ? 'text-success' : 'text-gray-600'}`}>
                          {record.completedDays}/4天
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">学员列表</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">序号</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">姓名</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">创建时间</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">学习进度</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const record = records.find(r => r.name === user.name);
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-800 font-medium">{user.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {user.role === 'admin' ? '管理员' : '学员'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {record ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-success rounded-full" 
                                  style={{ width: `${(record.completedDays / 4) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {record.completedDays}/4天
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">未开始</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="修改信息"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除学员"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {editingUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">修改学员信息</h2>
                    <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="input-field"
                        placeholder="请输入新的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">密码（留空则不修改）</label>
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className="input-field"
                        placeholder="请输入新密码"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleCancelEdit} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        取消
                      </button>
                      <button onClick={handleSaveEdit} className="flex-1 btn-primary py-3">
                        保存修改
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">学习记录详情</h2>
            <div className="space-y-6">
              {records.map(record => (
                <div key={record._id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800">{record.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{record.totalPracticeCount}</p>
                        <p className="text-xs text-gray-500">总练习次数</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${Math.round(record.averageScore) >= 60 ? 'text-success' : 'text-warning'}`}>
                          {Math.round(record.averageScore)}
                        </p>
                        <p className="text-xs text-gray-500">平均成绩</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${record.completedDays >= 4 ? 'text-success' : 'text-gray-600'}`}>
                          {record.completedDays}/4
                        </p>
                        <p className="text-xs text-gray-500">完成天数</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(day => {
                        const dayRecord = record.records.find(r => r.day === day);
                        return (
                          <div key={day} className={`p-3 rounded-lg ${dayRecord?.completed ? 'bg-success/10 border border-success/30' : 'bg-gray-100'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-700">DAY {day}</span>
                              {dayRecord?.completed && (
                                <Award className="w-4 h-4 text-success" />
                              )}
                            </div>
                            <div className="text-sm">
                              {dayRecord ? (
                                <>
                                  <div className="text-gray-600">练习{dayRecord.practiceCount}次</div>
                                  <div className={`font-bold ${dayRecord.examScore >= 60 ? 'text-success' : 'text-warning'}`}>
                                    成绩: {dayRecord.examScore}分
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-400">未开始学习</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'addUser' && (
          <div className="card max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">添加学员</h2>
              <button onClick={() => setActiveTab('users')} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="input-field"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="input-field"
                  placeholder="请输入密码（默认：hltn1234）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'student' | 'admin' })}
                  className="input-field"
                >
                  <option value="student">学员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <button onClick={handleCreateUser} className="btn-primary w-full">
                创建用户
              </button>
            </div>
          </div>
        )}

        {activeTab === 'addQuestion' && (
          <div className="card max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">添加题目</h2>
              <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">天数</label>
                <select
                  value={newQuestion.day}
                  onChange={(e) => setNewQuestion({ ...newQuestion, day: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value={1}>DAY 1</option>
                  <option value={2}>DAY 2</option>
                  <option value={3}>DAY 3</option>
                  <option value={4}>DAY 4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as 'practice' | 'exam' })}
                  className="input-field"
                >
                  <option value="practice">练习</option>
                  <option value="exam">考核</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">题目内容</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="input-field h-24 resize-none"
                  placeholder="题目内容"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选项</label>
                {newQuestion.options.map((opt, index) => (
                  <input
                    key={index}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    className="input-field mb-2"
                    placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">正确答案</label>
                <select
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">答案解析</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="input-field h-24 resize-none"
                  placeholder="答案解析"
                />
              </div>
              <button onClick={handleCreateQuestion} className="btn-primary w-full">
                创建题目
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};