import React, { useState } from 'react';
import { X, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { QuizConfig, QuizType } from '../types';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QuizConfigModal: React.FC<QuizConfigModalProps> = ({ isOpen, onClose, onStartQuiz, isLoading }) => {
  const [topic, setTopic] = useState('');
  const[type, setType] = useState<QuizType>('multiple-choice');
  const [count, setCount] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({ topic, type, count });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <BrainCircuit size={20} />
            <h2 className="font-bold text-lg">Thử thách xử lý tình huống</h2>
          </div>
          {!isLoading && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Topic Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chủ đề (để trống sẽ chọn ngẫu nhiên)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Bắt nạt, Bạo lực ngôn từ, Cách xử lý..."
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Quiz Type Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Loại câu hỏi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('multiple-choice')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    type === 'multiple-choice'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-current opacity-60"/>
                     <div className="w-2 h-2 rounded-full bg-current opacity-60"/>
                     <div className="w-2 h-2 rounded-full bg-current opacity-60"/>
                  </div>
                  <span className="text-xs font-medium">Trắc nghiệm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('true-false')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    type === 'true-false'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex gap-2">
                    <CheckCircle2 size={12} />
                    <X size={12} />
                  </div>
                  <span className="text-xs font-medium">Đúng / Sai</span>
                </button>
              </div>
            </div>

            {/* Count Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Số lượng câu hỏi
                </label>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{count}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>1 câu</span>
                <span>10 câu</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang tạo câu đố...</span>
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  <span>Bắt đầu thử thách</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizConfigModal;
