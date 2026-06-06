import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PLANET_DETAILS } from '../data.ts';
import { playSound, speakVietnamese } from '../utils/audio.ts';

interface SolarSystemModuleProps {
  updateProgress: (points: number, moduleToAdd?: string, newBadges?: string[]) => Promise<void>;
  soundEnabled: boolean;
}

interface DrawPlanet {
  name: string;
  size: number;
  orbit: number;
  speed: number;
  color: string;
}

export default function SolarSystemModule({ updateProgress, soundEnabled }: SolarSystemModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [guessedOrder, setGuessedOrder] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  const planets: DrawPlanet[] = useMemo(() => [
    { name: 'Mặt Trời', size: 24, orbit: 0, speed: 0, color: '#f97316' },
    { name: 'Sao Thủy', size: 6, orbit: 45, speed: 0.04, color: '#94a3b8' },
    { name: 'Sao Kim', size: 9, orbit: 65, speed: 0.03, color: '#eab308' },
    { name: 'Trái Đất', size: 10, orbit: 90, speed: 0.02, color: '#3b82f6' },
    { name: 'Sao Hỏa', size: 8, orbit: 115, speed: 0.015, color: '#ef4444' },
    { name: 'Sao Mộc', size: 16, orbit: 145, speed: 0.008, color: '#d97706' },
    { name: 'Sao Thổ', size: 14, orbit: 180, speed: 0.006, color: '#facc15' },
    { name: 'Sao Thiên Vương', size: 11, orbit: 215, speed: 0.004, color: '#22d3ee' },
    { name: 'Sao Hải Vương', size: 11, orbit: 245, speed: 0.003, color: '#1d4ed8' }
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let angles = Array(planets.length).fill(0);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Orbit Paths
      planets.forEach((p) => {
        if (p.orbit > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, p.orbit, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Planets
      planets.forEach((p, idx) => {
        let px = cx;
        let py = cy;
        
        if (p.orbit > 0) {
          px = cx + p.orbit * Math.cos(angles[idx]);
          py = cy + p.orbit * Math.sin(angles[idx]);
          angles[idx] += p.speed * orbitSpeed;
        }

        // Draw Glow
        ctx.beginPath();
        ctx.arc(px, py, p.size + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}15`;
        ctx.fill();

        // Draw Core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Ring for Saturn
        if (p.name === 'Sao Thổ') {
          ctx.beginPath();
          ctx.ellipse(px, py, p.size + 8, 4, Math.PI / 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Labels
        if (p.name === 'Mặt Trời' || p.name === selectedPlanet) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.name, px, py - p.size - 6);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [planets, orbitSpeed, selectedPlanet]);

  useEffect(() => {
    speakVietnamese("Hệ Mặt Trời bao gồm Mặt Trời ở trung tâm và tám hành tinh quay quanh nó. Em hãy nhấp vào từng hành tinh để khám phá nhé!");
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let minDiff = 999;
    let foundPlanet: string | null = null;

    planets.forEach(p => {
      const distToCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const diff = Math.abs(distToCenter - p.orbit);
      if (diff < minDiff && diff < 15) {
        minDiff = diff;
        foundPlanet = p.name;
      }
    });

    if (foundPlanet) {
      if (soundEnabled) playSound('click');
      setSelectedPlanet(foundPlanet);
      const info = PLANET_DETAILS[foundPlanet];
      speakVietnamese(`${foundPlanet}. Khoảng cách tới mặt trời là ${info.dist}. ${info.fact}`);
    }
  };

  const handleOrderGuess = (planetName: string) => {
    if (guessedOrder.includes(planetName)) return;
    const newOrder = [...guessedOrder, planetName];
    setGuessedOrder(newOrder);

    const correctSeq = ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương'];
    if (correctSeq[newOrder.length - 1] === planetName) {
      setCorrectCount(prev => prev + 1);
      if (soundEnabled) playSound('success');
    } else {
      if (soundEnabled) playSound('error');
    }

    if (newOrder.length === 8) {
      const finalCorrect = correctSeq.filter((p, i) => newOrder[i] === p).length;
      if (finalCorrect === 8) {
        updateProgress(20, 'solar-system');
        speakVietnamese("Xuất sắc! Em đã sắp xếp đúng cả 8 hành tinh theo khoảng cách từ Mặt Trời!");
      } else {
        speakVietnamese(`Em đã hoàn thành trò chơi vũ trụ với ${finalCorrect} trên 8 vị trí chính xác.`);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="solar-system-module">
      {/* 3D-like CANVAS SIMULATOR */}
      <div className="lg:col-span-2 bg-slate-950 rounded-3xl p-6 shadow-2xl border-4 border-slate-900 relative flex flex-col justify-between overflow-hidden">
        {/* Cosmos background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        <div className="flex justify-between items-center z-10" id="space-controls-head">
          <h3 className="font-extrabold text-xl text-white flex items-center gap-2">
            <span>🪐</span> Thực Nghiệm Vũ Trụ Hệ Mặt Trời
          </h3>
          <button 
            onClick={() => setOrbitSpeed(prev => prev === 0 ? 1 : 0)}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all"
          >
            {orbitSpeed === 0 ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
          </button>
        </div>

        <div className="relative flex justify-center items-center my-4 z-10">
          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            onClick={handleCanvasClick}
            className="max-w-full rounded-2xl bg-black/40 cursor-pointer shadow-inner border border-white/5"
          />
          <div className="absolute bottom-2 text-center text-[10px] text-white/30 pointer-events-none">
            * Nhấn chuột trực tiếp vào hành tinh hoặc vòng quỹ đạo để hiển thị tư liệu khoa học
          </div>
        </div>

        {/* DETAILED FACT BOX */}
        {selectedPlanet && PLANET_DETAILS[selectedPlanet] && (
          <div className="bg-white/10 backdrop-blur border border-white/15 p-4 rounded-2xl text-white animate-fade-in z-10">
            <h4 className="font-extrabold text-sm text-yellow-300 flex items-center gap-2">
              🌠 {selectedPlanet}
            </h4>
            <p className="text-xs text-slate-300 mt-1">Khoảng cách đến Mặt Trời: <strong className="text-white">{PLANET_DETAILS[selectedPlanet].dist}</strong></p>
            <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-semibold">
              {PLANET_DETAILS[selectedPlanet].fact}
            </p>
          </div>
        )}
      </div>

      {/* POSITIONING GAME SIDEBAR */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6 flex flex-col justify-between" id="planet-game">
        <div className="space-y-4">
          <div>
            <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <span>🎮</span> Trò chơi: Khoảng Cách Vũ Trụ
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Sắp xếp các hành tinh theo thứ tự từ gần nhất đến xa nhất so với Mặt Trời ở vị trí trung tâm!
            </p>
          </div>

          {/* LIST OF OPTIONS */}
          <div className="flex flex-wrap gap-1.5" id="planet-options">
            {Object.keys(PLANET_DETAILS).filter(p => p !== 'Mặt Trời').map(pName => (
              <button
                key={pName}
                disabled={guessedOrder.includes(pName)}
                onClick={() => handleOrderGuess(pName)}
                className={`text-[11px] px-2.5 py-1.5 rounded-xl border font-extrabold transition-all ${
                  guessedOrder.includes(pName)
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 active:scale-95'
                }`}
              >
                {pName}
              </button>
            ))}
          </div>

          {/* USER S GUESSED STREAM */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 min-h-[180px] shadow-inner" id="guessed-flow">
            <p className="text-[9px] uppercase font-black text-slate-400 mb-2">Thứ tự của em:</p>
            {guessedOrder.map((p, idx) => {
              const correctOrder = ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương'];
              const isCorrect = correctOrder[idx] === p;
              return (
                <div key={idx} className="flex justify-between items-center text-xs font-bold p-2 bg-white rounded-xl border shadow-sm">
                  <span>{idx + 1}. {p}</span>
                  <span className={isCorrect ? 'text-emerald-500 font-extrabold' : 'text-red-500 font-extrabold'}>
                    {isCorrect ? '✅ Đúng' : '❌ Sai'}
                  </span>
                </div>
              );
            })}
            {guessedOrder.length === 0 && (
              <span className="text-xs text-slate-400 block text-center mt-12 italic">Chưa chọn hành tinh nào</span>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <button 
            onClick={() => {
              setGuessedOrder([]);
              setCorrectCount(0);
            }}
            className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-black rounded-xl hover:bg-slate-200 transition-all active:scale-95"
          >
            CHƠI LẠI TRÒ CHƠI
          </button>

          {guessedOrder.length === 8 && (
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200 animate-slide-up">
              <p className="font-extrabold text-xs text-blue-900">Chúc mừng em hoàn tất hành trình!</p>
              <p className="text-[10px] text-blue-700 font-bold mt-0.5">Vị trí xếp chính xác: {correctCount}/8</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
