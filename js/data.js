/**
 * Diagnostic Innovation v2.0 - Data Manager
 * Gestionnaire de chargement et traitement des données (questions, profils, config)
 * (c) Valmen Consulting
 */

// ============================================================================
// GESTIONNAIRE DE DONNÉES PRINCIPAL
// ============================================================================

class DataManager {
    constructor() {
        this.questions = null;
        this.profiles = null;
        this.config = null;
        this.isLoaded = false;
        this.cache = new Map();
        
        console.log('📊 DataManager v2.0 initialisé');
    }

    // ========================================================================
    // CHARGEMENT DES FICHIERS JSON
    // ========================================================================

    async loadQuestions() {
        try {
            console.log('📋 Chargement des questions...');
            const response = await fetch('config/questions.json');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validation de base
            if (!data.identification || !data.diagnostic) {
                throw new Error('Structure de questions invalide');
            }
            
            this.questions = data;
            this.cache.set('questions', data);
            console.log('✅ Questions chargées:', data.identification.length, 'identification +', data.diagnostic.length, 'diagnostic');
            
            return data;
        } catch (error) {
            console.error('❌ Erreur chargement questions:', error.message);
            return this.getQuestionsDefault();
        }
    }

    async loadProfiles() {
        try {
            console.log('👥 Chargement des profils...');
            const response = await fetch('config/profiles.json');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validation de base
            if (!data.profiles) {
                throw new Error('Structure de profils invalide');
            }
            
            this.profiles = data;
            this.cache.set('profiles', data);
            console.log('✅ Profils chargés:', Object.keys(data.profiles).length, 'profils');
            
            return data;
        } catch (error) {
            console.error('❌ Erreur chargement profils:', error.message);
            return this.getProfilesDefault();
        }
    }

    async loadConfig() {
        try {
            console.log('⚙️ Chargement de la configuration...');
            const response = await fetch('config/app-config.json');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            this.config = data;
            this.cache.set('config', data);
            console.log('✅ Configuration chargée');
            
            return data;
        } catch (error) {
            console.error('❌ Erreur chargement config:', error.message);
            return this.getConfigDefault();
        }
    }

    // ========================================================================
    // CHARGEMENT GLOBAL
    // ========================================================================

    async loadAll() {
        console.log('🔄 Chargement de toutes les données...');
        
        try {
            // Chargement en parallèle pour optimiser les performances
            const [questions, profiles, config] = await Promise.all([
                this.loadQuestions(),
                this.loadProfiles(),
                this.loadConfig()
            ]);

            this.isLoaded = true;
            console.log('✅ Toutes les données chargées avec succès');
            
            return {
                questions,
                profiles,
                config,
                success: true
            };
        } catch (error) {
            console.error('❌ Erreur chargement global:', error.message);
            this.isLoaded = false;
            
            return {
                questions: this.getQuestionsDefault(),
                profiles: this.getProfilesDefault(),
                config: this.getConfigDefault(),
                success: false,
                error: error.message
            };
        }
    }

    // ========================================================================
    // ACCESSEURS DE DONNÉES
    // ========================================================================

    getIdentificationQuestions() {
        return this.questions?.identification || this.getQuestionsDefault().identification;
    }

    getDiagnosticQuestions() {
        return this.questions?.diagnostic || this.getQuestionsDefault().diagnostic;
    }

    getAllQuestions() {
        const identification = this.getIdentificationQuestions();
        const diagnostic = this.getDiagnosticQuestions();
        
        return [...identification, ...diagnostic];
    }

    getProfiles() {
        return this.profiles?.profiles || this.getProfilesDefault().profiles;
    }

    getProfile(profileId) {
        const profiles = this.getProfiles();
        return profiles[profileId] || null;
    }

    getConfig() {
        return this.config || this.getConfigDefault();
    }

    getAppInfo() {
        const config = this.getConfig();
        return {
            name: config.app?.name || 'Diagnostic Innovation',
            version: config.app?.version || '2.0.0',
            description: config.app?.description || 'Découvrez votre profil d\'innovateur'
        };
    }

    // ========================================================================
    // DONNÉES PAR DÉFAUT (FALLBACK)
    // ========================================================================

