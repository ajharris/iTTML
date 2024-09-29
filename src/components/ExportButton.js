import React from 'react';

const ExportButton = ({ onExport }) => {
  return (
    <div>
      <button onClick={onExport}>Export TTML</button>
    </div>
  );
};

export default ExportButton;
