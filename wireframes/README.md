# TimeManager - Wireframes Interactifs

## 📋 Description

Ensemble complet de wireframes interactifs HTML/CSS pour un outil de gestion de temps de travail. Ces wireframes présentent une interface moderne, responsive et accessible avec support du mode clair/sombre.

## 🎯 Fonctionnalités

### Acteurs supportés
- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Responsable (N+1)** : Gestion d'équipe, validation, reporting
- **Employé (Standard)** : Saisie de temps, consultation

### Fonctionnalités principales
- ✅ CRUD clients/entreprises
- ✅ Gestion de projets via calendrier
- ✅ Gestion de tâches (vue Kanban, liste, calendrier)
- ✅ Authentification et gestion de profils
- ✅ Tableau de bord avec statistiques
- ✅ Paramètres (thème clair/sombre)
- ✅ Pages légales (Mentions légales, CGU, Politique de confidentialité)

## 📁 Structure des fichiers

```
wireframes/
├── css/
│   ├── style.css          # Styles globaux
│   ├── responsive.css     # Media queries
│   └── themes.css         # Variables thème clair/sombre
├── js/
│   ├── main.js            # Interactions de base
│   └── theme-switcher.js  # Gestion du thème
├── assets/
│   ├── logo.svg           # Logo de l'application
│   └── icons/             # Icônes SVG
├── pages/
│   ├── login.html         # Page de connexion
│   ├── dashboard.html     # Tableau de bord
│   ├── clients.html       # Gestion des clients
│   ├── projects.html      # Gestion des projets
│   ├── tasks.html         # Gestion des tâches
│   ├── calendar.html      # Calendrier global
│   ├── profile.html       # Profil utilisateur
│   ├── settings.html      # Paramètres
│   ├── legal.html         # Mentions légales
│   ├── terms.html         # CGU
│   └── privacy.html       # Politique de confidentialité
├── design/
│   └── wireframes-svg/    # Wireframes SVG exportés
│       ├── mobile/
│       ├── tablet/
│       └── desktop/
├── index.html             # Page d'accueil
└── README.md              # Documentation
```

## 🚀 Installation et utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Pas de dépendances externes requises

### Démarrage rapide
1. Clonez le repository
2. Ouvrez `wireframes/index.html` dans votre navigateur
3. Naviguez entre les différentes pages via le menu

### Serveur local (optionnel)
Pour une meilleure expérience, vous pouvez utiliser un serveur local :

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si npx disponible)
npx serve wireframes

# Avec PHP
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 📱 Breakpoints Responsive

| Breakpoint | Largeur | Description |
|------------|---------|-------------|
| Mobile | < 768px | Menu hamburger, navigation plein écran |
| Tablet | 768px - 1024px | Sidebar compactée avec icônes |
| Desktop | > 1024px | Sidebar complète avec labels |

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

### Couleurs sémantiques
- **Success** : `#28a745` (vert)
- **Warning** : `#ffc107` (jaune)
- **Danger** : `#dc3545` (rouge)
- **Info** : `#17a2b8` (bleu clair)

## 🧩 Composants UI

### Navigation
- Sidebar (Desktop/Tablet) : Menu vertical avec icônes et labels
- Top Bar : Header avec logo, recherche, notifications, profil
- Mobile Menu : Menu hamburger responsive

### Éléments UI disponibles
- ✅ Boutons (Primary, Secondary, Danger, Success, Outline)
- ✅ Formulaires avec validation visuelle
- ✅ Tableaux de données avec pagination
- ✅ Cards/Cartes informationnelles
- ✅ Modals/Pop-ups
- ✅ Calendriers interactifs
- ✅ Graphiques (placeholders)
- ✅ Badges et labels
- ✅ Dropdowns
- ✅ Toggles
- ✅ Breadcrumbs
- ✅ Alertes

## 🔄 Interactions JavaScript

### Fonctionnalités implémentées
- Toggle du menu mobile
- Ouverture/fermeture des modals
- Dropdowns interactifs
- Validation de formulaires
- Changement de thème (clair/sombre)
- Navigation dans le calendrier
- Changement de vue (Kanban/Liste/Calendrier)
- Notifications toast
- Sélection de rôle utilisateur (démo)

### API JavaScript
```javascript
// Notifications
window.TimeManager.showNotification('Message', 'success');

// Modals
window.TimeManager.openModal(element);
window.TimeManager.closeModal(element);

// Thème
window.ThemeSwitcher.toggle();
window.ThemeSwitcher.set('dark');
window.ThemeSwitcher.isDark();
```

## 👥 Gestion des rôles

Les wireframes incluent un sélecteur de rôle pour démontrer les différentes vues :

- **Employé** : Vue standard avec accès aux fonctionnalités de base
- **Responsable** : Vue avec section équipe et fonctionnalités de gestion
- **Admin** : Accès complet avec paramètres d'administration

Le rôle est sauvegardé dans `localStorage` pour persister entre les sessions.

## 📄 Pages incluses

| Page | Description | Fichier |
|------|-------------|---------|
| Accueil | Hub de navigation | `index.html` |
| Connexion | Authentification | `pages/login.html` |
| Tableau de bord | Vue d'ensemble | `pages/dashboard.html` |
| Clients | CRUD clients | `pages/clients.html` |
| Projets | Gestion projets | `pages/projects.html` |
| Tâches | Gestion tâches | `pages/tasks.html` |
| Calendrier | Vue calendrier | `pages/calendar.html` |
| Profil | Profil utilisateur | `pages/profile.html` |
| Paramètres | Configuration | `pages/settings.html` |
| Mentions légales | Informations légales | `pages/legal.html` |
| CGU | Conditions d'utilisation | `pages/terms.html` |
| Confidentialité | Politique RGPD | `pages/privacy.html` |

## ♿ Accessibilité

- Structure HTML sémantique
- Labels ARIA pour les éléments interactifs
- Navigation au clavier
- Contraste suffisant (WCAG 2.1)
- Focus visible
- Support `prefers-reduced-motion`
- Support `prefers-color-scheme`

## 🌐 Compatibilité navigateurs

| Navigateur | Version minimale |
|------------|------------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

## 📝 Notes de développement

### Points d'attention
- Les graphiques utilisent des placeholders (à remplacer par Chart.js en production)
- Les données sont statiques (wireframes uniquement)
- Pas de backend requis
- Les formulaires simulent la validation côté client

### Extensions possibles
- Intégration Chart.js pour les graphiques
- Drag & drop pour le calendrier
- Export PDF des rapports
- Intégration API REST

## 📜 Licence

Ce projet de wireframes est fourni à des fins de démonstration et de maquettage.

## 👤 Contact

Pour toute question concernant ces wireframes, contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Date** : Décembre 2024
