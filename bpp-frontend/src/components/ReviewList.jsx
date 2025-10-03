import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { auth } from "../config/firebaseConfig";

const API_URL = import.meta.env.VITE_API_URL;

const ReviewList = ({ role }) => {
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      // Reseñas aprobadas (visibles para todos)
      const res = await fetch(`${API_URL}/api/reviews?status=approved`);
      if (!res.ok) throw new Error("Error al obtener reseñas aprobadas");
      const approvedData = await res.json();
      setReviews(approvedData);

      // Si es profesor, obtener también las pendientes
      if (role === "profesor") {
        const resPending = await fetch(`${API_URL}/api/reviews?status=pending`);
        if (!resPending.ok) throw new Error("Error al obtener reseñas pendientes");
        const pendingData = await resPending.json();
        setPendingReviews(pendingData);
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Error al obtener reseñas:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [role]);

  const handleApprove = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/reviews/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al aprobar la reseña");
      // Refrescar listas
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/reviews/delete/pending/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al rechazar la reseña");
      // Refrescar listas
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>

      {role === "profesor" && pendingReviews.length > 0 && (
        <>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Reseñas por aprobar
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Comentario</TableCell>
                    <TableCell>Calificación</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user.displayName || "Anónimo"}</TableCell>
                      <TableCell>{review.user.email}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>{new Date(review.date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(review.id)}
                          sx={{ mr: 1 }}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReject(review.id)}
                        >
                          Rechazar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ height: 40 }} />
        </>
      )}

      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Reseñas de los Usuarios
      </Typography>

      {reviews.map((review) => (
        <Paper key={review.id} sx={{ padding: 2, mb: 2, textAlign: "left" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {review.user.displayName || "Anónimo"}
          </Typography>
          <Rating value={review.rating} readOnly />
          <Typography variant="body1">{review.comment}</Typography>
        </Paper>
      ))}

      <Box sx={{ height: 30 }} />

    </Box>
  );
};

export default ReviewList;