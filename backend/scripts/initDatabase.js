// scripts/initDatabase.js - Script d'initialisation de la base de données
// Ce script crée les tables nécessaires et ajoute des données de démonstration

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new sqlite3.Database(path.resolve(__dirname, '..', dbPath));

console.log('Initialisation de la base de données...');

// Active les clés étrangères
db.run('PRAGMA foreign_keys = ON');

// Création des tables
db.serialize(() => {
  // Table Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table users:', err.message);
    } else {
      console.log('Table users créée avec succès');
    }
  });

  // Table Clients
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table clients:', err.message);
    } else {
      console.log('Table clients créée avec succès');
    }
  });

  // Table Projects
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      client_id INTEGER,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table projects:', err.message);
    } else {
      console.log('Table projects créée avec succès');
    }
  });

  // Table Tasks
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      assigned_to INTEGER,
      time_spent INTEGER DEFAULT 0,
      status TEXT DEFAULT 'todo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table tasks:', err.message);
    } else {
      console.log('Table tasks créée avec succès');
    }
  });

  // Insertion des données de démonstration
  console.log('\nInsertion des données de démonstration...');

  // Utilisateurs
  const users = [
    { username: 'admin', email: 'admin@timemanager.fr', role: 'admin' },
    { username: 'marie_dupont', email: 'marie.dupont@timemanager.fr', role: 'user' },
    { username: 'jean_martin', email: 'jean.martin@timemanager.fr', role: 'user' }
  ];

  const stmtUsers = db.prepare('INSERT OR IGNORE INTO users (username, email, role) VALUES (?, ?, ?)');
  users.forEach(user => {
    stmtUsers.run(user.username, user.email, user.role);
  });
  stmtUsers.finalize();
  console.log('Utilisateurs de démonstration insérés');

  // Clients
  const clients = [
    { name: 'TechCorp SA', email: 'contact@techcorp.fr', phone: '+33 1 23 45 67 89', company: 'TechCorp SA' },
    { name: 'StartupX', email: 'info@startupx.fr', phone: '+33 1 98 76 54 32', company: 'StartupX SAS' },
    { name: 'BigCompany', email: 'contact@bigcompany.fr', phone: '+33 1 11 22 33 44', company: 'BigCompany International' }
  ];

  const stmtClients = db.prepare('INSERT OR IGNORE INTO clients (name, email, phone, company) VALUES (?, ?, ?, ?)');
  clients.forEach(client => {
    stmtClients.run(client.name, client.email, client.phone, client.company);
  });
  stmtClients.finalize();
  console.log('Clients de démonstration insérés');

  // Projets
  const projects = [
    { name: 'Site Web E-commerce', client_id: 1, description: 'Développement d\'une plateforme e-commerce complète', status: 'active' },
    { name: 'Application Mobile', client_id: 1, description: 'Application iOS et Android', status: 'active' },
    { name: 'Refonte UX', client_id: 2, description: 'Refonte de l\'interface utilisateur', status: 'active' },
    { name: 'Migration Cloud', client_id: 3, description: 'Migration de l\'infrastructure vers le cloud', status: 'on-hold' }
  ];

  const stmtProjects = db.prepare('INSERT OR IGNORE INTO projects (name, client_id, description, status) VALUES (?, ?, ?, ?)');
  projects.forEach(project => {
    stmtProjects.run(project.name, project.client_id, project.description, project.status);
  });
  stmtProjects.finalize();
  console.log('Projets de démonstration insérés');

  // Tâches
  const tasks = [
    { project_id: 1, name: 'Design maquettes', description: 'Création des maquettes Figma', assigned_to: 2, time_spent: 8, status: 'done' },
    { project_id: 1, name: 'Développement Frontend', description: 'Intégration HTML/CSS/JS', assigned_to: 3, time_spent: 12, status: 'in-progress' },
    { project_id: 1, name: 'Tests unitaires', description: 'Écriture des tests unitaires', assigned_to: 2, time_spent: 0, status: 'todo' },
    { project_id: 2, name: 'Architecture technique', description: 'Définition de l\'architecture', assigned_to: 1, time_spent: 4, status: 'done' },
    { project_id: 2, name: 'Développement iOS', description: 'Développement de l\'app iOS', assigned_to: 3, time_spent: 6, status: 'in-progress' },
    { project_id: 3, name: 'Audit UX', description: 'Analyse de l\'existant', assigned_to: 2, time_spent: 3, status: 'in-progress' }
  ];

  const stmtTasks = db.prepare('INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (?, ?, ?, ?, ?, ?)');
  tasks.forEach(task => {
    stmtTasks.run(task.project_id, task.name, task.description, task.assigned_to, task.time_spent, task.status);
  });
  stmtTasks.finalize();
  console.log('Tâches de démonstration insérées');

  console.log('\nBase de données initialisée avec succès!');
});

// Fermer la connexion après un délai pour permettre aux opérations de se terminer
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err.message);
    } else {
      console.log('Connexion à la base de données fermée');
    }
  });
}, 1000);
