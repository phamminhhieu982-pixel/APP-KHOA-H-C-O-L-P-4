import { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, Volume2, VolumeX } from 'lucide-react';

import HomeScreen from './components/HomeScreen.tsx';
import TeacherDashboard from './components/TeacherDashboard.tsx';
import EvaporationModule from './components/EvaporationModule.tsx';
import WaterCycleModule from './components/WaterCycleModule.tsx';
import SolarSystemModule from './components/SolarSystemModule.tsx';
import PlantGrowthModule from './components/PlantGrowthModule.tsx';
import AIAssistant from './components/AIAssistant.tsx';

import { HUY_HIEU_LIST } from './data.ts';
import { playSound, speakVietnamese } from './utils/audio.ts';

// Dynamic Simulation Safety Wrapper
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

let db: any = null;
let auth: any = null;
const appId = 'khoa-hoc-ao-lop-4';

const defaultFirebaseConfig = {
  apiKey: "",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

try {
  const config = (window as any).__firebase_config 
    ? JSON.parse((window as any).__firebase_config) 
    : defaultFirebaseConfig;
  const app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  // Silent fallback: Firebase credentials not provisioned yet, state will reside in LocalStorage.
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'module' | 'teacher'>('home');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auth setup listener with local caching safety
  useEffect(() => {
    // Populate stats from localStorage immediately for fast UX load
    const savedOfflineProgress = localStorage.getItem('guest_progress_v1');
    if (savedOfflineProgress) {
      const parsed = JSON.parse(savedOfflineProgress);
      setPoints(parsed.points || 0);
      setCompletedModules(parsed.completedModules || []);
      setBadges(parsed.badges || []);
    }

    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        // Safe to ignore in single-user guest environment
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as User);
        const savedSyncProgress = localStorage.getItem(`progress_${firebaseUser.uid}`);
        if (savedSyncProgress) {
          const parsed = JSON.parse(savedSyncProgress);
          setPoints(parsed.points || 0);
          setCompletedModules(parsed.completedModules || []);
          setBadges(parsed.badges || []);
        }
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const updateProgress = useCallback(async (newPoints: number, moduleToAdd: string | null = null, newBadges: string[] | null = null) => {
    const updatedPoints = points + newPoints;
    const updatedModules = [...completedModules];
    if (moduleToAdd && !updatedModules.includes(moduleToAdd)) {
      updatedModules.push(moduleToAdd);
    }
    
    // Auto badges calculation
    const updatedBadges = newBadges || [...badges];
    HUY_HIEU_LIST.forEach(b => {
      if (updatedPoints >= b.minPoints && !updatedBadges.includes(b.id)) {
        updatedBadges.push(b.id);
        if (soundEnabled) playSound('success');
        speakVietnamese(`Chúc mừng em đã xuất sắc nhận được huy hiệu ${b.name}!`);
      }
    });

    setPoints(updatedPoints);
    setCompletedModules(updatedModules);
    setBadges(updatedBadges);

    const progressObj = {
      points: updatedPoints,
      completedModules: updatedModules,
      badges: updatedBadges,
      updatedAt: new Date().toISOString()
    };

    // Store in global guest keys
    localStorage.setItem('guest_progress_v1', JSON.stringify(progressObj));

    if (user) {
      localStorage.setItem(`progress_${user.uid}`, JSON.stringify(progressObj));
      if (db) {
        try {
          const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'stats');
          await setDoc(docRef, progressObj, { merge: true });
        } catch (e) {
          // Firebase backend not yet deployed in this preview, LocalStorage fallback is secure
        }
      }
    }
  }, [points, completedModules, badges, user, soundEnabled]);

  const selectModule = (moduleId: string) => {
    if (soundEnabled) playSound('click');
    setActiveModule(moduleId);
    setActiveTab('module');
  };

  const handleBackToHome = () => {
    if (soundEnabled) playSound('click');
    setActiveTab('home');
    setActiveModule(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-yellow-200">
      {/* HEADER BAR */}
      <header className="bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-600 text-white shadow-xl px-4 py-3 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer self-start md:self-auto" onClick={handleBackToHome}>
            <div className="bg-white p-2 rounded-2xl shadow-inner transform hover:rotate-12 transition-transform">
              <span className="text-3xl">🧪</span>
            </div>
            <div>
              <h1 className="font-black text-xl sm:text-2xl tracking-wide drop-shadow-md">KHOA HỌC ẢO LỚP 4</h1>
              <p className="text-[10px] text-sky-100 font-extrabold tracking-widest uppercase">Chương Trình GDPT 2018 Việt Nam</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-end">
            {/* SCORE DISPLAY */}
            <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs sm:text-sm font-black shadow-sm">
              <Trophy className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>{points} <span className="text-[10px] sm:text-xs font-bold text-sky-100">XP</span></span>
            </div>

            {/* BADGES QUICK LIST */}
            <div className="flex gap-1" id="badge-inline-view">
              {badges.map(bId => {
                const b = HUY_HIEU_LIST.find(h => h.id === bId);
                return (
                  <span key={bId} className="text-xl sm:text-2xl cursor-help group relative" title={b?.name}>
                    {b?.icon}
                    <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md font-bold">
                      {b?.name}
                    </span>
                  </span>
                );
              })}
              {badges.length === 0 && (
                <span className="text-[10px] text-sky-100 border border-white/20 px-2.5 py-1 rounded-full bg-black/10 font-bold select-none">
                  Chưa nhận danh hiệu
                </span>
              )}
            </div>

            {/* SOUND TOGGLE */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 sm:p-2 bg-white/15 rounded-full hover:bg-white/30 transition-all text-white border border-white/10"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            {/* TEACHER DASHBOARD TOGGLE */}
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                setActiveTab(activeTab === 'teacher' ? 'home' : 'teacher');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-black transition-all ${
                activeTab === 'teacher' 
                  ? 'bg-yellow-400 text-slate-900 shadow-md transform scale-105' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Dành cho Giáo viên</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE FRAMEWORK MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 transition-all">
        {activeTab === 'home' && (
          <HomeScreen selectModule={selectModule} points={points} completedModules={completedModules} badges={badges} />
        )}

        {activeTab === 'module' && activeModule && (
          <div className="space-y-6 animate-fade-in" id="module-layout-root">
            {/* Nav path */}
            <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2.5xl shadow-sm border border-slate-100" id="module-subnav">
              <button 
                onClick={handleBackToHome}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-2xl text-xs sm:text-sm font-black text-slate-700 transition-colors"
              >
                ← Quay lại trang chủ
              </button>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest hidden sm:inline-block">
                Thực hành STEM tương tác
              </span>
            </div>

            {activeModule === 'evaporation' && (
              <EvaporationModule updateProgress={updateProgress} soundEnabled={soundEnabled} />
            )}
            {activeModule === 'water-cycle' && (
              <WaterCycleModule updateProgress={updateProgress} soundEnabled={soundEnabled} />
            )}
            {activeModule === 'solar-system' && (
              <SolarSystemModule updateProgress={updateProgress} soundEnabled={soundEnabled} />
            )}
            {activeModule === 'plant-growth' && (
              <PlantGrowthModule updateProgress={updateProgress} soundEnabled={soundEnabled} />
            )}
          </div>
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard currentUserId={user?.uid} />
        )}
      </main>

      {/* CHATBOT ROBOT KIKI */}
      <AIAssistant soundEnabled={soundEnabled} />

      {/* SPATIALLY POLISHED FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-850 select-none">
        <p className="font-extrabold text-slate-300">© 2026 Khoa Học Ảo Lớp 4. Thiết kế trực quan sinh động bổ ích cho học sinh Việt Nam.</p>
        <p className="text-[10px] mt-1 text-slate-650">Môi trường STEM giả lập trực quan thời gian thực chất lượng cao theo yêu cầu GDPT 2018.</p>
      </footer>
    </div>
  );
}
