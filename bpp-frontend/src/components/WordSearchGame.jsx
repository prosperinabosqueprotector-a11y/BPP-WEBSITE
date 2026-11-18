import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import { Timer, Refresh, CheckCircle } from '@mui/icons-material';
import ScoreModal from './ScoreModal';

const GRID_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],            [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const WORD_SETS = [
  ['AIRE', 'SOL', 'AVE', 'MONO', 'BOSQUE', 'ARBOL', 'RAIZ', 'SEMILLA'],
  ['RAICES', 'SEMILLAS', 'ESPINAS', 'INSECTO', 'MARIPOSA', 'LLUVIA', 'TIERRA', 'ROCAS'],
  ['MUYUYO', 'CACTUS', 'ESPINO', 'BEJUCO', 'HIERBAS', 'TRONCOS', 'PERICOS', 'GAVILAN'],
  ['BUHO', 'ARDILLA', 'RANAS', 'INSECTOS', 'AIRE', 'SOL', 'BOSQUE', 'TIERRA']
];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateRandomSopa = () => {
  const words = shuffle(WORD_SETS[Math.floor(Math.random() * WORD_SETS.length)]);
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
  const solutions = {};

  const placeWord = (wordIndex) => {
    if (wordIndex === words.length) return true;

    const word = words[wordIndex];
    const placements = [];
    DIRECTIONS.forEach(([rowStep, columnStep]) => {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
          const endRow = row + (word.length - 1) * rowStep;
          const endColumn = column + (word.length - 1) * columnStep;
          if (endRow >= 0 && endRow < GRID_SIZE && endColumn >= 0 && endColumn < GRID_SIZE) {
            placements.push({ row, column, rowStep, columnStep });
          }
        }
      }
    });

    for (const { row, column, rowStep, columnStep } of shuffle(placements)) {
      const coordinates = Array.from({ length: word.length }, (_, index) => {
        const currentRow = row + index * rowStep;
        const currentColumn = column + index * columnStep;
        return { row: currentRow, column: currentColumn, id: `${currentRow}-${currentColumn}` };
      });

      if (coordinates.some(({ row: currentRow, column: currentColumn }, index) =>
        grid[currentRow][currentColumn] && grid[currentRow][currentColumn] !== word[index]
      )) continue;

      coordinates.forEach(({ row: currentRow, column: currentColumn }, index) => {
        grid[currentRow][currentColumn] = word[index];
      });
      solutions[word] = coordinates.map(({ id }) => id);

      if (placeWord(wordIndex + 1)) return true;

      coordinates.forEach(({ row: currentRow, column: currentColumn }) => {
        grid[currentRow][currentColumn] = '';
      });
      delete solutions[word];
    }

    return false;
  };

  if (!placeWord(0)) {
    throw new Error('No se pudo generar una sopa de letras válida.');
  }

  return {
    grid: grid.map(row => row.map(letter =>
      letter || LETTERS[Math.floor(Math.random() * LETTERS.length)]
    )),
    solutions
  };
};

const GAME_DURATION = 90; // Aumentado un poco para que dé tiempo

export default function WordSearchGame() {
  // --- ESTADOS DE LA SOPA ---
  const [currentSopa, setCurrentSopa] = useState(generateRandomSopa);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');

  // --- VARIABLES DERIVADAS ---
  const GRID = currentSopa.grid;
  const SOLUTIONS = currentSopa.solutions;
  const WORDS = Object.keys(SOLUTIONS);

  const finishGame = useCallback((status, remainingTime = 0) => {
    setGameStatus(status);
    if (status === 'won') {
      setScore(100 + (remainingTime * 10));
    } else {
      setScore(0);
    }
    setIsGameOver(true);
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finishGame, gameStatus]);

  const toggleCell = (r, c) => {
    if (gameStatus !== 'playing') return;
    const id = `${r}-${c}`;
    let newSelected = selected.includes(id) 
      ? selected.filter(item => item !== id) 
      : [...selected, id];

    setSelected(newSelected);
    checkForWordMatch(newSelected);
  };

  const checkForWordMatch = (currentSelection) => {
    WORDS.forEach(word => {
      if (foundWords.includes(word)) return;
      const coordinates = SOLUTIONS[word];
      const isMatch = coordinates.every(coord => currentSelection.includes(coord));

      if (isMatch) {
        const newFound = [...foundWords, word];
        setFoundWords(newFound);
        // Limpiar selección pero mantener lo que no era parte de esta palabra
        setSelected(currentSelection.filter(id => !coordinates.includes(id)));

        if (newFound.length === WORDS.length) {
          finishGame('won', timeLeft);
        }
      }
    });
  };

  const resetGame = () => {
    setSelected([]);
    setFoundWords([]);
    setTimeLeft(GAME_DURATION);
    setGameStatus('playing');
    setScore(0);
    setIsGameOver(false);
    setCurrentSopa(generateRandomSopa());
  };

  const isCellFound = (r, c) => {
    const id = `${r}-${c}`;
    return foundWords.some(word => SOLUTIONS[word].includes(id));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #ffffff 0%, #fffde7 100%)', textAlign: 'center' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="primary.dark" fontWeight="bold">🔡 Sopa de Letras</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ffecb3', p: 0.5, px: 2, borderRadius: 4 }}>
              <Timer fontSize="small" color="action" />
              <Typography fontWeight="bold" color="warning.dark">{timeLeft}s</Typography>
            </Box>
            <IconButton onClick={resetGame} color="primary"><Refresh /></IconButton>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={(foundWords.length / WORDS.length) * 100} 
          sx={{ mb: 4, height: 8, borderRadius: 5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ffb74d' } }} 
        />

        <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2, border: '1px solid #ffe0b2' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>PALABRAS ({foundWords.length}/{WORDS.length}):</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {WORDS.map(w => (
              <Chip 
                key={w} 
                label={w} 
                color={foundWords.includes(w) ? "success" : "default"} 
                icon={foundWords.includes(w) ? <CheckCircle /> : undefined}
                variant={foundWords.includes(w) ? "filled" : "outlined"}
                sx={{ fontWeight: 'bold' }} 
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(8, 1fr)', 
          gap: 0.5, 
          maxWidth: 400, 
          margin: '0 auto', 
          p: 2, 
          bgcolor: '#fff8e1', 
          borderRadius: 2 
        }}>
          {GRID.map((row, rIndex) => (
            row.map((letter, cIndex) => {
              const id = `${rIndex}-${cIndex}`;
              const isFound = isCellFound(rIndex, cIndex);
              const isSelected = selected.includes(id);

              return (
                <Box
                  key={id}
                  onClick={() => toggleCell(rIndex, cIndex)}
                  sx={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isFound ? '#66bb6a' : (isSelected ? '#ffcc80' : 'white'),
                    color: isFound ? 'white' : '#424242',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: 1,
                    transition: 'all 0.1s',
                    '&:hover': { bgcolor: isFound ? '#66bb6a' : '#ffe0b2' }
                  }}
                >
                  {letter}
                </Box>
              );
            })
          ))}
        </Box>

        <ScoreModal 
          open={isGameOver && gameStatus === 'won'} 
          score={score} 
          gameId="wordsearch" 
          onClose={resetGame} 
          onSaveSuccess={resetGame} 
        />

        {isGameOver && gameStatus === 'lost' && (
          <Box sx={{ mt: 4, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6" color="error.dark" fontWeight="bold">⌛ ¡Tiempo agotado!</Typography>
            <Button variant="contained" color="error" onClick={resetGame} sx={{ mt: 1 }}>Reintentar</Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}