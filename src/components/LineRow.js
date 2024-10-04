import React from 'react';

const LineRow = ({
  line,
  lineIndex,
  capturedTimes = [], 
  handleCaptureRegion,
  handleLineTypeChange,
  lineTypes = [],      
  titleLineIndex
}) => {
  const capturedTime = capturedTimes[lineIndex] || { start: null, end: null };

  return (
    <tr>
      <td>
        {lineTypes[lineIndex] === "Title" && titleLineIndex === lineIndex ? (
          <strong>{line}</strong> 
        ) : (
          line
        )}
      </td>
      <td>
        {lineTypes[lineIndex] === "Lyric" && (
          <button onClick={() => handleCaptureRegion(lineIndex)}>Capture Start and End</button>
        )}
      </td>
      <td>{capturedTime.start !== null ? capturedTime.start.toFixed(2) : '-'}</td>
      <td>{capturedTime.end !== null ? capturedTime.end.toFixed(2) : '-'}</td>
      <td>
        <select
          value={lineTypes[lineIndex] || "Lyric"}
          onChange={(event) => handleLineTypeChange(lineIndex, event.target.value)}
          disabled={titleLineIndex !== null && titleLineIndex !== lineIndex && lineTypes[lineIndex] === "Title"}
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
    </tr>
  );
};

export default LineRow;
