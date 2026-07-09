import { useState, useEffect } from 'react'; // 1. Importar hooks
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Zoom,
} from '@mui/material';
import { ChevronLeft, EmojiNature } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebaseConfig'; // 2. Importar auth
import { onAuthStateChanged } from 'firebase/auth';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  navItems,
  handleNavItemClick,
  isSmallScreen,
  theme,
}) => {
  const location = useLocation();
  
  // --- 3. LÓGICA DE PROTECCIÓN DE RUTAS ---
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.rol); // 'profesor', 'estudiante', etc.
        } catch (error) {
          setRole('estudiante');
        }
      } else {
        setRole(null); // Sin sesión iniciada
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Drawer
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      open={isOpen}
      onClose={isSmallScreen ? toggleSidebar : undefined}
      sx={{
        '& .MuiDrawer-paper': {
          width: '256px',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRight: 'none',
          transition: 'transform 0.3s ease-in-out',
        },
      }}
    >
      <div className="p-4 flex justify-between items-center">
        <IconButton onClick={toggleSidebar} className="text-current">
          <ChevronLeft />
        </IconButton>
      </div>
      <List>
        {navItems.map((item, index) => {
          // --- 4. FILTRO DE SEGURIDAD ---
          // Si el item es "Usuarios" y el rol NO es profesor, no renderizamos nada (null)
          if (item.text === "Usuarios" && role !== "profesor") {
            return null;
          }

          const isActive = location.pathname === item.route;
          return (
            <Zoom
              in={true}
              style={{ transitionDelay: `${index * 100}ms` }}
              key={item.text}
            >
              <ListItem
                button
                component={Link}
                to={item.route}
                className={`
                  hover:bg-opacity-20 hover:bg-white
                  ${isActive ? 'bg-opacity-30 bg-white border-l-4 border-secondary' : ''}
                  transition-all duration-200
                `}
                onClick={() => handleNavItemClick(item.text)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  ...(isActive && {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderLeftColor: theme.palette.secondary.main,
                  }),
                }}
              >
                <div className="flex items-center w-full">
                  <span className="text-3xl mr-4">{item.emoji}</span>
                  <ListItemText
                    primary={item.text}
                    className="text-current"
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  />
                </div>
              </ListItem>
            </Zoom>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;