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

const GRID = [
  ['S', 'O', 'L', 'A', 'R', 'B', 'O', 'L'], 
  ['E', 'G', 'U', 'A', 'G', 'U', 'A', 'X'], 
  ['M', 'I', 'Z', 'F', 'L', 'O', 'R', 'Y'], 
  ['I', 'R', 'A', 'I', 'Z', 'P', 'O', 'L'], 
  ['L', 'A', 'T', 'I', 'E', 'R', 'R', 'A'], 
  ['L', 'S', 'H', 'O', 'J', 'A', 'Q', 'W'], 
  ['A', 'O', 'X', 'I', 'G', 'E', 'N', 'O'], 
  ['P', 'L', 'A', 'N', 'T', 'A', 'S', 'Z']  
];

const SOLUTIONS = {
  'SOL':      ['0-0', '0-1', '0-2'],
  'AGUA':     ['1-3', '1-4', '1-5', '1-6'],
  'FLOR':     ['2-3', '2-4', '2-5', '2-6'],
  'RAIZ':     ['3-1', '3-2', '3-3', '3-4'],
  'TIERRA':   ['4-2', '4-3', '4-4', '4-5', '4-6', '4-7'],
  'HOJA':     ['5-2', '5-3', '5-4', '5-5'],
  'SEMILLA':  ['0-0', '1-0', '2-0', '3-0', '4-0', '5-0', '6-0'],
  'PLANTAS':  ['7-0', '7-1', '7-2', '7-3', '7-4', '7-5', '7-6']
};

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