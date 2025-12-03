// routes/projectRoutes.js - Routes API pour les projets
// Ce fichier définit les endpoints pour les opérations CRUD sur les projets

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// POST /api/projects - Créer un nouveau projet
router.post('/projects', projectController.create);

// GET /api/projects - Récupérer tous les projets
router.get('/projects', projectController.getAll);

// GET /api/projects/:id - Récupérer un projet par son ID
router.get('/projects/:id', projectController.getById);

// GET /api/projects/client/:clientId - Récupérer les projets d'un client
router.get('/projects/client/:clientId', projectController.getByClientId);

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/projects/:id', projectController.update);

// DELETE /api/projects/:id - Supprimer un projet
router.delete('/projects/:id', projectController.delete);

module.exports = router;
