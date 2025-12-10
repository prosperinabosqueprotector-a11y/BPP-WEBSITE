import React from 'react';

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <iframe
        src={pdfUrl}
        title="PDF Viewer"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none', 
          display: 'block'
        }}
      ></iframe>
    </div>
  );
};

export default PDFViewer;