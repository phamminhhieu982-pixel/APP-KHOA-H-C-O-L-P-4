import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Thermometer, Sun, CheckCircle2, Award } from 'lucide-react';
import { EVAPORATION_QUIZ } from '../data.ts';
import { playSound, speakVietnamese } from '../utils/audio.ts';

interface EvaporationModuleProps {
  updateProgress: (points: number, moduleToAdd?: string, newBadges?: string[]) => Promise<void>;
  soundEnabled: boolean;
}

export default function EvaporationModule({ updateProgress, soundEnabled }: EvaporationModuleProps) {
  const [temperature, setTemperature] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const steamParticles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 2,
      speed: Math.random() * 1.5 + 1
    }));
  }, []);

  useEffect(() => {
    speakVietnamese("Đây là phòng thí nghiệm Nước Bốc Hơi. Em hãy điều chỉnh thanh trượt nhiệt độ để quan sát hạt nước chuyển hóa nhé!");
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTemperature(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const getWaterColor = () => {
    if (temperature <= 0) return 'bg-cyan-200 border-cyan-300';
    if (temperature >= 100) return 'bg-sky-400 border-sky-500';
    return 'bg-blue-400 border-blue-500';
  };

  const handleStartSim = () => {
    if (soundEnabled) playSound('click');
    setIsPlaying(true);
  };

  const handlePauseSim = () => {
    if (soundEnabled) playSound('click');
    setIsPlaying(false);
  };

  const handleResetSim = () => {
    if (soundEnabled) playSound('click');
    setIsPlaying(false);
    setTemperature(25);
  };

  const submitQuiz = () => {
    let score = 0;
    quizAnswers.forEach((ans, index) => {
      if (ans === EVAPORATION_QUIZ[index].correct) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score === 5) {
      playSound('success');
      updateProgress(15, 'evaporation');
      speakVietnamese("Xuất sắc! Em đã trả lời đúng tuyệt đối toàn bộ câu hỏi ôn tập!");
    } else {
      playSound('error');
      updateProgress(5, 'evaporation');
      speakVietnamese(`Em đạt ${score} trên 5 câu. Hãy xem lời giải chi tiết để học tốt hơn nhé.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="evaporation-module">
      {/* INTERACTIVE BOX */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between" id="evaporation-simulator">
        <div className="space-y-4">
          <div className="flex justify-between items-center" id="evaporation-head">
            <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
              <span className="text-2xl">💧</span> Thí nghiệm: Tác động của Nhiệt độ
            </h3>
            <span className="bg-sky-100 text-sky-800 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Thực hành trực quan
            </span>
          </div>

          {/* SIMULATION VISUAL AREA */}
          <div className="h-64 rounded-2xl bg-gradient-to-b from-sky-50 to-blue-100 border border-slate-200 relative overflow-hidden flex items-end justify-center" id="evaporation-viewport">
            {/* SUN VISUAL */}
            <div 
              style={{ opacity: Math.max(0.1, temperature / 100) }}
              className="absolute top-4 right-4 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform scale-110"
              id="sun-visual"
            >
              <Sun className="w-8 h-8 text-white animate-spin-slow" />
            </div>

            {/* TEMP READOUT */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-sm" id="temp-badge">
              <Thermometer className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-slate-800 font-extrabold">{temperature}°C</span>
            </div>

            {/* STEAM PARTICLES (Animate upward if temp > 40) */}
            {temperature > 40 && (
              <div className="absolute inset-x-0 bottom-24 top-0 pointer-events-none" id="steam-container">
                {steamParticles.map(p => (
                  <div
                    key={p.id}
                    style={{
                      left: `${p.left}%`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.speed / (temperature / 60)}s`
                    }}
                    className="absolute bottom-0 w-2.5 h-2.5 bg-white/60 rounded-full animate-steam"
                  />
                ))}
              </div>
            )}

            {/* CONTAINER & WATER */}
            <div className="w-64 h-32 border-x-4 border-b-4 border-slate-400 rounded-b-2xl relative flex items-end overflow-hidden mb-4 bg-white/10" id="container-beaker">
              {/* WATER VOLUME */}
              <div 
                style={{ height: `${Math.max(10, 80 - (temperature > 50 ? (temperature - 50) * 0.5 : 0))}%` }}
                className={`w-full transition-all duration-305 relative ${getWaterColor()}`}
                id="beaker-liquid"
              >
                {/* ICE CRACKS OR BOILING BUBBLES */}
                {temperature <= 0 && (
                  <div className="absolute inset-0 bg-cyan-100/40 flex items-center justify-center font-black text-cyan-800 text-xs select-none">
                    ❄️ BĂNG ĐÔNG ĐẶC
                  </div>
                )}
                {temperature >= 100 && (
                  <div className="absolute inset-0 flex flex-wrap justify-around items-center opacity-70">
                    <span className="animate-bounce text-lg">🫧</span>
                    <span className="animate-ping text-sm">🫧</span>
                    <span className="animate-bounce text-sm">🫧</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIMULATION CONTROLS */}
          <div className="space-y-4" id="sim-controls">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-500">Trượt để thay đổi nhiệt độ</span>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                {temperature <= 0 ? "❄️ Thể rắn (đóng băng)" : temperature >= 100 ? "🔥 Thể khí (sôi dữ dội)" : "💧 Thể lỏng"}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" 
              id="slider-temperature"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={handleStartSim} 
                disabled={isPlaying}
                className="flex-1 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> BẮT ĐẦU TỰ ĐỘNG
              </button>
              <button 
                onClick={handlePauseSim} 
                disabled={!isPlaying}
                className="flex-1 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Pause className="w-4 h-4" /> TẠM DỪNG
              </button>
              <button 
                onClick={handleResetSim}
                className="flex-1 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-200 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> ĐẶT LẠI
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY EDUCATIONAL INSIGHT */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-2xl mt-6" id="educational-quote-evap">
          <p className="font-extrabold text-sm text-blue-900">💡 Kiến thức lớp 4 em cần nhớ:</p>
          <p className="text-xs text-blue-800 mt-1 font-medium leading-relaxed">
            &quot;Nước ở thể lỏng liên tục bốc hơi để chuyển sang thể hơi (thể khí). Nhiệt độ càng cao (như khi có ánh nắng mặt trời chiếu vào hoặc khi đun nấu) thì nước bốc hơi càng nhanh hơn!&quot;
          </p>
        </div>
      </div>

      {/* COMPANION & QUIZ SIDEBAR */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6" id="evapor-companion-pane">
        <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-4xl">🤖</span>
          <h4 className="font-extrabold text-sm text-slate-800 mt-2">Kiki gợi ý:</h4>
          <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">
            &quot;Khi đã hiểu rõ cơ chế nước bốc hơi dưới nhiệt độ, em hãy nhấn nút bên dưới để bắt đầu luyện tập nhé!&quot;
          </p>
          <button 
            onClick={() => { setShowQuiz(true); speakVietnamese("Bắt đầu giải đố nhé!"); }}
            id="btn-start-evap-quiz"
            className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-extrabold text-xs rounded-2xl shadow-md hover:from-blue-600 transition-colors"
          >
            🔥 THỬ SỨC BÀI TẬP (+15 ĐIỂM)
          </button>
        </div>

        {showQuiz && (
          <div className="space-y-4 animate-fade-in" id="evapor-quiz-area">
            <h4 className="font-extrabold text-slate-800 text-sm border-b pb-2 flex items-center gap-1">
              <span>📝</span> Trắc nghiệm Nước Bốc Hơi
            </h4>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {EVAPORATION_QUIZ.map((q, idx) => (
                <div key={idx} className="space-y-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100" id={`quiz-block-${idx}`}>
                  <p className="font-extrabold text-xs text-slate-800 leading-tight">{idx+1}. {q.q}</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.a.map((ans, aIdx) => (
                      <button
                        key={aIdx}
                        id={`option-${idx}-${aIdx}`}
                        disabled={quizSubmitted}
                        onClick={() => {
                          const updated = [...quizAnswers];
                          updated[idx] = aIdx;
                          setQuizAnswers(updated);
                        }}
                        className={`text-left text-[11px] p-2.5 rounded-lg border transition-all font-semibold ${
                          quizAnswers[idx] === aIdx 
                            ? 'bg-blue-100 border-blue-400 text-blue-950 font-bold' 
                            : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`text-[10px] font-black ${quizAnswers[idx] === q.correct ? 'text-emerald-600' : 'text-red-500'}`}>
                      Đáp án đúng: {q.a[q.correct]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button 
                onClick={submitQuiz}
                disabled={quizAnswers.includes(null)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                id="btn-submit-quiz"
              >
                NỘP BÀI KIỂM TRA
              </button>
            ) : (
              <div className="space-y-2 text-center p-4 bg-emerald-50 border border-emerald-200 rounded-2xl" id="quiz-results">
                <p className="font-extrabold text-sm text-emerald-800 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600 animate-bounce" />
                  Kết quả: {quizScore}/5 câu đúng
                </p>
                <button 
                  onClick={() => {
                    setQuizAnswers(Array(5).fill(null));
                    setQuizSubmitted(false);
                    setShowQuiz(false);
                  }}
                  className="w-full py-2 bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl hover:bg-slate-300"
                >
                  LÀM LẠI BÀI TẬP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
