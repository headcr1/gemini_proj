import React from 'react';
import { cn } from '../utils/cn';

const Sidebar = ({ activeTab, setActiveTab, navItems }) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-xs">CDU</span>
          AI 상담 지원
        </h2>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id 
                ? "bg-blue-600 text-white" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">초당대학교</p>
          <p className="text-sm font-bold text-white">성인학습지원센터</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
