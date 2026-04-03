import { useRef, useEffect, useCallback, useState } from 'react';
import TrackRow from './TrackRow';

export default function Playlist({ tracks, currentTrackIndex, onSeekToTrack, canSeek }) {
  const listRef = useRef(null);
  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const lastAutoScrollIndex = useRef(-1);

  // Detect manual scrolling — pause auto-scroll for 3 seconds
  const handleScroll = useCallback(() => {
    // If this scroll was triggered by us, ignore
    if (lastAutoScrollIndex.current === currentTrackIndex) return;

    setUserScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 3000);
  }, [currentTrackIndex]);

  // Auto-scroll to current track
  useEffect(() => {
    if (currentTrackIndex < 0 || userScrolling) return;

    const list = listRef.current;
    if (!list) return;

    const row = list.querySelector(`[data-track-index="${currentTrackIndex}"]`);
    if (row) {
      lastAutoScrollIndex.current = currentTrackIndex;
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentTrackIndex, userScrolling]);

  if (!tracks || tracks.length === 0) {
    return (
      <div className="playlist">
        <div className="playlist-empty">No playlist data available</div>
      </div>
    );
  }

  return (
    <div className="playlist" ref={listRef} onScroll={handleScroll}>
      {tracks.map((track, i) => (
        <TrackRow
          key={i}
          track={track}
          index={i}
          isActive={i === currentTrackIndex}
          onClick={onSeekToTrack ? () => onSeekToTrack(track) : undefined}
          canSeek={canSeek}
        />
      ))}
    </div>
  );
}
