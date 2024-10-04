import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/src/plugin/regions';

const AudioPlayer = ({ audioUrl, setCurrentRegion, currentRegion }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopEnabled, setLoopEnabled] = useState(false);

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
        }

        return () => wavesurferRef.current.destroy();
    }, [audioUrl]);

    useEffect(() => {
        const handleRegionCreate = (region) => {
            const existingRegions = wavesurferRef.current.regions.list;
            for (const key in existingRegions) {
                existingRegions[key].remove(); // Remove any existing region
            }
            setCurrentRegion(region); // Call setCurrentRegion to set the current region
            console.log(`Region created: Start: ${region.start.toFixed(2)}s, End: ${region.end.toFixed(2)}s`);
        };
    
        wavesurferRef.current.on('region-created', handleRegionCreate);
    
        return () => {
            wavesurferRef.current.un('region-created', handleRegionCreate);
        };
    }, [setCurrentRegion]);
    
    useEffect(() => {
        const checkLoop = () => {
            if (loopEnabled && currentRegion) {
                const currentTime = wavesurferRef.current.getCurrentTime();
                if (currentTime >= currentRegion.end) {
                    wavesurferRef.current.seekTo(currentRegion.start / wavesurferRef.current.getDuration());
                    wavesurferRef.current.play(); // Restart playback at the start of the region
                }
            }
        };

        wavesurferRef.current.on('audioprocess', checkLoop);

        return () => {
            wavesurferRef.current.un('audioprocess', checkLoop);
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

    const handleWaveformClick = (event) => {
        const boundingRect = waveformRef.current.getBoundingClientRect();
        const x = event.clientX - boundingRect.left; // Mouse X position relative to the waveform
        const duration = wavesurferRef.current.getDuration(); // Total duration of the audio
        const progress = x / boundingRect.width; // Calculate progress ratio
        const time = progress * duration; // Calculate time in seconds

        wavesurferRef.current.play(time); // Start playback from clicked position
        setIsPlaying(true);
    };

    useEffect(() => {
        const waveformElement = waveformRef.current;
        waveformElement.addEventListener('click', handleWaveformClick);
        
        return () => {
            waveformElement.removeEventListener('click', handleWaveformClick);
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space') {
                // Check if the active element is a text field, where the space bar should act normally
                const activeElement = document.activeElement;
                const isInTextField = activeElement.tagName === 'INPUT' || 
                                      activeElement.tagName === 'TEXTAREA' || 
                                      activeElement.isContentEditable;
                if (!isInTextField) {
                    event.preventDefault(); // Prevent default scrolling behavior
                    handlePlayPause();
                }
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

    const shiftBackward = () => {
        const newTime = Math.max(0, wavesurferRef.current.getCurrentTime() - 0.25);
        wavesurferRef.current.seekTo(newTime / wavesurferRef.current.getDuration());
    };

    const shiftForward = () => {
        const newTime = Math.min(wavesurferRef.current.getDuration(), wavesurferRef.current.getCurrentTime() + 0.25);
        wavesurferRef.current.seekTo(newTime / wavesurferRef.current.getDuration());
    };

    return (
        <div>
            <div ref={waveformRef} />
            <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={shiftBackward}>Shift Back 1/4s</button>
            <button onClick={shiftForward}>Shift Forward 1/4s</button>
            <label>
                <input type="checkbox" checked={loopEnabled} onChange={toggleLoop} />
                Loop
            </label>
        </div>
    );
};

export default AudioPlayer;
