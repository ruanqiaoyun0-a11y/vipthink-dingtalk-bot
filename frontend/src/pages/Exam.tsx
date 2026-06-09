import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByDayAndType, submitExam } from '../services/api';
import { Question, ExamAnswer, ExamResult } from '../types';
import { ArrowLeft, CheckCircle, XCircle, Send, Trophy, AlertCircle, Lock } from 'lucide-react';

export const Exam = () => {
  const { day } = useParams<{ day: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');
  const navigate = useNavigate();

  const dayNum = parseInt(day || '1');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestionsByDayAndType(dayNum, 'exam');
        if (response.success) {
          setQuestions(response.data);
        }
      } catch (error: any) {
        console.error('获取题目失败:', error);
        if (error?.status === 403 || error?.data?.message?.includes('至少完成')) {
          setBlocked(true);
          setBlockedMessage(error?.data?.message || '至少完成3组练习才能参加考核');
        }
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
      const examAnswers: ExamAnswer[] = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id],
      }));

      const response = await submitExam(dayNum, examAnswers);
      if (response.success) {
        setResult(response.data);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('提交考核失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">考核未解锁</h2>
          <p className="text-gray-600 mb-6">{blockedMessage}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/practice/${dayNum}`)}
              className="btn-primary"
            >
              完成练习
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/practice/${dayNum}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">DAY{dayNum} · 综合考核</h1>
            <p className="text-sm text-gray-500">共{questions.length}题 · 每题5分 · 满分100分 · 60分及格</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!submitted && (
          <div className="card bg-warning/5 border-warning/20 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-medium text-warning">考核须知</h3>
                <p className="text-sm text-gray-600">请认真作答，考核成绩将记录在案。每题5分，60分及以上为及格，不及格可重新考核。</p>
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
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-sm">
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
                    let optionClass = 'border-gray-200 hover:border-green-300 hover:bg-green-50';

                    if (submitted) {
                      if (isCorrectAnswer) {
                        optionClass = 'border-success bg-success/10';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionClass = 'border-danger bg-danger/10';
                      } else {
                        optionClass = 'border-gray-200 opacity-50';
                      }
                    } else if (isSelected) {
                      optionClass = 'border-green-500 bg-green-50';
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
              className="btn-success flex items-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {submitting ? '提交中...' : '提交考核'}
            </button>
          </div>
        ) : (
          <div className={`mt-8 card ${result?.passed ? 'bg-success/5' : 'bg-danger/5'}`}>
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${result?.passed ? 'bg-success' : 'bg-danger'}`}>
                {result?.passed ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <div className={`text-4xl font-bold mb-2 ${result?.passed ? 'text-success' : 'text-danger'}`}>
                {result?.score}分
              </div>
              <p className="text-gray-600 mb-4">
                答对{result?.correct}题，共{result?.total}题
              </p>
              <p className={`font-medium mb-6 ${result?.passed ? 'text-success' : 'text-danger'}`}>
                {result?.passed ? '恭喜！考核通过！' : '未达到及格分数，请重新学习后重试'}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  返回首页
                </button>
                {!result?.passed && (
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setAnswers({});
                      setResult(null);
                    }}
                    className="btn-success"
                  >
                    重新考核
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
