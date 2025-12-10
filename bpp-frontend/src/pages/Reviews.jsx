import { Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Reviews = () => {
  const [refresh, setRefresh] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol;
          setRole(userRole);
        } catch (error) {
          console.error("Error obteniendo claims:", error);
        }
      } else {
        setRole(null); // visitante
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Opiniones de los Usuarios ⭐
      </Typography>
      <ReviewForm role={role} onReviewSubmitted={() => setRefresh((prev) => !prev)} />
      <ReviewList role={role} key={refresh} />
    </Container>
  );
};

export default Reviews;