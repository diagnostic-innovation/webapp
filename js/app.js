/**
 * Diagnostic Innovation v2.0 - Application Principale
 * Point d'entrée et orchestration de l'application
 * (c) Valmen Consulting
 */

// ============================================================================
// VARIABLES GLOBALES DE L'APPLICATION
// ============================================================================

var app = {
    // Gestionnaires
    security: null,
    data: null,
    emailConfig: null,
    
    // État de l'application
    currentScreen: 'loading',
    currentQuestionIndex: 0,
    isIdentificationPhase: true,
    
    // Données utilisateur
    participant: {},
    identificationAnswers: [],
    userAnswers: [],
    results: null,
    
    // Configuration
    config: {},
    
    // État
    isInitialized: false
};

// ============================================================================
// INITIALISATION PRINCIPALE
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Diagnostic Innovation v2.0 - Démarrage');
    await initializeApplication();
});

async function initializeApplication() {
    try {
        // Affichage de l'écran de chargement
        showScreen('loading');
        updateLoadingStatus('Chargement des données...');
        
        // Initialisation de la sécurité (optionnelle)
        if (typeof initializeSecurity === 'function') {
            app.security = initializeSecurity();
        }
        
        // Initialisation des données
        updateLoadingStatus('Configuration du questionnaire...');
        if (typeof initializeDataManager === 'function') {
            const dataResult = await initializeDataManager();
            
            if (!dataResult.success) {
                console.warn('⚠️ Données chargées avec des fallbacks');
            }
        }
        
        // Chargement de la configuration email
        updateLoadingStatus('Configuration des services...');
        app.emailConfig = await loadEmailConfig();
        
        // Configuration de l'application
        if (typeof getAppConfig === 'function') {
            app.config = getAppConfig();
        }
        
        // Finalisation
        updateLoadingStatus('Finalisation...');
        app.isInitialized = true;
        
        // Transition vers l'écran d'accueil
        setTimeout(() => {
            showScreen('welcome');
            console.log('✅ Application initialisée avec succès');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur initialisation:', error.message);
        showErrorMessage('Erreur lors de l\'initialisation de l\'application');
    }
}

async function loadEmailConfig() {
    try {
        console.log('📧 Chargement de la configuration email...');
        
        // Configuration EmailJS obfusquée (MVP sécurisé)
        const encodedConfig = "eyJlbWFpbCI6eyJlbmFibGVkIjp0cnVlLCJzZXJ2aWNlX2lkIjoic2VydmljZV9hbXNvdmE0IiwidGVtcGxhdGVfaWQiOiJ0ZW1wbGF0ZV81cDk3dnkyIiwicHVibGljX2tleSI6Im5OeVRrTTdVSmIteUtjSmp1IiwidG9fZW1haWwiOiJwbGV0ZW5ldXJAdmFsbWVuLmZyIn19";
        
        // Décodage sécurisé
        const config = JSON.parse(atob(encodedConfig));
        
        console.log('✅ Configuration email décodée');
        
        // Initialisation d'EmailJS si configuré
        if (config.email.enabled && config.email.public_key && typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: config.email.public_key });
            console.log('✅ EmailJS initialisé');
        }
        
        return config;
        
    } catch (error) {
        console.error('❌ Erreur chargement config email:', error.message);
        return { email: { enabled: false } };
    }
}

// ============================================================================
// GESTION DES ÉCRANS
// ============================================================================

function showScreen(screenId) {
    // Masquer tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    
    // Afficher l'écran demandé
    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) {
        targetScreen.style.display = 'block';
        targetScreen.classList.add('active');
        app.currentScreen = screenId;
        console.log(`📱 Écran affiché: ${screenId}`);
    } else {
        console.error(`❌ Écran introuvable: ${screenId}`);
    }
}

function updateLoadingStatus(message) {
    const statusElement = document.getElementById('loadingStatus');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(`⏳ ${message}`);
}

// ============================================================================
// GESTION DU PARTICIPANT
// ============================================================================

