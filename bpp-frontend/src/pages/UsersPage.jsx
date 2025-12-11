import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { auth } from "../config/firebaseConfig";
import UsersTable from "../components/UsersTable";

const UsersPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(data.usuarios || []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleApprove = async (uid) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`${import.meta.env.VITE_API_URL}/users/aprobar/${uid}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsuarios();
  };

  const handleReject = async (uid) => {
    if (!confirm("¿Seguro que deseas rechazar y eliminar este usuario?")) return;
    const token = await auth.currentUser.getIdToken();
    await fetch(`${import.meta.env.VITE_API_URL}/users/rechazar/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsuarios();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );

  const usuariosAprobados = usuarios.filter((u) => u.aprobado === true);
  const solicitudesPendientes = usuarios.filter((u) => u.aprobado === false);

  return (
    <Container className="mt-6">
      <Typography variant="h4" gutterBottom className="font-bold mb-6">
        Gestión de Usuarios
      </Typography>

      <UsersTable title="Lista de Usuarios" usuarios={usuariosAprobados} showRole />

      <UsersTable
        title="Solicitudes de Usuarios Profesor"
        usuarios={solicitudesPendientes}
        showRole={false}
        showActions
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Container>
  );
};

export default UsersPage;
