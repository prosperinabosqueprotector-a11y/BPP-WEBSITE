import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, useMediaQuery, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Brush, Download, Delete } from '@mui/icons-material';

const FLOWER_COLORS = ['#C62828', '#2E7D32', '#F9A825', '#795548', '#6A1B9A', '#D81B60'];

const PALETTE = [
  '#C62828', '#D32F2F', '#E53935',
  '#2E7D32', '#388E3C', '#43A047',
  '#F9A825', '#FBC02D', '#FFD54F',
  '#795548', '#8D6E63', '#A1887F',
  '#1565C0', '#1E88E5', '#42A5F5',
  '#6A1B9A', '#8E24AA', '#AB47BC',
  '#D81B60', '#E91E63', '#EC407A',
  '#FF6F00', '#FF8F00', '#FFA000',
  '#000000', '#424242', '#FFFFFF',
];

export default function FlowersPage() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'flores_bosque'), (snapshot) => {
      const flowersData = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          scientific: data.scientific,
          image: data.image,
          order: data.order,
          characteristics: data.description
            .split('.')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((s) => s + '.'),
          color: FLOWER_COLORS[index % FLOWER_COLORS.length],
        };
      });

      const sortedFlowers = flowersData.sort((a, b) => a.order - b.order);
      setFlowers(sortedFlowers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = '#FFFDE7';
    ctx.fillRect(0, 0, rect.width, rect.height);
    contextRef.current = ctx;
  }, [loading]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = selectedColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [selectedColor, brushSize]);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const ctx = contextRef.current;
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  }, [getPos]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = contextRef.current;
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    ctx.fillStyle = '#FFFDE7';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'mi-bosque-seco-tropical.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'auto',
      }}
    >
      {/* Left: Conociendo las flores */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#D81B60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>7</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              color: '#D81B60',
              fontWeight: 800,
              textAlign: 'center',
              mb: 3,
              mt: 1,
              lineHeight: 1.3,
            }}
          >
            Conociendo las Flores del Bosque Seco Tropical
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#D81B60' }} />
            </Box>
          ) : (
            flowers.map((flower, index) => (
              <motion.div
                key={flower.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    bgcolor: 'rgba(255,255,255,0.5)',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: `3px solid ${flower.color}`,
                    }}
                  >
                    <Box
                      component="img"
                      src={flower.image}
                      alt={flower.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.45rem', fontWeight: 700, color: '#5D4037' }}>
                      {flower.name}{' '}
                      <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400, fontSize: '1.15rem' }}>
                        ({flower.scientific})
                      </Box>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
                      {flower.characteristics.map((char, i) => (
                        <Box component="li" key={i}>
                          <Typography sx={{ fontSize: '0.9rem', color: '#5D4037', lineHeight: 1.5 }}>
                            {char}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))
          )}
        </Box>
      </Box>

      {/* Right: Actividad de dibujar */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
          borderLeft: isMobile ? 'none' : '3px dashed #D81B60',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#D81B60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>8</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.4rem', md: '1.7rem' },
              color: '#D81B60',
              fontWeight: 800,
              mb: 1,
              mt: 1,
            }}
          >
            Dibujemos!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: '#5D4037',
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            Soltemos esa creatividad. A continuacion dibuja como seria tu Bosque Seco Tropical.
          </Typography>
        </motion.div>

        {/* Color palette */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 1.5, maxWidth: 320 }}>
          {PALETTE.map((color) => (
            <Box
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: color,
                cursor: 'pointer',
                border: selectedColor === color ? '3px solid #5D4037' : '1px solid rgba(0,0,0,0.2)',
                transition: 'all 0.15s',
                '&:hover': { transform: 'scale(1.2)' },
              }}
            />
          ))}
        </Box>

        {/* Brush size */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#5D4037', fontWeight: 600 }}>Trazo:</Typography>
          {[2, 4, 8, 14].map((size) => (
            <Box
              key={size}
              onClick={() => setBrushSize(size)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: brushSize === size ? '#FFE0B2' : 'transparent',
                border: brushSize === size ? '2px solid #C45B28' : '1px solid #CCC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#FFF3E0' },
              }}
            >
              <Box
                sx={{
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  bgcolor: '#5D4037',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Canvas area */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 460,
            height: { xs: 280, md: 340 },
            borderRadius: 2,
            border: '3px solid #C45B28',
            overflow: 'hidden',
            boxShadow: 3,
            bgcolor: '#FFFDE7',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
          />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            onClick={clearCanvas}
            variant="outlined"
            startIcon={<Delete />}
            sx={{
              borderColor: '#C45B28',
              color: '#C45B28',
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              '&:hover': { borderColor: '#A63A1E', bgcolor: 'rgba(196,91,40,0.08)' },
            }}
          >
            Limpiar
          </Button>
          <Button
            onClick={downloadCanvas}
            variant="contained"
            startIcon={<Download />}
            sx={{
              bgcolor: '#C45B28',
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              boxShadow: '0 4px 12px rgba(196,91,40,0.4)',
              '&:hover': { bgcolor: '#A63A1E' },
            }}
          >
            Descargar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
