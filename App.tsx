
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PuzzleBoard from './components/PuzzleBoard.tsx';
import Celebration from './components/Celebration.tsx';

const App: React.FC = () => {
  const [isSolved, setIsSolved] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [programName, setProgramName] = useState('برنامج أسس');
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultLogo = "https://i.ibb.co/LzNfX2F/osos-logo.png";

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLaunchSuccess = useCallback(() => {
    setIsSolved(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startExperience = () => {
    if (!logoUrl) setLogoUrl(defaultLogo);
    setIsReady(true);
  };

  const resetExperience = () => {
    setIsSolved(false);
    setIsReady(false);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className={`max-w-md w-full transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">إعداد تجربة التدشين</h1>
            <p className="text-slate-500">أدخل اسم البرنامج واختر الشعار</p>
          </div>

          <div className="space-y-6">
            <div className="text-right">
              <label className="block text-sm font-semibold text-slate-700 mb-2 mr-1">اسم البرنامج / الفعالية</label>
              <input 
                type="text" 
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="مثال: برنامج أسس التعليمي"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg"
              />
            </div>

            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group flex flex-col items-center"
              >
                {logoUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={logoUrl} alt="Preview" className="w-24 h-24 object-contain mb-2 rounded shadow-sm" />
                    <span className="text-sm font-semibold text-blue-600">تغيير الشعار المختار</span>
                  </div>
                ) : (
                  <>
                    <span className="text-slate-600 font-semibold mb-1">رفع شعار مخصص</span>
                    <span className="text-xs text-slate-400">يدعم PNG, JPG, JPEG</span>
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">أو</span></div>
              </div>

              <button 
                onClick={() => { setLogoUrl(defaultLogo); startExperience(); }}
                className="w-full py-3 text-slate-600 font-medium hover:text-blue-600 transition-colors"
              >
                استخدام الشعار الافتراضي لـ "أسس"
              </button>

              <button 
                onClick={startExperience}
                disabled={!programName.trim()}
                className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100`}
              >
                بدء تجربة التدشين
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center py-12 px-4 select-none">
      <audio 
        ref={audioRef} 
        src="https://actions.google.com/sounds/v1/human_voices/applause_long.ogg" 
        preload="auto"
      />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-yellow-500 to-blue-200 opacity-30 shadow-sm"></div>
      
      <header className={`text-center mb-12 transition-all duration-1000 transform translate-y-0 opacity-100`}>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">
          تدشين {programName}
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-amber-400 mx-auto rounded-full mb-6"></div>
        <p className="text-slate-500 font-medium text-lg">أكمل الشعار لتدشين {programName} رسمياً</p>
      </header>

      <main className={`w-full max-w-4xl flex flex-col items-center transition-opacity duration-1000 opacity-100`}>
        <PuzzleBoard 
          logoUrl={logoUrl || defaultLogo} 
          onSuccess={handleLaunchSuccess} 
          isSolved={isSolved} 
        />

        {isSolved && (
          <div className="mt-12 text-center animate-slide-up z-50 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 drop-shadow-sm">
              تم تدشين {programName} بنجاح
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="group relative px-12 py-5 bg-slate-900 text-white rounded-xl font-bold text-xl hover:bg-slate-800 transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-3">
                  الدخول إلى {programName}
                  <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>

              <button 
                onClick={resetExperience}
                className="px-8 py-5 border-2 border-slate-200 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
              >
                العودة للإعدادات
              </button>
            </div>
          </div>
        )}
      </main>

      {isSolved && <Celebration />}

      <footer className="mt-auto pt-16 text-slate-400 text-sm font-light text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-[1px] bg-slate-200"></div>
          <span>{programName}</span>
          <div className="w-8 h-[1px] bg-slate-200"></div>
        </div>
        <p dir="ltr">© {new Date().getFullYear()} {programName}</p>
      </footer>
    </div>
  );
};

export default App;
