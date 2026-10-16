import React from 'react';
import { LyricLine } from '../data/songData';
import { Play, Sparkles, BookOpen, Clock } from 'lucide-react';

interface SyncedLyricsViewProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
}

export const SyncedLyricsView: React.FC<SyncedLyricsViewProps> = ({
  lyrics,
  currentTime,
  onSeek,
  isPlaying,
}) => {
  // Find current active lyric
  const activeIndex = lyrics.findIndex(
    (l) => currentTime >= l.startTime && currentTime <= l.endTime
  );

  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>SYNCHRONIZED POETRY & LYRICS</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">01:28 完全同期</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 font-mincho mt-1">
            歌詞と深夜の物語
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            各行をクリックすると、その時点の音源再生位置へジャンプします。
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>現在の位置:</span>
          <span className="text-amber-300 font-semibold tabular-nums">
            {formatTime(currentTime)} / 01:28
          </span>
        </div>
      </div>

      {/* Lyrics Stream */}
      <div className="mt-8 space-y-6">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = currentTime > line.endTime;

          return (
            <div
              key={line.id}
              onClick={() => onSeek(line.startTime)}
              className={`group cursor-pointer rounded-xl p-4 sm:p-5 transition-all duration-300 border ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/35 shadow-lg shadow-amber-950/20 translate-x-1'
                  : isPast
                  ? 'bg-slate-900/30 border-slate-800/40 opacity-75 hover:opacity-100 hover:border-slate-700'
                  : 'bg-transparent border-transparent hover:bg-slate-900/20 hover:border-slate-800/60 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  {/* Timestamp and status */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span
                      className={`tabular-nums ${
                        isActive
                          ? 'text-amber-400 font-semibold'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {formatTime(line.startTime)} - {formatTime(line.endTime)}
                    </span>
                    {isActive && (
                      <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                        NOW PLAYING
                      </span>
                    )}
                  </div>

                  {/* Japanese Main Lyric */}
                  <p
                    className={`font-mincho transition-all leading-relaxed ${
                      isActive
                        ? 'text-lg sm:text-2xl font-bold text-amber-100 text-shadow-sm'
                        : 'text-base sm:text-lg text-slate-300 group-hover:text-slate-100'
                    } ${line.isInstrumental ? 'italic text-slate-400' : ''}`}
                  >
                    {line.textJa}
                  </p>

                  {/* English subtext */}
                  {line.subtext && (
                    <p className="text-xs text-slate-400/80 font-sans tracking-wide">
                      {line.subtext}
                    </p>
                  )}

                  {/* Poetic liner note */}
                  {line.poeticNote && (
                    <div className="pt-2 border-t border-slate-800/40 text-xs text-slate-400 font-mincho leading-relaxed">
                      <span className="text-amber-400/70 mr-1.5">❖</span>
                      {line.poeticNote}
                    </div>
                  )}
                </div>

                {/* Jump affordance */}
                <button
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                  aria-label={`Jump to ${formatTime(line.startTime)}`}
                >
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
