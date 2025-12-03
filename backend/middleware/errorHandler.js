// middleware/errorHandler.js - Middleware de gestion des erreurs
// Ce fichier gère les erreurs de manière centralisée pour toute l'application

const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

// Fonction pour sanitizer les messages d'erreur
const sanitizeErrorMessage = (message) => {
  // Supprime les chemins de fichiers potentiellement sensibles
  const sanitized = message
    .replace(/\/[^\s]+/g, '[path]')  // Remplace les chemins Unix
    .replace(/[A-Z]:\\[^\s]+/g, '[path]')  // Remplace les chemins Windows
    .replace(/at\s+.+\(.+\)/g, '')  // Supprime les références de stack trace
    .trim();
  return sanitized;
};

// Middleware de gestion des erreurs global
const errorHandler = (err, req, res, next) => {
  // Log l'erreur complète côté serveur (jamais exposée au client)
  console.error('Erreur capturée:', err);

  // Erreur de validation SQLite (contrainte unique, etc.)
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.DUPLICATE_ENTRY,
      details: 'Une contrainte de base de données a été violée'
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

  // Erreur par défaut - ne jamais exposer les détails en production
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR
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
