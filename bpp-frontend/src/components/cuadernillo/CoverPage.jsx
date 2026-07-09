import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FallingLeaves from './FallingLeaves';

const SlothSVG = () => (
  <motion.svg
    viewBox="0 0 200 240"
    width="180"
    height="220"
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    {/* Body */}
    <ellipse cx="100" cy="150" rx="55" ry="65" fill="#8B6E4E" />
    {/* Head */}
    <circle cx="100" cy="85" r="40" fill="#A0825E" />
    {/* Face mask */}
    <ellipse cx="100" cy="90" rx="28" ry="25" fill="#D4B896" />
    {/* Eyes */}
    <ellipse cx="88" cy="82" rx="6" ry="5" fill="#3E2723" />
    <ellipse cx="112" cy="82" rx="6" ry="5" fill="#3E2723" />
    {/* Eye patches */}
    <ellipse cx="88" cy="78" rx="8" ry="6" fill="#5D4037" opacity="0.5" />
    <ellipse cx="112" cy="78" rx="8" ry="6" fill="#5D4037" opacity="0.5" />
    {/* Nose */}
    <ellipse cx="100" cy="92" rx="5" ry="3" fill="#3E2723" />
    {/* Smile */}
    <path d="M92 98 Q100 106 108 98" fill="none" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    {/* Left arm */}
    <path d="M55 130 Q30 110 25 80" fill="none" stroke="#8B6E4E" strokeWidth="14" strokeLinecap="round" />
    {/* Right arm holding branch */}
    <path d="M145 130 Q170 110 175 80" fill="none" stroke="#8B6E4E" strokeWidth="14" strokeLinecap="round" />
    {/* Branch */}
    <path d="M160 75 Q180 60 195 65" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
    {/* Leaves on branch */}
    <ellipse cx="185" cy="58" rx="10" ry="6" fill="#4CAF50" transform="rotate(-20 185 58)" />
    <ellipse cx="195" cy="62" rx="8" ry="5" fill="#66BB6A" transform="rotate(10 195 62)" />
    <ellipse cx="175" cy="55" rx="9" ry="5" fill="#43A047" transform="rotate(-30 175 55)" />
    {/* Claws left */}
    <line x1="22" y1="78" x2="18" y2="70" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="76" x2="22" y2="68" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="75" x2="27" y2="67" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    {/* Claws right */}
    <line x1="178" y1="78" x2="182" y2="70" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    <line x1="174" y1="76" x2="178" y2="68" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    <line x1="170" y1="75" x2="173" y2="67" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    {/* Legs */}
    <path d="M75 200 Q65 220 55 230" fill="none" stroke="#8B6E4E" strokeWidth="12" strokeLinecap="round" />
    <path d="M125 200 Q135 220 145 230" fill="none" stroke="#8B6E4E" strokeWidth="12" strokeLinecap="round" />
  </motion.svg>
);

const TreeLeft = () => (
  <svg viewBox="0 0 120 300" width="120" height="300" style={{ position: 'absolute', left: 0, bottom: 0, opacity: 0.85 }}>
    <rect x="50" y="120" width="18" height="180" fill="#5D4037" rx="4" />
    <ellipse cx="60" cy="100" rx="55" ry="70" fill="#4CAF50" />
    <ellipse cx="40" cy="80" rx="35" ry="45" fill="#66BB6A" />
    <ellipse cx="80" cy="90" rx="30" ry="40" fill="#43A047" />
  </svg>
);

const TreeRight = () => (
  <svg viewBox="0 0 120 300" width="120" height="300" style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.85 }}>
    <rect x="52" y="130" width="16" height="170" fill="#5D4037" rx="4" />
    <ellipse cx="60" cy="110" rx="50" ry="65" fill="#388E3C" />
    <ellipse cx="45" cy="95" rx="30" ry="40" fill="#4CAF50" />
    <ellipse cx="75" cy="100" rx="28" ry="35" fill="#2E7D32" />
  </svg>
);

const GroundPlants = () => (
  <svg viewBox="0 0 600 80" width="100%" height="80" style={{ position: 'absolute', bottom: 0, left: 0 }}>
    {/* Ground */}
    <rect x="0" y="50" width="600" height="30" fill="#C45B28" opacity="0.4" rx="0" />
    {/* Plants */}
    <path d="M50 55 Q55 30 60 55" fill="#4CAF50" />
    <path d="M55 55 Q50 25 45 55" fill="#66BB6A" />
    <path d="M150 50 Q160 20 170 50" fill="#43A047" />
    <path d="M160 50 Q150 15 140 50" fill="#388E3C" />
    <path d="M300 52 Q310 25 320 52" fill="#4CAF50" />
    <path d="M450 50 Q460 18 470 50" fill="#66BB6A" />
    <path d="M460 50 Q450 22 440 50" fill="#43A047" />
    <path d="M530 53 Q540 28 550 53" fill="#388E3C" />
  </svg>
);

export default function CoverPage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(180deg, #F5E0B0 0%, #F2D8A8 40%, #E8C88E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <FallingLeaves count={10} />
      <TreeLeft />
      <TreeRight />
      <GroundPlants />

      {/* Logos */}
      <Box
        sx={{
          position: 'absolute',
          top: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: '0.55rem',
                color: '#5D4037',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Bosque y Vegetación Protectora
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: '#2E7D32',
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              PROSPERINA
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.6)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid #00529B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.5rem',
                fontWeight: 700,
                color: '#00529B',
              }}
            >
              espol
            </Box>
            <Typography sx={{ fontSize: '0.65rem', color: '#5D4037', fontWeight: 500 }}>
              Decanato de<br />Vinculación
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ zIndex: 2, textAlign: 'center', marginTop: 60 }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            color: '#C45B28',
            fontWeight: 400,
            mb: -1,
          }}
        >
          Hora de
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            color: '#5D4037',
            fontWeight: 900,
            lineHeight: 1.1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          ¡Aprender
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            color: '#5D4037',
            fontWeight: 900,
            lineHeight: 1.1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Y Jugar!
        </Typography>
      </motion.div>

      {/* Sloth */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ zIndex: 2, marginTop: 20 }}
      >
        <SlothSVG />
      </motion.div>
    </Box>
  );
}
