/**
 * Main JavaScript - Outil de Gestion de Temps de Travail
 * Interactions de base pour les wireframes interactifs
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser tous les composants
  initMobileMenu();
  initModals();
  initDropdowns();
  initTabs();
  initFormValidation();
  initTooltips();
  initRoleSelector();
  initCalendarNavigation();
  initTableActions();
  initNotifications();
});

/* ==========================================================================
   Menu Mobile / Sidebar
   ========================================================================== */

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!menuBtn || !sidebar) return;

  // Créer l'overlay s'il n'existe pas
  let sidebarOverlay = overlay;
  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
  }

  // Toggle du menu
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  });

  // Fermer en cliquant sur l'overlay
  sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Fermer avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   Modals / Pop-ups
   ========================================================================== */

function initModals() {
  // Ouvrir les modals
  document.querySelectorAll('[data-modal-open]').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal-open');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Fermer les modals
  document.querySelectorAll('[data-modal-close]').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Fermer en cliquant sur l'overlay
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Fermer avec Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus sur le premier input
  const firstInput = modal.querySelector('input, textarea, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Dropdowns
   ========================================================================== */

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function(dropdown) {
    const trigger = dropdown.querySelector('.dropdown-trigger, .user-menu');
    
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Fermer les autres dropdowns
        dropdowns.forEach(function(d) {
          if (d !== dropdown) {
            d.classList.remove('active');
          }
        });

        dropdown.classList.toggle('active');
      });
    }
  });

  // Fermer tous les dropdowns en cliquant ailleurs
  document.addEventListener('click', function() {
    dropdowns.forEach(function(dropdown) {
      dropdown.classList.remove('active');
    });
  });

  // Fermer avec Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('active');
      });
    }
  });
}

/* ==========================================================================
   Tabs
   ========================================================================== */

function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(function(container) {
    const tabs = container.querySelectorAll('[data-tab]');
    const contents = container.querySelectorAll('[data-tab-content]');

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');

        // Désactiver tous les tabs et contenus
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activer le tab et le contenu cliqués
        this.classList.add('active');
        const content = container.querySelector(`[data-tab-content="${tabId}"]`);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   Validation de formulaires
   ========================================================================== */

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        // Supprimer les erreurs précédentes
        field.classList.remove('error', 'success');
        const errorEl = field.parentNode.querySelector('.form-error');
        if (errorEl) errorEl.remove();

        // Valider le champ
        if (!field.value.trim()) {
          isValid = false;
          showFieldError(field, 'Ce champ est obligatoire');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          showFieldError(field, 'Adresse email invalide');
        } else {
          field.classList.add('success');
        }
      });

      if (isValid) {
        // Simuler l'envoi du formulaire (wireframe)
        showNotification('Formulaire soumis avec succès !', 'success');
        form.reset();
        form.querySelectorAll('.success').forEach(f => f.classList.remove('success'));
      }
    });

    // Validation en temps réel
    form.querySelectorAll('input, textarea, select').forEach(function(field) {
      field.addEventListener('blur', function() {
        validateField(this);
      });

      field.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  });
}

function validateField(field) {
  field.classList.remove('error', 'success');
  const errorEl = field.parentNode.querySelector('.form-error');
  if (errorEl) errorEl.remove();

  if (field.hasAttribute('required') && !field.value.trim()) {
    showFieldError(field, 'Ce champ est obligatoire');
    return false;
  }

  if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    showFieldError(field, 'Adresse email invalide');
    return false;
  }

  if (field.value) {
    field.classList.add('success');
  }
  
  return true;
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errorEl = document.createElement('p');
  errorEl.className = 'form-error';
  errorEl.textContent = message;
  field.parentNode.appendChild(errorEl);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   Tooltips
   ========================================================================== */

function initTooltips() {
  // Les tooltips sont gérés via CSS avec data-tooltip
  // Cette fonction peut être étendue pour des tooltips plus complexes
}

/* ==========================================================================
   Sélecteur de rôle (pour démonstration)
   ========================================================================== */

