import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  IconButton,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  Box,
  Container,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
  styled,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";

const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dsaunprcy";

const StyledCard = styled(Card)({
  width: 200,
  position: "relative",
  "&:hover .description": {
    maxHeight: "100px",
    opacity: 1,
  },
});

const DescriptionOverlay = styled(Box)({
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  padding: "8px",
  opacity: 0,
  maxHeight: "0",
  overflow: "hidden",
  transition: "all 0.3s ease",
  fontSize: "0.875rem",
  textAlign: "center",
});

const Fauna = () => {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Formulario de subida
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Para profesores: imágenes pendientes
  const [pendingImages, setPendingImages] = useState([]);

  // Detectar usuario y rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol;
          setRole(userRole);
        } catch (err) {
          console.error("Error obteniendo claims:", err);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Obtener lista de animales desde API
  const fetchAnimals = async () => {
    try {
      const response = await fetch(
        "https://bpp-website.onrender.com/api/data/fauna"
      );
      const data = await response.json();
      setAnimals(data);
      setCategories([...new Set(data.map((item) => item.category))]);
    } catch (err) {
      console.error("Error obteniendo fauna:", err);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // Profesores: escuchar cambios en Firestore
  useEffect(() => {
    if (role === "profesor") {
      const q = query(collection(db, "imagenesPendientes"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPendingImages(items);
      });
      return () => unsubscribe();
    }
  }, [role]);

  // Subir imagen
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (!role) {
      setError("Debes iniciar sesión para subir archivos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Subir a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const folder = role === "profesor" ? "upload" : "pendientes";
      formData.append("folder", folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadData = await uploadResponse.json();
      const animalData = {
        name,
        category,
        description,
        image: uploadData.url, // URL de la imagen de Cloudinary
      };

      // Estudiante → guardar metadata en Firestore
      if (role === "estudiante") {
        const user = auth.currentUser;
        const now = new Date();
        await addDoc(collection(db, "imagenesPendientes"), {
          archivo: uploadData.secure_url,
          public_id: uploadData.public_id,
          explorador: user.displayName || "Anónimo",
          avatar: user.photoURL || "https://i.pravatar.cc/100",
          correo: user.email,
          fecha: now.toLocaleDateString("es-EC"),
          hora: now.toLocaleTimeString("es-EC"),
          createdAt: serverTimestamp(),
          name,
          category,
          description,
        });
      } else if (role === "profesor") {
        const dbResponse = await fetch(
          "https://bpp-website.onrender.com/api/data/fauna/add", // Nuevo endpoint
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(animalData),
          }
        );

        if (!dbResponse.ok) throw new Error("Failed to add animal to database");
      }

      // Limpiar formulario
      setFile(null);
      setPreview(null);
      setName("");
      setCategory("");
      setDescription("");
      setShowSuccess(true);

      // Refrescar lista de animales
      fetchAnimals();
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
        Enciclopedia de Fauna
      </Typography>

      {/* Selector de categorías */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ width: "50%" }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat}
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
        <TextField select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="Reptiles">Reptiles</MenuItem>
          <MenuItem value="Aves">Aves</MenuItem>
          <MenuItem value="Anfibios">Anfibios e Insectos</MenuItem>
          <MenuItem value="Mamíferos">Mamíferos</MenuItem>
        </TextField>
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

      {/* Mensajes de error / éxito */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message={role === "estudiante" ? "Imagen enviada para revisión" : "Imagen subida exitosamente"}
      />

      {/* Lista de animales */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={4}>
          {animals
            .filter((a) => !selectedCategory || a.category === selectedCategory)
            .map((animal, index) => (
              <StyledCard key={index}>
                <CardMedia component="img" height="140" image={animal.image} alt={animal.name} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    {animal.name}
                  </Typography>
                </CardContent>
                <DescriptionOverlay className="description">
                  {animal.description}
                </DescriptionOverlay>
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
              </StyledCard>
            ))}
        </Box>
      )}

      {/* Profesores: tabla de pendientes */}
      {role === "profesor" && pendingImages.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Imágenes pendientes de aprobación
          </Typography>
          {pendingImages.map((item) => (
            <Card key={item.id} sx={{ mb: 2, p: 2 }}>
              <CardMedia component="img" height="140" image={item.archivo} alt={item.name} />
              <CardContent>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2">{item.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
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
    </Container>
  );
};

export default Fauna;