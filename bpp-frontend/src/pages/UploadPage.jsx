import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
  Snackbar,
  Paper,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CLOUDINARY_UPLOAD_PRESET = 'images';
const CLOUDINARY_CLOUD_NAME = 'dbiarx9tr';

const UploadPage = ({ theme }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const uploadData = await uploadResponse.json();

      setUploadedUrl(uploadData.secure_url);
      setShowSuccess(true);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error:', error);
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

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile));
            }
          }}
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
          <Alert severity="success">Imagen subida exitosamente</Alert>
          <CardMedia
            component="img"
            image={uploadedUrl}
            alt="Uploaded"
            sx={{ maxHeight: 200, width: 'auto', mt: 2, borderRadius: 1 }}
          />
          <Paper
            sx={{
              p: 2,
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {uploadedUrl}
            </Typography>
            <IconButton
              onClick={() => handleCopyUrl(uploadedUrl)}
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message="Imagen subida exitosamente"
      />

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="URL copiada al portapapeles"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default UploadPage;
