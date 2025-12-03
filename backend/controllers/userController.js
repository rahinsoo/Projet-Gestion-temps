// controllers/userController.js - Contrôleur CRUD pour les utilisateurs
// Ce fichier gère les opérations CRUD sur les utilisateurs via l'API

const User = require('../models/User');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

const UserController = {
  // CREATE - Créer un nouvel utilisateur
  create: async (req, res) => {
    try {
      const { username, email, role } = req.body;

      // Vérification des champs obligatoires
      if (!username || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs username et email sont obligatoires'
        });
      }

      // Vérification si l'utilisateur existe déjà
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.DUPLICATE_ENTRY,
          details: 'Ce nom d\'utilisateur existe déjà'
        });
      }

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.DUPLICATE_ENTRY,
          details: 'Cet email existe déjà'
        });
      }

      // Création de l'utilisateur
      const newUser = await User.create({ username, email, role });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_CREATED,
        data: newUser
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ALL - Récupérer tous les utilisateurs
  getAll: async (req, res) => {
    try {
      const users = await User.findAll();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ONE - Récupérer un utilisateur par son ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // UPDATE - Mettre à jour un utilisateur
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      // Vérification de l'existence de l'utilisateur
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      // Vérification des champs obligatoires
      if (!username || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs username et email sont obligatoires'
        });
      }

      // Mise à jour de l'utilisateur
      const updated = await User.update(id, { username, email, role });

      if (updated) {
        const updatedUser = await User.findById(id);
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.USER_UPDATED,
          data: updatedUser
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // DELETE - Supprimer un utilisateur
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérification de l'existence de l'utilisateur
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      // Suppression de l'utilisateur
      const deleted = await User.delete(id);

      if (deleted) {
        res.status(HTTP_STATUS.NO_CONTENT).send();
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  }
};

module.exports = UserController;
