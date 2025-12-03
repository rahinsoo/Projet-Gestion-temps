// config/database.js - Configuration de la connexion à la base de données SQLite
// Ce fichier gère l'initialisation et l'accès à la base de données

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './database.sqlite';

// Création de la connexion à la base de données
const db = new sqlite3.Database(path.resolve(__dirname, '..', dbPath), (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite établie');
  }
});

// Active les clés étrangères
db.run('PRAGMA foreign_keys = ON');

// Fonction utilitaire pour exécuter une requête avec promesse
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Fonction utilitaire pour récupérer une seule ligne
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Fonction utilitaire pour récupérer toutes les lignes
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  run,
  get,
  all
};
