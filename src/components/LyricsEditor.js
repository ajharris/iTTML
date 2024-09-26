import React, { useEffect, useState } from 'react';

const LyricsEditor = ({ lyrics, markers, currentRegion, onMarkerAdd }) => {
  const [capturedTimes, setCapturedTimes] = useState(
    lyrics.map(() => ({ start: null, end: null }))
  );
  const [isTitleComment, setIsTitleComment] = useState(
    new Array(lyrics.length).fill(false) // Initialize with false for each line
  );

  const handleCaptureRegion = (lineIndex) => {
    if (currentRegion.start !== null && currentRegion.end !== null) {
      const newCapturedTimes = [...capturedTimes];
      newCapturedTimes[lineIndex] = {
        start: currentRegion.start,
        end: currentRegion.end,
      };
      setCapturedTimes(newCapturedTimes);
      // Update markers for start and end
      onMarkerAdd({ type: 'start', time: currentRegion.start, lineIndex });
      onMarkerAdd({ type: 'end', time: currentRegion.end, lineIndex });
    }
  };

  const toggleTitleComment = (lineIndex) => {
    const newTitleCommentStatus = [...isTitleComment];
    newTitleCommentStatus[lineIndex] = !newTitleCommentStatus[lineIndex];
    setIsTitleComment(newTitleCommentStatus);
    // Clear captured times if marked as title/comment
    if (newTitleCommentStatus[lineIndex]) {
      const newCapturedTimes = [...capturedTimes];
      newCapturedTimes[lineIndex] = { start: null, end: null };
      setCapturedTimes(newCapturedTimes);
    }
  };

  return (
    <div>
      <h2>Lyrics Editor</h2>
      {currentRegion.start !== null && currentRegion.end !== null && (
        <div>
          <p>Current Region: {currentRegion.start.toFixed(2)}s - {currentRegion.end.toFixed(2)}s</p>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Action</th>
            <th>Start Time (s)</th>
            <th>End Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {lyrics.map((line, index) => (
            <tr key={index}>
              <td>
                <button onClick={() => toggleTitleComment(index)}>
                  {isTitleComment[index] ? 'Remove Title/Comment' : 'Mark as Title/Comment'}
                </button>
                {line}
              </td>
              {!isTitleComment[index] && (
                <>
                  <td>
                    <button onClick={() => handleCaptureRegion(index)}>Capture Start and End</button>
                  </td>
                  <td>{capturedTimes[index].start !== null ? capturedTimes[index].start.toFixed(2) : '-'}</td>
                  <td>{capturedTimes[index].end !== null ? capturedTimes[index].end.toFixed(2) : '-'}</td>
                </>
              )}
              {isTitleComment[index] && (
                <td colSpan={3} style={{ textAlign: 'center' }}>This line is a title or comment</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LyricsEditor;
