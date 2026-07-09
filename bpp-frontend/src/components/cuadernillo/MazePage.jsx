import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, useMediaQuery, Button, TextField, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Send, CheckCircle, ArrowUpward, ArrowDownward, ArrowBack, ArrowForward } from '@mui/icons-material';

const MAZE_COLS = 15;
const MAZE_ROWS = 15;

// Laberinto verificado con camino solucion
const MAZE_GRID = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,1,0,1,0,0,1,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,1,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,1,1,0,1,0,0,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1,0,1,0,1],
  [1,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,1,0,1],
  [1,1,1,1,0,0,1,0,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const START = { row: 1, col: 1 };
const END = { row: 13, col: 7 };

export default function MazePage() {
  const [name, setName] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [playerPos, setPlayerPos] = useState(START);
  const [visited, setVisited] = useState(new Set([`${START.row}-${START.col}`]));
  const [solved, setSolved] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const cellSize = isMobile ? 22 : 28;
  const mazeWidth = MAZE_COLS * cellSize;
  const mazeHeight = MAZE_ROWS * cellSize;

  const movePlayer = useCallback((direction) => {
    if (solved) return;
    setPlayerPos((prev) => {
      let newRow = prev.row;
      let newCol = prev.col;
      if (direction === 'up') newRow -= 1;
      if (direction === 'down') newRow += 1;
      if (direction === 'left') newCol -= 1;
      if (direction === 'right') newCol += 1;

      if (newRow < 0 || newRow >= MAZE_ROWS || newCol < 0 || newCol >= MAZE_COLS) return prev;
      if (MAZE_GRID[newRow][newCol] === 1) return prev;

      const key = `${newRow}-${newCol}`;
      setVisited((prevVisited) => new Set([...prevVisited, key]));

      if (newRow === END.row && newCol === END.col) {
        setSolved(true);
      }
      return { row: newRow, col: newCol };
    });
  }, [solved]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const resetMaze = () => {
    setPlayerPos(START);
    setVisited(new Set([`${START.row}-${START.col}`]));
    setSolved(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !answer1.trim() || !answer2.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reflexion'), {
        name: name.trim(),
        question: 1,
        text: answer1.trim(),
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'reflexion'), {
        name: name.trim(),
        question: 2,
        text: answer2.trim(),
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving reflection:', err);
    }
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'auto',
      }}
    >
      {/* Left: Maze */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#C45B28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>9</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              color: '#C45B28',
              fontWeight: 800,
              mb: 0.5,
              mt: 1,
            }}
          >
            Ayudalo!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              color: '#5D4037',
              mb: 2,
              lineHeight: 1.4,
            }}
          >
            Usa las flechas del teclado o los botones para mover al primate hasta su arbol.
          </Typography>
        </motion.div>

        {/* Maze SVG */}
        <Box
          sx={{
            position: 'relative',
            width: mazeWidth,
            height: mazeHeight,
            borderRadius: 2,
            overflow: 'hidden',
            border: '3px solid #C45B28',
            boxShadow: 3,
          }}
        >
          <svg
            viewBox={`0 0 ${MAZE_COLS * cellSize} ${MAZE_ROWS * cellSize}`}
            width={mazeWidth}
            height={mazeHeight}
          >
            {/* Background */}
            <rect width={mazeWidth} height={mazeHeight} fill="#FFFDE7" />

            {/* Maze walls */}
            {MAZE_GRID.map((row, r) =>
              row.map((cell, c) => {
                if (cell === 1) {
                  return (
                    <rect
                      key={`wall-${r}-${c}`}
                      x={c * cellSize}
                      y={r * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="#6B7B3A"
                      rx={2}
                    />
                  );
                }
                return null;
              })
            )}

            {/* Visited path */}
            {Array.from(visited).map((key) => {
              const [r, c] = key.split('-').map(Number);
              return (
                <rect
                  key={`visited-${key}`}
                  x={c * cellSize + 2}
                  y={r * cellSize + 2}
                  width={cellSize - 4}
                  height={cellSize - 4}
                  fill="#C5E1A5"
                  rx={3}
                  opacity={0.6}
                />
              );
            })}

            {/* End - Tree */}
            <g transform={`translate(${END.col * cellSize + cellSize / 2}, ${END.row * cellSize + cellSize / 2})`}>
              <rect x={-2} y={-2} width={4} height={14} fill="#5D4037" rx={1} />
              <circle cx={0} cy={-8} r={10} fill="#2E7D32" opacity="0.85" />
              <circle cx={-6} cy={-4} r={7} fill="#388E3C" opacity="0.75" />
              <circle cx={6} cy={-4} r={7} fill="#388E3C" opacity="0.75" />
            </g>

            {/* Player - Monkey */}
            <g transform={`translate(${playerPos.col * cellSize + cellSize / 2}, ${playerPos.row * cellSize + cellSize / 2})`}>
              <circle cx={0} cy={0} r={cellSize * 0.35} fill="#8D6E63" />
              <circle cx={0} cy={2} r={cellSize * 0.22} fill="#BCAAA4" />
              <circle cx={-4} cy={-4} r={2.5} fill="#3E2723" />
              <circle cx={4} cy={-4} r={2.5} fill="#3E2723" />
              <ellipse cx={-8} cy={-10} rx={4} ry={5} fill="#8D6E63" />
              <ellipse cx={8} cy={-10} rx={4} ry={5} fill="#8D6E63" />
              <path d={`M${cellSize * 0.3} 0 Q${cellSize * 0.6} -${cellSize * 0.3} ${cellSize * 0.5} -${cellSize * 0.5}`}
                stroke="#8D6E63" strokeWidth={3} fill="none" />
            </g>
          </svg>
        </Box>

        {/* Direction buttons */}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            onClick={() => movePlayer('up')}
            disabled={solved}
            sx={{
              bgcolor: '#C45B28',
              color: '#FFF',
              '&:hover': { bgcolor: '#A63A1E' },
              '&.Mui-disabled': { bgcolor: '#D7CCC8' },
              width: 44,
              height: 44,
            }}
          >
            <ArrowUpward />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => movePlayer('left')}
              disabled={solved}
              sx={{
                bgcolor: '#C45B28',
                color: '#FFF',
                '&:hover': { bgcolor: '#A63A1E' },
                '&.Mui-disabled': { bgcolor: '#D7CCC8' },
                width: 44,
                height: 44,
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ width: 44, height: 44 }} />
            <IconButton
              onClick={() => movePlayer('right')}
              disabled={solved}
              sx={{
                bgcolor: '#C45B28',
                color: '#FFF',
                '&:hover': { bgcolor: '#A63A1E' },
                '&.Mui-disabled': { bgcolor: '#D7CCC8' },
                width: 44,
                height: 44,
              }}
            >
              <ArrowForward />
            </IconButton>
          </Box>
          <IconButton
            onClick={() => movePlayer('down')}
            disabled={solved}
            sx={{
              bgcolor: '#C45B28',
              color: '#FFF',
              '&:hover': { bgcolor: '#A63A1E' },
              '&.Mui-disabled': { bgcolor: '#D7CCC8' },
              width: 44,
              height: 44,
            }}
          >
            <ArrowDownward />
          </IconButton>
        </Box>

        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#2E7D32' }}>
                ¡Felicitaciones! ¡El primate llegó a su árbol!
              </Typography>
            </Box>
          </motion.div>
        )}

        <Button
          onClick={resetMaze}
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: '#C45B28',
            color: '#C45B28',
            fontWeight: 600,
            borderRadius: 3,
            '&:hover': { borderColor: '#A63A1E' },
          }}
        >
          Reiniciar
        </Button>
      </Box>

      {/* Right: Reflection */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
          borderLeft: isMobile ? 'none' : '3px dashed #C45B28',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#C45B28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>10</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: '#C45B28',
              fontWeight: 800,
              mb: 1,
              mt: 1,
            }}
          >
            Actividades de Reflexion y Comprension
          </Typography>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Paper sx={{
              p: 4, textAlign: 'center', mt: 4, borderRadius: 3,
              background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
              border: '3px solid #4CAF50',
            }}>
              <CheckCircle sx={{ fontSize: 60, color: '#2E7D32', mb: 1 }} />
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', mb: 1 }}>
                Gracias por compartir!
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#33691E' }}>
                Tus reflexiones han sido guardadas correctamente.
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              fullWidth
              label="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#FFFDE7',
                },
              }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#5D4037', mb: 1 }}>
                Si fueras una especie del Bosque Protector, ¿Que harias? ¿Como te gustaria vivir?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Escribe tu respuesta aqui..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#FFFDE7',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#5D4037', mb: 1 }}>
                Desde tu punto de vista responde: ¿Por que crees que la Biodiversidad es importante para todos?
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Escribe tu respuesta aqui..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#FFFDE7',
                  },
                }}
              />
            </Box>

            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Send />}
              disabled={!name.trim() || !answer1.trim() || !answer2.trim() || submitting}
              fullWidth
              sx={{
                bgcolor: '#C45B28',
                py: 1.2,
                fontWeight: 700,
                borderRadius: 3,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(196,91,40,0.4)',
                '&:hover': { bgcolor: '#A63A1E' },
                '&.Mui-disabled': { bgcolor: '#D7CCC8', color: '#9E9E9E' },
              }}
            >
              {submitting ? 'Enviando...' : 'Enviar respuestas'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
