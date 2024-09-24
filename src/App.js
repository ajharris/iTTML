import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import AudioPlayer from './components/AudioPlayer';
import LyricsEditor from './components/LyricsEditor';
import TTMLGenerator from './components/TTMLGenerator';

function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [lyricsLinks, setLyricsLinks] = useState([]);
  const [currentRegion, setCurrentRegion] = useState({ start: null, end: null });

  const handleUpload = (data) => {
    if (data.type === 'mp3') {
      const url = URL.createObjectURL(data.file);
      setAudioUrl(url);
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
        <AudioPlayer audioUrl={audioUrl} setCurrentRegion={setCurrentRegion} currentRegion={currentRegion} />
      )}
      {lyrics.length > 0 && (
        <LyricsEditor 
          lyrics={lyrics} 
          markers={markers} 
          currentRegion={currentRegion}
          onLink={handleLink} 
          onMarkerAdd={handleMarkerAdd}
        />
      )}
      <TTMLGenerator markers={markers} lyricsLinks={lyricsLinks} />
    </div>
  );
}

export default App;
