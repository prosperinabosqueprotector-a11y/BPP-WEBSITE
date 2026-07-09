import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Grid, IconButton } from '@mui/material';
import { Timer, Refresh, EmojiEvents, Star } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const CROSSWORD_CONFIG = {
  rows: 8,
  cols: 9,
  gridModel: [
    ['#', '#', '#', '#', '#', 'G', '#', '#', '#'],
    ['#', 'A', '#', '#', '#', 'U', '#', '#', '#'],
    ['#', 'C', '#', 'C', '#', 'A', '#', '#', 'H'],
    ['#', 'A', '#', 'E', '#', 'Y', '#', '#', 'U'],
    ['#', 'C', '#', 'I', '#', 'A', '#', '#', 'E'],
    ['#', 'I', '#', 'B', '#', 'C', '#', '#', 'V'],
    ['P', 'A', 'L', 'O', 'S', 'A', 'N', 'T', 'O'],
    ['#', '#', '#', '#', '#', 'N', '#', '#', '#'],
  ],
  cellNumbers: { '1-1': 1, '2-3': 2, '0-5': 3, '6-0': 4, '2-8': 5 },
  clues: {
    horizontal: [
      { num: 4, text: "Su madera se quema para incienso." },
    ],
    vertical: [
      { num: 1, text: "Sus flores son compuestas y su tronco es espinoso." },
      { num: 2, text: "Posee tronco grueso y espinas prominentes." },
      { num: 3, text: "Tiene flores grandes de color amarillo." },
      { num: 5, text: "Conocido como cereza de Jamaica." },
    ]
  }
};

const TIME_LIMIT = 180;

const PRE_FILLED_LETTERS = {
  '1-1': 'A',
  '2-3': 'C',
  '0-5': 'G',
  '6-0': 'P',
  '2-8': 'H',
};

