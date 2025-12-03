/**
 * TimeManager - Application de Gestion du Temps
 * Fichier principal JavaScript - Gestion des données et CRUD
 */

// ============================================================================
// Gestionnaire de données (DataManager)
// ============================================================================

const DataManager = {
  // Clés de stockage localStorage
  KEYS: {
    USERS: 'timemanager_users',
    CLIENTS: 'timemanager_clients',
    PROJECTS: 'timemanager_projects'
  },

  // Données initiales par défaut (chargées depuis JSON si disponibles)
  defaultData: {
    users: [],
    clients: [],
    projects: []
  },

  /**
   * Initialiser les données depuis localStorage ou charger les fichiers JSON
   */
  async init() {
    // Vérifier si les données existent dans localStorage
    if (!localStorage.getItem(this.KEYS.USERS)) {
      await this.loadFromJSON();
    }
  },

  /**
   * Charger les données depuis les fichiers JSON
   */
  async loadFromJSON() {
    try {
      // Charger les utilisateurs
      const usersResponse = await fetch('data/users.json');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(usersData.users));
      }

      // Charger les clients
      const clientsResponse = await fetch('data/clients.json');
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clientsData.clients));
      }

      // Charger les projets
      const projectsResponse = await fetch('data/projects.json');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projectsData.projects));
      }
    } catch (error) {
      console.warn('Impossible de charger les fichiers JSON, utilisation des données par défaut:', error);
      // Initialiser avec des données vides
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(this.defaultData.users));
      localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(this.defaultData.clients));
      localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(this.defaultData.projects));
    }
  },

  /**
   * Obtenir toutes les données d'une collection
   */
  getAll(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Obtenir un élément par ID
   */
  getById(key, id) {
    const items = this.getAll(key);
    return items.find(item => item.id === parseInt(id));
  },

  /**
   * Créer un nouvel élément
   */
  create(key, item) {
    const items = this.getAll(key);
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = {
      ...item,
      id: newId,
      created_at: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
  },

  /**
   * Mettre à jour un élément
   */
  update(key, id, updates) {
    const items = this.getAll(key);
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(key, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  /**
   * Supprimer un élément
   */
  delete(key, id) {
    const items = this.getAll(key);
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    localStorage.setItem(key, JSON.stringify(filteredItems));
    return filteredItems.length < items.length;
  },

  /**
   * Réinitialiser les données depuis les fichiers JSON
   */
  async reset() {
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.CLIENTS);
    localStorage.removeItem(this.KEYS.PROJECTS);
    await this.loadFromJSON();
  }
};

// ============================================================================
// Gestionnaire des Utilisateurs
// ============================================================================

const UsersManager = {
  getAll() {
    return DataManager.getAll(DataManager.KEYS.USERS);
  },

  getById(id) {
    return DataManager.getById(DataManager.KEYS.USERS, id);
  },

  create(user) {
    return DataManager.create(DataManager.KEYS.USERS, user);
  },

  update(id, updates) {
    return DataManager.update(DataManager.KEYS.USERS, id, updates);
  },

  delete(id) {
    return DataManager.delete(DataManager.KEYS.USERS, id);
  }
};

// ============================================================================
// Gestionnaire des Clients
// ============================================================================

const ClientsManager = {
  getAll() {
    return DataManager.getAll(DataManager.KEYS.CLIENTS);
  },

  getById(id) {
    return DataManager.getById(DataManager.KEYS.CLIENTS, id);
  },

  create(client) {
    return DataManager.create(DataManager.KEYS.CLIENTS, client);
  },

  update(id, updates) {
    return DataManager.update(DataManager.KEYS.CLIENTS, id, updates);
  },

  delete(id) {
    return DataManager.delete(DataManager.KEYS.CLIENTS, id);
  },

  getProjectCount(clientId) {
    const projects = ProjectsManager.getAll();
    return projects.filter(p => p.client_id === parseInt(clientId)).length;
  }
};

// ============================================================================
// Gestionnaire des Projets
// ============================================================================

const ProjectsManager = {
  getAll() {
    return DataManager.getAll(DataManager.KEYS.PROJECTS);
  },

  getById(id) {
    return DataManager.getById(DataManager.KEYS.PROJECTS, id);
  },

  create(project) {
    const newProject = {
      ...project,
      tasks: []
    };
    return DataManager.create(DataManager.KEYS.PROJECTS, newProject);
  },

  update(id, updates) {
    return DataManager.update(DataManager.KEYS.PROJECTS, id, updates);
  },

  delete(id) {
    return DataManager.delete(DataManager.KEYS.PROJECTS, id);
  },

  getByClient(clientId) {
    const projects = this.getAll();
    return projects.filter(p => p.client_id === parseInt(clientId));
  },

  getByStatus(status) {
    const projects = this.getAll();
    return projects.filter(p => p.status === status);
  }
};

// ============================================================================
// Gestionnaire des Tâches
// ============================================================================

const TasksManager = {
  getAllTasks() {
    const projects = ProjectsManager.getAll();
    const allTasks = [];
    projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          allTasks.push({
            ...task,
            project_id: project.id,
            project_name: project.name
          });
        });
      }
    });
    return allTasks;
  },

  getTasksByProject(projectId) {
    const project = ProjectsManager.getById(projectId);
    return project ? project.tasks || [] : [];
  },

  getTasksByStatus(status) {
    const allTasks = this.getAllTasks();
    return allTasks.filter(t => t.status === status);
  },

  getTasksByUser(userId) {
    const allTasks = this.getAllTasks();
    return allTasks.filter(t => t.assigned_to === parseInt(userId));
  },

  createTask(projectId, task) {
    const projects = ProjectsManager.getAll();
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));
    
    if (projectIndex === -1) return null;

    const project = projects[projectIndex];
    const tasks = project.tasks || [];
    const newTaskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    
    const newTask = {
      ...task,
      id: newTaskId,
      time_spent: 0,
      created_at: new Date().toISOString()
    };

    project.tasks = [...tasks, newTask];
    localStorage.setItem(DataManager.KEYS.PROJECTS, JSON.stringify(projects));
    
    return newTask;
  },

  updateTask(projectId, taskId, updates) {
    const projects = ProjectsManager.getAll();
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));
    
    if (projectIndex === -1) return null;

    const project = projects[projectIndex];
    const taskIndex = project.tasks.findIndex(t => t.id === parseInt(taskId));
    
    if (taskIndex === -1) return null;

    project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...updates };
    localStorage.setItem(DataManager.KEYS.PROJECTS, JSON.stringify(projects));
    
    return project.tasks[taskIndex];
  },

  deleteTask(projectId, taskId) {
    const projects = ProjectsManager.getAll();
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));
    
    if (projectIndex === -1) return false;

    const project = projects[projectIndex];
    const originalLength = project.tasks.length;
    project.tasks = project.tasks.filter(t => t.id !== parseInt(taskId));
    
    localStorage.setItem(DataManager.KEYS.PROJECTS, JSON.stringify(projects));
    
    return project.tasks.length < originalLength;
  },

  addTime(projectId, taskId, hours) {
    const projects = ProjectsManager.getAll();
    const projectIndex = projects.findIndex(p => p.id === parseInt(projectId));
    
    if (projectIndex === -1) return null;

    const project = projects[projectIndex];
    const taskIndex = project.tasks.findIndex(t => t.id === parseInt(taskId));
    
    if (taskIndex === -1) return null;

    project.tasks[taskIndex].time_spent = (project.tasks[taskIndex].time_spent || 0) + hours;
    localStorage.setItem(DataManager.KEYS.PROJECTS, JSON.stringify(projects));
    
    return project.tasks[taskIndex];
  }
};

