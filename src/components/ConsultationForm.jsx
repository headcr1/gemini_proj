import React, { useState, useEffect } from 'react';
import { User, Hash, Briefcase, Calendar, MapPin, AlertCircle, FileText, Search, Check } from 'lucide-react';
import { cn } from '../utils/cn';

const riskFactors = [
  { id: '출석 불안정', label: '출석 불안정' },
  { id: '과제 미흡', label: '과제 미흡' },
  { id: '학업 효능감 저하', label: '학업 효능감 저하' },
  { id: '경제적 부담', label: '경제적 부담' },
  { id: '재직 중(시간 부족)', label: '재직 중(시간 부족)' },
  { id: '사회적 고립', label: '사회적 고립' },
  { id: '건강/가족 문제', label: '건강/가족 문제' },
  { id: '기타 특이사항', label: '기타 특이사항' },
];

const ConsultationForm = ({ 
  studentInfo, 
  setStudentInfo, 
  risks, 
  setRisks, 
  memo, 
  setMemo, 
  onAnalyze, 
  isLoading,
  students,
  onSelectStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.id.includes(searchTerm)
  );

  const handleRiskChange = (id) => {
    setRisks(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSelect = (student) => {
    onSelectStudent(student);
    setSearchTerm(student.name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. 학생 선택 및 인적 사항 */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          상담 대상자 선택 및 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 학생 검색 드롭다운 (F1) */}
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">대상자 검색 (성명/학번)</label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="검색 후 선택하세요..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm group-hover:bg-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            
            {showDropdown && searchTerm && (
              <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(s => (
                    <div 
                      key={s.id}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                      onClick={() => handleSelect(s)}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.id} | {s.department}</p>
                      </div>
                      {studentInfo.studentId === s.id && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-slate-400 text-sm italic">
                    일치하는 학생이 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">학번</label>
            <div className="relative group">
              <input 
                type="text" 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none"
                value={studentInfo.studentId}
              />
              <Hash className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">상담 일시</label>
            <div className="relative group">
              <input 
                type="datetime-local" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm group-hover:bg-white"
                value={studentInfo.date}
                onChange={(e) => setStudentInfo({...studentInfo, date: e.target.value})}
              />
              <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 리스크 진단 (F2 관련) */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
            <AlertCircle className="w-4 h-4 text-orange-500" />
          </div>
          성인 학습자 주요 리스크 진단 (복수 선택)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {riskFactors.map((risk) => (
            <label 
              key={risk.id}
              className={cn(
                "group flex items-center p-3.5 rounded-xl border cursor-pointer transition-all text-sm select-none",
                risks.includes(risk.id) 
                  ? "bg-orange-50 border-orange-200 text-orange-700 ring-2 ring-orange-500/10" 
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-white"
              )}
            >
              <input 
                type="checkbox" 
                className="hidden" 
                checked={risks.includes(risk.id)}
                onChange={() => handleRiskChange(risk.id)}
              />
              <div className={cn(
                "w-5 h-5 rounded-md border mr-3 flex items-center justify-center transition-all",
                risks.includes(risk.id) ? "bg-orange-500 border-orange-500" : "bg-white border-slate-300 group-hover:border-slate-400"
              )}>
                {risks.includes(risk.id) && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{risk.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 3. 비정형 메모 입력 (F2) */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm relative">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          실시간 상담 메모 (비정형 텍스트)
        </h3>
        <textarea 
          placeholder="교수님의 간략한 메모(예: 50대, 드론 사업, 출석 걱정)를 입력하세요. AI가 사회복지 용어로 정제합니다."
          className="w-full h-56 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm leading-relaxed resize-none group-hover:bg-white"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-slate-400 flex items-center italic">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            [상담내용]과 [향후계획] 섹션으로 자동 분리되어 생성됩니다.
          </p>
          <button 
            onClick={onAnalyze}
            disabled={isLoading || !memo.trim() || !studentInfo.studentId}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                사회복지 용어 변환 중...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                상담 기록 정제 실행
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConsultationForm;
