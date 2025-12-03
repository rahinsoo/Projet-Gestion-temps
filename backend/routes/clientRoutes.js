// routes/clientRoutes.js - Routes API pour les clients
// Ce fichier définit les endpoints pour les opérations CRUD sur les clients

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// POST /api/clients - Créer un nouveau client
router.post('/clients', clientController.create);

// GET /api/clients - Récupérer tous les clients
router.get('/clients', clientController.getAll);

// GET /api/clients/:id - Récupérer un client par son ID
router.get('/clients/:id', clientController.getById);

// PUT /api/clients/:id - Mettre à jour un client
router.put('/clients/:id', clientController.update);

// DELETE /api/clients/:id - Supprimer un client
router.delete('/clients/:id', clientController.delete);

module.exports = router;
