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

const Sidebar = ({
  isOpen,
  toggleSidebar,
  navItems,
  handleNavItemClick,
  isSmallScreen,
  theme,
}) => {
  const location = useLocation();

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
        <EmojiNature className="text-4xl" />
        <IconButton onClick={toggleSidebar} className="text-current">
          <ChevronLeft />
        </IconButton>
      </div>
      <List>
        {navItems.map((item, index) => {
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
