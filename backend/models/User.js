// models/User.js - Modèle utilisateur
// Ce fichier définit les opérations de base de données pour les utilisateurs

const { run, get, all } = require('../config/database');

const User = {
  // Créer un nouvel utilisateur
  create: async (userData) => {
    const { username, email, role = 'user' } = userData;
    const sql = `
      INSERT INTO users (username, email, role)
      VALUES (?, ?, ?)
    `;
    const result = await run(sql, [username, email, role]);
    return { id: result.id, username, email, role };
  },

  // Récupérer tous les utilisateurs
  findAll: async () => {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    return await all(sql);
  },

  // Récupérer un utilisateur par son ID
  findById: async (id) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await get(sql, [id]);
  },

  // Récupérer un utilisateur par son username
  findByUsername: async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    return await get(sql, [username]);
  },

  // Récupérer un utilisateur par son email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await get(sql, [email]);
  },

  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const { username, email, role } = userData;
    const sql = `
      UPDATE users
      SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await run(sql, [username, email, role, id]);
    return result.changes > 0;
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await run(sql, [id]);
    return result.changes > 0;
  }
};

module.exports = User;
