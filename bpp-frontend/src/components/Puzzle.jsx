import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const Puzzle = () => {
  const initialPieces = Array.from({ length: 9 }, (_, i) => i);
  const [pieces, setPieces] = useState(initialPieces);
  const [points, setPoints] = useState(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [moves, setMoves] = useState(0);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    shuffleAndResetPuzzle();
  }, [shuffleAndResetPuzzle]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const fetchPuzzleImage = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/puzzle-image');
      const data = await response.json();
      console.log('Image received:', data.imageUrl);
      setCurrentImage(data.imageUrl);
    } catch (error) {
      console.error('Error fetching puzzle image:', error);
    }
  };

  const shuffleAndResetPuzzle = async () => {
    await fetchPuzzleImage();
    setPieces(shuffleArray([...initialPieces]));
    setIsPuzzleSolved(false);
    setTime(0);
    setMoves(0);
    setPoints(0); // 🔄 Reinicia los puntos
    setTimerActive(true);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('pieceIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('pieceIndex'));
    if (draggedIndex !== targetIndex) {
      const newPieces = [...pieces];
      [newPieces[draggedIndex], newPieces[targetIndex]] = [
        newPieces[targetIndex],
        newPieces[draggedIndex],
      ];
      setPieces(newPieces);
      setMoves((prevMoves) => prevMoves + 1);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isSolved = pieces.every((piece, index) => piece === index);

  useEffect(() => {
    if (isSolved && !isPuzzleSolved) {
      setTimerActive(false);
      const bonusPoints = Math.max(0, 100 - time);
      const movePenalty = Math.max(0, 50 - moves);
      setPoints((prevPoints) => prevPoints + 10 + bonusPoints + movePenalty);
      setIsPuzzleSolved(true);
    }
  }, [isSolved, isPuzzleSolved, time, moves]);

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        🌿 Puzzle Game
      </Typography>
      <Typography variant="h6">🎯 Puntos: {points}</Typography>
      <Typography variant="h6">⏱️ Tiempo: {time}s</Typography>
      <Typography variant="h6">🔄 Movimientos: {moves}</Typography>

      <Box
        sx={{
          width: '300px',
          height: '300px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          border: '2px solid #333',
          margin: '20px auto',
        }}
      >
        {pieces.map((piece, index) => (
          <Box
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: `${(piece % 3) * -100}% ${
                Math.floor(piece / 3) * -100
              }%`,
              backgroundSize: '300%',
              border: '1px solid #ddd',
              cursor: 'move',
            }}
          />
        ))}
      </Box>

      {isSolved && (
        <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
          🎉 ¡Puzzle resuelto! +10 puntos, +{Math.max(0, 100 - time)} puntos de
          bonificación y +{Math.max(0, 50 - moves)} puntos por pocos
          movimientos.
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={shuffleAndResetPuzzle}
      >
        🔄 Reiniciar Puzzle
      </Button>
    </Paper>
  );
};

export default Puzzle;