    getQuestionsDefault() {
        return {
            metadata: {
                version: "2.0.0",
                title: "Diagnostic Innovation",
                description: "Découvrez votre profil d'innovateur",
                author: "Valmen Consulting"
            },
            identification: [
                {
                    id: "I1",
                    question: "Dans mon organisation, j'ai le rôle de :",
                    answers: [
                        { text: "Direction", value: "Direction" },
                        { text: "Management", value: "Management" },
                        { text: "Opérationnel", value: "Opérationnel" }
                    ]
                },
                {
                    id: "I2",
                    question: "J'exerce mon rôle dans une Direction :",
                    answers: [
                        { text: "Informatique", value: "Informatique" },
                        { text: "Métier", value: "Métier" },
                        { text: "Support", value: "Support" }
                    ]
                }
            ],
            diagnostic: [
                {
                    id: "Q1",
                    question: "Ce qui me plaît dans un projet c'est :",
                    answers: [
                        { text: "De rendre les idées concrètes", profile: "concepteur" },
                        { text: "D'imaginer des concepts", profile: "explorateur" },
                        { text: "De fédérer une équipe", profile: "impulseur" }
                    ]
                },
                {
                    id: "Q2",
                    question: "Dans mon travail, j'ai besoin d'un environnement :",
                    answers: [
                        { text: "Cadré : j'aime savoir où je vais et quelles sont les prochaines actions", profile: "concepteur" },
                        { text: "Excitant : j'ai besoin de sensations fortes et de relever des défis", profile: "impulseur" },
                        { text: "Ouvert : j'aime avant tout les contacts variés et les approches ludiques ou atypiques", profile: "explorateur" }
                    ]
                },
                {
                    id: "Q3",
                    question: "Quand j'arrive dans une nouvelle équipe projet :",
                    answers: [
                        { text: "J'essaie de comprendre les personnalités de chacun", profile: "impulseur" },
                        { text: "J'essaie de décliner les ambitions en objectifs atteignables", profile: "concepteur" },
                        { text: "J'essaie d'apporter un nouvel angle d'approche", profile: "explorateur" }
                    ]
                }
                // Ajout automatique des autres questions si nécessaire
            ]
        };
    }

    getProfilesDefault() {
        return {
            profiles: {
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
            }
        };
    }

    getConfigDefault() {
        return {
            app: {
                name: "Diagnostic Innovation",
                version: "2.0.0",
                description: "Découvrez votre profil d'innovateur selon la méthode Valmen Consulting",
                author: "Valmen Consulting"
            },
            branding: {
                company_name: "VALMEN",
                company_subtitle: "CONSULTING",
                tagline: "Nous œuvrons pour une digitalisation positive pour l'Humain"
            },
            features: {
                security: {
                    enabled: true,
                    session_timeout: 1800,
                    auto_cleanup: true
                },
                privacy: {
                    gdpr_compliance: true,
                    consent_required: true
                }
            }
        };
    }

    // ========================================================================
    // VALIDATION DES DONNÉES
    // ========================================================================

    validateQuestions(questions) {
        try {
            // Vérification structure de base
            if (!questions.identification || !Array.isArray(questions.identification)) {
                throw new Error('Questions d\'identification manquantes ou invalides');
            }

            if (!questions.diagnostic || !Array.isArray(questions.diagnostic)) {
                throw new Error('Questions de diagnostic manquantes ou invalides');
            }

            // Vérification du contenu
            questions.identification.forEach((q, index) => {
                if (!q.id || !q.question || !q.answers || !Array.isArray(q.answers)) {
                    throw new Error(`Question identification ${index + 1} invalide`);
                }
            });

            questions.diagnostic.forEach((q, index) => {
                if (!q.id || !q.question || !q.answers || !Array.isArray(q.answers)) {
                    throw new Error(`Question diagnostic ${index + 1} invalide`);
                }
                
                // Vérification des profils dans les réponses
                q.answers.forEach((answer, answerIndex) => {
                    if (!answer.text || !answer.profile) {
                        throw new Error(`Réponse ${answerIndex + 1} de la question ${index + 1} invalide`);
                    }
                });
            });

            return true;
        } catch (error) {
            console.error('❌ Validation questions échouée:', error.message);
            return false;
        }
    }

