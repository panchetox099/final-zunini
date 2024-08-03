const authMiddleware = (req, res, next) => {
    // Implementa lógica de autenticación aquí
    next();
  };
  
  module.exports = authMiddleware;
  