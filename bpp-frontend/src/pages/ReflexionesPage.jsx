import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Chip,
} from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { motion } from 'framer-motion';
import { QuestionAnswer, Person } from '@mui/icons-material';

export default function ReflexionesPage() {
  const [reflexiones, setReflexiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reflexion'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || 'Sin nombre',
            question: d.question,
            text: d.text || '',
            createdAt: d.createdAt,
          };
        });
        data.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA;
          } catch {
            return 0;
          }
        });
        setReflexiones(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error reading reflexiones:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('es-EC');
    } catch {
      return '';
    }
  };

  const groupedByName = reflexiones.reduce((acc, r) => {
    if (!acc[r.name]) acc[r.name] = [];
    acc[r.name].push(r);
    return acc;
  }, {});

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <QuestionAnswer sx={{ fontSize: 36 }} />
          Reflexiones del Bosque
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 4, fontSize: '0.95rem' }}>
          Las respuestas de los participantes del cuadernillo interactivo.
        </Typography>
      </motion.div>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#FFEBEE' }}>
          <Typography sx={{ color: '#C62828', fontSize: '1rem' }}>
            Error al cargar: {error}
          </Typography>
        </Paper>
      ) : Object.keys(groupedByName).length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
            Aun no hay reflexiones registradas.
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 1 }}>
            Ve al cuadernillo y completa las actividades de reflexion.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(groupedByName).map(([name, answers], groupIndex) => {
            const q1 = answers.find((a) => a.question === 1);
            const q2 = answers.find((a) => a.question === 2);
            const dateStr = formatDate(q1?.createdAt || q2?.createdAt);
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {name}
                    </Typography>
                    {dateStr && (
                      <Chip
                        label={dateStr}
                        size="small"
                        sx={{ ml: 'auto', fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>

                  {q1 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#C45B28', mb: 0.5 }}>
                        Pregunta 1:
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontStyle: 'italic', mb: 0.5 }}>
                        Si fueras una especie del Bosque Protector, ¿Qué harias? ¿Cómo te gustaria vivir?
                      </Typography>
                      <Typography sx={{ fontSize: '0.95rem', color: 'text.primary', lineHeight: 1.6 }}>
                        {q1.text}
                      </Typography>
                    </Box>
                  )}

                  {q2 && (
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7B3A', mb: 0.5 }}>
                        Pregunta 2:
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontStyle: 'italic', mb: 0.5 }}>
                        ¿Por qué crees que la Biodiversidad es importante para todos?
                      </Typography>
                      <Typography sx={{ fontSize: '0.95rem', color: 'text.primary', lineHeight: 1.6 }}>
                        {q2.text}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
