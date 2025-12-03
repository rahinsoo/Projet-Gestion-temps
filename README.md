# TimeManager - Application de Gestion du Temps

## 📋 Description

Application web front-end complète de gestion du temps de travail. Elle permet de gérer des utilisateurs, clients, projets et tâches avec un système de tracking du temps intégré. Les données sont stockées dans localStorage pour une utilisation sans backend.

## 🚀 Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur
2. L'application chargera automatiquement les données initiales depuis les fichiers JSON
3. Naviguez entre les différentes sections via le menu latéral

### Avec un serveur local (recommandé)

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 🎯 Fonctionnalités

### Opérations CRUD complètes
- ✅ **Utilisateurs** : Création, lecture, modification, suppression
- ✅ **Clients** : Gestion complète des entreprises clientes
- ✅ **Projets** : Création et suivi des projets par client
- ✅ **Tâches** : Gestion des tâches avec assignation et suivi du temps

### Interface utilisateur
- ✅ **Dashboard** : Tableau de bord avec statistiques en temps réel
- ✅ **Vue Kanban** : Gestion visuelle des tâches (À faire, En cours, Terminé)
- ✅ **Vue Liste** : Affichage tabulaire des données
- ✅ **Time Tracker** : Chronomètre intégré pour le suivi du temps
- ✅ **Thème clair/sombre** : Support des deux modes d'affichage
- ✅ **Responsive Design** : Compatible mobile, tablette et desktop

## 📁 Structure du projet

```
Projet-Gestion-temps/
├── index.html              # Page principale de l'application
├── styles/
│   └── main.css            # Styles CSS de l'application
├── js/
│   └── app.js              # Logique JavaScript et gestion des données
├── data/
│   ├── users.json          # Données des utilisateurs
│   ├── clients.json        # Données des clients
│   └── projects.json       # Données des projets et tâches
├── wireframes/             # Wireframes de référence (design original)
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── assets/
└── README.md               # Documentation
```

## 📊 Structure des données JSON

### users.json
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@timemanager.fr",
      "role": "admin|user",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### clients.json
```json
{
  "clients": [
    {
      "id": 1,
      "name": "TechCorp SA",
      "email": "contact@techcorp.fr",
      "phone": "+33 1 23 45 67 89",
      "company": "TechCorp SA",
      "created_at": "2024-01-10T09:00:00Z"
    }
  ]
}
```

### projects.json
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Projet Alpha",
      "client_id": 1,
      "description": "Description du projet",
      "status": "active|completed|on-hold",
      "created_at": "2024-11-01T09:00:00Z",
      "tasks": [
        {
          "id": 1,
          "name": "Nom de la tâche",
          "description": "Description",
          "assigned_to": 1,
          "time_spent": 4,
          "status": "todo|in-progress|done",
          "created_at": "2024-11-01T09:00:00Z"
        }
      ]
    }
  ]
}
```

## 🎨 Système de design

### Thème Clair
```css
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--text-primary: #333333;
--text-secondary: #666666;
--accent: #4A90E2;
--border: #e0e0e0;
```

### Thème Sombre
```css
--bg-primary: #1a1a1a;
--bg-secondary: #2d2d2d;
--text-primary: #ffffff;
--text-secondary: #b0b0b0;
--accent: #5ba3ff;
--border: #404040;
```

## 📱 Responsive Design

| Breakpoint | Largeur | Description |
|------------|---------|-------------|
| Mobile | < 768px | Menu hamburger, navigation plein écran |
| Tablet | 768px - 1024px | Layout adaptatif |
| Desktop | > 1024px | Sidebar complète avec labels |

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles avec variables CSS et Flexbox/Grid
- **JavaScript vanilla** : Aucun framework requis
- **localStorage** : Stockage des données côté client

## 📝 Utilisation

### Gestion des clients
1. Cliquez sur "Clients" dans le menu
2. Utilisez le bouton "+ Nouveau client" pour ajouter un client
3. Modifiez ou supprimez via les boutons d'action

### Gestion des projets
1. Cliquez sur "Projets" dans le menu
2. Créez un projet en l'associant à un client
3. Suivez la progression via la barre de progression

### Gestion des tâches
1. Cliquez sur "Tâches" dans le menu
2. Basculez entre vue Kanban et Liste
3. Créez des tâches, assignez-les et suivez le temps

### Suivi du temps
1. Dans la vue Tâches, cliquez sur ⏱️ pour ajouter du temps
2. Le chronomètre global est visible dans la barre supérieure

## ♿ Accessibilité

- Structure HTML sémantique
- Labels ARIA pour les éléments interactifs
- Navigation au clavier
- Contraste suffisant (WCAG 2.1)
- Support des préférences de couleur système

## 🌐 Compatibilité navigateurs

| Navigateur | Version minimale |
|------------|------------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

## 📄 Wireframes de référence

Les wireframes originaux sont disponibles dans le dossier `wireframes/`. Vous pouvez les consulter en ouvrant `wireframes/index.html`.

## 📜 Licence

Ce projet est fourni à des fins de démonstration et d'apprentissage.

---

**Version** : 1.0.0  
**Date** : Décembre 2024
