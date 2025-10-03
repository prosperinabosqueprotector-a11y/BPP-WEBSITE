import { useState } from 'react'; 
import { Button, TextField, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado:", userCredential.user.email);
      navigate("/");
    } catch (err) {
      let msg;
      switch (err.code) {
        case "auth/invalid-credential":
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
      setError(msg);
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
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
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