function startDiagnostic() {
    try {
        // Récupération des informations participant
        const name = document.getElementById('participantName')?.value.trim();
        const company = document.getElementById('participantCompany')?.value.trim();
        
        // Validation
        if (!name) {
            showErrorMessage('Veuillez entrer votre nom');
            return;
        }
        
        // Stockage
        app.participant = { name, company };
        
        if (app.security) {
            app.security.storeUserData('participant', app.participant);
        }
        
        // Initialisation du questionnaire
        initializeQuestionnaire();
        
        // Transition vers le questionnaire
        showScreen('questionnaire');
        
        console.log('🎯 Diagnostic démarré pour:', name);
        
    } catch (error) {
        console.error('❌ Erreur démarrage diagnostic:', error.message);
        showErrorMessage('Erreur lors du démarrage du diagnostic');
    }
}

function initializeQuestionnaire() {
    app.currentQuestionIndex = 0;
    app.isIdentificationPhase = true;
    app.identificationAnswers = [];
    app.userAnswers = [];
    
    showCurrentQuestion();
}

// ============================================================================
// GESTION DU QUESTIONNAIRE
// ============================================================================

function showCurrentQuestion() {
    let currentQuestions;
    
    if (app.isIdentificationPhase) {
        currentQuestions = typeof getIdentificationQuestions === 'function' ? 
            getIdentificationQuestions() : [];
    } else {
        currentQuestions = typeof getDiagnosticQuestions === 'function' ? 
            getDiagnosticQuestions() : [];
    }
    
    if (app.currentQuestionIndex >= currentQuestions.length) {
        if (app.isIdentificationPhase) {
            // Passage au diagnostic
            app.isIdentificationPhase = false;
            app.currentQuestionIndex = 0;
            showCurrentQuestion();
            return;
        } else {
            // Fin du questionnaire - afficher le bouton valider
            showValidateButton();
            return;
        }
    }
    
    const question = currentQuestions[app.currentQuestionIndex];
    
    // Mise à jour de la question
    const questionElement = document.getElementById('current-question');
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    // Mise à jour des réponses
    const answersContainer = document.getElementById('answers-container');
    if (answersContainer) {
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer.text;
            answerDiv.onclick = () => selectAnswer(index);
            answersContainer.appendChild(answerDiv);
        });
    }
    
    updateProgress();
    updateNavigationButtons();
}

function selectAnswer(answerIndex) {
    // Désélection de toutes les réponses
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Sélection de la réponse choisie
    const selectedOption = document.querySelectorAll('.answer-option')[answerIndex];
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Stockage de la réponse
    let currentQuestions;
    if (app.isIdentificationPhase) {
        currentQuestions = typeof getIdentificationQuestions === 'function' ? 
            getIdentificationQuestions() : [];
        const question = currentQuestions[app.currentQuestionIndex];
        
        if (question) {
            app.identificationAnswers[app.currentQuestionIndex] = {
                questionIndex: app.currentQuestionIndex,
                answerIndex: answerIndex,
                value: question.answers[answerIndex].value,
                text: question.answers[answerIndex].text
            };
        }
    } else {
        currentQuestions = typeof getDiagnosticQuestions === 'function' ? 
            getDiagnosticQuestions() : [];
        const question = currentQuestions[app.currentQuestionIndex];
        
        if (question) {
            app.userAnswers[app.currentQuestionIndex] = {
                questionIndex: app.currentQuestionIndex,
                answerIndex: answerIndex,
                profile: question.answers[answerIndex].profile
            };
        }
    }
    
    updateNavigationButtons();
    
    // Log de sécurité
    if (app.security) {
        app.security.logSecurityEvent('ANSWER_SELECTED', {
            phase: app.isIdentificationPhase ? 'identification' : 'diagnostic',
            questionIndex: app.currentQuestionIndex,
            answerIndex: answerIndex
        });
    }
}

function nextQuestion() {
    let currentQuestions = app.isIdentificationPhase ? 
        (typeof getIdentificationQuestions === 'function' ? getIdentificationQuestions() : []) :
        (typeof getDiagnosticQuestions === 'function' ? getDiagnosticQuestions() : []);
    
    if (app.currentQuestionIndex < currentQuestions.length - 1) {
        app.currentQuestionIndex++;
        showCurrentQuestion();
    } else {
        if (app.isIdentificationPhase) {
            app.isIdentificationPhase = false;
            app.currentQuestionIndex = 0;
            showCurrentQuestion();
        } else {
            showValidateButton();
        }
    }
}

