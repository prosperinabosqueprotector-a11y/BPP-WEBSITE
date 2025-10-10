import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // ajusta según tu configuración
import {
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const API_URL = import.meta.env.VITE_API_URL;

const GalleryPage = ({ theme }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false); // nuevo estado para detalles
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const response = await fetch(`${API_URL}/api/cloudinary/images`);
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        setError("Error al cargar la galería.");
      }

      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.rol;
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (publicId) => {
    try {
      const response = await fetch(`${API_URL}/api/cloudinary/delete/${publicId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to delete image");
      setImages((prevImages) => prevImages.filter((img) => img.public_id !== publicId));
      setDeleteDialog(false);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting image: " + error.message);
    }
  };

  const imagesOnly = images.filter((item) =>
    ["jpg", "jpeg", "png", "gif", "webp"].includes(item.format?.toLowerCase())
  );
  const videosOnly = images.filter((item) =>
    ["mp4", "mov", "avi", "mkv", "webm"].includes(item.format?.toLowerCase())
  );

  const handlePreview = (media) => {
    setSelectedImage(media);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage(null);
  };

  const renderMediaGrid = (list) => (
    <Grid container spacing={3}>
      {list.map((media) => {
        const isVideo = ["mp4", "mov", "avi", "mkv", "webm"].includes(media.format?.toLowerCase());

        // Generar thumbnail dinámico para videos desde Cloudinary
        const videoThumbnail = isVideo
          ? media.url?.replace("/upload/", "/upload/so_1/").replace(/\.[^/.]+$/, ".jpg")
          : null;

        return (
          <Grid item xs={12} sm={6} md={4} key={media.public_id}>
            <Card
              sx={{
                position: "relative",
                borderRadius: theme.shape.borderRadius,
                overflow: "hidden",
                transition: theme.transitions.create(["transform", "box-shadow"]),
                "&:hover": { transform: "scale(1.05)", boxShadow: theme.shadows[8] },
                cursor: "pointer"
              }}
              onClick={() => handlePreview(media)}
            >
              {/* Botón eliminar (solo profesor) */}
              {role === "profesor" && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(media);
                    setDeleteDialog(true);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    zIndex: 1
                  }}
                >
                  <DeleteIcon sx={{ color: "white" }} />
                </IconButton>
              )}

              {/* Botón ver detalles (solo admin) */}
              {role === "profesor" && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(media);
                    setDetailsDialog(true);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    zIndex: 1
                  }}
                >
                  <InfoIcon sx={{ color: "white" }} />
                </IconButton>
              )}

              {isVideo ? (
                <Box sx={{ position: "relative", width: "100%", height: 200, backgroundColor: "#000" }}>
                  <CardMedia
                    component="img"
                    image={videoThumbnail}
                    alt={media.public_id}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
                  />
                  <PlayCircleOutlineIcon
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 64,
                      color: "white",
                      opacity: 0.9
                    }}
                  />
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  height="200"
                  image={media.url || media.secure_url}
                  alt={media.public_id}
                  sx={{ objectFit: "cover", backgroundColor: theme.palette.grey[100] }}
                />
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
        Galería ({imagesOnly.length + videosOnly.length})
      </Typography>

      {/* Accordion para Imágenes */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Imágenes ({imagesOnly.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderMediaGrid(imagesOnly)}</AccordionDetails>
      </Accordion>

      {/* Accordion para Videos */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Videos ({videosOnly.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderMediaGrid(videosOnly)}</AccordionDetails>
      </Accordion>

      {/* Diálogo de eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>¿Estás seguro que deseas eliminar este archivo?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleDelete(selectedImage?.public_id)} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de previsualización */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "rgba(0,0,0,0.9)",
            boxShadow: "none"
          }
        }}
      >
        <IconButton
          onClick={handleClosePreview}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            cursor: "zoom-out"
          }}
          onClick={handleClosePreview}
        >
          {selectedImage &&
            (["mp4", "mov", "avi", "mkv", "webm"].includes(selectedImage.format?.toLowerCase()) ? (
              <video
                src={selectedImage.url || selectedImage.secure_url}
                controls
                autoPlay
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain"
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={selectedImage.url || selectedImage.secure_url}
                alt={selectedImage.public_id}
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain"
                }}
              />
            ))}
        </DialogContent>
      </Dialog>

      {/* 🔹 Diálogo de detalles para admins */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de la Imagen</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box>
              <Typography>
                <strong>Public ID:</strong> {selectedImage.public_id}
              </Typography>
              <Typography>
                <strong>Formato:</strong> {selectedImage.format}
              </Typography>
              <Typography>
                <strong>Tamaño:</strong> {selectedImage.size} bytes
              </Typography>
              <Typography>
                <strong>Fecha de creación:</strong>{" "}
                {new Date(selectedImage.created_at).toLocaleString()}
              </Typography>
              {selectedImage.url && (
                <Box mt={2}>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.public_id}
                    style={{ width: "100%", borderRadius: 4 }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GalleryPage.propTypes = {
  theme: PropTypes.object.isRequired
};

export default GalleryPage;
