// app.js - Point d'entrée principal de l'application backend
// Configure Express, les middlewares, les routes et la connexion à la base de données

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Configuration CORS
app.use(cors());

// Middlewares pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import des middlewares d'erreur
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route de santé pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API TimeManager opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Montage des routes API
app.use('/api', userRoutes);
app.use('/api', clientRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

// Middleware pour les routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion des erreurs (doit être le dernier)
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur TimeManager démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
  console.log(`Vérification de santé: http://localhost:${PORT}/api/health`);
});

module.exports = app;
