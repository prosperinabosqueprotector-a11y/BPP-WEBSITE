import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, TextField, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from "firebase/auth"
import { auth } from "../config/firebaseConfig"; 

const API_URL = import.meta.env.VITE_API_URL;

const friendlyErrors = {
  "auth/email-already-in-use": "Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.",
  "auth/weak-password": "La contraseña es muy débil. Debe tener al menos 6 caracteres.",
  "auth/invalid-email": "El correo que ingresaste no es válido.",
};

function getFriendlyError(error) {
  // Si viene un código conocido
  if (error.code && friendlyErrors[error.code]) return friendlyErrors[error.code];
  // Si viene como texto exacto del backend
  if (error.message && friendlyErrors[error.message]) return friendlyErrors[error.message];
  return "Ocurrió un error. Intenta nuevamente.";
}

const SignupPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = useState('estudiante');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // opcional
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      enqueueSnackbar("Por favor completa todos los campos", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { 
        displayName: name, 
        photoURL: `https://api.dicebear.com/6.x/adventurer/svg?seed=${name}`
      });
      await sendEmailVerification(user);
      await signOut(auth);
      const res = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          email,
          //password,
          rol: role,
          username: username || name.replace(/\s+/g, "").toLowerCase(),
          user: user,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw data.error || { message: "Ocurrió un error desconocido" };
      }

      if (role === "profesor") {
        enqueueSnackbar("Después de verificar la cuenta, tendrás que esperar la aprobación de un administrador.", { variant: "warning" });
      }
      enqueueSnackbar("Usuario registrado. Revisa tu correo para verificar la cuenta.", { variant: "success" });
      navigate("/login");
    } catch (err) {
      console.error("Error en signup:", err);
      const message = getFriendlyError(err);
      enqueueSnackbar(message, { variant: "warning" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <Paper className="p-8 w-full max-w-md rounded-2xl shadow-lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#2e7d32' }}
        >
          🧩 Crear Cuenta
        </Typography>

        {/* Selección de rol */}
        <Typography variant="body1" className="mb-2 text-center">
          ¿Quién eres?
        </Typography>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(e, value) => value && setRole(value)}
          className="flex justify-center mb-4"
        >
          <ToggleButton value="estudiante">Estudiante</ToggleButton>
          <ToggleButton value="profesor">Profesor</ToggleButton>
        </ToggleButtonGroup>

        {/* Formulario */}
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Correo"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="mt-4"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading
            ? "Registrando..."
            : `Registrarme como ${role === "estudiante" ? "Estudiante" : "Profesor"}`}
        </Button>
      </Paper>
    </div>
  );
};

export default SignupPage;
