import { useState } from 'react';
import { BookOpen, Play, Award, Users, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';

const demoQuestions = [
  {
    id: '1',
    day: 1,
    question: '课程顾问在与家长初次沟通时，最重要的是什么？',
    options: ['立即推荐高价课程', '了解家长需求和孩子情况', '介绍公司历史', '推销优惠政策'],
    answer: 1,
    explanation: '课程顾问的首要任务是了解家长需求和孩子情况，只有深入了解后才能提供最合适的课程建议。'
  },
  {
    id: '2',
    day: 1,
    question: '处理家长投诉时，正确的第一步是什么？',
    options: ['解释公司政策', '道歉并倾听家长不满', '转接给上级', '忽略投诉继续工作'],
    answer: 1,
    explanation: '首先道歉并认真倾听家长的不满，表达了尊重和重视，有助于缓解家长情绪。'
  },
  {
    id: '3',
    day: 1,
    question: '以下哪项是建立家长信任的关键？',
    options: ['频繁打电话催促报名', '及时反馈孩子学习情况', '只介绍热门课程', '回避家长问题'],
    answer: 1,
    explanation: '定期及时地反馈孩子的学习情况，让家长感受到专业和用心，是建立信任的重要方式。'
  },
  {
    id: '4',
    day: 1,
    question: '课程顾问需要具备的最重要特质是什么？',
    options: ['强硬推销技巧', '专业产品知识和真诚服务态度', '快速签单能力', '压低价格吸引家长'],
    answer: 1,
    explanation: '专业知识结合真诚的服务态度，才能赢得家长的长期信任和口碑推荐。'
  },
  {
    id: '5',
    day: 1,
    question: '面对价格异议时，有效的回应方式是？',
    options: ['直接拒绝讨论价格', '强调价值而非价格', '立即降价', '让家长去别家比较'],
    answer: 1,
    explanation: '向家长清晰传达课程的价值和能为孩子带来的成长帮助，比单纯讨论价格更有说服力。'
  }
];

export const Demo = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'practice' | 'result'>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = demoQuestions[currentQuestion];
  const isCorrect = submitted && selectedAnswer === question.answer;
  const correctCount = Object.entries(answers).filter(([id, ans]) => 
    demoQuestions.find(q => q.id === id)?.answer === ans
  ).length;

  const handleAnswer = (optIndex: number) => {
    if (submitted) return;
    setSelectedAnswer(optIndex);
    setAnswers(prev => ({ ...prev, [question.id]: optIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[demoQuestions[currentQuestion + 1].id] ?? null);
      setSubmitted(false);
    } else {
      setCurrentPage('result');
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">VIPthink 培训练习系统</h1>
                <p className="text-sm text-gray-500">课程顾问培训平台 · 公开演示</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">专业培训 · 轻松学习</h2>
            <p className="text-xl text-gray-600 mb-8">VIPthink 为您提供完整的课程顾问培训解决方案</p>
            <button
              onClick={() => setCurrentPage('practice')}
              className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              开始体验演示
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">系统化学习</h3>
              <p className="text-gray-600">DAY1-DAY4 完整课程体系，循序渐进掌握核心技能</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">闯关考核</h3>
              <p className="text-gray-600">练习+测试模式，确保学习效果达标</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">数据管理</h3>
              <p className="text-gray-600">实时追踪学习进度，管理员全面掌控</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              系统功能特点
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">DAY1-DAY4 独立题库</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">10题一组练习模式</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">每题10分即时反馈</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">完成3组解锁考核</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">20题综合考核</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">答案解析展示</span>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500">
            VIPthink 培训练习系统 · 公开演示版本
          </div>
        </footer>
      </div>
    );
  }

  if (currentPage === 'practice') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">DAY1 · 演示练习</h1>
              <p className="text-sm text-gray-500">
                第{currentQuestion + 1}/{demoQuestions.length}题 · 每题10分
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="card">
            <div className="flex items-start gap-3 mb-6">
              <span className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                {currentQuestion + 1}
              </span>
              <p className="text-lg text-gray-800 font-medium flex-1">{question.question}</p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, optIndex) => {
                const isSelected = selectedAnswer === optIndex;
                const isCorrectAnswer = question.answer === optIndex;
                let optionClass = 'border-gray-200';

                if (submitted) {
                  if (isCorrectAnswer) {
                    optionClass = 'border-green-500 bg-green-50';
                  } else if (isSelected) {
                    optionClass = 'border-red-500 bg-red-50';
                  }
                } else if (isSelected) {
                  optionClass = 'border-primary-500 bg-primary-50';
                }

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswer(optIndex)}
                    disabled={submitted}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${optionClass} ${submitted ? '' : 'hover:border-primary-300 cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓ 回答正确！' : `✗ 回答错误，正确答案是 ${String.fromCharCode(65 + question.answer)}`}
                </p>
                <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
                >
                  {currentQuestion < demoQuestions.length - 1 ? '下一题' : '查看结果'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Result page
  const score = correctCount * 10;
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Award className={`w-12 h-12 ${
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">演示练习完成</h2>
          <div className="text-6xl font-bold text-primary-600 mb-4">{score}分</div>
          <p className="text-xl text-gray-600 mb-8">
            答对 {correctCount}/{demoQuestions.length} 题
          </p>
          
          <div className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg mb-8">
            <h3 className="font-bold text-gray-800 mb-4">题目回顾</h3>
            <div className="space-y-2">
              {demoQuestions.map((q, idx) => {
                const userAns = answers[q.id];
                const isRight = userAns === q.answer;
                return (
                  <div key={q.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">第{idx + 1}题</span>
                    <span className={isRight ? 'text-green-600' : 'text-red-600'}>
                      {isRight ? '✓ 正确' : `✗ ${String.fromCharCode(65 + q.answer)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentPage('home');
              setCurrentQuestion(0);
              setAnswers({});
              setSubmitted(false);
              setSelectedAnswer(null);
            }}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700"
          >
            返回首页
          </button>
        </div>
      </main>
    </div>
  );
};
