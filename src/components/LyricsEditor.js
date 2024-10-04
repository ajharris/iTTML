import React, { useState } from 'react';
import LineRow from './LineRow';
import SongMetadata from './SongMetadata';

const LyricsEditor = ({ lyrics, setSongTitle, setAgentName, setLineTypes, onMarkerAdd, capturedTimes, setCapturedTimes, agentName, currentRegion }) => {
  const [manualTitle, setManualTitle] = useState('');
  const [titleLineIndex, setTitleLineIndex] = useState(null);
  
  // Initialize lineTypes and capturedTimes based on lyrics length
  const [lineTypes, updateLineTypes] = useState(
    lyrics.map(() => "Lyric")
  );

  const handleCaptureRegion = (lineIndex) => {
    const newCapturedTimes = [...capturedTimes];
    const region = currentRegion; // Make sure currentRegion is passed from AudioPlayer

    if (region) {
      newCapturedTimes[lineIndex] = { start: region.start, end: region.end };
      setCapturedTimes(newCapturedTimes);
      onMarkerAdd({ type: 'start', time: region.start, lineIndex });
      onMarkerAdd({ type: 'end', time: region.end, lineIndex });
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
