import { useState } from 'react'; 
import { useSnackbar } from 'notistack';
import { Button, TextField, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 

const API_URL = import.meta.env.VITE_API_URL;

const friendlyErrors = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/invalid-email": "Formato de correo inválido.",
  "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",

  "email-not-verified": "Debes verificar tu correo antes de iniciar sesión.",
  "user-not-exists": "Usuario no encontrado en base de datos.",
  "user-not-approved": "Tu cuenta aún no ha sido aprobada por un administrador.",
};

function getFriendlyError(error) {
  // Si viene un código conocido
  if (error.code && friendlyErrors[error.code]) return friendlyErrors[error.code];
  // Si viene como texto exacto del backend
  if (error.message && friendlyErrors[error.message]) return friendlyErrors[error.message];
  return "Ocurrió un error. Intenta nuevamente.";
}

const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      enqueueSnackbar("Por favor completa todos los campos", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      // Enviar el token al backend para validación
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        await signOut(auth);
        throw new Error(data.message || "Error en login.");
      }
      enqueueSnackbar(`Bienvenido ${data.nombre || "Explorador"} 👋`, { variant: "success" });
      navigate("/");
    } catch (err) {
      console.error("Error en login:", err);
      const message = getFriendlyError(err);
      enqueueSnackbar(message, { variant: "warning" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <Paper className="p-8 w-full max-w-md rounded-2xl shadow-lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#2e7d32' }}
        >
          🌟 ¡Bienvenido Explorador!
        </Typography>
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
          className="mt-4"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </Paper>
    </div>
  );
};

export default LoginPage;