// ============================================================================
// Statistiques
// ============================================================================

const StatsManager = {
  getDashboardStats() {
    const projects = ProjectsManager.getAll();
    const allTasks = TasksManager.getAllTasks();
    const clients = ClientsManager.getAll();

    // Calculer le temps total travaillé
    let totalHours = 0;
    allTasks.forEach(task => {
      totalHours += task.time_spent || 0;
    });

    // Projets actifs
    const activeProjects = projects.filter(p => p.status === 'active').length;

    // Tâches en cours
    const tasksInProgress = allTasks.filter(t => t.status === 'in-progress').length;
    const tasksTodo = allTasks.filter(t => t.status === 'todo').length;
    const tasksDone = allTasks.filter(t => t.status === 'done').length;

    // Clients actifs
    const activeClients = clients.length;

    return {
      totalHours,
      activeProjects,
      tasksInProgress,
      tasksTodo,
      tasksDone,
      totalTasks: allTasks.length,
      activeClients
    };
  },

  getProjectStats(projectId) {
    const project = ProjectsManager.getById(projectId);
    if (!project) return null;

    const tasks = project.tasks || [];
    let totalTime = 0;
    let todoCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;

    tasks.forEach(task => {
      totalTime += task.time_spent || 0;
      if (task.status === 'todo') todoCount++;
      else if (task.status === 'in-progress') inProgressCount++;
      else if (task.status === 'done') doneCount++;
    });

    const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

    return {
      totalTasks: tasks.length,
      todoCount,
      inProgressCount,
      doneCount,
      totalTime,
      progress
    };
  }
};

