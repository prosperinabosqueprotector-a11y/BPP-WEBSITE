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
} from "@mui/material";
import { Favorite, ChatBubbleOutline, Add } from "@mui/icons-material";
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

export default function Comunidad({ theme }) {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal nueva publicación
  const [openDialog, setOpenDialog] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Modal comentarios
  const [openComments, setOpenComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // 🔹 Verificar sesión y rol del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const userRole = idTokenResult.claims.rol || "estudiante";
          setRole(userRole);
        } catch (error) {
          console.error("Error obteniendo claims:", error);
          setRole("estudiante");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe();
  }, []);

  // Cargar publicaciones
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("approved", "==", true),
      where("public", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Cargar mis publicaciones (independiente de aprobado)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

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

  // Dar o quitar like
  const toggleLike = async (postId, likes) => {
    if (!user) return alert("Debes iniciar sesión para dar like");
    const postRef = doc(db, "posts", postId);
    if (likes?.includes(user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  // Cambiar visibilidad (solo propio)
  const togglePublic = async (postId, currentValue) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { public: !currentValue });
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

  // Abrir modal de comentarios
  const handleOpenComments = (post) => {
    setSelectedPost(post);
    setOpenComments(true);

    const q = query(
      collection(db, "posts", post.id, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  };

  // Agregar comentario
  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !selectedPost) return;
    const commentsRef = collection(db, "posts", selectedPost.id, "comments");
    await addDoc(commentsRef, {
      userId: user.uid,
      userName: user.displayName || "Explorador",
      text: newComment,
      createdAt: serverTimestamp(),
    });

    // Actualizar contador de comentarios en el post
    const postRef = doc(db, "posts", selectedPost.id);
    await updateDoc(postRef, { commentCount: (selectedPost.commentCount || 0) + 1 });

    setNewComment("");
  };

  // ─── Componentes de feed y mis publicaciones ───
  const CommunityFeed = () => (
    <Box className="space-y-6">
      <Typography variant="h6" className="text-gray-800 mb-4">
        Descubrimientos Recientes
      </Typography>
      {posts.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          Aún no hay publicaciones visibles de otros exploradores.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard
                post={post}
                type="feed"
                role={role}
                user={user}
                onLike={toggleLike}
                onComment={handleOpenComments}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const UserPublications = () => (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="text-gray-800">
          Mis Publicaciones
        </Typography>
        {role && (
          <Button
            variant="contained"
            startIcon={<Add />}
            className="bg-green-600 hover:bg-green-700 rounded-full text-white"
            onClick={() => setOpenDialog(true)}
          >
            Nueva publicación
          </Button>
        )}
      </Box>
      {myPosts.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No has subido ninguna publicación todavía.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {myPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard
                post={post}
                type="my"
                role={role}
                user={user}
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

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comentario?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));

      // Disminuir contador en el post
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: (selectedPost.commentCount || 1) - 1 });
    } catch (error) {
      console.error("Error eliminando comentario:", error);
    }
  };

  const PendingPostsTab = () => (
    <Box className="space-y-6">
      <Typography variant="h6" className="text-gray-800 mb-4">
        Publicaciones por aprobar
      </Typography>
      {pendingPosts.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No hay publicaciones pendientes.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {pendingPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard
                post={post}
                type="pending"
                role={role}
                onApprove={approvePost}
                onDelete={deletePost}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box
      className="flex flex-col min-h-full"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, flexGrow: 1, py: 4 }}>
        <Box mb={4} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Typography
            variant="h3"
            component="h1"
            className="mb-4 text-center font-bold"
            color="primary"
            sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)", fontWeight: 800 }}
          >
            Comunidad
          </Typography>
        </Box>

        <Box mb={4} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="mb-6"
            TabIndicatorProps={{
              style: { backgroundColor: theme.palette.primary.main, height: "4px", borderRadius: "2px" },
            }}
          >
            <Tab label="Tu espacio" />
            <Tab label="Otros Exploradores" />
            {role === "profesor" && <Tab label="Por Aprobar" />}
          </Tabs>

          {activeTab === 0 ? <UserPublications /> : activeTab === 1 ? <CommunityFeed /> : <PendingPostsTab />}
        </Box>
      </Container>

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

      {/* Modal Comentarios */}
      <Dialog open={openComments} onClose={() => setOpenComments(false)} fullWidth>
        <DialogTitle>Comentarios</DialogTitle>
        <DialogContent>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "flex-start", mb: 2, p: 1, borderBottom: "1px solid #eee" }}
              >
                <Avatar
                  src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${c.userName || c.userId}`}
                  sx={{ mr: 2, width: 32, height: 32 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">{c.userName}</Typography>
                  <Typography variant="body2">{c.text}</Typography>
                </Box>
                {role === "profesor" && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteComment(selectedPost.id, c.id)}
                  >
                    ❌
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No hay comentarios aún
            </Typography>
          )}

          <TextField
            fullWidth
            size="small"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAddComment}>
            Comentar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
