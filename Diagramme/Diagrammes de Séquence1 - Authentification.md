```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Utilisateur
    participant UI as 🖥️ Interface Web
    participant AuthCtrl as 🎮 AuthController
    participant AuthSvc as 🔐 AuthService
    participant TokenSvc as 🎫 TokenService
    participant UserRepo as 💾 UserRepository
    participant DB as 🗄️ Base de Données
    participant SessionMgr as 📝 SessionManager
    participant Logger as 📋 AuditLogger

    rect rgb(240, 248, 255)
        Note over User,Logger: Phase 1 : Affichage du formulaire
        User->>+UI: Accéder à la page de connexion
        UI->>UI: Afficher formulaire login
        UI-->>-User: Formulaire affiché
    end

    rect rgb(255, 250, 240)
        Note over User,Logger: Phase 2 : Soumission des credentials
        User->>+UI: Saisir email + password
        User->>UI: Cliquer "Connexion"
        UI->>UI: Valider format email
        UI->>+AuthCtrl: POST /api/auth/login<br/>{email, password}
    end

    rect rgb(240, 255, 240)
        Note over AuthCtrl,Logger: Phase 3 : Vérification des identifiants
        AuthCtrl->>+AuthSvc: authenticate(email, password)
        AuthSvc->>+UserRepo: findByEmail(email)
        UserRepo->>+DB: SELECT * FROM users<br/>WHERE email = ?
        
        alt Utilisateur trouvé
            DB-->>-UserRepo: userData
            UserRepo-->>-AuthSvc: User object
            
            AuthSvc->>AuthSvc: verifyPassword(password, userData.passwordHash)
            
            alt Mot de passe valide
                AuthSvc->>AuthSvc: checkAccountStatus(user)
                
                alt Compte actif
                    rect rgb(230, 255, 230)
                        Note over AuthSvc,SessionMgr: Phase 4 : Création de session
                        AuthSvc->>+TokenSvc: generateAccessToken(user)
                        TokenSvc->>TokenSvc: createJWT(userId, role, expiresIn: 1h)
                        TokenSvc-->>-AuthSvc: accessToken
                        
                        AuthSvc->>+TokenSvc: generateRefreshToken(user)
                        TokenSvc->>TokenSvc: createJWT(userId, expiresIn: 30d)
                        TokenSvc-->>-AuthSvc: refreshToken
                        
                        AuthSvc->>+SessionMgr: createSession(userId, accessToken)
                        SessionMgr->>DB: INSERT INTO sessions<br/>(userId, token, expiresAt)
                        DB-->>SessionMgr: sessionId
                        SessionMgr-->>-AuthSvc: session created
                        
                        AuthSvc->>UserRepo: updateLastLogin(userId)
                        UserRepo->>DB: UPDATE users<br/>SET lastLoginAt = NOW()
                    end
                    
                    AuthSvc->>+Logger: logSuccessfulLogin(userId, ipAddress)
                    Logger->>DB: INSERT INTO audit_logs
                    Logger-->>-AuthSvc: logged
                    
                    AuthSvc-->>-AuthCtrl: {success: true, accessToken,<br/>refreshToken, user: {id, email,<br/>firstName, lastName, role}}
                    
                    AuthCtrl-->>-UI: 200 OK + tokens + user data
                    UI->>UI: Stocker tokens (localStorage)
                    UI->>UI: Rediriger vers /dashboard
                    UI-->>-User: ✅ Connexion réussie<br/>Affichage Dashboard
                    
                else Compte inactif
                    AuthSvc->>Logger: logFailedLogin(email, "ACCOUNT_INACTIVE")
                    AuthSvc-->>AuthCtrl: {success: false,<br/>error: "ACCOUNT_INACTIVE"}
                    AuthCtrl-->>UI: 403 Forbidden
                    UI-->>User: ❌ "Compte désactivé"
                end
                
            else Mot de passe invalide
                AuthSvc->>Logger: logFailedLogin(email, "INVALID_PASSWORD")
                AuthSvc-->>AuthCtrl: {success: false,<br/>error: "INVALID_CREDENTIALS"}
                AuthCtrl-->>UI: 401 Unauthorized
                UI-->>User: ❌ "Email ou mot de passe incorrect"
            end
            
        else Utilisateur non trouvé
            UserRepo-->>AuthSvc: null
            AuthSvc->>Logger: logFailedLogin(email, "USER_NOT_FOUND")
            AuthSvc-->>AuthCtrl: {success: false,<br/>error: "INVALID_CREDENTIALS"}
            AuthCtrl-->>UI: 401 Unauthorized
            UI-->>User: ❌ "Email ou mot de passe incorrect"
        end
    end

    rect rgb(255, 240, 245)
        Note over User,Logger: Phase 5 : Gestion des erreurs réseau
        opt Erreur serveur
            DB--XAuthSvc: Connection timeout
            AuthSvc-->>AuthCtrl: {success: false,<br/>error: "SERVER_ERROR"}
            AuthCtrl-->>UI: 500 Internal Server Error
            UI-->>User: ❌ "Erreur serveur, réessayez"
        end
    end