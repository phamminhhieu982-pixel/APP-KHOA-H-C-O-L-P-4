import { useState, useEffect } from 'react';
import { playSound, speakVietnamese } from '../utils/audio.ts';

interface PlantGrowthModuleProps {
  updateProgress: (points: number, moduleToAdd?: string, newBadges?: string[]) => Promise<void>;
  soundEnabled: boolean;
}

export default function PlantGrowthModule({ updateProgress, soundEnabled }: PlantGrowthModuleProps) {
  const [light, setLight] = useState(50);
  const [water, setWater] = useState(50);
  const [soil, setSoil] = useState('phì nhiêu'); // cát | sét | phì nhiêu
  const [temp, setTemp] = useState(25);
  const [growthStage, setGrowthStage] = useState(0); // 0 (hạt) -> 4 (hoa)
  const [isWilted, setIsWilted] = useState(false);
  const [growthMessage, setGrowthMessage] = useState('Gieo hạt mầm nhỏ xuống đất ấm áp.');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    speakVietnamese("Tại đây em có thể điều khiển Ánh sáng, Nước, và Nhiệt độ để nuôi cây khỏe mạnh gieo hạt giống lớn khôn!");
  }, []);

  const runSimulation = () => {
    if (soundEnabled) playSound('click');
    setIsSimulating(true);
    setGrowthStage(0);
    setIsWilted(false);
    setGrowthMessage('Hạt giống đang được ủ ẩm trong lòng đất...');

    setTimeout(() => {
      // Step 1: Sprout
      if (water < 20 || temp < 10) {
        setIsWilted(true);
        setGrowthMessage('Hạt giống không thể nảy mầm vì thiếu độ ẩm trầm trọng hoặc nhiệt độ quá lạnh giá.');
        setIsSimulating(false);
        return;
      }
      setGrowthStage(1);
      setGrowthMessage('Tuyệt vời! Hạt của em đã nảy ra những chiếc mầm nhỏ xanh mướt!');
      
      setTimeout(() => {
        // Step 2: Leaves
        if (light < 22) {
          setGrowthStage(2);
          setGrowthMessage('Cây con mọc cao vống nhưng thân mỏng manh, nhợt nhạt do thiếu ánh mặt trời quang hợp.');
          setIsSimulating(false);
          return;
        }
        setGrowthStage(2);
        setGrowthMessage('Cây non bắt đầu bung xòe những chiếc lá đầu tiên đón nắng đầy sức sống!');

        setTimeout(() => {
          // Step 3: Buds & Flower
          if (water > 82) {
            setIsWilted(true);
            setGrowthMessage('Cây bị thối rễ nặng héo úa do tưới quá nhiều nước gây ngập úng đất.');
            setIsSimulating(false);
            return;
          }
          if (soil !== 'phì nhiêu') {
            setGrowthStage(3);
            setGrowthMessage('Cây bị chậm phát triển, còi cọc vì thiếu khoáng chất vi lượng trong đất cát hoặc đất sét chặt.');
            setIsSimulating(false);
            return;
          }
          if (temp > 42) {
            setIsWilted(true);
            setGrowthMessage('Cây bị khô héo, cháy xém lá do nhiệt độ không khí quá nóng bức.');
            setIsSimulating(false);
            return;
          }
          setGrowthStage(4);
          setGrowthMessage('🎉 Chúc mừng em đã thắng cuộc! Cây lớn bùng nổ, khoe sắc qua những bông hoa đỏ thẫm lung linh!');
          setIsSimulating(false);
          updateProgress(20, 'plant-growth');
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="plant-growth-module">
      {/* SIMULATOR VIEWPORT */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between" id="plant-growth-simulator">
        <div className="space-y-4">
          <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
            <span>🌱</span> Thực nghiệm: Sinh trưởng thực vật lớp 4
          </h3>

          {/* PLANT GRAPHICS VIEWPORT */}
          <div className="h-72 rounded-2xl bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 border border-slate-200 relative overflow-hidden flex flex-col justify-end items-center pb-4" id="plant-growth-viewport">
            {/* Sun Glow */}
            <div 
              style={{ opacity: light / 100 }}
              className="absolute top-4 left-4 w-12 h-12 bg-yellow-300 rounded-full blur-sm transition-all duration-300"
            />

            {/* Clouds / Rain */}
            {water > 60 && (
              <div className="absolute top-4 right-12 text-slate-400 select-none text-xl" id="rain-indicator">
                🌧️ <span className="animate-bounce inline-block text-blue-500 font-bold">💧</span>
              </div>
            )}

            {/* Temperature warning */}
            {temp < 15 && (
              <div className="absolute inset-0 bg-blue-200/10 pointer-events-none flex items-center justify-center font-black text-blue-500/20 text-3xl">
                CỰC LẠNH GIÁ
              </div>
            )}
            {temp > 40 && (
              <div className="absolute inset-0 bg-red-200/10 pointer-events-none flex items-center justify-center font-black text-red-505/20 text-3xl">
                CỰC NÓNG BỨC
              </div>
            )}

            {/* COMPONENT PLANT ILLUSTRATION (SVG RENDERINGS) */}
            <div className="relative w-32 h-44 flex items-end justify-center z-10" id="plant-graphic-beaker">
              {growthStage === 0 && !isWilted && (
                <div className="w-4 h-4 bg-amber-800 rounded-full translate-y-3 animate-bounce shadow" title="Hạt giống gieo" />
              )}
              {growthStage === 1 && !isWilted && (
                <svg viewBox="0 0 100 100" className="w-16 h-16 transition-all duration-300">
                  <path d="M50,100 L50,80 Q50,70 60,65" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
                  <path d="M60,65 Q70,60 65,55 T55,65 Z" fill="#4ade80" />
                </svg>
              )}
              {growthStage === 2 && !isWilted && (
                <svg viewBox="0 0 100 100" className="w-20 h-20 transition-all duration-300">
                  <path d="M50,100 L50,60 Q50,40 35,30 M50,70 Q50,50 65,40" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
                  <path d="M35,30 Q25,25 30,20 T40,30 Z" fill="#4ade80" />
                  <path d="M65,40 Q75,35 70,30 T60,40 Z" fill="#4ade80" />
                </svg>
              )}
              {growthStage === 3 && !isWilted && (
                <svg viewBox="0 0 100 100" className="w-28 h-28 transition-all duration-300">
                  <path d="M50,100 L50,40 M50,80 Q35,70 30,60 M50,65 Q65,55 70,45" fill="none" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" />
                  <path d="M30,60 Q20,55 25,50 T35,60 Z" fill="#4ade80" />
                  <path d="M70,45 Q80,40 75,35 T65,45 Z" fill="#4ade80" />
                  <circle cx="50" cy="35" r="8" fill="#eab308" />
                </svg>
              )}
              {growthStage === 4 && !isWilted && (
                <svg viewBox="0 0 100 100" className="w-32 h-32 animate-pulse transition-all duration-300">
                  <path d="M50,100 L50,30 M50,80 Q35,70 30,60 M50,65 Q65,55 70,45" fill="none" stroke="#16a34a" strokeWidth="8" />
                  <path d="M30,60 Q20,55 25,50 T35,60 Z" fill="#22c55e" />
                  <path d="M70,45 Q80,40 75,35 T65,45 Z" fill="#22c55e" />
                  <circle cx="50" cy="20" r="10" fill="#ef4444" />
                  <circle cx="38" cy="28" r="10" fill="#ef4444" />
                  <circle cx="62" cy="28" r="10" fill="#ef4444" />
                  <circle cx="44" cy="38" r="10" fill="#ef4444" />
                  <circle cx="56" cy="38" r="10" fill="#ef4444" />
                  <circle cx="50" cy="28" r="8" fill="#facc15" />
                </svg>
              )}
              {isWilted && (
                <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-70 transition-all duration-300">
                  <path d="M50,100 Q40,80 30,85" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                  <path d="M30,85 Q20,90 22,95 T30,90 Z" fill="#854d0e" />
                </svg>
              )}
            </div>

            {/* Soil Ground */}
            <div className="w-full h-8 bg-amber-900 border-t-4 border-amber-950 flex justify-center items-center font-black text-xs text-amber-100 uppercase tracking-wider drop-shadow select-none">
              ĐẤT TRỒNG: {soil}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="growth-parameter-controls">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-500">☀ Ánh sáng: {light}%</span>
              <input type="range" min="0" max="100" value={light} onChange={(e) => setLight(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-slate-500">💧 Nước: {water}%</span>
              <input type="range" min="0" max="100" value={water} onChange={(e) => setWater(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-slate-500">🌡 Nhiệt độ: {temp}°C</span>
              <input type="range" min="0" max="50" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-slate-500">🌱 Loại đất trồng</span>
              <select 
                value={soil} 
                onChange={(e) => setSoil(e.target.value)}
                className="w-full p-1.5 border border-slate-200 rounded-xl text-xs font-black bg-white text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="cát">Đất Cát (Thấm hút quá nhanh, nghèo chất dinh dưỡng)</option>
                <option value="sét">Đất Sét (Bóng chặt, nghẹt rễ cây)</option>
                <option value="phì nhiêu">Đất Phì Nhiêu (Xốp thoáng tốt, nhiều mùn dinh dưỡng)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:from-emerald-600 active:scale-95 transition-all disabled:opacity-50"
          id="btn-simulate-plant"
        >
          {isSimulating ? '🔄 Đang mô phỏng tăng tốc thời gian...' : '🌱 BẮT ĐẦU GIEO MẦM THỰC NGHIỆM'}
        </button>
      </div>

      {/* COMPANION SIDEBAR */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col justify-between" id="plant-companion-pane">
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <h4 className="font-extrabold text-xs text-emerald-800 uppercase tracking-widest">
              Nhật Ký Phát Triển Của Cây
            </h4>
            <p className="text-xs text-slate-700 mt-2 font-semibold leading-relaxed" id="growth-feedback">
              {growthMessage}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
            <h5 className="font-black text-xs text-blue-900 leading-tight">Mẹo nuôi cây cho học sinh lớp 4:</h5>
            <ul className="text-[10px] text-blue-800 space-y-1.5 list-disc list-inside font-semibold leading-relaxed">
              <li>Cây cần nước vừa đủ ôn hòa (40%-70%), tưới quá đầy sẽ ngập rễ hỏng cây.</li>
              <li>Lá xanh cần năng lượng ánh sáng cực khỏe để thực hiện quang hợp.</li>
              <li>Nên gieo vào đất phì nhiêu màu mỡ có tơi xốp hỗ trợ hô hấp.</li>
              <li>Nhiệt độ sinh sôi tuyệt vời nhất là từ 20 đến 35 độ C!</li>
            </ul>
          </div>
        </div>

        <div className="text-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 mt-6 select-none">
          <span className="text-4xl">🤖</span>
          <p className="text-xs text-slate-600 mt-2 font-extrabold italic leading-snug">
            &quot;Hãy thực nghiệm thành công để nhận huy hiệu Nhà khoa học xuất sắc nhé!&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
