import React from 'react';

const LineRow = ({
  line,
  lineIndex,
  capturedTimes,
  lineTypes,
  handleCaptureRegion,
  handleLineTypeChange,
  songPartTimes,
  titleLineIndex
}) => {
  return (
    <tr>
      <td>{line}</td>
      <td>
        {lineTypes[lineIndex] === "Lyric" && (
          <button onClick={() => handleCaptureRegion(lineIndex)}>Capture Start and End</button>
        )}
      </td>
      <td>{capturedTimes[lineIndex].start !== null ? capturedTimes[lineIndex].start.toFixed(2) : '-'}</td>
      <td>{capturedTimes[lineIndex].end !== null ? capturedTimes[lineIndex].end.toFixed(2) : '-'}</td>
      <td>
        <select
          value={lineTypes[lineIndex]}
          onChange={(event) => handleLineTypeChange(lineIndex, event.target.value)} // Corrected: passing event properly
          disabled={titleLineIndex !== null && titleLineIndex !== lineIndex && lineTypes[lineIndex] === "Title"} // Disable title selection if a title exists
        >
          <option value="Lyric">Lyric</option>
          <option value="Title">Title</option>
          <option value="Comment">Comment</option>
          <option value="Verse">Verse</option>
          <option value="Chorus">Chorus</option>
          <option value="Bridge">Bridge</option>
          <option value="Outro">Outro</option>
        </select>
      </td>
      <td>
        {["Verse", "Chorus", "Bridge", "Outro"].includes(lineTypes[lineIndex]) &&
          songPartTimes[lineIndex] && songPartTimes[lineIndex].start !== null && songPartTimes[lineIndex].end !== null ? (
            `${songPartTimes[lineIndex].start.toFixed(2)}s - ${songPartTimes[lineIndex].end.toFixed(2)}s`
          ) : '-'}
      </td>
    </tr>
  );
};

export default LineRow;
