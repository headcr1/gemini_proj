export const initialStudents = [
  { id: "20240001", name: "김철수", department: "사회복지학부", major: "사회복지전공", phone: "010-1234-5678" },
  { id: "20240002", name: "이영희", department: "사회복지학부", major: "사회복지전공", phone: "010-2345-6789" },
  { id: "20240003", name: "박민수", department: "사회복지학부", major: "노인복지전공", phone: "010-3456-7890" },
];

export const getStoredStudents = () => {
  const stored = localStorage.getItem('cdu_students');
  return stored ? JSON.parse(stored) : initialStudents;
};

export const saveStudent = (student) => {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem('cdu_students', JSON.stringify(students));
  return students;
};

export const getStoredLogs = (studentId = null) => {
  const stored = localStorage.getItem('cdu_counseling_logs');
  const logs = stored ? JSON.parse(stored) : [];
  if (studentId) {
    return logs.filter(log => log.studentId === studentId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const saveLog = (log) => {
  const logs = getStoredLogs();
  const newLog = {
    ...log,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  logs.push(newLog);
  localStorage.setItem('cdu_counseling_logs', JSON.stringify(logs));
  return logs;
};

export const deleteLog = (logId) => {
  const logs = getStoredLogs();
  const updated = logs.filter(log => log.id !== logId);
  localStorage.setItem('cdu_counseling_logs', JSON.stringify(updated));
  return updated;
};
