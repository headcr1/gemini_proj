import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="p-6 bg-white border-t shrink-0">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <button 
          type="button" 
          className="p-3 text-slate-400 hover:text-blue-600 transition-colors bg-slate-100 rounded-xl"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="상담 내용을 입력하세요 (예: 사회복지학과 성인학습자 장학금 안내 부탁해)"
          className="flex-1 bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 rounded-xl px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="p-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 transition-all shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      <p className="mt-3 text-[10px] text-slate-400 text-center">
        제미나이 1.5 플래시 AI가 답변을 생성합니다. 중요한 학사 규정은 반드시 관련 부서에 재확인 바랍니다.
      </p>
    </div>
  );
};

export default ChatInput;
