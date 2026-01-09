import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Grid, IconButton, Chip } from '@mui/material';
import { Timer, Refresh, EmojiNature } from '@mui/icons-material';
import ScoreModal from './ScoreModal'; 

// --- CONFIGURACIÓN DE NIVELES ---

const CROSSWORD_LEVELS = [
  // NIVEL 1: Conceptos Básicos
  {
    id: 1,
    rows: 5,
    cols: 5,
    gridModel: [
      ['F', 'A', 'U', 'N', 'A'],
      ['#', 'R', '#', '#', 'G'],
      ['#', 'B', '#', '#', 'U'],
      ['S', 'O', 'L', '#', 'A'],
      ['#', 'L', '#', '#', '#'],
    ],
    cellNumbers: { '0-0': 1, '0-1': 2, '0-4': 3, '3-0': 4 },
    clues: {
      horizontal: [
        { num: 1, text: "Conjunto de animales de una región." },
        { num: 4, text: "Astro rey que nos da luz." }
      ],
      vertical: [
        { num: 2, text: "Planta de tronco leñoso." },
        { num: 3, text: "Líquido vital para la vida." }
      ]
    }
  },
  // NIVEL 2: Elementos y Animales
  {
    id: 2,
    rows: 5,
    cols: 6,
    gridModel: [
      ['A', 'G', 'U', 'A', '#', '#'],
      ['R', '#', '#', '#', '#', '#'],
      ['B', '#', '#', '#', '#', '#'],
      ['O', '#', 'R', 'I', 'O', '#'],
      ['L', 'U', 'Z', '#', '#', '#'],
    ],
    cellNumbers: { '0-0': 1, '3-2': 2, '4-0': 3 }, 
    clues: {
      horizontal: [
        { num: 1, text: "Cae de la lluvia y llena los ríos." },
        { num: 2, text: "Corriente natural de agua." },
        { num: 3, text: "Claridad que nos permite ver." }
      ],
      vertical: [
        { num: 1, text: "Tiene raíces, tronco y hojas." }
      ]
    }
  },
  // NIVEL 3: Fauna Específica (Tigre, Oso)
  {
    id: 3,
    rows: 5,
    cols: 5,
    gridModel: [
      ['T', 'I', 'G', 'R', 'E'],
      ['#', '#', '#', 'I', '#'],
      ['#', 'O', 'S', 'O', '#'],
      ['#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#'],
    ],
    cellNumbers: { '0-0': 1, '0-3': 2, '2-1': 3 },
    clues: {
      horizontal: [
        { num: 1, text: "Felino grande y rayado." },
        { num: 3, text: "Animal peludo que ama la miel." }
      ],
      vertical: [
        { num: 2, text: "Cuerpo de agua que corre al mar." }
      ]
    }
  },
  // NIVEL 4: Botánica (Fruta, Tallo, Rama)
  {
    id: 4,
    rows: 5,
    cols: 6,
    gridModel: [
      ['F', 'R', 'U', 'T', 'A', '#'],
      ['#', 'A', '#', '#', '#', '#'],
      ['T', 'A', 'L', 'L', 'O', '#'],
      ['#', 'M', '#', '#', '#', '#'],
      ['#', 'A', '#', '#', '#', '#'],
    ],
    cellNumbers: { '0-0': 1, '2-0': 2, '0-1': 3 },
    clues: {
      horizontal: [
        { num: 1, text: "Parte comestible de algunas plantas." },
        { num: 2, text: "Sostiene las hojas y las flores." }
      ],
      vertical: [
        { num: 3, text: "Extensión leñosa del tronco." }
      ]
    }
  },
  // NIVEL 5: Clima y Cielo (Viento, Nube, Ave)
  {
    id: 5,
    rows: 5,
    cols: 6,
    gridModel: [
      ['V', 'I', 'E', 'N', 'T', 'O'],
      ['#', '#', '#', 'U', '#', '#'],
      ['#', '#', 'A', 'V', 'E', '#'],
      ['#', '#', '#', 'E', '#', '#'],
      ['#', '#', '#', '#', '#', '#'],
    ],
    cellNumbers: { '0-0': 1, '2-2': 2, '0-3': 3 },
    clues: {
      horizontal: [
        { num: 1, text: "Aire en movimiento." },
        { num: 2, text: "Animal que tiene plumas y vuela." }
      ],
      vertical: [
        { num: 3, text: "Masa blanca en el cielo que trae lluvia." }
      ]
    }
  }
];

const TIME_LIMIT = 180; 

