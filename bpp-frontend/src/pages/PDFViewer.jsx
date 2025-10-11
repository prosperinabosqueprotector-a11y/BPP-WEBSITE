// src/components/PDFViewer.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar worker de pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Responsividad
  const pageWidth = windowWidth < 768 ? windowWidth - 20 : 800;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh', // asegura que el área se expanda
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column', // una hoja debajo de otra
        alignItems: 'center', // centra horizontalmente
        justifyContent: 'flex-start',
        padding: '20px 0',
        boxSizing: 'border-box',
        overflow: 'visible', // evita scroll propio
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading=""
        options={{ cMapUrl: 'cmaps/', cMapPacked: true }}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            style={{
              marginBottom: 10,
              backgroundColor: '#000',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
