import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Forest, Park } from '@mui/icons-material';

const CrosswordSVG = () => (
  <svg viewBox="0 0 120 100" width="120" height="100">
    {/* Tree */}
    <rect x="55" y="55" width="6" height="20" fill="#5D4037" rx={1} />
    <circle cx="58" cy="42" r="18" fill="#2E7D32" opacity="0.85" />
    <circle cx="46" cy="48" r="12" fill="#388E3C" opacity="0.75" />
    <circle cx="70" cy="48" r="12" fill="#388E3C" opacity="0.75" />
    <circle cx="58" cy="35" r="10" fill="#43A047" opacity="0.7" />
    {/* Ground */}
    <ellipse cx="58" cy="78" rx="30" ry="6" fill="#8D6E63" opacity="0.4" />
    {/* Sparkles */}
    <circle cx="30" cy="25" r="2" fill="#F9A825" opacity="0.8" />
    <circle cx="88" cy="20" r="1.5" fill="#F9A825" opacity="0.7" />
    <circle cx="15" cy="45" r="1.5" fill="#F9A825" opacity="0.6" />
    <circle cx="100" cy="40" r="2" fill="#F9A825" opacity="0.7" />
  </svg>
);

const KidsSVG = () => (
  <svg viewBox="0 0 200 120" width="200" height="120">
    {/* Kid 1 - girl */}
    <circle cx="60" cy="45" r="12" fill="#FFCC80" />
    <circle cx="56" cy="43" r="2" fill="#5D4037" />
    <circle cx="64" cy="43" r="2" fill="#5D4037" />
    <path d="M56 50 Q60 54 64 50" fill="none" stroke="#5D4037" strokeWidth="1.5" />
    <ellipse cx="60" cy="32" rx="14" ry="10" fill="#5D4037" />
    <rect x="52" y="57" width="16" height="22" rx="4" fill="#E53935" />
    <rect x="52" y="79" width="7" height="16" rx="3" fill="#1565C0" />
    <rect x="61" y="79" width="7" height="16" rx="3" fill="#1565C0" />
    {/* Kid 2 - boy */}
    <circle cx="100" cy="45" r="12" fill="#FFCC80" />
    <circle cx="96" cy="43" r="2" fill="#5D4037" />
    <circle cx="104" cy="43" r="2" fill="#5D4037" />
    <path d="M96 50 Q100 54 104 50" fill="none" stroke="#5D4037" strokeWidth="1.5" />
    <rect x="90" y="30" width="20" height="8" rx="3" fill="#5D4037" />
    <rect x="92" y="57" width="16" height="22" rx="4" fill="#1E88E5" />
    <rect x="92" y="79" width="7" height="16" rx="3" fill="#5D4037" />
    <rect x="101" y="79" width="7" height="16" rx="3" fill="#5D4037" />
    {/* Kid 3 - with flag */}
    <circle cx="145" cy="40" r="12" fill="#FFCC80" />
    <circle cx="141" cy="38" r="2" fill="#5D4037" />
    <circle cx="149" cy="38" r="2" fill="#5D4037" />
    <path d="M141 45 Q145 49 149 45" fill="none" stroke="#5D4037" strokeWidth="1.5" />
    <rect x="135" y="25" width="20" height="8" rx="3" fill="#F9A825" />
    <rect x="137" y="52" width="16" height="24" rx="4" fill="#6D4C41" />
    <rect x="137" y="76" width="7" height="18" rx="3" fill="#FFF" />
    <rect x="146" y="76" width="7" height="18" rx="3" fill="#FFF" />
    {/* Flag */}
    <line x1="160" y1="20" x2="160" y2="60" stroke="#5D4037" strokeWidth="2" />
    <path d="M160 20 L175 28 L160 36 Z" fill="#7B1FA2" />
    {/* Ground */}
    <ellipse cx="100" cy="98" rx="80" ry="8" fill="#8D6E63" opacity="0.3" />
  </svg>
);

export default function SolutionPage() {
  const isMobile = useMediaQuery('(max-width:768px)');

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
      {/* Left: Solucionario */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #C5E1A5 0%, #AED581 50%, #9CCC65 100%)',
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
            bgcolor: '#C45B28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>11</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              color: '#C45B28',
              fontWeight: 800,
              textAlign: 'center',
              mb: 3,
              mt: 1,
              lineHeight: 1.3,
            }}
          >
            Solucionario de las Actividades
          </Typography>
        </motion.div>

        {/* Crucigrama */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#5D4037', mb: 1.5, textAlign: 'center' }}>
              Crucigrama
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#C45B28', mb: 0.5 }}>
                  Verticales y Horizontales:
                </Typography>
                {['Acacia', 'Ceibo', 'Guayacan', 'PaloSanto', 'Huevo'].map((word, i) => (
                  <Typography key={i} sx={{ fontSize: '0.85rem', color: '#5D4037', lineHeight: 1.8 }}>
                    {i + 1}. {word}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Sopa de Letras */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#5D4037', mb: 1.5, textAlign: 'center' }}>
              Sopa de Letras
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {['HUEVO', 'ACACIA', 'CEIBO', 'GUAYACAN', 'AMARILLO', 'PALOSANTO'].map((word, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: '#C45B28',
                    color: '#FFF',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}
                >
                  {word}
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Kids illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}
        >
          <KidsSVG />
        </motion.div>
      </Box>

      {/* Right: Mensaje final */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          borderLeft: isMobile ? 'none' : '3px dashed #6B7B3A',
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
            bgcolor: '#6B7B3A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>12</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ textAlign: 'center', width: '100%', maxWidth: 420 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
          >
            <CrosswordSVG />
          </motion.div>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: '#5D4037',
              lineHeight: 1.8,
              fontWeight: 500,
              textAlign: 'justify',
            }}
          >
            <Box component="span" sx={{ fontWeight: 900, color: '#C45B28' }}>Recuerda, el bosque</Box>{' '}
            es como un gran <Box component="span" sx={{ fontWeight: 900 }}>parque mágico</Box> que necesita de <Box component="span" sx={{ fontWeight: 900 }}>heroes como tú!</Box> Cada vez que cuidas una planta, ahorras agua o evitas tirar basura, ayudas a los animales y plantas que{' '}
            <Box component="span" sx={{ fontWeight: 900 }}>viven allí</Box>{' '}
            a estar felices y saludables.{' '}
            <Box component="span" sx={{ fontWeight: 900, color: '#6B7B3A' }}>¡Sé El Guardian del bosque</Box>{' '}
            y protege su magia para que siempre tengamos un lugar increíble donde{' '}
            <Box component="span" sx={{ fontWeight: 900, color: '#C45B28' }}>jugar y aprender juntos!</Box>
          </Typography>
        </motion.div>

        {/* Decorative floating leaves */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 8 : -8, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              right: `${10 + (i % 3) * 15}%`,
              opacity: 0.15,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" fill="#6B7B3A" />
            </svg>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
