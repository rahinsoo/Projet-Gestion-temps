// routes/taskRoutes.js - Routes API pour les tâches
// Ce fichier définit les endpoints pour les opérations CRUD sur les tâches

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /api/tasks - Créer une nouvelle tâche
router.post('/tasks', taskController.create);

// GET /api/tasks - Récupérer toutes les tâches
router.get('/tasks', taskController.getAll);

// GET /api/tasks/:id - Récupérer une tâche par son ID
router.get('/tasks/:id', taskController.getById);

// GET /api/tasks/project/:projectId - Récupérer les tâches d'un projet
router.get('/tasks/project/:projectId', taskController.getByProjectId);

// GET /api/tasks/user/:userId - Récupérer les tâches assignées à un utilisateur
router.get('/tasks/user/:userId', taskController.getByUserId);

// PUT /api/tasks/:id - Mettre à jour une tâche
router.put('/tasks/:id', taskController.update);

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/tasks/:id', taskController.delete);

module.exports = router;
