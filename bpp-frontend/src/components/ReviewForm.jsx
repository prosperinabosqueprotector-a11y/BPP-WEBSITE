import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { auth } from "../config/firebaseConfig";

const API_URL = "https://bpp-website-1.onrender.com";

const ReviewForm = ({ onReviewSubmitted, role }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // Si no hay rol, asumimos que no está autenticado (el padre lo setea a null cuando no hay sesión)
  const isAuthed = Boolean(role);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!isAuthed || !user) {
      setError("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    if (!comment.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const endpoint =
        role === "profesor"
          ? `${API_URL}/api/reviews/add-approved`
          : `${API_URL}/api/reviews/add-pending`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment,
          rating,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Error al enviar la reseña");

      alert(
        role === "profesor"
          ? "Reseña enviada y aprobada"
          : "Reseña enviada, pendiente de aprobación"
      );

      setRating(5);
      setComment("");
      setError("");
      onReviewSubmitted();
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al enviar reseña.");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 4,
        textAlign: "center",
        mt: 4,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
        Deja tu reseña
      </Typography>

      {!isAuthed && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
          Debes iniciar sesión para dejar una reseña.
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ mr: 1, color: "#555" }}>
          Calificación:
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          readOnly={!isAuthed}            // deshabilitado si no hay sesión
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
        disabled={!isAuthed}              // deshabilitado si no hay sesión
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={!isAuthed}              // botón bloqueado si no hay sesión
        title={!isAuthed ? "Inicia sesión para enviar una reseña" : ""}
      >
        Enviar Reseña
      </Button>
    </Paper>
  );
};

export default ReviewForm;
