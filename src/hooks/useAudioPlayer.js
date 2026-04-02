import { useState, useRef, useEffect, useCallback } from 'react';

const VOLUME_STORAGE_KEY = 'six-degrees-volume';
const DEFAULT_VOLUME = 0.2;

function loadSavedVolume() {
  try {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (saved !== null) return parseFloat(saved);
  } catch {}
  return DEFAULT_VOLUME;
}

function saveVolume(v) {
  try { localStorage.setItem(VOLUME_STORAGE_KEY, String(v)); } catch {}
}

export default function useAudioPlayer() {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const initialVolume = loadSavedVolume();
  const [volume, setVolumeState] = useState(initialVolume);
  const [src, setSrc] = useState(null);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = initialVolume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => { setIsPlaying(true); setBuffering(false); setError(null); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onError = () => {
      setBuffering(false);
      setError('Stream unavailable');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const load = useCallback((mp3Path) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = mp3Path;
    setSrc(mp3Path);
    setCurrentTime(0);
    setDuration(0);
    audio.load();
  }, []);

  const loadAndPlay = useCallback((mp3Path) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = mp3Path;
    setSrc(mp3Path);
    setCurrentTime(0);
    setDuration(0);
    audio.load();
    audio.play().catch(() => {});
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setVolume = useCallback((v) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = v;
      setVolumeState(v);
      saveVolume(v);
    }
  }, []);

  const onEnded = useCallback((callback) => {
    const audio = audioRef.current;
    if (!audio) return () => {};
    audio.addEventListener('ended', callback);
    return () => audio.removeEventListener('ended', callback);
  }, []);

  return {
    currentTime,
    duration,
    isPlaying,
    buffering,
    error,
    volume,
    src,
    load,
    loadAndPlay,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    onEnded,
  };
}
