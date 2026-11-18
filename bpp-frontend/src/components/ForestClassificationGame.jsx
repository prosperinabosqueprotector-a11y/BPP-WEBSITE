import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Typography
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { Refresh } from '@mui/icons-material';
import { db } from '../config/firebaseConfig';

const ITEMS_PER_CATEGORY = 3;
const CATEGORIES = [
  { id: 'fauna', label: 'Animales', emoji: '🐾', color: '#e8f5e9' },
  { id: 'flora', label: 'Plantas', emoji: '🌿', color: '#fff8e1' }
];

const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createRound = (catalog) => {
  const count = Math.min(ITEMS_PER_CATEGORY, catalog.fauna.length, catalog.flora.length);
  if (!count) return [];

  return shuffle([
    ...shuffle(catalog.fauna).slice(0, count),
    ...shuffle(catalog.flora).slice(0, count)
  ]);
};

export default function ForestClassificationGame() {
  const [catalog, setCatalog] = useState(null);
  const [cards, setCards] = useState([]);
  const [assigned, setAssigned] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setLoading(true);
      setError('');

      try {
        const [faunaSnapshot, floraSnapshot] = await Promise.all([
          getDocs(collection(db, 'faunaAprobada')),
          getDocs(collection(db, 'floraAprobada'))
        ]);

        const toItems = (snapshot, category) => snapshot.docs
          .map((document) => {
            const data = document.data();
            return {
              id: `${category}-${document.id}`,
              name: typeof data.name === 'string' ? data.name.trim() : '',
              image: typeof data.image === 'string' ? data.image : '',
              category
            };
          })
          .filter((item) => item.name);

        const nextCatalog = {
          fauna: toItems(faunaSnapshot, 'fauna'),
          flora: toItems(floraSnapshot, 'flora')
        };

        if (isMounted) {
          setCatalog(nextCatalog);
          setCards(createRound(nextCatalog));
          setAssigned({});
          setSelectedId(null);
          setFeedback(null);
          setIsGameOver(false);
        }
      } catch (loadError) {
        console.error('Error cargando especies para el juego:', loadError);
        if (isMounted) setError('No se pudieron cargar las especies. Intenta nuevamente.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const resetRound = () => {
    if (!catalog) return;
    setCards(createRound(catalog));
    setAssigned({});
    setSelectedId(null);
    setFeedback(null);
    setIsGameOver(false);
  };

  const classifyCard = (cardId, category) => {
    if (!cardId || assigned[cardId] || isGameOver) return;
    const card = cards.find((item) => item.id === cardId);
    if (!card) return;

    setSelectedId(null);
    if (card.category !== category) {
      setFeedback({
        severity: 'warning',
        message: '¡Inténtalo otra vez! Mira bien la imagen y su nombre.'
      });
      return;
    }

    const nextAssigned = { ...assigned, [cardId]: category };
    setAssigned(nextAssigned);
    setFeedback({ severity: 'success', message: '¡Muy bien! 🌟' });
    if (Object.keys(nextAssigned).length === cards.length) setIsGameOver(true);
  };

  const handleDrop = (event, category) => {
    event.preventDefault();
    classifyCard(event.dataTransfer.getData('text/plain'), category);
  };

  const handleCategoryClick = (category) => {
    if (!selectedId) {
      setFeedback({ severity: 'info', message: 'Primero elige una tarjeta.' });
      return;
    }
    classifyCard(selectedId, category);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
        <CircularProgress color="success" />
        <Typography sx={{ mt: 2 }}>Cargando plantas y animales del bosque...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => setReloadKey((key) => key + 1)} startIcon={<Refresh />}>
          Reintentar
        </Button>
      </Paper>
    );
  }

  if (!cards.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="success.dark" gutterBottom>
          🌳 Clasifica los habitantes del bosque
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Aún no hay suficientes animales y plantas aprobados para jugar. Vuelve a intentarlo más tarde.
        </Typography>
        <Button onClick={() => setReloadKey((key) => key + 1)} startIcon={<Refresh />}>
          Volver a cargar
        </Button>
      </Paper>
    );
  }

  const remainingCards = cards.filter((card) => !assigned[card.id]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="success.dark">
            🌳 Clasifica los habitantes del bosque
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Arrastra cada tarjeta a su grupo. En celular, tócala y luego elige una categoría.
          </Typography>
        </Box>

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            gap: 2,
            alignItems: 'stretch'
          }}
        >
          <Box sx={{ gridColumn: { xs: '1', sm: '2' }, gridRow: { sm: '1' } }}>
            {remainingCards.length ? (
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {remainingCards.map((card) => (
                  <Card
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', card.id);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => {
                      setSelectedId(selectedId === card.id ? null : card.id);
                      setFeedback(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId(selectedId === card.id ? null : card.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedId === card.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 88,
                      cursor: 'grab',
                      border: selectedId === card.id ? '3px solid #2e7d32' : '2px solid transparent',
                      bgcolor: selectedId === card.id ? '#e8f5e9' : 'white',
                      '&:active': { cursor: 'grabbing' }
                    }}
                  >
                    {card.image ? (
                      <Box
                        component="img"
                        src={card.image}
                        alt=""
                        sx={{ width: 88, height: 80, objectFit: 'cover', borderRadius: 1, ml: 1 }}
                      />
                    ) : (
                      <Typography aria-hidden="true" sx={{ fontSize: 42, px: 2 }}>
                        {card.category === 'fauna' ? '🐾' : '🌱'}
                      </Typography>
                    )}
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Typography fontWeight="bold">{card.name}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  minHeight: 100,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'success.dark',
                  borderStyle: 'dashed'
                }}
              >
                <Typography>¡Clasificaste todas las tarjetas!</Typography>
              </Paper>
            )}
          </Box>

          {CATEGORIES.map((category, index) => {
            const categoryItems = cards.filter((card) => assigned[card.id] === category.id);
            return (
              <Paper
                key={category.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, category.id)}
                sx={{
                  gridColumn: { xs: '1', sm: index === 0 ? '1' : '3' },
                  gridRow: { sm: '1' },
                  p: 2,
                  minHeight: 150,
                  bgcolor: category.color,
                  border: '2px dashed',
                  borderColor: category.id === 'fauna' ? 'success.light' : 'warning.light',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 1
                }}
              >
                <Typography aria-hidden="true" sx={{ fontSize: 40 }}>{category.emoji}</Typography>
                <Typography variant="h6" fontWeight="bold">{category.label}</Typography>
                <Button
                  variant="contained"
                  color={category.id === 'fauna' ? 'success' : 'warning'}
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={isGameOver}
                  sx={{ fontWeight: 'bold' }}
                >
                  Clasificar aquí
                </Button>
                <Typography variant="body2">
                  {categoryItems.map((item) => item.name).join(', ') || 'Suelta aquí una tarjeta'}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button onClick={resetRound} startIcon={<Refresh />} variant="outlined" color="success">
            Jugar otra vez
          </Button>
        </Box>
      </Paper>

    </Box>
  );
}
