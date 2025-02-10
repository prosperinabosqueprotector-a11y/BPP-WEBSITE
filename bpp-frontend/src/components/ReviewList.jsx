import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Rating,
} from '@mui/material';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        'https://bpp-website.onrender.com/api/reviews/all'
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Error al obtener reseñas');
      }

      setReviews(data.filter((review) => review.approved)); // Mostrar solo aprobadas
      setLoading(false);
    } catch (error) {
      console.error('❌ Error al obtener reseñas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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
              {review.username}
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
