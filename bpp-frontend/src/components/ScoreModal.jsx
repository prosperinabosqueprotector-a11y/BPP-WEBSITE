import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box
} from '@mui/material';

export default function ScoreModal({ open, score, gameId, onClose, onSaveSuccess }) {
  const [playerName, setPlayerName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!playerName.trim()) return alert("Escribe tu nombre");
    
    setSaving(true);
    try {
      const response = await fetch('https://bpp-website.onrender.com/api/scores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: playerName,
          score: score,
          gameId: gameId 
        }),
      });

      if (response.ok) {
        if (onSaveSuccess) onSaveSuccess(); 
        onClose(); 
        setPlayerName(''); 
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => { /* No cerrar clickeando fuera */ }}>
      <DialogTitle sx={{ textAlign: 'center' }}>🎉 ¡Juego Terminado!</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2, minWidth: '300px' }}>
          <Typography variant="h6" gutterBottom>
             Tu puntaje: <strong>{score}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
             Ingresa tu nombre para el Ranking de {gameId.toUpperCase()}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de Jugador"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="error" disabled={saving}>No Guardar</Button>
        <Button onClick={handleSubmit} variant="contained" color="success" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}