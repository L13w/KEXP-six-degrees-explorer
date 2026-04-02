import { useState } from 'react';

function MusicNotePlaceholder() {
  return (
    <div className="art-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </div>
  );
}

export default function NowPlaying({ track }) {
  const [imgError, setImgError] = useState(false);
  const [imgKey, setImgKey] = useState('');

  // Reset image error when track changes
  const artUrl = track?.image_uri || track?.thumbnail_uri || '';
  const showArt = artUrl && !imgError;

  // Reset error state when URL changes
  if (artUrl !== imgKey) {
    setImgKey(artUrl);
    setImgError(false);
  }

  if (!track) {
    return (
      <>
        <div className="now-playing-art-wrap">
          <MusicNotePlaceholder />
        </div>
        <div className="now-playing-info">
          <div className="now-playing-song" style={{ color: 'var(--text-muted)' }}>
            Waiting for playback...
          </div>
        </div>
      </>
    );
  }

  const labels = track.labels?.filter(Boolean).join(', ') || '';

  return (
    <>
      <div className={`now-playing-art-wrap ${showArt ? 'has-art' : ''}`}>
        {showArt ? (
          <img
            className="now-playing-art"
            src={artUrl}
            alt={`${track.album || 'Album art'}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <MusicNotePlaceholder />
        )}
      </div>

      <div className="now-playing-info">
        <div className="now-playing-song">{track.song || 'Unknown Track'}</div>
        <div className="now-playing-artist">{track.artist || 'Unknown Artist'}</div>
        {track.album && <div className="now-playing-album">{track.album}</div>}
        {labels && <div className="now-playing-label">{labels}</div>}

        <div className="now-playing-badges">
          {track.is_local && <span className="badge">Local</span>}
          {track.is_request && <span className="badge">Request</span>}
          {track.is_live && <span className="badge badge-live">Live</span>}
        </div>
      </div>
    </>
  );
}
