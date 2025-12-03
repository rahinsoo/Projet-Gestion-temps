// controllers/taskController.js - Contrôleur CRUD pour les tâches
// Ce fichier gère les opérations CRUD sur les tâches via l'API

const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, TASK_STATUS } = require('../config/constants');

const TaskController = {
  // CREATE - Créer une nouvelle tâche
  create: async (req, res) => {
    try {
      const { project_id, name, description, assigned_to, time_spent, status } = req.body;

      // Vérification des champs obligatoires
      if (!project_id || !name) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs project_id et name sont obligatoires'
        });
      }

      // Vérification de l'existence du projet
      const project = await Project.findById(project_id);
      if (!project) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
          details: 'Le projet spécifié n\'existe pas'
        });
      }

      // Vérification de l'existence de l'utilisateur assigné si fourni
      if (assigned_to) {
        const user = await User.findById(assigned_to);
        if (!user) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.USER_NOT_FOUND,
            details: 'L\'utilisateur assigné n\'existe pas'
          });
        }
      }

      // Validation du statut
      if (status && !Object.values(TASK_STATUS).includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_DATA,
          details: `Statut invalide. Valeurs acceptées: ${Object.values(TASK_STATUS).join(', ')}`
        });
      }

      // Création de la tâche
      const newTask = await Task.create({ project_id, name, description, assigned_to, time_spent, status });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.TASK_CREATED,
        data: newTask
      });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ALL - Récupérer toutes les tâches
  getAll: async (req, res) => {
    try {
      const tasks = await Task.findAll();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ ONE - Récupérer une tâche par son ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.TASK_NOT_FOUND
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ BY PROJECT - Récupérer les tâches d'un projet
  getByProjectId: async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Vérification de l'existence du projet
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND
        });
      }

      const tasks = await Task.findByProjectId(projectId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches du projet:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // READ BY USER - Récupérer les tâches assignées à un utilisateur
  getByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Vérification de l'existence de l'utilisateur
      const user = await User.findById(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND
        });
      }

      const tasks = await Task.findByUserId(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches de l\'utilisateur:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // UPDATE - Mettre à jour une tâche
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { project_id, name, description, assigned_to, time_spent, status } = req.body;

      // Vérification de l'existence de la tâche
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.TASK_NOT_FOUND
        });
      }

      // Vérification des champs obligatoires
      if (!project_id || !name) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.REQUIRED_FIELDS_MISSING,
          details: 'Les champs project_id et name sont obligatoires'
        });
      }

      // Vérification de l'existence du projet
      const project = await Project.findById(project_id);
      if (!project) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.PROJECT_NOT_FOUND,
          details: 'Le projet spécifié n\'existe pas'
        });
      }

      // Vérification de l'existence de l'utilisateur assigné si fourni
      if (assigned_to) {
        const user = await User.findById(assigned_to);
        if (!user) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.USER_NOT_FOUND,
            details: 'L\'utilisateur assigné n\'existe pas'
          });
        }
      }

      // Validation du statut
      if (status && !Object.values(TASK_STATUS).includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_DATA,
          details: `Statut invalide. Valeurs acceptées: ${Object.values(TASK_STATUS).join(', ')}`
        });
      }

      // Mise à jour de la tâche
      const updated = await Task.update(id, { project_id, name, description, assigned_to, time_spent, status });

      if (updated) {
        const updatedTask = await Task.findById(id);
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.TASK_UPDATED,
          data: updatedTask
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  },

  // DELETE - Supprimer une tâche
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Vérification de l'existence de la tâche
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.TASK_NOT_FOUND
        });
      }

      // Suppression de la tâche
      const deleted = await Task.delete(id);

      if (deleted) {
        res.status(HTTP_STATUS.NO_CONTENT).send();
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        details: error.message
      });
    }
  }
};

module.exports = TaskController;
