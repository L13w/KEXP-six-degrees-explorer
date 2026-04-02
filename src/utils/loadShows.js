import { getHighlightedArtist } from '../data/highlighted-artists';

// Six Degrees Week: The Continent (Fri Mar 20, 7pm PT) through Drive Time (Fri Mar 27, 4:03pm PT)
const SIX_DEGREES_START = new Date('2026-03-20T19:00:00-07:00');
const SIX_DEGREES_END = new Date('2026-03-27T16:04:00-07:00'); // just after Drive Time start

function getDayKey(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDayHeader(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Normalize a show item from either source into a common shape.
 * Electron IPC returns { filename, json: { show, tracks }, hasMP3, mp3Path }
 * Baked JSON returns { filename, programName, hosts, startTime, tracks, mp3Url, ... }
 */
function normalizeItem(item) {
  if (item.json) {
    // Electron mode
    return {
      filename: item.filename,
      programName: item.json.show.program_name,
      programTags: item.json.show.program_tags || '',
      hosts: item.json.show.hosts || [],
      tagline: item.json.show.tagline || '',
      startTimeStr: item.json.show.start_time,
      mp3StartTime: item.json.show.mp3_start_time || null,
      hostImage: item.json.show.host_image || '',
      programImage: item.json.show.program_image || '',
      tracks: item.json.tracks || [],
      hasMP3: item.hasMP3,
      mp3Path: item.mp3Path,
    };
  }
  // Web/baked mode
  return {
    filename: item.filename,
    programName: item.programName,
    programTags: item.programTags || '',
    hosts: item.hosts || [],
    tagline: item.tagline || '',
    startTimeStr: item.startTime,
    mp3StartTime: item.mp3StartTime || null,
    hostImage: item.hostImage || '',
    programImage: item.programImage || '',
    tracks: item.tracks || [],
    hasMP3: item.hasMP3 !== false && !!item.mp3Url,
    mp3Path: item.mp3Url || '',
  };
}

export async function loadShows() {
  let rawItems;

  if (window.electronAPI) {
    // Electron mode — load from local filesystem
    const result = await window.electronAPI.scanShows();
    if (result.error) {
      console.error(result.error);
      return { shows: [], dayGroups: [], error: result.error };
    }
    rawItems = result.shows;
  } else {
    // Web mode — load baked data
    try {
      const mod = await import('../data/shows-data.json');
      rawItems = mod.default || mod;
    } catch {
      return { shows: [], dayGroups: [], error: 'Show data not found. Run: npm run build:data' };
    }
  }

  const shows = [];
  const seen = new Set();

  for (const raw of rawItems) {
    const item = normalizeItem(raw);
    const startTime = new Date(item.startTimeStr);

    // Filter to Six Degrees date range
    if (startTime < SIX_DEGREES_START || startTime >= SIX_DEGREES_END) continue;

    // Deduplicate by start_time + program_name
    const dedupeKey = startTime.toISOString() + '|' + item.programName;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    // Adjust track offsets: offset_seconds is relative to show start_time,
    // but the MP3 archive starts at mp3_start_time (earlier).
    const mp3Start = item.mp3StartTime ? new Date(item.mp3StartTime) : null;
    const showStartMs = startTime.getTime();
    const mp3StartMs = mp3Start ? mp3Start.getTime() : showStartMs;
    const deltaSeconds = (showStartMs - mp3StartMs) / 1000;

    const tracks = item.tracks
      .filter(t => t.play_type === 'trackplay')
      .map(t => {
        const adjusted = t.offset_seconds + deltaSeconds;
        const h = Math.floor(adjusted / 3600);
        const m = Math.floor((adjusted % 3600) / 60);
        const s = Math.floor(adjusted % 60);
        return {
          ...t,
          offset_seconds: adjusted,
          offset_display: `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
        };
      });

    shows.push({
      filename: item.filename,
      programName: item.programName,
      programTags: item.programTags,
      hosts: item.hosts,
      tagline: item.tagline,
      startTime,
      startTimeStr: item.startTimeStr,
      hostImage: item.hostImage,
      programImage: item.programImage,
      tracks,
      hasMP3: item.hasMP3,
      mp3Path: item.mp3Path,
      displayTime: formatTime(startTime),
      dayKey: getDayKey(startTime),
      highlightedArtist: getHighlightedArtist(item.filename),
    });
  }

  // Merge split shows: same program name, start times within 3 hours.
  // Some shows span two archive blocks (e.g., Street Sounds has a 1-track
  // block and an 18-track block). Merge tracks into the earlier show.
  shows.sort((a, b) => a.startTime - b.startTime);
  const THREE_HOURS = 3 * 60 * 60 * 1000;
  for (let i = shows.length - 1; i > 0; i--) {
    const curr = shows[i];
    const prev = shows[i - 1];
    if (
      curr.programName === prev.programName &&
      curr.startTime - prev.startTime < THREE_HOURS
    ) {
      // Merge curr's tracks into prev, skip duplicates by airdate
      const existingAirdates = new Set(prev.tracks.map(t => t.airdate));
      for (const track of curr.tracks) {
        if (!existingAirdates.has(track.airdate)) {
          prev.tracks.push(track);
        }
      }
      prev.tracks.sort((a, b) => a.offset_seconds - b.offset_seconds);
      shows.splice(i, 1);
    }
  }

  const dayMap = new Map();
  for (const show of shows) {
    if (!dayMap.has(show.dayKey)) {
      dayMap.set(show.dayKey, {
        key: show.dayKey,
        label: formatDayHeader(show.dayKey),
        shows: [],
      });
    }
    dayMap.get(show.dayKey).shows.push(show);
  }

  return { shows, dayGroups: Array.from(dayMap.values()) };
}
