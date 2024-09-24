import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/src/plugin/regions';

const AudioPlayer = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopEnabled, setLoopEnabled] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'purple',
            progressColor: 'orange',
            plugins: [
                Regions.create({
                    dragSelection: true,
                }),
            ],
        });

        if (audioUrl) {
            wavesurferRef.current.load(audioUrl);
        } else {
            console.error("audioUrl is empty or undefined");
        }

        return () => wavesurferRef.current.destroy();
    }, [audioUrl]);

    useEffect(() => {
        const handleRegionCreate = (region) => {
            const existingRegions = wavesurferRef.current.regions.list;
            for (const key in existingRegions) {
                existingRegions[key].remove();
            }
            setCurrentRegion(region);
            console.log(`Region created: Start: ${region.start.toFixed(2)}s, End: ${region.end.toFixed(2)}s`);
        };

        wavesurferRef.current.on('region-created', handleRegionCreate);

        const handleFinish = () => {
            if (loopEnabled && currentRegion) {
                wavesurferRef.current.play(currentRegion.start);
            } else {
                setIsPlaying(false);
            }
        };

        wavesurferRef.current.on('finish', handleFinish);

        return () => {
            wavesurferRef.current.un('region-created', handleRegionCreate);
            wavesurferRef.current.un('finish', handleFinish);
        };
    }, [loopEnabled, currentRegion]);

    useEffect(() => {
        const handleAudioProcess = () => {
            if (loopEnabled && currentRegion) {
                const currentTime = wavesurferRef.current.getCurrentTime();
                if (currentTime >= currentRegion.end) {
                    wavesurferRef.current.play(currentRegion.start);
                }
            }
        };

        wavesurferRef.current.on('audioprocess', handleAudioProcess);

        return () => {
            wavesurferRef.current.un('audioprocess', handleAudioProcess);
        };
    }, [loopEnabled, currentRegion]);

    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            wavesurferRef.current.pause();
            setIsPlaying(false);
        } else {
            if (currentRegion) {
                wavesurferRef.current.play(currentRegion.start);
            } else {
                wavesurferRef.current.play();
            }
            setIsPlaying(true);
        }
    }, [isPlaying, currentRegion]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handlePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handlePlayPause]);

    const toggleLoop = () => {
        setLoopEnabled((prev) => !prev);
    };

    useEffect(() => {
        const updateWaveformColor = () => {
            if (currentRegion && wavesurferRef.current) {
                const currentTime = wavesurferRef.current.getCurrentTime();
                if (currentTime >= currentRegion.start && currentTime <= currentRegion.end) {
                    wavesurferRef.current.setWaveColor('orange');
                } else {
                    wavesurferRef.current.setWaveColor('purple');
                }
            }
        };

        const interval = setInterval(updateWaveformColor, 100);

        return () => clearInterval(interval);
    }, [currentRegion]);

    return (
        <div>
            <div ref={waveformRef} />
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={() => wavesurferRef.current.seekTo(Math.max(0, wavesurferRef.current.getCurrentTime() - 0.25))}>Shift Back 1/4s</button>
            <button onClick={() => wavesurferRef.current.seekTo(Math.min(wavesurferRef.current.getDuration(), wavesurferRef.current.getCurrentTime() + 0.25))}>Shift Forward 1/4s</button>
            <label>
                <input type="checkbox" checked={loopEnabled} onChange={toggleLoop} />
                Loop
            </label>
        </div>
    );
};

export default AudioPlayer;
