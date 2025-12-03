```mermaid
classDiagram
    %% ==========================================
    %% AUTHENTIFICATION ET UTILISATEURS
    %% ==========================================
    
    class User {
        -int id
        -string email
        -string passwordHash
        -string firstName
        -string lastName
        -string phone
        -string avatarUrl
        -Role role
        -int teamId
        -boolean isActive
        -DateTime createdAt
        -DateTime updatedAt
        -DateTime lastLoginAt
        +login(email, password) AuthResponse
        +logout() boolean
        +updateProfile(data) boolean
        +changePassword(oldPass, newPass) boolean
        +resetPassword(email) void
        +hasPermission(permission) boolean
        +getAssignedProjects() List~Project~
        +getTotalHoursMonth() float
    }

    class Role {
        <<enumeration>>
        ADMIN
        MANAGER
        EMPLOYEE
    }

    class Permission {
        -int id
        -string code
        -string name
        -string description
        -PermissionCategory category
        +check(userId, resource, action) boolean
    }

    class PermissionCategory {
        <<enumeration>>
        USERS
        CLIENTS
        PROJECTS
        TASKS
        TIME_ENTRIES
        REPORTS
        SETTINGS
    }

    class RolePermission {
        -int id
        -Role role
        -int permissionId
        -boolean isGranted
    }

    class Team {
        -int id
        -string name
        -string description
        -int leaderId
        -boolean isActive
        -DateTime createdAt
        +create(data) Team
        +addMember(userId) boolean
        +removeMember(userId) boolean
        +getMembers() List~User~
        +getProjects() List~Project~
    }

    %% ==========================================
    %% CLIENTS ET CONTRATS
    %% ==========================================
    
    class Client {
        -int id
        -string name
        -string description
        -string address
        -string city
        -string postalCode
        -string country
        -string phone
        -string email
        -string siret
        -string website
        -string logoUrl
        -ClientStatus status
        -DateTime createdAt
        -DateTime updatedAt
        -int createdById
        +create(data) Client
        +update(data) boolean
        +archive() boolean
        +getProjects() List~Project~
        +getContracts() List~Contract~
        +getTotalHours() float
        +getTotalRevenue() float
    }

    class ClientStatus {
        <<enumeration>>
        PROSPECT
        ACTIVE
        INACTIVE
        ARCHIVED
    }

    class Contract {
        -int id
        -int clientId
        -string reference
        -string title
        -Date startDate
        -Date endDate
        -float totalHours
        -float hourlyRate
        -float totalAmount
        -ContractType contractType
        -string terms
        -DateTime createdAt
        +create(data) Contract
        +update(data) boolean
        +getConsumedHours() float
        +getRemainingBudget() float
        +isExpired() boolean
    }

    class ContractType {
        <<enumeration>>
        FIXED_PRICE
        TIME_AND_MATERIALS
        RETAINER
        SUPPORT
    }

    %% ==========================================
    %% PROJETS
    %% ==========================================
    
    class Project {
        -int id
        -string name
        -string code
        -string description
        -int clientId
        -int contractId
        -int managerId
        -Date startDate
        -Date endDate
        -float budgetHours
        -float budgetAmount
        -ProjectStatus status
        -ProjectPriority priority
        -string color
        -float completionRate
        -DateTime createdAt
        -DateTime updatedAt
        +create(data) Project
        +update(data) boolean
        +archive() boolean
        +getTasks() List~Task~
        +assignUsers(userIds) boolean
        +calculateProgress() float
        +getTotalHours() float
        +isOverBudget() boolean
        +sendBudgetAlert() void
    }

    class ProjectStatus {
        <<enumeration>>
        DRAFT
        PLANNED
        IN_PROGRESS
        ON_HOLD
        COMPLETED
        CANCELLED
        ARCHIVED
    }

    class ProjectPriority {
        <<enumeration>>
        LOW
        NORMAL
        HIGH
        CRITICAL
    }

    class ProjectAssignment {
        -int id
        -int projectId
        -int userId
        -AssignmentRole assignmentRole
        -float allocatedHours
        -Date assignedDate
        -Date unassignedDate
        -boolean isActive
        +assign() boolean
        +unassign() boolean
        +updateAllocation(hours) boolean
    }

    class AssignmentRole {
        <<enumeration>>
        PROJECT_MANAGER
        TEAM_LEAD
        DEVELOPER
        DESIGNER
        TESTER
        OBSERVER
    }

    class ProjectBudgetAlert {
        -int id
        -int projectId
        -float thresholdPercentage
        -boolean isTriggered
        -DateTime triggeredAt
        -List~int~ notifiedUserIds
        +check() boolean
        +notify() void
    }

    %% ==========================================
    %% TÂCHES
    %% ==========================================
    
    class Task {
        -int id
        -string title
        -string description
        -int projectId
        -int assignedToId
        -int createdById
        -TaskStatus status
        -Priority priority
        -Date dueDate
        -float estimatedHours
        -float actualHours
        -int parentTaskId
        -int orderIndex
        -float completionRate
        -DateTime createdAt
        -DateTime updatedAt
        +create(data) Task
        +update(data) boolean
        +delete() boolean
        +changeStatus(newStatus) boolean
        +assignTo(userId) boolean
        +logTime(hours) TimeEntry
        +getProgress() float
        +isOverdue() boolean
        +getSubTasks() List~Task~
        +addAttachment(file) Attachment
        +addTag(tagId) boolean
    }

    class TaskStatus {
        <<enumeration>>
        BACKLOG
        TODO
        IN_PROGRESS
        IN_REVIEW
        BLOCKED
        DONE
        CANCELLED
    }

    class Priority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        URGENT
    }

    class TaskComment {
        -int id
        -int taskId
        -int userId
        -string content
        -int parentCommentId
        -DateTime createdAt
        -DateTime updatedAt
        +create(taskId, content) TaskComment
        +update(content) boolean
        +delete() boolean
        +reply(content) TaskComment
    }

    class TaskAttachment {
        -int id
        -int taskId
        -int uploadedById
        -string fileName
        -string fileUrl
        -string fileType
        -long fileSize
        -DateTime uploadedAt
        +upload(file) TaskAttachment
        +download() File
        +delete() boolean
    }

    class Tag {
        -int id
        -string name
        -string color
        -TagCategory category
        +create(data) Tag
        +update(data) boolean
        +getTasks() List~Task~
    }

    class TagCategory {
        <<enumeration>>
        FEATURE
        BUG
        IMPROVEMENT
        DOCUMENTATION
        TECHNICAL_DEBT
    }

    class TaskTag {
        -int id
        -int taskId
        -int tagId
        -DateTime addedAt
    }

    %% ==========================================
    %% GESTION DU TEMPS
    %% ==========================================
    
    class TimeEntry {
        -int id
        -int userId
        -int taskId
        -Date date
        -Time startTime
        -Time endTime
        -float hours
        -string description
        -boolean isBillable
        -TimeEntryStatus status
        -int validatedById
        -DateTime validatedAt
        -string rejectionReason
        -DateTime createdAt
        -DateTime updatedAt
        +create(data) TimeEntry
        +update(data) boolean
        +delete() boolean
        +submit() boolean
        +validate(validatorId) boolean
        +reject(validatorId, reason) boolean
        +calculateHours() float
    }

    class TimeEntryStatus {
        <<enumeration>>
        DRAFT
        SUBMITTED
        VALIDATED
        REJECTED
        INVOICED
    }

    class TimeSheet {
        -int id
        -int userId
        -Date weekStart
        -Date weekEnd
        -float totalHours
        -TimeSheetStatus status
        -DateTime submittedAt
        -DateTime validatedAt
        +generate(userId, week) TimeSheet
        +getEntries() List~TimeEntry~
        +submit() boolean
        +validate() boolean
        +reject(reason) boolean
        +export() File
    }

    class TimeSheetStatus {
        <<enumeration>>
        DRAFT
        SUBMITTED
        VALIDATED
        REJECTED
    }

    %% ==========================================
    %% ABSENCES ET CONGÉS
    %% ==========================================
    
    class Absence {
        -int id
        -int userId
        -AbsenceType absenceType
        -Date startDate
        -Date endDate
        -float totalDays
        -string reason
        -AbsenceStatus status
        -int approvedById
        -DateTime approvedAt
        -DateTime createdAt
        +create(data) Absence
        +submit() boolean
        +approve(approverId) boolean
        +reject(approverId, reason) boolean
        +cancel() boolean
    }

    class AbsenceType {
        <<enumeration>>
        PAID_LEAVE
        SICK_LEAVE
        UNPAID_LEAVE
        REMOTE_WORK
        BUSINESS_TRIP
        TRAINING
        OTHER
    }

    class AbsenceStatus {
        <<enumeration>>
        PENDING
        APPROVED
        REJECTED
        CANCELLED
    }

    %% ==========================================
    %% CALENDRIER
    %% ==========================================
    
    class Calendar {
        -int id
        -int userId
        -string name
        -string color
        -boolean isDefault
        -boolean isShared
        +getEvents(startDate, endDate) List~CalendarEvent~
        +addEvent(event) CalendarEvent
        +updateEvent(eventId, data) boolean
        +deleteEvent(eventId) boolean
        +shareWith(userIds) boolean
    }

    class CalendarEvent {
        -int id
        -int calendarId
        -string title
        -string description
        -DateTime startDateTime
        -DateTime endDateTime
        -boolean isAllDay
        -EventType eventType
        -int relatedTaskId
        -int relatedProjectId
        -int relatedAbsenceId
        -string color
        -string location
        -boolean hasReminder
        -int reminderMinutes
        -EventRecurrence recurrence
        -DateTime createdAt
        +create(data) CalendarEvent
        +update(data) boolean
        +delete() boolean
        +addReminder(minutes) boolean
        +getConflicts() List~CalendarEvent~
    }

    class EventType {
        <<enumeration>>
        TASK
        MEETING
        DEADLINE
        ABSENCE
        HOLIDAY
        REMINDER
        MILESTONE
        OTHER
    }

    class EventRecurrence {
        <<enumeration>>
        NONE
        DAILY
        WEEKLY
        MONTHLY
        YEARLY
    }

    %% ==========================================
    %% TABLEAU DE BORD
    %% ==========================================
    
    class Dashboard {
        -int id
        -int userId
        -string layout
        -List~Widget~ widgets
        -DateTime updatedAt
        +getStats() DashboardStats
        +getCharts() List~ChartData~
        +getRecentActivities() List~Activity~
        +addWidget(widget) boolean
        +removeWidget(widgetId) boolean
        +customizeLayout(layout) boolean
    }

    class DashboardStats {
        -int totalProjects
        -int activeProjects
        -int totalTasks
        -int completedTasks
        -int myTasks
        -int overdueTasksCount
        -float hoursToday
        -float hoursThisWeek
        -float hoursThisMonth
        -float utilizationRate
        +calculate(userId) DashboardStats
        +compareWithPrevious() DashboardComparison
    }

    class Widget {
        -int id
        -string type
        -string title
        -int position
        -JSON config
        +render() WidgetData
    }

    class Activity {
        -int id
        -int userId
        -ActivityType activityType
        -string description
        -string entityType
        -int entityId
        -JSON metadata
        -DateTime createdAt
        +log(userId, type, description) Activity
        +getRecent(userId, limit) List~Activity~
        +getByEntity(entityType, entityId) List~Activity~
    }

    class ActivityType {
        <<enumeration>>
        USER_LOGIN
        USER_LOGOUT
        TASK_CREATED
        TASK_UPDATED
        TASK_COMPLETED
        TIME_LOGGED
        TIME_VALIDATED
        PROJECT_CREATED
        PROJECT_UPDATED
        COMMENT_ADDED
        FILE_UPLOADED
        ABSENCE_REQUESTED
    }

    %% ==========================================
    %% RAPPORTS ET ANALYSES
    %% ==========================================
    
    class Report {
        -int id
        -string title
        -ReportType reportType
        -int generatedById
        -Date startDate
        -Date endDate
        -JSON filters
        -JSON data
        -string fileUrl
        -ReportStatus status
        -DateTime createdAt
        -DateTime scheduledFor
        +generate(params) Report
        +export(format) string
        +schedule(frequency, recipients) boolean
        +share(userIds) boolean
        +delete() boolean
    }

    class ReportType {
        <<enumeration>>
        TIME_TRACKING
        PROJECT_SUMMARY
        USER_PRODUCTIVITY
        CLIENT_HOURS
        TASK_COMPLETION
        BUDGET_ANALYSIS
        TEAM_PERFORMANCE
        ABSENCE_REPORT
        INVOICE_PREVIEW
        CUSTOM
    }

    class ReportStatus {
        <<enumeration>>
        GENERATING
        COMPLETED
        FAILED
        SCHEDULED
    }

    class ReportSchedule {
        -int id
        -int reportId
        -Frequency frequency
        -List~int~ recipientIds
        -DateTime nextRunAt
        -boolean isActive
        +create(data) ReportSchedule
        +execute() void
        +pause() boolean
        +resume() boolean
    }

    class Frequency {
        <<enumeration>>
        DAILY
        WEEKLY
        MONTHLY
        QUARTERLY
        YEARLY
    }

    class ExportFormat {
        <<enumeration>>
        PDF
        EXCEL
        CSV
        JSON
    }

    %% ==========================================
    %% FACTURATION
    %% ==========================================
    
    class Invoice {
        -int id
        -string invoiceNumber
        -int clientId
        -int projectId
        -Date issueDate
        -Date dueDate
        -float subtotal
        -float taxRate
        -float taxAmount
        -float totalAmount
        -InvoiceStatus status
        -string fileUrl
        -DateTime paidAt
        -DateTime createdAt
        +generate(projectId, period) Invoice
        +addLineItem(item) boolean
        +calculateTotal() float
        +send() boolean
        +markAsPaid() boolean
        +export() File
    }

    class InvoiceStatus {
        <<enumeration>>
        DRAFT
        SENT
        PAID
        OVERDUE
        CANCELLED
    }

    class InvoiceLineItem {
        -int id
        -int invoiceId
        -string description
        -float quantity
        -float unitPrice
        -float amount
        +calculate() float
    }

    %% ==========================================
    %% PROFIL ET PARAMÈTRES
    %% ==========================================
    
    class Profile {
        -int id
        -int userId
        -string bio
        -string position
        -string department
        -string skills
        -Date birthDate
        -Date hireDate
        -float hourlyRate
        -string timezone
        -JSON socialLinks
        +update(data) boolean
        +uploadAvatar(file) string
        +getCompletionRate() float
    }

    class Settings {
        -int id
        -int userId
        -Theme theme
        -string language
        -string dateFormat
        -string timeFormat
        -string timezone
        -int workHoursPerDay
        -Time workStartTime
        -Time workEndTime
        -boolean emailNotifications
        -boolean pushNotifications
        -boolean desktopNotifications
        -JSON notificationPreferences
        -DateTime updatedAt
        +update(data) boolean
        +resetToDefault() boolean
        +exportSettings() JSON
        +importSettings(json) boolean
    }

    class Theme {
        <<enumeration>>
        LIGHT
        DARK
        AUTO
        HIGH_CONTRAST
    }

    class NotificationPreference {
        -int id
        -int settingsId
        -NotificationType notificationType
        -boolean email
        -boolean push
        -boolean desktop
        -boolean sms
    }

    class NotificationType {
        <<enumeration>>
        TASK_ASSIGNED
        TASK_DUE_SOON
        TASK_OVERDUE
        TASK_COMPLETED
        TIME_VALIDATED
        TIME_REJECTED
        PROJECT_UPDATED
        COMMENT_MENTION
        ABSENCE_APPROVED
        ABSENCE_REJECTED
        BUDGET_ALERT
        DEADLINE_APPROACHING
    }

    %% ==========================================
    %% NOTIFICATIONS
    %% ==========================================
    
    class Notification {
        -int id
        -int userId
        -string title
        -string message
        -NotificationType notificationType
        -string link
        -boolean isRead
        -Priority priority
        -DateTime createdAt
        -DateTime readAt
        -DateTime expiresAt
        +create(userId, data) Notification
        +markAsRead() boolean
        +markAllAsRead(userId) boolean
        +delete() boolean
        +getUnreadCount(userId) int
    }

    %% ==========================================
    %% AUDIT ET LOGS
    %% ==========================================
    
    class AuditLog {
        -int id
        -int userId
        -string action
        -string entityType
        -int entityId
        -JSON oldValue
        -JSON newValue
        -string ipAddress
        -string userAgent
        -DateTime createdAt
        +log(data) AuditLog
        +getByEntity(type, id) List~AuditLog~
        +getByUser(userId) List~AuditLog~
    }

    %% ==========================================
    %% PAGES LÉGALES
    %% ==========================================
    
    class LegalPage {
        -int id
        -LegalPageType pageType
        -string title
        -string content
        -string version
        -DateTime effectiveDate
        -DateTime updatedAt
        -int updatedById
        +getLatest(pageType) LegalPage
        +create(data) LegalPage
        +update(data) boolean
        +getVersionHistory() List~LegalPage~
    }

    class LegalPageType {
        <<enumeration>>
        TERMS_OF_SERVICE
        PRIVACY_POLICY
        LEGAL_NOTICE
        COOKIE_POLICY
        GDPR_COMPLIANCE
    }

    %% ==========================================
    %% RELATIONS PRINCIPALES
    %% ==========================================
    
    %% User Relations
    User "1" --> "1" Role
    User "0..1" --> "1" Team
    User "1" --> "1" Profile
    User "1" --> "1" Settings
    User "1" --> "1" Calendar
    User "1" --> "1" Dashboard
    User "1" --> "0. .*" Notification
    User "1" --> "0..*" Activity
    User "1" --> "0..*" TimeEntry
    User "1" --> "0..*" TimeSheet
    User "1" --> "0..*" Absence
    User "1" --> "0..*" Task : assignedTasks
    User "1" --> "0..*" Report : generatedReports
    User "1" --> "0..*" Client : created
    User "1" --> "0..*" Project : manages
    User "1" --> "0..*" ProjectAssignment
    
    %% Permission Relations
    Role "1" --> "0..*" RolePermission
    Permission "1" --> "0..*" RolePermission
    Permission "1" --> "1" PermissionCategory
    
    %% Team Relations
    Team "1" --> "1" User : leader
    Team "1" --> "0..*" User : members
    
    %% Client Relations
    Client "1" --> "1" ClientStatus
    Client "1" --> "0..*" Project
    Client "1" --> "0..*" Contract
    Client "1" --> "0..*" Invoice
    
    %% Contract Relations
    Contract "1" --> "1" Client
    Contract "1" --> "1" ContractType
    Contract "1" --> "0..*" Project
    
    %% Project Relations
    Project "1" --> "1" Client
    Project "0.. 1" --> "1" Contract
    Project "1" --> "1" User : manager
    Project "1" --> "1" ProjectStatus
    Project "1" --> "1" ProjectPriority
    Project "1" --> "0..*" Task
    Project "1" --> "0..*" ProjectAssignment
    Project "1" --> "0..*" ProjectBudgetAlert
    Project "1" --> "0..*" Invoice
    
    %% ProjectAssignment Relations
    ProjectAssignment "1" --> "1" Project
    ProjectAssignment "1" --> "1" User
    ProjectAssignment "1" --> "1" AssignmentRole
    
    %% Task Relations
    Task "1" --> "1" Project
    Task "1" --> "1" User : assignedTo
    Task "1" --> "1" User : createdBy
    Task "1" --> "1" TaskStatus
    Task "1" --> "1" Priority
    Task "0..1" --> "1" Task : parentTask
    Task "1" --> "0..*" Task : subTasks
    Task "1" --> "0..*" TimeEntry
    Task "1" --> "0..*" TaskComment
    Task "1" --> "0..*" TaskAttachment
    Task "1" --> "0..*" TaskTag
    
    %% Tag Relations
    Tag "1" --> "1" TagCategory
    Tag "1" --> "0..*" TaskTag
    TaskTag "1" --> "1" Task
    TaskTag "1" --> "1" Tag
    
    %% TaskAttachment Relations
    TaskAttachment "1" --> "1" Task
    TaskAttachment "1" --> "1" User : uploadedBy
    
    %% TaskComment Relations
    TaskComment "1" --> "1" Task
    TaskComment "1" --> "1" User : author
    TaskComment "0..1" --> "1" TaskComment : parentComment
    
    %% TimeEntry Relations
    TimeEntry "1" --> "1" User
    TimeEntry "1" --> "1" Task
    TimeEntry "1" --> "1" TimeEntryStatus
    TimeEntry "0..1" --> "1" User : validator
    
    %% TimeSheet Relations
    TimeSheet "1" --> "1" User
    TimeSheet "1" --> "1" TimeSheetStatus
    TimeSheet "1" --> "0..*" TimeEntry
    
    %% Absence Relations
    Absence "1" --> "1" User
    Absence "1" --> "1" AbsenceType
    Absence "1" --> "1" AbsenceStatus
    Absence "0..1" --> "1" User : approver
    
    %% Calendar Relations
    Calendar "1" --> "1" User
    Calendar "1" --> "0..*" CalendarEvent
    
    CalendarEvent "1" --> "1" Calendar
    CalendarEvent "1" --> "1" EventType
    CalendarEvent "1" --> "1" EventRecurrence
    CalendarEvent "0..1" --> "1" Task
    CalendarEvent "0..1" --> "1" Project
    CalendarEvent "0.. 1" --> "1" Absence
    
    %% Dashboard Relations
    Dashboard "1" --> "1" User
    Dashboard "1" --> "1" DashboardStats
    Dashboard "1" --> "0..*" Widget
    
    %% Activity Relations
    Activity "1" --> "1" User
    Activity "1" --> "1" ActivityType
    
    %% Report Relations
    Report "1" --> "1" User : generator
    Report "1" --> "1" ReportType
    Report "1" --> "1" ReportStatus
    Report "0..1" --> "1" ReportSchedule
    
    ReportSchedule "1" --> "1" Report
    ReportSchedule "1" --> "1" Frequency
    
    %% Invoice Relations
    Invoice "1" --> "1" Client
    Invoice "0..1" --> "1" Project
    Invoice "1" --> "1" InvoiceStatus
    Invoice "1" --> "0..*" InvoiceLineItem
    
    InvoiceLineItem "1" --> "1" Invoice
    
    %% Settings Relations
    Settings "1" --> "1" User
    Settings "1" --> "1" Theme
    Settings "1" --> "0..*" NotificationPreference
    
    NotificationPreference "1" --> "1" Settings
    NotificationPreference "1" --> "1" NotificationType
    
    %% Notification Relations
    Notification "1" --> "1" User
    Notification "1" --> "1" NotificationType
    Notification "1" --> "1" Priority
    
    %% Profile Relations
    Profile "1" --> "1" User
    
    %% AuditLog Relations
    AuditLog "1" --> "1" User
    
    %% LegalPage Relations
    LegalPage "1" --> "1" LegalPageType
    LegalPage "1" --> "1" User : updatedBy