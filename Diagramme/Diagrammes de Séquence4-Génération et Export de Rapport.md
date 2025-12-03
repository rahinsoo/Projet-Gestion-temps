```mermaid
sequenceDiagram
    sequenceDiagram
    autonumber
    actor Manager as 👔 Responsable
    participant UI as 🖥️ Interface Web
    participant ReportCtrl as 🎮 ReportController
    participant ReportSvc as 📊 ReportService
    participant TimeSvc as ⏱️ TimeEntryService
    participant ProjSvc as 📁 ProjectService
    participant ChartSvc as 📈 ChartService
    participant ExportSvc as 📤 ExportService
    participant DB as 🗄️ Base de Données
    participant Storage as 💾 FileStorage
    participant EmailSvc as 📧 EmailService

    rect rgb(240, 248, 255)
        Note over Manager,EmailSvc: Phase 1 : Configuration du rapport
        Manager->>+UI: Accéder "Rapports"
        UI->>UI: Afficher tableau de bord rapports
        UI-->>Manager: Interface de configuration
        
        Manager->>UI: Sélectionner type "Temps par projet"
        Manager->>UI: Choisir période: 01/11/2025 - 30/11/2025
        Manager->>UI: Filtrer par projet: "Refonte Site Web"
        Manager->>UI: Inclure graphiques: OUI
        Manager->>UI: Grouper par: Utilisateur
        Manager->>UI: Cliquer "Générer le rapport"
        
        UI->>UI: Afficher loader "Génération en cours..."
    end

    rect rgb(255, 250, 240)
        Note over UI,EmailSvc: Phase 2 : Collecte des données
        UI->>+ReportCtrl: POST /api/reports/generate<br/>{type: 'PROJECT_TIME',<br/>startDate, endDate,<br/>projectId: 42,<br/>includeCharts: true,<br/>groupBy: 'user'}
        
        ReportCtrl->>+ReportSvc: generateReport(reportParams)
        
        ReportSvc->>+TimeSvc: getTimeEntries({<br/>projectId: 42,<br/>startDate: '2025-11-01',<br/>endDate: '2025-11-30'<br/>})
        
        TimeSvc->>+DB: SELECT te.*, u.firstName, u. lastName,<br/>t.title as taskTitle, t.estimatedHours<br/>FROM time_entries te<br/>JOIN users u ON te.userId<br/>JOIN tasks t ON te.taskId<br/>WHERE t.projectId = ? <br/>AND te.date BETWEEN ? AND ? <br/>AND te.status = 'VALIDATED'<br/>ORDER BY te.date, u.lastName
        DB-->>-TimeSvc: timeEntriesData[] (125 entrées)
        
        TimeSvc-->>-ReportSvc: timeEntries[]
        
        ReportSvc->>+ProjSvc: getProjectDetails(42)
        ProjSvc->>DB: SELECT p.*, c.name as clientName<br/>FROM projects p<br/>JOIN clients c ON p.clientId<br/>WHERE p.id = ?
        DB-->>ProjSvc: projectData
        ProjSvc-->>-ReportSvc: project
    end

    rect rgb(240, 255, 240)
        Note over ReportSvc,EmailSvc: Phase 3 : Traitement et calculs
        ReportSvc->>ReportSvc: groupByUser(timeEntries)
        Note right of ReportSvc: Résultat:<br/>- Jean Dupont: 45h<br/>- Marie Martin: 38. 5h<br/>- Paul Durand: 41.5h
        
        ReportSvc->>ReportSvc: calculateStatistics(timeEntries)
        Note right of ReportSvc: Stats calculées:<br/>- Total heures: 125h<br/>- Heures facturables: 110h<br/>- Heures non facturables: 15h<br/>- Taux utilisation: 88%<br/>- Budget consommé: 25%<br/>- Estimation fin: 30/05/2026
        
        ReportSvc->>ReportSvc: identifyTrends(timeEntries)
        Note right of ReportSvc: Tendances:<br/>- Pic activité: Semaine 46<br/>- Tâche la + longue:<br/>  "Développement API" (28h)<br/>- Moyenne journalière: 4.2h
        
        alt Graphiques demandés
            ReportSvc->>+ChartSvc: generateCharts(timeData, project)
            
            ChartSvc->>ChartSvc: createTimelineChart(timeEntries)
            ChartSvc->>ChartSvc: createUserDistributionChart(groupedData)
            ChartSvc->>ChartSvc: createTaskBreakdownChart(taskHours)
            ChartSvc->>ChartSvc: createBudgetProgressChart(project)
            
            ChartSvc-->>-ReportSvc: {charts: [<br/>  {type: 'timeline', data: {... }},<br/>  {type: 'pie', data: {...}},<br/>  {type: 'bar', data: {...}},<br/>  {type: 'gauge', data: {...}}<br/>]}
        end
    end

    rect rgb(255, 245, 240)
        Note over ReportSvc,EmailSvc: Phase 4 : Sauvegarde du rapport
        ReportSvc->>+DB: INSERT INTO reports<br/>(title, reportType, generatedById,<br/>startDate, endDate, filters,<br/>data, createdAt)
        Note right of ReportSvc: Data stockée en JSON:<br/>{<br/>  statistics: {... },<br/>  groupedData: {...},<br/>  charts: [...],<br/>  trends: {... }<br/>}
        DB-->>-ReportSvc: reportId = 89
        
        ReportSvc-->>-ReportCtrl: {success: true,<br/>reportId: 89,<br/>reportData: {... }}
        
        ReportCtrl-->>-UI: 201 Created<br/>{report: {...}}
        
        UI->>UI: Masquer loader
        UI->>UI: Construire visualisation
        UI->>UI: Rendre graphiques (Chart.js)
        UI->>UI: Afficher tableau détaillé
        
        UI-->>-Manager: 📊 Rapport affiché:<br/>- Statistiques globales<br/>- 4 graphiques interactifs<br/>- Tableau détaillé des entrées<br/>- Boutons Export
    end

    rect rgb(240, 255, 255)
        Note over Manager,EmailSvc: Phase 5 : Export PDF
        Manager->>+UI: Cliquer "Exporter PDF"
        UI->>UI: Afficher modal options export
        
        Manager->>UI: Sélectionner options:<br/>- Inclure graphiques: OUI<br/>- Inclure détails: OUI<br/>- Orientation: Paysage
        Manager->>UI: Confirmer export
        
        UI