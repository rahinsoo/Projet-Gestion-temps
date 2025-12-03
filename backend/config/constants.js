// config/constants.js - Constantes de l'application
// Ce fichier contient toutes les constantes utilisées dans l'application

// Rôles utilisateur disponibles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Statuts de projet disponibles
const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

// Statuts de tâche disponibles
const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

// Codes HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Messages d'erreur
const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  CLIENT_NOT_FOUND: 'Client non trouvé',
  PROJECT_NOT_FOUND: 'Projet non trouvé',
  TASK_NOT_FOUND: 'Tâche non trouvée',
  REQUIRED_FIELDS_MISSING: 'Champs obligatoires manquants',
  INVALID_DATA: 'Données invalides',
  SERVER_ERROR: 'Erreur interne du serveur',
  DUPLICATE_ENTRY: 'Cette entrée existe déjà'
};

// Messages de succès
const SUCCESS_MESSAGES = {
  USER_CREATED: 'Utilisateur créé avec succès',
  USER_UPDATED: 'Utilisateur mis à jour avec succès',
  USER_DELETED: 'Utilisateur supprimé avec succès',
  CLIENT_CREATED: 'Client créé avec succès',
  CLIENT_UPDATED: 'Client mis à jour avec succès',
  CLIENT_DELETED: 'Client supprimé avec succès',
  PROJECT_CREATED: 'Projet créé avec succès',
  PROJECT_UPDATED: 'Projet mis à jour avec succès',
  PROJECT_DELETED: 'Projet supprimé avec succès',
  TASK_CREATED: 'Tâche créée avec succès',
  TASK_UPDATED: 'Tâche mise à jour avec succès',
  TASK_DELETED: 'Tâche supprimée avec succès'
};

module.exports = {
  USER_ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
