import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, LinearProgress } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScoreModal from './ScoreModal';

// URL de tu Backend (para pedirle el NOMBRE de la imagen, no la imagen en sí)
const API_URL = 'https://bpp-website.onrender.com'; 

const GAME_DURATION = 120; 

const Puzzle = ({ imageUrl }) => {
  const initialPieces = Array.from({ length: 9 }, (_, i) => i);
  const [pieces, setPieces] = useState(initialPieces);
  
  const [points, setPoints] = useState(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [currentImage, setCurrentImage] = useState(imageUrl || '');
  
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); 

  const fetchPuzzleImage = async () => {
    try {
      let lastImgParam = '';
      if (currentImage) {
          lastImgParam = encodeURIComponent(currentImage);
      }
      
      const response = await fetch(`${API_URL}/api/puzzle-image?last=${lastImgParam}`);
      if (!response.ok) throw new Error('Error al conectar con servidor');

      const data = await response.json();
      
      console.log('🖼️ Ruta de imagen recibida:', data.imageUrl);
      setCurrentImage(data.imageUrl);

    } catch (error) {
      console.error('Error fetching puzzle image:', error);
      // Fallback
      setCurrentImage('https://placehold.co/600x600?text=Error+Carga');
    }
  };

  const startNewGame = async (forceFetch = false) => {
    setTimerActive(false); 
    
    if (forceFetch || !currentImage) {
        await fetchPuzzleImage();
    }
    
    setPieces(shuffleArray([...initialPieces]));
    setIsPuzzleSolved(false);
    setIsGameOver(false);
    setGameStatus('playing');
    setTimeLeft(GAME_DURATION);
    setMoves(0);
    setPoints(0);
    setTimerActive(true); 
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    if (array.every((val, idx) => val === idx)) return shuffleArray(array);
    return array;
  };

  useEffect(() => {
    if (imageUrl) {
        setCurrentImage(imageUrl);
        startNewGame(false);
    } else {
        startNewGame(true);
    }
  }, [imageUrl]);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
           if (prev <= 1) {
               finishGame('lost');
               return 0;
           }
           return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
        finishGame('lost');
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleDragStart = (e, index) => {
    if (!timerActive) return;
    e.dataTransfer.setData('pieceIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    if (!timerActive) return;
    const draggedIndex = parseInt(e.dataTransfer.getData('pieceIndex'));
    
    if (draggedIndex !== targetIndex) {
      const newPieces = [...pieces];
      [newPieces[draggedIndex], newPieces[targetIndex]] = [
        newPieces[targetIndex],
        newPieces[draggedIndex],
      ];
      setPieces(newPieces);
      setMoves((prev) => prev + 1);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const isSolved = pieces.every((piece, index) => piece === index);

  useEffect(() => {
    if (isSolved && !isPuzzleSolved && timerActive) {
      finishGame('won');
    }
  }, [pieces, isSolved, isPuzzleSolved, timerActive]);

  const finishGame = (status) => {
      setTimerActive(false);
      setGameStatus(status);
      
      if (status === 'won') {
          setIsPuzzleSolved(true);
          const finalScore = 100 + (timeLeft * 10);
          setPoints(finalScore);
      } else {
          setPoints(0);
      }
      setIsGameOver(true);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>🌿 Puzzle</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: timeLeft < 20 ? '#ffcdd2' : '#e8f5e9', p: 1, borderRadius: 2 }}>
            <TimerIcon color={timeLeft < 20 ? "error" : "success"} />
            <Typography variant="h6" color={timeLeft < 20 ? "error" : "success.main"} fontWeight="bold">
                {timeLeft}s
            </Typography>
        </Box>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={(timeLeft / GAME_DURATION) * 100} 
        sx={{ mb: 2, height: 10, borderRadius: 5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: timeLeft < 20 ? 'red' : 'green' } }}
      />

      <Typography variant="subtitle1" sx={{ mb: 2 }}>🔄 Movimientos: {moves}</Typography>

      <Box
        sx={{
          width: '300px',
          height: '300px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          border: '4px solid #333',
          margin: '0 auto',
          backgroundColor: '#ccc',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}
      >
        {pieces.map((piece, index) => {
            const x = (piece % 3) * 100; 
            const y = Math.floor(piece / 3) * 100;

            return (
              <Box
                key={index}
                draggable={timerActive}
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${currentImage})`, 
                  backgroundSize: '300px 300px', 
                  backgroundPosition: `-${x}px -${y}px`, 
                  backgroundRepeat: 'no-repeat', 
                  border: '1px solid rgba(255,255,255,0.5)',
                  cursor: timerActive ? 'move' : 'default',
                  opacity: (isGameOver && gameStatus === 'lost') ? 0.5 : 1,
                  transition: 'transform 0.1s',
                }}
              />
            );
        })}
      </Box>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<RefreshIcon />}
        sx={{ mt: 4, py: 1.5, px: 4, fontWeight: 'bold' }}
        onClick={() => startNewGame(true)} 
      >
        Cambiar Puzzle
      </Button>

      <ScoreModal 
        open={isGameOver && gameStatus === 'won'} 
        score={points}
        gameId="puzzle" 
        onClose={() => startNewGame(true)} 
        onSaveSuccess={() => startNewGame(true)}
      />

      {isGameOver && gameStatus === 'lost' && (
         <Typography color="error" variant="h6" sx={{ mt: 2 }}>
             ⌛ ¡Tiempo agotado! Inténtalo de nuevo.
         </Typography>
      )}

    </Paper>
  );
};

export default Puzzle;
