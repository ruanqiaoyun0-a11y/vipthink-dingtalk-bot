import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByDayAndType, submitPractice } from '../services/api';
import { Question, PracticeAnswer, PracticeResult } from '../types';
import { ArrowLeft, CheckCircle, XCircle, Send } from 'lucide-react';

export const Practice = () => {
  const { day } = useParams<{ day: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const dayNum = parseInt(day || '1');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestionsByDayAndType(dayNum, 'practice');
        if (response.success) {
          setQuestions(response.data);
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
      }
    } catch (error) {
      console.error('提交练习失败:', error);
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
            <h1 className="text-lg font-bold text-gray-800">第{dayNum}天 - 闯关练习</h1>
            <p className="text-sm text-gray-500">共{questions.length}道题目</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = submitted && result?.results.find(r => r.questionId === question.id)?.isCorrect;
            
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
              <div className="text-4xl font-bold text-primary-600 mb-2">{result?.score}分</div>
              <p className="text-gray-600 mb-4">
                答对{result?.correctCount}题，共{result?.totalCount}题
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  返回首页
                </button>
                <button
                  onClick={() => navigate(`/exam/${dayNum}`)}
                  className="btn-primary"
                >
                  参加考核
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};