    validateProfiles(profiles) {
        try {
            if (!profiles.profiles || typeof profiles.profiles !== 'object') {
                throw new Error('Structure de profils invalide');
            }

            const requiredProfiles = ['impulseur', 'concepteur', 'explorateur'];
            
            requiredProfiles.forEach(profileId => {
                const profile = profiles.profiles[profileId];
                if (!profile || !profile.name || !profile.icon || !profile.description) {
                    throw new Error(`Profil ${profileId} manquant ou invalide`);
                }
            });

            return true;
        } catch (error) {
            console.error('❌ Validation profils échouée:', error.message);
            return false;
        }
    }

    // ========================================================================
    // CACHE ET PERFORMANCE
    // ========================================================================

    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache des données vidé');
    }

    getCachedData(key) {
        return this.cache.get(key);
    }

    getLoadStatus() {
        return {
            isLoaded: this.isLoaded,
            questionsLoaded: !!this.questions,
            profilesLoaded: !!this.profiles,
            configLoaded: !!this.config,
            cacheSize: this.cache.size
        };
    }

    // ========================================================================
    // STATISTIQUES ET MÉTRIQUES
    // ========================================================================

    getQuestionnaireStats() {
        const identification = this.getIdentificationQuestions();
        const diagnostic = this.getDiagnosticQuestions();
        
        return {
            totalQuestions: identification.length + diagnostic.length,
            identificationQuestions: identification.length,
            diagnosticQuestions: diagnostic.length,
            profiles: Object.keys(this.getProfiles()).length,
            loadTime: this.isLoaded ? 'Chargé' : 'Non chargé'
        };
    }

    // ========================================================================
    // EXPORT DE DONNÉES
    // ========================================================================

    exportQuestionnaire() {
        return {
            metadata: this.questions?.metadata || this.getQuestionsDefault().metadata,
            identification: this.getIdentificationQuestions(),
            diagnostic: this.getDiagnosticQuestions(),
            profiles: this.getProfiles(),
            exportDate: new Date().toISOString()
        };
    }
}

// ============================================================================
// CALCULATEUR DE SCORES
// ============================================================================

class ScoreCalculator {
    constructor(profiles) {
        this.profiles = profiles || {};
        this.profileKeys = Object.keys(this.profiles);
    }

    calculateScores(userAnswers) {
        console.log('📊 Calcul des scores...');
        
        // Initialisation des scores
        const scores = {};
        this.profileKeys.forEach(profile => {
            scores[profile] = 0;
        });

        // Comptage des réponses par profil
        let validAnswers = 0;
        userAnswers.forEach((answer, index) => {
            if (answer && answer.profile && scores.hasOwnProperty(answer.profile)) {
                scores[answer.profile]++;
                validAnswers++;
            }
        });

        if (validAnswers === 0) {
            console.warn('⚠️ Aucune réponse valide pour le calcul');
            return this.getDefaultScores();
        }

        // Conversion en pourcentages
        const percentages = {};
        this.profileKeys.forEach(profile => {
            percentages[profile] = Math.round((scores[profile] / validAnswers) * 100);
        });

        console.log('✅ Scores calculés:', percentages);
        return percentages;
    }

    getDominantProfile(scores) {
        let maxScore = -1;
        let dominantProfile = this.profileKeys[0] || 'concepteur';
        
        Object.entries(scores).forEach(([profile, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantProfile = profile;
            }
        });
        
        console.log(`🎯 Profil dominant: ${dominantProfile} (${maxScore}%)`);
        return dominantProfile;
    }

    getProfilesRanking(scores) {
        return Object.entries(scores)
            .sort(([,a], [,b]) => b - a)
            .map(([profile, score]) => ({ profile, score }));
    }

    getDefaultScores() {
        const defaultScores = {};
        this.profileKeys.forEach(profile => {
            defaultScores[profile] = Math.floor(100 / this.profileKeys.length);
        });
        return defaultScores;
    }

