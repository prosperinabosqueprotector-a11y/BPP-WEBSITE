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
  const [setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    fetchQuestions();
    fetchTopScores();
  }, []);

  // 📌 Obtener preguntas desde Firebase
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/quiz/all');
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error('Error: Respuesta inesperada del servidor:', data);
      }
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
    }
  };

  // 📌 Obtener el Top 5 de puntuaciones
  const fetchTopScores = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/scores/top');
      const data = await response.json();
      console.log('Puntuaciones recibidas:', data);

      if (Array.isArray(data)) {
        setTopScores(data);
      } else {
        console.error('Error: La API no devolvió un array:', data);
        setTopScores([]);
      }
    } catch (error) {
      console.error('Error al obtener puntuaciones:', error);
      setTopScores([]); // Evita el error de .map
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex]?.correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 10);
    }
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) {
      alert('Debes seleccionar una respuesta antes de continuar.');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer('');
      setIsAnswerCorrect(null);
    } else {
      alert(`🎉 ¡Fin del Quiz! Tu puntaje final es: ${score} 🎯`);
      await saveScore(score); // 🔥 Ahora se envía el puntaje a Firebase
      fetchTopScores(); // Refrescar el top 5 después de guardar
      resetQuiz();
    }
  };

  // 📌 Guardar puntuación en Firebase correctamente
  const saveScore = async (finalScore) => {
    const userName = prompt('Ingresa tu nombre para guardar tu puntaje:');
    if (!userName) return;

    const newScore = {
      user: userName,
      score: finalScore,
      timestamp: new Date().toISOString(), // 🕒 Para ordenarlo por fecha
    };

    try {
      const response = await fetch('http://localhost:3000/api/scores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScore),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al guardar puntuación:', errorText);
        return;
      }

      console.log('✅ Puntuación guardada exitosamente en Firebase.');
    } catch (error) {
      console.error('Error al guardar la puntuación:', error);
    }
  };

  // 🔄 Función para reiniciar el quiz automáticamente
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsAnswerCorrect(null);
    setScore(0);
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
        value={((currentQuestionIndex + 1) / questions.length) * 100}
        sx={{
          height: 8,
          borderRadius: 5,
          mb: 3,
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#2E7D32',
          },
        }}
      />

      {questions.length > 0 ? (
        <>
          <Typography variant="h6">
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
              />
            ))}
          </RadioGroup>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">🏆 Puntos: {score}</Typography>
          </Box>

          {/* Botón para avanzar manualmente */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleNextQuestion}
            disabled={!selectedAnswer} // 🔒 Desactivado hasta seleccionar respuesta
          >
            Siguiente Pregunta ➡️
          </Button>
        </>
      ) : (
        <Typography>Cargando preguntas...</Typography>
      )}

      {/* 📌 TOP 5 PUNTUACIONES */}
      <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
        🏅 Top 5 Puntuaciones
      </Typography>
      {topScores.length > 0 ? (
        topScores.map((score, index) => (
          <Typography key={index}>
            {index + 1}. {score.user}: {score.score} pts
          </Typography>
        ))
      ) : (
        <Typography>No hay puntuaciones registradas aún.</Typography>
      )}

      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 3 }}
        onClick={resetQuiz}
      >
        🔄 Reiniciar Quiz
      </Button>
    </Paper>
  );
};

export default QuizGame;
