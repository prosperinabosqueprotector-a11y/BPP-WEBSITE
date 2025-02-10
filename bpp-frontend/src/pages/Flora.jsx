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
} from '@mui/material';

const Flora = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch(
          'https://bpp-website.onrender.com/api/data/flora'
        );
        const data = await response.json();
        setPlants(data);
        setCategories([...new Set(data.map((item) => item.category))]);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al obtener flora:', error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
      >
        Enciclopedia de Flora
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
          {plants
            .filter((p) => !selectedCategory || p.category === selectedCategory)
            .map((plant, index) => (
              <Card key={index} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={plant.image}
                  alt={plant.name}
                />
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {plant.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default Flora;
