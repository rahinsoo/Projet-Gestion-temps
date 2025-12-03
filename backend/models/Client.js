// models/Client.js - Modèle client
// Ce fichier définit les opérations de base de données pour les clients

const { run, get, all } = require('../config/database');

const Client = {
  // Créer un nouveau client
  create: async (clientData) => {
    const { name, email, phone = null, company = null } = clientData;
    const sql = `
      INSERT INTO clients (name, email, phone, company)
      VALUES (?, ?, ?, ?)
    `;
    const result = await run(sql, [name, email, phone, company]);
    return { id: result.id, name, email, phone, company };
  },

  // Récupérer tous les clients
  findAll: async () => {
    const sql = 'SELECT * FROM clients ORDER BY created_at DESC';
    return await all(sql);
  },

  // Récupérer un client par son ID
  findById: async (id) => {
    const sql = 'SELECT * FROM clients WHERE id = ?';
    return await get(sql, [id]);
  },

  // Récupérer un client par son email
  findByEmail: async (email) => {
    const sql = 'SELECT * FROM clients WHERE email = ?';
    return await get(sql, [email]);
  },

  // Mettre à jour un client
  update: async (id, clientData) => {
    const { name, email, phone, company } = clientData;
    const sql = `
      UPDATE clients
      SET name = ?, email = ?, phone = ?, company = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await run(sql, [name, email, phone, company, id]);
    return result.changes > 0;
  },

  // Supprimer un client
  delete: async (id) => {
    const sql = 'DELETE FROM clients WHERE id = ?';
    const result = await run(sql, [id]);
    return result.changes > 0;
  }
};

module.exports = Client;
