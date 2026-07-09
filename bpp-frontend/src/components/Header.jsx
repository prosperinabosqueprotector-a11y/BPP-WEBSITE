import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { MenuRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 

const API_URL = 'https://bpp-website-1.onrender.com';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [floraCount, setFloraCount] = useState(0);
  const [faunaCount, setFaunaCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null); // visitante
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [floraRes, faunaRes] = await Promise.all([
          fetch(`${API_URL}/api/data/floraAprobada`),
          fetch(`${API_URL}/api/data/faunaAprobada`)
        ]);

        const floraData = await floraRes.json();
        const faunaData = await faunaRes.json();

        setFloraCount(floraData?.count || 0);
        setFaunaCount(faunaData?.count || 0);
      } catch (error) {
        console.error("❌ Error al obtener conteos desde backend:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          className="mr-2"
        >
          <MenuRounded />
        </IconButton>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          {isMobile ? " " : "Bosque Mágico"}
        </Typography>

        <div className="flex items-center space-x-4">
          {/* Solo mostrar contadores si no es móvil */}
          {!isMobile && (
            <>
              <Tooltip title="Número de flora registrada" arrow>
                <div className="flex items-center bg-opacity-20 bg-white rounded-full px-3 py-1 cursor-default">
                  <span className="text-yellow-400 mr-2">🍃</span>
                  <Typography variant="body1">{floraCount}</Typography>
                </div>
              </Tooltip>
              <Tooltip title="Número de fauna registrada" arrow>
                <div className="flex items-center bg-opacity-20 bg-white rounded-full px-3 py-1 cursor-default">
                  <span className="mr-2">🦉</span>
                  <Typography variant="body1">{faunaCount}</Typography>
                </div>
              </Tooltip>
            </>
          )}

          {!currentUser ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Avatar
                alt={currentUser.displayName || "User"}
                src={currentUser.photoURL || "/placeholder.svg"}
                sx={{
                  bgcolor: "gray", // fondo blanco
                  border: "1px solid #ccc", // opcional: borde gris claro
                }}
              />
              <Typography variant="body1" className="hidden sm:block">
                {currentUser.displayName || "Explorador"}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
