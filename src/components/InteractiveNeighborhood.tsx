import React, { useState, useEffect } from 'react';
import { Moon, Clock, Lightbulb, Compass, Info } from 'lucide-react';

interface WindowState {
  id: string;
  houseName: string;
  room: string;
  isOn: boolean;
  story: string;
}

export const InteractiveNeighborhood: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('02:37:14');
  const [streetLampOn, setStreetLampOn] = useState<boolean>(true);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'w1',
      houseName: '坂の上の木造家屋',
      room: '2階の角部屋',
      isOn: true,
      story: '深夜に机に向かい、届くことのない手紙をそっと綴っている。',
    },
    {
      id: 'w2',
      houseName: '黒瓦の日本家屋',
      room: '縁側の障子',
      isOn: false,
      story: '住人はすでに寝静まり、雨粒がトタン屋根を叩く微かな音だけが残る。',
    },
    {
      id: 'w3',
      houseName: '白い二階建ての家',
      room: '小窓の書斎',
      isOn: true,
      story: '眠れない夜に、古い文庫本をめくりながら温かい白湯を飲んでいる。',
    },
    {
      id: 'w4',
      houseName: '奥のアパートメント',
      room: '102号室',
      isOn: false,
      story: 'テレビの光がふっと消え、街の静寂に溶け込んでいった。',
    },
    {
      id: 'w5',
      houseName: '路地裏の家',
      room: '屋根裏の小窓',
      isOn: true,
      story: 'カーテンの隙間から、濡れた夜の路面を走る車輪の音をぼんやり見下ろしている。',
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Format as late night time
      const h = String((now.getHours() % 6) + 1).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`0${h}:${m}:${s} AM`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newState = !w.isOn;
          setSelectedStory(newState ? `${w.room}（${w.houseName}）：${w.story}` : `${w.room}の明かりが消え、深い眠りにつきました。`);
          return { ...w, isOn: newState };
        }
        return w;
      })
    );
  };

  const activeCount = windows.filter((w) => w.isOn).length;

  return (
    <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wider">
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>MIDNIGHT RESIDENTIAL BLOCK</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">インタラクティブ住宅街</span>
          </div>
          <h3 className="text-lg font-medium text-slate-100 font-mincho mt-1">
            静まり返った深夜の住宅街
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            窓をクリックすると明かりが点消灯し、そこで暮らす誰かの小さな夜の気配が浮かび上がります。
          </p>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-semibold">{timeStr}</span>
          </div>
          <button
            onClick={() => setStreetLampOn(!streetLampOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              streetLampOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>街灯 {streetLampOn ? '点灯中' : '消灯'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Neighborhood Visual Canvas / SVG Stage */}
      <div className="relative mt-6 rounded-xl bg-gradient-to-b from-[#060911] via-[#090d17] to-[#04060b] border border-slate-800/70 p-6 overflow-hidden min-h-[260px] flex flex-col justify-end">
        {/* Sky / Moon */}
        <div className="absolute top-4 right-8 flex items-center gap-2 text-slate-500 text-xs">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100/20 to-amber-200/5 blur-sm border border-amber-200/20 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-[#060911] translate-x-1.5 -translate-y-1.5" />
          </div>
        </div>

        {/* Telegraph wires crossing sky */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 45 Q 300 95, 700 65 T 1400 80"
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
          />
          <path
            d="M 0 60 Q 400 115, 800 85 T 1400 100"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            d="M 0 75 Q 350 130, 900 105 T 1400 120"
            fill="none"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
        </svg>

        {/* Telegraph Pole Left */}
        <div className="absolute left-10 bottom-12 w-2.5 h-44 bg-slate-800 rounded-t-sm z-10">
          <div className="absolute top-4 -left-3 w-8 h-1 bg-slate-700" />
          <div className="absolute top-8 -left-4 w-10 h-1 bg-slate-700" />
          <div className="absolute top-12 left-0.5 w-3 h-4 bg-slate-900 border border-slate-700 rounded-xs" />
        </div>

        {/* Streetlamp Center */}
        <div className="absolute left-1/3 bottom-12 z-20 flex flex-col items-center">
          {/* Light bulb with glow */}
          <div className="relative">
            <div
              className={`w-4 h-3 rounded-b-md transition-all duration-700 ${
                streetLampOn
                  ? 'bg-amber-300 shadow-[0_0_50px_20px_rgba(245,158,11,0.45)]'
                  : 'bg-slate-700'
              }`}
            />
            {streetLampOn && (
              <div className="absolute -left-12 -top-6 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none animate-streetlight" />
            )}
          </div>
          {/* Arm and Pole */}
          <div className="w-1.5 h-36 bg-slate-700 rounded-t-sm relative">
            <div className="absolute top-0 right-0 w-4 h-1 bg-slate-700" />
          </div>
        </div>

        {/* Houses Silhouettes and Clickable Windows */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-12 items-end">
          {windows.map((w, index) => (
            <div
              key={w.id}
              onClick={() => toggleWindow(w.id)}
              className="cursor-pointer group relative bg-slate-950/80 border border-slate-800/80 rounded-t-xl p-3 pb-5 transition-all hover:border-slate-700 hover:shadow-lg flex flex-col items-center"
            >
              {/* Roof slope styling */}
              <div className="absolute -top-3 inset-x-0 mx-auto w-0 h-0 border-l-[38px] border-l-transparent border-r-[38px] border-r-transparent border-b-[12px] border-b-slate-900 group-hover:border-b-slate-800 transition-colors" />

              <span className="text-[10px] text-slate-500 font-mono tracking-tight mb-2 pt-1 text-center truncate w-full">
                {w.houseName}
              </span>

              {/* Interactive Window */}
              <button
                className={`w-10 h-12 rounded border transition-all duration-500 relative flex items-center justify-center ${
                  w.isOn
                    ? 'bg-amber-200/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.65)]'
                    : 'bg-[#0d121c] border-slate-800 shadow-inner'
                }`}
                aria-label={`Toggle window in ${w.houseName}`}
              >
                {/* Window panes grid */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none divide-x divide-y divide-black/30" />
                {w.isOn && (
                  <div className="w-2 h-4 bg-amber-950/40 rounded-xs blur-[0.5px]" />
                )}
              </button>

              <div className="mt-2 text-center">
                <span className="text-[11px] font-medium block text-slate-300 group-hover:text-amber-300 transition-colors">
                  {w.room}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {w.isOn ? '明かり点灯中' : '消灯・就寝'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Road & Wet Asphalt Reflection */}
        <div className="relative mt-2 h-14 bg-gradient-to-b from-[#0b0f19] to-[#04060b] border-t border-slate-800 rounded-b-lg flex items-center px-4 overflow-hidden">
          {/* Streetlamp reflection on wet ground */}
          {streetLampOn && (
            <div className="absolute left-1/3 top-0 w-24 h-12 bg-amber-500/15 blur-lg rounded-full" />
          )}
          {/* Road center dash */}
          <div className="w-full flex items-center justify-around opacity-20">
            <div className="w-12 h-1 bg-white/40 rounded" />
            <div className="w-12 h-1 bg-white/40 rounded" />
            <div className="w-12 h-1 bg-white/40 rounded" />
            <div className="w-12 h-1 bg-white/40 rounded" />
          </div>
          <div className="absolute bottom-1 right-3 text-[10px] text-slate-600 font-mono">
            WET ASPHALT · 2:00 AM
          </div>
        </div>
      </div>

      {/* Story notification banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          {selectedStory ? (
            <p className="text-slate-200 font-mincho leading-relaxed animate-fade-in">
              {selectedStory}
            </p>
          ) : (
            <p className="text-slate-400">
              街並みの窓をクリックしてください。現在{' '}
              <span className="text-amber-300 font-medium">{activeCount} 軒</span>{' '}
              の部屋で、誰かが眠れない夜を過ごしています。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
