import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';

const AudioPlayer = ({ mp3File }) => {
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [startMarker, setStartMarker] = useState(0);
  const [endMarker, setEndMarker] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      responsive: true,
      plugins: [
        RegionsPlugin.create({
          regions: [],
          dragSelection: false,
        }),
      ],
    });

    ws.load(URL.createObjectURL(mp3File));

    ws.on('ready', () => {
      const duration = ws.getDuration();
      setEndMarker(duration);
      setStartMarker(0);
      addRegion(0, duration); // Initially add the full duration region
    });

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('region-updated', (region) => {
      setStartMarker(region.start);
      setEndMarker(region.end);
    });

    setWaveSurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [mp3File]);

  const handleWaveformClick = (e) => {
    if (waveSurfer) {
      const waveformRect = waveformRef.current.getBoundingClientRect();
      const clickX = e.clientX - waveformRect.left;
      const clickTime = (clickX / waveformRect.width) * waveSurfer.getDuration();

      // Only create a new region if the click is within bounds
      if (clickTime >= 0 && clickTime <= waveSurfer.getDuration()) {
        addRegion(clickTime, clickTime + 5); // Default loop duration of 5 seconds
      }
    }
  };

  const addRegion = (start, end) => {
    // Clear existing regions
    Object.values(waveSurfer.regions.list).forEach((region) => {
      region.remove();
    });

    // Add a new region
    const newRegion = waveSurfer.addRegion({
      start,
      end,
      color: 'rgba(255, 0, 0, 0.5)',
      id: 'loop-region',
    });
    setStartMarker(start);
    setEndMarker(end);
    
    // Start playback at the new start position
    if (isPlaying) {
      waveSurfer.play(start, end);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      waveSurfer.pause();
    } else {
      waveSurfer.play(startMarker, endMarker);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekForward = () => {
    const newTime = currentTime + 0.25;
    const duration = waveSurfer.getDuration();
    if (duration > 0) {
      const seekPosition = Math.min(newTime, duration);
      waveSurfer.seekTo(seekPosition / duration);
    }
  };

  const handleSeekBackward = () => {
    const newTime = currentTime - 0.25;
    const duration = waveSurfer.getDuration();
    if (duration > 0) {
      const seekPosition = Math.max(newTime, 0);
      waveSurfer.seekTo(seekPosition / duration);
    }
  };

  const handleStartMarkerDrag = (e) => {
    const newStartTime = Math.max(0, parseFloat(e.target.value));
    const duration = waveSurfer.getDuration();
    if (newStartTime < endMarker) {
      updateRegion(newStartTime, endMarker);
    }
  };

  const handleEndMarkerDrag = (e) => {
    const newEndTime = Math.min(waveSurfer.getDuration(), parseFloat(e.target.value));
    if (newEndTime > startMarker) {
      updateRegion(startMarker, newEndTime);
    }
  };

  const updateRegion = (start, end) => {
    const region = waveSurfer.regions.list['loop-region'];
    if (region) {
      region.update({ start, end });
      setStartMarker(start);
      setEndMarker(end);
    }
  };

  return (
    <div>
      <div
        ref={waveformRef}
        onClick={handleWaveformClick}
        style={{ cursor: 'pointer', height: '128px', position: 'relative' }}
      />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleSeekBackward}>Seek Back 0.25s</button>
      <button onClick={handleSeekForward}>Seek Forward 0.25s</button>
      <div>Current Time: {currentTime.toFixed(2)}s</div>
    </div>
  );
};

export default AudioPlayer;
