
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface PuzzleBoardProps {
  logoUrl: string;
  onSuccess: () => void;
  isSolved: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ logoUrl, onSuccess, isSolved }) => {
  const [missingTilePlaced, setMissingTilePlaced] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const clickSound = useRef<HTMLAudioElement>(new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3"));
  
  const gridSize = 3;
  const missingIndex = 4; // تم تغيير الفراغ إلى المنتصف (الموقع الخامس في شبكة 0-8)

  useEffect(() => {
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
  }, [logoUrl]);

  const handlePlaceMissing = useCallback(() => {
    if (isSolved) return;
    
    clickSound.current.volume = 0.3;
    clickSound.current.play().catch(() => {});
    
    setMissingTilePlaced(true);
    setTimeout(() => {
      onSuccess();
    }, 100);
  }, [isSolved, onSuccess]);

  const onDragStart = (e: React.DragEvent) => {
    if (isSolved) return;
    e.dataTransfer.setData('text/plain', 'missing-tile');
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isSolved) return;
    setDraggedOver(true);
  };

  const onDragLeave = () => {
    setDraggedOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isSolved) return;
    setDraggedOver(false);
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'missing-tile') {
      handlePlaceMissing();
    }
  };

  const getTileStyle = (idx: number) => {
    const col = (idx % gridSize);
    const row = Math.floor(idx / gridSize);
    
    // حساب الموضع بدقة: 0% للأول، 50% للثاني، 100% للثالث
    const posX = col * 50;
    const posY = row * 50;

    return {
      backgroundImage: `url(${logoUrl})`,
      backgroundSize: '300% 300%', 
      backgroundPosition: `${posX}% ${posY}%`,
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
      display: 'block'
    };
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24 relative w-full max-w-6xl justify-center">
      <div className="relative w-full max-w-[500px]">
        {/* فرض اتجاه LTR لضمان ترتيب القطع بشكل منطقي مع الصورة */}
        <div 
          dir="ltr"
          className={`grid grid-cols-3 grid-rows-3 gap-0 p-0 bg-white rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-slate-200 transition-all duration-1000 w-full ${isSolved ? 'scale-105 ring-12 ring-blue-500/10 border-blue-500/20 shadow-[0_60px_130px_-10px_rgba(59,130,246,0.35)]' : ''}`}
          style={{ aspectRatio: `${aspectRatio}` }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const isHole = idx === missingIndex && !missingTilePlaced;
            
            return (
              <div 
                key={idx}
                className={`relative w-full h-full overflow-hidden transition-all duration-500 bg-white ${
                  isHole ? (draggedOver ? 'bg-blue-50 ring-4 ring-blue-500 ring-inset' : 'bg-slate-50') : ''
                }`}
              >
                {(!isHole || missingTilePlaced) && (
                  <div 
                    className="w-full h-full"
                    style={getTileStyle(idx)}
                  />
                )}
                
                {isHole && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-100/30">
                    <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center opacity-50">
                       <span className="text-2xl text-slate-400 font-light">+</span>
                    </div>
                  </div>
                )}

                {!isSolved && !isHole && (
                   <div className="absolute inset-0 border-[0.5px] border-black/5 pointer-events-none opacity-20"></div>
                )}
              </div>
            );
          })}
        </div>
        
        {isSolved && (
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-500/20 via-transparent to-blue-500/20 blur-3xl -z-10 rounded-full animate-pulse"></div>
        )}
      </div>

      {!isSolved && (
        <div className="flex flex-col items-center animate-slide-up mt-10 lg:mt-0">
          <div className="relative mb-6 group">
            <div className="absolute -inset-3 bg-blue-600/10 blur-xl rounded-full group-hover:bg-blue-600/20 transition-all"></div>
            <span className="relative bg-slate-900 text-white text-[11px] px-6 py-2.5 rounded-full font-bold tracking-[0.2em] uppercase shadow-2xl flex items-center gap-3">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
               اسحب القطعة المفقودة
            </span>
          </div>

          <div 
            draggable={!isSolved}
            onDragStart={onDragStart}
            onClick={handlePlaceMissing}
            className="w-32 h-32 md:w-40 md:h-40 bg-white p-1 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-500 group overflow-hidden ring-4 ring-transparent hover:ring-blue-500/20"
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <div 
              className="w-full h-full rounded-lg"
              style={{
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: '300% 300%',
                backgroundPosition: `50% 50%`, // عرض الجزء الأوسط من الصورة
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
          
          <div className="mt-8 text-center flex flex-col items-center gap-2">
             <p className="font-bold text-2xl text-slate-800 tracking-tight">التدشين النهائي</p>
             <div className="w-12 h-1.5 bg-blue-500 rounded-full mb-2"></div>
             <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed font-medium">ضع القطعة المفقودة في المنتصف لتكتمل الصورة ويبدأ الاحتفال ببرنامج أسس</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleBoard;
