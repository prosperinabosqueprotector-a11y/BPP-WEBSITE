import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress
} from '@mui/material';
import { EmojiEvents, NavigateNext, Refresh } from '@mui/icons-material';
import ScoreModal from './ScoreModal';

const QUESTIONS_PER_GAME = 5; // Configuración: 5 preguntas por partida

const QuizGame = () => {
  const [fullQuestionBank, setFullQuestionBank] = useState([]); // Banco completo
  const [questions, setQuestions] = useState([]); // Las 5 activas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Función para barajar array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://bpp-website-1.onrender.com/api/quiz/all');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setFullQuestionBank(data); // Guardamos todo el banco
        setupGame(data); // Iniciamos el juego con 5 al azar
      }
    } catch (error) {
      console.error("Error cargando quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Selecciona 5 preguntas al azar del banco
  const setupGame = (bank) => {
    const shuffled = shuffleArray(bank);
    const selectedFive = shuffled.slice(0, QUESTIONS_PER_GAME);
    setQuestions(selectedFive);
    
    // Resetear estados de juego
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setIsGameOver(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    let newScore = score;
    if (isCorrect) {
        newScore = score + 10;
        setScore(newScore); 
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer('');
    } else {
      setIsGameOver(true);
    }
  };

  const resetQuiz = () => {
    // Al reiniciar, volvemos a elegir 5 preguntas DISTINTAS del banco que ya tenemos
    setupGame(fullQuestionBank);
  };

  const handleSaveSuccess = () => {
    resetQuiz();
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography gutterBottom>Cargando banco de preguntas...</Typography>
        <LinearProgress color="success" />
      </Paper>
    );
  }

  if (questions.length === 0) {
    return (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <Typography>No se encontraron preguntas disponibles.</Typography>
          <Button onClick={fetchQuestions} startIcon={<Refresh />}>Reintentar</Button>
        </Paper>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#e8f5e9', px: 2, py: 0.5, borderRadius: 10 }}>
            <EmojiEvents sx={{ color: '#fbc02d' }} />
            <Typography fontWeight="bold" color="success.main">{score} pts</Typography>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5, 
            mb: 4, 
            bgcolor: '#e0e0e0',
            '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
          }} 
        />

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: '#1b5e20', minHeight: '60px' }}>
          {currentQuestion?.question}
        </Typography>

        <Grid container spacing={2}>
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Card 
                  elevation={isSelected ? 4 : 1}
                  sx={{ 
                    borderRadius: 3,
                    border: isSelected ? '2px solid #4caf50' : '2px solid transparent',
                    backgroundColor: isSelected ? '#e8f5e9' : 'white',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleAnswerSelect(option)} 
                    sx={{ height: '100%', p: 1 }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                      <Box 
                        sx={{ 
                          width: 24, height: 24, borderRadius: '50%', 
                          border: `2px solid ${isSelected ? '#4caf50' : '#bdbdbd'}`,
                          mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {isSelected && <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />}
                      </Box>
                      <Typography variant="body1" fontWeight={isSelected ? 'bold' : 'normal'}>
                        {option}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="text" 
            color="inherit" 
            startIcon={<Refresh />} 
            onClick={resetQuiz}
          >
            Reiniciar
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            endIcon={currentQuestionIndex === questions.length - 1 ? <EmojiEvents /> : <NavigateNext />}
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: 3 }}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Box>

        <ScoreModal 
          open={isGameOver}
          score={score}
          gameId="quiz"
          onClose={resetQuiz}
          onSaveSuccess={handleSaveSuccess}
        />

      </Paper>
    </Box>
  );
};

export default QuizGame;