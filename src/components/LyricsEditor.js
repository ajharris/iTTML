import React from 'react';

const LyricsEditor = ({ lyrics, markers, onLink, onMarkerAdd }) => {
  const handleCaptureStart = (lineIndex) => {
    const startTime = prompt("Enter the start time for the line (in seconds):");
    if (startTime) {
      onMarkerAdd({ type: 'start', time: parseFloat(startTime), lineIndex });
    }
  };

  const handleCaptureEnd = (lineIndex) => {
    const endTime = prompt("Enter the end time for the line (in seconds):");
    if (endTime) {
      onMarkerAdd({ type: 'end', time: parseFloat(endTime), lineIndex });
    }
  };

  return (
    <div>
      <h2>Lyrics Editor</h2>
      <ul>
        {lyrics.map((line, index) => (
          <li key={index}>
            {line}
            <button onClick={() => handleCaptureStart(index)}>Capture Start</button>
            <button onClick={() => handleCaptureEnd(index)}>Capture End</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LyricsEditor;
