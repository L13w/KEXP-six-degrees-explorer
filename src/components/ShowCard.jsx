import { useState } from 'react';

export default function ShowCard({ show, animDelay, onClick }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = !imgError && (show.hostImage || show.programImage);
  const tags = show.programTags ? show.programTags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div
      className={`show-card ${!show.hasMP3 ? 'unavailable' : ''}`}
      style={{ animationDelay: `${animDelay}s` }}
      onClick={onClick}
    >
      <div className="card-top">
        {imageSrc ? (
          <img
            className="card-image"
            src={imageSrc}
            alt=""
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold-dim)' }}>
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
        <div className="card-info">
          <div className="card-program-name">{show.programName}</div>
          <div className="card-hosts">{show.hosts.join(', ') || 'Unknown Host'}</div>
          <div className="card-time">{show.displayTime}</div>
        </div>
      </div>

      {show.highlightedArtist && (
        <div className="card-highlighted-artist">
          Highlighted artist: <span>{show.highlightedArtist}</span>
        </div>
      )}

      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map(tag => (
            <span className="card-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}

      {!show.hasMP3 && (
        <div className="card-unavailable-badge">Audio unavailable</div>
      )}
    </div>
  );
}
