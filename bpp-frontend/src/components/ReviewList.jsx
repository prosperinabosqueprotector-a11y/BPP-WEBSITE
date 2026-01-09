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
  IconButton,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth } from "../config/firebaseConfig";

const API_URL = "https://bpp-website-1.onrender.com";

const ReviewList = ({ role }) => {
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Preparamos las promesas
      const promises = [
        fetch(`${API_URL}/api/reviews?status=approved`).then(res => res.json())
      ];

      // Si es profesor, añadimos la petición de pendientes
      if (role === "profesor") {
        promises.push(fetch(`${API_URL}/api/reviews?status=pending`).then(res => res.json()));
      }

      // Ejecutamos en paralelo
      const results = await Promise.all(promises);
      
      // La primera siempre es aprobadas
      const approvedData = Array.isArray(results[0]) ? results[0] : [];
      setReviews(approvedData);

      // Si hubo segunda respuesta, son las pendientes
      if (results[1]) {
        const pendingData = Array.isArray(results[1]) ? results[1] : [];
        setPendingReviews(pendingData);
      }

    } catch (error) {
      console.error("❌ Error al obtener reseñas:", error);
      setErrorMsg("No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [role]);

  // --- HANDLERS (Iguales que antes) ---
  const handleApprove = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/reviews/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al aprobar");
      fetchReviews(); // Recargar tablas
    } catch (err) {
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

      if (!res.ok) throw new Error("Error al rechazar");
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteApproved = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      const token = await user.getIdToken();

      if (!window.confirm("¿Eliminar esta reseña pública?")) return;

      const res = await fetch(`${API_URL}/api/reviews/delete/approved/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar");
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, px: 2 }}>
      
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {/* --- TABLA PENDIENTES (SOLO PROFESOR) --- */}
      {role === "profesor" && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: 'warning.main' }}>
             Reseñas Pendientes ({pendingReviews.length})
          </Typography>

          {pendingReviews.length === 0 ? (
            <Alert severity="info">No hay reseñas esperando aprobación.</Alert>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Usuario</strong></TableCell>
                    <TableCell><strong>Comentario</strong></TableCell>
                    <TableCell><strong>Valoración</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                            {review.user?.displayName || "Anónimo"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {review.user?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        <Rating value={Number(review.rating)} readOnly size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApprove(review.id)}
                            >
                              Aprobar
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleReject(review.id)}
                            >
                              Rechazar
                            </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* --- LISTA PÚBLICA --- */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: 'primary.main' }}>
        Reseñas de la Comunidad
      </Typography>

      {reviews.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9' }}>
            <Typography color="text.secondary">Aún no hay reseñas publicadas. ¡Sé el primero!</Typography>
        </Paper>
      ) : (
        reviews.map((review) => (
          <Paper
            key={review.id}
            elevation={2}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {review.user?.displayName || "Usuario"}
                    </Typography>
                    <Rating value={Number(review.rating)} readOnly size="small" />
                </Box>
                <Typography variant="body1" color="text.primary" sx={{ fontStyle: 'italic' }}>
                    "{review.comment}"
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Publicado el {new Date(review.date).toLocaleDateString()}
                </Typography>
              </Box>

              {role === "profesor" && (
                <IconButton
                  color="error"
                  onClick={() => handleDeleteApproved(review.id)}
                  title="Eliminar reseña"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        ))
      )}
      
      <Box sx={{ height: 50 }} />
    </Box>
  );
};

export default ReviewList;