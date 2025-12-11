import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Box,
  Container,
  Button,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import Puzzle from '../components/Puzzle';
import QuizGame from '../components/QuizGame';
import MemoryGame from '../components/MemoryGame';
import CrosswordGame from '../components/CrosswordGame';
import HangmanGame from '../components/HangmanGame';
import WordSearchGame from '../components/WordSearchGame';

const GAME_LIST = [
  {
    id: 'quiz',
    title: 'Quiz Game',
    image: 'https://play-lh.googleusercontent.com/jiAJ1xoLhKs7DBP2SfmPQ-pgG0-g4vBJ2oXFJ2tAW1bMlzZ3O3qeqM6GU17AwgDRGXQ',
  },
  {
    id: 'puzzle',
    title: 'Puzzle',
    image: 'https://cdn-icons-png.flaticon.com/512/5873/5873228.png',
  },
  {
    id: 'crossword',
    title: 'Crucigrama',
    image: 'https://estaticos-cdn.prensaiberica.es/clip/1e6f4c18-013c-4f08-9e43-25a8ade3bd71_alta-libre-aspect-ratio_default_0.jpg', // Icono de crucigrama mejorado
  },
  {
    id: 'hangman',
    title: 'Ahorcado',
    image: 'https://www.daletiempoaljuego.com/wp-content/uploads/2016/03/jec-ahorcado.jpg',
  },
  {
    id: 'wordsearch',
    title: 'Sopa de Letras',
    image: 'https://play-lh.googleusercontent.com/YbDZzHq8gP7u0qaBHEPHj7ntn8yWtPDpQDEMktIlvzxwOyGBV6XYRys_1R9wq71LLKU', // Icono genérico de letras
  },
  {
    id: 'memory',
    title: 'Encuentra las Cartas',
    image: 'https://play-lh.googleusercontent.com/cDF6IMlYXnjdSEGwbuojkVaaQpbnLeCKiJQ1e6IY7KOyt4UioZUT0PKpyUOVk8q1Hr0',
  }
];

const GameMenu = ({ games, onSelectGame }) => {
  return (
    <Paper
      elevation={3}
      sx={{ 
        p: 4, 
        mb: 8, 
        background: 'linear-gradient(to right, #f0fdf4, #eff6ff)' // Verde suave a azul suave
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 4
        }}
      >
        <StarIcon sx={{ color: 'gold', fontSize: 30 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#166534', // green-800
            borderBottom: '3px solid #22c55e', // green-500
            pb: 1,
            px: 2
          }}
        >
          Juegos Educativos
        </Typography>
        <StarIcon sx={{ color: 'gold', fontSize: 30 }} />
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {games.map((game, index) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)', // Efecto de elevación
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => onSelectGame(game.id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={game.image}
                  alt={game.title}
                  sx={{ 
                    height: 180, 
                    objectFit: 'cover' 
                  }}
                />
                <CardContent sx={{ 
                    flexGrow: 1, 
                    background: 'linear-gradient(to bottom, #ffffff, #dcfce7)', // Blanco a verde muy claro
                    textAlign: 'center'
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#14532d', // Verde oscuro
                        textTransform: 'uppercase',
                        fontSize: '1rem'
                    }}
                  >
                    {game.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default function Juegos() {
  const [activeGame, setActiveGame] = useState(null);
  const [puzzleImage, setPuzzleImage] = useState('');

  const handleSelectGame = async (gameId) => {
    if (gameId === 'puzzle') {
      try {
        const lastImg = puzzleImage;
        const apiUrl = 'https://bpp-website.onrender.com';
        const response = await fetch(
          `${apiUrl}/api/puzzle-image?last=${encodeURIComponent(lastImg)}`
        );

        if (!response.ok) throw new Error('Error fetching puzzle');
        const data = await response.json();

        setPuzzleImage(data.imageUrl);
        setActiveGame('puzzle');
      } catch (error) {
        console.error(error);
        setActiveGame('puzzle');
      }
    } else {
      setActiveGame(gameId);
    }
  };

  const handleBackToMenu = () => {
    setActiveGame(null);
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'puzzle': return <Puzzle imageUrl={puzzleImage} />;
      case 'quiz': return <QuizGame />;
      case 'memory': return <MemoryGame />;
      case 'crossword': return <CrosswordGame />;
      case 'hangman': return <HangmanGame />;
      case 'wordsearch': return <WordSearchGame />;
      default: return null;
    }
  };

  return (
    <Container sx={{ py: 4, minHeight: '80vh' }}>
      {!activeGame && (
        <GameMenu games={GAME_LIST} onSelectGame={handleSelectGame} />
      )}

      {activeGame && (
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToMenu}
            variant="contained"
            color="success"
            sx={{ mb: 3, fontWeight: 'bold', borderRadius: 2 }}
          >
            Volver al Menú
          </Button>

          <Box sx={{ mt: 1 }}>{renderGame()}</Box>
        </Box>
      )}
    </Container>
  );
}