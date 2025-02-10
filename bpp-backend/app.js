const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// 🔥 Inicializar Express antes de importar las rutas
const app = express();

// 🔥 Importar rutas después de inicializar Express
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const puzzleRouter = require("./routes/puzzle");

// Importa las nuevas rutas para Firebase Firestore
const quizRouter = require("./routes/quiz");
const scoresRouter = require("./routes/scores");
const dataRouter = require("./routes/data");
const reviewsRouter = require("./routes/reviews"); // ✅ Importado correctamente

// 🔥 Configurar Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 Configurar rutas después del middleware
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", puzzleRouter);
app.use("/api/quiz", quizRouter); // 📌 Rutas para preguntas del quiz
app.use("/api/scores", scoresRouter); // 📌 Rutas para guardar puntuaciones
app.use("/api/data", dataRouter); // 📌 Rutas para información de flora/fauna
app.use("/api/reviews", reviewsRouter); // 📌 Rutas para reseñas

// 🔥 Manejo de errores (404)
app.use((req, res, next) => {
  next(createError(404));
});

// 🔥 Manejo de errores generales
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
