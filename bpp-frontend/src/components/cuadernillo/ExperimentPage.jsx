import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const ScientistSVG = () => (
  <svg viewBox="0 0 120 200" width="120" height="200">
    {/* Hair */}
    <ellipse cx="60" cy="38" rx="22" ry="18" fill="#1A237E" />
    {/* Face */}
    <circle cx="60" cy="50" r="18" fill="#FFCC80" />
    {/* Glasses */}
    <circle cx="52" cy="48" r="7" fill="none" stroke="#333" strokeWidth="2" />
    <circle cx="68" cy="48" r="7" fill="none" stroke="#333" strokeWidth="2" />
    <line x1="59" y1="48" x2="61" y2="48" stroke="#333" strokeWidth="2" />
    <line x1="45" y1="48" x2="42" y2="46" stroke="#333" strokeWidth="1.5" />
    <line x1="75" y1="48" x2="78" y2="46" stroke="#333" strokeWidth="1.5" />
    {/* Eyes behind glasses */}
    <circle cx="52" cy="48" r="2" fill="#333" />
    <circle cx="68" cy="48" r="2" fill="#333" />
    {/* Smile */}
    <path d="M53 56 Q60 62 67 56" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
    {/* Lab coat */}
    <rect x="38" y="68" width="44" height="70" rx="6" fill="#ECEFF1" />
    <rect x="42" y="68" width="36" height="65" rx="4" fill="#FFF" />
    {/* Coat buttons */}
    <circle cx="60" cy="85" r="2" fill="#B0BEC5" />
    <circle cx="60" cy="97" r="2" fill="#B0BEC5" />
    <circle cx="60" cy="109" r="2" fill="#B0BEC5" />
    {/* Shirt underneath */}
    <rect x="50" y="68" width="20" height="12" rx="2" fill="#4FC3F7" />
    {/* Arms */}
    <path d="M38 78 Q25 90 20 105" stroke="#FFCC80" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M82 78 Q95 90 100 105" stroke="#FFCC80" strokeWidth="10" fill="none" strokeLinecap="round" />
    {/* Hands */}
    <circle cx="20" cy="107" r="6" fill="#FFCC80" />
    <circle cx="100" cy="107" r="6" fill="#FFCC80" />
    {/* Test tube in hand */}
    <rect x="94" y="90" width="8" height="24" rx="3" fill="#E0F7FA" stroke="#4FC3F7" strokeWidth="1.5" />
    <rect x="95" y="100" width="6" height="12" rx="2" fill="#81D4FA" opacity="0.6" />
    {/* Legs */}
    <rect x="45" y="138" width="12" height="35" rx="4" fill="#455A64" />
    <rect x="63" y="138" width="12" height="35" rx="4" fill="#455A64" />
    {/* Shoes */}
    <ellipse cx="51" cy="176" rx="10" ry="5" fill="#37474F" />
    <ellipse cx="69" cy="176" rx="10" ry="5" fill="#37474F" />
  </svg>
);

const BottleSVG = () => (
  <svg viewBox="0 0 60 100" width="50" height="80">
    {/* Bottle body */}
    <rect x="12" y="30" width="36" height="60" rx="4" fill="#E8F5E9" stroke="#66BB6A" strokeWidth="1.5" />
    {/* Bottle neck */}
    <rect x="20" y="15" width="20" height="18" rx="3" fill="#E8F5E9" stroke="#66BB6A" strokeWidth="1.5" />
    {/* Cap area */}
    <rect x="22" y="10" width="16" height="8" rx="2" fill="#66BB6A" />
    {/* Layers */}
    <rect x="14" y="70" width="32" height="8" fill="#8D6E63" opacity="0.6" />
    <rect x="14" y="62" width="32" height="8" fill="#4CAF50" opacity="0.5" />
    <rect x="14" y="54" width="32" height="8" fill="#FF9800" opacity="0.4" />
    <rect x="14" y="46" width="32" height="8" fill="#8D6E63" opacity="0.5" />
    <rect x="14" y="38" width="32" height="8" fill="#4CAF50" opacity="0.4" />
    {/* Moisture drops */}
    <circle cx="20" cy="45" r="1.5" fill="#B3E5FC" opacity="0.7" />
    <circle cx="40" cy="55" r="1" fill="#B3E5FC" opacity="0.6" />
    <circle cx="25" cy="65" r="1.5" fill="#B3E5FC" opacity="0.7" />
  </svg>
);

