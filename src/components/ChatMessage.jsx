import React from 'react';
import { cn } from '../utils/cn';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex w-full items-start",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
        isUser ? "bg-slate-200 text-slate-600 ml-3" : "bg-blue-100 text-blue-600 mr-3"
      )}>
        {isUser ? "교" : "AI"}
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap",
        isUser 
          ? "bg-blue-600 text-white rounded-tr-none" 
          : "bg-white text-slate-800 border rounded-tl-none"
      )}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
