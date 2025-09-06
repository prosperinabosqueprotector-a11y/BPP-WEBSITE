import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { MenuRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; 

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
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
          Bosque Mágico
        </Typography>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-opacity-20 bg-white rounded-full px-3 py-1">
            <span className="text-yellow-400 mr-2">🍃</span>
            <Typography variant="body1">25795</Typography> 
          </div>
          <div className="flex items-center bg-opacity-20 bg-white rounded-full px-3 py-1">
            <span className="mr-2">🦉</span>
            <Typography variant="body1">15</Typography>
          </div>

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
