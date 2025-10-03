import { useState } from 'react';
import { Button, TextField, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = process.env.REACT_APP_API_URL;

const SignupPage = () => {
  const [role, setRole] = useState('estudiante');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // opcional
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Por favor completa todos los campos");
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
          username: username || name.replace(/\s+/g, "").toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en signup");

      console.log("Usuario creado:", data);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error("Error en signup:", err.message);
      setError(err.message);
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
