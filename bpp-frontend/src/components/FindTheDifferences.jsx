import { Box } from '@mui/material';

const FindTheDifferences = () => {
  return (
    <Box className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://rococo-travesseiro-8f1ca3.netlify.app/"
        title="Encuentra las Cartas"
        className="w-full h-full border-none"
        allow="fullscreen"
      />
    </Box>
  );
};

export default FindTheDifferences;
