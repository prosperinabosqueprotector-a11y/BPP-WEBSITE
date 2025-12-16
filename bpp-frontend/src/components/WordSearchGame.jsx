import React, { useState, useEffect } from 'react';
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

const sopa1 = [
  ['A', 'J', 'G', 'A', 'N', 'U', 'T', 'L'],
  ['N', 'G', 'H', 'M', 'I', 'U', 'X', 'O'],
  ['S', 'U', 'I', 'O', 'B', 'R', 'O', 'B'],
  ['X', 'O', 'K', 'N', 'C', 'A', 'E', 'R'],
  ['F', 'S', 'L', 'O', 'N', 'I', 'O', 'A'],
  ['O', 'A', 'A', 'V', 'E', 'Z', 'V', 'A'],
  ['E', 'U', 'Q', 'S', 'O', 'B', 'E', 'O'],
  ['N', 'S', 'E', 'M', 'I', 'L', 'L', 'A']
];

const SOLUTIONS_SOPA1 = {
  'AIRE': ['0-3', '1-4', '2-5', '3-6'],
  'SOL': ['2-0', '3-1', '4-2'],
  'AVE': ['5-2', '5-3', '5-4'],
  'MONO': ['1-3', '2-3', '3-3', '4-3'],
  'BOSQUE': ['6-5', '6-4', '6-3', '6-2', '6-1', '6-0'],
  'ARBOL': ['4-7', '3-7', '2-7', '1-7', '0-7'],
  'RAIZ': ['2-5', '3-5', '4-5', '5-5'],
  'SEMILLA': ['7-1', '7-2', '7-3', '7-4', '7-5', '7-6', '7-7'],
};
const sopa2 = [
  ['K', 'A', 'I', 'V', 'U', 'L', 'L', 'R'],
  ['A', 'S', 'O', 'P', 'I', 'R', 'A', 'M'],
  ['Q', 'A', 'R', 'R', 'E', 'I', 'T', 'J'],
  ['Y', 'K', 'A', 'U', 'C', 'A', 'H', 'D'],
  ['O', 'T', 'C', 'E', 'S', 'N', 'I', 'I'],
  ['O', 'Z', 'S', 'A', 'C', 'O', 'R', 'K'],
  ['T', 'S', 'A', 'N', 'I', 'P', 'S', 'E'],
  ['S', 'A', 'L', 'L', 'I', 'M', 'E', 'S']
];
const SOLUTIONS_SOPA2 = {
  'RAICES': ['0-7', '1-6', '2-5', '3-4', '4-3', '5-2'],
  'SEMILLAS': ['7-7', '7-6', '7-5', '7-4', '7-3', '7-2', '7-1', '7-0'],
  'ESPINAS': ['6-7', '6-6', '6-5', '6-4', '6-3', '6-2', '6-1'],
  'INSECTO': ['4-6', '4-5', '4-4', '4-3', '4-2', '4-1', '4-0'],
  'MARIPOSA': ['1-7', '1-6', '1-5', '1-4', '1-3', '1-2', '1-1', '1-0'],
  'LLUVIA': ['0-6', '0-5', '0-4', '0-3', '0-2', '0-1'],
  'TIERRA': ['2-6', '2-5', '2-4', '2-3', '2-2', '2-1'],
  'ROCAS': ['5-6', '5-5', '5-4', '5-3', '5-2']
};
const sopa3 = [
  ['B', 'A', 'S', 'U', 'R', 'A', 'S', 'O'],
  ['R', 'E', 'C', 'I', 'C', 'L', 'A', 'R'],
  ['R', 'E', 'S', 'P', 'E', 'T', 'O', 'L'],
  ['C', 'O', 'N', 'T', 'A', 'M', 'I', 'N'],
  ['A', 'I', 'R', 'E', 'L', 'L', 'U', 'V'],
  ['B', 'O', 'S', 'Q', 'U', 'E', 'I', 'A'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'A']
];
const SOLUTIONS_SOPA3 = {
  'BASURA': ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5'],
  'RECICLAR': ['1-0', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'],
  'RESPETO': ['2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6'],
  'CONTAMINACION': ['3-0', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7'],
  'AIRE': ['4-0', '4-1', '4-2', '4-3'],
  'LLUVIA': ['4-4', '4-5', '4-6', '4-7', '5-7', '5-6'],
  'BOSQUE': ['5-0', '5-1', '5-2', '5-3', '5-4', '5-5'],
  'SOL': ['0-6', '0-7', '2-7']
};
const sopa4 = [
  ['S', 'E', 'R', 'P', 'I', 'E', 'N', 'T'],
  ['I', 'N', 'S', 'E', 'C', 'T', 'O', 'E'],
  ['M', 'A', 'R', 'I', 'P', 'O', 'S', 'A'],
  ['A', 'V', 'E', 'M', 'O', 'N', 'O', 'X'],
  ['A', 'R', 'B', 'O', 'L', 'R', 'A', 'I'],
  ['R', 'A', 'I', 'Z', 'S', 'E', 'M', 'I'],
  ['S', 'E', 'M', 'I', 'L', 'L', 'A', 'S'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I']
];
const SOLUTIONS_SOPA4 = {
  'SERPIENTE': ['0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '0-7'],
  'INSECTO': ['1-0', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6'],
  'MARIPOSA': ['2-0', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7'],
  'AVE': ['3-0', '3-1', '3-2'],
  'MONO': ['3-3', '3-4', '3-5', '3-6'],
  'ARBOL': ['4-0', '4-1', '4-2', '4-3', '4-4'],
  'RAIZ': ['5-0', '5-1', '5-2', '5-3'],
  'SEMILLA': ['6-0', '6-1', '6-2', '6-3', '6-4', '6-5', '6-6']
};
const sopas = [sopa1, sopa2]
const soluciones = [SOLUTIONS_SOPA1, SOLUTIONS_SOPA2]
function getRandomSopa() {
  const randomIndex = Math.floor(Math.random() * sopas.length);
  return randomIndex;
}
const juego = getRandomSopa();
const GRID = sopas[juego];
const SOLUTIONS = soluciones[juego];

const WORDS = Object.keys(SOLUTIONS);
const GAME_DURATION = 60;

export default function WordSearchGame() {
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');

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
  }, [gameStatus]);

  const toggleCell = (r, c) => {
    if (gameStatus !== 'playing') return;

    const id = `${r}-${c}`;
    let newSelected;

    if (selected.includes(id)) {
      newSelected = selected.filter(item => item !== id);
    } else {
      newSelected = [...selected, id];
    }

    setSelected(newSelected);
    checkForWordMatch(newSelected);
  };

  const checkForWordMatch = (currentSelection) => {
    Object.keys(SOLUTIONS).forEach(word => {
      if (foundWords.includes(word)) return;

      const coordinates = SOLUTIONS[word];
      const isMatch = coordinates.every(coord => currentSelection.includes(coord));

      if (isMatch) {
        const newFound = [...foundWords, word];
        setFoundWords(newFound);

        const remainingSelection = currentSelection.filter(id => !coordinates.includes(id));
        setSelected(remainingSelection);

        if (newFound.length === WORDS.length) {
          finishGame('won');
        }
      }
    });
  };

  const finishGame = (status) => {
    setGameStatus(status);

    if (status === 'won') {
      const calculatedScore = 100 + (timeLeft * 10);
      setScore(calculatedScore);
    } else {
      setScore(0);
    }

    setIsGameOver(true);
  };

  const resetGame = () => {
    setSelected([]);
    setFoundWords([]);
    setTimeLeft(GAME_DURATION);
    setGameStatus('playing');
    setScore(0);
    setIsGameOver(false);
  };

  const isCellFound = (r, c) => {
    const id = `${r}-${c}`;
    return foundWords.some(word => SOLUTIONS[word].includes(id));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #fffde7 100%)',
          textAlign: 'center'
        }}
      >

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="primary.dark" fontWeight="bold">
            🔡 Sopa de Letras
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ffecb3', p: 0.5, px: 2, borderRadius: 4 }}>
              <Timer fontSize="small" color="action" />
              <Typography fontWeight="bold" color="warning.dark">{timeLeft}s</Typography>
            </Box>
            <IconButton onClick={resetGame} color="primary">
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(foundWords.length / WORDS.length) * 100}
          sx={{ mb: 4, height: 8, borderRadius: 5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ffb74d' } }}
        />

        <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2, border: '1px solid #ffe0b2' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>PALABRAS A ENCONTRAR:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {WORDS.map(w => {
              const isFound = foundWords.includes(w);
              return (
                <Chip
                  key={w}
                  label={w}
                  icon={isFound ? <CheckCircle /> : undefined}
                  color={isFound ? "success" : "default"}
                  variant={isFound ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 'bold',
                    opacity: isFound ? 1 : 0.7,
                    transition: 'all 0.3s'
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 0.5,
          maxWidth: 400,
          margin: '0 auto',
          userSelect: 'none',
          p: 2,
          bgcolor: '#fff8e1',
          borderRadius: 2
        }}>
          {GRID.map((row, rIndex) => (
            row.map((letter, cIndex) => {
              const id = `${rIndex}-${cIndex}`;
              const isSelected = selected.includes(id);
              const isFound = isCellFound(rIndex, cIndex);

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
                    color: isFound ? 'white' : (isSelected ? '#e65100' : '#424242'),
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    borderRadius: 1,
                    boxShadow: isSelected || isFound ? '0 2px 4px rgba(0,0,0,0.1)' : 'inset 0 0 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease-in-out',
                    transform: isSelected ? 'scale(0.95)' : 'scale(1)',
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
          <Box sx={{ mt: 4, p: 2, bgcolor: '#ffebee', borderRadius: 2, border: '1px solid #ffcdd2' }}>
            <Typography variant="h6" color="error.dark" fontWeight="bold">⏳ ¡Tiempo agotado!</Typography>
            <Typography sx={{ mb: 2 }} variant="body2">No lograste encontrar todas las palabras.</Typography>
            <Button variant="contained" color="error" onClick={resetGame}>
              Intentar de nuevo
            </Button>
          </Box>
        )}

      </Paper>
    </Box>
  );
}