import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const SlothSVG = () => (
  <svg viewBox="0 0 200 280" width="200" height="280">
    <rect x="155" y="0" width="30" height="280" fill="#6D4C41" rx={4} />
    <rect x="160" y="0" width="20" height="280" fill="#795548" rx={2} />
    <path d="M155 80 Q120 70 100 90" stroke="#6D4C41" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M100 90 Q85 100 80 120" stroke="#6D4C41" strokeWidth="6" fill="none" strokeLinecap="round" />
    <ellipse cx="85" cy="85" rx="12" ry="6" fill="#43A047" transform="rotate(-20 85 85)" />
    <ellipse cx="75" cy="95" rx="10" ry="5" fill="#388E3C" transform="rotate(-30 75 95)" />
    <ellipse cx="95" cy="80" rx="8" ry="4" fill="#4CAF50" transform="rotate(-10 95 80)" />
    <ellipse cx="100" cy="170" rx="35" ry="45" fill="#8D6E63" />
    <ellipse cx="100" cy="175" rx="22" ry="30" fill="#BCAAA4" />
    <path d="M75 140 Q60 120 80 90" stroke="#8D6E63" strokeWidth="12" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="88" r="6" fill="#795548" />
    <line x1="76" y1="82" x2="74" y2="75" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <line x1="80" y1="81" x2="80" y2="74" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <line x1="84" y1="82" x2="86" y2="75" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <path d="M125 140 Q145 120 140 100" stroke="#8D6E63" strokeWidth="12" fill="none" strokeLinecap="round" />
    <circle cx="140" cy="98" r="6" fill="#795548" />
    <line x1="136" y1="92" x2="134" y2="85" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <line x1="140" y1="91" x2="140" y2="84" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <line x1="144" y1="92" x2="146" y2="85" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <path d="M80 210 Q70 240 75 260" stroke="#8D6E63" strokeWidth="10" fill="none" strokeLinecap="round" />
    <circle cx="75" cy="262" r="5" fill="#795548" />
    <path d="M120 210 Q130 240 125 260" stroke="#8D6E63" strokeWidth="10" fill="none" strokeLinecap="round" />
    <circle cx="125" cy="262" r="5" fill="#795548" />
    <circle cx="100" cy="125" r="28" fill="#8D6E63" />
    <ellipse cx="100" cy="128" rx="20" ry="18" fill="#D7CCC8" />
    <ellipse cx="89" cy="122" rx="10" ry="8" fill="#5D4037" />
    <ellipse cx="111" cy="122" rx="10" ry="8" fill="#5D4037" />
    <circle cx="89" cy="122" r="4" fill="#FFF" />
    <circle cx="111" cy="122" r="4" fill="#FFF" />
    <circle cx="90" cy="122" r="2.5" fill="#3E2723" />
    <circle cx="112" cy="122" r="2.5" fill="#3E2723" />
    <ellipse cx="100" cy="130" rx="4" ry="3" fill="#5D4037" />
    <path d="M93 136 Q100 142 107 136" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="72" y="150" width="20" height="25" rx="5" fill="#1565C0" />
    <rect x="74" y="152" width="16" height="8" rx="3" fill="#1E88E5" />
    <line x1="82" y1="140" x2="82" y2="150" stroke="#1565C0" strokeWidth="3" />
    <line x1="140" y1="98" x2="155" y2="85" stroke="#6D4C41" strokeWidth="2" />
    <ellipse cx="158" cy="82" rx="6" ry="3" fill="#43A047" transform="rotate(-30 158 82)" />
    <ellipse cx="162" cy="78" rx="5" ry="3" fill="#388E3C" transform="rotate(-40 162 78)" />
  </svg>
);

const TreeSVG = ({ x, scale = 1, flip = false }) => (
  <svg
    viewBox="0 0 80 160"
    width={80 * scale}
    height={160 * scale}
    style={{
      position: 'absolute',
      bottom: '18%',
      left: x,
      transform: flip ? 'scaleX(-1)' : 'none',
      transformOrigin: 'center',
    }}
  >
    <rect x="35" y="80" width="12" height="80" fill="#6D4C41" rx={2} />
    <rect x="37" y="82" width="8" height="76" fill="#795548" rx={1} />
    <circle cx="41" cy="55" r="30" fill="#2E7D32" opacity="0.9" />
    <circle cx="25" cy="65" r="20" fill="#388E3C" opacity="0.8" />
    <circle cx="57" cy="65" r="20" fill="#388E3C" opacity="0.8" />
    <circle cx="41" cy="40" r="18" fill="#43A047" opacity="0.75" />
    <circle cx="30" cy="48" r="12" fill="#4CAF50" opacity="0.6" />
    <circle cx="52" cy="48" r="12" fill="#4CAF50" opacity="0.6" />
    <ellipse cx="20" cy="75" rx="8" ry="5" fill="#558B2F" opacity="0.5" transform="rotate(-15 20 75)" />
    <ellipse cx="62" cy="75" rx="8" ry="5" fill="#558B2F" opacity="0.5" transform="rotate(15 62 75)" />
  </svg>
);

