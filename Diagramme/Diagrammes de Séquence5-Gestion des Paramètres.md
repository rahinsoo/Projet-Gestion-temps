```mermaid
sequenceDiagram
    actor User as Utilisateur
    participant UI as Interface
    participant SettingsCtrl as SettingsController
    participant SettingsSvc as SettingsService
    participant DB as Base de données
    participant ThemeManager as ThemeManager

    User->>UI: Accéder "Paramètres"
    UI->>SettingsSvc: getSettings(userId)
    SettingsSvc->>DB: SELECT settings WHERE userId
    DB-->>SettingsSvc: settingsData
    SettingsSvc-->>UI: Afficher paramètres actuels
    
    User->>UI: Toggle "Mode sombre"
    UI->>UI: Aperçu en temps réel
    User->>UI: Cliquer "Enregistrer"
    
    UI->>SettingsCtrl: updateSettings(userId, newSettings)
    SettingsCtrl->>SettingsSvc: update(userId, {theme: 'DARK'})
    
    SettingsSvc->>DB: UPDATE settings SET theme='DARK'
    DB-->>SettingsSvc: success
    
    SettingsSvc->>ThemeManager: applyTheme('DARK')
    ThemeManager->>ThemeManager: loadDarkCSS()
    ThemeManager->>ThemeManager: saveToLocalStorage('theme', 'DARK')
    ThemeManager-->>SettingsSvc: themeApplied
    
    SettingsSvc-->>SettingsCtrl: {success: true}
    SettingsCtrl-->>UI: Paramètres mis à jour
    UI-->>User: Confirmation + thème appliqué