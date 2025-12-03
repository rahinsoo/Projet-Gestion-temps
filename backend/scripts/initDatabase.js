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

// Création des tables et insertion des données
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
    if (err) console.error('Erreur table users:', err.message);
    else console.log('Table users créée avec succès');
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
    if (err) console.error('Erreur table clients:', err.message);
    else console.log('Table clients créée avec succès');
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
    if (err) console.error('Erreur table projects:', err.message);
    else console.log('Table projects créée avec succès');
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
    if (err) console.error('Erreur table tasks:', err.message);
    else console.log('Table tasks créée avec succès');
  });

  // Insertion des données de démonstration
  console.log('\nInsertion des données de démonstration...');

  // Utilisateurs
  db.run("INSERT OR IGNORE INTO users (username, email, role) VALUES ('admin', 'admin@timemanager.fr', 'admin')");
  db.run("INSERT OR IGNORE INTO users (username, email, role) VALUES ('marie_dupont', 'marie.dupont@timemanager.fr', 'user')");
  db.run("INSERT OR IGNORE INTO users (username, email, role) VALUES ('jean_martin', 'jean.martin@timemanager.fr', 'user')", () => {
    console.log('Utilisateurs de démonstration insérés');
  });

  // Clients
  db.run("INSERT OR IGNORE INTO clients (name, email, phone, company) VALUES ('TechCorp SA', 'contact@techcorp.fr', '+33 1 23 45 67 89', 'TechCorp SA')");
  db.run("INSERT OR IGNORE INTO clients (name, email, phone, company) VALUES ('StartupX', 'info@startupx.fr', '+33 1 98 76 54 32', 'StartupX SAS')");
  db.run("INSERT OR IGNORE INTO clients (name, email, phone, company) VALUES ('BigCompany', 'contact@bigcompany.fr', '+33 1 11 22 33 44', 'BigCompany International')", () => {
    console.log('Clients de démonstration insérés');
  });

  // Projets
  db.run("INSERT OR IGNORE INTO projects (name, client_id, description, status) VALUES ('Site Web E-commerce', 1, 'Développement d''une plateforme e-commerce complète', 'active')");
  db.run("INSERT OR IGNORE INTO projects (name, client_id, description, status) VALUES ('Application Mobile', 1, 'Application iOS et Android', 'active')");
  db.run("INSERT OR IGNORE INTO projects (name, client_id, description, status) VALUES ('Refonte UX', 2, 'Refonte de l''interface utilisateur', 'active')");
  db.run("INSERT OR IGNORE INTO projects (name, client_id, description, status) VALUES ('Migration Cloud', 3, 'Migration de l''infrastructure vers le cloud', 'on-hold')", () => {
    console.log('Projets de démonstration insérés');
  });

  // Tâches
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (1, 'Design maquettes', 'Création des maquettes Figma', 2, 8, 'done')");
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (1, 'Développement Frontend', 'Intégration HTML/CSS/JS', 3, 12, 'in-progress')");
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (1, 'Tests unitaires', 'Écriture des tests unitaires', 2, 0, 'todo')");
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (2, 'Architecture technique', 'Définition de l''architecture', 1, 4, 'done')");
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (2, 'Développement iOS', 'Développement de l''app iOS', 3, 6, 'in-progress')");
  db.run("INSERT OR IGNORE INTO tasks (project_id, name, description, assigned_to, time_spent, status) VALUES (3, 'Audit UX', 'Analyse de l''existant', 2, 3, 'in-progress')", () => {
    console.log('Tâches de démonstration insérées');
    console.log('\nBase de données initialisée avec succès!');
  });
});

// Fermer la connexion après un délai pour laisser serialize() terminer
db.close((err) => {
  if (err) {
    console.error('Erreur lors de la fermeture de la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données fermée');
  }
});
