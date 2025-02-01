import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  LinearProgress,
} from '@mui/material';

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔥 Llamar al backend para obtener preguntas
  useEffect(() => {
    fetch('http://localhost:3000/api/quiz/all') // Cambia esto si tu backend está en otro puerto
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener preguntas:', error);
        setLoading(false);
      });
  }, []);

  // 🔄 Manejador para seleccionar respuesta
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex]?.correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 10);
    }
    setTimerActive(false);
  };

  // 🔄 Manejador para pasar a la siguiente pregunta
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer('');
      setIsAnswerCorrect(null);
      setTimer(30);
      setTimerActive(true);
    } else {
      alert(`🎉 ¡Fin del Quiz! Tu puntaje final es: ${score} 🎯`);
      resetQuiz();
    }
  };

  // 🔄 Función para reiniciar el quiz automáticamente
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsAnswerCorrect(null);
    setScore(0);
    setTimer(30);
    setTimerActive(true);
  };

  // 🕓 Manejador del temporizador
  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, timerActive]);

  // 🚀 Mostrar carga mientras obtenemos las preguntas
  if (loading) return <p>Cargando preguntas...</p>;

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        backgroundColor: '#f9fbe7',
        borderRadius: 3,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 'bold', color: '#2E7D32' }}
      >
        🌱 Quiz de Biodiversidad
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(timer / 30) * 100}
        sx={{
          height: 8,
          borderRadius: 5,
          mb: 3,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: timer > 10 ? '#2E7D32' : '#D32F2F',
          },
        }}
      />

      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Typography>

      <Typography variant="h5" sx={{ mb: 3, color: '#37474F' }}>
        {questions[currentQuestionIndex]?.question}
      </Typography>

      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => handleAnswerSelect(e.target.value)}
      >
        {questions[currentQuestionIndex]?.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
            sx={{
              backgroundColor:
                selectedAnswer === option
                  ? isAnswerCorrect
                    ? '#81C784'
                    : '#E57373'
                  : '',
              color: selectedAnswer === option ? '#FFF' : 'inherit',
              p: 2,
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                backgroundColor:
                  selectedAnswer === ''
                    ? '#E0E0E0'
                    : isAnswerCorrect
                    ? '#81C784'
                    : '#E57373',
              },
            }}
          />
        ))}
      </RadioGroup>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">⏳ Tiempo: {timer}s</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleNextQuestion}
          disabled={selectedAnswer === ''}
        >
          Siguiente
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">🏆 Puntos: {score}</Typography>
      </Box>
    </Paper>
  );
};

export default QuizGame;
