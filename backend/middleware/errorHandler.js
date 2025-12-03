// middleware/errorHandler.js - Middleware de gestion des erreurs
// Ce fichier gère les erreurs de manière centralisée pour toute l'application

const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

// Middleware de gestion des erreurs global
const errorHandler = (err, req, res, next) => {
  console.error('Erreur capturée:', err);

  // Erreur de validation SQLite (contrainte unique, etc.)
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.DUPLICATE_ENTRY,
      details: err.message
    });
  }

  // Erreur de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le format JSON de la requête est invalide'
    });
  }

  // Erreur par défaut
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Middleware pour les routes non trouvées
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: 'Route non trouvée',
    details: `La route ${req.method} ${req.originalUrl} n'existe pas`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
