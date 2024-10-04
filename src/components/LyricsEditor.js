import React, { useState } from 'react';
import LineRow from './LineRow';
import SongMetadata from './SongMetadata';

const LyricsEditor = ({ lyrics, setSongTitle, setAgentName, setLineTypes, onMarkerAdd, capturedTimes, setCapturedTimes, agentName, currentRegion }) => {
    const [manualTitle, setManualTitle] = useState('');
    const [titleLineIndex, setTitleLineIndex] = useState(null);

    const [lineTypes, updateLineTypes] = useState(
        lyrics.map(() => "Lyric") // Default all lines to "Lyric"
    );

    // Capture region logic for lyrics
    const handleCaptureRegion = (lineIndex) => {
        const newCapturedTimes = [...capturedTimes];
        const region = currentRegion;

        if (region) {
            console.log(`Captured region for line ${lineIndex}: Start ${region.start}, End ${region.end}`);
            newCapturedTimes[lineIndex] = { start: region.start, end: region.end };
            setCapturedTimes(newCapturedTimes);
        }
    };

    // Handle line type changes and calculate verse start/end times
    const handleLineTypeChange = (lineIndex, newType) => {
        const newLineTypes = [...lineTypes];

        if (newType === "Title") {
            if (titleLineIndex !== null && titleLineIndex !== lineIndex) {
                alert("You can only have one title. Please change the current title first.");
                return;
            }
            setSongTitle(lyrics[lineIndex]);
            setTitleLineIndex(lineIndex);
            setManualTitle(lyrics[lineIndex]);
        } else if (lineTypes[lineIndex] === "Title") {
            setSongTitle(manualTitle);
            setTitleLineIndex(null);
        }

        newLineTypes[lineIndex] = newType;
        updateLineTypes(newLineTypes);
        setLineTypes(newLineTypes);

        // If this line is marked as a Verse, Chorus, etc., calculate and log start and end times
        if (["Verse", "Chorus", "Bridge", "Outro"].includes(newType)) {
            let verseStartTime = null;
            let verseEndTime = null;

            console.log(`Starting search for ${newType} starting from line ${lineIndex}.`);

            // Search backward for the first valid start time (earliest start)
            for (let i = lineIndex; i >= 0; i--) {
                console.log(`Checking line ${i}: type=${lineTypes[i]}, start=${capturedTimes[i]?.start}, end=${capturedTimes[i]?.end}`);
                if (capturedTimes[i]?.start !== null && lineTypes[i] === newType) {
                    verseStartTime = capturedTimes[i].start;
                    console.log(`Found start time for ${newType} at line ${i}: ${verseStartTime}`);
                    break;
                }
            }

            // Search forward for the last valid end time (latest end)
            for (let i = lineIndex; i < lyrics.length; i++) {
                console.log(`Checking line ${i}: type=${lineTypes[i]}, start=${capturedTimes[i]?.start}, end=${capturedTimes[i]?.end}`);
                if (capturedTimes[i]?.end !== null && lineTypes[i] === newType) {
                    verseEndTime = capturedTimes[i].end;
                    console.log(`Found end time for ${newType} at line ${i}: ${verseEndTime}`);
                }

                // Stop searching when a different song component starts
                if (lineTypes[i] && lineTypes[i] !== newType && ["Verse", "Chorus", "Bridge", "Outro"].includes(lineTypes[i])) {
                    console.log(`Stopped searching due to encountering ${lineTypes[i]} at line ${i}`);
                    break;
                }
            }

            // Log start/end times for the current song component (e.g., Verse)
            if (verseStartTime !== null && verseEndTime !== null) {
                console.log(`${newType} defined from ${verseStartTime.toFixed(2)}s to ${verseEndTime.toFixed(2)}s`);
                onMarkerAdd({ type: 'start', time: verseStartTime, lineIndex });
                onMarkerAdd({ type: 'end', time: verseEndTime, lineIndex });
            } else {
                console.log(`${newType} could not be defined (no valid start or end times).`);
            }
        }
    };

    const handleManualTitleChange = (e) => {
        const newTitle = e.target.value;
        setManualTitle(newTitle);
        if (titleLineIndex === null) {
            setSongTitle(newTitle);
        }
    };

    return (
        <div>
            <SongMetadata
                songTitle={manualTitle}
                onTitleChange={handleManualTitleChange}
                agentName={agentName}
                setAgentName={setAgentName}
                titleLineIndex={titleLineIndex}
            />

            <table>
                <thead>
                    <tr>
                        <th>Line</th>
                        <th>Action</th>
                        <th>Start Time (s)</th>
                        <th>End Time (s)</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {lyrics.map((line, index) => (
                        <LineRow
                            key={index}
                            line={line}
                            lineIndex={index}
                            capturedTimes={capturedTimes}
                            handleCaptureRegion={handleCaptureRegion}
                            handleLineTypeChange={handleLineTypeChange}
                            lineTypes={lineTypes}
                            titleLineIndex={titleLineIndex}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LyricsEditor;
