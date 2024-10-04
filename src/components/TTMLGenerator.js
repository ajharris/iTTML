import React from 'react';

function TTMLGenerator({ lyrics, capturedTimes, songPartTimes, songTitle, agentName, lineTypes }) {
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    const milliseconds = (timeInSeconds % 1).toFixed(3).split('.')[1];
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  // Extract first name if agentName has both first and last name
  const getFirstName = (name) => {
    const names = name.split(' ');
    return names.length > 1 ? names[0] : name;
  };

  const generateTTML = () => {
    let ttmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml"
    xmlns:tts="http://www.w3.org/ns/ttml#styling"
    xmlns:itunes="http://itunes.apple.com/lyric-ttml-extensions"
    xmlns:ttm="http://www.w3.org/ns/ttml#metadata"
    xml:lang="en"><head><metadata><ttm:title>${songTitle || 'Generated Song Title'}</ttm:title>
<ttm:agent type="person" xml:id="${agentName || 'Unknown'}"/>
<ttm:name type="full">${agentName || 'Unknown Agent'}</ttm:name>
</metadata></head><body>`;

    let currentSection = null;

    lyrics.forEach((line, index) => {
      const type = lineTypes[index];
      const { start, end } = capturedTimes[index];

      if (["Verse", "Chorus", "Bridge", "Outro"].includes(type)) {
        if (currentSection) {
          ttmlContent += `</div>\n`;
        }
        const partTime = songPartTimes[index];
        if (partTime && partTime.start !== null && partTime.end !== null) {
          currentSection = type;
          ttmlContent += `<div begin="${formatTime(partTime.start)}" end="${formatTime(partTime.end)}" itunes:song-part="${type}">\n`;
        }
      }

      if (type === "Lyric" && start !== null && end !== null) {
        const displayAgentName = agentName && agentName.split(' ').length > 1 ? getFirstName(agentName) : agentName;
        ttmlContent += `\t<p begin="${formatTime(start)}" end="${formatTime(end)}" ttm:agent="${displayAgentName || 'Unknown'}">${line}</p>\n`;
      }
    });

    if (currentSection) {
      ttmlContent += `</div>\n`;
    }

    ttmlContent += `</body></tt>`;

    const fileName = songTitle ? `${songTitle.replace(/ /g, '_')}.ttml` : 'generated_song.ttml';

    const blob = new Blob([ttmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={generateTTML}>Download TTML</button>;
}

export default TTMLGenerator;