const CloudSVG = ({ style }) => (
  <svg viewBox="0 0 120 50" width="120" height="50" style={style}>
    <ellipse cx="60" cy="30" rx="40" ry="18" fill="#FFF" opacity="0.9" />
    <ellipse cx="35" cy="28" rx="25" ry="15" fill="#FFF" opacity="0.85" />
    <ellipse cx="85" cy="28" rx="25" ry="15" fill="#FFF" opacity="0.85" />
    <ellipse cx="50" cy="22" rx="20" ry="12" fill="#FFF" opacity="0.95" />
    <ellipse cx="70" cy="20" rx="18" ry="10" fill="#FFF" />
  </svg>
);

export default function ClosingPage() {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #87CEEB 0%, #B3E5FC 40%, #E1F5FE 70%, #FFF9C4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '5%', right: '8%', zIndex: 1 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="18" fill="#FDD835" />
          <circle cx="30" cy="30" r="14" fill="#FFEE58" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1={30 + 22 * Math.cos((angle * Math.PI) / 180)}
              y1={30 + 22 * Math.sin((angle * Math.PI) / 180)}
              x2={30 + 28 * Math.cos((angle * Math.PI) / 180)}
              y2={30 + 28 * Math.sin((angle * Math.PI) / 180)}
              stroke="#FDD835"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </motion.div>

      {/* Clouds */}
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '8%', left: '5%', zIndex: 1 }}
      >
        <CloudSVG />
      </motion.div>
      <motion.div
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', top: '12%', right: '10%', zIndex: 1 }}
      >
        <CloudSVG style={{ transform: 'scale(0.7)' }} />
      </motion.div>
      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', top: '5%', right: '35%', zIndex: 1 }}
      >
        <CloudSVG style={{ transform: 'scale(0.5)' }} />
      </motion.div>

      {/* Trees on left */}
      <TreeSVG x="2%" scale={0.9} />
      <TreeSVG x="8%" scale={0.65} flip />

      {/* Trees on right */}
      <TreeSVG x="85%" scale={0.85} flip />
      <TreeSVG x="92%" scale={0.6} />

      {/* Green ground */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '28%',
          background: 'linear-gradient(180deg, #66BB6A 0%, #43A047 40%, #2E7D32 100%)',
          borderRadius: '50% 50% 0 0 / 15% 15% 0 0',
          zIndex: 3,
        }}
      />

      {/* River */}
      <motion.div
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '5%',
          width: '100%',
          height: '12%',
          zIndex: 4,
        }}
      >
        <svg viewBox="0 0 800 60" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#29B6F6" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#039BE5" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#29B6F6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0 30 Q100 10 200 35 T400 25 T600 35 T800 30 L800 60 L0 60 Z"
            fill="url(#riverGrad)"
          />
          <path
            d="M0 32 Q150 15 300 38 T600 28 T800 32"
            fill="none"
            stroke="#B3E5FC"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            d="M0 38 Q100 25 250 40 T500 30 T800 38"
            fill="none"
            stroke="#E1F5FE"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Small flowers on ground */}
      {[
        { x: '15%', y: '78%', color: '#F48FB1' },
        { x: '25%', y: '80%', color: '#CE93D8' },
        { x: '70%', y: '79%', color: '#F48FB1' },
        { x: '80%', y: '81%', color: '#FFB74D' },
        { x: '45%', y: '82%', color: '#CE93D8' },
      ].map((flower, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          style={{
            position: 'absolute',
            left: flower.x,
            top: flower.y,
            zIndex: 5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="3" fill={flower.color} />
            <circle cx="8" cy="4" r="2.5" fill={flower.color} opacity="0.7" />
            <circle cx="12" cy="8" r="2.5" fill={flower.color} opacity="0.7" />
            <circle cx="8" cy="12" r="2.5" fill={flower.color} opacity="0.7" />
            <circle cx="4" cy="8" r="2.5" fill={flower.color} opacity="0.7" />
            <circle cx="8" cy="8" r="2" fill="#FDD835" />
          </svg>
        </motion.div>
      ))}

      {/* Text box */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: isMobile ? 320 : 400,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(62,39,35,0.88)',
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              color: '#FFF',
              fontWeight: 800,
              lineHeight: 1.6,
              mb: 1,
            }}
          >
            ¡Explora el mágico Bosque Seco Tropical!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              color: '#FFCC80',
              lineHeight: 1.7,
            }}
          >
            Descubre animales únicos y plantas sorprendentes mientras te diviertes con juegos y actividades. Este cuadernillo te llevará a conocer los secretos de la naturaleza y convertirte en un autentico explorador.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              color: '#FFF',
              fontWeight: 900,
              mt: 1.5,
              lineHeight: 1.6,
            }}
          >
            ¡Aprende, juega y cuida el bosque!
          </Typography>
        </Box>
      </motion.div>

      {/* Sloth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <SlothSVG />
        </motion.div>
      </motion.div>
    </Box>
  );
}
