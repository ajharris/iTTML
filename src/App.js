import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import AudioPlayer from './components/AudioPlayer';
import LyricsEditor from './components/LyricsEditor';
import TTMLGenerator from './components/TTMLGenerator';

function App() {
  const [audioUrl, setAudioUrl] = useState(null); // Change mp3File to audioUrl
  const [lyrics, setLyrics] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [lyricsLinks, setLyricsLinks] = useState([]);

  const handleUpload = (data) => {
    if (data.type === 'mp3') {
      const url = URL.createObjectURL(data.file); // Create a URL for the audio file
      setAudioUrl(url); // Set the audio URL
    } else if (data.type === 'lyrics') {
      setLyrics(data.text.split('\n'));
    }
  };

  const handleMarkerAdd = (marker) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const handleLink = (marker, lyric) => {
    setLyricsLinks((prevLinks) => [...prevLinks, { marker, lyric }]);
  };

  return (
    <div>
      <FileUploader onUpload={handleUpload} />
      {audioUrl && (
        <AudioPlayer audioUrl={audioUrl} /> // Pass the audioUrl to AudioPlayer
      )}
      {lyrics.length > 0 && (
        <LyricsEditor 
          lyrics={lyrics} 
          markers={markers} 
          onLink={handleLink} 
          onMarkerAdd={handleMarkerAdd} // Pass down the marker add function
        />
      )}
      <TTMLGenerator markers={markers} lyricsLinks={lyricsLinks} />
    </div>
  );
}

export default App;
