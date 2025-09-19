import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Button,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  Box,
  Container,
  CircularProgress,
  TextField
} from '@mui/material';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dbiarx9tr";

const Flora = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // ⚡️ Reutilizable: carga la lista de plantas
  const fetchPlants = async () => {
    try {
      const response = await fetch(
        'https://bpp-website.onrender.com/api/data/flora'
      );
      const data = await response.json();
      setPlants(data);
      setCategories([...new Set(data.map((item) => item.category))]);
    } catch (error) {
      console.error('❌ Error al obtener flora:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Carga inicial
  useEffect(() => {
    fetchPlants();
  }, []);

  // 📤 Subir imagen
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const uploadData = await uploadResponse.json();
      console.log("✅ Imagen subida:", uploadData.secure_url);

      // ⚡️ Recargar datos después de la subida
      await fetchPlants();

      // Resetear estado
      setFile(null);
      setPreview(null);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
      >
        Enciclopedia de Flora
      </Typography>

      {/* Selector de categorías */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ width: '50%' }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Formulario de subida */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile));
            }
          }}
        />
        {preview && (
          <Box mb={2}>
            <CardMedia
              component="img"
              image={preview}
              alt="Preview"
              sx={{ maxHeight: 200, width: "auto", borderRadius: 1 }}
            />
          </Box>
        )}
        <TextField
          label="Nombre del animal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        >
          {loading ? "Subiendo..." : "Subir Imagen"}
        </Button>
      </form>

      {/* Lista de plantas */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={4}>
          {plants
            .filter((p) => !selectedCategory || p.category === selectedCategory)
            .map((plant, index) => (
              <Card key={index} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={plant.image}
                  alt={plant.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {plant.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default Flora;