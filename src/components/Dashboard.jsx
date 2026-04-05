import React from 'react';
import { Users, FileText, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = ({ students, logs }) => {
  // 통계 데이터 계산
  const totalStudents = students.length;
  const totalLogs = logs.length;
  
  // 리스크 통계 계산
  const riskStats = {};
  logs.forEach(log => {
    if (log.risks && Array.isArray(log.risks)) {
      log.risks.forEach(risk => {
        riskStats[risk] = (riskStats[risk] || 0) + 1;
      });
    }
  });

  const sortedRisks = Object.entries(riskStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: '전체 관리 학생', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '누적 상담 건수', value: totalLogs, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '이번 달 상담', value: logs.filter(l => new Date(l.timestamp).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '집중 관리 대상', value: new Set(logs.filter(l => l.risks && l.risks.length >= 2).map(l => l.studentId)).size, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 리스크 분포 */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            주요 상담 리스크 분포
          </h3>
          <div className="space-y-5">
            {sortedRisks.length > 0 ? (
              sortedRisks.map(([risk, count], idx) => (
                <div key={risk} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">{risk}</span>
                    <span className="text-slate-500">{count}건 ({totalLogs > 0 ? (count / totalLogs * 100).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-orange-400' : 'bg-orange-300'
                      }`}
                      style={{ width: `${totalLogs > 0 ? (count / totalLogs * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">
                분석 데이터가 부족합니다.
              </div>
            )}
          </div>
        </div>

        {/* 최근 상담 현황 */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            최근 상담 동향
          </h3>
          <div className="space-y-4">
            {logs.slice(0, 4).map((log, idx) => (
              <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                  {log.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-slate-800">{log.studentName}</p>
                    <span className="text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{log.content || log.memo}</p>
                  <div className="flex gap-1 mt-2">
                    {log.risks?.slice(0, 2).map(r => (
                      <span key={r} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded-md font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm italic">
                최근 상담 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
