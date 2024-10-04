import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/src/plugin/regions';

const AudioPlayer = ({ audioUrl, setCurrentRegion, currentRegion }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopEnabled, setLoopEnabled] = useState(false);

    // Initialize wavesurfer and load audio
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

    // Capture and handle the creation of regions
    useEffect(() => {
        const handleRegionCreate = (region) => {
            const existingRegions = wavesurferRef.current.regions.list;
            for (const key in existingRegions) {
                existingRegions[key].remove(); // Remove any existing region
            }
            setCurrentRegion(region);  
            console.log(`Region created: Start: ${region.start.toFixed(2)}s, End: ${region.end.toFixed(2)}s`);
        };

        wavesurferRef.current.on('region-created', handleRegionCreate);

        return () => {
            wavesurferRef.current.un('region-created', handleRegionCreate);
        };
    }, [setCurrentRegion]);

    // Check and manage the loop functionality
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

    // Handle play/pause functionality
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

    // Toggle the loop functionality
    const toggleLoop = () => {
        setLoopEnabled((prev) => !prev);
    };

    // Handle shifting playback backward by 1/4 second
    const shiftBackward = () => {
        const newTime = Math.max(0, wavesurferRef.current.getCurrentTime() - 0.25);
        wavesurferRef.current.seekTo(newTime / wavesurferRef.current.getDuration());
    };

    // Handle shifting playback forward by 1/4 second
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
