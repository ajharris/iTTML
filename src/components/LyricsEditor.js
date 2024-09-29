import React, { useState, useEffect } from 'react';
import LineRow from './LineRow';
import SongMetadata from './SongMetadata';
import ExportButton from './ExportButton';

const LyricsEditor = ({ lyrics, markers, currentRegion, onMarkerAdd, onExport }) => {
  const [capturedTimes, setCapturedTimes] = useState(lyrics.map(() => ({ start: null, end: null })));
  const [lineTypes, setLineTypes] = useState(lyrics.map(() => "Lyric")); // Default to "Lyric" for each line
  const [songPartTimes, setSongPartTimes] = useState({}); // Store start and end times for song sections
  const [songTitle, setSongTitle] = useState(''); // State for storing the song title
  const [manualTitle, setManualTitle] = useState(''); // State to track manual title input
  const [titleLineIndex, setTitleLineIndex] = useState(null); // Keep track of which line is the title
  const [agentName, setAgentName] = useState(''); // Store the lyricist/agent name

  // Capture region logic for lyrics
  const handleCaptureRegion = (lineIndex) => {
    if (currentRegion.start !== null && currentRegion.end !== null) {
      const newCapturedTimes = [...capturedTimes];
      newCapturedTimes[lineIndex] = {
        start: currentRegion.start,
        end: currentRegion.end,
      };
      setCapturedTimes(newCapturedTimes);
      onMarkerAdd({ type: 'start', time: currentRegion.start, lineIndex });
      onMarkerAdd({ type: 'end', time: currentRegion.end, lineIndex });
    }
  };

  // Handle line type change logic
  const handleLineTypeChange = (lineIndex, newType) => {
    const newLineTypes = [...lineTypes];

    if (newType === "Title") {
      // If a title already exists, prevent adding a second title
      if (titleLineIndex !== null && titleLineIndex !== lineIndex) {
        alert("You can only have one title. Please change the current title first.");
        return;
      }
      setSongTitle(lyrics[lineIndex]); // Set song title to the selected line's text
      setTitleLineIndex(lineIndex); // Track the line set as title
    } else if (lineTypes[lineIndex] === "Title") {
      // If changing the current title line to something else, clear the title and allow manual input again
      setSongTitle(manualTitle);
      setTitleLineIndex(null);
    }

    newLineTypes[lineIndex] = newType;
    setLineTypes(newLineTypes);
  };

  // Function to handle manual title input
  const handleManualTitleChange = (e) => {
    const newTitle = e.target.value;
    setManualTitle(newTitle);
    // Only update the title if no title has been selected from the lyrics
    if (titleLineIndex === null) {
      setSongTitle(newTitle);
    }
  };

  // Calculate song part start and end times
  useEffect(() => {
    const partTimes = {};

    for (let i = 0; i < lineTypes.length; i++) {
      const type = lineTypes[i];

      if (["Verse", "Chorus", "Bridge", "Outro"].includes(type)) {
        let partStart = null;
        let partEnd = null;

        // Find the first "Lyric" line after the section for start time
        for (let j = i + 1; j < lineTypes.length; j++) {
          if (lineTypes[j] === "Lyric" && capturedTimes[j].start !== null) {
            partStart = capturedTimes[j].start;
            break;
          }
        }

        // Find the last "Lyric" line before the next section for end time
        for (let j = i + 1; j < lineTypes.length; j++) {
          if (["Verse", "Chorus", "Bridge", "Outro"].includes(lineTypes[j])) {
            break;
          }
          if (lineTypes[j] === "Lyric" && capturedTimes[j].end !== null) {
            partEnd = capturedTimes[j].end;
          }
        }

        if (partEnd === null) {
          for (let j = i + 1; j < lineTypes.length; j++) {
            if (lineTypes[j] === "Lyric" && capturedTimes[j].end !== null) {
              partEnd = capturedTimes[j].end;
            }
          }
        }

        partTimes[i] = { start: partStart, end: partEnd };
      }
    }

    setSongPartTimes(partTimes);
  }, [lineTypes, capturedTimes]);

  // Export TTML function
  const exportTTML = () => {
    let ttmlContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <tt xmlns="http://www.w3.org/ns/ttml"
          xmlns:tts="http://www.w3.org/ns/ttml#styling"
          xmlns:itunes="http://itunes.apple.com/lyric-ttml-extensions"
          xmlns:ttm="http://www.w3.org/ns/ttml#metadata"
          xml:lang="en">
        <head>
          <metadata>
            <ttm:title>${songTitle || 'Generated Song Title'}</ttm:title>
            <ttm:agent type="person" xml:id="${agentName || 'Unknown'}"/>
            <ttm:name type="full">${agentName || 'Unknown Agent'}</ttm:name>
          </metadata>
        </head>
        <body>
    `;

    lyrics.forEach((line, index) => {
      const type = lineTypes[index];
      const { start, end } = capturedTimes[index];

      if (type === "Lyric" && start !== null && end !== null) {
        ttmlContent += `
          <p begin="${start.toFixed(2)}s" end="${end.toFixed(2)}s" ttm:agent="${agentName || 'Unknown'}">${line}</p>
        `;
      } else if (["Verse", "Chorus", "Bridge", "Outro"].includes(type)) {
        const partTime = songPartTimes[index];
        if (partTime && partTime.start !== null && partTime.end !== null) {
          ttmlContent += `
            <div begin="${partTime.start.toFixed(2)}s" end="${partTime.end.toFixed(2)}s" itunes:song-part="${type}">
              <p begin="${partTime.start.toFixed(2)}s" end="${partTime.end.toFixed(2)}s" ttm:agent="${agentName || 'Unknown'}">${line}</p>
            </div>
          `;
        }
      }
    });

    ttmlContent += `
        </body>
      </tt>
    `;

    onExport(ttmlContent);
  };

  return (
    <div>
      <SongMetadata
        songTitle={songTitle}
        manualTitle={manualTitle}
        onTitleChange={handleManualTitleChange} // Pass the manual title handler
        agentName={agentName}
        setAgentName={setAgentName}
        titleLineIndex={titleLineIndex} // Pass title line index to control conditional rendering
      />

      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Action</th>
            <th>Start Time (s)</th>
            <th>End Time (s)</th>
            <th>Type</th>
            <th>Song Part Time</th>
          </tr>
        </thead>
        <tbody>
          {lyrics.map((line, index) => (
            <LineRow
              key={index}
              line={line}
              lineIndex={index}
              capturedTimes={capturedTimes}
              lineTypes={lineTypes}
              handleCaptureRegion={handleCaptureRegion}
              handleLineTypeChange={handleLineTypeChange}
              songPartTimes={songPartTimes}
              titleLineIndex={titleLineIndex}
            />
          ))}
        </tbody>
      </table>

      <ExportButton onExport={exportTTML} />
    </div>
  );
};

export default LyricsEditor;
