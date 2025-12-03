// models/Project.js - Modèle projet
// Ce fichier définit les opérations de base de données pour les projets

const { run, get, all } = require('../config/database');

const Project = {
  // Créer un nouveau projet
  create: async (projectData) => {
    const { name, client_id = null, description = null, status = 'active' } = projectData;
    const sql = `
      INSERT INTO projects (name, client_id, description, status)
      VALUES (?, ?, ?, ?)
    `;
    const result = await run(sql, [name, client_id, description, status]);
    return { id: result.id, name, client_id, description, status };
  },

  // Récupérer tous les projets
  findAll: async () => {
    const sql = `
      SELECT p.*, c.name as client_name
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `;
    return await all(sql);
  },

  // Récupérer un projet par son ID
  findById: async (id) => {
    const sql = `
      SELECT p.*, c.name as client_name
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = ?
    `;
    return await get(sql, [id]);
  },

  // Récupérer les projets d'un client
  findByClientId: async (clientId) => {
    const sql = 'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC';
    return await all(sql, [clientId]);
  },

  // Mettre à jour un projet
  update: async (id, projectData) => {
    const { name, client_id, description, status } = projectData;
    const sql = `
      UPDATE projects
      SET name = ?, client_id = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await run(sql, [name, client_id, description, status, id]);
    return result.changes > 0;
  },

  // Supprimer un projet
  delete: async (id) => {
    const sql = 'DELETE FROM projects WHERE id = ?';
    const result = await run(sql, [id]);
    return result.changes > 0;
  }
};

module.exports = Project;
