import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Box,
  Container,
} from '@mui/material';
import Puzzle from '../components/Puzzle';
import QuizGame from '../components/QuizGame';
import FindTheDifferences from '../components/FindTheDifferences'; // Importa el nuevo juego
import { ChevronRight, ChevronLeft } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';

const plantCategories = [
  {
    title: 'Nivel 3',
    plants: [
      {
        name: 'Quiz Game',
        image:
          'https://i.pinimg.com/originals/69/8c/39/698c39cc0fe08151a185ad0f98c7f9bf.jpg',
      },
      {
        name: 'Puzzle',
        image:
          'https://th.bing.com/th/id/OIP.2Enlb-fRoVZ__EBsB84BeQAAAA?rs=1&pid=ImgDetMain',
      },
      {
        name: 'Encuentra las Cartas',
        image:
          'https://i.pinimg.com/originals/69/8c/39/698c39cc0fe08151a185ad0f98c7f9bf.jpg',
      },
    ],
  },
];

const PlantCategory = ({
  category,
  onSelectPuzzle,
  onSelectQuiz,
  onSelectFindDifferences,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visiblePlants, setVisiblePlants] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisiblePlants(1);
      else if (window.innerWidth < 1024) setVisiblePlants(2);
      else setVisiblePlants(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () =>
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));

  const handleNext = () =>
    setStartIndex((prevIndex) =>
      Math.min(category.plants.length - visiblePlants, prevIndex + 1)
    );

  return (
    <Paper
      elevation={3}
      className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <StarIcon sx={{ color: 'gold' }} />
        <Typography
          variant="h5"
          className="mb-6 font-bold text-green-800 border-b-2 border-green-500 pb-2"
        >
          {category.title}
        </Typography>
        <StarIcon sx={{ color: 'gold' }} />
      </Box>
      <Box className="flex items-center mt-4" sx={{ py: 2 }}>
        <IconButton
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="mr-2 bg-green-100 hover:bg-green-200"
        >
          <ChevronLeft />
        </IconButton>
        <AnimatePresence initial={false}>
          <motion.div
            className="flex space-x-4 overflow-hidden"
            style={{
              width: `${visiblePlants * 12 + (visiblePlants - 1) * 1}rem`,
            }}
          >
            {category.plants
              .slice(startIndex, startIndex + visiblePlants)
              .map((plant, index) => (
                <motion.div
                  key={startIndex + index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                  className="px-2 py-4"
                >
                  <Card
                    className="w-44 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => {
                      if (plant.name === 'Quiz Game') {
                        onSelectQuiz();
                      } else if (plant.name === 'Puzzle') {
                        onSelectPuzzle();
                      } else if (plant.name === 'Encuentra las Cartas') {
                        onSelectFindDifferences();
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={plant.image}
                      alt={plant.name}
                      className="h-36 object-cover"
                    />
                    <CardContent className="bg-gradient-to-b from-white to-green-100 p-3">
                      <Typography
                        variant="subtitle1"
                        className="text-center font-semibold text-green-800"
                      >
                        {plant.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
        <IconButton
          onClick={handleNext}
          disabled={startIndex + visiblePlants >= category.plants.length}
          className="ml-2 bg-green-100 hover:bg-green-200"
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default function Juegos() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(false);
  const [selectedFindDifferences, setSelectedFindDifferences] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSelectPuzzle = () => {
    fetch('https://bpp-website.onrender.com/api/puzzle-image')
      .then((response) => {
        if (!response.ok)
          throw new Error('Error al obtener la imagen del puzzle');
        return response.json();
      })
      .then((data) => {
        setImageUrl(data.imageUrl);
        setSelectedPuzzle(true);
        setSelectedQuiz(false);
        setSelectedFindDifferences(false);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectQuiz = () => {
    setSelectedQuiz(true);
    setSelectedPuzzle(false);
    setSelectedFindDifferences(false);
  };

  const handleSelectFindDifferences = () => {
    setSelectedFindDifferences(true);
    setSelectedPuzzle(false);
    setSelectedQuiz(false);
  };

  return (
    <Container>
      <PlantCategory
        category={plantCategories[0]}
        onSelectPuzzle={handleSelectPuzzle}
        onSelectQuiz={handleSelectQuiz}
        onSelectFindDifferences={handleSelectFindDifferences}
      />

      {/* Mostrar el puzzle solo si está seleccionado */}
      {selectedPuzzle && (
        <Box mt={4}>
          <Puzzle imageUrl={imageUrl} />
        </Box>
      )}

      {/* Mostrar el quiz solo si está seleccionado */}
      {selectedQuiz && (
        <Box mt={4}>
          <QuizGame />
        </Box>
      )}

      {/* Mostrar "Encuentra las Diferencias" solo si está seleccionado */}
      {selectedFindDifferences && (
        <Box mt={4}>
          <FindTheDifferences />
        </Box>
      )}
    </Container>
  );
}
