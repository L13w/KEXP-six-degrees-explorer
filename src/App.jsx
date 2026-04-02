import { useState, useEffect, useCallback } from 'react';
import { loadShows } from './utils/loadShows';
import useAudioPlayer from './hooks/useAudioPlayer';
import ShowSelector from './components/ShowSelector';
import Player from './components/Player';
import Transport from './components/Transport';

function getShowFromHash(shows) {
  const hash = window.location.hash;
  if (!hash.startsWith('#/show/')) return null;
  const filename = decodeURIComponent(hash.slice(7)); // after "#/show/"
  return shows.findIndex(s => s.filename === filename);
}

function setHash(filename) {
  window.history.pushState(null, '', '#/show/' + encodeURIComponent(filename));
}

function clearHash() {
  window.history.pushState(null, '', window.location.pathname);
}

export default function App() {
  const [shows, setShows] = useState([]);
  const [dayGroups, setDayGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentShowIndex, setCurrentShowIndex] = useState(null);
  const [view, setView] = useState('selector');
  const [transition, setTransition] = useState(null);
  const audio = useAudioPlayer();

  useEffect(() => {
    loadShows().then(result => {
      if (result.error) setError(result.error);
      setShows(result.shows);
      setDayGroups(result.dayGroups);

      // Check URL hash for deep link to a specific show
      const idx = getShowFromHash(result.shows);
      if (idx !== null && idx >= 0) {
        setCurrentShowIndex(idx);
        setView('player');
        // Load audio (but don't play) so transport bar appears
        const s = result.shows[idx];
        if (s.hasMP3 && s.mp3Path) {
          audio.load(s.mp3Path);
        }
      }

      setLoading(false);
    });
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const idx = getShowFromHash(shows);
      if (idx !== null && idx >= 0) {
        setCurrentShowIndex(idx);
        setView('player');
      } else {
        setView('selector');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [shows]);

  const handleSelectShow = useCallback((show) => {
    const idx = shows.indexOf(show);
    const i = idx >= 0 ? idx : 0;

    if (i !== currentShowIndex) {
      setCurrentShowIndex(i);
      if (shows[i].hasMP3 && shows[i].mp3Path) {
        audio.loadAndPlay(shows[i].mp3Path);
      }
    }

    setView('player');
    setHash(shows[i].filename);
  }, [shows, audio, currentShowIndex]);

  const handleBack = useCallback(() => {
    setView('selector');
    clearHash();
  }, []);

  const handleNextShow = useCallback(() => {
    if (currentShowIndex !== null && currentShowIndex < shows.length - 1) {
      const nextIdx = currentShowIndex + 1;
      const nextShow = shows[nextIdx];
      setCurrentShowIndex(nextIdx);
      setHash(nextShow.filename);
      setTransition(nextShow);
      setTimeout(() => {
        setTransition(null);
        if (nextShow.hasMP3 && nextShow.mp3Path) {
          audio.loadAndPlay(nextShow.mp3Path);
        }
      }, 3000);
      return nextShow;
    }
    return null;
  }, [currentShowIndex, shows, audio]);

  useEffect(() => {
    return audio.onEnded(() => {
      handleNextShow();
    });
  }, [audio.onEnded, handleNextShow]);

  const currentShow = currentShowIndex !== null ? shows[currentShowIndex] : null;
  const hasAudio = audio.src !== null;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading shows...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-text error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className={`view-container ${view === 'selector' ? 'view-active' : 'view-hidden'}`}
           style={hasAudio ? { paddingBottom: '64px' } : undefined}>
        <ShowSelector dayGroups={dayGroups} onSelectShow={handleSelectShow} />
      </div>
      {currentShow && (
        <div className={`view-container ${view === 'player' ? 'view-active' : 'view-hidden'}`}>
          <Player
            show={currentShow}
            audio={audio}
            onBack={handleBack}
          />
        </div>
      )}

      {hasAudio && currentShow && (
        <Transport
          audio={audio}
          show={currentShow}
          onShowClick={view === 'selector' ? () => setView('player') : undefined}
        />
      )}

      {transition && (
        <div className="transition-overlay">
          <div className="transition-label">Up next</div>
          <div className="transition-show-name">{transition.programName}</div>
          <div className="transition-host">with {transition.hosts.join(', ')}</div>
        </div>
      )}
    </div>
  );
}
