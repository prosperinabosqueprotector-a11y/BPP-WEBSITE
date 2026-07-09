import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Button, 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  HelpCenter, 
  Extension, 
  Abc,
  Edit,
  DeleteSweep,
  EmojiEvents,
  EmojiFlags
} from '@mui/icons-material';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const GAMES_CONFIG = [
  { id: 'quiz', title: 'Quiz', icon: <HelpCenter fontSize="large" />, color: '#4caf50' }, // Verde
  { id: 'puzzle', title: 'Puzzle', icon: <Extension fontSize="large" />, color: '#2196f3' }, // Azul
  { id: 'crossword', title: 'Crucigrama', icon: <Edit fontSize="large" />, color: '#ff9800' }, // Naranja
  { id: 'hangman', title: 'Ahorcado', icon: <EmojiFlags fontSize="large" />, color: '#f44336' },
  { id: 'wordsearch', title: 'Sopa de Letras', icon: <Abc fontSize="large" />, color: '#9c27b0' }, // Morado
];

const getMedalColor = (index) => {
  switch (index) {
    case 0: return 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)'; // Oro
    case 1: return 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'; // Plata
    case 2: return 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)'; // Bronce
    default: return '#f5f5f5';
  }
};

export default function GameRankings() {
  const [rankingsData, setRankingsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.rol);
        } catch (error) {
          setRole('estudiante');
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllRankings = async () => {
    setLoading(true);
    const newData = {};
    const promises = GAMES_CONFIG.map(async (game) => {
      try {
        const res = await fetch(`https://bpp-website-1.onrender.com/api/scores/top?gameId=${game.id}`);
        const data = await res.json();
        newData[game.id] = Array.isArray(data) ? data : []; 
      } catch (error) {
        console.error(`Error cargando ranking de ${game.id}`, error);
        newData[game.id] = [];
      }
    });

    await Promise.all(promises);
    setRankingsData(newData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllRankings();
  }, []);

  const handleClearRankings = async () => {
    setClearing(true);
    try {
      const response = await fetch(`https://bpp-website-1.onrender.com/api/scores/clear-all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setShowSuccess(true);
        setOpenConfirm(false);
        fetchAllRankings();
      } else {
        throw new Error("No se pudo limpiar el ranking");
      }
    } catch (error) {
      console.error("Error al limpiar:", error);
      alert("Error al intentar limpiar los rankings.");
    } finally {
      setClearing(false);
    }
  };

  if (loading && Object.keys(rankingsData).length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      
      {/* --- ENCABEZADO --- */}
      <Box sx={{ textAlign: 'center', mb: 8, position: 'relative' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            background: 'linear-gradient(45deg, #1b5e20 30%, #4caf50 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: 2
          }}
        >
          🏆 Salón de la Fama 🏆
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Descubre a los mejores exploradores del bosque en cada desafío.
        </Typography>

        {role === 'profesor' && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={() => setOpenConfirm(true)}
              sx={{ borderRadius: '50px', px: 3, boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)' }}
            >
              Reiniciar Temporada (Borrar Todo)
            </Button>
          </Box>
        )}
      </Box>

      {/* --- GRID PRINCIPAL --- */}
      {/* justifyContent="center" es lo que arregla la asimetría */}
      <Grid container spacing={4} justifyContent="center">
        {GAMES_CONFIG.map((game) => {
          const players = rankingsData[game.id] || []; 
          
          return (
            <Grid item xs={12} sm={6} md={4} key={game.id}>
              <Paper 
                elevation={3} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {/* Cabecera de la Tarjeta */}
                <Box sx={{ 
                    background: `linear-gradient(135deg, ${game.color} 0%, ${game.color}DD 100%)`, 
                    color: 'white', 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    gap: 1,
                    position: 'relative'
                }}>
                  {/* Círculo decorativo detrás del icono */}
                  <Box sx={{ 
                      position: 'absolute', 
                      top: -20, right: -20, 
                      width: 80, height: 80, 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '50%' 
                  }} />
                  
                  <Avatar sx={{ 
                      width: 56, height: 56, 
                      bgcolor: 'white', 
                      color: game.color,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}>
                      {game.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>{game.title}</Typography>
                </Box>

                {/* Lista de Jugadores */}
                <Box sx={{ bgcolor: '#fafafa', flexGrow: 1, minHeight: '320px', p: 0 }}>
                  <List sx={{ p: 0 }}>
                    {players.length > 0 ? (
                      players.map((player, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="center" sx={{ py: 1.5, px: 2 }}>
                            <ListItemAvatar>
                              <Avatar 
                                sx={{ 
                                  background: getMedalColor(index), 
                                  color: index < 3 ? 'white' : '#757575', 
                                  fontWeight: 'bold',
                                  width: 32, height: 32,
                                  fontSize: '0.9rem',
                                  border: index < 3 ? '1px solid rgba(255,255,255,0.5)' : 'none'
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="bold" color="text.primary">
                                  {player.user}
                                </Typography>
                              }
                              secondary={
                                <Chip 
                                  label={`${player.score} pts`} 
                                  size="small" 
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem', 
                                    fontWeight: 'bold',
                                    bgcolor: '#e8f5e9', 
                                    color: '#2e7d32' 
                                  }} 
                                />
                              }
                            />
                            {index === 0 && <EmojiEvents sx={{ color: '#FFD700' }} />}
                          </ListItem>
                          {index < players.length - 1 && <Divider variant="middle" component="li" sx={{ opacity: 0.6 }} />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0.6 }}>
                        <Typography variant="body2">Aún no hay récords registrados.</Typography>
                        <Typography variant="caption" sx={{ mt: 1 }}>¡Juega para aparecer aquí!</Typography>
                      </Box>
                    )}
                  </List>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Diálogo de Confirmación */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          ⚠️ Zona de Peligro
        </DialogTitle>
        <DialogContent>
          <Typography>
            Estás a punto de borrar <strong>TODOS</strong> los puntajes de la base de datos.
            <br /><br />
            Esto reiniciará la competencia para todos los alumnos. ¿Estás seguro?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleClearRankings} 
            color="error" 
            variant="contained" 
            disabled={clearing}
            startIcon={clearing && <CircularProgress size={20} color="inherit" />}
          >
            {clearing ? "Borrando..." : "Sí, borrar todo"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%', boxShadow: 3 }}>
          ¡Rankings reiniciados con éxito!
        </Alert>
      </Snackbar>
    </Container>
  );
}