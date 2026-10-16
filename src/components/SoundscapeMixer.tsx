import React from 'react';
import { CloudRain, Wind, Lightbulb, Train, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SoundscapeMixerProps {
  volumes: {
    rain: number;
    wind: number;
    streetlamp: number;
    train: number;
  };
  onVolumeChange: (type: 'rain' | 'wind' | 'streetlamp' | 'train', val: number) => void;
  onApplyPreset: (preset: 'rain' | 'still' | 'windy' | 'silent') => void;
  activePreset: 'rain' | 'still' | 'windy' | 'silent' | 'custom';
}

export const SoundscapeMixer: React.FC<SoundscapeMixerProps> = ({
  volumes,
  onVolumeChange,
  onApplyPreset,
  activePreset,
}) => {
  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MIDNIGHT AMBIENT MIXER</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">リアルタイムWeb Audio合成</span>
          </div>
          <h3 className="text-lg font-medium text-slate-100 font-mincho mt-1">
            住宅街の夜音ミキサー
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            楽曲「夜」の背景に、深夜の住宅街を漂う環境音を重ねて聴くことができます。
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => onApplyPreset('rain')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activePreset === 'rain'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            深夜の雨音
          </button>
          <button
            onClick={() => onApplyPreset('still')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activePreset === 'still'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            午前二時の静寂
          </button>
          <button
            onClick={() => onApplyPreset('windy')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activePreset === 'windy'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            冷たい夜風
          </button>
          <button
            onClick={() => onApplyPreset('silent')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activePreset === 'silent'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ミュート
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
        {/* Rain */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span className="font-medium text-slate-200">アスファルトを濡らす小雨</span>
            </div>
            <span className="font-mono tabular-nums text-slate-400">
              {Math.round(volumes.rain * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange('rain', volumes.rain > 0 ? 0 : 0.4)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle rain sound"
            >
              {volumes.rain > 0 ? (
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes.rain}
              onChange={(e) => onVolumeChange('rain', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            静まり返った路面にポツポツと降る微かな雨粒の反響音。
          </p>
        </div>

        {/* Wind */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-400" />
              <span className="font-medium text-slate-200">電線を揺らす冷たい夜風</span>
            </div>
            <span className="font-mono tabular-nums text-slate-400">
              {Math.round(volumes.wind * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange('wind', volumes.wind > 0 ? 0 : 0.35)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle wind sound"
            >
              {volumes.wind > 0 ? (
                <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes.wind}
              onChange={(e) => onVolumeChange('wind', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            電柱の隙間と路地を緩やかに吹き抜ける深夜の風の揺らぎ。
          </p>
        </div>

        {/* Streetlamp */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-slate-200">街灯の微小な灯りと温もり</span>
            </div>
            <span className="font-mono tabular-nums text-slate-400">
              {Math.round(volumes.streetlamp * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange('streetlamp', volumes.streetlamp > 0 ? 0 : 0.3)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle streetlamp sound"
            >
              {volumes.streetlamp > 0 ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes.streetlamp}
              onChange={(e) => onVolumeChange('streetlamp', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            暗闇を柔らかく灯すナトリウム灯の微かなハム音とあたたかさ。
          </p>
        </div>

        {/* Distant Train */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-slate-200">遠くを走り抜ける終電の余韻</span>
            </div>
            <span className="font-mono tabular-nums text-slate-400">
              {Math.round(volumes.train * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange('train', volumes.train > 0 ? 0 : 0.25)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle train sound"
            >
              {volumes.train > 0 ? (
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes.train}
              onChange={(e) => onVolumeChange('train', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            高架橋の彼方から響く、一日の終わりを告げるかすかな重低音。
          </p>
        </div>
      </div>
    </div>
  );
};
