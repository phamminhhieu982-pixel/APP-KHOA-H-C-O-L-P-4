import React, { useState, useEffect } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { playSound, speakVietnamese } from '../utils/audio.ts';

interface WaterCycleModuleProps {
  updateProgress: (points: number, moduleToAdd?: string, newBadges?: string[]) => Promise<void>;
  soundEnabled: boolean;
}

interface Stage {
  id: string;
  name: string;
  x: string;
  y: string;
  desc: string;
}

export default function WaterCycleModule({ updateProgress, soundEnabled }: WaterCycleModuleProps) {
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [speed, setSpeed] = useState(1); // 0.5 | 1 | 2
  const [gameCards] = useState([
    { id: 'boc_hoi', name: 'Bốc hơi', desc: 'Nước sông hồ bay lên do nóng' },
    { id: 'ngung_tu', name: 'Ngưng tụ', desc: 'Hơi nước tạo thành mây mát' },
    { id: 'mua', name: 'Mưa', desc: 'Giọt nước nặng rơi xuống đất' },
    { id: 'dong_chay', name: 'Dòng chảy', desc: 'Nước chảy từ núi ra sông hồ' }
  ]);
  const [gameSlots, setGameSlots] = useState<(typeof gameCards[0] | null)[]>([null, null, null, null]);
  const [gameStatus, setGameStatus] = useState<'success' | 'error' | ''>('');

  const cycleStages: Stage[] = [
    { id: 'boc_hoi', name: 'Bốc hơi', x: '18%', y: '65%', desc: 'Mặt Trời tỏa nhiệt sưởi ấm, nước lỏng từ sông, hồ bốc hơi bay lên không trung tạo thành hơi hơi nước.' },
    { id: 'ngung_tu', name: 'Ngưng tụ', x: '45%', y: '25%', desc: 'Hơi nước bay lên cao gặp lạnh, ngưng tụ lại thành các hạt nước nhỏ xíu lơ lửng tạo thành mây bồng bềnh.' },
    { id: 'mua', name: 'Mưa', x: '75%', y: '35%', desc: 'Các giọt nước trong đám mây nặng dần, rơi xuống mặt đất tạo thành cơn mưa tưới mát thiên nhiên lành mạnh.' },
    { id: 'dong_chay', name: 'Dòng chảy', x: '58%', y: '80%', desc: 'Nước mưa ngấm sâu xuống lòng đất hoặc chảy theo sông, suối đổ về ao hồ, biển cả để tiếp tục một chu trình mới.' }
  ];

  useEffect(() => {
    speakVietnamese("Chu trình nước là hành trình bất tận của những giọt nước. Em hãy nhấn vào các nhãn trên vòng tròn hoặc thử kéo ghép tranh nhé!");
  }, []);

  const handleStageClick = (stage: Stage) => {
    if (soundEnabled) playSound('click');
    setActiveStage(stage);
    speakVietnamese(`${stage.name}. ${stage.desc}`);
  };

  const handleDragStart = (e: React.DragEvent, card: typeof gameCards[0]) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    const cardId = e.dataTransfer.getData("cardId");
    const foundCard = gameCards.find(c => c.id === cardId);
    if (!foundCard) return;

    const newSlots = [...gameSlots];
    newSlots[index] = foundCard;
    setGameSlots(newSlots);
  };

  const checkGameResult = () => {
    const correctSequence = ['boc_hoi', 'ngung_tu', 'mua', 'dong_chay'];
    const currentSequence = gameSlots.map(slot => slot ? slot.id : null);
    
    if (JSON.stringify(currentSequence) === JSON.stringify(correctSequence)) {
      setGameStatus('success');
      playSound('success');
      updateProgress(15, 'water-cycle');
      speakVietnamese("Tuyệt vời! Em đã sắp xếp đúng trình tự chu trình tuần hoàn của nước!");
    } else {
      setGameStatus('error');
      playSound('error');
      speakVietnamese("Thử lại nhé em, trình tự nước tuần hoàn chưa thực sự chính xác đâu.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="water-cycle-module">
      {/* VISUAL & INTERACTION BLOCK */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4" id="cycle-map">
        <div className="flex justify-between items-center" id="cycle-map-head">
          <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
            <span className="text-2xl">☁️</span> Bản đồ tương tác Chu Trình Nước
          </h3>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setSpeed(0.5)} 
              className={`px-2 py-1 text-[10px] font-black rounded-lg transition-colors ${speed === 0.5 ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600'}`}
            >
              Chậm
            </button>
            <button 
              onClick={() => setSpeed(1)} 
              className={`px-2 py-1 text-[10px] font-black rounded-lg transition-colors ${speed === 1 ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600'}`}
            >
              Thường
            </button>
            <button 
              onClick={() => setSpeed(2)} 
              className={`px-2 py-1 text-[10px] font-black rounded-lg transition-colors ${speed === 2 ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600'}`}
            >
              Nhanh
            </button>
          </div>
        </div>

        {/* ECOSYSTEM DIAGRAM AREA */}
        <div className="h-80 rounded-2xl bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 border border-slate-200 relative overflow-hidden" id="cycle-canvas-container">
          {/* BACKGROUND MOUNTAIN & LAKE SCENERY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none">
            {/* Mountains */}
            <path d="M 0 400 L 150 150 L 300 400 Z" fill="#94a3b8" />
            <path d="M 200 400 L 450 180 L 600 400 Z" fill="#cbd5e1" />
            {/* Water body */}
            <path d="M 0 350 Q 200 320 400 360 T 800 350 L 800 400 L 0 400 Z" fill="#0284c7" />
          </svg>

          {/* CLOUDS WITH RAIN ANIMATION */}
          <div className="absolute top-10 right-20 flex flex-col items-center" id="cloud-rain-visual">
            <div className="animate-pulse bg-white/95 w-24 h-10 rounded-full shadow-md relative">
              <div className="bg-white/95 w-12 h-12 rounded-full absolute -top-4 left-4"></div>
              <div className="bg-white/95 w-10 h-10 rounded-full absolute -top-2 left-10"></div>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: `${1 / speed}s` }}></span>
              <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-bounce delay-100" style={{ animationDuration: `${1.2 / speed}s` }}></span>
              <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-bounce delay-200" style={{ animationDuration: `${0.8 / speed}s` }}></span>
            </div>
          </div>

          {/* WATER VAPOR FLUX */}
          <div className="absolute bottom-16 left-12 flex gap-4" id="evap-flux">
            <span className="w-2.5 h-2.5 bg-white/50 rounded-full animate-ping" style={{ animationDuration: `${2 / speed}s` }}></span>
            <span className="w-2.5 h-2.5 bg-white/50 rounded-full animate-ping delay-300" style={{ animationDuration: `${1.5 / speed}s` }}></span>
            <span className="w-2.5 h-2.5 bg-white/50 rounded-full animate-ping delay-700" style={{ animationDuration: `${1.8 / speed}s` }}></span>
          </div>

          {/* CLICKABLE STAGES */}
          {cycleStages.map(stage => (
            <button
              key={stage.id}
              onClick={() => handleStageClick(stage)}
              style={{ left: stage.x, top: stage.y }}
              id={`stage-node-${stage.id}`}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-35 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-black shadow-md border-2 transition-all flex items-center gap-1 leading-none ${
                activeStage?.id === stage.id 
                  ? 'bg-yellow-400 border-yellow-500 scale-110 text-slate-900 z-30' 
                  : 'bg-white/90 border-blue-300 hover:border-blue-500 text-blue-700 z-20'
              }`}
            >
              <span>📌</span> {stage.name}
            </button>
          ))}
        </div>

        {/* ACTIVE STAGE INFO BOX */}
        {activeStage && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 animate-fade-in" id="active-stage-card">
            <h4 className="font-extrabold text-sm text-yellow-900 flex items-center gap-2">
              <span>🔍</span> Giai đoạn: {activeStage.name}
            </h4>
            <p className="text-xs text-yellow-800 mt-1 leading-relaxed font-semibold">
              {activeStage.desc}
            </p>
          </div>
        )}
      </div>

      {/* GAME & ORDERING SIDEBAR */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-6" id="cycle-game-panel">
        <div>
          <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
            <HelpCircle className="text-blue-500 w-4 h-4 animate-bounce" />
            Trò chơi: Sắp xếp Chu Trình
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-tight">
            Kéo tên các thẻ giai đoạn đặt vào đúng ô tròn từ trái sang phải theo thứ tự tuần hoàn tự nhiên!
          </p>
        </div>

        {/* CARDS TO DRAG */}
        <div className="grid grid-cols-2 gap-2" id="drag-cards-box">
          {gameCards.map(card => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              className="p-2.5 border-2 border-dashed border-sky-300 bg-sky-50 rounded-xl cursor-grab active:cursor-grabbing text-center text-xs font-extrabold text-sky-800 hover:bg-sky-100 select-none shadow-sm"
            >
              {card.name}
            </div>
          ))}
        </div>

        {/* TARGET SLOTS */}
        <div className="grid grid-cols-4 gap-2" id="drop-slots-box">
          {gameSlots.map((slot, idx) => (
            <div
              key={idx}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, idx)}
              className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-1 text-slate-400 relative overflow-hidden shadow-inner"
            >
              <span className="text-[9px] font-black text-slate-300 block absolute top-1">Bước {idx + 1}</span>
              {slot ? (
                <div className="w-full h-full bg-blue-500 text-white rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black px-1 leading-tight">
                  {slot.name}
                </div>
              ) : (
                <span className="text-base">💧</span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button 
            onClick={checkGameResult}
            disabled={gameSlots.includes(null)}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            id="btn-confirm-ordering"
          >
            KIỂM TRA ĐÁP ÁN
          </button>
          
          <button 
            onClick={() => {
              setGameSlots([null, null, null, null]);
              setGameStatus('');
            }}
            className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-extrabold rounded-xl hover:bg-slate-200"
          >
            XÓA LÀM LẠI
          </button>
        </div>

        {gameStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black p-3.5 rounded-xl text-center shadow-sm">
            🎉 Em đã xếp đúng rồi! Chúc mừng em nhận được 15 điểm thưởng!
          </div>
        )}
        {gameStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3.5 rounded-xl text-center leading-relaxed">
            ❌ Trình tự chưa chính xác. Gợi ý: Nước bốc hơi, tụ lại mây, rơi mưa rồi chảy đổ sông ao!
          </div>
        )}
      </div>
    </div>
  );
}
