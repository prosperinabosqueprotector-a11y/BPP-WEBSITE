import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import PropTypes from 'prop-types';

const CLOUDINARY_CONFIG = {
  cloudName: 'dbiarx9tr',
  uploadPreset: 'images',
  folder: 'upload',
};

const GalleryPage = ({ theme }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/list/${CLOUDINARY_CONFIG.folder}.json`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setImages(data.resources || []);
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
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert
          severity="error"
          sx={{ backgroundColor: theme.palette.error.light }}
        >
          {error}
        </Alert>
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
              <CardMedia
                component="img"
                height="200"
                image={image.secure_url}
                alt={image.public_id}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

GalleryPage.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default GalleryPage;
