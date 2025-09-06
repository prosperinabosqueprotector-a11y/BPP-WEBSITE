import { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home({ theme }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newVideo, setNewVideo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // 🔹 Verificar sesión y rol del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol || "estudiante";
          setRole(userRole);
        } catch (error) {
          console.error("Error obteniendo claims:", error);
          setRole("estudiante");
        }
      } else {
        setRole(null); // visitante
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Traer videos desde Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Convertir URL normal a formato embed
  const convertToEmbedUrl = (url) => {
    try {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleOpenDialog = () => {
    setNewVideo("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveVideo = async () => {
    const embedUrl = convertToEmbedUrl(newVideo);
    if (!embedUrl) {
      alert("Por favor ingresa una URL válida de YouTube.");
      return;
    }

    try {
      await addDoc(collection(db, "videos"), {
        url: embedUrl,
        createdAt: serverTimestamp(),
        addedBy: auth.currentUser?.email || "desconocido",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error guardando video:", error);
      alert("Ocurrió un error al guardar el video.");
    }
  };

  // 🔹 Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "videos", videoToDelete));
      setConfirmOpen(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error("Error eliminando video:", error);
      alert("No se pudo eliminar el video.");
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box
      className="flex flex-col min-h-full"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M0 0h20L0 20z\'/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, flexGrow: 1, py: 4 }}
      >
        <Box mb={8} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Typography
            variant="h2"
            className="mb-4 text-center font-bold"
            color="primary"
            sx={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              fontWeight: 800,
            }}
          >
            ¡Explora y Aprende!
          </Typography>
          <Typography
            variant="h5"
            className="text-center"
            color="textSecondary"
            sx={{ fontWeight: 500 }}
          >
            Mira los videos y aprende más sobre la flora y fauna del bosque.
          </Typography>
        </Box>

        {/* 🔹 Botón de agregar video arriba a la izquierda (solo profesor) */}
        {role === "profesor" && (
          <Box mb={4}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenDialog}
            >
              Agregar Video
            </Button>
          </Box>
        )}

        {/* 🔹 Grid de videos */}
        <Box
          className={
            role === "profesor"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              : "grid grid-cols-1 gap-8 md:gap-10 max-w-4/5 mx-auto h-1/2"
          }
          sx={{
            "& > div": {
              position: "relative",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: role === "profesor" ? "translateY(-10px)" : "none",
                boxShadow:
                  role === "profesor" ? "0 10px 20px rgba(0,0,0,0.1)" : "none",
              },
            },
          }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              style={{ textAlign: "center" }}
              className="video-container"
            >
              {/* Botón eliminar solo para profesor */}
              {role === "profesor" && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setVideoToDelete(video.id);
                    setConfirmOpen(true);
                  }}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <Delete />
                </IconButton>
              )}
              <iframe
                width="100%"
                height="300"
                src={video.url}
                title={`YouTube Video ${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Subido por: {video.addedBy}
              </Typography>
            </div>
          ))}
        </Box>
      </Container>

      {/* 🔹 Dialog para agregar video */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar nuevo video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL del video"
            type="url"
            fullWidth
            variant="outlined"
            value={newVideo}
            onChange={(e) => setNewVideo(e.target.value)}
            placeholder="Ej: https://www.youtube.com/watch?v=abc123"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancelar
          </Button>
          <Button onClick={handleSaveVideo} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Dialog elegante para confirmar eliminación */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Eliminar video</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de que deseas eliminar este video? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
