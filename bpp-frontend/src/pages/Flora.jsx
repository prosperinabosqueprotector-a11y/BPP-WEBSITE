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
  TextField,
  Alert,
  Snackbar,
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// 🛑 Asegúrate de que este path sea correcto para tu configuración de Firebase
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";

// --- CONSTANTES ---
const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dbiarx9tr";
// Definiciones de colecciones de Firestore
const FLORA_COLLECTION = "floraAprobada";
const PENDING_COLLECTION = "floraPendiente";

// ❌ Eliminamos API_URL ya que no queremos depender de la API externa

// --- ESTILOS ---
// Puedes agregar estilos más avanzados si los necesitas, como en Fauna.jsx
const StyledCard = styled(Card)({
  width: 200,
  position: "relative",
});

const Flora = () => {
  // --- Estados de la Vista Principal ---
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // 'profesor', 'estudiante', o null
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Para eliminar/aprobar

  // --- Estados del Formulario de Subida ---
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Principales");
  const [description, setDescription] = useState("");

  // --- Estados para Profesores (Pendientes) ---
  const [pendingImages, setPendingImages] = useState([]);

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
          console.error("Error obteniendo claims:", err);
          setRole('estudiante');
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Obtener lista de flora principal (desde Firestore)
  useEffect(() => {
    const q = query(collection(db, FLORA_COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlants(items);
      setCategories([...new Set(items.map((item) => item.category))]);
      setLoading(false);
    }, (err) => {
      console.error("Error obteniendo flora de Firestore:", err);
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


  // 📤 Función: Subir imagen y metadata
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
      // 1. Subir a Cloudinary con la ruta específica 'flora'
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // 💥 RUTA ESPECÍFICA: upload/flora o pendientes/flora
      const folderPath = role === "profesor" ? "upload/flora" : "pendientes/flora";
      formData.append("folder", folderPath);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadResponse.ok) throw new Error("Fallo la subida a Cloudinary");
      const uploadData = await uploadResponse.json();

      const plantData = {
        name,
        category,
        description,
        image: uploadData.secure_url, // URL de la imagen de Cloudinary
        public_id: uploadData.public_id,
        createdAt: serverTimestamp(),
      };

      // 2. Guardar metadata en Firestore
      if (role === "estudiante") {
        const user = auth.currentUser;
        await addDoc(collection(db, PENDING_COLLECTION), {
          ...plantData, // Usa image como 'archivo' en la pendiente
          archivo: uploadData.secure_url,
          explorador: user.displayName || "Anónimo",
          correo: user.email,
        });
      } else if (role === "profesor") {
        // Profesor → agrega directamente a la lista aprobada
        await addDoc(collection(db, FLORA_COLLECTION), plantData);
      }

      // 3. Limpiar y notificar
      setFile(null);
      setPreview(null);
      setName("");
      setCategory("Principales");
      setDescription("");
      setShowSuccess(true);

    } catch (err) {
      console.error("Error en subida:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para aprobar un pendiente (mueve de Pendientes a Aprobados)
  const handleApprove = async (item) => {
    setLoading(true);
    try {
      // 1. Añadir a la colección principal
      const approvedData = {
        name: item.name,
        category: item.category,
        description: item.description,
        image: item.archivo, // Usa 'archivo' de la pendiente
        public_id: item.public_id,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, FLORA_COLLECTION), approvedData);

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

  // Función para eliminar un item (de la lista principal o rechazar pendiente)
  const handleDelete = async () => {
    if (!selectedItem) return;

    const isPending = selectedItem.explorador; // Si tiene 'explorador', es de la cola de pendientes
    const collectionRef = isPending ? PENDING_COLLECTION : FLORA_COLLECTION;

    setLoading(true);
    try {
      // Borrar de Firestore (Aprobado o Pendiente)
      await deleteDoc(doc(db, collectionRef, selectedItem.id));

      setDeleteDialog(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar el item. Revisa los permisos de Firestore.');
    } finally {
      setLoading(false);
      setSelectedItem(null);
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

      {/* --- Selector de categorías --- */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ width: '50%' }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* --- Formulario de subida --- */}
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
                alt="Previsualización"
                sx={{ maxHeight: 200, width: "auto", borderRadius: 1 }}
              />
            </Box>
          )}
          <TextField
            label="Nombre de la planta"
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
            <MenuItem value="Principales">Plantas Principales</MenuItem>
            <MenuItem value="Toxicas">Plantas Tóxicas</MenuItem>
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
            {loading ? (role === 'estudiante' ? "Enviando a revisión..." : "Subiendo...") : "Subir Imagen"}
          </Button>
        </form>
      </Card>

      {/* --- Mensajes de error / éxito --- */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message={
          role === "estudiante"
            ? "Imagen enviada para revisión de Flora. ✅"
            : "Planta subida exitosamente."
        }
      />

      {/* --- Profesores: Imágenes pendientes de aprobación --- */}
      {role === "profesor" && pendingImages.length > 0 && (
        <Box mt={6}>
          <Typography variant="h4" gutterBottom>
            Flora Pendiente de Aprobación ({pendingImages.length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {pendingImages.map((item) => (
              <Card key={item.id} sx={{ width: 300, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.archivo}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.name} ({item.category})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: {item.explorador}
                  </Typography>
                </CardContent>
                <DialogActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <Button
                    size="small"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => handleApprove(item)}
                    disabled={loading}
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setSelectedItem(item);
                      setDeleteDialog(true);
                    }}
                    disabled={loading}
                  >
                    Rechazar
                  </Button>
                </DialogActions>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* --- Lista de plantas --- */}
      {loading && plants.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={4}>
          {plants
            .filter((p) => !selectedCategory || p.category === selectedCategory)
            .map((plant) => (
              <StyledCard key={plant.id}>
                <CardMedia
                  component="img"
                  height="180"
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
                  <Typography variant="caption" display="block" color="text.secondary" textAlign="center">
                    {plant.category}
                  </Typography>
                </CardContent>
                {role === "profesor" && (
                  <IconButton
                    onClick={() => { setSelectedItem(plant); setDeleteDialog(true); }}
                    sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, zIndex: 1, }}
                  >
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                )}
              </StyledCard>
            ))}
        </Box>
      )}

      {/* Diálogo de eliminación/rechazo */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar esta planta? Se borrará de la lista principal si está aprobada o de la cola de revisión si está pendiente.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
          >
            {selectedItem?.explorador ? 'Rechazar' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flora;