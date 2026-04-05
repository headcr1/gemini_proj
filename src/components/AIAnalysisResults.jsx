import React from 'react';
import { Copy, CheckCircle2, FileText, Sparkles, ArrowRight, Check } from 'lucide-react';

const AIAnalysisResults = ({ result, studentName }) => {
  const [copiedSection, setCopiedSection] = React.useState(null);

  // 섹션 분리 파싱
  const parseResult = (text) => {
    const parts = text.split(/\[향후계획\]/);
    const content = parts[0].replace(/\[상담내용\]/, '').trim();
    const plan = parts[1] ? parts[1].trim() : '';
    return { content, plan };
  };

  const { content, plan } = parseResult(result);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
          AI 지능형 상담 정제 결과
        </h3>
        <span className="text-xs font-medium text-slate-400">
          대상: <span className="text-blue-600 font-bold">{studentName}</span> 학생
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* [상담내용] 섹션 */}
        <div className="bg-white rounded-2xl border-2 border-blue-50 shadow-sm overflow-hidden flex flex-col hover:border-blue-100 transition-colors">
          <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
            <span className="font-bold text-blue-700 flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2" />
              [상담내용]
            </span>
            <button 
              onClick={() => handleCopy(content, 'content')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                copiedSection === 'content' 
                  ? "bg-emerald-500 text-white border-emerald-500" 
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {copiedSection === 'content' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'content' ? "복사됨" : "전체 복사"}
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[150px] font-sans">
              {content || "상담 내용을 생성 중입니다..."}
            </div>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            <span className="text-[11px] text-slate-400 font-medium">사회복지 전문 용어 및 공적 어조 적용됨</span>
          </div>
        </div>

        {/* [향후계획] 섹션 */}
        <div className="bg-white rounded-2xl border-2 border-emerald-50 shadow-sm overflow-hidden flex flex-col hover:border-emerald-100 transition-colors">
          <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
            <span className="font-bold text-emerald-700 flex items-center text-sm">
              <ArrowRight className="w-4 h-4 mr-2" />
              [향후계획]
            </span>
            <button 
              onClick={() => handleCopy(plan, 'plan')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                copiedSection === 'plan' 
                  ? "bg-emerald-500 text-white border-emerald-500" 
                  : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white"
              }`}
            >
              {copiedSection === 'plan' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'plan' ? "복사됨" : "전체 복사"}
            </button>
          </div>
          <div className="p-6 flex-1">
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[150px] font-sans">
              {plan || "향후 계획을 생성 중입니다..."}
            </div>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            <span className="text-[11px] text-slate-400 font-medium">학업 유지 및 공감 중심 전략 적용됨</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-5 rounded-2xl text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/30">
            <Sparkles className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-200 mb-1">교수님을 위한 통합정보시스템 입력 가이드</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              위 내용은 학교 통합정보시스템의 <strong>'상담기록관리'</strong> 메뉴에 각 항목별로 붙여넣으시면 됩니다. 
              성인학습자의 특성을 고려한 맞춤형 문구(~함, ~임)로 생성되었으니, 확인 후 입력하십시오.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisResults;
