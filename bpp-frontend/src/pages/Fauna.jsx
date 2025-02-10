import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  Box,
  Container,
  CircularProgress,
  styled,
} from '@mui/material';

const StyledCard = styled(Card)({
  width: 200,
  position: 'relative',
  '&:hover .description': {
    maxHeight: '100px',
    opacity: 1,
  },
});

const DescriptionOverlay = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px',
  opacity: 0,
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  textAlign: 'center',
});
const Fauna = () => {
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data/fauna');
        const data = await response.json();
        setAnimals(data);
        setCategories([...new Set(data.map((item) => item.category))]);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al obtener fauna:', error);
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
      >
        Enciclopedia de Fauna
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ width: '50%' }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
          {animals
            .filter((a) => !selectedCategory || a.category === selectedCategory)
            .map((animal, index) => (
              <StyledCard key={index}>
                <CardMedia
                  component="img"
                  height="140"
                  image={animal.image}
                  alt={animal.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {animal.name}
                  </Typography>
                </CardContent>
                <DescriptionOverlay className="description">
                  {animal.description}
                </DescriptionOverlay>
              </StyledCard>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default Fauna;
