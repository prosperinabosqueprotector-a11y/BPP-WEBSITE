// src/components/PDFViewer.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Ancho máximo para desktop, casi completo en móvil
  const pageWidth = windowWidth < 768 ? windowWidth - 20 : 800;

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        overflowY: 'auto',
        //overflowX: 'hidden',
        backgroundColor: '#000000', // fondo negro
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        boxSizing: 'border-box',
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading=""
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            style={{
              margin: 0, // eliminar salto entre páginas
              paddingBottom: 5, // pequeño espacio opcional entre páginas
              boxShadow: 'none',
              backgroundColor: '#000000', // mismo fondo negro por página
              display: 'inline-block',
            }}
          >
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={false} // elimina labels de pdfjs como "Seccion Cientifico en Casa"
              renderAnnotationLayer={false} // opcional: elimina anotaciones si hay
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
