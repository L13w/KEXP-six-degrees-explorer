import { useMemo } from 'react';

export default function usePlaylistSync(tracks, currentTime) {
  const currentTrackIndex = useMemo(() => {
    if (!tracks || tracks.length === 0) return -1;

    // Find the last track whose offset_seconds <= currentTime
    let idx = -1;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].offset_seconds <= currentTime) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [tracks, Math.floor(currentTime)]); // Floor to avoid re-computing every ms

  return currentTrackIndex;
}
