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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const GalleryPage = ({ theme }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('https://bpp-website.onrender.com/api/cloudinary/images');
        const data = await response.json();
        setMediaList(data.images || []);
      } catch (err) {
        console.error('Gallery Error:', err);
        setError('No se pudieron cargar los archivos');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const handleDelete = async (publicId) => {
    try {
      const response = await fetch(
        `https://bpp-website.onrender.com/api/cloudinary/delete/${publicId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) throw new Error('Error al eliminar archivo');
      setMediaList((prev) => prev.filter((item) => item.public_id !== publicId));
      setDeleteDialog(false);
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleMediaError = (e, mediaId) => {
    console.error(`Error al cargar ${mediaId}:`, e);
    e.target.src = 'https://via.placeholder.com/400x200/cccccc/000000?text=No+Disponible';
  };

  const imagesOnly = mediaList.filter((item) => {
    const ext = item.format?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  });

  const videosOnly = mediaList.filter((item) => {
    const ext = item.format?.toLowerCase();
    return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
  });

  const renderMediaGrid = (list) => (
    <Grid container spacing={3}>
      {list.map((media) => (
        <Grid item xs={12} sm={6} md={4} key={media.public_id}>
          <Card
            sx={{
              borderRadius: theme.shape.borderRadius,
              overflow: 'hidden',
              transition: theme.transitions.create(['transform', 'box-shadow']),
              '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[8] },
              position: 'relative'
            }}
          >
            <IconButton
              onClick={() => {
                setSelectedMedia(media);
                setDeleteDialog(true);
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                zIndex: 1
              }}
            >
              <DeleteIcon sx={{ color: 'white' }} />
            </IconButton>

            {['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(media.format?.toLowerCase()) ? (
              <video
                controls
                preload="none"
                //poster="https://via.placeholder.com/800x400/cccccc/000000?text=Vista+previa"
                poster={`https://res.cloudinary.com/dbiarx9tr/video/upload/so_1/${media.public_id}.jpg`}
                style={{ width: '100%', height: 200, objectFit: 'cover', backgroundColor: theme.palette.grey[100] }}
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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><Typography>Cargando...</Typography></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;

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
          <Button onClick={() => handleDelete(selectedMedia?.public_id)} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GalleryPage.propTypes = { theme: PropTypes.object.isRequired };

export default GalleryPage;