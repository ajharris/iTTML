import React from 'react';

const SongMetadata = ({ songTitle, manualTitle, onTitleChange, agentName, setAgentName, titleLineIndex }) => {
  return (
    <div>
      <h3>Song Metadata</h3>
      
      {/* Conditionally render the title field based on whether a title line is selected */}
      {titleLineIndex === null ? (
        <div>
          <label>Song Title: </label>
          <input
            type="text"
            value={manualTitle} // Bind the manual title value
            onChange={onTitleChange} // Trigger manual title change
            placeholder="Enter song title or select one from lyrics"
          />
        </div>
      ) : (
        <div>
          <label>Song Title: {songTitle}</label> {/* Display the selected title */}
        </div>
      )}
      
      {/* Input for agent/lyricist name */}
      <div>
        <label>Agent (Lyricist): </label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="Enter lyricist's name"
        />
      </div>
    </div>
  );
};

export default SongMetadata;
