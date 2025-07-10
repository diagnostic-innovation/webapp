/**
 * Diagnostic Innovation v2.1.0 - Application Principale
 * Version avec écrans de pause intégrés - COMPLET
 * (c) Valmen Consulting
 */

// Variables globales
let app = {
    currentScreen: 'loading',
    currentQuestionIndex: 0,
    currentSection: 'identification',
    selectedModules: {
        organisation: true,
        profil: false,
        methodes: false
    },
    participant: {},
    answers: {
        identification: [],
        organization: [],
        diagnostic: [],
        methods: []
    },
    questions: {
        identification: [],
        organization: [],
        diagnostic: [],
        methods: []
    },
    profiles: {},
    config: {},
    emailConfig: null,
    security: null,
    isInitialized: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Diagnostic Innovation v2.1.0 - Démarrage');
    await initializeApplication();
});

async function initializeApplication() {
    try {
        showScreen('loading');
        updateLoadingStatus('Initialisation de la sécurité...');
        loadSelectedModules();
        
        if (typeof initializeSecurity === 'function') {
            app.security = initializeSecurity();
            console.log('✅ Sécurité initialisée');
        } else {
            console.warn('⚠️ Module de sécurité non disponible');
        }
        
        updateLoadingStatus('Chargement des questions...');
        await loadApplicationData();
        
        updateLoadingStatus('Configuration des services...');
        await loadEmailConfiguration();
        
        updateLoadingStatus('Finalisation...');
        app.isInitialized = true;
        
        setTimeout(() => {
            showScreen('module-selection');
			initializeModuleSelection();
            console.log('✅ Application initialisée avec succès');
        }, 800);
        
    } catch (error) {
        console.error('❌ Erreur initialisation:', error.message);
        showErrorMessage('Erreur lors de l\'initialisation de l\'application');
    }
}

function loadSelectedModules() {
    try {
        // Force toujours la configuration par défaut (ignore localStorage)
        console.log('🔄 Configuration par défaut appliquée');
        app.selectedModules = {
            organisation: true,
            profil: false,
            methodes: false
        };
        
        const activeSections = [];
        if (app.selectedModules.organisation) activeSections.push('organization');
        if (app.selectedModules.profil) activeSections.push('diagnostic');
        if (app.selectedModules.methodes) activeSections.push('methods');
        
        console.log('📋 Sections actives:', activeSections);
        
    } catch (error) {
        console.error('❌ Erreur chargement modules:', error.message);
        app.selectedModules = {
            organisation: true,
            profil: false,
            methodes: false
        };
    }
}

async function loadApplicationData() {
    try {
        if (typeof getQuestionsData === 'function') {
            const questionsData = getQuestionsData();
            app.questions.identification = questionsData.identification || [];
            app.questions.organization = questionsData.organization || [];
            app.questions.diagnostic = questionsData.diagnostic || [];
            app.questions.methods = questionsData.methods || [];
            console.log('✅ Questions chargées:', {
                identification: app.questions.identification.length,
                organization: app.questions.organization.length,
                diagnostic: app.questions.diagnostic.length,
                methods: app.questions.methods.length
            });
        } else {
            console.warn('⚠️ Questions non disponibles - utilisation des données de base');
            loadFallbackQuestions();
        }
        
        if (typeof getProfilesData === 'function') {
            app.profiles = getProfilesData();
            console.log('✅ Profils chargés');
        } else {
            console.warn('⚠️ Profils non disponibles - utilisation des profils par défaut');
            loadFallbackProfiles();
        }
        
    } catch (error) {
        console.error('❌ Erreur chargement données:', error.message);
        loadFallbackQuestions();
        loadFallbackProfiles();
    }
}

async function loadEmailConfiguration() {
    try {
        console.log('📧 Chargement de la configuration email...');
        const encodedConfig = "eyJlbWFpbCI6eyJlbmFibGVkIjp0cnVlLCJzZXJ2aWNlX2lkIjoic2VydmljZV9hbXNvdmE0IiwidGVtcGxhdGVfaWQiOiJ0ZW1wbGF0ZV81cDk3dnkyIiwicHVibGljX2tleSI6Im5OeVRrTTdVSmIteUtjSmp1IiwidG9fZW1haWwiOiJwbGV0ZW5ldXJAdmFsbWVuLmZyIn19";
        
        app.emailConfig = JSON.parse(atob(encodedConfig));
        
        if (app.emailConfig.email.enabled && app.emailConfig.email.public_key && typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: app.emailConfig.email.public_key });
            console.log('✅ EmailJS initialisé');
        }
        
    } catch (error) {
        console.error('❌ Erreur chargement config email:', error.message);
        app.emailConfig = { email: { enabled: false } };
    }
}

function loadFallbackQuestions() {
    app.questions.identification = [
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
    ];
    
    app.questions.diagnostic = [
        {
            id: "Q1",
            question: "Ce qui me plaît dans un projet c'est :",
            answers: [
                { text: "De rendre les idées concrètes", profile: "concepteur" },
                { text: "D'imaginer des concepts", profile: "explorateur" },
                { text: "De fédérer une équipe", profile: "impulseur" }
            ]
        }
    ];
}

