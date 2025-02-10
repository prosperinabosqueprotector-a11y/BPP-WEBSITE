import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [user, setUser] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.trim() || !comment.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch(
        'https://bpp-website.onrender.com/api/reviews/add',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user,
            rating,
            comment,
            date: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al enviar la reseña');
      }

      alert('Reseña enviada. Pendiente de aprobación.');

      // Resetear el formulario
      setUser('');
      setRating(5);
      setComment('');
      setError('');

      // Actualizar la lista de reseñas
      onReviewSubmitted();
    } catch (error) {
      console.error('❌ Error al enviar la reseña:', error);
      setError('Error al enviar la reseña.');
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        margin: 'auto',
        padding: 4,
        textAlign: 'center',
        mt: 4,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}
      >
        Deja tu reseña
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Tu Nombre"
        fullWidth
        required
        value={user}
        onChange={(e) => setUser(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ mr: 1, color: '#555' }}>
          Calificación:
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
        />
      </Box>
      <TextField
        label="Comentario"
        multiline
        rows={4}
        fullWidth
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<SendIcon />}
        onClick={handleSubmit}
      >
        Enviar Reseña
      </Button>
    </Paper>
  );
};

export default ReviewForm;
