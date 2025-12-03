// routes/userRoutes.js - Routes API pour les utilisateurs
// Ce fichier définit les endpoints pour les opérations CRUD sur les utilisateurs

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users - Créer un nouvel utilisateur
router.post('/users', userController.create);

// GET /api/users - Récupérer tous les utilisateurs
router.get('/users', userController.getAll);

// GET /api/users/:id - Récupérer un utilisateur par son ID
router.get('/users/:id', userController.getById);

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/users/:id', userController.update);

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/users/:id', userController.delete);

module.exports = router;