    analyzeResults(scores) {
        const ranking = this.getProfilesRanking(scores);
        const dominant = this.getDominantProfile(scores);
        const maxScore = Math.max(...Object.values(scores));
        const minScore = Math.min(...Object.values(scores));
        
        return {
            scores: scores,
            dominant: dominant,
            ranking: ranking,
            analysis: {
                maxScore: maxScore,
                minScore: minScore,
                spread: maxScore - minScore,
                isBalanced: (maxScore - minScore) < 20,
                type: this.getProfileType(scores)
            }
        };
    }

    getProfileType(scores) {
        const values = Object.values(scores);
        const max = Math.max(...values);
        const equalProfiles = values.filter(score => score === max).length;
        
        if (equalProfiles > 1) {
            return 'balanced';
        } else if (max >= 50) {
            return 'dominant';
        } else {
            return 'mixed';
        }
    }
}

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

let globalDataManager = null;
let globalScoreCalculator = null;

// ============================================================================
// FONCTIONS UTILITAIRES GLOBALES
// ============================================================================

async function initializeData() {
    try {
        console.log('🔄 Initialisation du gestionnaire de données...');
        
        globalDataManager = new DataManager();
        const result = await globalDataManager.loadAll();
        
        if (result.success) {
            // Initialisation du calculateur de scores
            globalScoreCalculator = new ScoreCalculator(result.profiles.profiles);
            console.log('✅ Données initialisées avec succès');
            return { success: true, data: result };
        } else {
            console.warn('⚠️ Données initialisées avec des fallbacks');
            globalScoreCalculator = new ScoreCalculator(result.profiles.profiles);
            return { success: false, data: result, error: result.error };
        }
    } catch (error) {
        console.error('❌ Erreur initialisation données:', error.message);
        return { success: false, error: error.message };
    }
}

function getDataManager() {
    return globalDataManager;
}

function getScoreCalculator() {
    return globalScoreCalculator;
}

function getIdentificationQuestions() {
    return globalDataManager ? globalDataManager.getIdentificationQuestions() : [];
}

function getDiagnosticQuestions() {
    return globalDataManager ? globalDataManager.getDiagnosticQuestions() : [];
}

function getProfiles() {
    return globalDataManager ? globalDataManager.getProfiles() : {};
}

function getProfile(profileId) {
    return globalDataManager ? globalDataManager.getProfile(profileId) : null;
}

function calculateUserScores(userAnswers) {
    if (!globalScoreCalculator) {
        console.error('❌ Calculateur de scores non initialisé');
        return {};
    }
    return globalScoreCalculator.calculateScores(userAnswers);
}

function analyzeUserResults(userAnswers) {
    if (!globalScoreCalculator) {
        console.error('❌ Calculateur de scores non initialisé');
        return null;
    }
    
    const scores = globalScoreCalculator.calculateScores(userAnswers);
    return globalScoreCalculator.analyzeResults(scores);
}

function getAppConfig() {
    return globalDataManager ? globalDataManager.getConfig() : {};
}

function getAppInfo() {
    return globalDataManager ? globalDataManager.getAppInfo() : {
        name: 'Diagnostic Innovation',
        version: '2.0.0',
        description: 'Découvrez votre profil d\'innovateur'
    };
}

// ============================================================================
// UTILITAIRES DE DEBUG
// ============================================================================

function debugDataStatus() {
    if (!globalDataManager) {
        console.log('❌ DataManager non initialisé');
        return;
    }
    
    const status = globalDataManager.getLoadStatus();
    const stats = globalDataManager.getQuestionnaireStats();
    
    console.log('📊 Status des données:', status);
    console.log('📋 Statistiques questionnaire:', stats);
    
    if (globalScoreCalculator) {
        console.log('🧮 Calculateur de scores: ✅ Initialisé');
    } else {
        console.log('🧮 Calculateur de scores: ❌ Non initialisé');
    }
}

function exportAllData() {
    if (!globalDataManager) {
        console.error('❌ DataManager non initialisé');
        return null;
    }
    
    return globalDataManager.exportQuestionnaire();
}

// ============================================================================
// INITIALISATION AUTOMATIQUE
// ============================================================================

console.log('📁 data.js v2.0 chargé');

// Fonction d'initialisation qui sera appelée par app.js
window.initializeDataManager = initializeData;