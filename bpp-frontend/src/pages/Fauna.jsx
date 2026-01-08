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
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";

// --- CONFIGURACIÓN ---
const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dsaunprcy";
const FAUNA_COLLECTION = "faunaAprobada";
const PENDING_COLLECTION = "imagenesPendientes";
const API_URL = "https://bpp-website-1.onrender.com";

// --- ESTILOS ---
const StyledCard = styled(Card)({
  width: 200,
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  "&:hover .description": {
    maxHeight: "60px",
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
  fontSize: "0.75rem",
  textAlign: "center",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
});

const Fauna = () => {
  // --- ESTADOS ---
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados para el Popup de Detalles
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingAnimal, setViewingAnimal] = useState(null);

  // Formulario y Gestión
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pendingImages, setPendingImages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- LÓGICA DE FORMATEO (LISTAS) ---
  const renderFormattedDescription = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length > 1) {
      return (
        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          {lines.map((line, index) => (
            <ListItem key={index} sx={{ display: 'list-item', p: 0, mb: 1 }}>
              <ListItemText 
                primary={line.trim()} 
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} 
              />
            </ListItem>
          ))}
        </List>
      );
    }
    return <Typography variant="body2" color="text.secondary">{text}</Typography>;
  };

  // --- EFECTOS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.rol || 'estudiante');
        } catch (err) { setRole('estudiante'); }
      } else { setRole(null); }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, FAUNA_COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnimals(items);
      setCategories([...new Set(items.map((item) => item.category))]);
      setLoading(false);
    }, (err) => setLoading(false));
    return () => unsubscribe();
  }, []);

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

  // --- HANDLERS ---
  const handleOpenDetail = (animal) => {
    setViewingAnimal(animal);
    setDetailOpen(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !name || !category || !description) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", role === "profesor" ? "upload/fauna" : "pendientes/fauna");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const uploadData = await res.json();

      const animalData = {
        name, category, description,
        image: uploadData.secure_url,
        public_id: uploadData.public_id,
        createdAt: serverTimestamp(),
      };

      if (role === "estudiante") {
        await addDoc(collection(db, PENDING_COLLECTION), { ...animalData, explorador: auth.currentUser.displayName || "Anónimo", correo: auth.currentUser.email });
      } else {
        await addDoc(collection(db, FAUNA_COLLECTION), animalData);
      }
      setFile(null); setPreview(null); setName(""); setDescription("");
      setShowSuccess(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleApprove = async (item) => {
    setLoading(true);
    try {
      await addDoc(collection(db, FAUNA_COLLECTION), {
        name: item.name, category: item.category, description: item.description,
        image: item.image, public_id: item.public_id, createdAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, PENDING_COLLECTION, item.id));
      setShowSuccess(true);
    } catch (error) { setError(error.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      if (selectedItem.public_id) {
        await fetch(`${API_URL}/api/cloudinary/delete/${selectedItem.public_id}`, { method: 'DELETE' });
      }
      const isPending = pendingImages.some(item => item.id === selectedItem.id);
      await deleteDoc(doc(db, isPending ? PENDING_COLLECTION : FAUNA_COLLECTION, selectedItem.id));
      setDeleteDialog(false); setShowSuccess(true);
    } catch (error) { setError("Error al eliminar"); }
    finally { setLoading(false); setSelectedItem(null); }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
        Enciclopedia de Fauna
      </Typography>

      {/* Selector de categorías */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ width: "50%" }}>
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((cat, i) => <MenuItem key={i} value={cat}>{cat}</MenuItem>)}
        </Select>
      </Box>

      {/* Formulario de subida */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Contribuir</Typography>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={(e) => {
            if (e.target.files[0]) {
              setFile(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }
          }} />
          {preview && <CardMedia component="img" image={preview} sx={{ maxHeight: 200, mt: 2, mb: 2, width: "auto" }} />}
          <TextField label="Nombre del animal" value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
          <TextField select label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} required fullWidth sx={{ mb: 2 }}>
            <MenuItem value="Invertebrados">Invertebrados</MenuItem>
            <MenuItem value="Reptiles">Reptiles</MenuItem>
            <MenuItem value="Aves">Aves</MenuItem>
            <MenuItem value="Anfibios">Anfibios e Insectos</MenuItem>
            <MenuItem value="Mamíferos">Mamíferos</MenuItem>
          </TextField>
          <TextField label="Descripción (Usa saltos de línea para listas)" value={description} onChange={(e) => setDescription(e.target.value)} required multiline rows={3} fullWidth sx={{ mb: 2 }} />
          <Button variant="contained" type="submit" disabled={loading || !role} startIcon={<CloudUploadIcon />}>
            {loading ? "Subiendo..." : "Subir Imagen"}
          </Button>
        </form>
      </Card>

      {/* Grid de Animales */}
      {loading && animals.length === 0 ? <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={4}>
          {animals
            .filter((a) => !selectedCategory || a.category === selectedCategory)
            .map((animal) => (
              <StyledCard key={animal.id} onClick={() => handleOpenDetail(animal)}>
                <CardMedia component="img" height="140" image={animal.image} alt={animal.name} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>{animal.name}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary" textAlign="center">{animal.category}</Typography>
                  <DescriptionOverlay className="description">Clic para ver detalles</DescriptionOverlay>
                </CardContent>
                {role === "profesor" && (
                  <IconButton
                    onClick={(e) => { 
                      e.stopPropagation(); // Evita abrir el popup
                      setSelectedItem(animal); 
                      setDeleteDialog(true); 
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(255,0,0,0.7)' }, zIndex: 2 }}
                  >
                    <DeleteIcon sx={{ color: 'white', fontSize: 18 }} />
                  </IconButton>
                )}
              </StyledCard>
            ))}
        </Box>
      )}

      {/* --- POPUP DE DETALLES --- */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {viewingAnimal && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {viewingAnimal.name}
              <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: 'white', px: 1, borderRadius: 1 }}>
                {viewingAnimal.category}
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <CardMedia component="img" image={viewingAnimal.image} sx={{ borderRadius: 2, mb: 3, maxHeight: 400, objectFit: 'contain', bgcolor: '#f5f5f5' }} />
              <Typography variant="h6" gutterBottom>Información del Animal</Typography>
              {renderFormattedDescription(viewingAnimal.description)}
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)} variant="contained" color="secondary">Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Profesores: Imágenes pendientes */}
      {role === "profesor" && pendingImages.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>Pendientes de aprobación</Typography>
          {pendingImages.map((item) => (
            <Card key={item.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CardMedia component="img" height="100" sx={{ width: 100, borderRadius: 1 }} image={item.image} alt={item.name} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.name} ({item.category})</Typography>
                <Typography variant="caption" color="text.secondary">Por: {item.explorador}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="success" onClick={() => handleApprove(item)}>Aprobar</Button>
                <Button variant="outlined" color="error" onClick={() => { setSelectedItem(item); setDeleteDialog(true); }}>Rechazar</Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Diálogo de eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Seguro que deseas borrar este registro?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={() => setShowSuccess(false)} message="Éxito ✅" />
    </Container>
  );
};

export default Fauna;