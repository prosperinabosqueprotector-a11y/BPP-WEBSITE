import { Container, Typography } from '@mui/material';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const Reviews = () => {
  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Opiniones de los Usuarios ⭐
      </Typography>
      <ReviewForm />
      <ReviewList />
    </Container>
  );
};

export default Reviews;
