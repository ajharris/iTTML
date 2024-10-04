import React from 'react';

function FileUploader({ onUpload }) {
  const handleMp3Change = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/mp3')) {
      onUpload({ type: 'mp3', file });
      e.target.value = ''; // Clear the input
    } else {
      console.error('Please upload a valid MP3 file.');
    }
  };

  const handleLyricsChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload({ type: 'lyrics', text: reader.result });
      };
      reader.readAsText(file);
      e.target.value = ''; // Clear the input
    } else {
      console.error('Please upload a valid text file for lyrics.');
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="mp3-upload">Upload MP3 File:</label>
        <input 
          id="mp3-upload" 
          type="file" 
          accept="audio/*" 
          onChange={handleMp3Change} 
        />
      </div>
      <div>
        <label htmlFor="lyrics-upload">Upload Lyrics File (Text):</label>
        <input 
          id="lyrics-upload" 
          type="file" 
          accept=".txt" 
          onChange={handleLyricsChange} 
        />
      </div>
    </div>
  );
}

export default FileUploader;
