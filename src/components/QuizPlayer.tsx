import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight, X } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const[selectedOption, setSelectedOption] = useState<number | null>(null);
  const[isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const[showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const getOptionStyle = (index: number) => {
    const baseStyle = "p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden group ";
    
    if (!isAnswered) {
      return baseStyle + "border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200";
    }

    if (index === currentQuestion.correctAnswerIndex) {
      return baseStyle + "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 shadow-md shadow-emerald-500/10";
    }

    if (index === selectedOption) {
      return baseStyle + "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
    }

    return baseStyle + "border-slate-200 dark:border-slate-700 opacity-50 bg-slate-50 dark:bg-slate-900/50";
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Cần cố gắng thêm!";
    if (percentage >= 80) message = "Xuất sắc! Bạn có kỹ năng xử lý rất tốt!";
    else if (percentage >= 50) message = "Khá tốt! Hãy trau dồi thêm nhé.";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-700 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>

          <div className="w-24 h-24 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
            <Trophy size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{score} / {questions.length}</h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Câu hỏi {currentIndex + 1}/{questions.length}</span>
            <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={getOptionStyle(idx)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium pr-8">{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="text-red-500 flex-shrink-0" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 animate-fade-in-up">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Giải thích:
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
