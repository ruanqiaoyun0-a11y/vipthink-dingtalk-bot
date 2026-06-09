import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByDayAndType, submitPractice } from '../services/api';
import { Question, PracticeAnswer, PracticeResult } from '../types';
import { ArrowLeft, CheckCircle, XCircle, Send, Trophy, AlertCircle, RotateCcw } from 'lucide-react';

export const Practice = () => {
  const { day } = useParams<{ day: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [meta, setMeta] = useState<{ groupIndex?: number; completedGroups?: number; canStartExam?: boolean; previousScores?: any[] }>({});
  const navigate = useNavigate();

  const dayNum = parseInt(day || '1');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestionsByDayAndType(dayNum, 'practice');
        if (response.success) {
          setQuestions(response.data);
          if (response.meta) setMeta(response.meta);
        }
      } catch (error) {
        console.error('获取题目失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [dayNum]);

  const handleAnswer = (questionId: string, answer: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('请完成所有题目');
      return;
    }

    setSubmitting(true);
    try {
      const practiceAnswers: PracticeAnswer[] = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id],
      }));

      const response = await submitPractice(dayNum, practiceAnswers);
      if (response.success) {
        setResult(response.data);
        setSubmitted(true);
        if (response.meta) setMeta(response.meta);
      }
    } catch (error) {
      console.error('提交练习失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextGroup = () => {
    window.location.reload();
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (questions.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">该天练习已完成</h2>
          <p className="text-gray-600 mb-6">您已经完成了当天所有练习题目，可以参加考核了！</p>
          <button
            onClick={() => navigate(`/exam/${dayNum}`)}
            className="btn-success"
          >
            参加考核
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              DAY{dayNum} · 第{meta.groupIndex || 1}组练习
            </h1>
            <p className="text-sm text-gray-500">
              共{questions.length}题 · 每题10分 · 满分100分
              {meta.completedGroups != null && ` · 已完成${meta.completedGroups}组`}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {meta.previousScores && meta.previousScores.length > 0 && !submitted && (
          <div className="card bg-blue-50 border-blue-100 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">已完成练习成绩</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {meta.previousScores.map((s: any) => (
                <div key={s.group} className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">第{s.group}组</div>
                  <div className="text-xl font-bold text-blue-600">{s.score}分</div>
                  <div className="text-xs text-gray-600">答对{s.correct}/{s.total}题</div>
                </div>
              ))}
            </div>
            {!meta.canStartExam && (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>还需完成 {3 - (meta.completedGroups || 0)} 组练习才能参加考核（当前{meta.completedGroups}/3组）</span>
              </div>
            )}
            {meta.canStartExam && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>已完成{meta.completedGroups}组练习，可以参加考核！</span>
              </div>
            )}
          </div>
        )}

        {!submitted && (
          <div className="card bg-primary-50 border-primary-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">{meta.groupIndex || 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">第{meta.groupIndex || 1}组练习开始</h3>
                <p className="text-sm text-gray-600">认真作答，每题10分。完成后可继续下一组或参加考核。</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = submitted && result?.results?.find(r => r.questionId === question.id)?.isCorrect;

            return (
              <div key={question.id} className="card">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{question.question}</p>
                  </div>
                  {submitted && (
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pl-11">
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedAnswer === optIndex;
                    const isCorrectAnswer = question.answer === optIndex;
                    let optionClass = 'border-gray-200 hover:border-primary-300 hover:bg-primary-50';

                    if (submitted) {
                      if (isCorrectAnswer) {
                        optionClass = 'border-success bg-success/10';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionClass = 'border-danger bg-danger/10';
                      } else {
                        optionClass = 'border-gray-200 opacity-50';
                      }
                    } else if (isSelected) {
                      optionClass = 'border-primary-500 bg-primary-50';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(question.id, optIndex)}
                        disabled={submitted}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${optionClass} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="font-medium text-gray-700">
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 pl-11">
                    <div className={`p-3 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-danger/10'}`}>
                      <p className={`font-medium ${isCorrect ? 'text-success' : 'text-danger'}`}>
                        {isCorrect ? '回答正确！' : `回答错误，正确答案是${String.fromCharCode(65 + question.answer)}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitting ? '提交中...' : '提交答案'}
            </button>
          </div>
        ) : (
          <div className="mt-8 card bg-primary-50">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${result?.score >= 80 ? 'bg-success' : result?.score >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                {result?.score >= 80 ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : result?.score >= 60 ? (
                  <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{result?.score}分</div>
              <p className="text-gray-600 mb-4">
                第{result?.groupIndex || 1}组练习完成 · 答对{result?.correct}题，共{result?.total}题
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  返回首页
                </button>
                {result?.hasMoreQuestions && (
                  <button
                    onClick={handleNextGroup}
                    className="btn-primary flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    下一组练习
                  </button>
                )}
                {result?.canStartExam && (
                  <button
                    onClick={() => navigate(`/exam/${dayNum}`)}
                    className="btn-success"
                  >
                    参加考核
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
