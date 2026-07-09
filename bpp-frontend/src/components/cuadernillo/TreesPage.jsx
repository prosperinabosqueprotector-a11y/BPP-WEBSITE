import { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const TREE_COLORS = ['#C62828', '#2E7D32', '#F9A825', '#795548'];

const BRANCHES = [
  {
    name: 'Huevo de Chivo',
    colors: ['#8B4513', '#A0522D', '#6B8E23', '#228B22'],
  },
  {
    name: 'Flor de Guayacán',
    colors: ['#FFD700', '#FFA000', '#FF8F00', '#F57F17'],
  },
  {
    name: 'Rama de Ceibo',
    colors: ['#8B0000', '#C62828', '#2E7D32', '#1B5E20'],
  },
];

const BranchSVG = ({ name, fillColor }) => {
  if (name === 'Huevo de Chivo') {
    return (
      <svg viewBox="0 0 160 180" width="160" height="180">
        <path d="M80 170 L80 60" stroke="#5D4037" strokeWidth="4" fill="none" />
        <path d="M80 60 Q60 40 40 50" stroke="#5D4037" strokeWidth="3" fill="none" />
        <path d="M80 60 Q100 40 120 50" stroke="#5D4037" strokeWidth="3" fill="none" />
        <path d="M80 90 Q60 75 45 85" stroke="#5D4037" strokeWidth="2.5" fill="none" />
        <path d="M80 90 Q100 75 115 85" stroke="#5D4037" strokeWidth="2.5" fill="none" />
        {/* Leaves */}
        <ellipse cx="38" cy="48" rx="14" ry="8" fill={fillColor} opacity="0.8" transform="rotate(-20 38 48)" />
        <ellipse cx="50" cy="42" rx="12" ry="7" fill={fillColor} opacity="0.7" transform="rotate(10 50 42)" />
        <ellipse cx="122" cy="48" rx="14" ry="8" fill={fillColor} opacity="0.8" transform="rotate(20 122 48)" />
        <ellipse cx="110" cy="42" rx="12" ry="7" fill={fillColor} opacity="0.7" transform="rotate(-10 110 42)" />
        <ellipse cx="43" cy="83" rx="12" ry="7" fill={fillColor} opacity="0.8" transform="rotate(-15 43 83)" />
        <ellipse cx="117" cy="83" rx="12" ry="7" fill={fillColor} opacity="0.8" transform="rotate(15 117 83)" />
        {/* Fruits */}
        <circle cx="35" cy="55" r="6" fill="#DC143C" />
        <circle cx="45" cy="50" r="5" fill="#DC143C" />
        <circle cx="125" cy="55" r="6" fill="#DC143C" />
      </svg>
    );
  }

  if (name === 'Flor de Guayacán') {
    return (
      <svg viewBox="0 0 160 180" width="160" height="180">
        <path d="M80 170 L80 80" stroke="#5D4037" strokeWidth="4" fill="none" />
        <path d="M80 80 Q60 60 50 65" stroke="#5D4037" strokeWidth="2.5" fill="none" />
        <path d="M80 80 Q100 60 110 65" stroke="#5D4037" strokeWidth="2.5" fill="none" />
        {/* Flower petals */}
        <ellipse cx="80" cy="45" rx="12" ry="20" fill={fillColor} opacity="0.9" />
        <ellipse cx="65" cy="55" rx="12" ry="18" fill={fillColor} opacity="0.85" transform="rotate(-30 65 55)" />
        <ellipse cx="95" cy="55" rx="12" ry="18" fill={fillColor} opacity="0.85" transform="rotate(30 95 55)" />
        <ellipse cx="58" cy="70" rx="10" ry="15" fill={fillColor} opacity="0.8" transform="rotate(-50 58 70)" />
        <ellipse cx="102" cy="70" rx="10" ry="15" fill={fillColor} opacity="0.8" transform="rotate(50 102 70)" />
        {/* Center */}
        <circle cx="80" cy="58" r="8" fill="#8B4513" />
        <circle cx="80" cy="58" r="4" fill="#D4A04A" />
        {/* Leaves */}
        <ellipse cx="48" cy="63" rx="10" ry="5" fill="#2E7D32" opacity="0.8" transform="rotate(-25 48 63)" />
        <ellipse cx="112" cy="63" rx="10" ry="5" fill="#2E7D32" opacity="0.8" transform="rotate(25 112 63)" />
      </svg>
    );
  }

  // Rama de Ceibo
  return (
    <svg viewBox="0 0 160 180" width="160" height="180">
      <path d="M80 170 L80 70" stroke="#5D4037" strokeWidth="5" fill="none" />
      <path d="M80 70 Q55 50 35 55" stroke="#5D4037" strokeWidth="3" fill="none" />
      <path d="M80 70 Q105 50 125 55" stroke="#5D4037" strokeWidth="3" fill="none" />
      <path d="M80 100 Q55 85 40 90" stroke="#5D4037" strokeWidth="2.5" fill="none" />
      <path d="M80 100 Q105 85 120 90" stroke="#5D4037" strokeWidth="2.5" fill="none" />
      {/* Leaves - compound */}
      {[35, 55, 125, 40, 120].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={[52, 52, 52, 87, 87][i]} rx="8" ry="14" fill={fillColor} opacity="0.75"
            transform={`rotate(${-40 + i * 20} ${x} ${[52, 52, 52, 87, 87][i]})`} />
          <ellipse cx={x + 10} cy={[48, 48, 48, 83, 83][i]} rx="7" ry="12" fill={fillColor} opacity="0.65"
            transform={`rotate(${-20 + i * 15} ${x + 10} ${[48, 48, 48, 83, 83][i]})`} />
        </g>
      ))}
      {/* Flower */}
      <circle cx="75" cy="35" r="10" fill={fillColor} opacity="0.9" />
      <circle cx="85" cy="38" r="8" fill={fillColor} opacity="0.8" />
      <circle cx="80" cy="30" r="7" fill={fillColor} opacity="0.7" />
      <circle cx="80" cy="35" r="3" fill="#FFD700" />
    </svg>
  );
};

