import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Zoom,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';
import logo from '../assets/svg/logo.svg';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  navItems,
  handleNavItemClick,
  isSmallScreen,
  theme,
}) => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.rol;
          setRole(userRole);
        } catch (error) {
          console.error("Error obteniendo claims:", error);
        }
      } else {
        setRole(null); // visitante
      }
    };

    // Ejecutar al montar y cuando cambie el usuario
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchUserRole();
    });

    return () => unsubscribe();
  }, []);

  // ✅ Agregamos el item "Usuarios" solo si el rol es profesor
  const filteredNavItems = [
    ...navItems,
    ...(role === 'profesor'
      ? [{ text: 'Usuarios', emoji: '👤', route: '/users' }]
      : []),
  ];

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
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        },
      }}
    >
      <div className="p-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <IconButton onClick={toggleSidebar} className="text-current">
          <ChevronLeft />
        </IconButton>
      </div>

      <List>
        {filteredNavItems.map((item, index) => {
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
                  ${
                    isActive
                      ? 'bg-opacity-30 bg-white border-l-4 border-secondary'
                      : ''
                  }
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