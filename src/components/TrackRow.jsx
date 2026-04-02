import { useState } from 'react';

function linkifyText(text) {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0;
      return `<a href="${part}" target="_blank" rel="noopener noreferrer">${part}</a>`;
    }
    urlRegex.lastIndex = 0;
    return part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }).join('');
}

export default function TrackRow({ track, index, isActive, onClick }) {
  const [imgError, setImgError] = useState(false);
  const artUrl = !imgError && (track.image_uri || track.thumbnail_uri || '');
  const comment = track.comment || '';
  const commentHtml = linkifyText(comment);
  const labels = track.labels?.filter(Boolean).join(', ') || '';

  return (
    <div
      className={`track-row ${isActive ? 'active' : ''}`}
      data-track-index={index}
      onClick={onClick}
    >
      {/* Left: artwork */}
      <div className="track-art-col">
        {artUrl ? (
          <img
            className="track-art"
            src={artUrl}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="track-art track-art-placeholder" />
        )}
      </div>

      {/* Center: song info */}
      <div className="track-center">
        <div className="track-airtime">{track.offset_display}</div>
        <div className="track-song">{track.song || 'Unknown'}</div>
        <div className="track-artist">{track.artist || 'Unknown Artist'}</div>
        {track.album && (
          <div className="track-album-line">
            {track.album}
            {labels && <span className="track-label"> &middot; {labels}</span>}
          </div>
        )}
        {(track.is_live || track.is_local || track.is_request) && (
          <div className="track-badges">
            {track.is_live && <span className="badge badge-live">Live</span>}
            {track.is_local && <span className="badge">Local</span>}
            {track.is_request && <span className="badge">Request</span>}
          </div>
        )}
      </div>

      {/* Right: DJ comment */}
      <div className="track-comment-col">
        {comment ? (
          <div
            className="track-comment-text"
            dangerouslySetInnerHTML={{ __html: commentHtml }}
          />
        ) : null}
      </div>
    </div>
  );
}
