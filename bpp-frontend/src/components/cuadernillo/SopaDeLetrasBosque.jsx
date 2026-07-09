import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, IconButton, Chip } from '@mui/material';
import { Timer, Refresh, CheckCircle, EmojiEvents, Star } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SOPA_DATA = {
  grid: [
    ['H', 'B', 'D', 'F', 'G', 'J', 'K', 'L', 'M', 'N', 'Q'],
    ['U', 'W', 'D', 'A', 'C', 'A', 'C', 'I', 'A', 'R', 'T'],
    ['E', 'F', 'G', 'C', 'E', 'I', 'B', 'O', 'S', 'T', 'W'],
    ['V', 'D', 'G', 'U', 'A', 'Y', 'A', 'C', 'A', 'N', 'W'],
    ['O', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'A', 'M', 'A', 'R', 'I', 'L', 'L', 'O', 'J', 'K'],
    ['L', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['P', 'A', 'L', 'O', 'S', 'A', 'N', 'T', 'O', 'Y', 'Z'],
    ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
  ],
  solutions: {
    'HUEVO': ['0-0', '1-0', '2-0', '3-0', '4-0'],
    'ACACIA': ['1-3', '1-4', '1-5', '1-6', '1-7', '1-8'],
    'CEIBO': ['2-3', '2-4', '2-5', '2-6', '2-7'],
    'GUAYACAN': ['3-2', '3-3', '3-4', '3-5', '3-6', '3-7', '3-8', '3-9'],
    'AMARILLO': ['6-1', '6-2', '6-3', '6-4', '6-5', '6-6', '6-7', '6-8'],
    'PALOSANTO': ['9-0', '9-1', '9-2', '9-3', '9-4', '9-5', '9-6', '9-7', '9-8'],
  }
};

const GAME_DURATION = 120;

function getLineCells(r1, c1, r2, c2) {
  const dr = r2 - r1;
  const dc = c2 - c1;

  if (dr === 0 && dc === 0) return [{ r: r1, c: c1 }];

  if (dr === 0) {
    const step = dc > 0 ? 1 : -1;
    const cells = [];
    for (let c = c1; c !== c2 + step; c += step) cells.push({ r: r1, c });
    return cells;
  }

  if (dc === 0) {
    const step = dr > 0 ? 1 : -1;
    const cells = [];
    for (let r = r1; r !== r2 + step; r += step) cells.push({ r, c: c1 });
    return cells;
  }

  if (Math.abs(dr) === Math.abs(dc)) {
    const stepR = dr > 0 ? 1 : -1;
    const stepC = dc > 0 ? 1 : -1;
    const cells = [];
    let r = r1, c = c1;
    while (r !== r2 + stepR || c !== c2 + stepC) {
      cells.push({ r, c });
      r += stepR;
      c += stepC;
    }
    return cells;
  }

  return [{ r: r1, c: c1 }];
}

export default function SopaDeLetrasBosque() {
  const [foundWords, setFoundWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);

  const [startCell, setStartCell] = useState(null);
  const [previewCells, setPreviewCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const GRID = SOPA_DATA.grid;
  const SOLUTIONS = SOPA_DATA.solutions;
  const WORDS = Object.keys(SOLUTIONS);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('lost');
          setScore(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus]);

  const getCellId = (r, c) => `${r}-${c}`;

  const isCellFound = (r, c) => {
    const id = getCellId(r, c);
    return foundWords.some(word => SOLUTIONS[word].includes(id));
  };

  const isCellPreview = (r, c) => {
    return previewCells.some(cell => cell.r === r && cell.c === c);
  };

  const isCellSelected = (r, c) => {
    const id = getCellId(r, c);
    return selectedCells.includes(id);
  };

  const handleCellClick = useCallback((r, c) => {
    if (gameStatus !== 'playing') return;

    if (!startCell) {
      setStartCell({ r, c });
      setPreviewCells([{ r, c }]);
      return;
    }

    if (startCell.r === r && startCell.c === c) {
      setStartCell(null);
      setPreviewCells([]);
      return;
    }

    const cells = getLineCells(startCell.r, startCell.c, r, c);
    const cellIds = cells.map(cell => getCellId(cell.r, cell.c));

    const newSelected = [...new Set([...selectedCells, ...cellIds])];
    setSelectedCells(newSelected);
    setStartCell(null);
    setPreviewCells([]);

    WORDS.forEach(word => {
      if (foundWords.includes(word)) return;
      const coordinates = SOLUTIONS[word];
      const isMatch = coordinates.every(coord => newSelected.includes(coord));
      if (isMatch) {
        const newFound = [...foundWords, word];
        setFoundWords(newFound);

        if (newFound.length === WORDS.length) {
          setScore(100 + (timeLeft * 10));
          setGameStatus('won');
        }
      }
    });
  }, [startCell, selectedCells, foundWords, gameStatus, timeLeft]);

  const handleCellHover = useCallback((r, c) => {
    if (!startCell || gameStatus !== 'playing') return;
    const cells = getLineCells(startCell.r, startCell.c, r, c);
    setPreviewCells(cells);
  }, [startCell, gameStatus]);

  const handleMouseLeave = useCallback(() => {
    if (startCell) {
      setPreviewCells([startCell]);
    }
  }, [startCell]);

  const resetGame = () => {
    setSelectedCells([]);
    setFoundWords([]);
    setTimeLeft(GAME_DURATION);
    setGameStatus('playing');
    setScore(0);
    setStartCell(null);
    setPreviewCells([]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #F5E0B0 0%, #E8C88E 100%)',
          border: '3px solid #6B7B3A',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#5D4037', fontWeight: 800 }}>
            Sopa de Letras
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#C5E1A5', p: 0.5, px: 1.5, borderRadius: 3 }}>
              <Timer fontSize="small" sx={{ color: '#33691E' }} />
              <Typography sx={{ fontWeight: 700, color: '#33691E', fontSize: '0.85rem' }}>{timeLeft}s</Typography>
            </Box>
            <IconButton onClick={resetGame} size="small" sx={{ color: '#6B7B3A' }}>
              <Refresh fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(foundWords.length / WORDS.length) * 100}
          sx={{
            mb: 2, height: 6, borderRadius: 3,
            bgcolor: '#C5E1A5',
            '& .MuiLinearProgress-bar': { bgcolor: '#6B7B3A' }
          }}
        />

        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 2, border: '1px solid #A5D6A7' }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#5D4037', fontWeight: 600, mb: 0.5 }}>
            PALABRAS ({foundWords.length}/{WORDS.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {WORDS.map(w => (
              <Chip
                key={w}
                label={w}
                size="small"
                color={foundWords.includes(w) ? 'success' : 'default'}
                icon={foundWords.includes(w) ? <CheckCircle /> : undefined}
                variant={foundWords.includes(w) ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700, fontSize: '0.7rem',
                  bgcolor: foundWords.includes(w) ? '#66BB6A' : 'transparent',
                  color: foundWords.includes(w) ? '#FFF' : '#5D4037',
                  borderColor: '#A5D6A7',
                }}
              />
            ))}
          </Box>
        </Box>

        {startCell && (
          <Typography sx={{ fontSize: '0.75rem', color: '#6B7B3A', fontWeight: 600, mb: 1.5 }}>
            Selecciona la letra final de la palabra
          </Typography>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID[0].length}, 1fr)`,
            gap: '3px',
            maxWidth: 440,
            margin: '0 auto',
            p: 1.5,
            bgcolor: '#FFFDE7',
            borderRadius: 2,
            border: '2px solid #C45B28',
          }}
          onMouseLeave={handleMouseLeave}
        >
          {GRID.map((row, rIndex) =>
            row.map((letter, cIndex) => {
              const isFound = isCellFound(rIndex, cIndex);
              const isSelected = isCellSelected(rIndex, cIndex);
              const isPreview = isCellPreview(rIndex, cIndex);
              const isStart = startCell && startCell.r === rIndex && startCell.c === cIndex;

              let bgColor = '#FFF';
              if (isFound) bgColor = '#6B7B3A';
              else if (isStart) bgColor = '#FF8F00';
              else if (isPreview && startCell) bgColor = '#FFE082';
              else if (isSelected) bgColor = '#A5D6A7';

              return (
                <Box
                  key={`${rIndex}-${cIndex}`}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                  onMouseEnter={() => handleCellHover(rIndex, cIndex)}
                  sx={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bgColor,
                    color: isFound ? '#FFF' : '#5D4037',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: { xs: '0.65rem', md: '0.8rem' },
                    borderRadius: 0.5,
                    transition: 'background-color 0.1s',
                    border: isStart ? '2px solid #E65100' : '1px solid #E0E0E0',
                    userSelect: 'none',
                  }}
                >
                  {letter}
                </Box>
              );
            })
          )}
        </Box>

        <AnimatePresence>
          {gameStatus === 'won' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 1300,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Paper sx={{
                  p: 4, textAlign: 'center', borderRadius: 4,
                  background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 50%, #81C784 100%)',
                  border: '4px solid #4CAF50',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  maxWidth: 380, mx: 2,
                }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <EmojiEvents sx={{ fontSize: 70, color: '#F9A825' }} />
                  </motion.div>

                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#1B5E20', mt: 1 }}>
                    Excelente!
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, my: 1 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
                      >
                        <Star sx={{ color: '#F9A825', fontSize: 28 }} />
                      </motion.div>
                    ))}
                  </Box>

                  <Typography sx={{ fontSize: '1rem', color: '#2E7D32', fontWeight: 600, mb: 0.5 }}>
                    Encontraste todas las palabras!
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#558B2F', mb: 2.5, lineHeight: 1.5 }}>
                    Tienes una vista increible para encontrar las palabras. Sigue asi, pequeño explorador del bosque!
                  </Typography>

                  <Button
                    onClick={resetGame}
                    variant="contained"
                    startIcon={<Refresh />}
                    sx={{
                      bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' },
                      borderRadius: 3, px: 4, fontWeight: 700,
                    }}
                  >
                    Jugar de nuevo
                  </Button>
                </Paper>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameStatus === 'lost' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', borderRadius: 2, textAlign: 'center', border: '2px solid #EF5350' }}>
            <Typography sx={{ color: '#C62828', fontWeight: 700, fontSize: '1.1rem' }}>
              Tiempo agotado!
            </Typography>
            <Button onClick={resetGame} variant="contained" sx={{ mt: 1, bgcolor: '#EF5350', '&:hover': { bgcolor: '#D32F2F' } }}>
              Intentar de nuevo
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
