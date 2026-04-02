import { useCallback, useState } from 'react';
import usePlaylistSync from '../hooks/usePlaylistSync';
import NowPlaying from './NowPlaying';
import Playlist from './Playlist';

function formatShowDate(startTime) {
  return startTime.toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShowTime(startTime) {
  return startTime.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Player({ show, audio, onBack }) {
  const currentTrackIndex = usePlaylistSync(show.tracks, audio.currentTime);
  const currentTrack = show.tracks[currentTrackIndex] || null;
  const [copied, setCopied] = useState(false);

  const handleSeekToTrack = useCallback((track) => {
    audio.seek(track.offset_seconds);
  }, [audio]);

  const handleShare = useCallback(() => {
    const url = window.location.origin + window.location.pathname + '#/show/' + encodeURIComponent(show.filename);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: select from a prompt
      window.prompt('Copy this link:', url);
    });
  }, [show.filename]);

  return (
    <div className="player">
      {/* Back button */}
      <button className="player-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to shows
      </button>

      {/* Share button */}
      <button className="player-share" onClick={handleShare}>
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Link copied
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share this show
          </>
        )}
      </button>

      {/* Main content area */}
      <div className="player-content">
        {/* Left: Show info + Now Playing */}
        <div className="player-left">
          <div className="player-show-header">
            <h1 className="player-show-name">{show.programName}</h1>
            <div className="player-show-hosts">{show.hosts.join(', ')}</div>
            <div className="player-show-datetime">
              {formatShowDate(show.startTime)} &middot; {formatShowTime(show.startTime)}
            </div>
            {show.highlightedArtist && (
              <div className="player-highlighted-artist">
                Highlighted artist: <span>{show.highlightedArtist}</span>
              </div>
            )}
          </div>

          <NowPlaying track={currentTrack} />
        </div>

        {/* Right: Playlist with inline comments */}
        <div className="player-right">
          <Playlist
            tracks={show.tracks}
            currentTrackIndex={currentTrackIndex}
            onSeekToTrack={handleSeekToTrack}
          />
        </div>
      </div>
    </div>
  );
}
