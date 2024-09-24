import React from 'react';

function TTMLGenerator({ markers, lyricsLinks }) {
  const generateTTML = () => {
    let ttml = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml">
  <body>
    <div>`;
    lyricsLinks.forEach((link) => {
      ttml += `
      <p begin="${link.marker}s" end="${link.marker + 5}s">
        ${link.lyric}
      </p>`;
    });
    ttml += `
    </div>
  </body>
</tt>`;
    const blob = new Blob([ttml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lyrics.ttml';
    link.click();
  };

  return <button onClick={generateTTML}>Download TTML</button>;
}

export default TTMLGenerator;
