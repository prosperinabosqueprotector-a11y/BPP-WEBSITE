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
  CircularProgress 
} from '@mui/material';
import { 
  EmojiEvents, 
  Extension, 
  HelpCenter, 
  Abc,
  Edit
} from '@mui/icons-material';

const GAMES_CONFIG = [
  { id: 'quiz', title: 'Quiz', icon: <HelpCenter /> },
  { id: 'puzzle', title: 'Puzzle', icon: <Extension /> },
  { id: 'crossword', title: 'Crucigrama', icon: <Edit /> },
  // { id: 'memory' ... } 
  { id: 'hangman', title: 'Ahorcado', icon: <HelpCenter /> }, 
  { id: 'wordsearch', title: 'Sopa de Letras', icon: <Abc /> },
];

const getMedalColor = (index) => {
  switch (index) {
    case 0: return '#FFD700';
    case 1: return '#C0C0C0';
    case 2: return '#CD7F32';
    default: return '#e0e0e0';
  }
};

export default function GameRankings() {
  const [rankingsData, setRankingsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRankings = async () => {
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

    fetchAllRankings();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          🏆 Salón de la Fama 🏆
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {GAMES_CONFIG.map((game) => {
          const players = rankingsData[game.id] || []; 
          
          return (
            <Grid item xs={12} md={6} lg={4} key={game.id}>
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  height: '100%', 
                  display: 'flex',    
                  flexDirection: 'column' 
                }}
              >
                <Box sx={{ bgcolor: '#2e7d32', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'white', color: '#2e7d32' }}>{game.icon}</Avatar>
                  <Typography variant="h6" fontWeight="bold">{game.title}</Typography>
                </Box>

                <Box sx={{ bgcolor: '#f9fbe7', flexGrow: 1, minHeight: '300px' }}>
                  <List sx={{ p: 0 }}>
                    {players.length > 0 ? (
                      players.map((player, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: getMedalColor(index), color: index < 3 ? 'white' : '#424242', fontWeight: 'bold' }}>
                                {index + 1}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Typography fontWeight="bold">{player.user}</Typography>}
                              secondary={`${player.score} pts`}
                            />
                          </ListItem>
                          {index < players.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ p: 4, textAlign: 'center', color: 'gray', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography>Aún no hay récords.</Typography>
                        <Typography variant="caption">¡Sé el primero!</Typography>
                      </Box>
                    )}
                  </List>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}