import { useState, useEffect } from 'react';

const Puzzle = ({ imageUrl }) => {
  const initialPieces = Array.from({ length: 9 }, (_, i) => i);
  const [pieces, setPieces] = useState(initialPieces);
  const [points, setPoints] = useState(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [time, setTime] = useState(0); // Estado para el temporizador
  const [timerActive, setTimerActive] = useState(false); // Estado para controlar el temporizador
  const [moves, setMoves] = useState(0); // Estado para el contador de movimientos

  useEffect(() => {
    shuffleAndResetPuzzle();
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // Función para mezclar las piezas y reiniciar el estado de resuelto, tiempo y movimientos
  const shuffleAndResetPuzzle = () => {
    setPieces(shuffleArray([...initialPieces]));
    setIsPuzzleSolved(false);
    setTime(0); // Reinicia el tiempo al mezclar las piezas
    setMoves(0); // Reinicia el contador de movimientos
    setTimerActive(true); // Activa el temporizador cuando empieza el juego
  };

  // Función para mezclar las piezas
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Manejadores de eventos de arrastrar y soltar
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('pieceIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('pieceIndex'));
    if (draggedIndex !== targetIndex) {
      const newPieces = [...pieces];
      [newPieces[draggedIndex], newPieces[targetIndex]] = [
        newPieces[targetIndex],
        newPieces[draggedIndex],
      ];
      setPieces(newPieces);
      setMoves(moves + 1); // Incrementa el contador de movimientos
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Verifica si el puzzle está resuelto
  const isSolved = pieces.every((piece, index) => piece === index);

  // Incrementa puntos al resolver el puzzle solo una vez y detiene el temporizador
  useEffect(() => {
    if (isSolved && !isPuzzleSolved) {
      setTimerActive(false); // Detiene el temporizador
      const bonusPoints = Math.max(0, 100 - time); // Calcula puntos adicionales basados en el tiempo
      const movePenalty = Math.max(0, 50 - moves); // Calcula puntos adicionales basados en los movimientos (menos movimientos = más puntos)
      setPoints(points + 10 + bonusPoints + movePenalty); // Incrementa los puntos con el bono por tiempo y movimientos
      setIsPuzzleSolved(true); // Marca el puzzle como resuelto para evitar sumar más puntos
    }
  }, [isSolved, isPuzzleSolved, points, time, moves]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>Puzzle Game</h2>
      <p>Puntos: {points}</p>
      <p>Tiempo: {time} segundos</p>
      <p>Movimientos: {moves}</p>
      <div
        style={{
          width: '300px',
          height: '300px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          border: '2px solid #333',
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: `${(piece % 3) * -100}% ${
                Math.floor(piece / 3) * -100
              }%`,
              backgroundSize: '300%',
              border: '1px solid #ddd',
              cursor: 'move',
            }}
          />
        ))}
      </div>
      {isSolved && (
        <p>
          ¡Puzzle resuelto! +10 puntos más {Math.max(0, 100 - time)} puntos de
          bonificación y {Math.max(0, 50 - moves)} puntos por pocos movimientos
        </p>
      )}
      <button
        onClick={shuffleAndResetPuzzle}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Reiniciar Puzzle
      </button>
    </div>
  );
};

export default Puzzle;
