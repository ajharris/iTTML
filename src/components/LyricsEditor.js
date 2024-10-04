import React, { useState } from 'react';
import LineRow from './LineRow';
import SongMetadata from './SongMetadata';

const LyricsEditor = ({ lyrics, setSongTitle, setAgentName, setLineTypes, onMarkerAdd, capturedTimes, setCapturedTimes, agentName, currentRegion }) => {
    const [manualTitle, setManualTitle] = useState('');
    const [titleLineIndex, setTitleLineIndex] = useState(null);
  
    const [lineTypes, updateLineTypes] = useState(
        lyrics.map(() => "Lyric") // Default all lines to "Lyric"
    );

    const handleCaptureRegion = (lineIndex) => {
        const newCapturedTimes = [...capturedTimes];
        const region = currentRegion;

        if (region) {
            console.log(`Captured region for line ${lineIndex}: Start ${region.start}, End ${region.end}`);
            newCapturedTimes[lineIndex] = { start: region.start, end: region.end };
            setCapturedTimes(newCapturedTimes);
        }
    };

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

        // Calculate start and end times for song components like Verse, Chorus, etc.
        if (["Verse", "Chorus", "Bridge", "Outro"].includes(newType)) {
            let verseStartTime = null;
            let verseEndTime = null;

            for (let i = lineIndex; i < lyrics.length; i++) {
                if (capturedTimes[i]?.start !== null) {
                    verseStartTime = capturedTimes[i].start;
                    break;
                }
            }

            for (let i = lineIndex; i < lyrics.length; i++) {
                if (capturedTimes[i]?.end !== null) {
                    verseEndTime = capturedTimes[i].end;
                }

                if (lineTypes[i] && lineTypes[i] !== newType && ["Verse", "Chorus", "Bridge", "Outro"].includes(lineTypes[i])) {
                    break;
                }
            }

            if (verseStartTime !== null && verseEndTime !== null) {
                onMarkerAdd({ type: 'start', time: verseStartTime, lineIndex });
                onMarkerAdd({ type: 'end', time: verseEndTime, lineIndex });
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
