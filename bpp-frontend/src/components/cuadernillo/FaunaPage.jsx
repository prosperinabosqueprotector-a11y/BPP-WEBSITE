import { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const ANIMAL_COLORS = ['#C62828', '#2E7D32', '#F9A825', '#795548', '#1565C0', '#6A1B9A'];

const AnimalSilhouette = ({ type }) => {
  const silhouettes = {
    aves: (
      <svg viewBox="0 0 120 100" width="120" height="100">
        <path d="M60 20 Q80 10 90 25 Q95 35 85 40 L75 38 Q70 50 65 55 L55 55 Q50 50 45 45 L35 48 Q25 45 30 35 Q35 25 50 22 Z"
          fill="none" stroke="#5D4037" strokeWidth="2" />
        <circle cx="82" cy="28" r="2" fill="#5D4037" />
        <path d="M90 25 L100 22 L92 28" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M55 55 L50 75 L55 73 L52 80" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M65 55 L70 75 L65 73 L68 80" fill="none" stroke="#5D4037" strokeWidth="1.5" />
      </svg>
    ),
    mamiferos: (
      <svg viewBox="0 0 120 100" width="120" height="100">
        <ellipse cx="60" cy="55" rx="35" ry="25" fill="none" stroke="#5D4037" strokeWidth="2" />
        <ellipse cx="30" cy="40" rx="12" ry="10" fill="none" stroke="#5D4037" strokeWidth="2" />
        <circle cx="27" cy="38" r="2" fill="#5D4037" />
        <path d="M22 30 Q18 22 25 20 Q30 18 32 25" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M35 30 Q38 22 42 24 Q44 28 40 32" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M38 60 L30 85" fill="none" stroke="#5D4037" strokeWidth="2" />
        <path d="M48 62 L42 85" fill="none" stroke="#5D4037" strokeWidth="2" />
        <path d="M72 62 L78 85" fill="none" stroke="#5D4037" strokeWidth="2" />
        <path d="M82 60 L88 85" fill="none" stroke="#5D4037" strokeWidth="2" />
        <path d="M95 50 Q110 45 105 55 Q100 60 95 55" fill="none" stroke="#5D4037" strokeWidth="1.5" />
      </svg>
    ),
    reptiles: (
      <svg viewBox="0 0 120 100" width="120" height="100">
        <ellipse cx="50" cy="50" rx="25" ry="15" fill="none" stroke="#5D4037" strokeWidth="2" />
        <ellipse cx="25" cy="45" rx="10" ry="8" fill="none" stroke="#5D4037" strokeWidth="2" />
        <circle cx="22" cy="43" r="2" fill="#5D4037" />
        <path d="M75 50 Q90 48 105 52 Q110 53 108 50" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M35 60 L25 78 L30 75 L28 82" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M50 62 L45 80 L50 78 L48 85" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M65 60 L70 78 L65 76 L68 83" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M30 38 Q25 25 30 20" fill="none" stroke="#5D4037" strokeWidth="1" />
        <path d="M35 36 Q32 24 37 20" fill="none" stroke="#5D4037" strokeWidth="1" />
      </svg>
    ),
    anfibios: (
      <svg viewBox="0 0 120 100" width="120" height="100">
        <ellipse cx="60" cy="55" rx="28" ry="20" fill="none" stroke="#5D4037" strokeWidth="2" />
        <ellipse cx="40" cy="38" rx="10" ry="10" fill="none" stroke="#5D4037" strokeWidth="2" />
        <ellipse cx="80" cy="38" rx="10" ry="10" fill="none" stroke="#5D4037" strokeWidth="2" />
        <circle cx="38" cy="36" r="3" fill="#5D4037" />
        <circle cx="78" cy="36" r="3" fill="#5D4037" />
        <path d="M35 65 L15 75 L20 70 L12 78" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M85 65 L105 75 L100 70 L108 78" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M45 70 L38 90 L42 88 L40 95" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M75 70 L82 90 L78 88 L80 95" fill="none" stroke="#5D4037" strokeWidth="1.5" />
        <path d="M50 60 Q60 68 70 60" fill="none" stroke="#5D4037" strokeWidth="1" />
      </svg>
    ),
  };

  return silhouettes[type] || silhouettes.mamiferos;
};

export default function FaunaPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fauna_bosque'), (snapshot) => {
      const animalsData = snapshot.docs.map((doc, index) => {
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
          color: ANIMAL_COLORS[index % ANIMAL_COLORS.length],
        };
      });

      const sortedAnimals = animalsData.sort((a, b) => a.order - b.order);
      setAnimals(sortedAnimals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      {/* Left: Conociendo la fauna */}
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
            bgcolor: '#6B7B3A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>5</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              color: '#6B7B3A',
              fontWeight: 800,
              textAlign: 'center',
              mb: 3,
              mt: 1,
              lineHeight: 1.3,
            }}
          >
            Conociendo la Fauna del Bosque Seco Tropical
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#6B7B3A' }} />
            </Box>
          ) : (
            animals.map((animal, index) => (
              <motion.div
                key={animal.id}
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
                      border: `3px solid ${animal.color}`,
                    }}
                  >
                    <Box
                      component="img"
                      src={animal.image}
                      alt={animal.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.45rem', fontWeight: 700, color: '#5D4037' }}>
                      {animal.name}{' '}
                      <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400, fontSize: '1.15rem' }}>
                        ({animal.scientific})
                      </Box>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
                      {animal.characteristics.map((char, i) => (
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

      {/* Right: Actividad de colorear */}
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
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>6</Typography>
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
              color: '#6B7B3A',
              fontWeight: 800,
              mb: 1,
              mt: 1,
            }}
          >
            Momento de colorear!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: '#5D4037',
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            Colorea este bosque con las especies que podemos encontrar en el bosque.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr' },
            gap: 2.5,
            width: '100%',
            maxWidth: 500,
          }}
        >
          {[
            { label: 'Aves', type: 'aves' },
            { label: 'Mamiferos', type: 'mamiferos' },
            { label: 'Reptiles', type: 'reptiles' },
            { label: 'Anfibios', type: 'anfibios' },
          ].map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Box
                sx={{
                  bgcolor: '#FFFDE7',
                  borderRadius: 2,
                  border: '2px dashed #C45B28',
                  p: 2,
                  textAlign: 'center',
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: '#6B7B3A',
                    boxShadow: '0 4px 12px rgba(107,123,58,0.2)',
                  },
                }}
              >
                <Box sx={{ opacity: 0.15, mb: 1 }}>
                  <AnimalSilhouette type={item.type} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#5D4037',
                    mt: 1,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
