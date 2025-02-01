import { Container, Typography } from '@mui/material';
import { useState } from 'react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const Reviews = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Opiniones de los Usuarios ⭐
      </Typography>
      <ReviewForm onReviewSubmitted={() => setRefresh((prev) => !prev)} />
      <ReviewList key={refresh} />
    </Container>
  );
};

export default Reviews;
