import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Switch,
  Box,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { Favorite, ChatBubbleOutline, Add, CloudUpload } from "@mui/icons-material";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import PostCard from "../components/PostCard"; 

// CONFIGURACIÓN DE CLOUDINARY
const CLOUDINARY_UPLOAD_PRESET = "images"; 
const CLOUDINARY_CLOUD_NAME = "dsaunprcy"; 

export default function Comunidad({ theme }) {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para subida de imagen
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Modal nueva publicación
  const [openDialog, setOpenDialog] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  // Modal comentarios
  const [openComments, setOpenComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Notificaciones
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const showNotification = (msg, severity = "warning") => {
    setNotification({ open: true, message: msg, severity });
  };

  // 🔹 Verificar sesión y rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          setRole(idTokenResult.claims.rol || "estudiante");
        } catch (error) {
          setRole("estudiante");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Cargar publicaciones (FEED PÚBLICO)
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("approved", "==", true),
      where("public", "==", true),
      orderBy("createdAt", "desc") 
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Cargar mis publicaciones
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // Cargar pendientes (SOLO PROFESOR)
  useEffect(() => {
    if (role !== "profesor") return;
    const q = query(collection(db, "posts"), where("approved", "==", false), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [role]);

  // --- SUBIR IMAGEN Y CREAR POST ---
  const crearPublicacion = async () => {
    if (!newDescription.trim()) return showNotification("Escribe una descripción.", "warning");
    if (!file) return showNotification("Debes seleccionar una imagen.", "warning");

    setUploading(true);
    try {
      // 1. Subir imagen a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "comunidad_posts"); 

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { 
        method: "POST", body: formData 
      });
      
      if (!res.ok) throw new Error("Error al subir imagen");
      const data = await res.json();
      const imageUrl = data.secure_url;

      // 2. Guardar en Firestore
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        userName: user.displayName || "Explorador",
        userPhoto: user.photoURL || null,
        image: imageUrl,
        description: newDescription,
        createdAt: serverTimestamp(),
        public: role === "profesor", 
        approved: role === "profesor", 
        likes: [],
        commentCount: 0,
      });

      // 3. Limpiar y cerrar
      setOpenDialog(false);
      setNewDescription("");
      setFile(null);
      setPreview(null);
      showNotification(role === "profesor" ? "Publicado con éxito" : "Enviado a revisión", "success");

    } catch (error) {
      console.error("Error:", error);
      showNotification("Error al publicar.", "error");
    } finally {
      setUploading(false);
    }
  };

  // --- ACCIONES DE POST ---
  const handleLikeClick = (postId, likes) => {
    if (!user) return showNotification("Inicia sesión para dar Like ❤️", "info");
    
    const postRef = doc(db, "posts", postId);
    if (likes?.includes(user.uid)) {
      updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  const approvePost = async (postId) => {
    await updateDoc(doc(db, "posts", postId), { approved: true, public: true });
    showNotification("Publicación aprobada", "success");
  };

  const deletePost = async (postId) => {
    if (!window.confirm("¿Eliminar esta publicación de la comunidad?")) return;
    try {
        await deleteDoc(doc(db, "posts", postId));
        showNotification("Publicación eliminada correctamente", "success");
    } catch (error) {
        console.error("Error al eliminar:", error);
        showNotification("Error al eliminar la publicación", "error");
    }
  };

  const togglePublic = async (postId, currentVal) => {
    await updateDoc(doc(db, "posts", postId), { public: !currentVal });
  };

  // --- COMENTARIOS ---
  const handleOpenComments = (post) => {
    if (!user) return showNotification("Inicia sesión para ver comentarios", "info");
    setSelectedPost(post);
    setOpenComments(true);

    const q = query(collection(db, "posts", post.id, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    await addDoc(collection(db, "posts", selectedPost.id, "comments"), {
      userId: user.uid,
      userName: user.displayName || "Explorador",
      text: newComment,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "posts", selectedPost.id), { 
      commentCount: (selectedPost.commentCount || 0) + 1 
    });
    setNewComment("");
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("¿Borrar comentario?")) return;
    await deleteDoc(doc(db, "posts", selectedPost.id, "comments", commentId));
    await updateDoc(doc(db, "posts", selectedPost.id), { 
        commentCount: (selectedPost.commentCount || 1) - 1 
    });
  };

  // --- RENDERIZADO DE TABS ---
  const UserPublications = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Mis Publicaciones</Typography>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<Add />} 
          onClick={() => setOpenDialog(true)}
        >
          Nueva Publicación
        </Button>
      </Box>
      
      {myPosts.length === 0 ? (
        <Typography color="text.secondary" align="center" py={4}>No tienes publicaciones aún.</Typography>
      ) : (
        <Grid container spacing={3}>
          {myPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard 
                post={post} type="my" role={role} user={user}
                onLike={() => handleLikeClick(post.id, post.likes)}
                onComment={handleOpenComments}
                onDelete={deletePost}
                onTogglePublic={togglePublic}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`, minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        
        {/* Encabezado */}
        <Box mb={4} p={4} bgcolor="rgba(255,255,255,0.9)" borderRadius={4} textAlign="center">
          <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
            Comunidad del Bosque 🌲
          </Typography>
          {!user && (
            <Alert severity="warning" sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
              ¡Hola explorador! Debes <strong>iniciar sesión</strong> para publicar, dar like y comentar.
            </Alert>
          )}
        </Box>

        {/* Contenido Principal */}
        <Box p={4} bgcolor="rgba(255,255,255,0.95)" borderRadius={4}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
          >
            {user && <Tab label="Mi Espacio" />}
            <Tab label="Explorar Comunidad" />
            {role === "profesor" && <Tab label="Pendientes de Aprobación" />}
          </Tabs>

          {/* Lógica de Tabs */}
          {user ? (
            <>
              {activeTab === 0 && <UserPublications />}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <PostCard 
                        post={post} type="feed" role={role} user={user}
                        onLike={() => handleLikeClick(post.id, post.likes)}
                        onComment={handleOpenComments}
                        // --- AQUÍ ESTÁ EL CAMBIO ---
                        // Si el rol es profesor, pasamos la función deletePost
                        onDelete={role === "profesor" ? deletePost : undefined}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
              {activeTab === 2 && role === "profesor" && (
                 <Grid container spacing={3}>
                 {pendingPosts.length === 0 && <Typography p={2}>No hay posts pendientes.</Typography>}
                 {pendingPosts.map(post => (
                   <Grid item xs={12} sm={6} md={4} key={post.id}>
                     <PostCard 
                       post={post} type="pending" role={role}
                       onApprove={approvePost} onDelete={deletePost}
                     />
                   </Grid>
                 ))}
               </Grid>
              )}
            </>
          ) : (
            // Vista para NO LOGUEADOS
            <Grid container spacing={3}>
                {posts.map(post => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <PostCard 
                    post={post} type="feed" role={null} user={null}
                    onLike={() => handleLikeClick(post.id, post.likes)}
                    onComment={() => showNotification("Inicia sesión para ver comentarios", "info")}
                    // No pasamos onDelete aquí porque no hay usuario
                    />
                </Grid>
                ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* --- DIÁLOGO NUEVA PUBLICACIÓN --- */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Publicación 📸</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} alignItems="center">
            <Box 
              sx={{ 
                width: "100%", height: 200, 
                border: "2px dashed #ccc", borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
                bgcolor: "#f9f9f9", overflow: "hidden", position: "relative"
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Box textAlign="center" color="text.secondary">
                  <CloudUpload sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">Sube una foto</Typography>
                </Box>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if(file){
                    setFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
              />
            </Box>

            <TextField
              label="¿Qué descubriste hoy?"
              multiline rows={3} fullWidth
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={crearPublicacion}
            disabled={uploading}
            startIcon={uploading && <CircularProgress size={20} color="inherit"/>}
          >
            {uploading ? "Subiendo..." : "Publicar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- DIÁLOGO COMENTARIOS --- */}
      <Dialog open={openComments} onClose={() => setOpenComments(false)} fullWidth maxWidth="sm">
        <DialogTitle>Comentarios</DialogTitle>
        <DialogContent dividers>
          {comments.length === 0 ? (
            <Typography align="center" color="text.secondary" py={2}>Se el primero en comentar 👇</Typography>
          ) : (
            comments.map((c) => (
              <Box key={c.id} mb={2} display="flex" gap={2}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>{c.userName[0]}</Avatar>
                <Box flexGrow={1} bgcolor="#f5f5f5" p={1.5} borderRadius={2}>
                  <Typography variant="subtitle2" fontWeight="bold">{c.userName}</Typography>
                  <Typography variant="body2">{c.text}</Typography>
                </Box>
                {(role === "profesor" || user?.uid === c.userId) && (
                   <IconButton size="small" color="error" onClick={() => deleteComment(c.id)}>×</IconButton>
                )}
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <TextField 
            fullWidth size="small" placeholder="Escribe un comentario..." 
            value={newComment} onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()}>Enviar</Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({...notification, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>

    </Box>
  );
}