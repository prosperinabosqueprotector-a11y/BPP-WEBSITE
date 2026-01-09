import { useState, useEffect } from 'react';
import {
  Grid, Card, CardMedia, Typography, Box, IconButton, Dialog,
  DialogActions, DialogContent, DialogTitle, Button, Accordion,
  AccordionSummary, AccordionDetails, Tabs, Tab, Avatar, Chip, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const API_URL = "https://bpp-website-1.onrender.com";

const GalleryPage = ({ theme }) => {
  const [activeTab, setActiveTab] = useState(0); // 0 = General, 1 = Comunidad
  const [role, setRole] = useState(null);
  
  // --- DATOS CLOUDINARY (Galería General) ---
  const [cloudinaryMedia, setCloudinaryMedia] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(true);

  // --- DATOS FIRESTORE (Galería de Alumnos) ---
  const [firestoreImages, setFirestoreImages] = useState([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // --- ESTADOS DE ELIMINACIÓN ---
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteSource, setDeleteSource] = useState(null); // 'cloudinary' o 'firestore'

  // 1. Detectar Usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.rol);
        } catch (e) { setRole(null); }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Cargar Cloudinary (Antiguo)
  useEffect(() => {
    const fetchCloudinary = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cloudinary/images`);
        const data = await response.json();
        setCloudinaryMedia(data.images || []);
      } catch (error) {
        console.error("Error Cloudinary:", error);
      } finally {
        setLoadingCloud(false);
      }
    };
    fetchCloudinary();
  }, []);

  // 3. Cargar Firestore (Nuevo - Aprobados)
  useEffect(() => {
    const q = query(collection(db, "galeria"), orderBy("approvedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFirestoreImages(docs);
      setLoadingFirestore(false);
    });
    return () => unsubscribe();
  }, []);

  // --- MANEJO DE TABS ---
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // --- ELIMINAR (Maneja ambos casos) ---
  const openDeleteDialog = (item, source) => {
    setItemToDelete(item);
    setDeleteSource(source);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteSource === 'firestore') {
        // Borrar de Firestore
        await deleteDoc(doc(db, "galeria", itemToDelete.id));
      } else {
        // Borrar de Cloudinary API
        const response = await fetch(`${API_URL}/api/cloudinary/delete/${encodeURIComponent(itemToDelete.public_id)}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting from Cloud');
        setCloudinaryMedia(prev => prev.filter(img => img.public_id !== itemToDelete.public_id));
      }
      setDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el archivo.");
    }
  };

  // Filtros para Cloudinary
  const imagesOnly = cloudinaryMedia.filter(item => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.format?.toLowerCase()));
  const videosOnly = cloudinaryMedia.filter(item => ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(item.format?.toLowerCase()));

  // --- RENDERIZADORES ---

  // 1. Render Tab Cloudinary (Estilo clásico sin info de usuario)
  const renderCloudinaryGrid = (list) => (
    <Grid container spacing={3}>
      {list.map((media) => (
        <Grid item xs={12} sm={6} md={4} key={media.public_id}>
          <Card sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', '&:hover': { transform: 'scale(1.02)', boxShadow: 3 }, transition: '0.3s' }}>
            {role === "profesor" && (
              <IconButton
                onClick={() => openDeleteDialog(media, 'cloudinary')}
                sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white', color: 'red' }, zIndex: 2 }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            
            {['mp4', 'mov', 'avi'].includes(media.format?.toLowerCase()) ? (
              <video controls style={{ width: '100%', height: 200, objectFit: 'cover' }}>
                <source src={media.url} type={`video/${media.format}`} />
              </video>
            ) : (
              <CardMedia
                component="img"
                height="200"
                image={media.url || media.secure_url}
                alt="Media"
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => window.open(media.url, '_blank')}
              />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // 2. Render Tab Firestore (Estilo social con Avatar y Nombre)
  const renderFirestoreGrid = () => (
    <Grid container spacing={3}>
      {firestoreImages.length === 0 && (
        <Box width="100%" textAlign="center" py={5}>
          <Typography color="textSecondary">Aún no hay aportes de exploradores aprobados.</Typography>
        </Box>
      )}
      {firestoreImages.map((img) => (
        <Grid item xs={12} sm={6} md={4} key={img.id}>
          <Card elevation={3} sx={{ borderRadius: 4, overflow: 'visible', position: 'relative', mt: 2 }}>
            {role === "profesor" && (
              <IconButton
                onClick={() => openDeleteDialog(img, 'firestore')}
                sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.8)', color: 'error.main', zIndex: 2 }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}

            <Box 
                sx={{ height: 220, overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16, cursor: 'pointer' }}
                onClick={() => window.open(img.archivo, '_blank')}
            >
                <CardMedia component="img" image={img.archivo} alt="Aporte" sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s', '&:hover': { transform: 'scale(1.1)' } }} />
            </Box>

            <Box p={2} pt={3} position="relative">
                <Box ml={3}>
                    <Typography variant="subtitle2" fontWeight="bold">{img.explorador}</Typography>
                    <Typography variant="caption" color="text.secondary">{img.fecha}</Typography>
                </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box p={4} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          📸 Galería del Bosque
        </Typography>
      </Box>

      {/* --- PESTAÑAS --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, bgcolor: 'white', borderRadius: 2, px: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label={`Archivo General (${imagesOnly.length + videosOnly.length})`} />
          <Tab label={`Aportes de la Comunidad (${firestoreImages.length})`} />
        </Tabs>
      </Box>

      {/* --- CONTENIDO PESTAÑA 0 (CLOUDINARY) --- */}
      {activeTab === 0 && (
        <>
          {loadingCloud ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : (
            <>
              <Accordion defaultExpanded sx={{ mb: 2, borderRadius: '10px !important', '&:before': { display: 'none' } }} elevation={2}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold" color="primary">📷 Imágenes del Sistema ({imagesOnly.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderCloudinaryGrid(imagesOnly)}
                </AccordionDetails>
              </Accordion>

              {videosOnly.length > 0 && (
                <Accordion sx={{ borderRadius: '10px !important', '&:before': { display: 'none' } }} elevation={2}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold" color="secondary">🎥 Videos ({videosOnly.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {renderCloudinaryGrid(videosOnly)}
                  </AccordionDetails>
                </Accordion>
              )}
            </>
          )}
        </>
      )}

      {/* --- CONTENIDO PESTAÑA 1 (FIRESTORE) --- */}
      {activeTab === 1 && (
        <>
          {loadingFirestore ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : renderFirestoreGrid()}
        </>
      )}

      {/* --- DIÁLOGO DE BORRADO --- */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este archivo permanentemente?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

GalleryPage.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default GalleryPage;