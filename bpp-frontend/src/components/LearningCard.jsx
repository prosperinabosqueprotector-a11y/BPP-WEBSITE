import { Card, CardMedia, CardContent, Typography, Grow } from '@mui/material';
import { Link } from 'react-router-dom';

const LearningCard = ({ option, index }) => {
  return (
    <Grow
      in={true}
      style={{ transformOrigin: '0 0 0' }}
      timeout={1000 + index * 200}
    >
      <Card className="relative overflow-hidden group">
        <Link to={option.route} className="text-inherit no-underline">
          <CardMedia
            component="img"
            height="140"
            image={option.image}
            alt={option.title}
            className="h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <CardContent className="text-center relative z-10 bg-opacity-80 bg-white">
            <Typography variant="h5" component="div" className="font-bold">
              {option.icon} {option.title}
            </Typography>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </Link>
      </Card>
    </Grow>
  );
};

export default LearningCard;
