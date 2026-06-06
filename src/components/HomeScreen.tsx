import { useEffect } from 'react';
import { Compass, Trophy, Award, ArrowRight } from 'lucide-react';
import { MODULE_DATA, HUY_HIEU_LIST } from '../data.ts';
import { speakVietnamese } from '../utils/audio.ts';

interface HomeScreenProps {
  selectModule: (moduleId: string) => void;
  points: number;
  completedModules: string[];
  badges: string[];
}

export default function HomeScreen({ selectModule, points, completedModules, badges }: HomeScreenProps) {
  useEffect(() => {
    speakVietnamese("Chào mừng em đến với ứng dụng Khoa Học Ảo Lớp Bốn! Hãy chọn một chủ đề để bắt đầu thí nghiệm nhé!");
  }, []);

  return (
    <div className="space-y-8 animate-fade-in" id="home-screen-root">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-500 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" id="hero-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="space-y-4 max-w-xl z-10" id="hero-text-content">
          <span className="bg-yellow-400 text-slate-900 font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-md inline-block">
            STEM & THÍ NGHIỆM TƯƠNG TÁC
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-sm">
            Khám Phá Thế Giới Khoa Học Diệu Kỳ!
          </h2>
          <p className="text-sky-50 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
            Mô phỏng sinh động, trực quan giúp học sinh lớp 4 nắm vững kiến thức bốc hơi nước, chu trình tuần hoàn tự nhiên, Hệ Mặt Trời bao la và các điều kiện sinh trưởng của thực vật.
          </p>
          <div className="flex gap-3 pt-2" id="hero-metrics">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
              <span className="text-xl">🏆</span>
              <div className="text-left">
                <p className="text-[9px] text-sky-100 uppercase font-black">Điểm của em</p>
                <p className="font-black text-base sm:text-lg leading-none">{points} XP</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
              <span className="text-xl">✅</span>
              <div className="text-left">
                <p className="text-[9px] text-sky-100 uppercase font-black">Thí nghiệm xong</p>
                <p className="font-black text-base sm:text-lg leading-none">{completedModules.length}/4</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 transform hover:scale-105 transition-all duration-500" id="hero-mascot">
          {/* Animated Cartoon Astro-Robot */}
          <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-48 md:h-48 drop-shadow-2xl">
            <circle cx="100" cy="100" r="80" fill="#38bdf8" opacity="0.3" className="animate-pulse" />
            <ellipse cx="100" cy="110" rx="45" ry="35" fill="#f8fafc" />
            {/* Robot Head */}
            <rect x="75" y="55" width="50" height="40" rx="15" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="4" />
            <rect x="85" y="65" width="30" height="20" rx="8" fill="#1e293b" />
            <circle cx="93" cy="75" r="4" fill="#67e8f9" className="animate-ping" />
            <circle cx="93" cy="75" r="3" fill="#06b6d4" />
            <circle cx="107" cy="75" r="3" fill="#06b6d4" />
            {/* Antenna */}
            <line x1="100" y1="55" x2="100" y2="40" stroke="#cbd5e1" strokeWidth="4" />
            <circle cx="100" cy="38" r="6" fill="#f43f5e" />
            {/* Cheerful Arms */}
            <path d="M 55 110 Q 40 90 45 80" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
            <path d="M 145 110 Q 160 90 155 80" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
            {/* Sparkles */}
            <circle cx="45" cy="50" r="4" fill="#fbbf24" />
            <circle cx="160" cy="140" r="5" fill="#34d399" />
          </svg>
        </div>
      </div>

      {/* MODULE CARDS LIST */}
      <div className="space-y-4" id="labs-section">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Compass className="text-blue-500 w-6 h-6 animate-spin-slow" />
          Chọn Phòng Thí Nghiệm Ảo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="module-grid">
          {MODULE_DATA.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            return (
              <div 
                key={module.id}
                id={`module-card-${module.id}`}
                onClick={() => selectModule(module.id)}
                className="group relative bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl border-2 border-slate-100 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between transform hover:-translate-y-2 duration-300 overflow-hidden"
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 shadow-md z-10" id={`badge-completed-${module.id}`}>
                    <Trophy className="w-4 h-4 text-yellow-300" />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                    {module.name.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                      {module.name.substring(module.name.indexOf(' ') + 1)}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 lines-clamp-3">
                      {module.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-600 group-hover:text-blue-700">
                  <span>KHÁM PHÁ NGAY</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REWARDS & BADGES SUMMARY BOX */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-100" id="badge-collection-box">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Award className="text-yellow-500 w-5 h-5 animate-bounce" />
              Sưu Tập Huy Hiệu Danh Dự
            </h4>
            <p className="text-xs text-slate-500">Tích cực giải bài tập và làm thí nghiệm để mở khoá toàn bộ danh hiệu!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {HUY_HIEU_LIST.map((h) => {
            const unlocked = badges.includes(h.id);
            return (
              <div 
                key={h.id} 
                id={`badge-card-${h.id}`}
                className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                  unlocked 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <span className="text-4xl">{h.icon}</span>
                <div>
                  <h5 className="font-extrabold text-sm text-slate-800 leading-tight">{h.name}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{h.desc}</p>
                  {unlocked ? (
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                      ĐÃ ĐẠT ĐƯỢC
                    </span>
                  ) : (
                    <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                      CHƯA ĐẠT (Cần {h.minPoints} XP)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
