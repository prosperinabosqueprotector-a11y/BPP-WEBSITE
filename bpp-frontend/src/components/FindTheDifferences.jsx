import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

// 🔹 Lista de diferencias (coordenadas relativas)
const differences = [
  { x: 20, y: 30 },
  { x: 60, y: 70 },
  { x: 150, y: 90 },
  { x: 220, y: 140 },
  { x: 280, y: 200 },
];

const FindTheDifferences = () => {
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  // 🔹 Temporizador
  useEffect(() => {
    if (time > 0 && !gameOver) {
      const timer = setInterval(
        () => setTime((prevTime) => prevTime - 1),
        1000
      );
      return () => clearInterval(timer);
    } else if (time === 0) {
      setGameOver(true);
    }
  }, [time, gameOver]);

  // 🔹 Función para detectar clics en la imagen
  const handleImageClick = (e) => {
    if (gameOver) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = differences.find(
      (diff) => Math.abs(diff.x - x) < 20 && Math.abs(diff.y - y) < 20
    );

    if (found && !foundDifferences.includes(found)) {
      setFoundDifferences([...foundDifferences, found]);
      setScore(score + 10);
    } else {
      setScore(score - 5);
    }

    if (foundDifferences.length + 1 === differences.length) {
      setGameOver(true);
    }
  };

  // 🔹 Reiniciar juego
  const resetGame = () => {
    setFoundDifferences([]);
    setScore(0);
    setTime(60);
    setGameOver(false);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 'bold', color: '#2E7D32' }}
      >
        🔍 Encuentra las Diferencias
      </Typography>
      <Typography variant="h6">⏳ Tiempo: {time}s</Typography>
      <Typography variant="h6">🏆 Puntos: {score}</Typography>

      <Box
        sx={{
          position: 'relative',
          margin: '20px auto',
          width: '300px',
          height: '200px',
          backgroundImage: `url('/images/differences-image.jpg')`,
          backgroundSize: 'cover',
          border: '2px solid #333',
          cursor: 'pointer',
        }}
        onClick={handleImageClick}
      >
        {foundDifferences.map((diff, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: `${diff.y}px`,
              left: `${diff.x}px`,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'green',
              opacity: 0.8,
            }}
          />
        ))}
      </Box>

      {gameOver && (
        <Typography variant="h6" sx={{ color: '#D32F2F', mt: 2 }}>
          {foundDifferences.length === differences.length
            ? '🎉 ¡Ganaste! Todas las diferencias encontradas.'
            : '⏳ Tiempo agotado. Inténtalo de nuevo.'}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={resetGame}
      >
        🔄 Reiniciar Juego
      </Button>
    </Paper>
  );
};

export default FindTheDifferences;
