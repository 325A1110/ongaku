import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Disc3,
  Moon,
  CloudRain,
  Share2,
  Heart,
  Sparkles,
  Compass,
} from 'lucide-react';
import { SONG_YORU, EP_TRACKLIST } from './data/songData';
import { YoruAudioEngine } from './audio/audioEngine';
import { NightCanvas } from './components/NightCanvas';
import { SoundscapeMixer } from './components/SoundscapeMixer';
import { InteractiveNeighborhood } from './components/InteractiveNeighborhood';
import { SyncedLyricsView } from './components/SyncedLyricsView';
import { WhispersBoard } from './components/WhispersBoard';

// Generated image assets from Phase 1
const HERO_STREET_IMG = '/src/assets/images/hero_night_residential_street_1792127254938.jpg';
const SINGLE_COVER_IMG = '/src/assets/images/single_cover_yoru_1792127255217.jpg';
const VENDING_MACHINE_IMG = '/src/assets/images/night_vending_machine_1792127256029.jpg';
const ROOM_WINDOW_IMG = '/src/assets/images/room_window_midnight_1792127256070.jpg';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(88);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSourceType, setAudioSourceType] = useState<'synth' | 'custom'>('synth');
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  // Soundscape ambient volumes
  const [ambientVolumes, setAmbientVolumes] = useState({
    rain: 0.25,
    wind: 0.15,
    streetlamp: 0.1,
    train: 0.08,
  });
  const [activePreset, setActivePreset] = useState<'rain' | 'still' | 'windy' | 'silent' | 'custom'>('rain');

  // Audio Engine singleton ref
  const engineRef = useRef<YoruAudioEngine | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const engine = new YoruAudioEngine();
    engineRef.current = engine;

    engine.onTimeUpdate = (time) => {
      setCurrentTime(time);
    };

    engine.onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      engine.destroy();
    };
  }, []);

  const togglePlay = () => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.pause();
      setIsPlaying(false);
    } else {
      engineRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    if (!engineRef.current) return;
    engineRef.current.seek(time);
    setCurrentTime(time);
  };

  const handleVolumeChange = (val: number) => {
    setMasterVolume(val);
    if (engineRef.current) {
      engineRef.current.setMasterVolume(isMuted ? 0 : val);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (engineRef.current) {
      engineRef.current.setMasterVolume(nextMuted ? 0 : masterVolume);
    }
  };

  const handleAmbientVolumeChange = (
    type: 'rain' | 'wind' | 'streetlamp' | 'train',
    val: number
  ) => {
    const newVols = { ...ambientVolumes, [type]: val };
    setAmbientVolumes(newVols);
    setActivePreset('custom');
    if (engineRef.current) {
      engineRef.current.setAmbientVolume(type, val);
    }
  };

  const handleApplyPreset = (preset: 'rain' | 'still' | 'windy' | 'silent') => {
    setActivePreset(preset);
    let target = { rain: 0, wind: 0, streetlamp: 0, train: 0 };
    if (preset === 'rain') {
      target = { rain: 0.5, wind: 0.15, streetlamp: 0.1, train: 0.05 };
    } else if (preset === 'still') {
      target = { rain: 0.0, wind: 0.05, streetlamp: 0.25, train: 0.1 };
    } else if (preset === 'windy') {
      target = { rain: 0.1, wind: 0.55, streetlamp: 0.15, train: 0.05 };
    } else if (preset === 'silent') {
      target = { rain: 0, wind: 0, streetlamp: 0, train: 0 };
    }

    setAmbientVolumes(target);
    if (engineRef.current) {
      engineRef.current.setAmbientVolume('rain', target.rain);
      engineRef.current.setAmbientVolume('wind', target.wind);
      engineRef.current.setAmbientVolume('streetlamp', target.streetlamp);
      engineRef.current.setAmbientVolume('train', target.train);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !engineRef.current) return;

    try {
      await engineRef.current.loadUserFile(file);
      setCustomFileName(file.name);
      setAudioSourceType('custom');
      setDuration(engineRef.current.getDuration());
      setIsPlaying(true);
      engineRef.current.play(0);
    } catch (err) {
      console.error('Failed to load user audio', err);
    }
  };

  const handleResetToSynth = () => {
    if (!engineRef.current) return;
    engineRef.current.resetToBuiltin();
    setAudioSourceType('synth');
    setCustomFileName(null);
    setDuration(88);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Find active lyric for quick snippet
  const activeLyric = SONG_YORU.lyrics.find(
    (l) => currentTime >= l.startTime && currentTime <= l.endTime
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 relative selection:bg-amber-500/20 selection:text-amber-200">
      {/* Background Interactive Ambient Rain & Bokeh */}
      <NightCanvas intensity={ambientVolumes.rain > 0 ? 1.0 : 0.4} showRain={ambientVolumes.rain > 0} />

      {/* Top Bar Contract: Exactly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-50 bg-[#07090e]/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-100 font-mincho whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
          >
            夜 <span className="text-xs font-sans text-slate-400 font-normal">/ YORU</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
            <a
              href="#player"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              楽曲試聴
            </a>
            <a
              href="#lyrics"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              歌詞と物語
            </a>
            <a
              href="#soundscape"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              住宅街の夜音
            </a>
            <a
              href="#neighborhood"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              深夜の街並み
            </a>
            <a
              href="#whispers"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              残された言葉
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-amber-400/20 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>一時停止</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>「夜」を再生</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24">
        {/* HERO SECTION: Split Screen with 1440px desktop balance */}
        <section id="player" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Typographic Hierarchy & Interactive Player */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono tracking-wider">
                  <span>SINGLE RELEASE</span>
                  <span aria-hidden="true">·</span>
                  <span>2026 MIDNIGHT</span>
                  <span aria-hidden="true">·</span>
                  <span>哀愁のバラード</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-100 font-mincho mt-4 leading-tight text-balance">
                  夜 — <span className="text-slate-300">君のいない静寂を、ただ歩く。</span>
                </h1>

                {/* Subtitle / Lead Prose */}
                <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed font-mincho max-w-2xl">
                  誰もいない午前2時の住宅街。濡れたアスファルトに反射するオレンジ色の街灯と、
                  冷たい夜風に乗って遠くへ消えていくピアノの旋律。
                  届かない言葉と、胸の奥に残ったまま消せない想いを描いた静謐な音楽空間。
                </p>
              </div>

              {/* Integrated Audio Control Panel */}
              <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
                {/* Active lyric snippet banner */}
                <div className="mb-4 pb-4 border-b border-slate-800/70 flex items-center justify-between gap-3 min-h-[44px]">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mincho truncate">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-200 font-medium truncate">
                      {activeLyric ? activeLyric.textJa : '（静寂の住宅街路・再生ボタンを押してください）'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Scrubber Timeline */}
                <div className="space-y-1.5 mb-5">
                  <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer group">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full group-hover:brightness-110 transition-all"
                      style={{
                        width: `${Math.min(100, (currentTime / (duration || 88)) * 100)}%`,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={duration || 88}
                      step="0.1"
                      value={currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 88)}</span>
                  </div>
                </div>

                {/* Main Player Transport Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Rewind to beginning */}
                    <button
                      onClick={() => handleSeek(0)}
                      className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                      title="先頭に戻る"
                      aria-label="Restart track"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Audio source mode */}
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">再生音源:</span>
                      <span className="text-slate-200 font-medium">
                        {audioSourceType === 'synth'
                          ? '夜 (ピアノ & 環境音シンセ)'
                          : customFileName || '読み込み済み音源'}
                      </span>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={toggleMute}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Toggle mute"
                    >
                      {isMuted || masterVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={isMuted ? 0 : masterVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>

                {/* Audio file upload affordance */}
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>お手元の音源ファイルを読み込む</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {audioSourceType === 'custom' && (
                    <button
                      onClick={handleResetToSynth}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      内蔵シンセに戻す
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="lg:col-span-5 relative flex">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl group min-h-[360px] lg:min-h-full">
                <img
                  src={HERO_STREET_IMG}
                  alt="深夜の静かな日本の住宅街。濡れたアスファルトとオレンジ色の街灯"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/20 to-transparent pointer-events-none" />

                {/* Overlaid Editorial Metadata */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-200 bg-[#07090e]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono">深夜 02:47 · 静かな住宅街路</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#07090e]/70 px-2 py-1 rounded">
                    F# MINOR / 68 BPM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Proof & Metadata Strip below the Hero Split */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4">
              <span className="text-[11px] text-slate-500 font-mono block">DURATION</span>
              <span className="text-lg font-semibold text-slate-200 font-mono tabular-nums">
                01:28
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">88秒の切ない余韻</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4">
              <span className="text-[11px] text-slate-500 font-mono block">TONALITY & TEMPO</span>
              <span className="text-lg font-semibold text-slate-200 font-mono">
                F# Minor · 68
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">遅い歩調のテンポ</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4">
              <span className="text-[11px] text-slate-500 font-mono block">SETTING</span>
              <span className="text-lg font-semibold text-slate-200 font-mincho">
                雨上がりの住宅街
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">濡れた路面と街灯</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-4">
              <span className="text-[11px] text-slate-500 font-mono block">ATMOSPHERE</span>
              <span className="text-lg font-semibold text-slate-200 font-mincho">
                孤独と追憶
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">癒えない想いの行方</span>
            </div>
          </div>
        </section>

        {/* SECTION: Synced Lyrics Studio & Single Cover */}
        <section id="lyrics" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Single Artwork & Monograph */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group aspect-square">
              <img
                src={SINGLE_COVER_IMG}
                alt="楽曲「夜」シングルジャケットアートワーク"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-mono text-amber-400 tracking-wider">
                  ORIGINAL SINGLE
                </span>
                <h3 className="text-2xl font-semibold text-white font-mincho mt-1">
                  夜 / YORU
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-mincho">
                  雨粒のついた窓ガラスの向こう、滲む街灯と消えない追憶。
                </p>
              </div>
            </div>

            {/* Liner Notes Essay */}
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6">
              <h4 className="text-base font-semibold text-slate-200 font-mincho mb-2">
                作品解説：消せない夜を生きる
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mincho">
                深夜の住宅街は、昼間の喧騒が嘘のように静まり返ります。家々の明かりがひとつずつ消えていき、
                街全体が眠りに落ちるなか、癒えない想いを抱えたまま一人起きている人がいる。
                本作『夜』は、そんな孤独な夜の息遣いと、二度と会えない誰かへの断ち切れない想いを、
                繊細なピアノのアルペジオと静謐な歌詞に乗せて紡ぎ出した作品です。
              </p>
            </div>
          </div>

          {/* Right: Synchronized Lyrics View */}
          <div className="lg:col-span-7">
            <SyncedLyricsView
              lyrics={SONG_YORU.lyrics}
              currentTime={currentTime}
              onSeek={handleSeek}
              isPlaying={isPlaying}
            />
          </div>
        </section>

        {/* SECTION: Midnight Soundscape Mixer */}
        <section id="soundscape">
          <SoundscapeMixer
            volumes={ambientVolumes}
            onVolumeChange={handleAmbientVolumeChange}
            onApplyPreset={handleApplyPreset}
            activePreset={activePreset}
          />
        </section>

        {/* SECTION: Interactive Residential Block */}
        <section id="neighborhood">
          <InteractiveNeighborhood />
        </section>

        {/* SECTION: Photographic Monograph (Bento Grid of Midnight Residential Life) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs text-amber-400 font-mono tracking-wider">
                PHOTOGRAPHIC MONOGRAPH
              </div>
              <h3 className="text-2xl font-semibold text-slate-100 font-mincho mt-1">
                深夜の住宅街 — 記憶の断片
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-mincho">
              街角の自動販売機、窓辺に残されたカセットテープ。言葉にならなかった切なさが漂う景色。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Vending machine */}
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden group shadow-xl flex flex-col">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={VENDING_MACHINE_IMG}
                  alt="深夜2時の自動販売機と住宅街の角"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#07090e]/80 backdrop-blur-md rounded text-[11px] font-mono text-cyan-300 border border-cyan-500/20">
                  02:18 AM · CORNER DISPENSER
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100 font-mincho">
                    深夜2時の自動販売機
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mincho">
                    誰も通らない静かな交差点で、青白い光を灯し続ける自販機。
                    吐き出した息が白く染まり、取り出し口から手にした温かい缶の熱だけが、
                    冷え切った掌に確かな現実を教えてくれる。
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>三丁目交差点</span>
                  <span>ISOTOPE 400 · 35mm</span>
                </div>
              </div>
            </div>

            {/* Card 2: Room Window with Cassette */}
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden group shadow-xl flex flex-col">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={ROOM_WINDOW_IMG}
                  alt="深夜の窓辺とイヤホン、カセットテープ"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#07090e]/80 backdrop-blur-md rounded text-[11px] font-mono text-amber-300 border border-amber-500/20">
                  03:05 AM · WINDOWSILL
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100 font-mincho">
                    二階の窓辺に残された音
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mincho">
                    雨滴のついたガラス窓の向こう、霧に霞む街並みをぼんやりと見下ろす。
                    机に置かれたイヤホンからは、今夜も同じ旋律が微かに漏れ聴こえている。
                    誰にも邪魔されない、この静寂の時間だけが唯一の救いだった。
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>窓辺の書斎</span>
                  <span>SHUTTER SPEED 1/15s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Whispers Board (夜の伝言板) */}
        <section id="whispers">
          <WhispersBoard />
        </section>

        {/* SECTION: EP Tracklist "住宅街の静寂" */}
        <section className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wider">
                <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>EP TRACKLIST</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">住宅街の静寂</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 font-mincho mt-1">
                住宅街の静寂 (Suburban Silence EP)
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              TOTAL 5 TRACKS · 13:00
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-800/60">
            {EP_TRACKLIST.map((track) => (
              <div
                key={track.number}
                className={`py-4 flex items-center justify-between gap-4 transition-colors ${
                  track.isCurrent
                    ? 'text-amber-300'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-slate-500 tabular-nums w-6">
                    {track.number}
                  </span>
                  <div>
                    <div className="font-mincho text-base font-medium flex items-center gap-2">
                      <span>{track.title}</span>
                      {track.isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                          NOW PLAYING
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-sans">
                      {track.sub}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {track.duration}
                  </span>
                  {track.isCurrent && (
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      aria-label="Play current track"
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-800/80 bg-[#05070c] py-12 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mincho">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-semibold text-sm">夜 — YORU</span>
            <span>·</span>
            <span>君のいない夜を生きている</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-sans text-xs">
            <span>Dark Mode Dedicated Design</span>
            <span>·</span>
            <span>Suburban Night Atmosphere</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
