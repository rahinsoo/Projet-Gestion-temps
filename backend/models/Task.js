// models/Task.js - Modèle tâche
// Ce fichier définit les opérations de base de données pour les tâches

const { run, get, all } = require('../config/database');

const Task = {
  // Créer une nouvelle tâche
  create: async (taskData) => {
    const { 
      project_id, 
      name, 
      description = null, 
      assigned_to = null, 
      time_spent = 0, 
      status = 'todo' 
    } = taskData;
    const sql = `
      INSERT INTO tasks (project_id, name, description, assigned_to, time_spent, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await run(sql, [project_id, name, description, assigned_to, time_spent, status]);
    return { id: result.id, project_id, name, description, assigned_to, time_spent, status };
  },

  // Récupérer toutes les tâches
  findAll: async () => {
    const sql = `
      SELECT t.*, p.name as project_name, u.username as assigned_to_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      ORDER BY t.created_at DESC
    `;
    return await all(sql);
  },

  // Récupérer une tâche par son ID
  findById: async (id) => {
    const sql = `
      SELECT t.*, p.name as project_name, u.username as assigned_to_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `;
    return await get(sql, [id]);
  },

  // Récupérer les tâches d'un projet
  findByProjectId: async (projectId) => {
    const sql = `
      SELECT t.*, u.username as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `;
    return await all(sql, [projectId]);
  },

  // Récupérer les tâches assignées à un utilisateur
  findByUserId: async (userId) => {
    const sql = `
      SELECT t.*, p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ?
      ORDER BY t.created_at DESC
    `;
    return await all(sql, [userId]);
  },

  // Mettre à jour une tâche
  update: async (id, taskData) => {
    const { project_id, name, description, assigned_to, time_spent, status } = taskData;
    const sql = `
      UPDATE tasks
      SET project_id = ?, name = ?, description = ?, assigned_to = ?, 
          time_spent = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await run(sql, [project_id, name, description, assigned_to, time_spent, status, id]);
    return result.changes > 0;
  },

  // Supprimer une tâche
  delete: async (id) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const result = await run(sql, [id]);
    return result.changes > 0;
  }
};

module.exports = Task;