function previousQuestion() {
    if (app.currentQuestionIndex > 0) {
        app.currentQuestionIndex--;
        showCurrentQuestion();
        
        // Restauration de la sélection précédente
        setTimeout(() => {
            let currentAnswers = app.isIdentificationPhase ? 
                app.identificationAnswers : app.userAnswers;
                
            if (currentAnswers[app.currentQuestionIndex]) {
                const selectedIndex = currentAnswers[app.currentQuestionIndex].answerIndex;
                const options = document.querySelectorAll('.answer-option');
                if (options[selectedIndex]) {
                    options[selectedIndex].classList.add('selected');
                }
            }
        }, 50);
    } else if (!app.isIdentificationPhase) {
        // Retour à la phase d'identification
        const identificationQuestions = typeof getIdentificationQuestions === 'function' ? 
            getIdentificationQuestions() : [];
        app.isIdentificationPhase = true;
        app.currentQuestionIndex = identificationQuestions.length - 1;
        showCurrentQuestion();
        
        setTimeout(() => {
            if (app.identificationAnswers[app.currentQuestionIndex]) {
                const selectedIndex = app.identificationAnswers[app.currentQuestionIndex].answerIndex;
                const options = document.querySelectorAll('.answer-option');
                if (options[selectedIndex]) {
                    options[selectedIndex].classList.add('selected');
                }
            }
        }, 50);
    }
}

function showValidateButton() {
    // NE PAS masquer le bouton précédent - permettre le retour
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const validateBtn = document.getElementById('validate-btn');
    
    // Garder le bouton précédent visible et actif
    if (prevBtn) {
        prevBtn.style.display = 'block';
        prevBtn.disabled = false;
    }
    
    // Masquer le bouton suivant et afficher validation
    if (nextBtn) nextBtn.style.display = 'none';
    if (validateBtn) validateBtn.style.display = 'block';
    
    console.log('✅ Bouton de validation affiché avec retour possible');
}

function validateAndShowResults() {
    if (!isQuestionnaireComplete()) {
        showErrorMessage('Veuillez répondre à toutes les questions avant de valider');
        return;
    }
    
    calculateAndShowResults();
}

function isQuestionnaireComplete() {
    const identificationQuestions = typeof getIdentificationQuestions === 'function' ? 
        getIdentificationQuestions() : [];
    const diagnosticQuestions = typeof getDiagnosticQuestions === 'function' ? 
        getDiagnosticQuestions() : [];
    
    return app.identificationAnswers.length === identificationQuestions.length &&
           app.userAnswers.length === diagnosticQuestions.length;
}

function updateProgress() {
    const identificationQuestions = typeof getIdentificationQuestions === 'function' ? 
        getIdentificationQuestions() : [];
    const diagnosticQuestions = typeof getDiagnosticQuestions === 'function' ? 
        getDiagnosticQuestions() : [];
    const totalQuestions = identificationQuestions.length + diagnosticQuestions.length;
    
    let completedQuestions = app.identificationAnswers.length + app.userAnswers.length;
    
    const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar') || document.getElementById('progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    let currentAnswers = app.isIdentificationPhase ? 
        app.identificationAnswers : app.userAnswers;
    
    // Bouton précédent
    prevBtn.disabled = (app.isIdentificationPhase && app.currentQuestionIndex === 0);
    
    // Bouton suivant
    nextBtn.disabled = !currentAnswers[app.currentQuestionIndex];
    
    // Texte du bouton suivant
    const diagnosticQuestions = typeof getDiagnosticQuestions === 'function' ? 
        getDiagnosticQuestions() : [];
    
    if (!app.isIdentificationPhase && 
        app.currentQuestionIndex === diagnosticQuestions.length - 1 && 
        currentAnswers[app.currentQuestionIndex]) {
        nextBtn.textContent = 'Dernière question →';
    } else {
        nextBtn.textContent = 'Suivant →';
    }
}

// ============================================================================
// CALCUL ET AFFICHAGE DES RÉSULTATS
// ============================================================================

