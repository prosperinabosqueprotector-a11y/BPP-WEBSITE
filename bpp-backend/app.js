const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Importa las rutas existentes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const puzzleRouter = require('./routes/puzzle');

// Importa las nuevas rutas para Firebase Firestore
const quizRouter = require('./routes/quiz');
const scoresRouter = require('./routes/scores');
const dataRouter = require('./routes/data');

const app = express();

// Configura CORS para permitir solicitudes desde el frontend en el puerto 5173
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas existentes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', puzzleRouter);

// Rutas nuevas con Firebase Firestore
app.use('/api/quiz', quizRouter); // 📌 Rutas para preguntas del quiz
app.use('/api/scores', scoresRouter); // 📌 Rutas para guardar puntuaciones
app.use('/api/data', dataRouter); // 📌 Rutas para información de flora/fauna

// Manejo de errores (404)
app.use((req, res, next) => {
  next(createError(404));
});

// Manejo de errores generales
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
