const { admin } = require('../firebaseAuthConfig');

// Verifica que esté autenticado
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // uid, email, claims, etc.
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Verifica que esté autenticado y tenga un rol específico
function verifyRole(requiredRole) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      if (decodedToken.rol !== requiredRole) {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol ' + requiredRole });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

module.exports = { verifyToken, verifyRole };