function calculateAndShowResults() {
    try {
        console.log('🧮 Calcul des résultats...');
        
        // Calcul des scores
        let analysis = null;
        if (typeof analyzeUserResults === 'function') {
            analysis = analyzeUserResults(app.userAnswers);
        } else {
            // Calcul basique de fallback
            analysis = calculateBasicScores(app.userAnswers);
        }
        
        if (!analysis) {
            throw new Error('Impossible de calculer les résultats');
        }
        
        // Préparation des résultats
        app.results = {
            participant: app.participant,
            identification: app.identificationAnswers,
            scores: analysis.scores,
            dominant: analysis.dominant,
            ranking: analysis.ranking || getRanking(analysis.scores),
            analysis: analysis.analysis || {},
            timestamp: new Date().toISOString()
        };
        
        // Stockage sécurisé
        if (app.security) {
            app.security.storeUserData('results', app.results);
            app.security.logSecurityEvent('RESULTS_CALCULATED', {
                dominant: analysis.dominant,
                scores: analysis.scores
            });
        }
        
        // Affichage des résultats
        displayResults(app.results);
        
        // Transition vers l'écran des résultats
        showScreen('results');
        
        // Export automatique des résultats
        setTimeout(() => {
            autoExportResults(app.results);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur calcul résultats:', error.message);
        showErrorMessage('Erreur lors du calcul des résultats');
    }
}

function calculateBasicScores(userAnswers) {
    const scores = { concepteur: 0, explorateur: 0, impulseur: 0 };
    
    userAnswers.forEach((answer) => {
        if (answer && answer.profile && scores.hasOwnProperty(answer.profile)) {
            scores[answer.profile]++;
        }
    });
    
    const total = userAnswers.length;
    const percentages = {};
    Object.keys(scores).forEach(profile => {
        percentages[profile] = total > 0 ? Math.round((scores[profile] / total) * 100) : 0;
    });
    
    const dominant = getDominantProfile(percentages);
    
    return {
        scores: percentages,
        dominant: dominant
    };
}

function getDominantProfile(scores) {
    let maxScore = -1;
    let dominantProfile = 'concepteur';
    
    Object.entries(scores).forEach(([profile, score]) => {
        if (score > maxScore) {
            maxScore = score;
            dominantProfile = profile;
        }
    });
    
    return dominantProfile;
}

function getRanking(scores) {
    return Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .map(([profile, score]) => ({ profile, score }));
}

function displayResults(results) {
    const profiles = typeof getProfiles === 'function' ? getProfiles() : getDefaultProfiles();
    const ranking = results.ranking;
    
    // Mise à jour du timestamp
    const timestampElement = document.getElementById('resultsTimestamp');
    if (timestampElement) {
        timestampElement.textContent = 
            `Généré le ${new Date().toLocaleString()}`;
    }
    
    // Mise à jour de la grille de résultats
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        
        ranking.forEach((item, index) => {
            const profile = profiles[item.profile];
            if (!profile) return;
            
            const resultCard = document.createElement('div');
            resultCard.className = `result-card ${index === 0 ? 'highest' : ''}`;
            resultCard.innerHTML = `
                <div class="result-icon">${profile.icon}</div>
                <div class="result-score">${item.score}%</div>
                <div class="result-label">${profile.name}</div>
                <div class="result-description">${profile.description}</div>
            `;
            
            resultsContainer.appendChild(resultCard);
        });
    }
    
    console.log('✅ Résultats affichés');
}

function getDefaultProfiles() {
    return {
        impulseur: {
            id: "impulseur",
            name: "IMPULSEUR",
            icon: "👥",
            description: "« Énergiseur » d'équipe, l'impulseur nourrit le collectif"
        },
        concepteur: {
            id: "concepteur",
            name: "CONCEPTEUR", 
            icon: "📦",
            description: "« Résolveur » de casse tête, le concepteur rend possible"
        },
        explorateur: {
            id: "explorateur",
            name: "EXPLORATEUR",
            icon: "🚀", 
            description: "« Découvreur » de perspectives, l'explorateur apporte des idées"
        }
    };
}

// ============================================================================
// EXPORT AUTOMATIQUE DES RÉSULTATS
// ============================================================================

function autoExportResults(results) {
    try {
        console.log('📄 Export automatique des résultats...');
        
        // SUPPRIME Export JSON local
        //exportResultsToJSON(results);
        
        // Envoi par email si configuré
        if (app.emailConfig && app.emailConfig.email.enabled) {
            sendResultsByEmail(results);
        }
        
        // Mise à jour du status d'export
        showExportStatus();
        
    } catch (error) {
        console.error('❌ Erreur export automatique:', error.message);
    }
}

function exportResultsToJSON(results) {
    const exportData = {
        ...results,
        export: {
            date: new Date().toISOString(),
            version: '2.0.0',
            format: 'JSON',
            method: 'Valmen Consulting'
        }
    };
    
    // Création du fichier
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Téléchargement automatique
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `diagnostic-innovation-${results.participant.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Fichier JSON exporté automatiquement');
}

function sendResultsByEmail(results) {
    if (!app.emailConfig || !app.emailConfig.email.enabled) {
        console.log('📧 Email non configuré');
        return;
    }
    
    try {
        console.log('📧 Envoi des résultats par email...');
        
        const emailConfig = app.emailConfig.email;
        
		// Formatage de la date
		const date = new Date().toLocaleString('fr-FR');

		// Préparation des données pour le template
		const templateParams = {
			to_email: emailConfig.to_email,
			subject: `Diagnostic Innovation v2.0 - ${results.participant.company || results.participant.name}`,
			participant_name: results.participant.name,
			participant_company: results.participant.company || 'Non précisée',
			role: results.identification[0]?.value || 'Non précisé',
			direction: results.identification[1]?.value || 'Non précisé',
			dominant_profile: results.dominant,
			score_concepteur: results.scores.concepteur || 0,
			score_explorateur: results.scores.explorateur || 0,
			score_impulseur: results.scores.impulseur || 0,
			timestamp: results.timestamp,
			date: date,
			version: '2.0.0'
			};
        
        // Envoi via EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.send(
                emailConfig.service_id,
                emailConfig.template_id,
                templateParams
            ).then(
                function(response) {
                    console.log('✅ Email envoyé avec succès:', response);
                },
                function(error) {
                    console.error('❌ Erreur envoi email:', error);
                }
            );
        }
        
    } catch (error) {
        console.error('❌ Erreur préparation email:', error.message);
    }
}

function showExportStatus() {
    const exportStatus = document.getElementById('export-status');
    if (exportStatus) {
        exportStatus.classList.add('export-success');
        exportStatus.style.display = 'block';
    }
}

// ============================================================================
// GESTION DES ERREURS ET NOTIFICATIONS
// ============================================================================

function showErrorMessage(message) {
    console.error('❌', message);
    
    if (app.security && app.security.showSecurityNotification) {
        app.security.showSecurityNotification(message, 'error');
    } else {
        alert(message);
    }
}

function showSuccessMessage(message) {
    console.log('✅', message);
    
    if (app.security && app.security.showSecurityNotification) {
        app.security.showSecurityNotification(message, 'success');
    }
}

function showInfoMessage(message) {
    console.log('ℹ️', message);
    
    if (app.security && app.security.showSecurityNotification) {
        app.security.showSecurityNotification(message, 'info');
    }
}

// ============================================================================
// ACTIONS UTILISATEUR
// ============================================================================

function restartDiagnostic() {
    try {
        console.log('🔄 Redémarrage complet du diagnostic...');
        
        // Confirmation de l'utilisateur
        const confirmRestart = confirm('Êtes-vous sûr de vouloir recommencer ? Toutes vos réponses seront supprimées.');
        
        if (!confirmRestart) {
            return;
        }
        
        // Nettoyage complet des données
        if (app.security && app.security.destroySession) {
            app.security.destroySession();
        }
        
        // Reset des données
        app.participant = {};
        app.identificationAnswers = [];
        app.userAnswers = [];
        app.results = null;
        app.currentQuestionIndex = 0;
        app.isIdentificationPhase = true;
        
        // Reset du formulaire
        const nameInput = document.getElementById('participantName');
        const companyInput = document.getElementById('participantCompany');
        
        if (nameInput) nameInput.value = '';
        if (companyInput) companyInput.value = '';
        
        // Reset des boutons de navigation
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const validateBtn = document.getElementById('validate-btn');
        
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
        if (validateBtn) validateBtn.style.display = 'none';
        
        // Retour à l'écran d'accueil
        showScreen('welcome');
        
        console.log('✅ Diagnostic redémarré - toutes les données supprimées');
        
    } catch (error) {
        console.error('❌ Erreur redémarrage:', error.message);
        location.reload();
    }
}

function restartApplication() {
    console.log('🔄 Redémarrage complet de l\'application...');
    location.reload();
}

// ============================================================================
// GESTIONNAIRES D'ÉVÉNEMENTS GLOBAUX
// ============================================================================

// Gestion des erreurs globales
window.addEventListener('error', function(event) {
    console.error('❌ Erreur JavaScript:', event.error);
    
    if (app.security && app.security.logSecurityEvent) {
        app.security.logSecurityEvent('JAVASCRIPT_ERROR', {
            message: event.message,
            filename: event.filename,
            line: event.lineno
        });
    }
});

// Gestion des erreurs de promesses non catchées
window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Promesse rejetée:', event.reason);
    
    if (app.security && app.security.logSecurityEvent) {
        app.security.logSecurityEvent('UNHANDLED_REJECTION', {
            reason: event.reason?.toString() || 'Unknown'
        });
    }
});

// Prévention de la fermeture accidentelle pendant le questionnaire
window.addEventListener('beforeunload', function(event) {
    if (app.currentScreen === 'questionnaire' && app.userAnswers.length > 0) {
        event.preventDefault();
        event.returnValue = 'Votre diagnostic est en cours. Êtes-vous sûr de vouloir quitter ?';
        return event.returnValue;
    }
});

// ============================================================================
// API PUBLIQUE POUR LES ÉVÉNEMENTS HTML
// ============================================================================

// Fonctions exposées globalement pour les événements onclick, etc.
window.startDiagnostic = startDiagnostic;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.validateAndShowResults = validateAndShowResults;
window.restartDiagnostic = restartDiagnostic;

// Fonctions de debug (développement)
window.debugApp = function() {
    console.log('🔍 État de l\'application:', {
        currentScreen: app.currentScreen,
        isInitialized: app.isInitialized,
        currentQuestionIndex: app.currentQuestionIndex,
        isIdentificationPhase: app.isIdentificationPhase,
        participantName: app.participant.name,
        identificationAnswers: app.identificationAnswers.length,
        userAnswers: app.userAnswers.length,
        hasResults: !!app.results,
        emailConfigured: !!(app.emailConfig && app.emailConfig.email.enabled)
    });
};

window.getAppInfo = function() {
    return {
        name: 'Diagnostic Innovation',
        version: '2.0.0',
        author: 'Valmen Consulting',
        features: {
            security: !!app.security,
            dataManager: typeof getDataManager === 'function',
            emailjs: typeof emailjs !== 'undefined',
            cryptojs: typeof CryptoJS !== 'undefined'
        }
    };
};

window.restartApp = restartApplication;

// ============================================================================
// INITIALISATION FINALE
// ============================================================================

console.log('📁 app.js v2.0 chargé - Version corrigée');
console.log('🎯 Fonctions globales exposées pour l\'interface');

// Vérification des dépendances au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Vérification des dépendances...');
    
    const dependencies = {
        CryptoJS: typeof CryptoJS !== 'undefined',
        EmailJS: typeof emailjs !== 'undefined',
        SecurityManager: typeof SecurityManager !== 'undefined',
        DataManager: typeof DataManager !== 'undefined'
    };
    
    console.log('📦 Dépendances:', dependencies);
    
    const missingDeps = Object.entries(dependencies)
        .filter(([name, available]) => !available && name !== 'EmailJS') // EmailJS optionnel
        .map(([name]) => name);
    
    if (missingDeps.length > 0) {
        console.warn('⚠️ Dépendances manquantes:', missingDeps);
    } else {
        console.log('✅ Dépendances principales disponibles');
    }
});