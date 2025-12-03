/**
 * Theme Switcher - Outil de Gestion de Temps de Travail
 * Gestion du basculement entre thème clair et sombre
 */

(function() {
  'use strict';

  // Constantes
  const STORAGE_KEY = 'theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  // Éléments du DOM
  let themeToggle = null;
  let themeSwitch = null;

  /**
   * Initialisation du theme switcher
   */
  function init() {
    // Charger le thème sauvegardé ou détecter la préférence système
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? THEME_DARK : THEME_LIGHT);

    // Appliquer le thème initial
    applyTheme(initialTheme);

    // Initialiser les contrôles après le chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initControls);
    } else {
      initControls();
    }

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Ne changer que si l'utilisateur n'a pas de préférence sauvegardée
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        updateControls();
      }
    });
  }

  /**
   * Initialiser les contrôles du thème
   */
  function initControls() {
    // Toggle switch (checkbox)
    themeSwitch = document.querySelector('[data-theme-switch]');
    if (themeSwitch) {
      themeSwitch.checked = getCurrentTheme() === THEME_DARK;
      themeSwitch.addEventListener('change', function() {
        toggleTheme();
      });
    }

    // Bouton toggle
    themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
    }

    // Boutons thème spécifique
    document.querySelectorAll('[data-set-theme]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const theme = this.getAttribute('data-set-theme');
        setTheme(theme);
      });
    });

    // Mettre à jour l'état des contrôles
    updateControls();
  }

  /**
   * Obtenir le thème actuel
   */
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
  }

  /**
   * Appliquer un thème
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Mettre à jour la meta theme-color pour mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEME_DARK ? '#1a1a1a' : '#ffffff');
    }

    // Émettre un événement personnalisé
    document.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: theme }
    }));
  }

  /**
   * Définir et sauvegarder un thème
   */
  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateControls();
  }

  /**
   * Basculer entre les thèmes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(newTheme);
  }

  /**
   * Mettre à jour l'état des contrôles UI
   */
  function updateControls() {
    const isDark = getCurrentTheme() === THEME_DARK;

    // Mettre à jour le switch
    if (themeSwitch) {
      themeSwitch.checked = isDark;
    }

    // Mettre à jour le bouton toggle
    if (themeToggle) {
      const sunIcon = themeToggle.querySelector('.sun-icon, .theme-icon.sun');
      const moonIcon = themeToggle.querySelector('.moon-icon, .theme-icon.moon');
      
      if (sunIcon && moonIcon) {
        sunIcon.style.opacity = isDark ? '0.5' : '1';
        moonIcon.style.opacity = isDark ? '1' : '0.5';
      }

      // Mettre à jour l'aria-label
      themeToggle.setAttribute('aria-label', 
        isDark ? 'Passer au mode clair' : 'Passer au mode sombre'
      );
    }

    // Mettre à jour les boutons de thème spécifique
    document.querySelectorAll('[data-set-theme]').forEach(function(btn) {
      const btnTheme = btn.getAttribute('data-set-theme');
      btn.classList.toggle('active', btnTheme === getCurrentTheme());
    });

    // Mettre à jour le texte du label
    const themeLabel = document.querySelector('.theme-label');
    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Mode sombre' : 'Mode clair';
    }
  }

  /**
   * API publique
   */
  window.ThemeSwitcher = {
    init: init,
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    isDark: function() {
      return getCurrentTheme() === THEME_DARK;
    },
    isLight: function() {
      return getCurrentTheme() === THEME_LIGHT;
    }
  };

  // Auto-initialisation
  init();

})();
