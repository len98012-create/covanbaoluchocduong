import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, RefreshCw, Moon, Sun, BrainCircuit } from 'lucide-react';
import { Message, Role, QuizConfig, QuizQuestion } from './types';
import { sendMessageStream, resetChatSession, generateQuiz } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import QuickPrompts from './components/QuickPrompts';
import QuizConfigModal from './components/QuizConfigModal';
import QuizPlayer from './components/QuizPlayer';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: 'Xin chào! Tớ là **Cố vấn Bạo lực học đường**. \n\nTớ ở đây để lắng nghe và giúp cậu:\n- 🛡️ Nhận biết và phòng tránh bạo lực học đường\n- 🤝 Cách xử lý khi bị bắt nạt hoặc thấy bạn bè bị bắt nạt\n- 🧠 Kiểm tra kỹ năng xử lý tình huống qua các bài Quiz!\n\nCậu đang có chuyện buồn hay cần tớ tư vấn vấn đề gì thế?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Quiz State
  const[isQuizConfigOpen, setIsQuizConfigOpen] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSendMessage = async (text: string = inputValue) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: trimmedText,
      timestamp: new Date(),
    };

    setMessages(prev =>[...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev =>[
        ...prev,
        { id: aiMsgId, role: Role.MODEL, text: '', timestamp: new Date() },
      ]);

      let fullResponse = '';
      const stream = sendMessageStream(trimmedText);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error streaming AI response:', error);
      setMessages(prev =>[
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: Role.MODEL,
          text: 'Xin lỗi, tớ đang gặp chút trục trặc khi kết nối. Cậu thử lại sau nhé!',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    if (confirm('Cậu có chắc muốn xóa cuộc trò chuyện và bắt đầu lại không?')) {
      resetChatSession();
      setMessages([
        {
          id: Date.now().toString(),
          role: Role.MODEL,
          text: 'Chúng mình đã bắt đầu lại. Cậu cần tớ chia sẻ hay tư vấn điều gì không?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleStartQuiz = async (config: QuizConfig) => {
    setIsGeneratingQuiz(true);
    try {
      const questions = await generateQuiz(config);
      setQuizData(questions);
      setIsQuizConfigOpen(false); // Close config, open player
    } catch (error) {
      alert("Không thể tạo câu đố lúc này. Vui lòng thử lại.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="flex flex-col h-full transition-colors duration-500">
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {/* Header */}
        <header className="flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm z-10 flex justify-between items-center transition-colors duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-emerald-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight tracking-tight">
                Cố vấn Bạo lực học đường
              </h1>
               <p className="text-xs text-slate-500 dark:text-slate-400">Luôn lắng nghe và đồng hành cùng bạn</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsQuizConfigOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg text-sm font-medium transition-colors"
            >
              <BrainCircuit size={18} />
              <span>Thử thách</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              title="Giao diện Sáng/Tối"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
              title="Cuộc trò chuyện mới"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth transition-colors duration-500 bg-slate-50 dark:bg-slate-900"
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex justify-start mb-2 animate-fade-in">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce[animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Quick Prompts */}
        {!isLoading && (
            <div className="flex-none bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50 pt-2 transition-colors duration-500">
              <QuickPrompts onSelect={handleSendMessage} disabled={isLoading} />
            </div>
        )}

        {/* Input Area */}
        <footer className="flex-none bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-4 z-10 transition-colors duration-500">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <button
              onClick={() => setIsQuizConfigOpen(true)}
              className="md:hidden flex-none w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <BrainCircuit size={22} />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi hoặc tâm sự của cậu..."
                disabled={isLoading}
                className="w-full pl-5 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60 shadow-inner"
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="flex-none w-12 h-12 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw size={20} className="animate-spin" />
                </div>
              )}
            </button>
          </div>
          <div className="max-w-3xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 transition-colors duration-300">
              Trợ lý AI luôn lắng nghe nhưng nếu cần, hãy chia sẻ với giáo viên hoặc người thân nhé.
            </p>
          </div>
        </footer>

        {/* Modals */}
        <QuizConfigModal 
          isOpen={isQuizConfigOpen} 
          onClose={() => setIsQuizConfigOpen(false)}
          onStartQuiz={handleStartQuiz}
          isLoading={isGeneratingQuiz}
        />

        {quizData && (
          <QuizPlayer 
            questions={quizData} 
            onClose={() => setQuizData(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
