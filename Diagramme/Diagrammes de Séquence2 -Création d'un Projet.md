```mermaid
sequenceDiagram
    autonumber
    actor Manager as 👔 Responsable
    participant UI as 🖥️ Interface Web
    participant ProjCtrl as 🎮 ProjectController
    participant ProjSvc as 📁 ProjectService
    participant ClientSvc as 🏢 ClientService
    participant UserSvc as 👥 UserService
    participant Validator as ✅ DataValidator
    participant DB as 🗄️ Base de Données
    participant NotifSvc as 🔔 NotificationService
    participant ActivitySvc as 📊 ActivityService

    rect rgb(240, 248, 255)
        Note over Manager,ActivitySvc: Phase 1 : Chargement des données initiales
        Manager->>+UI: Cliquer "Nouveau Projet"
        UI->>+ProjCtrl: GET /api/projects/new
        
        par Chargement parallèle
            ProjCtrl->>+ClientSvc: getActiveClients()
            ClientSvc->>DB: SELECT * FROM clients<br/>WHERE isActive = true
            DB-->>ClientSvc: clientsList[]
            ClientSvc-->>-ProjCtrl: clients
        and
            ProjCtrl->>+UserSvc: getAvailableManagers()
            UserSvc->>DB: SELECT * FROM users<br/>WHERE role IN ('ADMIN', 'MANAGER')<br/>AND isActive = true
            DB-->>UserSvc: managersList[]
            UserSvc-->>-ProjCtrl: managers
        and
            ProjCtrl->>+UserSvc: getTeamMembers()
            UserSvc->>DB: SELECT * FROM users<br/>WHERE isActive = true
            DB-->>UserSvc: teamMembersList[]
            UserSvc-->>-ProjCtrl: teamMembers
        end
        
        ProjCtrl-->>-UI: {clients[], managers[], teamMembers[]}
        UI->>UI: Remplir formulaire avec données
        UI-->>-Manager: Afficher formulaire rempli
    end

    rect rgb(255, 250, 240)
        Note over Manager,ActivitySvc: Phase 2 : Saisie et validation front-end
        Manager->>+UI: Remplir formulaire projet
        Note right of Manager: - Nom: "Refonte Site Web"<br/>- Code: "RSW-2025"<br/>- Client: Entreprise ABC<br/>- Manager: Jean Dupont<br/>- Dates: 01/01/2025 - 30/06/2025<br/>- Budget: 500h / 50000€<br/>- Membres: 3 développeurs
        
        Manager->>UI: Sélectionner client
        UI->>UI: Charger projets existants du client
        
        Manager->>UI: Ajouter membres équipe
        UI->>UI: Afficher liste avec rôles
        
        Manager->>UI: Cliquer "Créer le projet"
        
        UI->>UI: Valider champs obligatoires
        UI->>UI: Vérifier format dates
        UI->>UI: Vérifier budget > 0
        
        alt Validation front-end échouée
            UI-->>Manager: ❌ "Champs obligatoires manquants"
            Manager->>UI: Corriger erreurs
        end
    end

    rect rgb(240, 255, 240)
        Note over UI,ActivitySvc: Phase 3 : Soumission et validation back-end
        UI->>+ProjCtrl: POST /api/projects<br/>{name, code, clientId, managerId,<br/>startDate, endDate, budgetHours,<br/>budgetAmount, teamMembers[], description}
        
        ProjCtrl->>+Validator: validateProjectData(projectData)
        
        Validator->>Validator: checkRequired(name, clientId, managerId)
        Validator->>Validator: validateDateRange(startDate, endDate)
        Validator->>Validator: validateBudget(budgetHours, budgetAmount)
        Validator->>Validator: checkCodeUniqueness(code)
        Validator->>DB: SELECT COUNT(*) FROM projects<br/>WHERE code = ?
        DB-->>Validator: count = 0
        
        alt Validation réussie
            Validator-->>-ProjCtrl: ✅ Validation OK
        else Validation échouée
            Validator-->>ProjCtrl: ❌ {errors: [... ]}
            ProjCtrl-->>UI: 400 Bad Request + errors
            UI-->>Manager: Afficher erreurs détaillées
        end
    end

    rect rgb(255, 245, 240)
        Note over ProjCtrl,ActivitySvc: Phase 4 : Création en base de données
        ProjCtrl->>+ProjSvc: createProject(projectData)
        
        ProjSvc->>ProjSvc: Démarrer transaction DB
        
        ProjSvc->>+DB: BEGIN TRANSACTION
        
        ProjSvc->>DB: INSERT INTO projects<br/>(name, code, clientId, managerId,<br/>startDate, endDate, budgetHours,<br/>budgetAmount, status, createdAt)
        DB-->>ProjSvc: projectId = 42
        
        loop Pour chaque membre d'équipe
            ProjSvc->>DB: INSERT INTO project_assignments<br/>(projectId, userId, assignmentRole,<br/>assignedDate)
            DB-->>ProjSvc: assignmentId
        end
        
        ProjSvc->>DB: INSERT INTO activities<br/>(userId, activityType, description,<br/>entityType, entityId)
        DB-->>ProjSvc: activityId
        
        ProjSvc->>DB: COMMIT TRANSACTION
        DB-->>-ProjSvc: Transaction réussie
        
        ProjSvc->>+DB: SELECT projects.*,<br/>clients.name as clientName,<br/>users.firstName, users.lastName<br/>FROM projects<br/>JOIN clients ON projects.clientId<br/>JOIN users ON projects.managerId<br/>WHERE projects.id = ? 
        DB-->>-ProjSvc: fullProjectData
        
        ProjSvc-->>-ProjCtrl: {success: true, project: fullProjectData}
    end

    rect rgb(240, 255, 255)
        Note over ProjCtrl,ActivitySvc: Phase 5 : Notifications et activités
        ProjCtrl->>+NotifSvc: notifyProjectCreated(project)
        
        par Notifications parallèles
            NotifSvc->>DB: INSERT INTO notifications<br/>(userId=managerId, type, message)
            NotifSvc->>NotifSvc: Envoyer email au manager
        and
            loop Pour chaque membre
                NotifSvc->>DB: INSERT INTO notifications<br/>(userId=memberId, type, message)
                NotifSvc->>NotifSvc: Envoyer notification push
            end
        and
            NotifSvc->>+ClientSvc: notifyClient(clientId, projectId)
            ClientSvc->>ClientSvc: Envoyer email récapitulatif
            ClientSvc-->>-NotifSvc: Email envoyé
        end
        
        NotifSvc-->>-ProjCtrl: Notifications envoyées
        
        ProjCtrl->>+ActivitySvc: logActivity({<br/>userId: managerId,<br/>type: 'PROJECT_CREATED',<br/>description: 'Création du projet RSW-2025',<br/>entityType: 'PROJECT',<br/>entityId: 42<br/>})
        ActivitySvc->>DB: INSERT INTO activities
        ActivitySvc-->>-ProjCtrl: Activity logged
    end

    rect rgb(240, 255, 240)
        Note over ProjCtrl,Manager: Phase 6 : Réponse et affichage
        ProjCtrl-->>-UI: 201 Created<br/>{success: true,<br/>project: fullProjectData,<br/>message: "Projet créé avec succès"}
        
        UI->>UI: Afficher notification succès
        UI->>UI: Rediriger vers /projects/42
        UI->>UI: Charger page détails projet
        
        UI-->>-Manager: ✅ "Projet 'Refonte Site Web' créé"<br/>Afficher tableau de bord projet
    end

    rect rgb(255, 240, 240)
        Note over Manager,ActivitySvc: Phase 7 : Gestion des erreurs
        opt Erreur lors de la création
            ProjSvc->>DB: ROLLBACK TRANSACTION
            ProjSvc-->>ProjCtrl: {success: false,<br/>error: "DATABASE_ERROR"}
            ProjCtrl-->>UI: 500 Internal Server Error
            UI-->>Manager: ❌ "Erreur lors de la création"
        end
    end