import { useState } from 'react'; 
import { Button, TextField, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importar funciones de Firestore
import { auth, db } from "../config/firebaseConfig"; // Importar db

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      // 1. Validar Credenciales (Firebase Auth)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Validar Estado en Base de Datos (Firestore)
      // Buscamos el documento del usuario en la colección "Usuarios"
      const docRef = doc(db, "Usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // 3. REGLA DE ORO: Si es profesor y NO está aprobado...
        if (userData.rol === "profesor" && userData.aprobado !== true) {
          // ... ¡LO SACAMOS INMEDIATAMENTE!
          await signOut(auth); 
          throw new Error("ACCOUNT_NOT_APPROVED");
        }
      }

      // 4. Si pasó la validación, entra
      console.log("Usuario logueado y autorizado:", user.email);
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      let msg;
      
      // Manejo de errores personalizados y de Firebase
      if (err.message === "ACCOUNT_NOT_APPROVED") {
        msg = "🔒 Tu cuenta de profesor está pendiente de aprobación por un administrador.";
      } else {
        switch (err.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            msg = "Correo o contraseña incorrectos.";
            break;
          case "auth/invalid-email":
            msg = "Formato de correo inválido.";
            break;
          case "auth/too-many-requests":
            msg = "Demasiados intentos fallidos. Intenta más tarde.";
            break;
          default:
            msg = "Error al iniciar sesión. Intenta nuevamente.";
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 p-4">
      <Paper className="p-8 w-full max-w-md rounded-2xl shadow-lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#2e7d32' }}
        >
          🌟 ¡Bienvenido Explorador!
        </Typography>
        
        {error && (
          <Alert severity={error.includes("pendiente") ? "warning" : "error"} className="mb-4">
            {error}
          </Alert>
        )}

        <TextField
          label="Correo"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="mt-6"
          sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          onClick={handleLogin}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit"/>}
        >
          {loading ? "Verificando..." : "Iniciar Sesión"}
        </Button>
      </Paper>
    </div>
  );
};

export default LoginPage;