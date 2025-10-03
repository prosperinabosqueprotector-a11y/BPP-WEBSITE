import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

const GalleryPage = ({ theme }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        setRole(null); // Usuario no autenticado
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (publicId) => {
    try {
      const response = await fetch(
        `https://bpp-website.onrender.com/api/cloudinary/delete/${publicId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to delete image');
      setImages((prevImages) =>
        prevImages.filter((img) => img.public_id !== publicId)
      );
      setDeleteDialog(false);
    } catch (error) {
      console.error('Delete Error:', error);
      // Show error message to user
      alert('Error deleting image: ' + error.message);
    }
  };

  const imagesOnly = images.filter((item) =>
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.format?.toLowerCase())
  );

  const videosOnly = images.filter((item) =>
    ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(item.format?.toLowerCase())
  );
  const renderMediaGrid = (list) => (
    <Grid container spacing={3}>
      {list.map((media) => (
        <Grid item xs={12} sm={6} md={4} key={media.public_id}>
          <Card
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              overflow: 'hidden',
              transition: theme.transitions.create(['transform', 'box-shadow']),
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            {role === "profesor" && (
              <IconButton
                onClick={() => {
                  setSelectedImage(media);
                  setDeleteDialog(true);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  zIndex: 1,
                }}
              >
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            )}

            {['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(media.format?.toLowerCase()) ? (
              <video
                controls
                preload="none"
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  backgroundColor: theme.palette.grey[100],
                }}
                onError={(e) => handleMediaError(e, media.public_id)}
              >
                <source src={media.url || media.secure_url} type="video/mp4" />
                Tu navegador no soporta videos.
              </video>
            ) : (
              <CardMedia
                component="img"
                height="200"
                image={media.url || media.secure_url}
                alt={media.public_id}
                onError={(e) => handleMediaError(e, media.public_id)}
                sx={{ objectFit: 'cover', backgroundColor: theme.palette.grey[100] }}
              />
            )}
          </Card>
        </Grid>
      ))}
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
        <DialogContent>
          ¿Estás seguro que deseas eliminar este archivo?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleDelete(selectedImage?.public_id)} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GalleryPage.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default GalleryPage;