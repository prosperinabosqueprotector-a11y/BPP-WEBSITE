import { useState } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import CoverPage from '../components/cuadernillo/CoverPage';
import IndexPage from '../components/cuadernillo/IndexPage';
import TreesPage from '../components/cuadernillo/TreesPage';
import FaunaPage from '../components/cuadernillo/FaunaPage';
import FlowersPage from '../components/cuadernillo/FlowersPage';
import MazePage from '../components/cuadernillo/MazePage';
import CrucigramaBosque from '../components/cuadernillo/CrucigramaBosque';
import SopaDeLetrasBosque from '../components/cuadernillo/SopaDeLetrasBosque';
import SolutionPage from '../components/cuadernillo/SolutionPage';
import ClosingPage from '../components/cuadernillo/ClosingPage';
import ExperimentPage from '../components/cuadernillo/ExperimentPage';

const PAGES = [
  { id: 0, label: 'Portada', component: CoverPage },
  { id: 1, label: 'Índice', component: IndexPage },
  { id: 2, label: 'Árboles', component: TreesPage },
  { id: 3, label: 'Crucigrama', component: CrucigramaBosque },
  { id: 4, label: 'Sopa de Letras', component: SopaDeLetrasBosque },
  { id: 5, label: 'Fauna', component: FaunaPage },
  { id: 6, label: 'Flores', component: FlowersPage },
  { id: 7, label: 'Laberinto', component: MazePage },
  { id: 8, label: 'Solucionario', component: SolutionPage },
  { id: 9, label: 'Cierre', component: ClosingPage },
  { id: 10, label: 'Experimento', component: ExperimentPage },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function Cuadernillo() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const isMobile = useMediaQuery('(max-width:768px)');

  const goToPage = (pageIndex) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const CurrentComponent = PAGES[currentPage].component;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#2C2C2C',
        minHeight: '80vh',
      }}
    >
      {/* Page content area */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <CurrentComponent />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          py: 1.5,
          px: 2,
          bgcolor: '#1A1A1A',
          borderTop: '1px solid #333',
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={handlePrev}
          disabled={currentPage === 0}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: currentPage === 0 ? '#555' : '#4CAF50',
            '&:hover': { bgcolor: currentPage === 0 ? '#555' : '#388E3C' },
            '&.Mui-disabled': { bgcolor: '#444', color: '#777' },
          }}
        >
          {!isMobile && 'Anterior'}
        </Button>

        {/* Page indicators */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {PAGES.map((page) => (
            <Box
              key={page.id}
              onClick={() => goToPage(page.id)}
              sx={{
                width: currentPage === page.id ? 32 : 10,
                height: 10,
                borderRadius: 5,
                bgcolor: currentPage === page.id ? '#4CAF50' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: currentPage === page.id ? '#66BB6A' : '#888',
                },
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          disabled={currentPage === PAGES.length - 1}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: currentPage === PAGES.length - 1 ? '#555' : '#4CAF50',
            '&:hover': { bgcolor: currentPage === PAGES.length - 1 ? '#555' : '#388E3C' },
            '&.Mui-disabled': { bgcolor: '#444', color: '#777' },
          }}
        >
          {!isMobile && 'Siguiente'}
        </Button>

        {/* Page label */}
        <Typography
          sx={{
            color: '#AAA',
            fontSize: '0.75rem',
            ml: 2,
            minWidth: 80,
          }}
        >
          {currentPage + 1} / {PAGES.length}
        </Typography>
      </Box>
    </Box>
  );
}
