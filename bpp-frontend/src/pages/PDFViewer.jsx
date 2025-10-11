// src/components/PDFViewer.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar worker de pdfjs para Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // Detectar ancho de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Ancho adaptable: móvil = casi todo, desktop = máximo 800px
  const pageWidth = windowWidth < 768 ? windowWidth - 20 : 800;

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center', // centrar horizontalmente
        padding: 10,
        boxSizing: 'border-box',
        backgroundColor: '#f0f0f0', // opcional, se ve mejor en desktop
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Cargando PDF..."
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            style={{
              marginBottom: 10, // espacio entre páginas
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)', // sombra opcional
            }}
          >
            <Page pageNumber={index + 1} width={pageWidth} />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