export default function CrucigramaBosque() {
  const [userGrid, setUserGrid] = useState({});
  const [bank, setBank] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isActive, setIsActive] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing');
  const config = CROSSWORD_CONFIG;

  const generateBank = (grid) => {
    let letters = [];
    grid.forEach(row => {
      row.forEach(char => {
        if (char !== '#') letters.push(char);
      });
    });
    const extra = 'AEIOU';
    for (let i = 0; i < 5; i++) {
      letters.push(extra[Math.floor(Math.random() * extra.length)]);
    }
    const bankLetters = letters
      .map((char, i) => ({ id: i, char, used: false }))
      .sort(() => Math.random() - 0.5);

    Object.values(PRE_FILLED_LETTERS).forEach((letter) => {
      const idx = bankLetters.findIndex(l => l.char === letter && !l.used);
      if (idx !== -1) bankLetters[idx].used = true;
    });

    return bankLetters;
  };

  useEffect(() => {
    setBank(generateBank(config.gridModel));
    setUserGrid({ ...PRE_FILLED_LETTERS });
    setSelectedCell(null);
    setTimeLeft(TIME_LIMIT);
    setIsActive(true);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setGameStatus('lost');
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleCellClick = (r, c) => {
    if (!isActive || config.gridModel[r][c] === '#') return;
    const key = `${r}-${c}`;

    if (PRE_FILLED_LETTERS[key]) return;

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
  };

  const handleTerminar = () => {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (config.gridModel[r][c] !== '#') {
          if (!userGrid[`${r}-${c}`]) {
            setGameStatus('incomplete');
            return;
          }
          if (userGrid[`${r}-${c}`] !== config.gridModel[r][c]) {
            setGameStatus('wrong');
            return;
          }
        }
      }
    }
    setGameStatus('won');
    setIsActive(false);
  };

  const resetGame = () => {
    setBank(generateBank(config.gridModel));
    setUserGrid({ ...PRE_FILLED_LETTERS });
    setSelectedCell(null);
    setTimeLeft(TIME_LIMIT);
    setIsActive(true);
    setGameStatus('playing');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #F5E0B0 0%, #E8C88E 100%)',
          border: '3px solid #C45B28',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#5D4037', fontWeight: 800 }}>
            Crucigrama
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#D7CCC8', p: 0.5, px: 1.5, borderRadius: 3 }}>
              <Timer fontSize="small" sx={{ color: '#5D4037' }} />
              <Typography sx={{ fontWeight: 700, color: '#5D4037', fontSize: '0.85rem' }}>{timeLeft}s</Typography>
            </Box>
            <IconButton onClick={resetGame} size="small" sx={{ color: '#5D4037' }}>
              <Refresh fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(timeLeft / TIME_LIMIT) * 100}
          sx={{
            mb: 2.5, height: 6, borderRadius: 3,
            bgcolor: '#D7CCC8',
            '& .MuiLinearProgress-bar': { bgcolor: '#C45B28' }
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
              gap: '4px',
              bgcolor: '#5D4037',
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: 420,
              width: '100%',
            }}>
              {config.gridModel.map((row, r) =>
                row.map((cellModel, c) => {
                  const key = `${r}-${c}`;
                  const isBlock = cellModel === '#';
                  const isPrefilled = !!PRE_FILLED_LETTERS[key];
                  const userChar = userGrid[key];
                  const cellNum = config.cellNumbers[key];
                  const isSelected = selectedCell === key;

                  return (
                    <Box
                      key={key}
                      onClick={() => handleCellClick(r, c)}
                      sx={{
                        width: '100%',
                        aspectRatio: '1/1',
                        bgcolor: isBlock ? 'transparent' : (isPrefilled ? '#FFECB3' : (isSelected ? '#FFE0B2' : '#FFFDE7')),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                        cursor: isBlock || isPrefilled ? 'default' : 'pointer',
                        borderRadius: 0.5,
                        transition: 'all 0.15s',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: isSelected ? 2 : 0,
                        border: isBlock ? 'none' : (isPrefilled ? '2px solid #C45B28' : '1px solid #BCAAA4'),
                      }}
                    >
                      {cellNum && (
                        <Typography sx={{
                          position: 'absolute', top: 1, left: 2,
                          fontSize: '0.55rem', fontWeight: 900, color: '#C45B28'
                        }}>
                          {cellNum}
                        </Typography>
                      )}
                      <Typography sx={{
                        fontSize: { xs: '0.8rem', md: '1rem' },
                        fontWeight: 700,
                        color: isPrefilled ? '#C45B28' : '#5D4037',
                      }}>
                        {userChar}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Box>

            <Typography sx={{ mt: 2, mb: 1, color: '#8D6E63', fontSize: '0.8rem', fontWeight: 500 }}>
              Selecciona una casilla y luego una letra
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center', maxWidth: 360 }}>
              {bank.map((l) => (
                <Button
                  key={l.id}
                  variant={l.used ? 'outlined' : 'contained'}
                  onClick={() => handleBankLetterClick(l)}
                  disabled={!isActive || l.used || !selectedCell}
                  sx={{
                    minWidth: 36, height: 36,
                    fontWeight: 700, fontSize: '0.85rem',
                    opacity: l.used ? 0.3 : 1,
                    borderRadius: 2,
                    bgcolor: '#4CAF50',
                    '&:hover': { bgcolor: '#388E3C' },
                    '&.Mui-disabled': { bgcolor: '#A5D6A7', color: '#FFF' }
                  }}
                >
                  {l.char}
                </Button>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{
              p: 2.5,
              bgcolor: '#FFFDE7',
              border: '2px solid #C45B28',
              borderRadius: 3,
            }}>
              <Typography sx={{
                fontSize: '0.95rem', fontWeight: 700, color: '#5D4037',
                borderBottom: '2px solid #C45B28', pb: 1, mb: 2,
              }}>
                Pistas
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography sx={{
                  fontSize: '0.75rem', fontWeight: 700, color: '#FFF',
                  bgcolor: '#C45B28', display: 'inline-block', px: 1.5, py: 0.3,
                  borderRadius: 1, mb: 1,
                }}>
                  Horizontales
                </Typography>
                {config.clues.horizontal.map((c, i) => (
                  <Typography key={i} sx={{ mt: 1, ml: 1, fontSize: '0.8rem', color: '#5D4037' }}>
                    <Box component="span" fontWeight="900" color="#C45B28" mr={0.5}>{c.num}.</Box>
                    {c.text}
                  </Typography>
                ))}
              </Box>

              <Box>
                <Typography sx={{
                  fontSize: '0.75rem', fontWeight: 700, color: '#FFF',
                  bgcolor: '#6B7B3A', display: 'inline-block', px: 1.5, py: 0.3,
                  borderRadius: 1, mb: 1,
                }}>
                  Verticales
                </Typography>
                {config.clues.vertical.map((c, i) => (
                  <Typography key={i} sx={{ mt: 1, ml: 1, fontSize: '0.8rem', color: '#5D4037' }}>
                    <Box component="span" fontWeight="900" color="#6B7B3A" mr={0.5}>{c.num}.</Box>
                    {c.text}
                  </Typography>
                ))}
              </Box>

              <Button
                onClick={handleTerminar}
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: '#C45B28',
                  '&:hover': { bgcolor: '#A63A1E' },
                  borderRadius: 3,
                  px: 5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(196,91,40,0.4)',
                }}
              >
                Terminar
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <AnimatePresence>
          {gameStatus === 'won' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 1300,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Paper sx={{
                  p: 4, textAlign: 'center', borderRadius: 4,
                  background: 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 50%, #FFEE58 100%)',
                  border: '4px solid #F9A825',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  maxWidth: 380, mx: 2,
                }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <EmojiEvents sx={{ fontSize: 70, color: '#F9A825' }} />
                  </motion.div>

                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#E65100', mt: 1 }}>
                    Felicitaciones!
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, my: 1 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
                      >
                        <Star sx={{ color: '#F9A825', fontSize: 28 }} />
                      </motion.div>
                    ))}
                  </Box>

                  <Typography sx={{ fontSize: '1rem', color: '#5D4037', fontWeight: 600, mb: 0.5 }}>
                    Completaste el crucigrama!
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#8D6E63', mb: 2.5, lineHeight: 1.5 }}>
                    Eres muy inteligente y aprendes rapido. Los arboles del bosque estan orgullosos de ti!
                  </Typography>

                  <Button
                    onClick={resetGame}
                    variant="contained"
                    startIcon={<Refresh />}
                    sx={{
                      bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' },
                      borderRadius: 3, px: 4, fontWeight: 700,
                    }}
                  >
                    Jugar de nuevo
                  </Button>
                </Paper>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameStatus === 'lost' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', borderRadius: 2, textAlign: 'center', border: '2px solid #EF5350' }}>
            <Typography sx={{ color: '#C62828', fontWeight: 700, fontSize: '1.1rem' }}>
              Tiempo agotado!
            </Typography>
            <Button onClick={resetGame} variant="contained" sx={{ mt: 1, bgcolor: '#EF5350', '&:hover': { bgcolor: '#D32F2F' } }}>
              Intentar de nuevo
            </Button>
          </Box>
        )}

        {gameStatus === 'incomplete' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFF3E0', borderRadius: 2, textAlign: 'center', border: '2px solid #FF9800' }}>
            <Typography sx={{ color: '#E65100', fontWeight: 700, fontSize: '1rem' }}>
              Faltan casillas por completar!
            </Typography>
            <Typography sx={{ color: '#BF360C', fontSize: '0.85rem', mt: 0.5 }}>
              Llena todas las casillas antes de terminar.
            </Typography>
            <Button onClick={() => setGameStatus('playing')} variant="contained" sx={{ mt: 1.5, bgcolor: '#FF9800', '&:hover': { bgcolor: '#F57C00' } }}>
              Seguir jugando
            </Button>
          </Box>
        )}

        {gameStatus === 'wrong' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', borderRadius: 2, textAlign: 'center', border: '2px solid #EF5350' }}>
            <Typography sx={{ color: '#C62828', fontWeight: 700, fontSize: '1rem' }}>
              Algunas respuestas estan incorrectas!
            </Typography>
            <Typography sx={{ color: '#B71C1C', fontSize: '0.85rem', mt: 0.5 }}>
              Revisa las pistas e intenta de nuevo.
            </Typography>
            <Button onClick={resetGame} variant="contained" sx={{ mt: 1.5, bgcolor: '#EF5350', '&:hover': { bgcolor: '#D32F2F' } }}>
              Intentar de nuevo
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
