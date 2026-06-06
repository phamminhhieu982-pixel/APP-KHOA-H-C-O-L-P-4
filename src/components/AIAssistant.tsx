import { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';
import { Message } from '../types.ts';
import { playSound, speakVietnamese } from '../utils/audio.ts';

interface AIAssistantProps {
  soundEnabled: boolean;
}

export default function AIAssistant({ soundEnabled }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Chào em! Anh là robot giáo dục KIKI. Anh có thể giải đáp mọi thắc mắc về nước bốc hơi, mây mưa dông bão, Hệ Mặt Trời quy mô hoặc cách gieo trồng chăm hoa lớp 4 nhé! 🌟' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakOnResponse, setSpeakOnResponse] = useState(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleQuickTopic = (topic: string) => {
    if (soundEnabled) playSound('click');
    setInputValue(topic);
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || loading) return;

    if (soundEnabled) playSound('click');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data = await response.json();
      const reply = data.text || 'Xin lỗi em, anh Kiki bị mất sóng vũ trụ một chút. Em hãy thử lại sau nhé!';
      
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      if (speakOnResponse) {
        speakVietnamese(reply);
      }
    } catch (error) {
      console.warn('Real AI Response failure, falling back to local curriculum insights:', error);
      
      // Local curriculum fallback smart rules
      let reply = "Câu hỏi thật thú vị gieo mầm đam mê! Học sinh lớp 4 lưu ý: Nước bốc hơi tạo thành mây, mây tạo mưa tưới tắm thực vật, và các hành tinh quay quanh Mặt Trời của chúng ta nhe!";
      const lower = text.toLowerCase();
      
      if (lower.includes('mưa') || lower.includes('chu trình') || lower.includes('mây')) {
        reply = "☁️ Tuyệt diệu quá! Mưa được tạo ra khi hơi nước từ ao hồ bốc lên cao gặp không khí lạnh ngưng tụ thành hạt bụi mây nước li ti. Khi mây nặng hạt trĩu dần sẽ rơi xuống đất thành hạt mưa mát rượi đó!";
      } else if (lower.includes('hành tinh') || lower.includes('hệ mặt trời') || lower.includes('vũ trụ')) {
        reply = "🪐 Em biết không? Hệ Mặt Trời gồm Mặt Trời tỏa nắng khổng lồ ở trung tâm và tám hành tinh (Sao Thủy, Sao Kim, Trái Đất thân yêu, Sao Hỏa đỏ rực, Sao Mộc khổng lồ, Sao Thổ có vành đai, Sao Thiên Vương, Sao Hải Vương) liên tục chuyển động quanh nó theo lực hút!";
      } else if (lower.includes('bốc hơi') || lower.includes('sôi')) {
        reply = "💧 Hiện tượng bốc hơi xảy ra khi nước thể lỏng biến chuyển thành hơi thể khí bay lơ lửng. Khi nhiệt độ tăng cao hoặc có gió thổi làm khô ráo, các phân tử nước bốc hơi nhanh gấp bội!";
      } else if (lower.includes('cây') || lower.includes('thực vật') || lower.includes('đầm') || lower.includes('đất')) {
        reply = "🌱 Để hạt nảy mầm và phát triển cây xanh trĩu cành, em cần đáp ứng đủ 4 điều kiện: Ánh sáng sưởi ấm để diệp lục quang hợp, Nước vừa vặn bù ẩm, Nhiệt độ mát mẻ (20-35°C), và gieo trên nền Đất phì nhiêu màu mỡ có chất mùn phong phú!";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      if (speakOnResponse) {
        speakVietnamese(reply);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="ai-assistant-wrapper">
      {/* CHAT BUBBLE BOX */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-4 border-slate-100 flex flex-col overflow-hidden mb-3 animate-slide-up" id="kiki-panel">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex justify-between items-center" id="kiki-panel-header">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-bounce">🤖</span>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">Trò Chuyện Với Kiki</h4>
                <p className="text-[10px] text-sky-100 font-semibold">Tự động kết nối Gemini thông minh</p>
              </div>
            </div>
            <button 
              onClick={() => setSpeakOnResponse(!speakOnResponse)}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
              title={speakOnResponse ? "Tắt đọc giọng nói" : "Bật đọc giọng nói"}
            >
              {speakOnResponse ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* MESSAGE VIEW AREA */}
          <div className="h-64 sm:h-72 p-4 overflow-y-auto space-y-3 bg-slate-50/60 shadow-inner" id="kiki-conversation-scroll">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-500 text-white font-semibold rounded-tr-none shadow' 
                    : 'bg-white text-slate-700 font-semibold rounded-tl-none border border-slate-100 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start" id="kiki-loading">
                <div className="bg-white text-slate-400 font-bold rounded-2xl p-3 text-[11px] border shadow-sm animate-pulse flex items-center gap-1.5">
                  <span className="inline-block animate-spin-slow">🪐</span> Kiki đang tìm lời giải tốt nhất...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* QUICK TOPIC BUTTONS */}
          <div className="flex gap-1.5 p-2 bg-white border-t border-slate-100 overflow-x-auto select-none scrollbar-none" id="quick-chips">
            <button 
              onClick={() => handleQuickTopic("Vì sao nước bốc hơi hả Kiki?")} 
              className="text-[9px] font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-200"
            >
              💧 Vì sao nước bốc hơi?
            </button>
            <button 
              onClick={() => handleQuickTopic("Nêu 8 tên hành tinh Hệ Mặt Trời?")} 
              className="text-[9px] font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-200"
            >
              🪐 Hệ Mặt Trời có gì?
            </button>
            <button 
              onClick={() => handleQuickTopic("Cây cần bao nhiêu nước là đủ trồng?")} 
              className="text-[9px] font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-slate-200"
            >
              🌱 Cách gieo mầm cây?
            </button>
          </div>

          {/* INPUT FORM */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2" id="kiki-form-box">
            <input
              type="text"
              placeholder="Hỏi Kiki điều gì em thắc mắc..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 font-semibold text-slate-700"
            />
            <button 
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FLOAT KIKI BUTTON */}
      <button
        onClick={() => {
          if (soundEnabled) playSound('click');
          setIsOpen(!isOpen);
        }}
        id="btn-float-kiki"
        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform border-4 border-white z-50 animate-pulse"
      >
        <span className="text-3xl">🤖</span>
      </button>
    </div>
  );
}
