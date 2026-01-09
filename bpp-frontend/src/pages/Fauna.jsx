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
  Divider,
  Stack // Importamos Stack para agrupar botones
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
// 1. IMPORTAR ICONO EDITAR
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
// 2. IMPORTAR updateDoc
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";

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
  // --- ESTADOS PRINCIPALES ---
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Popup Detalles
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingAnimal, setViewingAnimal] = useState(null);

  // Formulario Subida
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pendingImages, setPendingImages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 3. NUEVOS ESTADOS PARA EDICIÓN ---
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  // Estados temporales formulario edición
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);


  // --- LÓGICA FORMATEO ---
  const renderFormattedDescription = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 1) {
      return (
        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          {lines.map((line, index) => (
            <ListItem key={index} sx={{ display: 'list-item', p: 0, mb: 1 }}>
              <ListItemText primary={line.trim()} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
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

  // --- HANDLERS BÁSICOS ---
  const handleOpenDetail = (animal) => {
    setViewingAnimal(animal);
    setDetailOpen(true);
  };

   // --- 4. HANDLERS PARA EDICIÓN ---
  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditPreview(item.image);
    setEditFile(null);
    setEditDialogOpen(true);
  };

  // Lógica principal de guardado de edición
  const handleEditSubmit = async () => {
    if (!itemToEdit) return;
    setLoading(true);
    setError(null);

    try {
      let imageUrl = itemToEdit.image;
      let publicId = itemToEdit.public_id;

      // ESCENARIO 1: Nueva imagen seleccionada
      if (editFile) {
        const formData = new FormData();
        formData.append("file", editFile);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "upload/fauna"); // Carpeta de fauna

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Error subiendo nueva imagen");
        const uploadData = await res.json();
        
        imageUrl = uploadData.secure_url;
        publicId = uploadData.public_id;

        // Intentar borrar imagen vieja
        if (itemToEdit.public_id) {
           try {
             await fetch(`${API_URL}/api/cloudinary/delete/${itemToEdit.public_id}`, { method: 'DELETE' });
           } catch (e) { console.warn("No se pudo borrar la imagen antigua:", e); }
        }
      }
      // ESCENARIO 2: Se mantiene la imagen vieja (imageUrl y publicId no cambian)

      // Actualizar Firestore
      const docRef = doc(db, FAUNA_COLLECTION, itemToEdit.id);
      await updateDoc(docRef, {
        name: editName,
        category: editCategory,
        description: editDescription,
        image: imageUrl,
        public_id: publicId,
        updatedAt: serverTimestamp()
      });

      setEditDialogOpen(false);
      setShowSuccess(true);

    } catch (err) {
      console.error("Error editando:", err);
      setError("Fallo al guardar: " + err.message);
    } finally {
      setLoading(false);
      setItemToEdit(null);
    }
  };


  // --- Handlers Subida y Borrado (Existentes) ---
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
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>Enciclopedia de Fauna</Typography>

      {/* Selector Categorías */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ width: "50%" }}>
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((cat, i) => <MenuItem key={i} value={cat}>{cat}</MenuItem>)}
        </Select>
      </Box>

      {/* Formulario Subida */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Contribuir</Typography>
        <form onSubmit={handleUpload}>
           {/* Inputs igual que antes */}
           <input type="file" accept="image/*" onChange={(e) => { if (e.target.files[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}} />
           {preview && <CardMedia component="img" image={preview} sx={{ maxHeight: 200, mt: 2, mb: 2, width: "auto" }} />}
           <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
           <TextField select label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} required fullWidth sx={{ mb: 2 }}>
             <MenuItem value="Reptiles">Reptiles</MenuItem>
             <MenuItem value="Aves">Aves</MenuItem>
             <MenuItem value="Anfibios">Anfibios e Insectos</MenuItem>
             <MenuItem value="Mamíferos">Mamíferos</MenuItem>
           </TextField>
           <TextField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required multiline rows={3} fullWidth sx={{ mb: 2 }} />
           <Button variant="contained" type="submit" disabled={loading || !role} startIcon={<CloudUploadIcon />}>Subir</Button>
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
                  <DescriptionOverlay className="description">Clic para detalles</DescriptionOverlay>
                </CardContent>
                
                 {/* --- 5. BOTONES DE ACCIÓN (SOLO PROFESOR) --- */}
                 {role === "profesor" && (
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                    {/* Botón Editar */}
                    <IconButton
                      size="small"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleOpenEdit(animal); 
                      }}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } }}
                    >
                      <EditIcon color="primary" fontSize="small" />
                    </IconButton>
                    {/* Botón Eliminar */}
                    <IconButton
                      size="small"
                      onClick={(e) => { 
                        e.stopPropagation();
                        setSelectedItem(animal); setDeleteDialog(true); 
                      }}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.7)' } }}
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </StyledCard>
            ))}
        </Box>
      )}

      {/* Popup Detalles */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {viewingAnimal && (
          <>
             <DialogTitle sx={{ fontWeight: 'bold' }}>{viewingAnimal.name}</DialogTitle>
             <DialogContent>
               <CardMedia component="img" image={viewingAnimal.image} sx={{ borderRadius: 2, mb: 2, maxHeight: 400, objectFit: 'contain' }} />
               {renderFormattedDescription(viewingAnimal.description)}
             </DialogContent>
             <DialogActions><Button onClick={() => setDetailOpen(false)}>Cerrar</Button></DialogActions>
          </>
        )}
      </Dialog>

      {/* --- 6. NUEVO DIÁLOGO DE EDICIÓN --- */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Animal</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Cambiar Imagen (Opcional):</Typography>
            <input type="file" accept="image/*" onChange={(e) => {
              if (e.target.files[0]) {
                setEditFile(e.target.files[0]);
                setEditPreview(URL.createObjectURL(e.target.files[0]));
              }
            }} />
            {editPreview && <CardMedia component="img" image={editPreview} sx={{ maxHeight: 150, mt: 2, mb: 2, width: "auto", borderRadius: 1 }} />}
            
            <TextField label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth margin="normal" />
            <TextField select label="Categoría" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} fullWidth margin="normal">
               <MenuItem value="Reptiles">Reptiles</MenuItem>
               <MenuItem value="Aves">Aves</MenuItem>
               <MenuItem value="Anfibios">Anfibios e Insectos</MenuItem>
               <MenuItem value="Mamíferos">Mamíferos</MenuItem>
            </TextField>
            <TextField label="Descripción" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} multiline rows={4} fullWidth margin="normal" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo Eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Seguro que deseas borrar?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={() => setShowSuccess(false)} message="Éxito ✅" />

      {/* Pendientes (simplificado) */}
       {role === "profesor" && pendingImages.length > 0 && (
         <Box mt={6}><Typography variant="h5">Pendientes: {pendingImages.length}</Typography>
          {/* ... Lista de pendientes ... */}
         </Box>
       )}

       {/* --- SECCIÓN DE APRENDIZAJE ADICIONAL (AL FINAL) --- */}
      <Box 
        sx={{ 
          mt: 8, 
          p: 4, 
          textAlign: 'center', 
          backgroundColor: '#fff3e0', // Un color naranja muy suave
          borderRadius: 4,
          border: '1px solid #ffe0b2'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#e65100', fontWeight: 'bold' }}>
          ¿Sientes curiosidad por la vida silvestre del Bosque Protector? 🐾
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#5d4037' }}>
          ¡El bosque está lleno de secretos! Haz clic abajo para explorar sobre la fauna del Bosque Protector Prosperina.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="large"
          href="https://www.bosqueprotector.espol.edu.ec/biodiversidad/#tab-5be8e4358178a-flora" // Cambia este link por el que prefieras
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            borderRadius: '20px', 
            px: 4, 
            fontWeight: 'bold',
            boxShadow: '0 4px 14px 0 rgba(255,152,0,0.39)' 
          }}
        >
          Aprender más sobre Animales
        </Button>
      </Box>
    </Container>
  );
};

export default Fauna;