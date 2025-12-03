// controllers/clientController.js - Contrôleur CRUD pour les clients
// Ce fichier gère les opérations CRUD sur les clients via l'API

const Client = require('../models/Client');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

const ClientController = {
  // CREATE - Créer un nouveau client
  create: async (req, res) => {
    try {
      const { name, email, phone, company } = req.body;

      // Vérification des champs obligatoires
      if (!name || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs name et email sont obligatoires'
        });
      }

      // Création du client
      const newClient = await Client.create({ name, email, phone, company });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.CLIENT_CREATED,
        data: newClient
      });
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ALL - Récupérer tous les clients
  getAll: async (req, res) => {
    try {
      const clients = await Client.findAll();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: clients,
        count: clients.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ONE - Récupérer un client par son ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);

      if (!client) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.CLIENT_NOT_FOUND
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // UPDATE - Mettre à jour un client
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, company } = req.body;

      // Vérification de l'existence du client
      const existingClient = await Client.findById(id);
      if (!existingClient) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.CLIENT_NOT_FOUND
        });
      }

      // Vérification des champs obligatoires
      if (!name || !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs name et email sont obligatoires'
        });
      }

      // Mise à jour du client
      const updated = await Client.update(id, { name, email, phone, company });

      if (updated) {
        const updatedClient = await Client.findById(id);
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.CLIENT_UPDATED,
          data: updatedClient
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // DELETE - Supprimer un client
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérification de l'existence du client
      const existingClient = await Client.findById(id);
      if (!existingClient) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.CLIENT_NOT_FOUND
        });
      }

      // Suppression du client
      const deleted = await Client.delete(id);

      if (deleted) {
        res.status(HTTP_STATUS.NO_CONTENT).send();
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  }
};

module.exports = ClientController;
