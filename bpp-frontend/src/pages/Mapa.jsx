import { useState } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Container,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Forest-themed SVG icon
const forestIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2E7D32" width="16px" height="16px">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
</svg>
`;


// Custom icon creator function
const createForestIcon = () => {
  return L.divIcon({
    html: `
      <div class="marker-pin">
        <div class="marker-icon">${forestIcon}</div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const pointsOfInterest = [
  {
    id: 1,
    name: 'Casa de Interpretación',
    lat: -2.151852,
    lng: -79.960755,
    description:
      'Pequeño centro de inicio con mapas y recursos para conocer la flora y fauna del bosque.',
  },
  {
    id: 2,
    name: 'Vivero Forestal',
    lat: -2.152713,
    lng: -79.961740,
    description:
      'Área destinada al cuidado de plantas nativas.',
  },
  {
    id: 3,
    name: 'Elefante Sonriente',
    lat: -2.1527778,
    lng: -79.96333333333334,
    description:
      'Un árbol singular cuya forma recuerda a la silueta de un elefante sonriente.',
  },
  {
    id: 4,
    name: 'Estacion Fotovoltaica 2',
    lat: -2.1525,
    lng: -79.96388888888889,
    description:
      'Otro punto de paneles solares.',
  },
  {
    id: 5,
    name: 'Zona de Descanso',
    lat: -2.1522222,
    lng: -79.96416666666667,
    description: 'Espacio con bancas y sombra ideal para relajarse y recuperar energías durante el recorrido',
  },
  {
    id: 6,
    name: 'Estacion Fotovoltaica 1',
    lat: -2.1530556,
    lng: -79.96388888888889,
    description:
      'Pequeño punto con paneles solares en el sendero',
  },
  {
    id: 7,
    name: 'Mirador',
    lat: -2.155556,
    lng: -79.962500,
    description:
      'Un punto panorámico que ofrece vistas privilegiadas del bosque y sus alrededores.',
  }
];

export default function Mapa({ theme }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
  };

  const handleCloseDialog = () => {
    setSelectedPoint(null);
  };

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
        <Box mb={4} p={2} bgcolor="rgba(255, 255, 255, 0.9)" borderRadius={4}>
          <Typography
            variant="h3"
            component="h1"
            className="mb-2 text-center font-bold"
            color="primary"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontWeight: 800,
            }}
          >
            Mapa de Aventuras 🎉
          </Typography>
        </Box>

        <Box
          sx={{
            height: 'calc(100vh - 200px)',
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow:
              '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          }}
        >
          <MapContainer
            center={[-2.153573, -79.962389]}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {pointsOfInterest.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={createForestIcon()}
                eventHandlers={{
                  click: () => handleMarkerClick(point),
                }}
              >
                <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {point.name}
                  </Typography>
                </Tooltip>
              </Marker>
            ))}
            {/* Línea que une los puntos */}
            <Polyline
              positions={pointsOfInterest.map((point) => [point.lat, point.lng])}
              pathOptions={{ color: '#b01d04', weight: 4, opacity: 0.7 }}
            />
          </MapContainer>
        </Box>
      </Container>

      <Dialog
        open={!!selectedPoint}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.primary.main, pb: 2 }}>
          {selectedPoint?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: theme.palette.text.secondary, pb: 2 }}
          >
            {selectedPoint?.description}
          </DialogContentText>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '20px' }}
          >
            ¡Genial!
          </Button>
        </Box>
      </Dialog>

      <style>
        {`
          @keyframes markerPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes markerHover {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }
          .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            background: #FF5722;
            position: absolute;
            transform: rotate(-45deg);
            left: 50%;
            top: 50%;
            margin: -15px 0 0 -15px;
            transition: all 0.3s ease;
          }
          .marker-icon {
            background: #fff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            position: absolute;
            transform: rotate(45deg);
            left: 3px;
            top: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .leaflet-marker-icon:hover .marker-pin {
            animation: markerHover 0.5s ease-in-out infinite;
          }
          .leaflet-tooltip {
            background-color: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(10px);
          }
          .leaflet-tooltip-top:before {
            border-top-color: rgba(255, 255, 255, 0.9);
          }
          .leaflet-marker-icon:hover + .leaflet-tooltip {
            opacity: 1;
            transform: translateY(0);
          }
        `}
      </style>
    </Box>
  );
}