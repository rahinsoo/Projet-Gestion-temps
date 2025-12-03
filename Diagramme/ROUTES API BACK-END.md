```mermaid
graph LR
    subgraph API["🔌 API REST - ROUTES COMPLÈTES"]
        
        subgraph Auth["🔐 Authentification"]
            A1["POST /api/auth/login"]
            A2["POST /api/auth/logout"]
            A3["POST /api/auth/refresh"]
            A4["POST /api/auth/forgot-password"]
            A5["POST /api/auth/reset-password"]
            A6["GET /api/auth/me"]
            A7["POST /api/auth/change-password"]
        end
        
        subgraph Users["👥 Utilisateurs"]
            U1["GET /api/users"]
            U2["GET /api/users/:id"]
            U3["POST /api/users"]
            U4["PUT /api/users/:id"]
            U5["DELETE /api/users/:id"]
            U6["GET /api/users/:id/projects"]
            U7["GET /api/users/:id/tasks"]
            U8["GET /api/users/:id/time-entries"]
            U9["PUT /api/users/:id/role"]
            U10["GET /api/users/:id/stats"]
        end
        
        subgraph Teams["🏆 Équipes"]
            T1["GET /api/teams"]
            T2["GET /api/teams/:id"]
            T3["POST /api/teams"]
            T4["PUT /api/teams/:id"]
            T5["DELETE /api/teams/:id"]
            T6["POST /api/teams/:id/members"]
            T7["DELETE /api/teams/:id/members/:userId"]
            T8["GET /api/teams/:id/projects"]
        end
        
        subgraph Clients["🏢 Clients"]
            C1["GET /api/clients"]
            C2["GET /api/clients/:id"]
            C3["POST /api/clients"]
            C4["PUT /api/clients/:id"]
            C5["DELETE /api/clients/:id"]
            C6["GET /api/clients/:id/projects"]
            C7["GET /api/clients/:id/contracts"]
            C8["GET /api/clients/:id/invoices"]
            C9["GET /api/clients/:id/stats"]
        end
        
        subgraph Contracts["📜 Contrats"]
            CO1["GET /api/contracts"]
            CO2["GET /api/contracts/:id"]
            CO3["POST /api/contracts"]
            CO4["PUT /api/contracts/:id"]
            CO5["DELETE /api/contracts/:id"]
            CO6["GET /api/contracts/:id/consumption"]
        end
        
        subgraph Projects["📁 Projets"]
            P1["GET /api/projects"]
            P2["GET /api/projects/:id"]
            P3["POST /api/projects"]
            P4["PUT /api/projects/:id"]
            P5["DELETE /api/projects/:id"]
            P6["GET /api/projects/:id/tasks"]
            P7["POST /api/projects/:id/tasks"]
            P8["GET /api/projects/:id/members"]
            P9["POST /api/projects/:id/members"]
            P10["DELETE /api/projects/:id/members/:userId"]
            P11["GET /api/projects/:id/stats"]
            P12["GET /api/projects/:id/budget"]
            P13["POST /api/projects/:id/budget/alerts"]
            P14["GET /api/projects/:id/timeline"]
        end
        
        subgraph Tasks["✅ Tâches"]
            TA1["GET /api/tasks"]
            TA2["GET /api/tasks/:id"]
            TA3["POST /api/tasks"]
            TA4["PUT /api/tasks/:id"]
            TA5["DELETE /api/tasks/:id"]
            TA6["PATCH /api/tasks/:id/status"]
            TA7["PATCH /api/tasks/:id/assign"]
            TA8["GET /api/tasks/:id/comments"]
            TA9["POST /api/tasks/:id/comments"]
            TA10["GET /api/tasks/:id/attachments"]
            TA11["POST /api/tasks/:id/attachments"]
            TA12["DELETE /api/tasks/:id/attachments/:attachmentId"]
            TA13["POST /api/tasks/:id/tags"]
            TA14["DELETE /api/tasks/:id/tags/:tagId"]
            TA15["GET /api/tasks/:id/subtasks"]
            TA16["POST /api/tasks/:id/subtasks"]
        end
        
        subgraph Tags["🏷️ Tags"]
            TG1["GET /api/tags"]
            TG2["POST /api/tags"]
            TG3["PUT /api/tags/:id"]
            TG4["DELETE /api/tags/:id"]
        end
        
        subgraph TimeEntries["⏱️ Temps"]
            TE1["GET /api/time-entries"]
            TE2["GET /api/time-entries/:id"]
            TE3["POST /api/time-entries"]
            TE4["PUT /api/time-entries/:id"]
            TE5["DELETE /api/time-entries/:id"]
            TE6["PATCH /api/time-entries/:id/submit"]
            TE7["PATCH /api/time-entries/:id/validate"]
            TE8["PATCH /api/time-entries/:id/reject"]
            TE9["GET /api/time-entries/pending"]
            TE10["POST /api/time-entries/bulk"]
            TE11["GET /api/time-entries/export"]
        end
        
        subgraph TimeSheets["📋 Feuilles de Temps"]
            TS1["GET /api/timesheets"]
            TS2["GET /api/timesheets/:id"]
            TS3["POST /api/timesheets"]
            TS4["PATCH /api/timesheets/:id/submit"]
            TS5["PATCH /api/timesheets/:id/validate"]
            TS6["GET /api/timesheets/:id/export"]
        end
        
        subgraph Absences["🏖️ Absences"]
            AB1["GET /api/absences"]
            AB2["GET /api/absences/:id"]
            AB3["POST /api/absences"]
            AB4["PUT /api/absences/:id"]
            AB5["DELETE /api/absences/:id"]
            AB6["PATCH /api/absences/:id/approve"]
            AB7["PATCH /api/absences/:id/reject"]
            AB8["GET /api/absences/pending"]
            AB9["GET /api/absences/calendar"]
        end
        
        subgraph Calendar["📅 Calendrier"]
            CA1["GET /api/calendar/events"]
            CA2["GET /api/calendar/events/:id"]
            CA3["POST /api/calendar/events"]
            CA4["PUT /api/calendar/events/:id"]
            CA5["DELETE /api/calendar/events/:id"]
            CA6["GET /api/calendar/week"]
            CA7["GET /api/calendar/month"]
            CA8["POST /api/calendar/share"]
        end
        
        subgraph Dashboard["📊 Tableau de Bord"]
            D1["GET /api/dashboard"]
            D2["GET /api/dashboard/stats"]
            D3["GET /api/dashboard/charts"]
            D4["GET /api/dashboard/activities"]
            D5["PUT /api/dashboard/layout"]
            D6["POST /api/dashboard/widgets"]
            D7["DELETE /api/dashboard/widgets/:id"]
        end
        
        subgraph Reports["📈 Rapports"]
            R1["GET /api/reports"]
            R2["GET /api/reports/:id"]
            R3["POST /api/reports/generate"]
            R4["POST /api/reports/:id/export"]
            R5["POST /api/reports/:id/share"]
            R6["POST /api/reports/schedule"]
            R7["GET /api/reports/scheduled"]
            R8["DELETE /api/reports/:id"]
        end
        
        subgraph Invoices["💰 Factures"]
            I1["GET /api/invoices"]
            I2["GET /api/invoices/:id"]
            I3["POST /api/invoices"]
            I4["PUT /api/invoices/:id"]
            I5["DELETE /api/invoices/:id"]
            I6["PATCH /api/invoices/:id/send"]
            I7["PATCH /api/invoices/:id/paid"]
            I8["GET /api/invoices/:id/export"]
        end
        
        subgraph Notifications["🔔 Notifications"]
            N1["GET /api/notifications"]
            N2["PATCH /api/notifications/:id/read"]
            N3["PATCH /api/notifications/read-all"]
            N4["DELETE /api/notifications/:id"]
            N5["GET /api/notifications/unread-count"]
        end
        
        subgraph Profile["👤 Profil"]
            PR1["GET /api/profile"]
            PR2["PUT /api/profile"]
            PR3["POST /api/profile/avatar"]
            PR4["GET /api/profile/activity"]
        end
        
        subgraph Settings["⚙️ Paramètres"]
            S1["GET /api/settings"]
            S2["PUT /api/settings"]
            S3["POST /api/settings/reset"]
            S4["GET /api/settings/preferences"]
            S5["PUT /api/settings/preferences"]
        end
        
        subgraph Admin["🔧 Administration"]
            AD1["GET /api/admin/users"]
            AD2["POST /api/admin/users/:id/activate"]
            AD3["POST /api/admin/users/:id/deactivate"]
            AD4["GET /api/admin/roles"]
            AD5["PUT /api/admin/roles/:role/permissions"]
            AD6["GET /api/admin/audit-logs"]
            AD7["GET /api/admin/stats"]
            AD8["PUT /api/admin/settings"]
        end
        
        subgraph Legal["📄 Légal"]
            L1["GET /api/legal/terms"]
            L2["GET /api/legal/privacy"]
            L3["GET /api/legal/cookies"]
            L4["PUT /api/admin/legal/:type<br/>(Admin only)"]
        end
    end
    
    style Auth fill:#E74C3C
    style Users fill:#3498DB
    style Projects fill:#9B59B6
    style TimeEntries fill:#2ECC71
    style Reports fill:#E67E22
    style Admin fill:#34495E