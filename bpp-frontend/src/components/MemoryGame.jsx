import { Box, Typography } from '@mui/material';

const MemoryGame = () => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#2E7D32' }}>
         🃏 Encuentra las Cartas
      </Typography>
      <Box className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg" sx={{ width: '100%', maxWidth: '800px', height: '600px' }}>
        <iframe
          src="https://rococo-travesseiro-8f1ca3.netlify.app/"
          title="Encuentra las Cartas"
          className="w-full h-full border-none"
          allow="fullscreen"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default MemoryGame;