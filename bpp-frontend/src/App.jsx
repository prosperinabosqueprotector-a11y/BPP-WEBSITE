import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Typography,
} from '@mui/material';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Comunidad from './pages/Comunidad';
import Fauna from './pages/Fauna';
import Flora from './pages/Flora';
import Juegos from './pages/Juegos';
import Mapa from './pages/Mapa';
import Reviews from './pages/Reviews';
import PDFViewer from './pages/PDFViewer';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { colorSchemes, navItems } from './data/appData';
import { SnackbarProvider } from "notistack";
import GameRankings from './pages/GameRankings'; 
import UsersPage from './pages/UsersPage';

// Función para determinar la estación del año en Ecuador
const getSeason = () => {
  const month = new Date().getMonth() + 1; // Enero es 0
  return month >= 1 && month <= 5 ? 'Invierno ☁️ (Temporada lluviosa)' : 'Verano ☀️ (Temporada seca)';
};

export default function App() {
  const [activeItem, setActiveItem] = useState('Inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [colorScheme, setColorScheme] = useState('summer');
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isSmallScreen = useMediaQuery('(max-width:960px)');

  useEffect(() => {
    setSidebarWidth(isSmallScreen ? 0 : sidebarOpen ? 256 : 0);
  }, [sidebarOpen, isSmallScreen]);

  useEffect(() => {
    // Cambia automáticamente el esquema de colores según la estación del año
    const season = getSeason();
    setColorScheme(season.includes('Invierno') ? 'winter' : 'summer');
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: colorSchemes[colorScheme].primary,
          },
          secondary: {
            main: colorSchemes[colorScheme].secondary,
          },
          background: {
            default: colorSchemes[colorScheme].background,
          },
          text: {
            primary: colorSchemes[colorScheme].text,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition:
                  'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                },
              },
            },
          },
        },
      }),
    [colorScheme]
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavItemClick = (text) => {
    setActiveItem(text);
    if (isSmallScreen) {
      setSidebarOpen(false);
    }
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >

        <div className="flex h-screen">
          
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            navItems={navItems}
            activeItem={activeItem}
            handleNavItemClick={handleNavItemClick}
            isSmallScreen={isSmallScreen}
            theme={theme}
          />

          <div
            className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
            style={{ marginLeft: isSmallScreen ? 0 : sidebarWidth }}
          >
            {/* Banner de estación */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 20px',
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                style={{
                  marginRight: '10px',
                  display: 'inline-block',
                }}
              >
                {new Date().toLocaleDateString('es-EC', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                - {getSeason()}
              </Typography>
            </div>

            <Header toggleSidebar={toggleSidebar} />

            <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
              <div className="h-full w-full">
                <Routes>
                  <Route path="/" element={<Home theme={theme} />} />
                  <Route
                    path="/comunidad"
                    element={<Comunidad theme={theme} />}
                  />
                  <Route path="/fauna" element={<Fauna theme={theme} />} />
                  <Route path="/flora" element={<Flora theme={theme} />} />
                  <Route path="/juegos" element={<Juegos theme={theme} />} />
                  <Route path="/mapa" element={<Mapa theme={theme} />} />
                  <Route
                    path="/reviews"
                    element={<Reviews theme={theme} />}
                  />
                  <Route path="/rankings" element={<GameRankings />} />
                  <Route
                    path="/pdf"
                    element={<PDFViewer pdfUrl="/cuadernillo.pdf" />}
                  />
                  <Route
                    path="/upload"
                    element={<UploadPage theme={theme} />}
                  />
                  <Route
                    path="/gallery"
                    element={<GalleryPage theme={theme} />}
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  );
}
