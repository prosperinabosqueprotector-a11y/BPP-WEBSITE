import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
const GalleryPage = ({ theme }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleDelete = async (publicId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/cloudinary/delete/${publicId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to delete image');
      setImages((prevImages) =>
        prevImages.filter((img) => img.public_id !== publicId)
      );
      setDeleteDialog(false);
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Error deleting image: ' + error.message);
    }
  };
  const handleImageError = (e, imageId) => {
    console.error(`Failed to load image ${imageId}:`, e);
    e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
  };

  // --- Cargar media ---
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/cloudinary/images/upload`
        );
        const data = await response.json();
        console.log('Received images:', data);
        setImages(data.images || []);
      } catch (error) {
        console.error('Gallery Error:', error);
        setError('Could not load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.primary.main }}
      >
        Galería ({images.length})
      </Typography>
      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.public_id}>
            <Card
              sx={{
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                transition: theme.transitions.create([
                  'transform',
                  'box-shadow',
                ]),
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <IconButton
                onClick={() => {
                  setSelectedImage(image);
                  setDeleteDialog(true);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
              <CardMedia
                component="img"
                height="200"
                image={image.url || image.secure_url}
                alt={image.public_id}
                onError={(e) => handleImageError(e, image.public_id)}
                sx={{
                  objectFit: 'cover',
                  backgroundColor: theme.palette.grey[100],
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar esta imagen?
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

GalleryPage.propTypes = { theme: PropTypes.object.isRequired };

export default GalleryPage;