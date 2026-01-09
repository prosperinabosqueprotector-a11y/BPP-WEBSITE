import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  ToggleButton, 
  ToggleButtonGroup, 
  CircularProgress,
  Snackbar, 
  Alert 
} from '@mui/material';
import { useNavigate } from "react-router-dom";

const API_URL = "http://169.254.83.107:3000"; 

const SignupPage = () => {
  const [role, setRole] = useState('estudiante');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estado para controlar la notificación (Snackbar)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleSignup = async () => {
    // 1. Validaciones locales
    if (!name || !email || !password) {
      showNotification("Por favor completa todos los campos obligatorios.", "warning");
      return;
    }

    if (!email.includes("@")) {
      showNotification("Por favor ingresa un correo electrónico válido.", "warning");
      return;
    }

    if (password.length < 6) {
      showNotification("La contraseña es muy débil. Debe tener al menos 6 caracteres.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          email,
          password,
          rol: role,
          username: username || name.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1000),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la cuenta.");
      }

      console.log("Usuario creado:", data);

      // --- CAMBIO CLAVE AQUÍ ---
      // Mensaje distinto según el rol
      if (role === 'profesor') {
        showNotification(
          "Solicitud enviada. Tu cuenta de profesor está pendiente de aprobación por un administrador.", 
          "info"
        );
        // Esperamos un poco más (4 seg) para que lea el mensaje antes de enviarlo al login
        setTimeout(() => {
            navigate("/login");
        }, 4000);
      } else {
        showNotification("¡Registro exitoso! Redirigiendo al login...", "success");
        setTimeout(() => {
            navigate("/login");
        }, 2000);
      }

    } catch (err) {
      console.error("Error en signup:", err.message);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 p-4">
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
        <Typography variant="body1" className="mb-2 text-center" color="textSecondary">
          Selecciona tu perfil:
        </Typography>
        <div className="flex justify-center mb-6">
            <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, value) => value && setRole(value)}
            color="primary"
            >
            <ToggleButton value="estudiante">Estudiante</ToggleButton>
            <ToggleButton value="profesor">Profesor</ToggleButton>
            </ToggleButtonGroup>
        </div>

        {/* Aviso visual extra si selecciona Profesor */}
        {role === 'profesor' && (
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
                Nota: Las cuentas de profesor requieren aprobación manual antes de poder acceder.
            </Alert>
        )}

        {/* Formulario */}
        <TextField
          label="Nombre Completo *"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Nombre de Usuario (Opcional)"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Correo Electrónico *"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña *"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Mínimo 6 caracteres"
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          className="mt-6"
          sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
          onClick={handleSignup}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Procesando..." : role === 'profesor' ? "Solicitar Cuenta" : "Registrarme"}
        </Button>

        <Button 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/login')}
        >
            ¿Ya tienes cuenta? Inicia Sesión
        </Button>
      </Paper>

      {/* COMPONENTE DE NOTIFICACIÓN (POPUP) */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%', boxShadow: 3 }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default SignupPage;