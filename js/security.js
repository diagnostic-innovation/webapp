/**
 * Diagnostic Innovation v2.0 - Security Manager
 * Gestionnaire de sécurité pour la protection des données et de la méthode
 * (c) Valmen Consulting
 */

// ============================================================================
// GESTIONNAIRE DE SÉCURITÉ PRINCIPAL
// ============================================================================

class SecurityManager {
    constructor() {
        this.sessionKey = this.generateSessionKey();
        this.userData = new Map();
        this.startTime = Date.now();
        this.maxDuration = 20 * 60 * 1000; // 30 minutes
        this.isDestroyed = false;
        this.monitors = new Map();
        
        console.log('🔒 SecurityManager v2.0 initialisé');
        this.initializeSecurityMonitors();
    }

    // ========================================================================
    // GÉNÉRATION DE CLÉS SÉCURISÉES
    // ========================================================================

    generateSessionKey() {
        const components = [
            Date.now().toString(),
            Math.random().toString(36).substring(2),
            navigator.userAgent.substring(0, 50),
            window.location.host
        ];
        
        const combined = components.join('_');
        return CryptoJS.SHA256(combined).toString().substring(0, 32);
    }

    generateEncryptionKey(context = '') {
        const base = this.sessionKey + context + Date.now();
        return CryptoJS.SHA256(base).toString().substring(0, 32);
    }

    // ========================================================================
    // CHIFFREMENT / DÉCHIFFREMENT DES DONNÉES
    // ========================================================================

    encryptData(data, context = '') {
        if (this.isDestroyed) {
            throw new Error('Session sécurisée détruite');
        }

        try {
            const key = this.generateEncryptionKey(context);
            const serialized = JSON.stringify(data);
            
            // Envelope avec métadonnées de sécurité
            const envelope = {
                data: serialized,
                timestamp: Date.now(),
                checksum: CryptoJS.SHA256(serialized).toString(),
                context: context
            };

            return CryptoJS.AES.encrypt(JSON.stringify(envelope), key).toString();
        } catch (error) {
            console.error('❌ Erreur chiffrement:', error.message);
            return null;
        }
    }