// ============================================================================
// Interface Utilisateur (UI)
// ============================================================================

const UI = {
  /**
   * Afficher une notification toast
   */
  showNotification(message, type = 'info') {
    let container = document.querySelector('.notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notifications-container';
      document.body.appendChild(container);
    }

    const icons = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'danger': '❌'
    };

    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = 'min-width: 300px; animation: slideIn 0.3s ease; cursor: pointer;';
    notification.innerHTML = `
      <span class="alert-icon">${icons[type] || icons.info}</span>
      <span class="alert-content">${message}</span>
    `;

    container.appendChild(notification);

    // Fermer au clic
    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto-fermeture
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  },

  /**
   * Ouvrir une modal
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input, textarea, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  },

  /**
   * Fermer une modal
   */
  closeModal(modal) {
    if (typeof modal === 'string') {
      modal = document.getElementById(modal);
    }
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Confirmer une action
   */
  confirm(message) {
    return window.confirm(message);
  },

  /**
   * Formater une date
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  /**
   * Formater un statut en badge
   */
  getStatusBadge(status) {
    const badges = {
      'active': '<span class="badge badge-success">Actif</span>',
      'completed': '<span class="badge badge-primary">Terminé</span>',
      'on-hold': '<span class="badge badge-warning">En pause</span>',
      'todo': '<span class="badge badge-secondary">À faire</span>',
      'in-progress': '<span class="badge badge-primary">En cours</span>',
      'done': '<span class="badge badge-success">Terminé</span>'
    };
    return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
  },

  /**
   * Obtenir les initiales d'un nom
   */
  getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
};

// ============================================================================
// Gestionnaire de la vue actuelle
// ============================================================================

const ViewManager = {
  currentView: 'dashboard',

  views: ['dashboard', 'clients', 'projects', 'tasks', 'users'],

  init() {
    // Définir la vue par défaut
    this.showView('dashboard');
    
    // Gérer les clics sur la navigation
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.showView(view);
      });
    });
  },

  showView(viewName) {
    if (!this.views.includes(viewName)) return;

    this.currentView = viewName;

    // Cacher toutes les vues
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.add('hidden');
    });

    // Afficher la vue sélectionnée
    const viewSection = document.getElementById(`view-${viewName}`);
    if (viewSection) {
      viewSection.classList.remove('hidden');
    }

    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      }
    });

    // Charger les données de la vue
    this.loadViewData(viewName);
  },

  loadViewData(viewName) {
    switch (viewName) {
      case 'dashboard':
        DashboardView.render();
        break;
      case 'clients':
        ClientsView.render();
        break;
      case 'projects':
        ProjectsView.render();
        break;
      case 'tasks':
        TasksView.render();
        break;
      case 'users':
        UsersView.render();
        break;
    }
  }
};

// ============================================================================
// Vue Dashboard
// ============================================================================

