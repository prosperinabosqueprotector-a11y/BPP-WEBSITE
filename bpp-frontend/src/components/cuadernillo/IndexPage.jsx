import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const INDEX_ITEMS = [
  'Conociendo los árboles del Bosque Seco',
  '¡Colorea una rama de tu árbol favorito!',
  'Crucigrama',
  '¡Sopa de letras!',
  'La fauna del Bosque Seco Tropical',
  '¡Momento de pintar!',
  'Las Flores del Bosque Seco Tropical',
  '¡Hora de soltar tu creatividad!',
  'Juego del Laberinto',
  'Actividades de Reflexión y Comprensión',
  'Solucionario de Actividades',
  'Mensaje Final',
];

const LeafDecor = ({ style }) => (
  <svg viewBox="0 0 60 80" width="50" height="65" style={style}>
    <path
      d="M30 5 Q50 25 45 50 Q40 70 30 75 Q20 70 15 50 Q10 25 30 5Z"
      fill="currentColor"
      opacity="0.5"
    />
    <line x1="30" y1="10" x2="30" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
);

const CreditsItem = ({ label, value }) => (
  <Box sx={{ mb: 2.5, textAlign: 'center' }}>
    <Typography
      sx={{
        fontSize: '0.7rem',
        color: '#C45B28',
        textTransform: 'uppercase',
        letterSpacing: 1,
        mb: 0.3,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: '0.85rem',
        color: '#FFF',
        fontWeight: 700,
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default function IndexPage() {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
      }}
    >
      {/* Left: Quiénes somos */}
      <Box
        sx={{
          width: isMobile ? '100%' : '45%',
          background: 'linear-gradient(135deg, #6B7B3A 0%, #5A6830 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative leaves */}
        <LeafDecor style={{ position: 'absolute', top: 20, left: 15, color: '#8BA04A', transform: 'rotate(-20deg)' }} />
        <LeafDecor style={{ position: 'absolute', bottom: 30, right: 20, color: '#7A9040', transform: 'rotate(30deg)' }} />
        <LeafDecor style={{ position: 'absolute', top: '40%', left: 5, color: '#9AB05A', transform: 'rotate(-45deg)', opacity: 0.3 }} />

        {/* Decorative dots */}
        {[...Array(12)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 6 + (i % 3) * 2,
              height: 6 + (i % 3) * 2,
              borderRadius: '50%',
              bgcolor: i % 2 === 0 ? '#C45B28' : '#D4A04A',
              opacity: 0.3 + (i % 4) * 0.1,
              top: `${10 + (i * 7) % 80}%`,
              left: `${5 + (i * 11) % 90}%`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              color: '#C45B28',
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            ¿Quiénes somos?
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CreditsItem label="Hecho por" value="Bolívar Pérez" />
          <CreditsItem label="Director" value="Félix Morales" />
          <CreditsItem label="Tutor" value="Mónica Robles" />
          <CreditsItem label="Proyecto" value="Uso Sostenible de Unidades de Conservación" />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.65rem', color: '#D4A04A', letterSpacing: 0.5 }}>
              Programa de
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 600, lineHeight: 1.4 }}>
              Aprovechamiento de servicios ecosistémicos en áreas agrícolas y unidades de conservación
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Right: Índice */}
      <Box
        sx={{
          width: isMobile ? '100%' : '55%',
          background: 'linear-gradient(135deg, #E8A060 0%, #D4904A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', md: '1.8rem' },
              color: '#5D4037',
              fontWeight: 700,
              mb: 3,
              textAlign: 'center',
            }}
          >
            Índice
          </Typography>
        </motion.div>

        {/* Index list */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.85)',
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            width: '100%',
            maxWidth: 420,
            border: '3px solid #C45B28',
          }}
        >
          {INDEX_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  borderBottom: index < INDEX_ITEMS.length - 1 ? '1px solid #E8D8C0' : 'none',
                }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: '2px solid #C45B28',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: '0.65rem', color: '#C45B28', fontWeight: 700 }}>
                    {index + 1}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '0.72rem', md: '0.8rem' },
                    color: '#5D4037',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
