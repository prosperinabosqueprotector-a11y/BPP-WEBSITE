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

const questions = [
  {
    question: '¿Cuál es el ecosistema más biodiverso del planeta?',
    options: ['Desierto', 'Selva Amazónica', 'Tundra', 'Sábana'],
    correctAnswer: 'Selva Amazónica',
  },
  {
    question: '¿Qué es la biodiversidad?',
    options: [
      'La variedad de seres vivos en un lugar',
      'La cantidad de plantas en una región',
      'El número de especies extintas',
      'Un tipo de clima tropical',
    ],
    correctAnswer: 'La variedad de seres vivos en un lugar',
  },
  {
    question: '¿Qué animales son típicos de las Islas Galápagos?',
    options: [
      'Pandas',
      'Pingüinos y tortugas gigantes',
      'Canguros',
      'Leones africanos',
    ],
    correctAnswer: 'Pingüinos y tortugas gigantes',
  },
  {
    question: '¿Qué es la deforestación?',
    options: [
      'Plantar árboles en zonas secas',
      'La tala de árboles a gran escala',
      'Proteger bosques y selvas',
      'Crear parques naturales',
    ],
    correctAnswer: 'La tala de árboles a gran escala',
  },
  {
    question: '¿Cuál es el gas más importante para el efecto invernadero?',
    options: [
      'Dióxido de carbono (CO₂)',
      'Oxígeno (O₂)',
      'Nitrógeno (N₂)',
      'Helio (He)',
    ],
    correctAnswer: 'Dióxido de carbono (CO₂)',
  },
  {
    question: '¿Qué es un área protegida?',
    options: [
      'Una zona con acceso limitado para proteger la naturaleza',
      'Un parque de diversiones',
      'Una ciudad en el desierto',
      'Una fábrica ecológica',
    ],
    correctAnswer: 'Una zona con acceso limitado para proteger la naturaleza',
  },
  {
    question: '¿Qué es la fauna?',
    options: [
      'El conjunto de animales de una región',
      'El tipo de vegetación de un lugar',
      'El clima en un ecosistema',
      'El agua de un río',
    ],
    correctAnswer: 'El conjunto de animales de una región',
  },
  {
    question: '¿Qué significa el término "especie en peligro de extinción"?',
    options: [
      'Una especie que vive en el agua',
      'Una especie que está desapareciendo',
      'Una especie con muchos individuos',
      'Una planta que crece rápido',
    ],
    correctAnswer: 'Una especie que está desapareciendo',
  },
  {
    question: '¿Qué país es conocido por la biodiversidad del Amazonas?',
    options: ['Brasil', 'España', 'Canadá', 'Sudáfrica'],
    correctAnswer: 'Brasil',
  },
  {
    question: '¿Qué recurso natural es más importante para la vida?',
    options: ['Agua', 'Petróleo', 'Hierro', 'Plástico'],
    correctAnswer: 'Agua',
  },
];

const QuizGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, timerActive, handleNextQuestion]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 10);
    }
    setTimerActive(false);
  };

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
        {questions[currentQuestionIndex].question}
      </Typography>

      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => handleAnswerSelect(e.target.value)}
      >
        {questions[currentQuestionIndex].options.map((option, index) => (
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
