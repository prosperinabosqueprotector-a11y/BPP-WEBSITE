import { Typography, Container, Box } from '@mui/material';
import LearningCard from '../components/LearningCard';
import { learningOptions } from '../data/appData';

export default function Home({ theme }) {
  return (
    <Box
      className="flex flex-col min-h-full"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, flexGrow: 1, py: 4 }}
      >
        <Box mb={8} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Typography
            variant="h2"
            className="mb-4 text-center font-bold"
            color="primary"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontWeight: 800,
            }}
          >
            ¡Explora y Aprende!
          </Typography>
          <Typography
            variant="h5"
            className="text-center"
            color="textSecondary"
            sx={{ fontWeight: 500 }}
          >
            Elige una aventura para comenzar tu viaje por la naturaleza
          </Typography>
        </Box>

        <Box
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          sx={{
            '& > div': {
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            },
          }}
        >
          {learningOptions.map((option, index) => (
            <LearningCard
              key={option.title}
              option={option}
              index={index}
              theme={theme}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
