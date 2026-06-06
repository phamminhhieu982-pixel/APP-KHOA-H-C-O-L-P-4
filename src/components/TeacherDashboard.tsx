import { useState } from 'react';
import { BarChart2, Download, Award, CheckCircle2 } from 'lucide-react';
import { Student } from '../types.ts';

interface TeacherDashboardProps {
  currentUserId?: string;
}

export default function TeacherDashboard({ currentUserId }: TeacherDashboardProps) {
  const [students] = useState<Student[]>([
    { id: '1', name: 'Nguyễn Văn An', points: 140, progress: '3/4', lastActive: 'Vừa xong' },
    { id: '2', name: 'Trần Thị Bình', points: 95, progress: '2/4', lastActive: '5 phút trước' },
    { id: '3', name: 'Phạm Minh Cường', points: 180, progress: '4/4', lastActive: '1 giờ trước' },
    { id: '4', name: 'Lê Hoàng Dung', points: 40, progress: '1/4', lastActive: 'Hôm qua' },
    { id: '5', name: 'Ngô Quốc Anh', points: 10, progress: '1/4', lastActive: '3 ngày trước' }
  ]);

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + ["Học sinh,Điểm tích lũy (XP),Số thí nghiệm,Hoạt động gần nhất"].join(",") + "\n"
      + students.map(s => `"${s.name}",${s.points},"${s.progress}","${s.lastActive}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bao_cao_khoa_hoc_lop4.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6 animate-fade-in" id="teacher-dashboard">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4" id="dashboard-header">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BarChart2 className="text-indigo-600 w-6 h-6 animate-pulse" />
            Bảng điều khiển dành cho Giáo viên
          </h2>
          <p className="text-xs text-slate-500 mt-1">Giám sát tiến trình thí nghiệm khoa học ảo lớp 4 của học sinh trong lớp.</p>
        </div>
        <button 
          onClick={exportReport}
          id="btn-export-reports"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md transition-colors w-full md:w-auto justify-center"
        >
          <Download className="w-4 h-4" /> Xuất báo cáo (CSV)
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-stats">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Tổng số học sinh</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-slate-800">{students.length}</p>
            <span className="text-xs text-slate-500">em</span>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Điểm trung bình lớp</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-slate-800">
              {Math.round(students.reduce((acc, s) => acc + s.points, 0) / students.length)}
            </p>
            <span className="text-xs text-yellow-600 font-extrabold">XP</span>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Tỷ lệ hoàn thành STEM</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-black text-slate-800">65%</p>
            <span className="text-xs text-emerald-600 font-extrabold">bài chuẩn</span>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner" id="student-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] sm:text-xs font-black uppercase border-b border-slate-100">
                <th className="p-4">Tên học sinh</th>
                <th className="p-4">Điểm tích lũy</th>
                <th className="p-4">Tiến độ thí nghiệm</th>
                <th className="p-4">Huy hiệu ước tính</th>
                <th className="p-4">Thời gian hoạt động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors" id={`student-row-${s.id}`}>
                  <td className="p-4 font-black text-slate-800">{s.name}</td>
                  <td className="p-4 text-slate-600">{s.points} XP</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-600">{s.progress}/4</span>
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${(parseInt(s.progress[0]) / 4) * 100}%` }}
                          className="bg-emerald-500 h-full"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-base">
                    {s.points >= 150 ? '🥇' : s.points >= 50 ? '🥈' : '🥉'}
                  </td>
                  <td className="p-4 text-slate-400">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-5 bg-yellow-50/60 border border-yellow-200 rounded-2.5xl flex gap-3 items-start" id="educational-tip-box">
        <Award className="text-yellow-600 w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
        <div>
          <h4 className="font-extrabold text-sm text-yellow-900 leading-snug">
            Gợi ý hoạt động bổ trợ STEM tại lớp:
          </h4>
          <p className="text-xs text-yellow-800 mt-1.5 leading-relaxed font-medium">
            Cho học sinh quan sát thí nghiệm "Nước bốc hơi" tương tác trực tiếp trên màn hình tivi chiếu tại lớp, sau đó tổ chức trò chơi ghép tranh Chu trình tuần hoàn nước theo nhóm để tăng tính tương tác và kích thích tư duy thực nghiệm của học sinh lớp 4!
          </p>
        </div>
      </div>
    </div>
  );
}
