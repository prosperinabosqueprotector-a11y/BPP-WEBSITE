import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
  Snackbar,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import ImageApprovalTable from "../components/ImageApprovalTable";

const API_URL = "https://bpp-website-1.onrender.com";
const CLOUDINARY_UPLOAD_PRESET = "images";
const CLOUDINARY_CLOUD_NAME = "dsaunprcy";

const UploadPage = ({ theme }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const [role, setRole] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [pendingImages, setPendingImages] = useState([]);

  // Detectar usuario y rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol;
          setRole(userRole);
        } catch (error) {
          console.error("Error obteniendo claims:", error);
        }
      } else {
        setRole(null); // visitante
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Si es profesor → escuchar cambios en Firestore
  useEffect(() => {
    if (role === "profesor") {
      const q = query(
        collection(db, "imagenesPendientes"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingImages(items);
      });
      return () => unsubscribe();
    }
  }, [role]);

  // Copiar URL al portapapeles
  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      // carpeta en Cloudinary segun rol
      const folder = role === "profesor" ? "upload" : "pendientes";
      formData.append("folder", folder);
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadData = await uploadResponse.json();
      setUploadedUrl(uploadData.secure_url);
      setShowSuccess(true);
      setFile(null);
      setPreview(null);
      // Si es estudiante → adicional:guardar metadata en Firestore
      if (role === "estudiante") {
        const user = auth.currentUser;
        const now = new Date();
        const fecha = now.toLocaleDateString("es-EC");
        const hora = now.toLocaleTimeString("es-EC");
        await addDoc(collection(db, "imagenesPendientes"), {
          archivo: uploadData.secure_url,
          public_id: uploadData.public_id,
          explorador: user.displayName || "Anónimo",
          avatar: user.photoURL || "https://i.pravatar.cc/100",
          correo: user.email,
          fecha,
          hora,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Aceptar imagen → mover de carpeta "pendientes" a "upload", y borrar de db
  const handleAccept = async (img) => {
    try {
      const res = await fetch(`${API_URL}/api/cloudinary/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: img.public_id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      await deleteDoc(doc(db, "imagenesPendientes", img.id));
      setPendingImages((prev) => prev.filter((i) => i.id !== img.id));
      alert("Imagen aceptada");
    } catch (err) {
      console.error(err);
      alert("Error al aceptar imagen");
    }
  };

  // Rechazar imagen → borar de carpeta "pendientes", y borrar de db
  const handleReject = async (item) => {
    try {
      await fetch(`${API_URL}/api/cloudinary/delete/${item.public_id}`, {
        method: "DELETE",
      });
      await deleteDoc(doc(db, "imagenesPendientes", item.id));
    } catch (error) {
      console.error("Error rechazando imagen:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Subir Imagen
      </Typography>

      {!role && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Debes iniciar sesión para poder subir archivos.
        </Alert>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile));
            }
          }}
          accept="*" //CAMBIAR. Original: image/*
          style={{ marginBottom: theme.spacing(2) }}
          disabled={!role}
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

        <Button
          variant="contained"
          type="submit"
          disabled={!file || loading || !role}
          startIcon={
            loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
        >
          {loading ? "Subiendo..." : "Subir Imagen"}
        </Button>
      </form>

      {uploadedUrl && (
        <Box mt={4}>
          <Alert severity="success">
            {role === "estudiante"
              ? "Tu imagen fue enviada y será revisada antes de publicarse"
              : "Imagen subida exitosamente"}
          </Alert>
          <CardMedia
            component="img"
            image={uploadedUrl}
            alt="Uploaded"
            sx={{ maxHeight: 200, width: "auto", mt: 2, borderRadius: 1 }}
          />
          <Paper
            sx={{
              p: 2,
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {uploadedUrl}
            </Typography>
            <IconButton
              onClick={() => handleCopyUrl(uploadedUrl)}
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      {/* Mensajes de éxito / error */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message={
          role === "estudiante"
            ? "Imagen enviada para revisión"
            : "Imagen subida exitosamente"
        }
      />
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="URL copiada al portapapeles"
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Si es profesor → ver tabla con imágenes pendientes */}
      {role === "profesor" && (
        <div>
        <Typography mt={6} variant="h5" gutterBottom>
        Imagenes por aprobar
        </Typography>
        <Box >
          <ImageApprovalTable items={pendingImages} onAccept={handleAccept} onReject={handleReject}/>
        </Box>
        </div>
      )}
    </Box>
  );
};

export default UploadPage;
