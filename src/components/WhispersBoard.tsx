import React, { useState, useEffect } from 'react';
import { INITIAL_WHISPERS, MemoryPost } from '../data/songData';
import { MessageSquare, Heart, Send, MapPin, Sparkles } from 'lucide-react';

export const WhispersBoard: React.FC = () => {
  const [posts, setPosts] = useState<MemoryPost[]>(() => {
    try {
      const saved = localStorage.getItem('yoru_whispers_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WHISPERS;
  });

  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [locationTag, setLocationTag] = useState('街灯の真下');
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('yoru_whispers_v1', JSON.stringify(posts));
    } catch {
      // storage failed
    }
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const now = new Date();
    const h = String((now.getHours() % 6) + 1).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');

    const newPost: MemoryPost = {
      id: `w_${Date.now()}`,
      author: author.trim() || '名もなき歩行者',
      timeString: `午前 0${h}:${m}`,
      message: message.trim(),
      locationTag: locationTag || '三丁目の路地裏',
      likes: 1,
    };

    setPosts([newPost, ...posts]);
    setMessage('');
  };

  const handleLike = (id: string) => {
    if (hasLiked[id]) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    setHasLiked((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>NIGHTBOARD · WHISPERS</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">言えなかった想い</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 font-mincho mt-1">
            夜の伝言板 — 残された言葉
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            届かなかった手紙や、誰にも言えなかった独り言を、静かな夜の街並みにそっと残していく場所。
          </p>
        </div>
      </div>

      {/* Message Submission Form */}
      <form onSubmit={handleSubmit} className="mt-6 bg-slate-900/60 rounded-xl p-4 sm:p-5 border border-slate-800/80 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 font-mincho mb-1.5">
            夜の街にそっと残す言葉
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="言えなかったこと、消せないままの想い、夜の住宅街でふと思い出したこと..."
            rows={3}
            maxLength={280}
            className="w-full bg-[#070a12] border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none font-mincho"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              あなたの名（空欄の場合は「名もなき歩行者」）
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="例: 雨宿りの人、深夜の散歩者"
              maxLength={20}
              className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              残す場所
            </label>
            <select
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              className="w-full bg-[#070a12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="街灯の真下">街灯の真下</option>
              <option value="自動販売機の前">自動販売機の前</option>
              <option value="二階の窓際">二階の窓際</option>
              <option value="雨の交差点">雨の交差点</option>
              <option value="誰もいない電柱の影">誰もいない電柱の影</option>
              <option value="踏切のフェンス際">踏切のフェンス際</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            {message.length} / 280 文字
          </span>
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-medium text-xs rounded-lg hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>夜に放つ</span>
          </button>
        </div>
      </form>

      {/* Messages Stream */}
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-3 text-xs mb-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-medium text-slate-300 font-mincho">
                  {post.author}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500 font-mono tabular-nums">
                  {post.timeString}
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-[11px] text-amber-400/80">
                  <MapPin className="w-3 h-3" />
                  <span>{post.locationTag}</span>
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 font-mincho leading-relaxed">
              {post.message}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-end">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs transition-colors px-2.5 py-1 rounded-md ${
                  hasLiked[post.id]
                    ? 'text-rose-400 bg-rose-500/10'
                    : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/60'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    hasLiked[post.id] ? 'fill-rose-400 text-rose-400' : ''
                  }`}
                />
                <span className="font-mono tabular-nums">{post.likes}</span>
                <span className="text-[11px]">共鳴</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
