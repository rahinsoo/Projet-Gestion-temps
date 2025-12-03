// middleware/validation.js - Middleware de validation des données
// Ce fichier contient les middlewares de validation pour les entrées utilisateur

const { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES, PROJECT_STATUS, TASK_STATUS } = require('../config/constants');

// Validation de l'email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation du téléphone (format international simple)
const isValidPhone = (phone) => {
  if (!phone) return true; // Le téléphone est optionnel
  const phoneRegex = /^[+]?[\d\s-]{8,20}$/;
  return phoneRegex.test(phone);
};

// Middleware de validation pour les utilisateurs
const validateUser = (req, res, next) => {
  const { username, email, role } = req.body;

  // Validation du username
  if (username !== undefined && (typeof username !== 'string' || username.trim().length < 2)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le nom d\'utilisateur doit contenir au moins 2 caractères'
    });
  }

  // Validation de l'email
  if (email !== undefined && !isValidEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le format de l\'email est invalide'
    });
  }

  // Validation du rôle
  if (role !== undefined && !Object.values(USER_ROLES).includes(role)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: `Rôle invalide. Valeurs acceptées: ${Object.values(USER_ROLES).join(', ')}`
    });
  }

  next();
};

// Middleware de validation pour les clients
const validateClient = (req, res, next) => {
  const { name, email, phone } = req.body;

  // Validation du nom
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le nom doit contenir au moins 2 caractères'
    });
  }

  // Validation de l'email
  if (email !== undefined && !isValidEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le format de l\'email est invalide'
    });
  }

  // Validation du téléphone
  if (!isValidPhone(phone)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le format du numéro de téléphone est invalide'
    });
  }

  next();
};

// Middleware de validation pour les projets
const validateProject = (req, res, next) => {
  const { name, status } = req.body;

  // Validation du nom
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le nom du projet doit contenir au moins 2 caractères'
    });
  }

  // Validation du statut
  if (status !== undefined && !Object.values(PROJECT_STATUS).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: `Statut invalide. Valeurs acceptées: ${Object.values(PROJECT_STATUS).join(', ')}`
    });
  }

  next();
};

// Middleware de validation pour les tâches
const validateTask = (req, res, next) => {
  const { name, time_spent, status } = req.body;

  // Validation du nom
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le nom de la tâche doit contenir au moins 2 caractères'
    });
  }

  // Validation du temps passé
  if (time_spent !== undefined && (typeof time_spent !== 'number' || time_spent < 0)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'Le temps passé doit être un nombre positif'
    });
  }

  // Validation du statut
  if (status !== undefined && !Object.values(TASK_STATUS).includes(status)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: `Statut invalide. Valeurs acceptées: ${Object.values(TASK_STATUS).join(', ')}`
    });
  }

  next();
};

// Middleware de validation de l'ID (paramètre URL)
const validateId = (req, res, next) => {
  const id = req.params.id || req.params.projectId || req.params.clientId || req.params.userId;
  
  if (id && (isNaN(parseInt(id)) || parseInt(id) < 1)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_DATA,
      details: 'L\'identifiant doit être un nombre entier positif'
    });
  }

  next();
};

module.exports = {
  validateUser,
  validateClient,
  validateProject,
  validateTask,
  validateId,
  isValidEmail,
  isValidPhone
};