    decryptData(encryptedData, context = '') {
        if (this.isDestroyed) {
            throw new Error('Session sécurisée détruite');
        }

        try {
            const key = this.generateEncryptionKey(context);
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedText) {
                throw new Error('Déchiffrement échoué');
            }
            
            const envelope = JSON.parse(decryptedText);
            
            // Vérification d'intégrité
            const calculatedChecksum = CryptoJS.SHA256(envelope.data).toString();
            if (calculatedChecksum !== envelope.checksum) {
                throw new Error('Intégrité des données compromise');
            }

            // Vérification de fraîcheur (24h max)
            const age = Date.now() - envelope.timestamp;
            if (age > 24 * 60 * 60 * 1000) {
                console.warn('⚠️ Données anciennes détectées');
            }

            return JSON.parse(envelope.data);
        } catch (error) {
            console.error('❌ Erreur déchiffrement:', error.message);
            return null;
        }
    }

    // ========================================================================
    // GESTION DES DONNÉES UTILISATEUR
    // ========================================================================

    storeUserData(key, data) {
        if (this.isDestroyed) {
            console.warn('⚠️ Tentative de stockage sur session détruite');
            return false;
        }

        const encrypted = this.encryptData(data, key);
        if (encrypted) {
            this.userData.set(key, {
                encrypted: encrypted,
                timestamp: Date.now(),
                accessCount: 0
            });

            console.log(`🔐 Données '${key}' stockées de manière sécurisée`);
            return true;
        }
        return false;
    }

    getUserData(key) {
        if (this.isDestroyed) {
            console.warn('⚠️ Tentative d\'accès sur session détruite');
            return null;
        }

        const stored = this.userData.get(key);
        if (!stored) return null;

        // Incrémenter le compteur d'accès
        stored.accessCount++;

        // Déchiffrement des données
        const decrypted = this.decryptData(stored.encrypted, key);
        
        if (decrypted) {
            console.log(`🔓 Accès sécurisé aux données '${key}' (${stored.accessCount}x)`);
        }

        return decrypted;
    }

    removeUserData(key) {
        const success = this.userData.delete(key);
        if (success) {
            console.log(`🗑️ Données '${key}' supprimées`);
        }
        return success;
    }

    // ========================================================================
    // GESTION DE SESSION TEMPORAIRE
    // ========================================================================

    isSessionValid() {
        if (this.isDestroyed) return false;
        
        const elapsed = Date.now() - this.startTime;
        const isValid = elapsed < this.maxDuration;
        
        if (!isValid) {
            console.warn('⏰ Session expirée');
            this.destroySession();
        }
        
        return isValid;
    }

    getSessionRemainingTime() {
        if (this.isDestroyed) return 0;
        
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.maxDuration - elapsed);
        return Math.floor(remaining / 1000); // en secondes
    }

    extendSession(additionalMinutes = 5) {
        if (this.isDestroyed) return false;
        
        this.maxDuration += additionalMinutes * 60 * 1000;
        console.log(`⏱️ Session étendue de ${additionalMinutes} minutes`);
        return true;
    }

    destroySession() {
        if (this.isDestroyed) return;

        console.log('🔥 Destruction sécurisée de la session...');
        
        // Effacement sécurisé des données
        this.userData.forEach((value, key) => {
            console.log(`   🗑️ Effacement: ${key}`);
        });
        this.userData.clear();
        
        // Arrêt des monitors
        this.monitors.forEach((monitor, name) => {
            if (monitor && typeof monitor.stop === 'function') {
                monitor.stop();
            }
        });
        this.monitors.clear();
        
        // Nullification des clés
        this.sessionKey = null;
        this.startTime = null;
        this.maxDuration = null;
        
        // Marquage comme détruit
        this.isDestroyed = true;
        
        // Nettoyage de la console
        try {
            console.clear();
        } catch (e) {
            // Silencieux si non autorisé
        }
        
        console.log('✅ Session sécurisée détruite');
    }

    // ========================================================================
    // MONITORING DE SÉCURITÉ
    // ========================================================================

    initializeSecurityMonitors() {
        // Monitor 1: Détection DevTools
        this.monitors.set('devtools', this.createDevToolsMonitor());
        
        // Monitor 2: Protection contre inspection
        this.monitors.set('inspection', this.createInspectionProtection());
        
        // Monitor 3: Session timeout automatique
        this.monitors.set('session', this.createSessionMonitor());
        
        // Monitor 4: Nettoyage automatique
        this.monitors.set('cleanup', this.createAutoCleanup());
    }

    createDevToolsMonitor() {
        let devToolsOpen = false;
        
        const detectDevTools = () => {
            const start = performance.now();
            console.log('%c🔍', 'color: transparent; font-size: 1px;');
            const duration = performance.now() - start;
            
            if (duration > 100) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    console.warn('%c⚠️ OUTILS DÉVELOPPEUR DÉTECTÉS', 'color: red; font-size: 16px; font-weight: bold');
                    console.warn('Données sensibles masquées pour votre sécurité');
                    this.logSecurityEvent('DEVTOOLS_DETECTED', { timestamp: Date.now() });
                }
            } else {
                devToolsOpen = false;
            }
        };

        const interval = setInterval(detectDevTools, 2000);
        
        return {
            stop: () => clearInterval(interval)
        };
    }

    createInspectionProtection() {
        // Désactivation du menu contextuel
        const handleContextMenu = (e) => {
            if (!this.isDestroyed) {
                e.preventDefault();
                this.showSecurityNotification('🔒 Menu contextuel désactivé pendant la session sécurisée');
                this.logSecurityEvent('RIGHT_CLICK_BLOCKED', {});
            }
        };

        // Désactivation des raccourcis de développement
        const handleKeyDown = (e) => {
            if (this.isDestroyed) return;

            const isDeveloperShortcut = 
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 's');

            if (isDeveloperShortcut) {
                e.preventDefault();
                this.showSecurityNotification('🔒 Raccourcis développeur bloqués');
                this.logSecurityEvent('SHORTCUT_BLOCKED', { key: e.key });
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return {
            stop: () => {
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    }

    createSessionMonitor() {
        const checkSession = () => {
            if (!this.isSessionValid()) {
                this.showSessionExpiredWarning();
            }
        };

        const interval = setInterval(checkSession, 60000); // Vérification chaque minute
        
        return {
            stop: () => clearInterval(interval)
        };
    }

    createAutoCleanup() {
        // Nettoyage à la fermeture de la page
        const handleBeforeUnload = () => {
            if (!this.isDestroyed) {
                this.destroySession();
            }
        };

        // Nettoyage en cas de perte de focus prolongée
        let focusLostTime = null;
        
        const handleBlur = () => {
            focusLostTime = Date.now();
        };

        const handleFocus = () => {
            if (focusLostTime) {
                const timeAway = Date.now() - focusLostTime;
                if (timeAway > 10 * 60 * 1000) { // 10 minutes
                    console.log('🔒 Session détruite après absence prolongée');
                    this.destroySession();
                }
                focusLostTime = null;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return {
            stop: () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('blur', handleBlur);
                window.removeEventListener('focus', handleFocus);
            }
        };
    }

    // ========================================================================
    // NOTIFICATIONS ET LOGS DE SÉCURITÉ
    // ========================================================================

    showSecurityNotification(message, type = 'info') {
        // Affichage d'une notification temporaire
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            font-size: 14px;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

	showSessionExpiredWarning() {
		// Message personnalisé avec alert() pour une "box" plus visible
    alert('Le délai est dépassé, il faut lancer un nouveau diagnostic');
    
		// Redémarrage immédiat après le clic sur OK
    if (typeof restartApplication === 'function') {
        restartApplication();
    } else {
        location.reload();
    }
}

    logSecurityEvent(event, details = {}) {
        const logEntry = {
            event: event,
            timestamp: new Date().toISOString(),
            details: details,
            session: this.generateSessionReport()
        };
        
        console.log(`🔒 Security Event: ${event}`, logEntry);
        
        // En production, on pourrait envoyer vers un service de monitoring
        // this.sendSecurityLog(logEntry);
    }

    // ========================================================================
    // UTILITAIRES
    // ========================================================================

    generateHash(data) {
        return CryptoJS.SHA256(JSON.stringify(data)).toString();
    }

    verifyIntegrity(data, expectedHash) {
        const actualHash = this.generateHash(data);
        return actualHash === expectedHash;
    }

    generateSessionReport() {
        if (this.isDestroyed) {
            return { status: 'DESTROYED' };
        }

        return {
            status: 'ACTIVE',
            sessionAge: Date.now() - this.startTime,
            remainingTime: this.getSessionRemainingTime(),
            dataKeys: Array.from(this.userData.keys()),
            securityLevel: 'HIGH',
            version: '2.0'
        };
    }

    // ========================================================================
    // MÉTHODES STATIQUES
    // ========================================================================

    static isSecuritySupported() {
        return !!(
            window.crypto && 
            window.CryptoJS &&
            typeof Storage !== 'undefined'
        );
    }

    static createSecureSession() {
        if (!SecurityManager.isSecuritySupported()) {
            throw new Error('Environnement non compatible avec les fonctions de sécurité');
        }
        return new SecurityManager();
    }
}

// ============================================================================
// VARIABLES GLOBALES SÉCURISÉES
// ============================================================================

// Instance globale du gestionnaire de sécurité
let globalSecurityManager = null;

// ============================================================================
// FONCTIONS UTILITAIRES GLOBALES
// ============================================================================

function initializeSecurity() {
    try {
        if (!SecurityManager.isSecuritySupported()) {
            console.error('❌ Fonctions de sécurité non supportées');
            return null;
        }

        globalSecurityManager = SecurityManager.createSecureSession();
        console.log('✅ Sécurité initialisée avec succès');
        return globalSecurityManager;
    } catch (error) {
        console.error('❌ Erreur initialisation sécurité:', error.message);
        return null;
    }
}

function getSecurityManager() {
    return globalSecurityManager;
}

function destroyGlobalSecurity() {
    if (globalSecurityManager) {
        globalSecurityManager.destroySession();
        globalSecurityManager = null;
    }
}

// ============================================================================
// INITIALISATION AUTOMATIQUE
// ============================================================================

console.log('📁 security.js v2.0 chargé');

// Auto-initialisation si CryptoJS est disponible
if (typeof CryptoJS !== 'undefined') {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // L'initialisation sera faite par app.js
        });
    }
} else {
    console.warn('⚠️ CryptoJS non disponible - fonctions de sécurité limitées');
}