function loadFallbackProfiles() {
    app.profiles = {
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

// Gestion des écrans
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    
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

// Gestion des écrans de pause - Corrections majeures
function ensureModulesLoaded() {
    if (!app.selectedModules || !app.selectedModules.organisation) {
        console.log('🔄 Rechargement des modules sélectionnés');
        loadSelectedModules();
    }
    
    if (!app.selectedModules.organisation) {
        console.warn('⚠️ Module organisation manquant - configuration par défaut');
        app.selectedModules = {
            organisation: true,
            profil: true,
            methodes: false
        };
    }
    
    console.log('✅ Modules validés:', app.selectedModules);
}

function getNextOptionalSection() {
    ensureModulesLoaded();
    
    if (app.currentSection === 'diagnostic' && 
        app.selectedModules.methodes && 
        (!app.answers.methods || app.answers.methods.length === 0)) {
        console.log('➡️ Progression: diagnostic → methods');
        return 'methods';
    }
    
    if (app.currentSection === 'methods' && 
        app.selectedModules.profil && 
        (!app.answers.diagnostic || app.answers.diagnostic.length === 0)) {
        console.log('➡️ Progression: methods → diagnostic');
        return 'diagnostic';
    }
    
    console.log('ℹ️ Aucune section optionnelle suivante');
    return null;
}

function getNextActiveSection() {
    ensureModulesLoaded();
    
    if (app.selectedModules.profil && 
        (!app.answers.diagnostic || app.answers.diagnostic.length === 0)) {
        console.log('➡️ Prochaine section: diagnostic');
        return 'diagnostic';
    }
    
    if (app.selectedModules.methodes && 
        (!app.answers.methods || app.answers.methods.length === 0)) {
        console.log('➡️ Prochaine section: methods');
        return 'methods';
    }
    
    console.log('ℹ️ Aucune section active suivante');
    return null;
}

function updateSelectedModulesDisplay() {
    const modulesList = document.getElementById('selectedModulesList');
    const remainingText = document.getElementById('remainingModulesText');
    
    if (!modulesList || !remainingText) {
        console.warn('⚠️ Éléments DOM manquants pour updateSelectedModulesDisplay');
        return false;
    }
    
    ensureModulesLoaded();
    
    const selectedOptionalModules = [];
    
    if (app.selectedModules.profil) {
        selectedOptionalModules.push('👤 Profil innovateur : 10 min');
    }
    if (app.selectedModules.methodes) {
        selectedOptionalModules.push('🔧 Niveau méthodologique : 15 min');
    }
    
    if (selectedOptionalModules.length > 0) {
        remainingText.textContent = 'À venir selon votre sélection :';
        modulesList.innerHTML = selectedOptionalModules.join('<br>');
    } else {
        remainingText.textContent = 'Aucun module optionnel sélectionné.';
        modulesList.innerHTML = 'Vous allez directement aux résultats.';
    }
    
    console.log('📋 Affichage des modules restants mis à jour');
    return true;
}

function showPauseBetweenOptionals(completedSection) {
    console.log(`⏸️ Affichage pause après ${completedSection}`);
    
    const config = {
        diagnostic: {
            title: '📊 PROFIL INNOVATEUR TERMINÉ',
            completed: '👤 Profil innovateur : ✅ Terminé',
            next: '🔧 Niveau méthodologique : 15 minutes'
        },
        methods: {
            title: '📊 NIVEAU MÉTHODOLOGIQUE TERMINÉ', 
            completed: '🔧 Niveau méthodologique : ✅ Terminé',
            next: '👤 Profil innovateur : 10 minutes'
        }
    };
    
    const info = config[completedSection];
    if (!info) {
        console.error(`❌ Configuration manquante pour ${completedSection}`);
        return false;
    }
    
    const elements = {
        pauseTitle: document.getElementById('pause-title'),
        completedModule: document.getElementById('completed-module'),
        nextModuleInfo: document.getElementById('next-module-info'),
        remainingTimeText: document.getElementById('remaining-time-text')
    };
    
    let allElementsFound = true;
    Object.entries(elements).forEach(([name, element]) => {
        if (!element) {
            console.warn(`⚠️ Élément DOM manquant: ${name}`);
            allElementsFound = false;
        }
    });
    
    if (!allElementsFound) {
        console.error('❌ Éléments DOM manquants pour l\'écran de pause');
        return false;
    }
    
    elements.pauseTitle.textContent = info.title;
    elements.completedModule.textContent = info.completed;
    elements.nextModuleInfo.textContent = info.next;
    elements.remainingTimeText.textContent = 'Temps restant estimé :';
    
    showScreen('pause-entre-optionnels');
    return true;
}

function showOrganizationCompleteScreen() {
    console.log('📊 Affichage écran remerciement organisation');
    
    const displayUpdated = updateSelectedModulesDisplay();
    
    if (!displayUpdated) {
        console.warn('⚠️ Mise à jour affichage modules échouée');
    }
    
    showScreen('remerciement-organisation');
    
    // 🔧 FIX: Réparer les boutons après affichage
    setTimeout(fixRemerciementButtons, 100);
    
    return true;
}

function initializeAnswers() {
    if (!app.answers) {
        app.answers = {};
    }
    
    if (!Array.isArray(app.answers.identification)) {
        app.answers.identification = [];
    }
    if (!Array.isArray(app.answers.organization)) {
        app.answers.organization = [];
    }
    if (!Array.isArray(app.answers.diagnostic)) {
        app.answers.diagnostic = [];
    }
    if (!Array.isArray(app.answers.methods)) {
        app.answers.methods = [];
    }
    
    console.log('✅ Tableaux de réponses initialisés');
}

// Gestion des écrans de pause - Corrections mineures
function continueToSelectedModules() {
    console.log('➡️ Continuation vers les modules sélectionnés');
    
    try {
        ensureModulesLoaded();
        
        const nextSection = getNextActiveSection();
        
        if (nextSection) {
            app.currentSection = nextSection;
            app.currentQuestionIndex = 0;
            
            showScreen('questionnaire');
            showCurrentQuestion();
            console.log(`✅ Transition vers ${nextSection}`);
        } else {
            console.log('ℹ️ Aucun module optionnel - passage aux résultats');
            calculateAndShowResults();
        }
    } catch (error) {
        console.error('❌ Erreur dans continueToSelectedModules:', error.message);
        showScreen('identification');
    }
}

function continueToNextOptional() {
    console.log('➡️ Continuation vers le questionnaire optionnel suivant');
    
    try {
        ensureModulesLoaded();
        
        const nextSection = getNextOptionalSection();
        
        if (nextSection) {
            app.currentSection = nextSection;
            app.currentQuestionIndex = 0;
            
            showScreen('questionnaire');
            showCurrentQuestion();
            console.log(`✅ Transition vers ${nextSection}`);
        } else {
            console.log('ℹ️ Fin des questionnaires - passage aux résultats');
            calculateAndShowResults();
        }
    } catch (error) {
        console.error('❌ Erreur dans continueToNextOptional:', error.message);
        calculateAndShowResults();
    }
}

function modifyOrganisationResponses() {
    console.log('🔄 Modification des réponses organisation demandée');
    
    try {
        initializeAnswers();
        
              
        app.currentSection = 'organization';
        app.currentQuestionIndex = 0;
        
        showScreen('questionnaire');
        showCurrentQuestion();
        console.log('✅ Retour au questionnaire organisation');
    } catch (error) {
        console.error('❌ Erreur dans modifyOrganisationResponses:', error.message);
        showScreen('identification');
    }
}

function modifyCurrentQuestionnaire() {
    console.log('🔄 Modification du questionnaire en cours demandée');
    
    try {
        initializeAnswers();
        
        if (app.currentSection === 'diagnostic') {
            app.answers.diagnostic = [];
            console.log('🗑️ Réponses diagnostic réinitialisées');
        } else if (app.currentSection === 'methods') {
            app.answers.methods = [];
            console.log('🗑️ Réponses méthodes réinitialisées');
        } else {
            console.warn(`⚠️ Section non reconnue pour modification: ${app.currentSection}`);
        }
        
        app.currentQuestionIndex = 0;
        
        showScreen('questionnaire');
        showCurrentQuestion();
        console.log(`✅ Retour au début du questionnaire ${app.currentSection}`);
    } catch (error) {
        console.error('❌ Erreur dans modifyCurrentQuestionnaire:', error.message);
        calculateAndShowResults();
    }
}

function shouldShowPauseBetweenOptionals() {
    try {
        ensureModulesLoaded();
        
        const bothSelected = app.selectedModules.profil && app.selectedModules.methodes;
        
        console.log('🔍 Vérification pause entre optionnels:', {
            profil: app.selectedModules.profil,
            methodes: app.selectedModules.methodes,
            shouldShowPause: bothSelected
        });
        
        return bothSelected;
    } catch (error) {
        console.error('❌ Erreur dans shouldShowPauseBetweenOptionals:', error.message);
        return false;
    }
}

function handleOptionalQuestionnaireComplete() {
    const currentSection = app.currentSection;
    console.log(`📊 Fin questionnaire optionnel: ${currentSection}`);
    
    try {
        ensureModulesLoaded();
        
        const hasNextOptional = getNextOptionalSection() !== null;
        const shouldShowPause = shouldShowPauseBetweenOptionals();
        
        console.log('🔍 Analyse fin questionnaire:', {
            currentSection,
            hasNextOptional,
            shouldShowPause
        });
        
        if (hasNextOptional && shouldShowPause) {
            const pauseShown = showPauseBetweenOptionals(currentSection);
            if (!pauseShown) {
                throw new Error('Impossible d\'afficher l\'écran de pause');
            }
        } else {
            console.log('ℹ️ Passage direct aux résultats');
            calculateAndShowResults();
        }
    } catch (error) {
        console.error('❌ Erreur dans handleOptionalQuestionnaireComplete:', error.message);
        calculateAndShowResults();
    }
}

function debugApplicationState() {
    console.group('🔍 État de l\'application - Écrans de pause');
    
    console.log('📋 Modules sélectionnés:', app.selectedModules);
    console.log('📊 Section courante:', app.currentSection);
    console.log('❓ Question courante:', app.currentQuestionIndex);
    
    console.log('📝 Réponses:');
    console.log('  - Organization:', app.answers.organization?.length || 0, 'réponses');
    console.log('  - Diagnostic:', app.answers.diagnostic?.length || 0, 'réponses');
    console.log('  - Methods:', app.answers.methods?.length || 0, 'réponses');
    
    console.log('🎯 Prochaines sections possibles:');
    console.log('  - Active:', getNextActiveSection());
    console.log('  - Optionnelle:', getNextOptionalSection());
    console.log('  - Pause nécessaire:', shouldShowPauseBetweenOptionals());
    
    console.groupEnd();
}

function validateEnvironment() {
    const requiredFunctions = [
        'showScreen',
        'showCurrentQuestion', 
        'calculateAndShowResults'
    ];
    
    const missing = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    
    if (missing.length > 0) {
        console.error('❌ Fonctions manquantes:', missing);
        return false;
    }
    
    const requiredElements = [
        'selectedModulesList',
        'remainingModulesText',
        'pause-title',
        'completed-module'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Éléments DOM manquants:', missingElements);
    }
    
    return true;
}

// Gestion du participant
function startDiagnostic() {
    try {
        const name = document.getElementById('participantName')?.value.trim();
        const company = document.getElementById('participantCompany')?.value.trim();
        const email = document.getElementById('participantEmail')?.value.trim();
        const role = document.getElementById('participantRole')?.value;
        const direction = document.getElementById('participantDirection')?.value;
        
        if (!name) {
            showErrorMessage('Veuillez entrer votre nom');
            return;
        }
        if (!company) {
			showErrorMessage('Veuillez entrer le nom de votre entreprise');
			return;
		}
        if (!role) {
            showErrorMessage('Veuillez sélectionner votre rôle');
            return;
        }
        
        if (!direction) {
            showErrorMessage('Veuillez sélectionner votre direction');
            return;
        }
        
        app.participant = { name, company, email, role, direction };
        
        app.answers.identification = [
            { questionId: "I4", value: role, text: role },
            { questionId: "I5", value: direction, text: direction }
        ];
        
        if (app.security) {
            app.security.storeUserData('participant', app.participant);
        }
        
        initializeQuestionnaire();
        
        showScreen('questionnaire');
        
        console.log('🎯 Diagnostic démarré pour:', name, '- Rôle:', role, '- Direction:', direction);
        
    } catch (error) {
        console.error('❌ Erreur démarrage diagnostic:', error.message);
        showErrorMessage('Erreur lors du démarrage du diagnostic');
    }
}

function initializeQuestionnaire() {
    ensureModulesLoaded();
    initializeAnswers();
    
    app.currentQuestionIndex = 0;
    
    app.currentSection = 'organization';
    
    app.answers.organization = [];
    app.answers.diagnostic = [];
    app.answers.methods = [];
    
    console.log('🎯 Questionnaire initialisé - Section: organization');
    console.log('📋 Modules sélectionnés:', app.selectedModules);
    
    showCurrentQuestion();
}

function getFirstActiveSection() {
    if (app.selectedModules.organisation) return 'organization';
    if (app.selectedModules.profil) return 'diagnostic';
    if (app.selectedModules.methodes) return 'methods';
    
    return 'organization';
}

// Gestion du questionnaire avec écrans de pause
function showCurrentQuestion() {
    const currentQuestions = app.questions[app.currentSection];
    
    if (app.currentQuestionIndex >= currentQuestions.length) {
        const nextSection = getNextActiveSection();
        
        if (nextSection) {
            app.currentSection = nextSection;
            app.currentQuestionIndex = 0;
            showCurrentQuestion();
            return;
        } else {
            showValidateButton();
            return;
        }
    }
    
    const question = currentQuestions[app.currentQuestionIndex];
    
	const questionElement = document.getElementById('current-question');
	if (questionElement) {
    const totalQuestions = currentQuestions.length;
    const questionNumber = app.currentQuestionIndex + 1;
    questionElement.innerHTML = `
        <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
            Question ${questionNumber} sur ${totalQuestions}
        </div>
        ${question.question}
    `;
}
    
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
	    // 🔧 FIX: Force l'affichage des boutons de navigation
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    if (nextBtn) nextBtn.style.display = 'block';
    if (prevBtn) prevBtn.style.display = 'block';
	
    // 🔧 FIX: Restaurer la sélection visuelle des réponses
    setTimeout(() => {
        const currentAnswers = app.answers[app.currentSection];
        if (currentAnswers && currentAnswers[app.currentQuestionIndex]) {
            const selectedIndex = currentAnswers[app.currentQuestionIndex].answerIndex;
            const options = document.querySelectorAll('.answer-option');
            if (options[selectedIndex]) {
                options[selectedIndex].classList.add('selected');
            }
        }
    }, 50);	
	}

function selectAnswer(answerIndex) {
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelectorAll('.answer-option')[answerIndex];
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    const currentQuestions = app.questions[app.currentSection];
    const question = currentQuestions[app.currentQuestionIndex];
    
    if (question) {
        const answerData = {
            questionId: question.id,
            question: question.question,
            questionIndex: app.currentQuestionIndex,
            answerIndex: answerIndex,
            text: question.answers[answerIndex].text
        };
        
        if (app.currentSection === 'identification') {
            answerData.value = question.answers[answerIndex].value;
        } else if (app.currentSection === 'organization') {
            answerData.value = question.answers[answerIndex].value;
            answerData.thematic = question.thematic;
        } else if (app.currentSection === 'diagnostic') {
            answerData.profile = question.answers[answerIndex].profile;
        } else if (app.currentSection === 'methods') {
            answerData.score = question.answers[answerIndex].score;
            answerData.domain = question.domain;
            answerData.type = question.type;
        }
        
        app.answers[app.currentSection][app.currentQuestionIndex] = answerData;
    }
    
    updateNavigationButtons();
    
    if (app.security) {
        app.security.logSecurityEvent('ANSWER_SELECTED', {
            section: app.currentSection,
            questionIndex: app.currentQuestionIndex,
            answerIndex: answerIndex
        });
    }
}

function nextQuestion() {
    const currentQuestions = app.questions[app.currentSection];
    
    if (app.currentQuestionIndex < currentQuestions.length - 1) {
        app.currentQuestionIndex++;
        showCurrentQuestion();
    } else {
        console.log(`📋 Dernière question de ${app.currentSection}`);
        showValidateButton();
    }
}

function previousQuestion() {
    if (app.currentQuestionIndex > 0) {
        app.currentQuestionIndex--;
        showCurrentQuestion();
        
        setTimeout(() => {
            const currentAnswers = app.answers[app.currentSection];
            if (currentAnswers[app.currentQuestionIndex]) {
                const selectedIndex = currentAnswers[app.currentQuestionIndex].answerIndex;
                const options = document.querySelectorAll('.answer-option');
                if (options[selectedIndex]) {
                    options[selectedIndex].classList.add('selected');
                }
            }
        }, 50);
        
    } else {
        const prevSection = getPreviousActiveSection();
        
        if (prevSection) {
            app.currentSection = prevSection;
            app.currentQuestionIndex = app.questions[prevSection].length - 1;
            showCurrentQuestion();
            
            setTimeout(() => {
                const currentAnswers = app.answers[app.currentSection];
                if (currentAnswers[app.currentQuestionIndex]) {
                    const selectedIndex = currentAnswers[app.currentQuestionIndex].answerIndex;
                    const options = document.querySelectorAll('.answer-option');
                    if (options[selectedIndex]) {
                        options[selectedIndex].classList.add('selected');
                    }
                }
            }, 50);
        } else {
            console.log('🔙 Retour à l\'identification');
            showScreen('identification');
        }
    }
}

function getPreviousActiveSection() {
    const sectionOrder = ['organization', 'diagnostic', 'methods'];
    const currentIndex = sectionOrder.indexOf(app.currentSection);
    
    for (let i = currentIndex - 1; i >= 0; i--) {
        const section = sectionOrder[i];
        
        if (section === 'organization' && app.selectedModules.organisation) return section;
        if (section === 'diagnostic' && app.selectedModules.profil) return section;
        if (section === 'methods' && app.selectedModules.methodes) return section;
    }
    
    return null;
}

function showValidateButton() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const validateBtn = document.getElementById('validate-btn');
    
    if (prevBtn) {
        prevBtn.style.display = 'block';
        prevBtn.disabled = false;
    }
    
    if (nextBtn) nextBtn.style.display = 'none';
    
    const currentSection = app.currentSection;
    
    if (currentSection === 'organization') {
        if (validateBtn) validateBtn.style.display = 'none';
        
        setTimeout(() => {
            showOrganizationCompleteScreen();
        }, 500);
        
    } else if (currentSection === 'diagnostic' || currentSection === 'methods') {
        if (validateBtn) validateBtn.style.display = 'none';
        
        setTimeout(() => {
            handleOptionalQuestionnaireComplete();
        }, 500);
        
    } else {
        if (validateBtn) validateBtn.style.display = 'block';
    }
    
    console.log(`✅ Fin de section ${currentSection} gérée`);
}

function updateProgress() {
    let totalQuestions = 0;
    let completedQuestions = 0;
    
    if (app.selectedModules.organisation) {
        totalQuestions += app.questions.organization.length;
        completedQuestions += app.answers.organization.length;
    }
    
    if (app.selectedModules.profil) {
        totalQuestions += app.questions.diagnostic.length;
        completedQuestions += app.answers.diagnostic.length;
    }
    
    if (app.selectedModules.methodes) {
        totalQuestions += app.questions.methods.length;
        completedQuestions += app.answers.methods.length;
    }
    
    const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    console.log(`📊 Progression: ${completedQuestions}/${totalQuestions} (${Math.round(progress)}%)`);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    const currentAnswers = app.answers[app.currentSection];
    
    prevBtn.disabled = (app.currentSection === 'identification' && app.currentQuestionIndex === 0);
    
    nextBtn.disabled = !currentAnswers[app.currentQuestionIndex];
    
    if (app.currentSection === 'diagnostic' && 
        app.currentQuestionIndex === app.questions.diagnostic.length - 1 && 
        currentAnswers[app.currentQuestionIndex]) {
        nextBtn.textContent = 'Dernière question →';
    } else {
        nextBtn.textContent = 'Suivant →';
    }
}

// Validation et calcul des résultats
function validateAndShowResults() {
    if (!isQuestionnaireComplete()) {
        showErrorMessage('Veuillez répondre à toutes les questions avant de valider');
        return;
    }
    
    calculateAndShowResults();
}

function isQuestionnaireComplete() {
    const organizationComplete = !app.selectedModules.organisation || 
        app.answers.organization.length === app.questions.organization.length;
    
    const diagnosticComplete = !app.selectedModules.profil || 
        app.answers.diagnostic.length === app.questions.diagnostic.length;
    
    const methodsComplete = !app.selectedModules.methodes || 
        app.answers.methods.length === app.questions.methods.length;
    
    return organizationComplete && diagnosticComplete && methodsComplete;
}

function calculateAndShowResults() {
    try {
        console.log('🧮 Calcul des résultats...');
        
        const scores = calculateProfileScores();
        const dominant = getDominantProfile(scores);
        const ranking = getRanking(scores);
        
        const methodsResults = calculateMethodsResults();
        
        const results = {
            participant: app.participant,
            identification: app.answers.identification,
            organization: app.answers.organization,
            methods: app.answers.methods,
            scores: scores,
            dominant: dominant,
            ranking: ranking,
            methodsResults: methodsResults,
            timestamp: new Date().toISOString()
        };
        
        if (app.security) {
            app.security.storeUserData('results', results);
        }
        
        // Affichage des résultats selon les modules sélectionnés
			displayResultsConditional(results);
        
        showScreen('results');
        
        setTimeout(() => {
            sendResultsByEmail(results);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur calcul résultats:', error.message);
        showErrorMessage('Erreur lors du calcul des résultats');
    }
}

function calculateProfileScores() {
    const scores = { concepteur: 0, explorateur: 0, impulseur: 0 };
    
    app.answers.diagnostic.forEach((answer) => {
        if (answer && answer.profile && scores.hasOwnProperty(answer.profile)) {
            scores[answer.profile]++;
        }
    });
    
    const total = app.answers.diagnostic.length;
    const percentages = {};
    Object.keys(scores).forEach(profile => {
        percentages[profile] = total > 0 ? Math.round((scores[profile] / total) * 100) : 0;
    });
    
    return percentages;
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

function calculateMethodsResults() {
    console.log('🔧 Calcul des scores méthodologiques...');
    
    const results = {};
    
    ['agilite', 'design_thinking', 'lean_startup'].forEach(domain => {
        const domainAnswers = app.answers.methods.filter(a => a.domain === domain);
        
        const autoEval = domainAnswers.find(a => a.type === 'auto_eval');
        
        const evaluations = domainAnswers.filter(a => a.type === 'evaluation');
        
        const calculatedScore = evaluations.length > 0 ? 
            evaluations.reduce((sum, a) => sum + a.score, 0) / evaluations.length : 0;
        
        results[domain] = {
            autoEval: autoEval ? autoEval.score : 0,
            calculated: calculatedScore
        };
        
        console.log(`   ${domain}: perception=${results[domain].autoEval}%, réel=${Math.round(results[domain].calculated)}%`);
    });
    
    console.log('✅ Scores méthodologiques calculés');
    return results;
}

function displayResults(results) {
    const timestampElement = document.getElementById('resultsTimestamp');
    if (timestampElement) {
        timestampElement.textContent = 
            `Résultats générés le ${new Date().toLocaleString()}`;
    }
    
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        
        results.ranking.forEach((item, index) => {
            const profile = app.profiles[item.profile];
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
    
    if (results.methodsResults) {
        displayMethodsResults(results.methodsResults);
    }
    
    console.log('✅ Résultats affichés');
}

function displayMethodsResults(methodsResults) {
    // 🔧 FIX: Ne pas afficher si le module méthodes n'est pas sélectionné
    if (!app.selectedModules.methodes) {
        const methodsDetailsList = document.getElementById('methodsDetailsList');
        if (methodsDetailsList) {
            methodsDetailsList.style.display = 'none';
            // Masquer aussi le titre de la section
            methodsDetailsList.previousElementSibling.style.display = 'none';
        }
        console.log('🚫 Module méthodes non sélectionné - section masquée');
        return;
    }
    
    // S'assurer que la section est visible si le module est sélectionné
    const methodsDetailsList = document.getElementById('methodsDetailsList');
    if (methodsDetailsList) {
        methodsDetailsList.style.display = 'grid';
        methodsDetailsList.previousElementSibling.style.display = 'block';
    }

	const methodIcons = {
        agilite: "⚡",
        design_thinking: "🎨", 
        lean_startup: "🚀"
    };
    
    const domainLabels = {
        agilite: "Agilité",
        design_thinking: "Design Thinking", 
        lean_startup: "Lean Start-up"
    };

    if (!methodsDetailsList) {
        console.warn('⚠️ Element methodsDetailsList non trouvé');
        return;
    }
    
    methodsDetailsList.innerHTML = Object.keys(methodsResults).map(domain => {
        const perceptionScore = methodsResults[domain].autoEval;
        const realScore = Math.round(methodsResults[domain].calculated);
        const difference = realScore - perceptionScore;
        
        let barColor = '#667eea';
        let diffMessage = '';
        
        if (difference > 15) {
            barColor = '#28a745';
            diffMessage = 'Vous vous sous-estimez !';
        } else if (difference < -15) {
            barColor = '#ffc107';
            diffMessage = 'Écart important détecté';
        } else {
            barColor = '#17a2b8';
            diffMessage = 'Auto-évaluation cohérente';
        }

        return `
            <div style="
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 25px;
                text-align: center;
                border: 2px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 35px rgba(0,0,0,0.2)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 2.5em; margin-bottom: 10px;">${methodIcons[domain]}</div>
                    <h3 style="font-size: 1.2em; font-weight: bold; color: white; margin-bottom: 5px;">
                        ${domainLabels[domain]}
                    </h3>
                    <p style="font-size: 0.85em; color: rgba(255,255,255,0.7); margin-bottom: 10px;">
                        ${diffMessage}
                    </p>
                </div>

                <div style="margin: 20px 0; flex-grow: 1;">
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 0.9em; color: rgba(255,255,255,0.9);">👁️ Perception</span>
                            <span style="font-size: 1.1em; font-weight: bold; color: white;">${perceptionScore}%</span>
                        </div>
                        <div style="
                            width: 100%;
                            height: 8px;
                            background: rgba(255,255,255,0.2);
                            border-radius: 10px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${perceptionScore}%;
                                height: 100%;
                                background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.8));
                                border-radius: 10px;
                                transition: width 0.8s ease;
                            "></div>
                        </div>
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 0.9em; color: rgba(255,255,255,0.9);">📊 Niveau réel</span>
                            <span style="font-size: 1.1em; font-weight: bold; color: white;">${realScore}%</span>
                        </div>
                        <div style="
                            width: 100%;
                            height: 8px;
                            background: rgba(255,255,255,0.2);
                            border-radius: 10px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${realScore}%;
                                height: 100%;
                                background: ${barColor};
                                border-radius: 10px;
                                transition: width 0.8s ease;
                                box-shadow: 0 0 10px rgba(255,255,255,0.3);
                            "></div>
                        </div>
                    </div>
                </div>

                <div style="
                    margin-top: 15px;
                    padding: 10px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    font-size: 0.85em;
                    color: rgba(255,255,255,0.8);
                ">
                    Écart: ${difference > 0 ? '+' : ''}${difference} points
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Résultats méthodologiques affichés');
}
// ============================================================================
// AFFICHAGE CONDITIONNEL DES RÉSULTATS SELON LES MODULES SÉLECTIONNÉS
// ============================================================================

function displayResultsConditional(results) {
    // Mise à jour du timestamp
    const timestampElement = document.getElementById('resultsTimestamp');
    if (timestampElement) {
        timestampElement.textContent = 
            `Résultats générés le ${new Date().toLocaleString()}`;
    }
    
    // Affichage conditionnel des résultats profils
    if (app.selectedModules.profil) {
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.style.display = 'flex';
            resultsContainer.innerHTML = '';
            
            results.ranking.forEach((item, index) => {
                const profile = app.profiles[item.profile];
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
    } else {
        // Masquer la section profil
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
    
    // Affichage conditionnel des méthodes
    if (results.methodsResults && app.selectedModules.methodes) {
        displayMethodsResults(results.methodsResults);
    }
    
    console.log('✅ Résultats affichés selon sélection');
}
// Envoi par email
function sendResultsByEmail(results) {
    if (!app.emailConfig || !app.emailConfig.email.enabled) {
        console.log('📧 Email non configuré');
        return;
    }
    
    try {
        console.log('📧 Envoi des résultats par email...');
        
        const emailConfig = app.emailConfig.email;
        const date = new Date().toLocaleString('fr-FR');
        
        const templateParams = {
            to_email: emailConfig.to_email,
            subject: `Diagnostic Innovation v2.1.0 - ${results.participant.company || results.participant.name}`,
            participant_name: results.participant.name,
			participant_email: results.participant.email || 'Non fourni',
            participant_company: results.participant.company || 'Non précisée',
            role: results.identification[0]?.value || 'Non précisé',
            direction: results.identification[1]?.value || 'Non précisé',
            dominant_profile: results.dominant,
            score_concepteur: results.scores.concepteur || 0,
            score_explorateur: results.scores.explorateur || 0,
            score_impulseur: results.scores.impulseur || 0,
            timestamp: results.timestamp,
            date: date,
            version: '2.1.0',
            
            agilite_perception: results.methodsResults?.agilite?.autoEval || 0,
            agilite_reel: Math.round(results.methodsResults?.agilite?.calculated || 0),
            design_thinking_perception: results.methodsResults?.design_thinking?.autoEval || 0,
            design_thinking_reel: Math.round(results.methodsResults?.design_thinking?.calculated || 0),
            lean_startup_perception: results.methodsResults?.lean_startup?.autoEval || 0,
            lean_startup_reel: Math.round(results.methodsResults?.lean_startup?.calculated || 0),
            
            e1_thematique: results.organization[0]?.thematic || '',
            e1_question_id: results.organization[0]?.questionId || '',
            e1_choice: results.organization[0]?.question || '',
            e1_answer_id: results.organization[0]?.value || '',
            e1_text: results.organization[0]?.text || '',
            
            e2_thematique: results.organization[1]?.thematic || '',
            e2_question_id: results.organization[1]?.questionId || '',
            e2_choice: results.organization[1]?.question || '',
            e2_answer_id: results.organization[1]?.value || '',
            e2_text: results.organization[1]?.text || '',
            
            e3_thematique: results.organization[2]?.thematic || '',
            e3_question_id: results.organization[2]?.questionId || '',
            e3_choice: results.organization[2]?.question || '',
            e3_answer_id: results.organization[2]?.value || '',
            e3_text: results.organization[2]?.text || '',
            
            e4_thematique: results.organization[3]?.thematic || '',
            e4_question_id: results.organization[3]?.questionId || '',
            e4_choice: results.organization[3]?.question || '',
            e4_answer_id: results.organization[3]?.value || '',
            e4_text: results.organization[3]?.text || '',
            
            e5_thematique: results.organization[4]?.thematic || '',
            e5_question_id: results.organization[4]?.questionId || '',
            e5_choice: results.organization[4]?.question || '',
            e5_answer_id: results.organization[4]?.value || '',
            e5_text: results.organization[4]?.text || '',
            
            e6_thematique: results.organization[5]?.thematic || '',
            e6_question_id: results.organization[5]?.questionId || '',
            e6_choice: results.organization[5]?.question || '',
            e6_answer_id: results.organization[5]?.value || '',
            e6_text: results.organization[5]?.text || '',
            
            e7_thematique: results.organization[6]?.thematic || '',
            e7_question_id: results.organization[6]?.questionId || '',
            e7_choice: results.organization[6]?.question || '',
            e7_answer_id: results.organization[6]?.value || '',
            e7_text: results.organization[6]?.text || '',
            
            e8_thematique: results.organization[7]?.thematic || '',
            e8_question_id: results.organization[7]?.questionId || '',
            e8_choice: results.organization[7]?.question || '',
            e8_answer_id: results.organization[7]?.value || '',
            e8_text: results.organization[7]?.text || '',
            
            e9_thematique: results.organization[8]?.thematic || '',
            e9_question_id: results.organization[8]?.questionId || '',
            e9_choice: results.organization[8]?.question || '',
            e9_answer_id: results.organization[8]?.value || '',
            e9_text: results.organization[8]?.text || '',
            
            e10_thematique: results.organization[9]?.thematic || '',
            e10_question_id: results.organization[9]?.questionId || '',
            e10_choice: results.organization[9]?.question || '',
            e10_answer_id: results.organization[9]?.value || '',
            e10_text: results.organization[9]?.text || '',
            
            e11_thematique: results.organization[10]?.thematic || '',
            e11_question_id: results.organization[10]?.questionId || '',
            e11_choice: results.organization[10]?.question || '',
            e11_answer_id: results.organization[10]?.value || '',
            e11_text: results.organization[10]?.text || ''
        };
        
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

// Gestion des erreurs et notifications
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

// Actions utilisateur
function restartDiagnostic() {
    try {
        console.log('🔄 Redémarrage du diagnostic...');
        
        const confirmRestart = confirm('Êtes-vous sûr de vouloir recommencer ? Toutes vos réponses seront supprimées.');
        
        if (!confirmRestart) {
    return;
}

// 🔧 FIX: Vider le localStorage pour éviter que les modules restent cochés
		localStorage.removeItem('selectedModules');
		
// 🔧 FIX: Réinitialiser aussi la variable app.selectedModules
		app.selectedModules = {
		organisation: true,
		profil: false,
		methodes: false
};		

app.participant = {};
        
        app.participant = {};
        app.answers.identification = [];
        app.answers.organization = [];
        app.answers.diagnostic = [];
        app.answers.methods = [];
        app.currentQuestionIndex = 0;
        app.currentSection = getFirstActiveSection();
        
        const nameInput = document.getElementById('participantName');
        const companyInput = document.getElementById('participantCompany');
        const emailInput = document.getElementById('participantEmail');
        const roleSelect = document.getElementById('participantRole');
        const directionSelect = document.getElementById('participantDirection');
        
        if (nameInput) nameInput.value = '';
        if (companyInput) companyInput.value = '';
        if (emailInput) emailInput.value = '';
        if (roleSelect) roleSelect.value = '';
        if (directionSelect) directionSelect.value = '';
        
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const validateBtn = document.getElementById('validate-btn');
        
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
        if (validateBtn) validateBtn.style.display = 'none';
        
        showScreen('module-selection');
        initializeModuleSelection();
        console.log('✅ Diagnostic redémarré');
        
    } catch (error) {
        console.error('❌ Erreur redémarrage:', error.message);
        location.reload();
    }
}

// API publique pour les événements HTML
window.startDiagnostic = startDiagnostic;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.validateAndShowResults = validateAndShowResults;
window.restartDiagnostic = restartDiagnostic;

// Fonctions pour les écrans de pause
window.modifyOrganisationResponses = modifyOrganisationResponses;
window.continueToSelectedModules = continueToSelectedModules;
window.modifyCurrentQuestionnaire = modifyCurrentQuestionnaire;
window.continueToNextOptional = continueToNextOptional;
window.updateSelectedModulesDisplay = updateSelectedModulesDisplay;
window.showOrganizationCompleteScreen = showOrganizationCompleteScreen;
window.showPauseBetweenOptionals = showPauseBetweenOptionals;
window.handleOptionalQuestionnaireComplete = handleOptionalQuestionnaireComplete;
window.shouldShowPauseBetweenOptionals = shouldShowPauseBetweenOptionals;

// Fonctions utilitaires
window.getNextOptionalSection = getNextOptionalSection;
window.getNextActiveSection = getNextActiveSection;
window.ensureModulesLoaded = ensureModulesLoaded;
window.initializeAnswers = initializeAnswers;
window.debugApplicationState = debugApplicationState;
window.validateEnvironment = validateEnvironment;

// Fix pour les boutons de l'écran remerciement organisation
function fixRemerciementButtons() {
    const continueBtn = document.querySelector('button[onclick="continueToSelectedModules()"]');
    if (continueBtn) {
        // Supprimer l'ancien onclick et ajouter un nouveau listener
        continueBtn.removeAttribute('onclick');
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            continueToSelectedModules();
        });
        console.log('🔧 Bouton Continuer réparé');
    }
}

// Appeler le fix quand on affiche l'écran
window.addEventListener('load', fixRemerciementButtons);

// ============================================================================
// GESTION DE LA SÉLECTION DES MODULES
// ============================================================================

function validateModuleSelection() {
    // Vérifier qu'au moins un module optionnel est sélectionné
    const hasOptional = app.selectedModules.profil || app.selectedModules.methodes;
    
    if (!hasOptional) {
        document.getElementById('validationError').style.display = 'block';
        return;
    }
    
    document.getElementById('validationError').style.display = 'none';
    
    // Sauvegarder la sélection
    localStorage.setItem('selectedModules', JSON.stringify(app.selectedModules));
    
    // Passer à l'identification
    showScreen('identification');
}

function initializeModuleSelection() {
    // 🔧 FIX: Supprimer les anciens événements et recloner les cartes
    document.querySelectorAll('.module-card').forEach(card => {
        const module = card.dataset.module;
        
        // Supprimer tous les anciens événements en clonant l'élément
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Réattacher l'événement sur la nouvelle carte
        newCard.addEventListener('click', function() {
            // Le module organisation est obligatoire
            if (module === 'organisation') {
                return;
            }
            
            // Toggle de la sélection
            app.selectedModules[module] = !app.selectedModules[module];
            updateModuleVisualState();
            updateEstimatedTime();
        });
    });
    
    updateModuleVisualState();
    updateEstimatedTime();
}
function updateModuleVisualState() {
    document.querySelectorAll('.module-card').forEach(card => {
        const module = card.dataset.module;
        
        if (app.selectedModules[module]) {
            card.classList.add('selected');
            card.querySelector('.module-checkbox').textContent = '✓';
        } else {
            card.classList.remove('selected');
            card.querySelector('.module-checkbox').textContent = '';
        }
    });
}

function updateEstimatedTime() {
    let totalTime = 0;
    Object.keys(app.selectedModules).forEach(module => {
        if (app.selectedModules[module]) {
            const card = document.querySelector(`[data-module="${module}"]`);
            if (card) {
                totalTime += parseInt(card.dataset.time);
            }
        }
    });
    
    document.getElementById('estimatedTime').textContent = `Temps estimé : ${totalTime} minutes`;
}

// Exposition des fonctions
window.validateModuleSelection = validateModuleSelection;
window.initializeModuleSelection = initializeModuleSelection;