export default function TreesPage() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branchColors, setBranchColors] = useState(
    BRANCHES.map((b) => ({ name: b.name, color: b.colors[0] }))
  );
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'arboles_bosque_tropical'), (snapshot) => {
      const treesData = snapshot.docs.map((doc, index) => {
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
          color: TREE_COLORS[index % TREE_COLORS.length],
        };
      });

      const sortedTrees = treesData.sort((a, b) => a.order - b.order);
      setTrees(sortedTrees);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleColorChange = (branchName, newColor) => {
    setBranchColors((prev) =>
      prev.map((b) => (b.name === branchName ? { ...b, color: newColor } : b))
    );
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
      {/* Left: Conociendo los árboles */}
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          background: 'linear-gradient(180deg, #F5E0B0 0%, #E8C88E 100%)',
          p: { xs: 2, md: 3 },
          position: 'relative',
          overflow: 'auto',
        }}
      >
        {/* Activity number */}
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
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>1</Typography>
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
            Conociendo los Árboles del Bosque Seco Tropical
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#C45B28' }} />
            </Box>
          ) : (
            trees.map((tree, index) => (
              <motion.div
                key={tree.id}
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
                      border: `3px solid ${tree.color}`,
                    }}
                  >
                    <Box
                      component="img"
                      src={tree.image}
                      alt={tree.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.45rem', fontWeight: 700, color: '#5D4037' }}>
                      {tree.name}{' '}
                      <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400, fontSize: '1.15rem' }}>
                        ({tree.scientific})
                      </Box>
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
                      {tree.characteristics.map((char, i) => (
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
          borderLeft: isMobile ? 'none' : '3px dashed #C45B28',
        }}
      >
        {/* Activity number */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#C45B28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 700 }}>2</Typography>
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
              color: '#C45B28',
              fontWeight: 800,
              mb: 1,
              mt: 1,
            }}
          >
            ¡Ayúdame!
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: '#5D4037',
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            Necesito que colorees la rama del árbol que más te haya gustado de las especies del bosque.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            alignItems: 'center',
          }}
        >
          {BRANCHES.map((branch, index) => {
            const currentColor = branchColors.find((b) => b.name === branch.name)?.color || branch.colors[0];
            return (
              <motion.div
                key={branch.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#5D4037',
                      mb: 1,
                    }}
                  >
                    {branch.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 1,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <BranchSVG name={branch.name} fillColor={currentColor} />
                  </Box>
                  {/* Color picker */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {branch.colors.map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleColorChange(branch.name, color)}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: color,
                          cursor: 'pointer',
                          border: currentColor === color ? '3px solid #5D4037' : '2px solid rgba(0,0,0,0.15)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
