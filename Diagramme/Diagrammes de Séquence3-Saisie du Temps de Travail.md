```mermaid
sequenceDiagram
    autonumber
    actor Employee as 👤 Employé
    actor Manager as 👔 Responsable
    participant UI as 🖥️ Interface Web
    participant TimeCtrl as 🎮 TimeEntryController
    participant TimeSvc as ⏱️ TimeEntryService
    participant TaskSvc as ✅ TaskService
    participant CalSvc as 📅 CalendarService
    participant Validator as ✔️ Validator
    participant DB as 🗄️ Base de Données
    participant NotifSvc as 🔔 NotificationService

    rect rgb(240, 248, 255)
        Note over Employee,NotifSvc: Phase 1 : Chargement du calendrier et tâches
        Employee->>+UI: Accéder à "Mon Calendrier"
        UI->>+TimeCtrl: GET /api/calendar/week? date=2025-12-02
        
        TimeCtrl->>+CalSvc: getWeekEvents(userId, weekStart)
        CalSvc->>DB: SELECT * FROM calendar_events<br/>WHERE userId = ? AND date BETWEEN ? AND ?
        DB-->>CalSvc: events[]
        CalSvc-->>-TimeCtrl: weekEvents[]
        
        TimeCtrl->>+TaskSvc: getAssignedTasks(userId, status: ['TODO', 'IN_PROGRESS'])
        TaskSvc->>DB: SELECT tasks. *, projects.name as projectName<br/>FROM tasks<br/>JOIN projects ON tasks.projectId<br/>WHERE assignedToId = ? <br/>AND status IN ('TODO', 'IN_PROGRESS')
        DB-->>TaskSvc: tasksList[]
        TaskSvc-->>-TimeCtrl: assignedTasks[]
        
        TimeCtrl->>+TimeSvc: getWeekTimeEntries(userId, weekStart)
        TimeSvc->>DB: SELECT * FROM time_entries<br/>WHERE userId = ? AND date BETWEEN ? AND ?
        DB-->>TimeSvc: timeEntries[]
        TimeSvc-->>-TimeCtrl: weekTimeEntries[]
        
        TimeCtrl-->>-UI: {weekEvents[], assignedTasks[],<br/>weekTimeEntries[], totalHours: 32. 5}
        
        UI->>UI: Construire vue calendrier
        UI->>UI: Afficher tâches dans sidebar
        UI-->>-Employee: Calendrier + tâches affichées
    end

    rect rgb(255, 250, 240)
        Note over Employee,NotifSvc: Phase 2 : Saisie du temps
        Employee->>+UI: Sélectionner tâche<br/>"Développement module auth"
        UI->>UI: Afficher modal saisie temps
        
        Employee->>UI: Sélectionner date: 2025-12-02
        Employee->>UI: Saisir heures: 4. 5
        Employee->>UI: Saisir description: "Implémentation JWT"
        Employee->>UI: Cocher "Facturable"
        Employee->>UI: Cliquer "Enregistrer"
        
        UI->>UI: Valider format données
        UI->>UI: Vérifier heures > 0 && heures <= 24
        
        alt Validation front-end OK
            UI->>+TimeCtrl: POST /api/time-entries<br/>{taskId: 15, date: "2025-12-02",<br/>hours: 4.5, description: ".. .",<br/>isBillable: true}
        else Validation échouée
            UI-->>Employee: ❌ "Heures invalides (max 24h)"
        end
    end

    rect rgb(240, 255, 240)
        Note over TimeCtrl,NotifSvc: Phase 3 : Validation et création
        TimeCtrl->>+Validator: validateTimeEntry(timeEntryData)
        
        Validator->>Validator: checkRequired(taskId, date, hours)
        Validator->>Validator: validateHours(0 < hours <= 24)
        Validator->>Validator: validateDate(date <= today)
        
        Validator->>+TimeSvc: checkDailyLimit(userId, date, newHours)
        TimeSvc->>DB: SELECT SUM(hours) FROM time_entries<br/>WHERE userId = ? AND date = ?
        DB-->>TimeSvc: currentDailyHours = 3.5
        TimeSvc->>TimeSvc: totalDaily = 3.5 + 4.5 = 8 hours
        
        alt Total <= 24h
            TimeSvc-->>-Validator: ✅ OK
            Validator-->>-TimeCtrl: Validation réussie
        else Total > 24h
            TimeSvc-->>Validator: ❌ Limite dépassée
            Validator-->>TimeCtrl: {error: "DAILY_LIMIT_EXCEEDED"}
            TimeCtrl-->>UI: 400 Bad Request
            UI-->>Employee: ❌ "Limite journalière dépassée (24h max)"
        end
        
        TimeCtrl->>+TimeSvc: createTimeEntry(timeEntryData)
        
        TimeSvc->>DB: BEGIN TRANSACTION
        
        TimeSvc->>DB: INSERT INTO time_entries<br/>(userId, taskId, date, hours,<br/>description, isBillable, status,<br/>createdAt)
        DB-->>TimeSvc: timeEntryId = 234
        
        TimeSvc->>+TaskSvc: updateTaskHours(taskId, +4.5)
        TaskSvc->>DB: UPDATE tasks<br/>SET actualHours = actualHours + 4.5<br/>WHERE id = ?
        DB-->>TaskSvc: rows affected = 1
        
        TaskSvc->>DB: SELECT estimatedHours, actualHours<br/>FROM tasks WHERE id = ?
        DB-->>TaskSvc: {estimated: 40, actual: 28. 5}
        TaskSvc->>TaskSvc: progress = 28.5/40 = 71.25%
        TaskSvc-->>-TimeSvc: Task updated
        
        TimeSvc->>+CalSvc: addTimeEntryToCalendar(timeEntry)
        CalSvc->>DB: INSERT INTO calendar_events<br/>(calendarId, title, startDateTime,<br/>endDateTime, eventType, relatedTaskId,<br/>color)
        DB-->>CalSvc: calendarEventId = 567
        CalSvc-->>-TimeSvc: Event created
        
        TimeSvc->>DB: COMMIT TRANSACTION
        DB-->>TimeSvc: Success
        
        TimeSvc->>DB: SELECT te.*, t.title as taskTitle,<br/>p.name as projectName<br/>FROM time_entries te<br/>JOIN tasks t ON te.taskId<br/>JOIN projects p ON t. projectId<br/>WHERE te. id = ?
        DB-->>TimeSvc: fullTimeEntryData
        
        TimeSvc-->>-TimeCtrl: {success: true,<br/>timeEntry: fullTimeEntryData}
    end

    rect rgb(240, 255, 255)
        Note over TimeCtrl,NotifSvc: Phase 4 : Notifications
        TimeCtrl->>+NotifSvc: notifyTimeLogged(timeEntry)
        
        NotifSvc->>DB: SELECT managerId FROM projects<br/>WHERE id = (SELECT projectId<br/>FROM tasks WHERE id = ?)
        DB-->>NotifSvc: managerId = 5
        
        NotifSvc->>DB: INSERT INTO notifications<br/>(userId=5, type='TIME_LOGGED',<br/>message="Jean a saisi 4.5h sur.. .",<br/>link="/time-entries/234")
        DB-->>NotifSvc: notificationId
        
        NotifSvc->>NotifSvc: Envoyer notification push au manager
        NotifSvc-->>-TimeCtrl: Notification envoyée
        
        TimeCtrl-->>-UI: 201 Created<br/>{success: true, timeEntry, message}
        
        UI->>UI: Actualiser calendrier
        UI->>UI: Actualiser total heures jour/semaine
        UI->>UI: Actualiser progression tâche
        UI-->>-Employee: ✅ "4.5h enregistrées sur tâche"<br/>Calendrier mis à jour
    end

    rect rgb(255, 245, 240)
        Note over Manager,NotifSvc: Phase 5 : Validation par le responsable
        Manager->>+UI: Accéder "Temps à valider"
        UI->>+TimeCtrl: GET /api/time-entries/pending
        TimeCtrl->>+TimeSvc: getPendingTimeEntries(managerId)
        TimeSvc->>DB: SELECT te.*, u.firstName, u.lastName<br/>FROM time_entries te<br/>JOIN tasks t ON te.taskId<br/>JOIN projects p ON t.projectId<br/>JOIN users u ON te.userId<br/>WHERE p.managerId = ? <br/>AND te.status = 'SUBMITTED'
        DB-->>TimeSvc: pendingEntries[]
        TimeSvc-->>-TimeCtrl: pendingEntries
        TimeCtrl-->>-UI: {pendingEntries: [... ]}
        UI-->>-Manager: Liste des temps à valider
        
        Manager->>+UI: Sélectionner temps #234
        Manager->>UI: Cliquer "Valider"
        
        UI->>+TimeCtrl: PUT /api/time-entries/234/validate
        TimeCtrl->>+TimeSvc: validateTimeEntry(234, managerId)
        
        TimeSvc->>DB: UPDATE time_entries<br/>SET status = 'VALIDATED',<br/>validatedById = ?,<br/>validatedAt = NOW()<br/>WHERE id = ?
        DB-->>TimeSvc: rows affected = 1
        
        TimeSvc-->>-TimeCtrl: {success: true}
        
        TimeCtrl->>+NotifSvc: notifyTimeValidated(timeEntryId, employeeId)
        NotifSvc->>DB: INSERT INTO notifications<br/>(userId=employeeId,<br/>type='TIME_VALIDATED',<br/>message="Votre temps a été validé")
        NotifSvc->>NotifSvc: Envoyer email + push à l'employé
        NotifSvc-->>-TimeCtrl: Notifié
        
        TimeCtrl-->>-UI: 200 OK<br/>{success: true, message: "Temps validé"}
        UI-->>-Manager: ✅ "Temps validé avec succès"
        
        Note over Employee: L'employé reçoit notification
        NotifSvc->>Employee: 🔔 "Votre temps du 02/12 a été validé"
    end

    rect rgb(255, 240, 240)
        Note over Employee,NotifSvc: Phase 6 : Scénario alternatif - Rejet
        opt Manager rejette le temps
            Manager->>UI: Cliquer "Rejeter"
            UI->>Manager: Modal "Raison du rejet"
            Manager->>UI: Saisir raison + Confirmer
            
            UI->>TimeCtrl: PUT /api/time-entries/234/reject<br/>{reason: "Durée excessive"}
            TimeCtrl->>TimeSvc: rejectTimeEntry(234, managerId, reason)
            
            TimeSvc->>DB: UPDATE time_entries<br/>SET status = 'REJECTED',<br/>validatedById = ?,<br/>rejectionReason = ? 
            DB-->>TimeSvc: Updated
            
            TimeSvc->>TaskSvc: revertTaskHours(taskId, -4.5)
            TaskSvc->>DB: UPDATE tasks<br/>SET actualHours = actualHours - 4.5
            
            TimeSvc-->>TimeCtrl: Rejected
            
            TimeCtrl->>NotifSvc: notifyTimeRejected(timeEntry, reason)
            NotifSvc->>Employee: 🔔 "Votre temps a été rejeté:<br/>Durée excessive"
            
            TimeCtrl-->>UI: 200 OK
            UI-->>Manager: ✅ "Temps rejeté"
        end
    end