import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Switch,
  Box,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Favorite, ChatBubbleOutline, Add } from '@mui/icons-material';

const explorers = [
  {
    name: 'Mario Mayo',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Mario',
  },
  {
    name: 'Luisa Explora',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Luisa',
  },
  {
    name: 'Carlos Naturaleza',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Carlos',
  },
  {
    name: 'Ana Aventurera',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Ana',
  },
  {
    name: 'Pedro Bosque',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Pedro',
  },
  {
    name: 'Elena Montaña',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Elena',
  },
  {
    name: 'Juan Río',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Juan',
  },
  {
    name: 'Sofia Cielo',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Sofia',
  },
];

export default function Comunidad({ theme }) {
  const [activeTab, setActiveTab] = useState(0);
  const [openExplorersList, setOpenExplorersList] = useState(false);
  const [visibleAvatars, setVisibleAvatars] = useState(1);
  const avatarContainerRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenExplorersList = () => {
    setOpenExplorersList(true);
  };

  const handleCloseExplorersList = () => {
    setOpenExplorersList(false);
  };

  const updateVisibleAvatars = () => {
    if (avatarContainerRef.current) {
      const containerWidth = avatarContainerRef.current.offsetWidth;
      const avatarWidth = 48;
      const gap = 8;
      const maxAvatars = Math.floor(
        (containerWidth + gap) / (avatarWidth + gap)
      );
      setVisibleAvatars(Math.max(1, maxAvatars - 1));
    }
  };

  useLayoutEffect(() => {
    updateVisibleAvatars();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateVisibleAvatars);
    return () => window.removeEventListener('resize', updateVisibleAvatars);
  }, []);

  const CommunityFeed = () => (
    <Box className="space-y-6">
      <Box mb={4} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
        <Typography variant="h6" className="mb-2 text-gray-800">
          Exploradores Conectados
        </Typography>
        <Box
          ref={avatarContainerRef}
          className="flex flex-nowrap gap-2 items-center overflow-hidden"
          sx={{ minHeight: '48px' }} // Ensure minimum height for container
        >
          {explorers.slice(0, visibleAvatars).map((explorer, index) => (
            <Avatar
              key={index}
              src={explorer.avatar}
              className="w-12 h-12 flex-shrink-0"
            />
          ))}
          {explorers.length > visibleAvatars && (
            <Avatar
              className="w-12 h-12 bg-blue-500 cursor-pointer flex-shrink-0"
              onClick={handleOpenExplorersList}
            >
              +{explorers.length - visibleAvatars}
            </Avatar>
          )}
        </Box>
      </Box>

      <Typography variant="h6" className="text-gray-800 mb-4">
        Descubrimientos Recientes
      </Typography>

      <Grid container spacing={3}>
        {[
          {
            user: 'MarioMayo',
            image: 'https://picsum.photos/seed/forest/300/300',
            description: 'Encontré esta hermosa flor en el bosque.',
          },
          {
            user: 'LuisaExplora',
            image: 'https://picsum.photos/seed/deer/300/300',
            description: 'Un ciervo que vi durante mi caminata.',
          },
          {
            user: 'CarlosNaturaleza',
            image: 'https://picsum.photos/seed/waterfall/300/300',
            description: 'Cascada escondida en la montaña.',
          },
          {
            user: 'AnaAventurera',
            image: 'https://picsum.photos/seed/tracks/300/300',
            description: 'Huellas de un animal misterioso.',
          },
        ].map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="bg-sky-100 rounded-xl overflow-hidden h-full">
              <CardMedia
                component="img"
                height="300"
                image={post.image}
                alt={`Descubrimiento de ${post.user}`}
                sx={{ objectFit: 'cover', height: 200 }}
              />
              <CardContent className="p-4">
                <Box className="flex items-center mb-2">
                  <Avatar
                    src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${post.user}`}
                    className="mr-2"
                  />
                  <Typography variant="subtitle1">{post.user}</Typography>
                </Box>
                <Typography variant="body2" className="mb-2">
                  {post.description}
                </Typography>
                <Box className="flex justify-between items-center">
                  <Box className="flex items-center space-x-1">
                    <IconButton size="small">
                      <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">0</Typography>
                  </Box>
                  <Box className="flex items-center space-x-1">
                    <IconButton size="small">
                      <ChatBubbleOutline fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">0</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const UserPublications = () => (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="text-gray-800">
          Mis Publicaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="bg-green-600 hover:bg-green-700 rounded-full text-white"
        >
          Nueva publicación
        </Button>
      </Box>

      <Grid container spacing={3}>
        {[
          {
            title: 'Mi primera foto',
            image: 'https://picsum.photos/seed/landscape/300/300',
          },
          {
            title: 'Mi segunda foto',
            image: 'https://picsum.photos/seed/wildlife/300/300',
          },
          {
            title: 'Descubrimiento interesante',
            image: 'https://picsum.photos/seed/plant/300/300',
          },
        ].map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="bg-sky-100 rounded-xl overflow-hidden h-full">
              <CardMedia
                component="img"
                height="300"
                image={post.image}
                alt={post.title}
                sx={{ objectFit: 'cover', height: 200 }}
              />
              <CardContent className="p-4">
                <Typography variant="h6" className="mb-2">
                  {post.title}
                </Typography>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body2" className="text-gray-600">
                    Público para la comunidad
                  </Typography>
                  <Switch size="small" />
                </Box>
                <Box className="flex justify-between items-center">
                  <Box className="flex items-center space-x-1">
                    <IconButton size="small">
                      <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">0</Typography>
                  </Box>
                  <Box className="flex items-center space-x-1">
                    <IconButton size="small">
                      <ChatBubbleOutline fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">0</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
        <Box mb={4} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Typography
            variant="h3"
            component="h1"
            className="mb-4 text-center font-bold"
            color="primary"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontWeight: 800,
            }}
          >
            Comunidad
          </Typography>
        </Box>

        <Box mb={4} p={4} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="mb-6"
            TabIndicatorProps={{
              style: {
                backgroundColor: theme.palette.primary.main,
                height: '4px',
                borderRadius: '2px',
              },
            }}
          >
            <Tab
              label="Tu espacio"
              className={`font-semibold ${
                activeTab === 0 ? 'text-gray-800' : 'text-gray-500'
              }`}
            />
            <Tab
              label="Otros Exploradores"
              className={`font-semibold ${
                activeTab === 1 ? 'text-gray-800' : 'text-gray-500'
              }`}
            />
          </Tabs>

          {activeTab === 0 ? <UserPublications /> : <CommunityFeed />}
        </Box>
      </Container>

      <Dialog open={openExplorersList} onClose={handleCloseExplorersList}>
        <DialogTitle>Todos los Exploradores</DialogTitle>
        <DialogContent>
          <List>
            {explorers.map((explorer, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={explorer.avatar} />
                </ListItemAvatar>
                <ListItemText primary={explorer.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
