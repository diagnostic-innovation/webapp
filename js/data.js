/**
 * Diagnostic Innovation v2.1.0 - Data Manager
 * Version minimale pour test avec l'index.html existant
 * (c) Valmen Consulting
 */

// ============================================================================
// DONNÉES DES QUESTIONS
// ============================================================================

const questionsData = {
    identification: [
        {
            id: "I4",
            question: "Dans mon organisation, j'ai le rôle de :",
            answers: [
                { text: "Direction", value: "Direction" },
                { text: "Management", value: "Management" },
                { text: "Opérationnel", value: "Opérationnel" }
            ]
        },
        {
            id: "I5",
            question: "J'exerce mon rôle dans une Direction :",
            answers: [
                { text: "Informatique", value: "Informatique" },
                { text: "Métier", value: "Métier" },
                { text: "Support", value: "Support" }
            ]
        }
    ],
    
    organization: [
        {
            id: "E1",
            thematic: "Gouvernance",
            question: "Selon vous, quel animal reflèterait le mieux votre organisation ?",
            answers: [
                { text: "Un éléphant, lent dans ses mouvements mais une sagesse dans ses décisions", value: "E1Q1" },
                { text: "Un fauve, parfois brute mais qui atteint souvent son objectif", value: "E1Q2" },
                { text: "Une antilope, pas la plus impressionnante mais rapide pour atteindre sa destination", value: "E1Q3" }
            ]
        },
        {
            id: "E2",
            thematic: "Origine",
            question: "Je dirais que dans mon organisation, ce qui déclenche l'innovation c'est :",
            answers: [
                { text: "La déclinaison de la stratégie définie par la Direction", value: "E2Q1" },
                { text: "L'évolution du cadre réglementaire et sa mise en conformité", value: "E2Q2" },
                { text: "La recherche de solutions opérationnelles pour améliorer l'existant", value: "E2Q3" },
                { text: "Les nouvelles attentes des clients ou une compétitivité avec la concurrence", value: "E2Q4" }
            ]
        },
        {
            id: "E3",
            thematic: "Orientation",
            question: "Quelle est la nature des innovations qui sont générées dans l'organisation ?",
            answers: [
                { text: "Organisationnelles, elles concernent les processus et les pratiques", value: "E3Q1" },
                { text: "Digitales, elles concernent avant tout la technologie et les outils", value: "E3Q2" },
                { text: "Humaines, elles modifient notre fonctionnement et nos rituels quotidiens", value: "E3Q3" }
            ]
        },
        {
            id: "E4",
            thematic: "Moteur projet",
            question: "Un projet standard dans mon organisation dure en moyenne :",
            answers: [
                { text: "De 0 à 6 mois", value: "E4Q1" },
                { text: "De 6 mois à 1 an", value: "E4Q2" },
                { text: "De 1 à 2 ans", value: "E4Q3" },
                { text: "Plus de 2 ans", value: "E4Q4" }
            ]
        },
        {
            id: "E5",
            thematic: "Moteur projet",
            question: "Le dernier projet majeur a duré :",
            answers: [
                { text: "De 0 à 6 mois", value: "E5Q1" },
                { text: "De 6 mois à 1 an", value: "E5Q2" },
                { text: "De 1 à 2 ans", value: "E5Q3" },
                { text: "Plus de 2 ans", value: "E5Q4" },
                { text: "Ne sais pas", value: "E5Q5" }
            ]
        },
        {
            id: "E6",
            thematic: "Culture intrapreneur",
            question: "Lorsque j'ai une idée d'amélioration pour l'organisation, les processus et les pratiques :",
            answers: [
                { text: "Je passe par un dispositif de l'organisation qui collecte les idées de tous", value: "E6Q1" },
                { text: "Je la propose à mon supérieur et nous voyons ensemble comment la décliner sur notre périmètre", value: "E6Q2" },
                { text: "Je rentre dans le bureau du Directeur et lui expose mon idée", value: "E6Q3" }
            ]
        },
        {
            id: "E7",
            thematic: "Culture intrapreneur",
            question: "La dernière idée que vous avez proposée :",
            answers: [
                { text: "Est classée sans suite, elle n'est pas la priorité de l'organisation", value: "E7Q1" },
                { text: "Est restée dans les cartons en attendant sa mise en œuvre", value: "E7Q2" },
                { text: "Je mène moi-même cette idée jusqu'à sa mise en œuvre dans mon travail", value: "E7Q3" },
                { text: "Est déjà implémentée", value: "E7Q4" }
            ]
        },
        {
            id: "E8",
            thematic: "Test & Learn",
            question: "Comment est perçu le droit à l'erreur dans votre organisation ?",
            answers: [
                { text: "Les projets menés ont un objectif de réussite, peu d'erreurs possibles", value: "E8Q1" },
                { text: "Les tests ratés sont communément admis dans l'organisation", value: "E8Q2" },
                { text: "C'est encouragé, nous avons une culture développée de l'expérimentation", value: "E8Q3" }
            ]
        },
        {
            id: "E9",
            thematic: "Open-Innovation",
            question: "À travers vos activités, avec quelles parties prenantes avez-vous des interactions ?",
            answers: [
                { text: "Souvent avec les collègues de mon métier et de mon périmètre", value: "E9Q1" },
                { text: "Avec des entités transverses à travers les projets menés", value: "E9Q2" },
                { text: "Avec des acteurs du marché pour partager nos pratiques et nos fonctionnements", value: "E9Q3" },
                { text: "Avec des éditeurs et des créateurs de nouvelles solutions", value: "E9Q4" },
                { text: "Nombre et nature des relations avec l'écosystème extérieur : partenaires, écoles...", value: "E9Q5" }
            ]
        },
        {
            id: "E10",
            thematic: "Innovation sous contrainte",
            question: "Comment percevez-vous l'arrivée d'une nouvelle réglementation dans votre activité ?",
            answers: [
                { text: "Des impacts sur notre activité qui vont nous obliger à tout recommencer", value: "E10Q1" },
                { text: "Une contrainte de plus, avec laquelle il va falloir composer", value: "E10Q2" },
                { text: "Une formidable opportunité d'innover et faire évoluer notre manière de travailler", value: "E10Q3" }
            ]
        },
        {
            id: "E11",
            thematic: "Veille",
            question: "Comment apprenez-vous la création d'une nouvelle norme sur votre métier ?",
            answers: [
                { text: "Par mes propres moyens, je réalise une veille pour m'informer", value: "E11Q1" },
                { text: "L'organisation a déjà étudié ses impacts, à nous de voir comment les décliner", value: "E11Q2" },
                { text: "Souvent trop tard, nous allons courir pour la rattraper", value: "E11Q3" }
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
        },
        {
            id: "Q4",
            question: "En cas de problème sur un projet, j'ai tendance à :",
            answers: [
                { text: "Mettre les bouchées doubles pour sauver le projet", profile: "concepteur" },
                { text: "Remotiver les membres de l'équipe", profile: "impulseur" },
                { text: "Aller chercher de l'inspiration à l'extérieur", profile: "explorateur" }
            ]
        },
        {
            id: "Q5",
            question: "Au sein d'une équipe de prototypage, je suis plutôt celui qui :",
            answers: [
                { text: "Orchestre les rituels d'équipe", profile: "impulseur" },
                { text: "Donne des idées pour inspirer", profile: "explorateur" },
                { text: "Identifie tous les scénarios possibles", profile: "concepteur" }
            ]
        },
        {
            id: "Q6",
            question: "Lors d'une séance d'idéation je suis plutôt :",
            answers: [
                { text: "Pragmatique, j'ai des idées pour faire avancer la problématique", profile: "concepteur" },
                { text: "Disruptif, j'ai souvent des idées qui sortent du cadre", profile: "explorateur" },
                { text: "Animateur, j'aime encourager les débats", profile: "impulseur" }
            ]
        },
        {
            id: "Q7",
            question: "Un rendez-vous vient d'être annulé, j'ai une heure de libre j'en profite pour :",
            answers: [
                { text: "Faire de la veille", profile: "explorateur" },
                { text: "Échanger avec les autres membres de l'équipe pour voir où ils en sont", profile: "impulseur" },
                { text: "M'avancer sur mes actions", profile: "concepteur" }
            ]
        },
        {
            id: "Q8",
            question: "Lorsqu'on me demande mon aide c'est généralement pour :",
            answers: [
                { text: "Résoudre un conflit", profile: "impulseur" },
                { text: "Débloquer une situation en trouvant une solution", profile: "explorateur" },
                { text: "Trouver la cause racine d'un problème", profile: "concepteur" }
            ]
        },
        {
            id: "Q9",
            question: "Lequel de ces 3 métiers pourriez-vous exercer :",
            answers: [
                { text: "Coach", profile: "impulseur" },
                { text: "Architecte", profile: "concepteur" },
                { text: "Publicitaire", profile: "explorateur" }
            ]
        }
    ],
    
    methods: [
        {
            id: "M1",
            domain: "agilite",
            type: "auto_eval",
            question: "Quel est votre niveau de maîtrise de l'Agilité ?",
            answers: [
                { text: "Faible", score: 0 },
                { text: "Satisfaisant", score: 50 },
                { text: "Parfait", score: 100 }
            ]
        },
        {
            id: "M2",
            domain: "agilite",
            type: "evaluation",
            question: "Quel concept représente le mieux la philosophie Agile ?",
            answers: [
                { text: "Adaptation continue face au changement", score: 100 },
                { text: "Construction de la documentation au fil du temps", score: 50 },
                { text: "Réduction des coûts par anticipation", score: 0 }
            ]
        },
        {
            id: "M3",
            domain: "agilite",
            type: "evaluation",
            question: "Parmi ces mots, lequel illustre le mieux l'esprit d'une équipe Agile ?",
            answers: [
                { text: "Autonomie encadrée par l'organisation", score: 50 },
                { text: "Collaboration interdisciplinaire", score: 100 },
                { text: "Hiérarchie et rôles clairement définis", score: 0 }
            ]
        },
        {
            id: "M4",
            domain: "agilite",
            type: "evaluation",
            question: "Quel terme est central dans la gestion de projet Agile ?",
            answers: [
                { text: "Planning fixe sur le long terme", score: 0 },
                { text: "Rapport de performance trimestriel", score: 50 },
                { text: "Itération", score: 100 }
            ]
        },
        {
            id: "M5",
            domain: "design_thinking",
            type: "auto_eval",
            question: "Quel est votre niveau de maîtrise du Design Thinking ?",
            answers: [
                { text: "Faible", score: 0 },
                { text: "Satisfaisant", score: 50 },
                { text: "Parfait", score: 100 }
            ]
        },
        {
            id: "M6",
            domain: "design_thinking",
            type: "evaluation",
            question: "Quel mot incarne le mieux le point de départ d'un processus de Design Thinking ?",
            answers: [
                { text: "Recherche de rentabilité", score: 50 },
                { text: "Vision stratégique", score: 0 },
                { text: "Empathie client", score: 100 }
            ]
        },
        {
            id: "M7",
            domain: "design_thinking",
            type: "evaluation",
            question: "Quel concept est au cœur du prototypage dans le Design Thinking ?",
            answers: [
                { text: "Tester rapidement des idées", score: 100 },
                { text: "Réduire les coûts d'industrialisation", score: 50 },
                { text: "Valider un concept informatique", score: 0 }
            ]
        },
        {
            id: "M8",
            domain: "design_thinking",
            type: "evaluation",
            question: "Quelle notion est la plus liée à la phase d'idéation ?",
            answers: [
                { text: "Pensée utilisateur", score: 50 },
                { text: "Pensée divergente", score: 100 },
                { text: "Esprit créatif", score: 0 }
            ]
        },
        {
            id: "M9",
            domain: "lean_startup",
            type: "auto_eval",
            question: "Quel est votre niveau de maîtrise du Lean Start-up ?",
            answers: [
                { text: "Faible", score: 0 },
                { text: "Satisfaisant", score: 50 },
                { text: "Parfait", score: 100 }
            ]
        },
        {
            id: "M10",
            domain: "lean_startup",
            type: "evaluation",
            question: "Quel terme décrit le mieux l'approche de développement produit dans le Lean Start-up ?",
            answers: [
                { text: "Produit proposant des innovations", score: 0 },
                { text: "Cahier des charges construit en itérations", score: 50 },
                { text: "MVP (Produit Minimum Viable)", score: 100 }
            ]
        },
        {
            id: "M11",
            domain: "lean_startup",
            type: "evaluation",
            question: "Quel principe est central dans le cycle Lean Start-up ?",
            answers: [
                { text: "Stratégie, déploiement, suivi", score: 50 },
                { text: "Construction, mesure, apprentissage", score: 100 },
                { text: "Vision, organisation, exécution", score: 0 }
            ]
        },
        {
            id: "M12",
            domain: "lean_startup",
            type: "evaluation",
            question: "Quel mot reflète le mieux l'attitude attendue dans une démarche Lean Start-up ?",
            answers: [
                { text: "Cause et effet", score: 100 },
                { text: "Apprentissage validé", score: 50 },
                { text: "Croissance rapide", score: 0 }
            ]
        }
    ]
};

// ============================================================================
// DONNÉES DES PROFILS
// ============================================================================

const profilesData = {
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

// ============================================================================
// CONFIGURATION DE L'APPLICATION
// ============================================================================

const appConfig = {
    name: "Diagnostic Innovation",
    version: "2.1.0",
    description: "Evaluez votre profil d'innovateur et celle de votre entreprise",
    author: "Valmen Consulting",
    branding: {
        company_name: "VALMEN",
        company_subtitle: "CONSULTING",
        tagline: "Nous œuvrons pour une digitalisation positive pour l'Humain"
    }
};

// ============================================================================
// API PUBLIQUE
// ============================================================================

/**
 * Retourne les données des questions
 */
function getQuestionsData() {
    console.log('📋 Chargement des questions depuis data.js');
    return questionsData;
}

/**
 * Retourne les données des profils
 */
function getProfilesData() {
    console.log('👤 Chargement des profils depuis data.js');
    return profilesData;
}

/**
 * Retourne la configuration de l'application
 */
function getAppConfig() {
    console.log('⚙️ Chargement de la configuration depuis data.js');
    return appConfig;
}

/**
 * Retourne les questions de méthodes
 */
function getMethodsQuestions() {
    return questionsData.methods;
}

/**
 * Retourne les questions d'organisation
 */
function getOrganizationQuestions() {
    return questionsData.organization;
}

/**
 * Retourne les questions d'identification
 */
function getIdentificationQuestions() {
    return questionsData.identification;
}

/**
 * Retourne les questions de diagnostic
 */
function getDiagnosticQuestions() {
    return questionsData.diagnostic;
}

/**
 * Retourne un profil spécifique
 */
function getProfile(profileId) {
    return profilesData[profileId] || null;
}

/**
 * Analyse les réponses utilisateur et calcule les scores
 */
function analyzeUserResults(userAnswers) {
    console.log('🧮 Analyse des réponses utilisateur...');
    
    const scores = { concepteur: 0, explorateur: 0, impulseur: 0 };
    
    // Compter les réponses par profil
    userAnswers.forEach((answer) => {
        if (answer && answer.profile && scores.hasOwnProperty(answer.profile)) {
            scores[answer.profile]++;
        }
    });
    
    // Calculer les pourcentages
    const total = userAnswers.length;
    const percentages = {};
    Object.keys(scores).forEach(profile => {
        percentages[profile] = total > 0 ? Math.round((scores[profile] / total) * 100) : 0;
    });
    
    // Déterminer le profil dominant
    let maxScore = -1;
    let dominantProfile = 'concepteur';
    
    Object.entries(percentages).forEach(([profile, score]) => {
        if (score > maxScore) {
            maxScore = score;
            dominantProfile = profile;
        }
    });
    
    // Créer le classement
    const ranking = Object.entries(percentages)
        .sort(([,a], [,b]) => b - a)
        .map(([profile, score]) => ({ profile, score }));
    
    console.log('✅ Analyse terminée - Profil dominant:', dominantProfile);
    
    return {
        scores: percentages,
        dominant: dominantProfile,
        ranking: ranking,
        analysis: {
            totalQuestions: total,
            rawScores: scores,
            dominantScore: maxScore
        }
    };
}

/**
 * Valide la structure des données
 */
function validateData() {
    console.log('🔍 Validation des données...');
    
    const errors = [];
    
    // Validation des questions d'identification
    if (!questionsData.identification || questionsData.identification.length === 0) {
        errors.push('Questions d\'identification manquantes');
    }
    
    // Validation des questions d'organisation
    if (!questionsData.organization || questionsData.organization.length === 0) {
        errors.push('Questions d\'organisation manquantes');
    }
    
    // Validation des questions de diagnostic
    if (!questionsData.diagnostic || questionsData.diagnostic.length === 0) {
        errors.push('Questions de diagnostic manquantes');
    }
    
    // Validation des questions de méthodes
    if (!questionsData.methods || questionsData.methods.length === 0) {
        errors.push('Questions de méthodes manquantes');
    }
    
    // Validation des profils
    const requiredProfiles = ['concepteur', 'explorateur', 'impulseur'];
    requiredProfiles.forEach(profile => {
        if (!profilesData[profile]) {
            errors.push(`Profil manquant: ${profile}`);
        }
    });
    
    if (errors.length > 0) {
        console.warn('⚠️ Erreurs de validation:', errors);
        return { valid: false, errors };
    }
    
    console.log('✅ Données validées avec succès');
    return { valid: true, errors: [] };
}

/**
 * Retourne les statistiques des données
 */
function getDataStats() {
    return {
        identification: {
            count: questionsData.identification.length,
            questions: questionsData.identification.map(q => q.id)
        },
        organization: {
            count: questionsData.organization.length,
            questions: questionsData.organization.map(q => q.id)
        },
        diagnostic: {
            count: questionsData.diagnostic.length,
            questions: questionsData.diagnostic.map(q => q.id)
        },
        methods: {
            count: questionsData.methods.length,
            questions: questionsData.methods.map(q => q.id)
        },
        profiles: {
            count: Object.keys(profilesData).length,
            profiles: Object.keys(profilesData)
        },
        version: appConfig.version
    };
}

// ============================================================================
// INITIALISATION AUTOMATIQUE
// ============================================================================

// Validation automatique au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 data.js v2.1.0 minimal chargé');
    
    const validation = validateData();
    if (!validation.valid) {
        console.error('❌ Erreurs dans les données:', validation.errors);
    }
    
    const stats = getDataStats();
    console.log('📊 Statistiques des données:', stats);
});

// ============================================================================
// EXPOSITION GLOBALE
// ============================================================================

// Exposition des fonctions principales pour app.js
window.getQuestionsData = getQuestionsData;
window.getProfilesData = getProfilesData;
window.getAppConfig = getAppConfig;
window.analyzeUserResults = analyzeUserResults;

// Fonctions utilitaires
window.getMethodsQuestions = getMethodsQuestions;
window.getOrganizationQuestions = getOrganizationQuestions;
window.getIdentificationQuestions = getIdentificationQuestions;
window.getDiagnosticQuestions = getDiagnosticQuestions;
window.getProfile = getProfile;
window.validateData = validateData;
window.getDataStats = getDataStats;