import React from 'react';

function LyricsEditor({ lyrics, markers, onLink }) {
  const handleCaptureMarker = (marker, lyric) => {
    onLink(marker, lyric);
  };

  return (
    <div>
      {lyrics.map((line, idx) => (
        <div key={idx}>
          <span>{line}</span>
          {markers.length > 0 && (
            <button onClick={() => handleCaptureMarker(markers[idx], line)}>
              Capture Marker
            </button>
          )}
          {markers[idx] && (
            <span>
              Start: {markers[idx].start.toFixed(2)}s, End: {markers[idx].end.toFixed(2)}s
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default LyricsEditor;