export default function CrosswordGame() {
  // CORRECCIÓN: Inicializamos con un valor aleatorio directo
  const [levelIndex, setLevelIndex] = useState(() => Math.floor(Math.random() * CROSSWORD_LEVELS.length));
  
  const [userGrid, setUserGrid] = useState({}); 
  const [bank, setBank] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); 

  const currentLevel = CROSSWORD_LEVELS[levelIndex];

  // Generador automático de letras
  const generateBank = (grid) => {
    let letters = [];
    grid.forEach(row => {
      row.forEach(char => {
        if (char !== '#') letters.push(char);
      });
    });
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 5; i++) {
      letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return letters
      .map((char, i) => ({ id: i, char, used: false }))
      .sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    // Al montar, solo inicializamos el juego con el levelIndex que ya calculamos aleatoriamente
    initLevel(currentLevel);
  }, []); // Solo se ejecuta una vez al montar

  const initLevel = (levelConfig) => {
    setBank(generateBank(levelConfig.gridModel));
    setUserGrid({});
    setSelectedCell(null);
    setTimeLeft(TIME_LIMIT);
    setIsActive(true);
    setIsGameOver(false);
    setGameStatus('playing');
    setScore(0);
  };

  const startNewGame = (forceRandom = false) => {
    let nextLevelIdx = levelIndex;
    
    if (forceRandom) {
        // Lógica para elegir uno nuevo distinto al actual
        do {
          nextLevelIdx = Math.floor(Math.random() * CROSSWORD_LEVELS.length);
        } while (nextLevelIdx === levelIndex && CROSSWORD_LEVELS.length > 1);
        
        setLevelIndex(nextLevelIdx);
        // NOTA: Como setLevelIndex es asíncrono, usamos el objeto directo del array
        initLevel(CROSSWORD_LEVELS[nextLevelIdx]);
    } else {
        // Reiniciar el mismo nivel
        initLevel(currentLevel);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleCellClick = (r, c) => {
    if (!isActive) return;
    const key = `${r}-${c}`;
    
    if (currentLevel.gridModel[r][c] === '#') return;

    if (userGrid[key]) {
      const charToRemove = userGrid[key];
      const bankIndex = bank.findIndex(l => l.char === charToRemove && l.used);
      if (bankIndex !== -1) {
        const newBank = [...bank];
        newBank[bankIndex].used = false;
        setBank(newBank);
      }
      
      const newUserGrid = { ...userGrid };
      delete newUserGrid[key];
      setUserGrid(newUserGrid);
      setSelectedCell(key);
      return;
    }

    setSelectedCell(key);
  };

  const handleBankLetterClick = (letterObj) => {
    if (!isActive || !selectedCell || letterObj.used) return;

    const newUserGrid = { ...userGrid, [selectedCell]: letterObj.char };
    setUserGrid(newUserGrid);

    const newBank = bank.map(l => l.id === letterObj.id ? { ...l, used: true } : l);
    setBank(newBank);

    setSelectedCell(null);
    checkWin(newUserGrid);
  };

  const checkWin = (currentGrid) => {
    let isFull = true;
    let isCorrect = true;

    for (let r = 0; r < currentLevel.rows; r++) {
      for (let c = 0; c < currentLevel.cols; c++) {
        const correctChar = currentLevel.gridModel[r][c];
        if (correctChar !== '#') {
          const key = `${r}-${c}`;
          if (!currentGrid[key]) isFull = false;
          if (currentGrid[key] !== correctChar) isCorrect = false;
        }
      }
    }

    if (isFull && isCorrect) {
      finishGame(true);
    }
  };

  const finishGame = (won) => {
    setIsActive(false);
    if (won) {
      setGameStatus('won');
      setScore(100 + timeLeft);
    } else {
      setGameStatus('lost');
      setScore(0);
    }
    setIsGameOver(true);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
             <Typography variant="h5" color="primary.dark" fontWeight="bold">🧩 Crucigrama</Typography>
             <Chip label={`Nivel ${currentLevel.id}`} color="primary" size="small" variant="outlined"/>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#c8e6c9', p: 0.5, px: 2, borderRadius: 4 }}>
                <Timer fontSize="small" color="action" />
                <Typography fontWeight="bold" color="primary.dark">{timeLeft}s</Typography>
            </Box>
            <IconButton onClick={() => startNewGame(true)} color="primary" size="small">
                <Refresh />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={(timeLeft / TIME_LIMIT) * 100} 
          sx={{ mb: 4, height: 8, borderRadius: 5, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#66bb6a' } }}
        />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${currentLevel.cols}, 1fr)`, 
                  gap: '6px', 
                  bgcolor: '#263238', 
                  p: 1.5, 
                  borderRadius: 2,
                  boxShadow: 3
              }}>
                  {currentLevel.gridModel.map((row, r) => (
                      row.map((cellModel, c) => {
                          const key = `${r}-${c}`;
                          const isBlock = cellModel === '#';
                          const userChar = userGrid[key];
                          const cellNum = currentLevel.cellNumbers[key];
                          const isSelected = selectedCell === key;

                          return (
                              <Box 
                                  key={key}
                                  onClick={() => handleCellClick(r, c)}
                                  sx={{ 
                                      width: 50, height: 50,
                                      bgcolor: isBlock ? '#37474f' : (isSelected ? '#fff59d' : 'white'),
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      position: 'relative',
                                      cursor: isBlock ? 'default' : 'pointer',
                                      borderRadius: 1,
                                      transition: 'all 0.15s ease-in-out',
                                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                      boxShadow: isSelected ? 2 : 0
                                  }}
                              >
                                  {cellNum && (
                                      <Typography sx={{ position: 'absolute', top: 2, left: 4, fontSize: '0.65rem', fontWeight: '900', color: '#546e7a' }}>
                                          {cellNum}
                                      </Typography>
                                  )}
                                  <Typography variant="h5" fontWeight="bold" color="primary.dark">
                                      {userChar}
                                  </Typography>
                              </Box>
                          )
                      })
                  ))}
              </Box>

              <Typography variant="body2" sx={{ mt: 3, mb: 1.5, color: 'text.secondary', fontWeight: 'medium' }}>
                  <EmojiNature fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }}/>
                  Selecciona una casilla y luego una letra:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 360 }}>
                  {bank.map((l) => (
                      <Button
                          key={l.id}
                          variant={l.used ? "outlined" : "contained"}
                          color="success" 
                          size="small"
                          onClick={() => handleBankLetterClick(l)}
                          disabled={!isActive || l.used || !selectedCell}
                          sx={{ 
                              minWidth: 40, height: 40, 
                              fontWeight: 'bold', fontSize: '1.1rem',
                              opacity: l.used ? 0.3 : 1,
                              borderRadius: 2,
                              boxShadow: l.used ? 'none' : 2
                          }}
                      >
                          {l.char}
                      </Button>
                  ))}
              </Box>
          </Grid>

          <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
                  <Typography variant="h6" color="success.dark" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #a5d6a7', pb: 1, mb: 2 }}>
                      Pistas
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#1b5e20', bgcolor: '#c8e6c9', display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, mb: 1 }}>
                          ➡️ Horizontales
                      </Typography>
                      {currentLevel.clues.horizontal.map((c, i) => (
                          <Typography key={i} variant="body2" sx={{ mt: 1, ml: 1, color: 'text.primary' }}>
                              <Box component="span" fontWeight="bold" color="success.main" mr={1}>{c.num}.</Box> {c.text}
                          </Typography>
                      ))}
                  </Box>

                  <Box>
                      <Typography variant="subtitle2" sx={{ color: '#01579b', bgcolor: '#b3e5fc', display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, mb: 1 }}>
                          ⬇️ Verticales
                      </Typography>
                      {currentLevel.clues.vertical.map((c, i) => (
                          <Typography key={i} variant="body2" sx={{ mt: 1, ml: 1, color: 'text.primary' }}>
                              <Box component="span" fontWeight="bold" color="info.main" mr={1}>{c.num}.</Box> {c.text}
                          </Typography>
                      ))}
                  </Box>
              </Paper>
          </Grid>
        </Grid>

        <ScoreModal 
          open={isGameOver && gameStatus === 'won'} 
          score={score}
          gameId="crossword" 
          onClose={() => startNewGame(true)} 
          onSaveSuccess={() => startNewGame(true)}
        />

        {gameStatus === 'lost' && (
            <Box sx={{ mt: 4, p: 2, bgcolor: '#ffebee', borderRadius: 2, textAlign: 'center', border: '1px solid #ffcdd2' }}>
                <Typography color="error.dark" variant="h6" fontWeight="bold">¡Tiempo agotado!</Typography>
                <Button onClick={() => startNewGame(false)} variant="outlined" color="error" sx={{ mt: 1 }}>Intentar de nuevo</Button>
            </Box>
        )}

      </Paper>
    </Box>
  );
}