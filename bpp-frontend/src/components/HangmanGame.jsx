import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import ScoreModal from './ScoreModal'; 

const WORDS = [
  'PLANTA', 'FOTOSINTESIS', 'RAIZ', 'HOJAS', 'POLEN', 
  'SEMILLA', 'BIODIVERSIDAD', 'ECOSISTEMA', 'FAUNA', 'FLORA'
];

const MAX_ERRORS = 6;
const BASE_SCORE_MULTIPLIER = 50; 

export default function HangmanGame() {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessed([]);
    setMistakes(0);
    setScore(0);
    setIsGameOver(false);
    setGameStatus('playing');
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessed.includes(letter)) return;

    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      if (newMistakes >= MAX_ERRORS) {
        finishGame('lost', 0);
      }
    } else {
      const isWon = word.split('').every(char => newGuessed.includes(char));
      if (isWon) {
        const livesLeft = MAX_ERRORS - mistakes;
        const calculatedScore = (livesLeft + 1) * BASE_SCORE_MULTIPLIER;
        finishGame('won', calculatedScore);
      }
    }
  };

  const finishGame = (status, finalScore) => {
    setGameStatus(status);
    setScore(finalScore);
    setIsGameOver(true);
  };

  const isVowel = (char) => ['A', 'E', 'I', 'O', 'U'].includes(char);

  const renderHangman = () => {
    const strokeProps = { stroke: "#37474f", strokeWidth: "4", strokeLinecap: "round" };
    
    return (
      <svg height="160" width="140" style={{ overflow: 'visible' }}>
        <line x1="10" y1="150" x2="130" y2="150" {...strokeProps} />
        <line x1="70" y1="150" x2="70" y2="10" {...strokeProps} />
        <line x1="70" y1="10" x2="110" y2="10" {...strokeProps} />
        <line x1="110" y1="10" x2="110" y2="30" {...strokeProps} />

        {mistakes >= 1 && <circle cx="110" cy="45" r="15" {...strokeProps} fill="transparent" />} 
        {mistakes >= 2 && <line x1="110" y1="60" x2="110" y2="110" {...strokeProps} />} 
        {mistakes >= 3 && <line x1="110" y1="70" x2="90" y2="90" {...strokeProps} />} 
        {mistakes >= 4 && <line x1="110" y1="70" x2="130" y2="90" {...strokeProps} />} 
        {mistakes >= 5 && <line x1="110" y1="110" x2="90" y2="140" {...strokeProps} />} 
        {mistakes >= 6 && <line x1="110" y1="110" x2="130" y2="140" {...strokeProps} />} 
      </svg>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="success.dark" fontWeight="bold">
             El Ahorcado
          </Typography>
          <IconButton onClick={startNewGame} color="success" title="Reiniciar">
            <Refresh />
          </IconButton>
        </Box>
        
        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          {renderHangman()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5, mb: 5, minHeight: '60px' }}>
          {word.split('').map((char, index) => {
              const isGuessed = guessed.includes(char);
              const showChar = isGuessed || gameStatus === 'lost';
              const isHint = isVowel(char) && !isGuessed && gameStatus === 'playing';

              return (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '36px' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', minHeight: '40px', color: '#1b5e20' }}>
                          {showChar ? char : ''}
                      </Typography>
                      
                      {/* Línea base */}
                      <Box sx={{ width: '100%', height: '4px', bgcolor: '#2e7d32', borderRadius: 2 }} />

                      {/* Pista de vocal (punto naranja discreto) */}
                      {isHint && (
                          <Box sx={{ width: '6px', height: '6px', bgcolor: 'orange', borderRadius: '50%', mt: 1 }} />
                      )}
                  </Box>
              );
          })}
        </Box>

        <Typography 
          sx={{ 
            mb: 2, 
            color: mistakes > 4 ? "error.main" : "text.secondary",
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          ERRORES: {mistakes} / {MAX_ERRORS}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.8, maxWidth: '600px', mx: 'auto' }}>
          {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(letter => {
            const isSelected = guessed.includes(letter);
            const isCorrect = word.includes(letter);
            
            let btnColor = "inherit"; 
            let btnBg = "white";
            let btnBorder = "1px solid #e0e0e0";

            if (isSelected) {
              if (isCorrect) {
                btnBg = "#4caf50"; // Verde
                btnColor = "white";
                btnBorder = "1px solid #4caf50";
              } else {
                btnBg = "#ffcdd2"; // Rojo claro
                btnColor = "#b71c1c";
                btnBorder = "1px solid #ef5350";
              }
            }

            return (
              <Button 
                key={letter} 
                onClick={() => handleGuess(letter)}
                disabled={isSelected || gameStatus !== 'playing'}
                sx={{ 
                    minWidth: '42px', 
                    height: '42px', 
                    fontWeight: 'bold',
                    color: btnColor,
                    bgcolor: btnBg,
                    border: btnBorder,
                    borderRadius: 2,
                    boxShadow: isSelected ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': {
                      bgcolor: isSelected ? btnBg : '#f1f8e9',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s'
                }}
              >
                {letter}
              </Button>
            );
          })}
        </Box>

        <ScoreModal 
          open={isGameOver && gameStatus === 'won'} 
          score={score}
          gameId="hangman" 
          onClose={startNewGame} 
          onSaveSuccess={startNewGame}
        />

        {gameStatus === 'lost' && (
           <Box sx={{ mt: 4, p: 2, bgcolor: '#ffebee', borderRadius: 3, border: '1px solid #ffcdd2' }}>
               <Typography variant="h6" color="error.dark" fontWeight="bold">💀 ¡Juego Terminado!</Typography>
               <Typography sx={{ mb: 2 }}>
                 La palabra era: <Typography component="span" fontWeight="bold" color="black">{word}</Typography>
               </Typography>
               <Button variant="contained" color="error" onClick={startNewGame} startIcon={<Refresh />}>
                   Intentar de nuevo
               </Button>
           </Box>
        )}

      </Paper>
    </Box>
  );
}