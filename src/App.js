import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import AudioPlayer from './components/AudioPlayer';
import LyricsEditor from './components/LyricsEditor';
import TTMLGenerator from './components/TTMLGenerator';

function App() {
  const [mp3File, setMp3File] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [lyricsLinks, setLyricsLinks] = useState([]);

  const handleUpload = (data) => {
    if (data.type === 'mp3') {
      setMp3File(data.file);
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
      {mp3File && <AudioPlayer mp3File={mp3File} onMarkerAdd={handleMarkerAdd} />}
      {lyrics.length > 0 && (
        <LyricsEditor lyrics={lyrics} markers={markers} onLink={handleLink} />
      )}
      <TTMLGenerator markers={markers} lyricsLinks={lyricsLinks} />
      {/* <SimpleWaveform /> */}
    </div>
  );
}

export default App;
