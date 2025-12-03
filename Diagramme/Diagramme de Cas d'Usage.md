```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#4A90E2','primaryTextColor':'#000','primaryBorderColor':'#2C3E50','lineColor':'#34495E','secondaryColor':'#95A5A6','tertiaryColor':'#ECF0F1'}}}%%

graph TB
    %% ========================================
    %% ACTEURS
    %% ========================================
    
    Admin["👨‍💼 ADMINISTRATEUR<br/>Gestion complète système"]
    Manager["👔 RESPONSABLE N+1<br/>Gestion équipe & projets"]
    Employee["👤 EMPLOYÉ<br/>Suivi temps & tâches"]

    %% ========================================
    %% SYSTÈME
    %% ========================================
    
    subgraph System["🏢 SYSTÈME DE GESTION DE TEMPS DE TRAVAIL"]
        
        %% AUTHENTIFICATION ET SÉCURITÉ
        subgraph Auth["🔐 Authentification & Sécurité"]
            UC01["UC-01<br/>Se connecter"]
            UC02["UC-02<br/>Se déconnecter"]
            UC03["UC-03<br/>Récupérer mot de passe"]
            UC04["UC-04<br/>Changer mot de passe"]
            UC05["UC-05<br/>Gérer sessions actives"]
        end

        %% GESTION DES CLIENTS
        subgraph Clients["🏢 Gestion Clients"]
            UC06["UC-06<br/>Créer un client"]
            UC07["UC-07<br/>Consulter clients"]
            UC08["UC-08<br/>Modifier un client"]
            UC09["UC-09<br/>Archiver un client"]
            UC10["UC-10<br/>Voir stats client"]
        end

        %% GESTION DES PROJETS
        subgraph Projects["📁 Gestion Projets"]
            UC11["UC-11<br/>Créer un projet"]
            UC12["UC-12<br/>Consulter projets"]
            UC13["UC-13<br/>Modifier un projet"]
            UC14["UC-14<br/>Archiver un projet"]
            UC15["UC-15<br/>Attribuer membres équipe"]
            UC16["UC-16<br/>Retirer membre équipe"]
            UC17["UC-17<br/>Suivre avancement projet"]
            UC18["UC-18<br/>Gérer budget projet"]
        end

        %% GESTION DES TÂCHES
        subgraph Tasks["✅ Gestion Tâches"]
            UC19["UC-19<br/>Créer une tâche"]
            UC20["UC-20<br/>Consulter tâches"]
            UC21["UC-21<br/>Modifier une tâche"]
            UC22["UC-22<br/>Supprimer une tâche"]
            UC23["UC-23<br/>Changer statut tâche"]
            UC24["UC-24<br/>Assigner une tâche"]
            UC25["UC-25<br/>Définir priorité"]
            UC26["UC-26<br/>Créer sous-tâche"]
            UC27["UC-27<br/>Commenter tâche"]
        end

        %% GESTION DU TEMPS
        subgraph TimeTracking["⏱️ Gestion Temps"]
            UC28["UC-28<br/>Saisir temps travaillé"]
            UC29["UC-29<br/>Modifier temps saisi"]
            UC30["UC-30<br/>Supprimer temps saisi"]
            UC31["UC-31<br/>Consulter temps"]
            UC32["UC-32<br/>Valider temps"]
            UC33["UC-33<br/>Rejeter temps"]
            UC34["UC-34<br/>Voir temps équipe"]
        end

        %% CALENDRIER
        subgraph Calendar["📅 Calendrier"]
            UC35["UC-35<br/>Voir calendrier"]
            UC36["UC-36<br/>Ajouter événement"]
            UC37["UC-37<br/>Modifier événement"]
            UC38["UC-38<br/>Supprimer événement"]
            UC39["UC-39<br/>Voir tâches calendrier"]
            UC40["UC-40<br/>Glisser-déposer tâches"]
        end

        %% TABLEAU DE BORD
        subgraph Dashboard["📊 Tableau de Bord"]
            UC41["UC-41<br/>Voir tableau de bord"]
            UC42["UC-42<br/>Consulter statistiques"]
            UC43["UC-43<br/>Voir activités récentes"]
            UC44["UC-44<br/>Personnaliser widgets"]
            UC45["UC-45<br/>Voir tâches urgentes"]
        end

        %% RAPPORTS
        subgraph Reports["📈 Rapports & Analyses"]
            UC46["UC-46<br/>Générer rapport temps"]
            UC47["UC-47<br/>Générer rapport projet"]
            UC48["UC-48<br/>Générer rapport productivité"]
            UC49["UC-49<br/>Exporter rapport PDF"]
            UC50["UC-50<br/>Exporter rapport Excel"]
            UC51["UC-51<br/>Planifier rapport automatique"]
        end

        %% NOTIFICATIONS
        subgraph Notifications["🔔 Notifications"]
            UC52["UC-52<br/>Consulter notifications"]
            UC53["UC-53<br/>Marquer comme lu"]
            UC54["UC-54<br/>Configurer alertes"]
        end

        %% PROFIL
        subgraph Profile["👤 Profil"]
            UC55["UC-55<br/>Voir profil"]
            UC56["UC-56<br/>Modifier profil"]
            UC57["UC-57<br/>Changer avatar"]
            UC58["UC-58<br/>Voir historique activité"]
        end

        %% PARAMÈTRES
        subgraph Settings["⚙️ Paramètres"]
            UC59["UC-59<br/>Changer thème (clair/sombre)"]
            UC60["UC-60<br/>Changer langue"]
            UC61["UC-61<br/>Configurer notifications"]
            UC62["UC-62<br/>Gérer préférences"]
            UC63["UC-63<br/>Configurer format date/heure"]
        end

        %% PAGES LÉGALES
        subgraph Legal["📄 Pages Légales"]
            UC64["UC-64<br/>Consulter mentions légales"]
            UC65["UC-65<br/>Consulter CGU"]
            UC66["UC-66<br/>Consulter politique confidentialité"]
            UC67["UC-67<br/>Accepter cookies"]
        end

        %% ADMINISTRATION
        subgraph Admin_Features["🔧 Administration Système"]
            UC68["UC-68<br/>Gérer utilisateurs"]
            UC69["UC-69<br/>Attribuer rôles"]
            UC70["UC-70<br/>Voir logs système"]
            UC71["UC-71<br/>Configurer système"]
            UC72["UC-72<br/>Gérer pages légales"]
        end
    end

    %% ========================================
    %% RELATIONS ADMINISTRATEUR
    %% ========================================
    
    Admin -. ->|accède à| UC01 & UC02 & UC04 & UC05
    Admin -. ->|gère| UC06 & UC07 & UC08 & UC09 & UC10
    Admin -. ->|contrôle| UC11 & UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18
    Admin -.->|supervise| UC19 & UC20 & UC21 & UC22 & UC23
    Admin -.->|valide| UC31 & UC32 & UC33 & UC34
    Admin -.->|consulte| UC41 & UC42 & UC43 & UC44
    Admin -.->|génère| UC46 & UC47 & UC48 & UC49 & UC50 & UC51
    Admin -.->|configure| UC52 & UC54 & UC59 & UC60 & UC61 & UC62 & UC63
    Admin -.->|administre| UC68 & UC69 & UC70 & UC71 & UC72
    Admin -.->|accède| UC64 & UC65 & UC66

    %% ========================================
    %% RELATIONS RESPONSABLE N+1
    %% ========================================
    
    Manager -. ->|accède à| UC01 & UC02 & UC03 & UC04
    Manager -.->|consulte| UC07 & UC10
    Manager -.->|pilote| UC11 & UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18
    Manager -.->|organise| UC19 & UC20 & UC21 & UC22 & UC23 & UC24 & UC25 & UC26 & UC27
    Manager -.->|suit| UC28 & UC31 & UC32 & UC33 & UC34
    Manager -.->|planifie| UC35 & UC36 & UC37 & UC38 & UC39 & UC40
    Manager -.->|analyse| UC41 & UC42 & UC43 & UC44 & UC45
    Manager -.->|produit| UC46 & UC47 & UC48 & UC49 & UC50 & UC51
    Manager -.->|reçoit| UC52 & UC53 & UC54
    Manager -.->|personnalise| UC55 & UC56 & UC57 & UC58
    Manager -.->|configure| UC59 & UC60 & UC61 & UC62 & UC63
    Manager -.->|consulte| UC64 & UC65 & UC66

    %% ========================================
    %% RELATIONS EMPLOYÉ
    %% ========================================
    
    Employee -.->|accède à| UC01 & UC02 & UC03 & UC04
    Employee -.->|visualise| UC12 & UC17
    Employee -.->|travaille sur| UC20 & UC21 & UC23 & UC27
    Employee -.->|enregistre| UC28 & UC29 & UC30 & UC31
    Employee -.->|utilise| UC35 & UC36 & UC37 & UC38 & UC39 & UC40
    Employee -.->|consulte| UC41 & UC42 & UC43 & UC45
    Employee -.->|génère| UC46 & UC49
    Employee -.->|gère| UC52 & UC53 & UC54
    Employee -.->|édite| UC55 & UC56 & UC57 & UC58
    Employee -.->|ajuste| UC59 & UC60 & UC61 & UC62 & UC63
    Employee -.->|lit| UC64 & UC65 & UC66 & UC67

    %% ========================================
    %% STYLE
    %% ========================================
    
    classDef actorStyle fill:#E74C3C,stroke:#C0392B,stroke-width:3px,color:#FFF
    classDef adminActorStyle fill:#E74C3C,stroke:#C0392B,stroke-width:3px,color:#FFF
    classDef managerActorStyle fill:#3498DB,stroke:#2980B9,stroke-width:3px,color:#FFF
    classDef employeeActorStyle fill:#2ECC71,stroke:#27AE60,stroke-width:3px,color:#FFF
    classDef ucStyle fill:#ECF0F1,stroke:#34495E,stroke-width:2px,color:#2C3E50
    classDef systemStyle fill:#BDC3C7,stroke:#7F8C8D,stroke-width:2px
    
    class Admin adminActorStyle
    class Manager managerActorStyle
    class Employee employeeActorStyle
    class UC01,UC02,UC03,UC04,UC05,UC06,UC07,UC08,UC09,UC10 ucStyle
    class UC11,UC12,UC13,UC14,UC15,UC16,UC17,UC18,UC19,UC20 ucStyle
    class UC21,UC22,UC23,UC24,UC25,UC26,UC27,UC28,UC29,UC30 ucStyle
    class UC31,UC32,UC33,UC34,UC35,UC36,UC37,UC38,UC39,UC40 ucStyle
    class UC41,UC42,UC43,UC44,UC45,UC46,UC47,UC48,UC49,UC50 ucStyle
    class UC51,UC52,UC53,UC54,UC55,UC56,UC57,UC58,UC59,UC60 ucStyle
    class UC61,UC62,UC63,UC64,UC65,UC66,UC67,UC68,UC69,UC70 ucStyle
    class UC71,UC72 ucStyle