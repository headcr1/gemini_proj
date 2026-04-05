import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ConsultationForm from './components/ConsultationForm';
import AIAnalysisResults from './components/AIAnalysisResults';
import ChatContainer from './components/ChatContainer';
import { LayoutDashboard, MessageSquare, BookOpen, FileText, History, UserCheck, Trash2 } from 'lucide-react';
import { getGeminiResponse } from './services/gemini';
import { getStoredStudents, getStoredLogs, saveLog, deleteLog } from './data/storage';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [counselingLogs, setCounselingLogs] = useState([]);
  
  // State for Consultation (Updated with 5 fields)
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    studentId: '',
    department: '',
    major: '',
    phone: '',
    date: new Date().toISOString().slice(0, 16),
  });
  const [risks, setRisks] = useState([]);
  const [memo, setMemo] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    setStudents(getStoredStudents());
    setCounselingLogs(getStoredLogs());
  }, []);

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'consultation', label: '상담 지원 시스템', icon: FileText },
    { id: 'ai_chat', label: 'AI 지능형 상담원', icon: MessageSquare },
    { id: 'history', label: '전체 상담 이력', icon: History },
    { id: 'students', label: '학생 명단 관리', icon: UserCheck },
  ];

  const handleSelectStudent = (student) => {
    setStudentInfo({
      ...studentInfo,
      name: student.name,
      studentId: student.id,
      department: student.department,
      major: student.major,
      phone: student.phone
    });
    // 해당 학생의 과거 이력 필터링
    const history = getStoredLogs(student.id);
    setCounselingLogs(history);
  };

  const handleDeleteLog = (logId) => {
    if (confirm("이 상담 기록을 완전히 삭제하시겠습니까?")) {
      deleteLog(logId);
      // 목록 즉시 갱신
      if (studentInfo.studentId) {
        setCounselingLogs(getStoredLogs(studentInfo.studentId));
      } else {
        setCounselingLogs(getStoredLogs());
      }
    }
  };

  const handleAnalyze = async () => {
    if (!memo.trim()) return;
    setIsLoading(true);
    try {
      const prompt = `
당신은 초당대학교 지도교수를 돕는 AI 비서입니다.
다음 비정형 상담 메모를 바탕으로 대학 통합정보시스템 양식에 맞춰 전문적인 사회복지 상담 용어로 변환하세요.

[학생 정보]
- 성명: ${studentInfo.name}
- 학번: ${studentInfo.studentId}
- 소속: ${studentInfo.department} / ${studentInfo.major}
- 연락처: ${studentInfo.phone}
- 주요 리스크: ${risks.join(', ')}

[상담 메모]
${memo}

[작성 지침]
1. 반드시 **[상담내용]**과 **[향후계획]** 두 섹션으로만 강제 분리하여 작성할 것.
2. 성인학습자의 특수한 상황(직장 병행, 가족 돌봄, 경제적 부담 등)에 공감하며 학업 유지를 독려하는 문체를 사용할 것.
3. 전문적인 사회복지 상담 용어를 사용할 것.
4. 문장은 (~함, ~임)의 공적인 보고서 형식을 사용할 것.
5. 불필요한 서론이나 결론 없이 지정된 두 섹션만 출력할 것.`;

      const response = await getGeminiResponse([{ role: 'user', content: prompt }]);
      
      const sections = response.split(/\[향후계획\]/);
      const content = sections[0].replace(/\[상담내용\]/, '').trim();
      const plan = sections[1] ? sections[1].trim() : '';

      const logData = {
        studentId: studentInfo.studentId,
        studentName: studentInfo.name,
        date: studentInfo.date,
        memo: memo,
        risks: risks, // 리스크 항목 추가
        analysis: response,
        content: content,
        plan: plan
      };

      saveLog(logData);
      setAnalysisResult(response);
      setCounselingLogs(getStoredLogs(studentInfo.studentId));
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("분석 중 오류가 발생했습니다. API 키 설정을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shrink-0 z-10">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-800">
              {navItems.find(item => item.id === activeTab)?.label}
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-500">초당대학교 사회복지전공 지도교수</span>
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
              전문 모드
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard students={students} logs={getStoredLogs()} />
            )}

            {activeTab === 'consultation' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 space-y-8">
                    <ConsultationForm 
                      studentInfo={studentInfo}
                      setStudentInfo={setStudentInfo}
                      risks={risks}
                      setRisks={setRisks}
                      memo={memo}
                      setMemo={setMemo}
                      onAnalyze={handleAnalyze}
                      isLoading={isLoading}
                      students={students}
                      onSelectStudent={handleSelectStudent}
                    />
                    
                    {analysisResult && (
                      <AIAnalysisResults 
                        result={analysisResult} 
                        studentName={studentInfo.name}
                      />
                    )}
                  </div>

                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 flex items-center px-1">
                      <History className="w-4 h-4 mr-2" />
                      최근 상담 이력
                    </h3>
                    <div className="space-y-3">
                      {counselingLogs.length > 0 ? (
                        counselingLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="bg-white p-4 rounded-xl border shadow-sm text-sm relative group">
                            <button 
                              onClick={() => handleDeleteLog(log.id)}
                              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <p className="font-bold text-slate-800">{log.studentName}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                            <p className="text-slate-600 mt-2 line-clamp-2 text-xs leading-relaxed">
                              {log.content || log.memo}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 bg-slate-100/50 rounded-xl border border-dashed text-slate-400 text-xs">
                          이력이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai_chat' && (
              <div className="h-[calc(100vh-12rem)] bg-white rounded-2xl border shadow-sm overflow-hidden">
                <ChatContainer />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">전체 상담 이력 관리</h2>
                  <button 
                    onClick={() => {
                      const logs = getStoredLogs();
                      const headers = ['상담일시', '학번', '성명', '상담내용', '향후계획'];
                      const csvContent = [
                        headers.join(','),
                        ...logs.map(log => [
                          new Date(log.timestamp).toLocaleString(),
                          log.studentId || '',
                          log.studentName || '',
                          `"${(log.content || '').replace(/"/g, '""')}"`,
                          `"${(log.plan || '').replace(/"/g, '""')}"`
                        ].join(','))
                      ].join('\n');
                      
                      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute("download", `counseling_logs_${new Date().toISOString().slice(0,10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    엑셀(CSV)로 내보내기
                  </button>
                </div>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                      <tr>
                        <th className="px-6 py-4">일시</th>
                        <th className="px-6 py-4">학번</th>
                        <th className="px-6 py-4">성명</th>
                        <th className="px-6 py-4">상담 요약</th>
                        <th className="px-6 py-4">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {getStoredLogs().map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-medium">{log.studentId}</td>
                          <td className="px-6 py-4">{log.studentName}</td>
                          <td className="px-6 py-4 text-slate-600 line-clamp-1 max-w-xs">{log.content || log.memo || ''}</td>
                          <td className="px-6 py-4 flex gap-3">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`[상담내용]\n${log.content || ''}\n\n[향후계획]\n${log.plan || ''}`);
                                alert('전체 내용이 클립보드에 복사되었습니다.');
                              }}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              복사
                            </button>
                            <button 
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-red-500 font-bold hover:underline"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">학생 명단 관리</h2>
                  <div className="flex gap-3">
                    <label className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 cursor-pointer transition-all flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      CSV 명단 가져오기
                      <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const text = event.target.result;
                              const lines = text.split('\n').slice(1); // 헤더 제외
                              const newStudents = lines.map(line => {
                                // 학과, 주전공, 학번, 이름, 연락처 순서 지원
                                const [dept, major, id, name, phone] = line.split(',').map(s => s.trim());
                                if (id && name) return { department: dept, major, id, name, phone };
                                return null;
                              }).filter(Boolean);
                              
                              const updated = [...students];
                              newStudents.forEach(ns => {
                                const idx = updated.findIndex(s => s.id === ns.id);
                                if (idx >= 0) updated[idx] = ns;
                                else updated.push(ns);
                              });
                              
                              localStorage.setItem('cdu_students', JSON.stringify(updated));
                              setStudents(updated);
                              alert(`${newStudents.length}명의 학생 정보가 업데이트되었습니다.`);
                            };
                            reader.readAsText(file, 'euc-kr');
                          }
                        }}
                      />
                    </label>
                    <button 
                      onClick={() => {
                        if (confirm("경고: 모든 학생 정보와 상담 기록이 영구적으로 삭제됩니다. 정말로 전체 초기화하시겠습니까?")) {
                          localStorage.removeItem('cdu_students');
                          localStorage.removeItem('cdu_counseling_logs');
                          setStudents([]);
                          setCounselingLogs([]);
                          setStudentInfo({
                            name: '',
                            studentId: '',
                            department: '',
                            major: '',
                            phone: '',
                            date: new Date().toISOString().slice(0, 16),
                          });
                          alert("모든 데이터가 초기화되었습니다.");
                        }
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      전체 삭제
                    </button>
                    <button 
                      onClick={() => {
                        const dept = prompt("학과를 입력하세요:");
                        const major = prompt("주전공을 입력하세요:");
                        const id = prompt("학번을 입력하세요:");
                        const name = prompt("성명을 입력하세요:");
                        const phone = prompt("연락처를 입력하세요:");
                        if (id && name) {
                          const newStudent = { department: dept, major, id, name, phone };
                          const updated = [...students, newStudent];
                          localStorage.setItem('cdu_students', JSON.stringify(updated));
                          setStudents(updated);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      개별 학생 추가
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                      <tr>
                        <th className="px-6 py-4">학과/전공</th>
                        <th className="px-6 py-4">학번</th>
                        <th className="px-6 py-4">성명</th>
                        <th className="px-6 py-4">연락처</th>
                        <th className="px-6 py-4">상담 횟수</th>
                        <th className="px-6 py-4">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">{student.department}</p>
                            <p className="text-xs text-slate-400">{student.major}</p>
                          </td>
                          <td className="px-6 py-4 font-mono">{student.id}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                          <td className="px-6 py-4 text-slate-500">{student.phone}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                              {getStoredLogs(student.id).length}건
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                if (confirm(`${student.name} 학생 정보를 삭제하고 관련된 모든 상담 기록을 영구 삭제하시겠습니까?`)) {
                                  // 1. 학생 명단에서 삭제
                                  const updatedStudents = students.filter(s => s.id !== student.id);
                                  localStorage.setItem('cdu_students', JSON.stringify(updatedStudents));
                                  setStudents(updatedStudents);
                                  
                                  // 2. 해당 학생의 모든 상담 기록 삭제
                                  const allLogs = getStoredLogs();
                                  const updatedLogs = allLogs.filter(log => log.studentId !== student.id);
                                  localStorage.setItem('cdu_counseling_logs', JSON.stringify(updatedLogs));
                                  
                                  // 3. UI 상태 갱신
                                  if (studentInfo.studentId === student.id) {
                                    setStudentInfo({
                                      name: '',
                                      studentId: '',
                                      department: '',
                                      major: '',
                                      phone: '',
                                      date: new Date().toISOString().slice(0, 16),
                                    });
                                    setAnalysisResult(null);
                                    setMemo('');
                                    setRisks([]);
                                  }
                                  setCounselingLogs(getStoredLogs(studentInfo.studentId));
                                  
                                  alert(`${student.name} 학생의 정보와 모든 상담 이력이 삭제되었습니다.`);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