const DashboardView = {
  render() {
    const stats = StatsManager.getDashboardStats();
    const container = document.getElementById('dashboard-stats');
    
    if (container) {
      container.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="stat-card">
              <div class="stat-icon primary">⏱️</div>
              <div class="stat-content">
                <div class="stat-value">${stats.totalHours}h</div>
                <div class="stat-label">Heures travaillées</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="stat-card">
              <div class="stat-icon success">📁</div>
              <div class="stat-content">
                <div class="stat-value">${stats.activeProjects}</div>
                <div class="stat-label">Projets actifs</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="stat-card">
              <div class="stat-icon warning">✅</div>
              <div class="stat-content">
                <div class="stat-value">${stats.totalTasks}</div>
                <div class="stat-label">Tâches totales</div>
                <div class="stat-change">${stats.tasksDone} terminées, ${stats.tasksInProgress} en cours</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="stat-card">
              <div class="stat-icon danger">👥</div>
              <div class="stat-content">
                <div class="stat-value">${stats.activeClients}</div>
                <div class="stat-label">Clients</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Rendre les activités récentes
    this.renderRecentActivities();
    
    // Rendre la liste des projets récents
    this.renderRecentProjects();
  },

  renderRecentActivities() {
    const container = document.getElementById('recent-activities');
    if (!container) return;

    const allTasks = TasksManager.getAllTasks();
    const recentTasks = allTasks
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    if (recentTasks.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Aucune activité récente</p></div>';
      return;
    }

    const html = recentTasks.map(task => {
      const statusIcon = task.status === 'done' ? '✅' : task.status === 'in-progress' ? '🔄' : '📋';
      return `
        <li class="activity-item">
          <div class="activity-icon stat-icon primary">${statusIcon}</div>
          <div class="activity-content">
            <p class="activity-title"><strong>${task.name}</strong> - ${task.project_name}</p>
            <span class="activity-time">${UI.formatDate(task.created_at)}</span>
          </div>
        </li>
      `;
    }).join('');

    container.innerHTML = html;
  },

  renderRecentProjects() {
    const container = document.getElementById('recent-projects');
    if (!container) return;

    const projects = ProjectsManager.getAll()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    if (projects.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Aucun projet</p></div>';
      return;
    }

    const html = projects.map(project => {
      const stats = StatsManager.getProjectStats(project.id);
      const client = ClientsManager.getById(project.client_id);
      return `
        <tr>
          <td data-label="Projet"><strong>${project.name}</strong></td>
          <td data-label="Client">${client ? client.name : '-'}</td>
          <td data-label="Tâches">${stats.totalTasks}</td>
          <td data-label="Progression">
            <div class="progress-bar" style="width: 100px;">
              <div class="progress-bar-fill primary" style="width: ${stats.progress}%;"></div>
            </div>
            <span class="text-xs text-muted">${stats.progress}%</span>
          </td>
          <td data-label="Statut">${UI.getStatusBadge(project.status)}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = html;
  }
};

// ============================================================================
// Vue Clients
// ============================================================================

const ClientsView = {
  render() {
    const clients = ClientsManager.getAll();
    const container = document.getElementById('clients-table-body');
    
    if (!container) return;

    if (clients.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <div class="empty-state-title">Aucun client</div>
              <div class="empty-state-description">Ajoutez votre premier client pour commencer.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const html = clients.map(client => {
      const projectCount = ClientsManager.getProjectCount(client.id);
      return `
        <tr>
          <td data-label="Entreprise">
            <div class="flex items-center gap-1">
              <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${UI.getInitials(client.name)}</div>
              <strong>${client.name}</strong>
            </div>
          </td>
          <td data-label="Email">${client.email}</td>
          <td data-label="Téléphone">${client.phone || '-'}</td>
          <td data-label="Projets"><span class="badge badge-primary">${projectCount} projet(s)</span></td>
          <td data-label="Créé le">${UI.formatDate(client.created_at)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-icon btn-secondary btn-sm" onclick="ClientsView.edit(${client.id})" title="Modifier">✏️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="ClientsView.delete(${client.id})" title="Supprimer">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = html;
  },

  openAddModal() {
    document.getElementById('client-form').reset();
    document.getElementById('client-id').value = '';
    document.getElementById('modal-client-title').textContent = 'Nouveau client';
    UI.openModal('modal-client');
  },

  edit(id) {
    const client = ClientsManager.getById(id);
    if (!client) return;

    document.getElementById('client-id').value = client.id;
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-email').value = client.email;
    document.getElementById('client-phone').value = client.phone || '';
    document.getElementById('client-company').value = client.company || '';
    document.getElementById('modal-client-title').textContent = 'Modifier le client';
    
    UI.openModal('modal-client');
  },

  save() {
    const id = document.getElementById('client-id').value;
    const clientData = {
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      phone: document.getElementById('client-phone').value,
      company: document.getElementById('client-company').value
    };

    // Validation
    if (!clientData.name || !clientData.email) {
      UI.showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    if (id) {
      ClientsManager.update(id, clientData);
      UI.showNotification('Client mis à jour avec succès', 'success');
    } else {
      ClientsManager.create(clientData);
      UI.showNotification('Client créé avec succès', 'success');
    }

    UI.closeModal('modal-client');
    this.render();
    DashboardView.render();
  },

  delete(id) {
    if (!UI.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    
    // Vérifier s'il y a des projets associés
    const projectCount = ClientsManager.getProjectCount(id);
    if (projectCount > 0) {
      UI.showNotification('Impossible de supprimer ce client car il a des projets associés', 'danger');
      return;
    }

    ClientsManager.delete(id);
    UI.showNotification('Client supprimé avec succès', 'success');
    this.render();
    DashboardView.render();
  }
};

// ============================================================================
// Vue Projets
// ============================================================================

const ProjectsView = {
  render() {
    const projects = ProjectsManager.getAll();
    const container = document.getElementById('projects-table-body');
    
    if (!container) return;

    if (projects.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-state">
              <div class="empty-state-icon">📁</div>
              <div class="empty-state-title">Aucun projet</div>
              <div class="empty-state-description">Créez votre premier projet pour commencer.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const html = projects.map(project => {
      const client = ClientsManager.getById(project.client_id);
      const stats = StatsManager.getProjectStats(project.id);
      return `
        <tr>
          <td data-label="Projet"><strong>${project.name}</strong></td>
          <td data-label="Client">${client ? client.name : '-'}</td>
          <td data-label="Description">${project.description ? project.description.substring(0, 50) + '...' : '-'}</td>
          <td data-label="Tâches">${stats.totalTasks}</td>
          <td data-label="Progression">
            <div class="progress-bar" style="width: 100px;">
              <div class="progress-bar-fill ${project.status === 'completed' ? 'success' : 'primary'}" style="width: ${stats.progress}%;"></div>
            </div>
            <span class="text-xs text-muted">${stats.progress}%</span>
          </td>
          <td data-label="Statut">${UI.getStatusBadge(project.status)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-icon btn-secondary btn-sm" onclick="ProjectsView.edit(${project.id})" title="Modifier">✏️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="ProjectsView.delete(${project.id})" title="Supprimer">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = html;

    // Mettre à jour la liste des clients dans le formulaire
    this.updateClientSelect();
  },

  updateClientSelect() {
    const select = document.getElementById('project-client');
    if (!select) return;

    const clients = ClientsManager.getAll();
    select.innerHTML = '<option value="">Sélectionner un client...</option>' + 
      clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  },

  openAddModal() {
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
    document.getElementById('modal-project-title').textContent = 'Nouveau projet';
    this.updateClientSelect();
    UI.openModal('modal-project');
  },

  edit(id) {
    const project = ProjectsManager.getById(id);
    if (!project) return;

    this.updateClientSelect();
    
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-name').value = project.name;
    document.getElementById('project-client').value = project.client_id;
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-status').value = project.status;
    document.getElementById('modal-project-title').textContent = 'Modifier le projet';
    
    UI.openModal('modal-project');
  },

  save() {
    const id = document.getElementById('project-id').value;
    const projectData = {
      name: document.getElementById('project-name').value,
      client_id: parseInt(document.getElementById('project-client').value),
      description: document.getElementById('project-description').value,
      status: document.getElementById('project-status').value
    };

    // Validation
    if (!projectData.name || !projectData.client_id) {
      UI.showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    if (id) {
      ProjectsManager.update(id, projectData);
      UI.showNotification('Projet mis à jour avec succès', 'success');
    } else {
      ProjectsManager.create(projectData);
      UI.showNotification('Projet créé avec succès', 'success');
    }

    UI.closeModal('modal-project');
    this.render();
    DashboardView.render();
  },

  delete(id) {
    if (!UI.confirm('Êtes-vous sûr de vouloir supprimer ce projet et toutes ses tâches ?')) return;

    ProjectsManager.delete(id);
    UI.showNotification('Projet supprimé avec succès', 'success');
    this.render();
    DashboardView.render();
  }
};

// ============================================================================
// Vue Tâches
// ============================================================================

const TasksView = {
  currentView: 'kanban', // 'kanban', 'list', 'calendar'

  render() {
    this.updateProjectSelect();
    
    if (this.currentView === 'kanban') {
      this.renderKanban();
    } else {
      this.renderList();
    }
  },

  updateProjectSelect() {
    const select = document.getElementById('task-project');
    if (!select) return;

    const projects = ProjectsManager.getAll();
    select.innerHTML = '<option value="">Sélectionner un projet...</option>' + 
      projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  },

  renderKanban() {
    const todoContainer = document.getElementById('kanban-todo');
    const inProgressContainer = document.getElementById('kanban-in-progress');
    const doneContainer = document.getElementById('kanban-done');

    if (!todoContainer || !inProgressContainer || !doneContainer) return;

    const allTasks = TasksManager.getAllTasks();
    const todoTasks = allTasks.filter(t => t.status === 'todo');
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
    const doneTasks = allTasks.filter(t => t.status === 'done');

    todoContainer.innerHTML = this.renderKanbanCards(todoTasks);
    inProgressContainer.innerHTML = this.renderKanbanCards(inProgressTasks);
    doneContainer.innerHTML = this.renderKanbanCards(doneTasks);

    // Mettre à jour les compteurs
    document.getElementById('count-todo').textContent = todoTasks.length;
    document.getElementById('count-in-progress').textContent = inProgressTasks.length;
    document.getElementById('count-done').textContent = doneTasks.length;
  },

  renderKanbanCards(tasks) {
    if (tasks.length === 0) {
      return '<div class="empty-state" style="padding: 1rem;"><p class="text-muted text-sm">Aucune tâche</p></div>';
    }

    return tasks.map(task => {
      const user = UsersManager.getById(task.assigned_to);
      return `
        <div class="kanban-card" data-task-id="${task.id}" data-project-id="${task.project_id}">
          <div class="kanban-card-header">
            <span class="badge badge-primary">${task.project_name}</span>
            <span class="text-sm text-muted">⏱️ ${task.time_spent || 0}h</span>
          </div>
          <h4 class="kanban-card-title">${task.name}</h4>
          ${task.description ? `<p class="kanban-card-desc">${task.description.substring(0, 60)}...</p>` : ''}
          <div class="kanban-card-footer">
            <div class="user-avatar" style="width: 24px; height: 24px; font-size: 0.625rem;">
              ${user ? UI.getInitials(user.username) : '?'}
            </div>
            <div class="table-actions">
              <button class="btn btn-icon btn-secondary btn-sm" onclick="TasksView.addTime(${task.project_id}, ${task.id})" title="Ajouter du temps">⏱️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="TasksView.edit(${task.project_id}, ${task.id})" title="Modifier">✏️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderList() {
    const container = document.getElementById('tasks-table-body');
    if (!container) return;

    const allTasks = TasksManager.getAllTasks();

    if (allTasks.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-state">
              <div class="empty-state-icon">✅</div>
              <div class="empty-state-title">Aucune tâche</div>
              <div class="empty-state-description">Créez votre première tâche pour commencer.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const html = allTasks.map(task => {
      const user = UsersManager.getById(task.assigned_to);
      return `
        <tr>
          <td data-label="Tâche"><strong>${task.name}</strong></td>
          <td data-label="Projet"><span class="badge badge-primary">${task.project_name}</span></td>
          <td data-label="Assigné">
            <div class="flex items-center gap-1">
              <div class="user-avatar" style="width: 24px; height: 24px; font-size: 0.625rem;">${user ? UI.getInitials(user.username) : '?'}</div>
              <span>${user ? user.username : 'Non assigné'}</span>
            </div>
          </td>
          <td data-label="Temps">${task.time_spent || 0}h</td>
          <td data-label="Statut">${UI.getStatusBadge(task.status)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-icon btn-secondary btn-sm" onclick="TasksView.addTime(${task.project_id}, ${task.id})" title="Ajouter du temps">⏱️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="TasksView.edit(${task.project_id}, ${task.id})" title="Modifier">✏️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="TasksView.delete(${task.project_id}, ${task.id})" title="Supprimer">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = html;
  },

  switchView(view) {
    this.currentView = view;
    
    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-view') === view) {
        tab.classList.add('active');
      }
    });

    document.getElementById('tasks-kanban-view').classList.toggle('hidden', view !== 'kanban');
    document.getElementById('tasks-list-view').classList.toggle('hidden', view !== 'list');
    
    this.render();
  },

  openAddModal() {
    document.getElementById('task-form').reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-project-id').value = '';
    document.getElementById('modal-task-title').textContent = 'Nouvelle tâche';
    this.updateProjectSelect();
    this.updateUserSelect();
    UI.openModal('modal-task');
  },

  updateUserSelect() {
    const select = document.getElementById('task-assigned');
    if (!select) return;

    const users = UsersManager.getAll();
    select.innerHTML = '<option value="">Non assigné</option>' + 
      users.map(u => `<option value="${u.id}">${u.username}</option>`).join('');
  },

  edit(projectId, taskId) {
    const tasks = TasksManager.getTasksByProject(projectId);
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (!task) return;

    this.updateProjectSelect();
    this.updateUserSelect();
    
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-project-id').value = projectId;
    document.getElementById('task-project').value = projectId;
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-assigned').value = task.assigned_to || '';
    document.getElementById('task-status').value = task.status;
    document.getElementById('modal-task-title').textContent = 'Modifier la tâche';
    
    UI.openModal('modal-task');
  },

  save() {
    const id = document.getElementById('task-id').value;
    const projectId = document.getElementById('task-project').value;
    const originalProjectId = document.getElementById('task-project-id').value;

    const taskData = {
      name: document.getElementById('task-name').value,
      description: document.getElementById('task-description').value,
      assigned_to: document.getElementById('task-assigned').value ? parseInt(document.getElementById('task-assigned').value) : null,
      status: document.getElementById('task-status').value
    };

    // Validation
    if (!taskData.name || !projectId) {
      UI.showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    if (id && originalProjectId) {
      TasksManager.updateTask(originalProjectId, id, taskData);
      UI.showNotification('Tâche mise à jour avec succès', 'success');
    } else {
      TasksManager.createTask(projectId, taskData);
      UI.showNotification('Tâche créée avec succès', 'success');
    }

    UI.closeModal('modal-task');
    this.render();
    DashboardView.render();
  },

  delete(projectId, taskId) {
    if (!UI.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    TasksManager.deleteTask(projectId, taskId);
    UI.showNotification('Tâche supprimée avec succès', 'success');
    this.render();
    DashboardView.render();
  },

  addTime(projectId, taskId) {
    const hours = prompt('Combien d\'heures à ajouter ?', '1');
    if (hours === null) return;

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      UI.showNotification('Veuillez entrer un nombre valide', 'danger');
      return;
    }

    TasksManager.addTime(projectId, taskId, hoursNum);
    UI.showNotification(`${hoursNum}h ajoutée(s) avec succès`, 'success');
    this.render();
    DashboardView.render();
  }
};

// ============================================================================
// Vue Utilisateurs
// ============================================================================

const UsersView = {
  render() {
    const users = UsersManager.getAll();
    const container = document.getElementById('users-table-body');
    
    if (!container) return;

    if (users.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">
            <div class="empty-state">
              <div class="empty-state-icon">👤</div>
              <div class="empty-state-title">Aucun utilisateur</div>
              <div class="empty-state-description">Ajoutez votre premier utilisateur pour commencer.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const html = users.map(user => {
      const taskCount = TasksManager.getTasksByUser(user.id).length;
      return `
        <tr>
          <td data-label="Utilisateur">
            <div class="flex items-center gap-1">
              <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${UI.getInitials(user.username)}</div>
              <strong>${user.username}</strong>
            </div>
          </td>
          <td data-label="Email">${user.email}</td>
          <td data-label="Rôle">
            <span class="badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}">${user.role}</span>
          </td>
          <td data-label="Tâches">${taskCount}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-icon btn-secondary btn-sm" onclick="UsersView.edit(${user.id})" title="Modifier">✏️</button>
              <button class="btn btn-icon btn-secondary btn-sm" onclick="UsersView.delete(${user.id})" title="Supprimer">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = html;
  },

  openAddModal() {
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.getElementById('modal-user-title').textContent = 'Nouvel utilisateur';
    UI.openModal('modal-user');
  },

  edit(id) {
    const user = UsersManager.getById(id);
    if (!user) return;

    document.getElementById('user-id').value = user.id;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    document.getElementById('modal-user-title').textContent = 'Modifier l\'utilisateur';
    
    UI.openModal('modal-user');
  },

  save() {
    const id = document.getElementById('user-id').value;
    const userData = {
      username: document.getElementById('user-username').value,
      email: document.getElementById('user-email').value,
      role: document.getElementById('user-role').value
    };

    // Validation
    if (!userData.username || !userData.email) {
      UI.showNotification('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    if (id) {
      UsersManager.update(id, userData);
      UI.showNotification('Utilisateur mis à jour avec succès', 'success');
    } else {
      UsersManager.create(userData);
      UI.showNotification('Utilisateur créé avec succès', 'success');
    }

    UI.closeModal('modal-user');
    this.render();
  },

  delete(id) {
    if (!UI.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    UsersManager.delete(id);
    UI.showNotification('Utilisateur supprimé avec succès', 'success');
    this.render();
  }
};

// ============================================================================
// Chronomètre / Time Tracker
// ============================================================================

const TimeTracker = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
  intervalId: null,
  currentProjectId: null,
  currentTaskId: null,

  init() {
    this.updateDisplay();
  },

  start(projectId, taskId) {
    if (this.isRunning) {
      this.stop();
    }

    this.currentProjectId = projectId;
    this.currentTaskId = taskId;
    this.startTime = Date.now();
    this.isRunning = true;

    this.intervalId = setInterval(() => this.updateDisplay(), 1000);
    
    // Update both small and large tracker buttons
    const startBtns = ['tracker-start', 'tracker-start-large'];
    const stopBtns = ['tracker-stop', 'tracker-stop-large'];
    
    startBtns.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    stopBtns.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    });
    
    const task = TasksManager.getTasksByProject(projectId).find(t => t.id === parseInt(taskId));
    if (task) {
      document.getElementById('tracker-info').textContent = `${task.name}`;
    }
  },

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.intervalId);
    this.isRunning = false;

    const elapsed = (Date.now() - this.startTime) / 1000 / 3600; // heures
    const roundedHours = Math.round(elapsed * 100) / 100;

    if (this.currentProjectId && this.currentTaskId && roundedHours >= 0.01) {
      TasksManager.addTime(this.currentProjectId, this.currentTaskId, roundedHours);
      UI.showNotification(`${roundedHours}h enregistrée(s)`, 'success');
      TasksView.render();
      DashboardView.render();
    }

    this.reset();
  },

  reset() {
    this.startTime = null;
    this.elapsedTime = 0;
    this.currentProjectId = null;
    this.currentTaskId = null;
    
    // Update both small and large tracker buttons
    const startBtns = ['tracker-start', 'tracker-start-large'];
    const stopBtns = ['tracker-stop', 'tracker-stop-large'];
    
    startBtns.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    });
    stopBtns.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    
    document.getElementById('tracker-info').textContent = 'Sélectionnez une tâche';
    
    this.updateDisplay();
  },

  updateDisplay() {
    let totalSeconds = 0;
    
    if (this.isRunning && this.startTime) {
      totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update both displays
    const displays = ['tracker-display', 'tracker-display-large'];
    displays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = timeStr;
    });
  }
};

// ============================================================================
// Thème (Clair/Sombre)
// ============================================================================

const ThemeManager = {
  STORAGE_KEY: 'timemanager_theme',

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
};

// ============================================================================
// Initialisation de l'application
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // Initialiser le gestionnaire de données
  await DataManager.init();

  // Initialiser le thème
  ThemeManager.init();

  // Initialiser les vues
  ViewManager.init();

  // Initialiser le chronomètre
  TimeTracker.init();

  // Gérer le menu mobile
  initMobileMenu();

  // Gérer les modales
  initModals();

  // Gérer les dropdowns
  initDropdowns();

  console.log('TimeManager initialisé avec succès !');
});

// ============================================================================
// Fonctions d'initialisation des composants UI
// ============================================================================

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

function initModals() {
  // Fermer les modales avec le bouton close
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) UI.closeModal(modal);
    });
  });

  // Fermer en cliquant sur l'overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) UI.closeModal(overlay);
    });
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) UI.closeModal(activeModal);
    }
  });
}

function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger, .user-menu');
    
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  });
}

// ============================================================================
// Export global pour les fonctions utilisées dans le HTML
// ============================================================================

window.ClientsView = ClientsView;
window.ProjectsView = ProjectsView;
window.TasksView = TasksView;
window.UsersView = UsersView;
window.TimeTracker = TimeTracker;
window.ThemeManager = ThemeManager;
window.UI = UI;
window.DataManager = DataManager;
