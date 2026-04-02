import { useCallback } from 'react';

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Transport({ audio, show, onShowClick }) {
  const handleSeek = useCallback((e) => {
    audio.seek(Number(e.target.value));
  }, [audio]);

  const handleVolume = useCallback((e) => {
    audio.setVolume(Number(e.target.value));
  }, [audio]);

  return (
    <div className="transport">
      <button className="transport-play-btn" onClick={audio.togglePlay}>
        {audio.buffering ? (
          <svg className="transport-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : audio.isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
        )}
      </button>

      <div className="transport-seek-area">
        <span className="transport-time">{formatTime(audio.currentTime)}</span>
        <input
          type="range"
          className="seek-bar"
          min={0}
          max={audio.duration || 0}
          value={audio.currentTime}
          onChange={handleSeek}
          step={1}
        />
        <span className="transport-time transport-time-right">{formatTime(audio.duration)}</span>
      </div>

      <div className="transport-volume">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <input
          type="range"
          className="volume-bar"
          min={0}
          max={1}
          step={0.01}
          value={audio.volume}
          onChange={handleVolume}
        />
      </div>

      {audio.error && (
        <span className="transport-error">{audio.error}</span>
      )}
    </div>
  );
}
