import { useState } from 'react';
import { Box, IconButton, Container, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Update worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const pdfs = [
  new URL('page1.pdf', window.location.origin).href,
  new URL('/pdfs/page2.pdf', window.location.origin).href,
  new URL('/pdfs/page3.pdf', window.location.origin).href,
  new URL('/pdfs/page4.pdf', window.location.origin).href,
  new URL('/pdfs/page5.pdf', window.location.origin).href,
  new URL('/pdfs/page6.pdf', window.location.origin).href,
  new URL('/pdfs/page7.pdf', window.location.origin).href,
  new URL('/pdfs/page8.pdf', window.location.origin).href,
  new URL('/pdfs/page9.pdf', window.location.origin).href,
];
const Cuadernillo = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = () => {
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Error al cargar el PDF. Verifique que los archivos existan.');
    setLoading(false);
  };

  const paginate = (newDirection) => {
    if (newDirection === 1 && currentPage < pdfs.length - 1) {
      setCurrentPage(currentPage + 1);
      setDirection(1);
    } else if (newDirection === -1 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setDirection(-1);
    }
  };

  return (
    <Container maxWidth="lg" className="my-8">
      <Box className="relative flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-2xl">
        <IconButton
          onClick={() => paginate(-1)}
          disabled={currentPage === 0}
          className="absolute left-4 z-10 bg-white/80 hover:bg-white"
          size="large"
        >
          <ChevronLeft />
        </IconButton>

        <Box className="relative w-full max-w-3xl overflow-hidden flex justify-center items-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 1000 : -1000, opacity: 0 }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex justify-center items-center h-full"
            >
              {loading && <CircularProgress />}
              {error && (
                <div>
                  Error al cargar el PDF. Por favor, intente nuevamente.
                </div>
              )}
              <Document
                file={pdfs[currentPage]}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<CircularProgress />}
                className="max-w-full"
              >
                <Page
                  pageNumber={1}
                  className="shadow-lg"
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </motion.div>
          </AnimatePresence>
        </Box>

        <IconButton
          onClick={() => paginate(1)}
          disabled={currentPage === pdfs.length - 1}
          className="absolute right-4 z-10 bg-white/80 hover:bg-white"
          size="large"
        >
          <ChevronRight />
        </IconButton>

        <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Box className="px-4 py-2 bg-white/90 rounded-full">
            Página {currentPage + 1} de {pdfs.length}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Cuadernillo;