export default function ExperimentPage() {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'auto',
        background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 30%, #A5D6A7 60%, #81C784 100%)',
      }}
    >
      {/* Trees background decoration */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <svg viewBox="0 0 800 200" width="100%" height="180" preserveAspectRatio="xMidYMin slice">
          <circle cx="100" cy="120" r="60" fill="#388E3C" opacity="0.2" />
          <circle cx="60" cy="140" r="45" fill="#2E7D32" opacity="0.15" />
          <circle cx="140" cy="130" r="40" fill="#43A047" opacity="0.18" />
          <circle cx="700" cy="120" r="55" fill="#388E3C" opacity="0.2" />
          <circle cx="750" cy="140" r="40" fill="#2E7D32" opacity="0.15" />
          <circle cx="660" cy="130" r="35" fill="#43A047" opacity="0.18" />
          <rect x="95" y="130" width="10" height="70" fill="#6D4C41" opacity="0.15" />
          <rect x="695" y="130" width="10" height="70" fill="#6D4C41" opacity="0.15" />
        </svg>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 600,
          mx: 'auto',
          p: { xs: 2, md: 3 },
          pt: { xs: 2, md: 2 },
        }}
      >
        {/* Title banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              bgcolor: '#FF8F00',
              borderRadius: 3,
              p: { xs: 1.5, md: 2 },
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: '#FFF',
                fontWeight: 900,
                lineHeight: 1.3,
              }}
            >
              ¡Sección Científico en Casa!
            </Typography>
          </Box>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box
            sx={{
              bgcolor: '#FFF8E1',
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '2px solid #FFB74D',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Scientist illustration */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -10, md: -20 },
                right: { xs: -10, md: -15 },
                opacity: 0.9,
              }}
            >
              <ScientistSVG />
            </Box>

            {/* Mini Compost title */}
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                color: '#E65100',
                fontWeight: 900,
                mb: 0.5,
                fontStyle: 'italic',
              }}
            >
              "MINI COMPOST CASERO"
            </Typography>

            {/* Objective */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#5D4037', mb: 0.3 }}>
                OBJETIVO:
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#5D4037', lineHeight: 1.5 }}>
                Observar cómo los descomponedores actúan sobre materia orgánica.
              </Typography>
            </Box>

            {/* Materials */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{
                fontSize: '0.85rem', fontWeight: 800, color: '#E65100', mb: 0.5,
                borderBottom: '2px solid #FFB74D', pb: 0.3,
              }}>
                MATERIALES:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {[
                  '1 botella plástica transparente de 2 litros (vacía y limpia)',
                  'Restos de frutas o verduras (cáscaras, pedacitos)',
                  'Un puñado de tierra con hojas secas',
                  'Agua',
                  'Tijeras',
                  'Cinta adhesiva',
                ].map((item, i) => (
                  <Box component="li" key={i}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#5D4037', lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Procedure */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{
                fontSize: '0.85rem', fontWeight: 800, color: '#E65100', mb: 0.5,
                borderBottom: '2px solid #FFB74D', pb: 0.3,
              }}>
                PROCEDIMIENTO:
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                {[
                  'Corta la parte superior de la botella para que sea como un vasito sin tapa.',
                  'Coloca una capa de tierra.',
                  'Agrega una capa de restos de frutas o verduras.',
                  'Repite las capas (como una lasaña), hasta casi llenar la botella.',
                  'Rocia con un poco de agua para mantener humedad (no encharcar).',
                  'Cubre la botella con plástico o la parte superior cortada (sin sellar completamente).',
                  'Colócala en un lugar ventilado, con sombra.',
                  'Observa diariamente durante 2 semanas. Anota si hay cambios de color, moho, insectos, olor, etc.',
                ].map((step, i) => (
                  <Box component="li" key={i}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#5D4037', lineHeight: 1.6, mb: 0.3 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottle illustration */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <BottleSVG />
            </Box>
          </Box>
        </motion.div>

        {/* What you'll learn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box
            sx={{
              mt: 2,
              bgcolor: '#FFF3E0',
              borderRadius: 3,
              p: { xs: 2, md: 2.5 },
              boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
              border: '2px solid #FF9800',
            }}
          >
            <Typography sx={{
              fontSize: '0.85rem', fontWeight: 800, color: '#E65100', mb: 1,
              fontStyle: 'italic',
            }}>
              Lo que aprenderás:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {[
                'Cómo actuan hongos y bacterias al descomponer materia organica.',
                'Por qué los descomponedores son vitales en los ecosistemas.',
              ].map((item, i) => (
                <Box component="li" key={i}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#5D4037', lineHeight: 1.6, mb: 0.3 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
