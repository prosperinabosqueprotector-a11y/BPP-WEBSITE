import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MenuRounded, Palette } from '@mui/icons-material';

const Header = ({
  toggleSidebar,
  handleColorSchemeMenuOpen,
  anchorEl,
  handleColorSchemeMenuClose,
  handleColorSchemeChange,
}) => {
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
          <Avatar alt="User Avatar" src="/placeholder.svg?height=40&width=40" />
          <Typography variant="body1" className="hidden sm:block">
            Explorador
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
