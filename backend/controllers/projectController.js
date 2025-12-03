// controllers/projectController.js - Contrôleur CRUD pour les projets
// Ce fichier gère les opérations CRUD sur les projets via l'API

const Project = require('../models/Project');
const Client = require('../models/Client');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, PROJECT_STATUS } = require('../config/constants');

const ProjectController = {
  // CREATE - Créer un nouveau projet
  create: async (req, res) => {
    try {
      const { name, client_id, description, status } = req.body;

      // Vérification des champs obligatoires
      if (!name) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Le champ name est obligatoire'
        });
      }

      // Vérification de l'existence du client si fourni
      if (client_id) {
        const client = await Client.findById(client_id);
        if (!client) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.CLIENT_NOT_FOUND,
            details: 'Le client spécifié n\'existe pas'
          });
        }
      }

      // Validation du statut
      if (status && !Object.values(PROJECT_STATUS).includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_DATA,
          details: `Statut invalide. Valeurs acceptées: ${Object.values(PROJECT_STATUS).join(', ')}`
        });
      }

      // Création du projet
      const newProject = await Project.create({ name, client_id, description, status });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.PROJECT_CREATED,
        data: newProject
      });
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ALL - Récupérer tous les projets
  getAll: async (req, res) => {
    try {
      const projects = await Project.findAll();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ONE - Récupérer un projet par son ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);

      if (!project) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ BY CLIENT - Récupérer les projets d'un client
  getByClientId: async (req, res) => {
    try {
      const { clientId } = req.params;
      
      // Vérification de l'existence du client
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.CLIENT_NOT_FOUND
        });
      }

      const projects = await Project.findByClientId(clientId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets du client:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // UPDATE - Mettre à jour un projet
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, client_id, description, status } = req.body;

      // Vérification de l'existence du projet
      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND
        });
      }

      // Vérification des champs obligatoires
      if (!name) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Le champ name est obligatoire'
        });
      }

      // Vérification de l'existence du client si fourni
      if (client_id) {
        const client = await Client.findById(client_id);
        if (!client) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.CLIENT_NOT_FOUND,
            details: 'Le client spécifié n\'existe pas'
          });
        }
      }

      // Validation du statut
      if (status && !Object.values(PROJECT_STATUS).includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_DATA,
          details: `Statut invalide. Valeurs acceptées: ${Object.values(PROJECT_STATUS).join(', ')}`
        });
      }

      // Mise à jour du projet
      const updated = await Project.update(id, { name, client_id, description, status });

      if (updated) {
        const updatedProject = await Project.findById(id);
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.PROJECT_UPDATED,
          data: updatedProject
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // DELETE - Supprimer un projet
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérification de l'existence du projet
      const existingProject = await Project.findById(id);
      if (!existingProject) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND
        });
      }

      // Suppression du projet
      const deleted = await Project.delete(id);

      if (deleted) {
        res.status(HTTP_STATUS.NO_CONTENT).send();
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  }
};

module.exports = ProjectController;
