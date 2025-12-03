```mermaid
graph TB
    subgraph Frontend["🖥️ ARCHITECTURE FRONT-END"]
        
        subgraph Public["Pages Publiques"]
            Login["/login<br/>🔐 Connexion"]
            ForgotPassword["/forgot-password<br/>🔑 Mot de passe oublié"]
            Legal["/legal/*<br/>📄 Pages légales"]
        end
        
        subgraph Private["Pages Privées (Authentifié)"]
            
            subgraph MainNav["Navigation Principale"]
                Dashboard["/dashboard<br/>📊 Tableau de bord"]
                Calendar["/calendar<br/>📅 Calendrier"]
                TimeTracking["/time<br/>⏱️ Suivi du temps"]
                Projects["/projects<br/>📁 Projets"]
                Tasks["/tasks<br/>✅ Tâches"]
                Clients["/clients<br/>🏢 Clients"]
                Reports["/reports<br/>📈 Rapports"]
                Team["/team<br/>👥 Équipe"]
            end
            
            subgraph DashboardViews["Vues Tableau de Bord"]
                DashOverview["/dashboard<br/>Vue d'ensemble"]
                DashStats["/dashboard/stats<br/>Statistiques détaillées"]
                DashActivity["/dashboard/activity<br/>Activité récente"]
            end
            
            subgraph TimeViews["Vues Temps"]
                TimeLog["/time/log<br/>Saisir temps"]
                TimeList["/time/list<br/>Mes temps"]
                TimeValidate["/time/validate<br/>Valider temps (Manager)"]
                TimeSheets["/time/sheets<br/>Feuilles de temps"]
            end
            
            subgraph ProjectViews["Vues Projets"]
                ProjectList["/projects<br/>Liste projets"]
                ProjectDetail["/projects/:id<br/>Détail projet"]
                ProjectNew["/projects/new<br/>Nouveau projet"]
                ProjectEdit["/projects/:id/edit<br/>Modifier projet"]
                ProjectBoard["/projects/:id/board<br/>Tableau Kanban"]
                ProjectGantt["/projects/:id/gantt<br/>Diagramme Gantt"]
                ProjectBudget["/projects/:id/budget<br/>Suivi budget"]
            end
            
            subgraph TaskViews["Vues Tâches"]
                TaskList["/tasks<br/>Mes tâches"]
                TaskDetail["/tasks/:id<br/>Détail tâche"]
                TaskNew["/projects/:id/tasks/new<br/>Nouvelle tâche"]
                TaskEdit["/tasks/:id/edit<br/>Modifier tâche"]
            end
            
            subgraph ClientViews["Vues Clients"]
                ClientList["/clients<br/>Liste clients"]
                ClientDetail["/clients/:id<br/>Détail client"]
                ClientNew["/clients/new<br/>Nouveau client"]
                ClientEdit["/clients/:id/edit<br/>Modifier client"]
                ClientContracts["/clients/:id/contracts<br/>Contrats client"]
            end
            
            subgraph ReportViews["Vues Rapports"]
                ReportList["/reports<br/>Mes rapports"]
                ReportNew["/reports/new<br/>Nouveau rapport"]
                ReportView["/reports/:id<br/>Voir rapport"]
                ReportSchedule["/reports/schedule<br/>Planifier rapports"]
            end
            
            subgraph TeamViews["Vues Équipe"]
                TeamList["/team<br/>Mon équipe"]
                TeamMember["/team/:id<br/>Profil membre"]
                TeamAbsences["/team/absences<br/>Absences & Congés"]
            end
            
            subgraph UserViews["Vues Utilisateur"]
                Profile["/profile<br/>👤 Mon profil"]
                Settings["/settings<br/>⚙️ Paramètres"]
                Notifications["/notifications<br/>🔔 Notifications"]
                Absences["/absences<br/>🏖️ Mes congés"]
            end
            
            subgraph AdminViews["Vues Admin"]
                AdminUsers["/admin/users<br/>Gestion utilisateurs"]
                AdminRoles["/admin/roles<br/>Rôles & permissions"]
                AdminSettings["/admin/settings<br/>Configuration système"]
                AdminLogs["/admin/logs<br/>Logs d'audit"]
                AdminLegal["/admin/legal<br/>Pages légales"]
            end
        end
    end
    
    Login --> Dashboard
    Dashboard --> TimeTracking & Projects & Tasks & Calendar
    Projects --> ProjectDetail --> TaskDetail
    TimeTracking --> TimeLog
    Profile --> Settings
    
    style Login fill:#E74C3C
    style Dashboard fill:#3498DB
    style Projects fill:#9B59B6
    style TimeTracking fill:#2ECC71
    style AdminUsers fill:#E67E22