import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Rating,
} from '@mui/material';

const dummyReviews = [
  {
    id: 1,
    user: 'Juan Pérez',
    rating: 5,
    comment: '¡Me encantó! Muy educativo.',
  },
  {
    id: 2,
    user: 'María González',
    rating: 4,
    comment: 'Buen juego, pero podría mejorar.',
  },
  {
    id: 3,
    user: 'Carlos Sánchez',
    rating: 5,
    comment: 'Excelente para los niños.',
  },
];

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de reseñas aprobadas
    setTimeout(() => {
      setReviews(dummyReviews);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
      >
        Reseñas de los Usuarios
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        reviews.map((review) => (
          <Paper key={review.id} sx={{ padding: 2, mb: 2, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {review.user}
            </Typography>
            <Rating value={review.rating} readOnly />
            <Typography variant="body1">{review.comment}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ReviewList;