function initRoleSelector() {
  const roleSelector = document.querySelector('[data-role-selector]');
  
  if (roleSelector) {
    roleSelector.addEventListener('change', function() {
      const role = this.value;
      document.body.setAttribute('data-role', role);
      localStorage.setItem('userRole', role);
      
      // Mettre à jour l'affichage du rôle
      updateRoleDisplay(role);
    });
  }

  // Charger le rôle sauvegardé
  const savedRole = localStorage.getItem('userRole') || 'employee';
  document.body.setAttribute('data-role', savedRole);
  
  if (roleSelector) {
    roleSelector.value = savedRole;
  }
  
  updateRoleDisplay(savedRole);
}

function updateRoleDisplay(role) {
  const roleLabels = {
    'admin': 'Administrateur',
    'manager': 'Responsable (N+1)',
    'employee': 'Employé'
  };

  const roleElements = document.querySelectorAll('.user-role, .role-display');
  roleElements.forEach(function(el) {
    el.textContent = roleLabels[role] || role;
  });
}

/* ==========================================================================
   Navigation du calendrier
   ========================================================================== */

function initCalendarNavigation() {
  // Navigation du mois
  const prevBtn = document.querySelector('.calendar-prev');
  const nextBtn = document.querySelector('.calendar-next');
  const monthTitle = document.querySelector('.calendar-month-title');

  if (prevBtn && nextBtn && monthTitle) {
    let currentDate = new Date();
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    function updateCalendarTitle() {
      monthTitle.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    prevBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendarTitle();
      // Note: Dans un vrai projet, ici on rechargerait le calendrier
    });

    nextBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendarTitle();
    });

    updateCalendarTitle();
  }

  // Changement de vue (Jour/Semaine/Mois)
  const viewBtns = document.querySelectorAll('.calendar-view-btn');
  viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Note: Dans un vrai projet, ici on changerait la vue du calendrier
      const view = this.getAttribute('data-view');
      showNotification(`Vue "${view}" sélectionnée`, 'info');
    });
  });
}

/* ==========================================================================
   Actions sur les tables
   ========================================================================== */

function initTableActions() {
  // Boutons d'action (éditer, supprimer)
  document.querySelectorAll('.btn-edit').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('data-id');
      showNotification(`Édition de l'élément #${id}`, 'info');
      // Ouvrir modal d'édition
    });
  });

  document.querySelectorAll('.btn-delete').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('data-id');
      if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        showNotification(`Élément #${id} supprimé`, 'success');
        // Supprimer la ligne
        const row = this.closest('tr');
        if (row) {
          row.style.opacity = '0';
          setTimeout(() => row.remove(), 300);
        }
      }
    });
  });

  // Sélection multiple
  const selectAllCheckbox = document.querySelector('.select-all');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.row-select');
      checkboxes.forEach(function(checkbox) {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
  }
}

/* ==========================================================================
   Notifications
   ========================================================================== */

function initNotifications() {
  // Créer le conteneur de notifications s'il n'existe pas
  if (!document.querySelector('.notifications-container')) {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 3000; display: flex; flex-direction: column; gap: 10px;';
    document.body.appendChild(container);
  }
}

function showNotification(message, type = 'info') {
  const container = document.querySelector('.notifications-container');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.style.cssText = 'min-width: 300px; animation: slideIn 0.3s ease; cursor: pointer;';
  
  const icons = {
    'info': '📋',
    'success': '✅',
    'warning': '⚠️',
    'danger': '❌'
  };

  notification.innerHTML = `
    <span class="alert-icon">${icons[type] || icons.info}</span>
    <span class="alert-content">${message}</span>
  `;

  container.appendChild(notification);

  // Fermer au clic
  notification.addEventListener('click', function() {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });

  // Auto-fermeture après 5 secondes
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Ajouter les animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ==========================================================================
   Fonctions utilitaires
   ========================================================================== */

// Formater une date
function formatDate(date, format = 'dd/mm/yyyy') {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year);
}

// Formater un nombre avec séparateur de milliers
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Générer un ID unique
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Debounce pour les recherches
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Recherche dans un tableau
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('input', debounce(function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.table tbody tr');
    
    rows.forEach(function(row) {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }, 300));
}

/* ==========================================================================
   Export des fonctions pour utilisation externe
   ========================================================================== */

window.TimeManager = {
  openModal,
  closeModal,
  showNotification,
  formatDate,
  formatNumber,
  generateId
};
