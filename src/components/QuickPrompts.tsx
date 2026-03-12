import React from 'react';
import { ShieldAlert, HeartHandshake, Smartphone, AlertTriangle, Shield } from 'lucide-react';
import { QuickPrompt } from '../types';

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const PROMPTS: QuickPrompt[] =[
  {
    id: '1',
    label: 'Bị bắt nạt',
    prompt: 'Tớ phải làm gì khi bị bạn bè bắt nạt hoặc tẩy chay ở trường?',
    icon: <ShieldAlert size={14} />,
  },
  {
    id: '2',
    label: 'Giúp bạn bè',
    prompt: 'Làm sao để giúp một người bạn đang bị bạo lực học đường?',
    icon: <HeartHandshake size={14} />,
  },
  {
    id: '3',
    label: 'Bắt nạt mạng',
    prompt: 'Tớ đang bị nói xấu và đe dọa trên mạng xã hội, tớ nên làm gì?',
    icon: <Smartphone size={14} />,
  },
  {
    id: '4',
    label: 'Báo cáo',
    prompt: 'Tớ muốn báo cáo việc bị bạo lực thì nên tìm ai và nói như thế nào?',
    icon: <AlertTriangle size={14} />,
  },
  {
    id: '5',
    label: 'Tự bảo vệ',
    prompt: 'Tớ cần những kỹ năng gì để tự bảo vệ bản thân khỏi kẻ bắt nạt?',
    icon: <Shield size={14} />,
  }
];

const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="px-4 py-3 overflow-x-auto no-scrollbar mask-gradient-sides">
      <div className="flex gap-2 min-w-max mx-auto md:justify-center">
        {PROMPTS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.prompt)}
            disabled={disabled}
            className="flex items-center gap-2 whitespace-nowrap px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <span className="text-emerald-500">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPrompts;
