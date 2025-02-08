import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CLOUDINARY_UPLOAD_PRESET = 'images';
const CLOUDINARY_CLOUD_NAME = 'dbiarx9tr';

const UploadPage = ({ theme }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      console.log('Upload successful:', data);
      setUploadedUrl(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Subir Imagen
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: theme.spacing(2) }}
        />

        {preview && (
          <Box mb={2}>
            <CardMedia
              component="img"
              image={preview}
              alt="Preview"
              sx={{ maxHeight: 200, width: 'auto', borderRadius: 1 }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={!file || loading}
          startIcon={
            loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
        >
          {loading ? 'Subiendo...' : 'Subir Imagen'}
        </Button>
      </form>

      {uploadedUrl && (
        <Box mt={4}>
          <Alert severity="success">Imagen subida exitosamente!</Alert>
          <CardMedia
            component="img"
            image={uploadedUrl}
            alt="Uploaded"
            sx={{ maxHeight: 200, width: 'auto', mt: 2, borderRadius: 1 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadPage;
