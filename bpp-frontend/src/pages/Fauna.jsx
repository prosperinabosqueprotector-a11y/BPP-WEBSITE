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

// Configuración de Cloudinary
const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dsaunprcy";

// Colecciones de Firestore
const FAUNA_COLLECTION = "faunaAprobada";
const PENDING_COLLECTION = "imagenesPendientes";

// Variable de entorno para la URL de tu Backend (necesario para borrar de Cloudinary)
const API_URL = "https://bpp-website-1.onrender.com";

// --- Estilos ---
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
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
});

// --- Componente Principal ---
const Fauna = () => {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Formulario de subida
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Imágenes pendientes
  const [pendingImages, setPendingImages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- EFECTOS DE FIREBASE ---

  // 1. Detectar usuario y rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol;
          setRole(userRole);
        } catch (err) {
          setRole('estudiante');
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Obtener lista de fauna principal (desde Firestore)
  useEffect(() => {
    const q = query(collection(db, FAUNA_COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnimals(items);
      setCategories([...new Set(items.map((item) => item.category))]);
      setLoading(false);
    }, (err) => {
      console.error("Error obteniendo fauna de Firestore:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Profesores: escuchar imágenes pendientes
  useEffect(() => {
    if (role === "profesor") {
      const q = query(collection(db, PENDING_COLLECTION), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPendingImages(items);
      });
      return () => unsubscribe();
    }
  }, [role]);

  // --- LÓGICA DE SUBIDA Y GESTIÓN ---

  // Subir imagen
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !name || !category || !description) return;
    if (!role) {
      setError("Debes iniciar sesión para subir archivos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Subir a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Define la carpeta
      const folderPath = role === "profesor" ? "upload/fauna" : "pendientes/fauna";
      formData.append("folder", folderPath);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      if (!uploadResponse.ok) throw new Error("Fallo la subida a Cloudinary");
      const uploadData = await uploadResponse.json();

      const animalData = {
        name,
        category,
        description,
        image: uploadData.secure_url, // URL de Cloudinary
        public_id: uploadData.public_id, // Necesario para eliminar de Cloudinary
        createdAt: serverTimestamp(),
      };

      // 2. Guardar metadata en Firestore
      if (role === "estudiante") {
        const user = auth.currentUser;
        await addDoc(collection(db, PENDING_COLLECTION), {
          ...animalData,
          explorador: user.displayName || "Anónimo",
          correo: user.email,
        });
      } else if (role === "profesor") {
        // Profesor → Guarda directamente en la colección aprobada
        await addDoc(collection(db, FAUNA_COLLECTION), animalData);
      }

      // 3. Limpiar y notificar
      setFile(null);
      setPreview(null);
      setName("");
      setCategory("");
      setDescription("");
      setShowSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para aprobar un pendiente (mueve de Pendientes a Aprobados)
  const handleApprove = async (item) => {
    setLoading(true);
    try {
      // 1. Añadir a la colección principal (usando 'image' y 'public_id')
      const approvedData = {
        name: item.name,
        category: item.category,
        description: item.description,
        image: item.image,
        public_id: item.public_id,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, FAUNA_COLLECTION), approvedData);

      // 2. Eliminar de la colección pendiente
      await deleteDoc(doc(db, PENDING_COLLECTION, item.id));

      setShowSuccess(true);
    } catch (error) {
      console.error('Error al aprobar:', error);
      setError('Error al aprobar la imagen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN DE ELIMINACIÓN CORREGIDA
  const handleDelete = async () => {
    if (!selectedItem) return;

    // 1. Identificar la colección a eliminar
    // Si selectedItem tiene una URL o public_id, es un item subido
    const collectionRef = pendingImages.some(item => item.id === selectedItem.id)
      ? PENDING_COLLECTION
      : FAUNA_COLLECTION;

    setLoading(true);
    try {
      const publicId = selectedItem.public_id;

      // 2. Borrar el archivo de Cloudinary (si existe un public_id)
      if (publicId) {
        const deleteResponse = await fetch(`${API_URL}/api/cloudinary/delete/${publicId}`, {
          method: 'DELETE'
        });

        if (!deleteResponse.ok) {
          // No lanzamos error fatal, solo advertimos si Cloudinary falla
          console.warn("Fallo al borrar de Cloudinary. El registro de Firestore será borrado.");
        }
      }

      // 3. Borrar de Firestore (Aprobado o Pendiente)
      await deleteDoc(doc(db, collectionRef, selectedItem.id));

      setDeleteDialog(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar el item. Revisa la conexión con tu backend y los permisos de Firestore.');
    } finally {
      setLoading(false);
      setSelectedItem(null);
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
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contribuir a la Enciclopedia ({role === 'profesor' ? 'Aprobación Directa' : 'Revisión Necesaria'})
        </Typography>
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
            disabled={!file || loading || !role}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          >
            {loading ? "Subiendo..." : "Subir Imagen"}
          </Button>
        </form>
      </Card>


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
            .map((animal) => (
              <StyledCard key={animal.id}>
                <CardMedia component="img" height="140" image={animal.image} alt={animal.name} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    {animal.name}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" textAlign="center">
                    {animal.category}
                  </Typography>
                </CardContent>
                <DescriptionOverlay className="description">
                  {animal.description}
                </DescriptionOverlay>
                {/* Botón de eliminar (Solo Profesor) */}
                {role === "profesor" && (
                  <IconButton
                    onClick={() => {
                      setSelectedItem(animal);
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
            <Card key={item.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CardMedia component="img" height="100" sx={{ width: 100 }} image={item.image} alt={item.name} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name} ({item.category})</Typography>
                <Typography variant="body2">{item.description}</Typography>
                <Typography variant="caption" color="text.secondary">Por: {item.explorador}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" color="success" onClick={() => handleApprove(item)}>Aprobar</Button>
                <Button variant="outlined" color="error" onClick={() => { setSelectedItem(item); setDeleteDialog(true); }}>Rechazar</Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Diálogo de eliminación/rechazo */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Operación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar este item? Se borrará de la lista y, si es posible, de Cloudinary.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Fauna;