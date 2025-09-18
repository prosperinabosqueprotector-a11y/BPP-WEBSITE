import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  Box,
  Button,
  Container,
  CircularProgress,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import { Add } from "@mui/icons-material";

const StyledCard = styled(Card)({
  width: 200,
  position: 'relative',
  '&:hover .description': {
    maxHeight: '100px',
    opacity: 1,
  },
});

const DescriptionOverlay = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px',
  opacity: 0,
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  textAlign: 'center',
});
const Fauna = () => {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(
          'https://bpp-website.onrender.com/api/data/fauna'
        );
        const data = await response.json();
        setAnimals(data);
        setCategories([...new Set(data.map((item) => item.category))]);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al obtener fauna:', error);
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Cargar publicaciones pendientes si eres profesor
  useEffect(() => {
    if (role !== "profesor") return;
    const q = query(collection(db, "posts"), where("approved", "==", false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [role]);

  // Crear nueva publicación
  const crearPublicacion = async () => {
    if (!user) return alert("Debes iniciar sesión para publicar");
    if (!newDescription.trim()) return alert("Agrega una descripción");

    try {
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        userName: user.displayName || "Explorador",
        image: newImageUrl || "https://placehold.co/600x400",
        description: newDescription,
        createdAt: serverTimestamp(),
        public: role === "profesor" ? true : false, // profesor puede ponerla publica ya
        approved: role === "profesor", // si profe, aprobado directo; si estudiante, pendiente
        likes: [],
        commentCount: 0,
      });

      setOpenDialog(false);
      setNewDescription("");
      setNewImageUrl("");
    } catch (error) {
      console.error("Error al crear publicación:", error);
    }
  };

  // Aprobar publicación (solo profesor)
  const approvePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { approved: true, public: true });
  };

  // Eliminar publicación
  const deletePost = async (postId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta publicación?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Error eliminando publicación:", error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
      >
        Enciclopedia de Fauna
      </Typography>

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
      <Box display="flex" paddingBottom={2} paddingLeft={8}>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="bg-green-600 hover:bg-green-700 rounded-full text-white"
          onClick={() => setOpenDialog(true)}
        >
          Nueva publicación
        </Button>
      </Box>
      {/* Modal Nueva Publicación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Nueva Publicación</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="URL de la imagen"
            fullWidth
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={crearPublicacion}>
            Publicar
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {animals
            .filter((a) => !selectedCategory || a.category === selectedCategory)
            .map((animal, index) => (
              <StyledCard key={index}>
                <CardMedia
                  component="img"
                  height="140"
                  image={animal.image}
                  alt={animal.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {animal.name}
                  </Typography>
                </CardContent>
                <DescriptionOverlay className="description">
                  {animal.description}
                </DescriptionOverlay>
              </StyledCard>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default Fauna;
