import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import AudioPlayer from './components/AudioPlayer';
import LyricsEditor from './components/LyricsEditor';
import TTMLGenerator from './components/TTMLGenerator';

function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [agentName, setAgentName] = useState('');
  const [lineTypes, setLineTypes] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [capturedTimes, setCapturedTimes] = useState([]); // Reintroduce capturedTimes

  const handleUpload = (data) => {
    if (data.type === 'mp3') {
      const url = URL.createObjectURL(data.file);
      setAudioUrl(url);
    } else if (data.type === 'lyrics') {
      setLyrics(data.text.split('\n'));
      setCapturedTimes(data.text.split('\n').map(() => ({ start: null, end: null }))); // Initialize times
    }
  };

  const handleMarkerAdd = (marker) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  return (
    <div>
      <FileUploader onUpload={handleUpload} />
      {audioUrl && (
        <AudioPlayer 
          audioUrl={audioUrl} 
          setCurrentRegion={setCurrentRegion} 
          currentRegion={currentRegion} 
        />
      )}
      {lyrics.length > 0 && (
        <LyricsEditor 
        lyrics={lyrics} 
        markers={markers} 
        capturedTimes={capturedTimes} 
        setCapturedTimes={setCapturedTimes} 
        setSongTitle={setSongTitle} 
        setAgentName={setAgentName} 
        setLineTypes={setLineTypes}
        onMarkerAdd={handleMarkerAdd} 
        agentName={agentName} 
        currentRegion={currentRegion}  // Pass currentRegion here
      />
      
      )}

      {lyrics.length > 0 && (
        <TTMLGenerator 
          lyrics={lyrics}
          capturedTimes={capturedTimes} // Pass captured times to TTML generator
          songTitle={songTitle}
          agentName={agentName}
          lineTypes={lineTypes}
        />
      )}
    </div>
  );
}

export default App;
