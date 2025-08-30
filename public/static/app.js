// AIREACH Frontend Application
class AIReachApp {
  constructor() {
    this.currentProject = null;
    this.currentSection = 'dashboard';
    this.projects = [];
    this.expandedProject = null; // Pour gérer l'expansion du sous-menu
    this.init();
  }

  init() {
    console.log('🚀 AIREACH Application Starting...');
    this.setupEventListeners();
    this.loadProjects();
    // Afficher la page Suggested Prompts de Nicolas au démarrage
    setTimeout(() => {
      this.showNicolasSuggestedPrompts();
    }, 500); // Petit délai pour laisser le temps aux projets de se charger
  }

  setupEventListeners() {
    // Sidebar toggle pour mobile
    document.getElementById('openSidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('-translate-x-full');
      document.getElementById('sidebarOverlay').classList.remove('hidden');
    });

    document.getElementById('closeSidebar').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('-translate-x-full');
      document.getElementById('sidebarOverlay').classList.add('hidden');
    });

    document.getElementById('sidebarOverlay').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('-translate-x-full');
      document.getElementById('sidebarOverlay').classList.add('hidden');
    });

    // New Project Modal - Processus 4 étapes
    document.getElementById('newProjectBtn').addEventListener('click', () => {
      this.showCreateProjectWizard();
    });

    document.getElementById('closeNewProjectModal').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    document.getElementById('cancelNewProject').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    // New Project Form (legacy - sera remplacé par le wizard)
    document.getElementById('newProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createProject();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        this.navigateToSection(section);
      });
    });
  }

  async loadProjects() {
    try {
      const response = await axios.get('/api/projects');
      if (response.data.success) {
        this.projects = response.data.data;
        
        // Si aucun projet, ajouter des données de démonstration
        if (this.projects.length === 0) {
          this.loadDemoData();
        } else {
          this.renderProjectsList();
          console.log(`📊 Loaded ${this.projects.length} projects`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
      // En cas d'erreur, charger les données de démonstration
      this.loadDemoData();
    }
  }

  loadDemoData() {
    // Données de démonstration avec plusieurs projets pour tester le scroll
    this.projects = [
      {
        id: 1,
        name: 'Nicolas Monitoring',
        brand_name: 'Nicolas',
        description: 'Surveillance IA pour Nicolas dans le secteur Wine',
        industry: 'Wine',
        website_url: 'https://www.nicolas.com',
        status: 'active',
        total_queries: 12,
        total_responses: 45,
        avg_position: 2.3,
        avg_sentiment_score: 0.78,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'TechCorp Monitoring',
        brand_name: 'TechCorp',
        description: 'Surveillance IA pour TechCorp dans le secteur Technology',
        industry: 'Technology',
        website_url: 'https://www.techcorp.com',
        status: 'active',
        total_queries: 8,
        total_responses: 32,
        avg_position: 3.1,
        avg_sentiment_score: 0.65,
        created_at: '2024-01-10T14:20:00Z'
      },
      {
        id: 3,
        name: 'Lavinia Watch',
        brand_name: 'Lavinia',
        description: 'Surveillance concurrentielle Lavinia',
        industry: 'Wine',
        website_url: 'https://www.lavinia.fr',
        status: 'active',
        total_queries: 6,
        total_responses: 18,
        avg_position: 4.2,
        avg_sentiment_score: 0.72,
        created_at: '2024-01-08T09:15:00Z'
      },
      {
        id: 4,
        name: 'Carrefour Analysis',
        brand_name: 'Carrefour',
        description: 'Analyse Carrefour grande distribution',
        industry: 'Retail',
        website_url: 'https://www.carrefour.fr',
        status: 'paused',
        total_queries: 15,
        total_responses: 67,
        avg_position: 1.8,
        avg_sentiment_score: 0.81,
        created_at: '2024-01-05T16:45:00Z'
      },
      {
        id: 5,
        name: 'Orange Telecom',
        brand_name: 'Orange',
        description: 'Surveillance Orange télécommunications',
        industry: 'Telecom',
        website_url: 'https://www.orange.fr',
        status: 'active',
        total_queries: 20,
        total_responses: 89,
        avg_position: 2.1,
        avg_sentiment_score: 0.69,
        created_at: '2024-01-02T11:30:00Z'
      },
      {
        id: 6,
        name: 'BNP Paribas Track',
        brand_name: 'BNP Paribas',
        description: 'Surveillance secteur bancaire BNP',
        industry: 'Finance',
        website_url: 'https://www.bnpparibas.fr',
        status: 'active',
        total_queries: 11,
        total_responses: 43,
        avg_position: 3.4,
        avg_sentiment_score: 0.58,
        created_at: '2023-12-28T14:20:00Z'
      },
      {
        id: 7,
        name: 'Airbus Monitor',
        brand_name: 'Airbus',
        description: 'Surveillance Airbus aéronautique',
        industry: 'Aerospace',
        website_url: 'https://www.airbus.com',
        status: 'active',
        total_queries: 9,
        total_responses: 34,
        avg_position: 2.7,
        avg_sentiment_score: 0.75,
        created_at: '2023-12-25T08:00:00Z'
      },
      {
        id: 8,
        name: 'LVMH Luxury Watch',
        brand_name: 'LVMH',
        description: 'Surveillance marques luxe LVMH',
        industry: 'Luxury',
        website_url: 'https://www.lvmh.fr',
        status: 'active',
        total_queries: 18,
        total_responses: 72,
        avg_position: 1.6,
        avg_sentiment_score: 0.86,
        created_at: '2023-12-20T12:15:00Z'
      },
      {
        id: 9,
        name: 'Danone Health',
        brand_name: 'Danone',
        description: 'Surveillance Danone alimentaire',
        industry: 'Food',
        website_url: 'https://www.danone.com',
        status: 'paused',
        total_queries: 14,
        total_responses: 56,
        avg_position: 2.9,
        avg_sentiment_score: 0.77,
        created_at: '2023-12-18T10:30:00Z'
      },
      {
        id: 10,
        name: 'Renault Auto',
        brand_name: 'Renault',
        description: 'Surveillance automobile Renault',
        industry: 'Automotive',
        website_url: 'https://www.renault.fr',
        status: 'active',
        total_queries: 13,
        total_responses: 51,
        avg_position: 3.2,
        avg_sentiment_score: 0.63,
        created_at: '2023-12-15T15:45:00Z'
      }
    ];
    
    this.renderProjectsList();
    console.log('📊 Loaded demo data with 10 projects for scroll testing');
  }

  renderProjectsList() {
    const projectsList = document.getElementById('projectsList');
    
    if (this.projects.length === 0) {
      projectsList.innerHTML = `
        <div class="text-center py-3">
          <p class="text-sm text-gray-500">Aucun projet</p>
          <p class="text-xs text-gray-400 mt-1">Cliquez sur + pour commencer</p>
        </div>
      `;
      return;
    }

    projectsList.innerHTML = this.projects.map(project => `
      <div class="project-group">
        <!-- Élément principal du projet -->
        <div class="project-item flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${this.expandedProject === project.id ? 'bg-gray-50' : 'text-gray-700'}" 
             data-project-id="${project.id}"
             title="${project.brand_name} - ${project.total_queries || 0} questions, ${project.total_responses || 0} réponses">
          <!-- Icône de projet -->
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 bg-gradient-to-br from-aireach-blue to-aireach-purple">
            <span class="text-white font-medium text-xs">${project.brand_name.charAt(0)}</span>
          </div>
          
          <!-- Contenu du projet -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-medium truncate text-sm">${project.brand_name}</h4>
              <div class="flex items-center space-x-2 ml-2 flex-shrink-0">
                <!-- Indicateur de statut -->
                <div class="w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-400' : project.status === 'paused' ? 'bg-yellow-400' : 'bg-gray-400'}"></div>
                <!-- Position moyenne si disponible -->
                ${project.avg_position ? `
                  <span class="text-xs font-medium ${project.avg_position <= 2 ? 'text-green-600' : project.avg_position <= 4 ? 'text-yellow-600' : 'text-red-600'}">
                    #${Math.round(project.avg_position)}
                  </span>
                ` : ''}
                <!-- Flèche d'expansion -->
                <i class="fas fa-chevron-right text-xs text-gray-400 transition-transform ${this.expandedProject === project.id ? 'rotate-90' : ''} expand-arrow" data-project-id="${project.id}"></i>
              </div>
            </div>
            <p class="text-xs truncate text-gray-500">
              ${project.total_queries || 0} questions
            </p>
          </div>
        </div>
        
        <!-- Sous-menu -->
        <div class="submenu ${this.expandedProject === project.id ? '' : 'hidden'} ml-11 mt-1 space-y-1" data-project-id="${project.id}">
          <a href="#" class="submenu-item flex items-center px-3 py-2 text-xs text-gray-600 rounded hover:bg-gray-100 transition-colors ${this.currentSection === 'project-overview' && this.currentProject?.id === project.id ? 'bg-aireach-blue text-white' : ''}" 
             data-action="overview" data-project-id="${project.id}">
            <i class="fas fa-chart-pie w-3 h-3 mr-2"></i>
            <span>Overview</span>
          </a>
          <a href="#" class="submenu-item flex items-center px-3 py-2 text-xs text-gray-600 rounded hover:bg-gray-100 transition-colors ${this.currentSection === 'suggested-prompts' && this.currentProject?.id === project.id ? 'bg-aireach-blue text-white' : ''}" 
             data-action="suggested-prompts" data-project-id="${project.id}">
            <i class="fas fa-lightbulb w-3 h-3 mr-2"></i>
            <span>Suggested prompts</span>
          </a>
        </div>
      </div>
    `).join('');

    // Add click listeners to project items
    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = parseInt(item.getAttribute('data-project-id'));
        
        // Toggle l'expansion du projet
        if (this.expandedProject === projectId) {
          this.expandedProject = null;
        } else {
          this.expandedProject = projectId;
        }
        
        this.renderProjectsList();
      });
    });
    
    // Add click listeners to submenu items
    document.querySelectorAll('.submenu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const projectId = parseInt(item.getAttribute('data-project-id'));
        const action = item.getAttribute('data-action');
        
        this.currentProject = this.projects.find(p => p.id === projectId);
        
        if (action === 'overview') {
          this.showProjectOverview();
        } else if (action === 'suggested-prompts') {
          this.showSuggestedPrompts();
        }
        
        this.renderProjectsList(); // Re-render pour mettre à jour les états actifs
      });
    });
  }

  selectProject(projectId) {
    this.currentProject = this.projects.find(p => p.id === projectId);
    
    // Update UI
    document.querySelectorAll('.project-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-project-id="${projectId}"]`).classList.add('active');
    
    this.showProjectDashboard();
    console.log(`📌 Selected project: ${this.currentProject.name}`);
  }

  async createProject() {
    try {
      const formData = {
        name: document.getElementById('projectName').value,
        brand_name: document.getElementById('brandName').value,
        description: document.getElementById('projectDescription').value,
        industry: document.getElementById('projectIndustry').value,
        website_url: document.getElementById('websiteUrl').value
      };

      const response = await axios.post('/api/projects', formData);
      
      if (response.data.success) {
        this.projects.push(response.data.data);
        this.renderProjectsList();
        this.selectProject(response.data.data.id);
        
        // Close modal and reset form
        document.getElementById('newProjectModal').classList.add('hidden');
        document.getElementById('newProjectForm').reset();
        
        this.showSuccess('Projet créé avec succès !');
        console.log('✅ Project created:', response.data.data.name);
      }
    } catch (error) {
      console.error('❌ Failed to create project:', error);
      this.showError('Impossible de créer le projet');
    }
  }

  navigateToSection(section) {
    this.currentSection = section;
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Show appropriate content
    switch(section) {
      case 'all-projects':
        this.showAllProjects();
        break;
      case 'prompts':
        this.showPrompts();
        break;
      case 'subscription':
        this.showSubscription();
        break;
      case 'faq':
        this.showFAQ();
        break;
      case 'improve-ranking':
        this.showImproveRanking();
        break;
      case 'tutorials':
        this.showTutorials();
        break;
      default:
        this.showDashboard();
    }
  }

  showDashboard() {
    this.updatePageHeader('Tableau de Bord', 'Vue d\'ensemble de vos projets de surveillance IA');
    
    const content = `
      <div class="fade-in">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-project-diagram text-blue-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Projets Actifs</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-comments text-green-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Réponses Collectées</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.reduce((sum, p) => sum + (p.total_responses || 0), 0)}</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-robot text-purple-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Plateformes IA</p>
                <p class="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-bell text-yellow-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Alertes Actives</p>
                <p class="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Projets Récents</h3>
              <button class="text-sm text-aireach-blue hover:text-blue-700 font-medium">
                Voir tous →
              </button>
            </div>
          </div>
          <div class="p-6">
            ${this.renderProjectsTable()}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-plus text-blue-600"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
            </div>
            <p class="text-sm text-gray-600 mb-4">Commencez à surveiller une nouvelle marque dans les IA</p>
            <button id="quickNewProject" class="w-full bg-aireach-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Créer un projet
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-chart-line text-green-600"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Analyse Comparative</h3>
            </div>
            <p class="text-sm text-gray-600 mb-4">Comparez vos performances avec la concurrence</p>
            <button class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Voir les analyses
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-lightbulb text-purple-600"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Recommandations</h3>
            </div>
            <p class="text-sm text-gray-600 mb-4">Optimisez votre présence dans les réponses IA</p>
            <button class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Voir conseils
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    // Add event listener for quick new project
    document.getElementById('quickNewProject')?.addEventListener('click', () => {
      this.showCreateProjectWizard();
    });

    // Add event listener for empty state new project
    document.getElementById('emptyStateNewProject')?.addEventListener('click', () => {
      this.showCreateProjectWizard();
    });
  }

  showProjectDashboard() {
    if (!this.currentProject) {
      this.showDashboard();
      return;
    }

    this.updatePageHeader(
      `${this.currentProject.brand_name}`, 
      `Surveillance IA - ${this.currentProject.name}`
    );

    const content = `
      <div class="fade-in">
        <!-- Project Header -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">${this.currentProject.brand_name.charAt(0)}</span>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">${this.currentProject.brand_name}</h2>
                <p class="text-gray-600">${this.currentProject.name}</p>
                <p class="text-sm text-gray-500">${this.currentProject.industry || 'Non spécifié'} • Créé le ${this.formatDate(this.currentProject.created_at)}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="status-${this.currentProject.status} px-3 py-1 rounded-full text-sm font-medium">
                ${this.getStatusLabel(this.currentProject.status)}
              </span>
            </div>
          </div>
        </div>

        <!-- Performance Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Position Moyenne</span>
              <i class="fas fa-trophy text-yellow-500"></i>
            </div>
            <div class="flex items-center">
              <span class="text-2xl font-bold text-gray-900">
                #${this.currentProject.avg_position ? Math.round(this.currentProject.avg_position) : '-'}
              </span>
              <span class="ml-2 text-sm trend-up">
                <i class="fas fa-arrow-up"></i> +0.2
              </span>
            </div>
          </div>

          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Sentiment Moyen</span>
              <i class="fas fa-smile text-green-500"></i>
            </div>
            <div class="flex items-center">
              <span class="text-2xl font-bold text-gray-900">
                ${this.currentProject.avg_sentiment ? Math.round(this.currentProject.avg_sentiment * 100) + '%' : '-'}
              </span>
              <span class="ml-2 text-sm trend-up">
                <i class="fas fa-arrow-up"></i> +5%
              </span>
            </div>
          </div>

          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Mentions Totales</span>
              <i class="fas fa-comments text-blue-500"></i>
            </div>
            <div class="flex items-center">
              <span class="text-2xl font-bold text-gray-900">${this.currentProject.total_responses || 0}</span>
              <span class="ml-2 text-sm trend-stable">
                <i class="fas fa-minus"></i> ±0
              </span>
            </div>
          </div>

          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Score Visibilité</span>
              <i class="fas fa-eye text-purple-500"></i>
            </div>
            <div class="flex items-center">
              <span class="text-2xl font-bold text-gray-900">82%</span>
              <span class="ml-2 text-sm trend-up">
                <i class="fas fa-arrow-up"></i> +3%
              </span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance par Plateforme</h3>
            <div class="chart-container">
              <canvas id="platformChart"></canvas>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution des Mentions</h3>
            <div class="chart-container">
              <canvas id="trendChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Data Collection Panel -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Collecte de Données IA</h3>
              <div class="flex space-x-2">
                <button id="collectDataBtn" class="bg-aireach-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <i class="fas fa-robot mr-2"></i>
                  Collecter Maintenant
                </button>
                <button id="scheduleCollectionBtn" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
                  <i class="fas fa-clock mr-2"></i>
                  Programmer
                </button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div id="collectionStatus" class="mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                Dernière collecte : <span id="lastCollection">Jamais</span>
              </div>
            </div>
            <div id="collectionProgress" class="hidden">
              <div class="flex items-center space-x-3">
                <div class="loading-spinner w-5 h-5 border-2 border-aireach-blue border-t-transparent rounded-full"></div>
                <span class="text-sm text-gray-600">Collecte en cours...</span>
                <span id="collectionProgressText" class="text-sm font-medium text-aireach-blue">0/0</span>
              </div>
              <div class="mt-3 bg-gray-200 rounded-full h-2">
                <div id="collectionProgressBar" class="bg-aireach-blue h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Activité Récente</h3>
          </div>
          <div class="p-6">
            ${this.renderRecentActivity()}
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;
    this.loadProjectAnalytics();
    this.setupCollectionHandlers();
  }

  async loadProjectAnalytics() {
    if (!this.currentProject) return;

    try {
      const response = await axios.get(`/api/dashboard/analytics/${this.currentProject.id}`);
      if (response.data.success) {
        this.renderCharts(response.data.data);
      }
    } catch (error) {
      console.error('❌ Failed to load analytics:', error);
    }
  }

  renderCharts(data) {
    // Platform Performance Chart
    const platformCtx = document.getElementById('platformChart');
    if (platformCtx) {
      new Chart(platformCtx, {
        type: 'doughnut',
        data: {
          labels: ['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Autres'],
          datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: ['#10a37f', '#4285f4', '#cc785c', '#6366f1', '#9ca3af'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          }
        }
      });
    }

    // Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
      new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
          datasets: [{
            label: 'Mentions',
            data: [12, 19, 15, 25],
            borderColor: '#1e40af',
            backgroundColor: 'rgba(30, 64, 175, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [2, 2]
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  }

  renderProjectsTable() {
    if (this.projects.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-folder-open empty-state-icon"></i>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
          <p class="text-gray-500 mb-4">Créez votre premier projet pour commencer la surveillance IA</p>
          <button id="emptyStateNewProject" class="bg-aireach-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Créer un projet
          </button>
        </div>
      `;
    }

    return `
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Projet</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Marque</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              <th class="text-right py-3 px-4 font-semibold text-gray-900">Questions</th>
              <th class="text-right py-3 px-4 font-semibold text-gray-900">Réponses</th>
              <th class="text-right py-3 px-4 font-semibold text-gray-900">Position Moy.</th>
              <th class="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.projects.map(project => `
              <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" data-project-id="${project.id}">
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center mr-3">
                      <span class="text-white font-medium text-sm">${project.brand_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">${project.name}</p>
                      <p class="text-sm text-gray-500">${project.industry || 'Non spécifié'}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <span class="font-medium text-gray-900">${project.brand_name}</span>
                </td>
                <td class="py-4 px-4">
                  <span class="status-${project.status} px-2 py-1 rounded-full text-xs font-medium">
                    ${this.getStatusLabel(project.status)}
                  </span>
                </td>
                <td class="py-4 px-4 text-right">
                  <span class="font-medium text-gray-900">${project.total_queries || 0}</span>
                </td>
                <td class="py-4 px-4 text-right">
                  <span class="font-medium text-gray-900">${project.total_responses || 0}</span>
                </td>
                <td class="py-4 px-4 text-right">
                  ${project.avg_position ? `
                    <span class="font-medium ${project.avg_position <= 2 ? 'text-green-600' : project.avg_position <= 4 ? 'text-yellow-600' : 'text-red-600'}">
                      #${Math.round(project.avg_position)}
                    </span>
                  ` : '<span class="text-gray-400">-</span>'}
                </td>
                <td class="py-4 px-4 text-right">
                  <button class="text-aireach-blue hover:text-blue-700 mr-2" onclick="app.selectProject(${project.id})">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderRecentActivity() {
    const activities = [
      {
        type: 'mention_spike',
        title: 'Pic de mentions détecté',
        description: 'TechFlow mentionné 40% plus sur ChatGPT',
        time: 'il y a 2 heures',
        icon: 'fa-arrow-up',
        color: 'text-green-600'
      },
      {
        type: 'new_query',
        title: 'Nouvelle question détectée',
        description: 'Question sur "workflow automation" en hausse',
        time: 'il y a 4 heures',
        icon: 'fa-question-circle',
        color: 'text-blue-600'
      },
      {
        type: 'competitor_activity',
        title: 'Activité concurrent',
        description: 'Asana gagne en visibilité sur Gemini',
        time: 'il y a 6 heures',
        icon: 'fa-users',
        color: 'text-orange-600'
      }
    ];

    return `
      <div class="space-y-4">
        ${activities.map(activity => `
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="fas ${activity.icon} ${activity.color} text-sm"></i>
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">${activity.title}</p>
              <p class="text-sm text-gray-600">${activity.description}</p>
              <p class="text-xs text-gray-500 mt-1">${activity.time}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Placeholder methods for other sections
  showAllProjects() {
    this.updatePageHeader('Tous les Projets', 'Gérez tous vos projets de surveillance');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "Tous les projets" en développement...</p>
      </div>
    `;
  }

  showPrompts() {
    this.updatePageHeader('Prompts / Questions', 'Gérez vos questions de surveillance');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "Prompts / Questions" en développement...</p>
      </div>
    `;
  }

  showSubscription() {
    this.updatePageHeader('Abonnement', 'Gérez votre abonnement AIREACH');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "Abonnement" en développement...</p>
      </div>
    `;
  }

  showFAQ() {
    this.updatePageHeader('FAQ', 'Questions fréquemment posées');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "FAQ" en développement...</p>
      </div>
    `;
  }

  showImproveRanking() {
    this.updatePageHeader('Améliorer le Classement IA', 'Optimisez votre présence dans les IA');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "Améliorer le Classement IA" en développement...</p>
      </div>
    `;
  }

  showTutorials() {
    this.updatePageHeader('Tutoriels Vidéo', 'Apprenez à utiliser AIREACH');
    document.getElementById('mainContent').innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p class="text-gray-600">Section "Tutoriels Vidéo" en développement...</p>
      </div>
    `;
  }

  // Utility methods
  updatePageHeader(title, subtitle) {
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageSubtitle').textContent = subtitle;
  }

  getStatusLabel(status) {
    const labels = {
      'active': 'Actif',
      'paused': 'En pause',
      'archived': 'Archivé'
    };
    return labels[status] || status;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // ===== WIZARD DE CRÉATION DE PROJET EN 4 ÉTAPES =====

  showCreateProjectWizard() {
    this.wizardData = {
      step: 1,
      domain: '',
      brandInfo: null,
      selectedQuestions: [],
      questionsWithVolumes: []
    };

    this.renderWizardStep1();
  }

  // Étape 1: Saisie du domaine
  renderWizardStep1() {
    const modal = document.getElementById('newProjectModal');
    const content = modal.querySelector('.bg-white');
    
    content.innerHTML = `
      <div class="p-6">
        <!-- Header avec étapes -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
          <button id="closeWizard" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Indicateur d'étapes -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">2</div>
            <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">3</div>
            <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
          </div>
        </div>

        <!-- Contenu Étape 1 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Saisir le Domaine</h2>
          <p class="text-gray-600">Veuillez saisir le domaine de la marque que vous souhaitez surveiller.</p>
        </div>

        <div class="space-y-6">
          <div>
            <label for="wizardDomain" class="block text-sm font-medium text-gray-700 mb-2">Domaine:</label>
            <input 
              type="text" 
              id="wizardDomain" 
              placeholder="example.com" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent text-lg"
              value="${this.wizardData.domain}"
            >
          </div>

          <!-- Champs Langue et Pays (affichés après détection) -->
          <div id="geoLanguageFields" class="space-y-4 ${!this.wizardData.detectedInfo ? 'hidden' : ''}">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-blue-900 mb-3">
                <i class="fas fa-globe mr-2"></i>Détection Automatique
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="wizardCountry" class="block text-sm font-medium text-blue-800 mb-2">Pays:</label>
                  <select id="wizardCountry" class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent text-sm">
                    <option value="Morocco">🇲🇦 Morocco</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Spain">🇪🇸 Spain</option>
                    <option value="Italy">🇮🇹 Italy</option>
                  </select>
                </div>
                <div>
                  <label for="wizardLanguage" class="block text-sm font-medium text-blue-800 mb-2">Langue:</label>
                  <select id="wizardLanguage" class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent text-sm">
                    <option value="French">🇫🇷 Français</option>
                    <option value="English">🇺🇸 English</option>
                    <option value="Arabic">🇸🇦 العربية</option>
                    <option value="Spanish">🇪🇸 Español</option>
                    <option value="German">🇩🇪 Deutsch</option>
                    <option value="Italian">🇮🇹 Italiano</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button 
              id="wizardStep1Next" 
              class="bg-aireach-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              ${!this.wizardData.domain ? 'disabled' : ''}
            >
              Suivant
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-500 mb-2">
              Vous voulez saisir un nom de marque au lieu d'un domaine ? 
              <button id="switchToBrandName" class="text-aireach-blue hover:underline">Cliquez ici !</button>
            </p>
            <p class="text-xs text-gray-400">
              Veuillez noter que la collecte de données commence seulement après la configuration du projet. 
              Les données historiques ne sont pas disponibles en raison des limitations des chatbots IA.
            </p>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Event listeners
    document.getElementById('closeWizard').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    const domainInput = document.getElementById('wizardDomain');
    const nextBtn = document.getElementById('wizardStep1Next');

    domainInput.addEventListener('input', (e) => {
      this.wizardData.domain = e.target.value.trim();
      nextBtn.disabled = !this.wizardData.domain;
      nextBtn.className = this.wizardData.domain 
        ? 'bg-aireach-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold'
        : 'bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-semibold cursor-not-allowed';
      
      // Auto-détection en temps réel après 1 seconde d'inactivité
      clearTimeout(this.detectionTimeout);
      if (this.wizardData.domain && this.wizardData.domain.includes('.')) {
        this.detectionTimeout = setTimeout(() => {
          this.detectBrandInfo();
        }, 1000);
      } else {
        // Cacher les champs si domaine invalide
        document.getElementById('geoLanguageFields')?.classList.add('hidden');
      }
    });

    nextBtn.addEventListener('click', () => {
      if (this.wizardData.domain) {
        this.processStep1();
      }
    });

    document.getElementById('switchToBrandName')?.addEventListener('click', () => {
      this.showBrandNameInput();
    });
  }

  // Détection automatique en temps réel
  async detectBrandInfo() {
    if (!this.wizardData.domain || !this.wizardData.domain.includes('.')) return;

    try {
      const response = await axios.post('/api/brand/detect', {
        domain: this.wizardData.domain
      });

      if (response.data.success) {
        this.wizardData.detectedInfo = response.data.data;
        
        // Afficher les champs langue/pays
        const geoFields = document.getElementById('geoLanguageFields');
        const countrySelect = document.getElementById('wizardCountry');
        const languageSelect = document.getElementById('wizardLanguage');
        
        if (geoFields && countrySelect && languageSelect) {
          geoFields.classList.remove('hidden');
          
          // Pré-sélectionner les valeurs détectées
          countrySelect.value = this.wizardData.detectedInfo.country;
          languageSelect.value = this.wizardData.detectedInfo.language;
          
          // Sauvegarder les sélections
          this.wizardData.selectedCountry = this.wizardData.detectedInfo.country;
          this.wizardData.selectedLanguage = this.wizardData.detectedInfo.language;
          
          // Écouter les changements
          countrySelect.addEventListener('change', (e) => {
            this.wizardData.selectedCountry = e.target.value;
          });
          
          languageSelect.addEventListener('change', (e) => {
            this.wizardData.selectedLanguage = e.target.value;
          });
          
          console.log('✅ Auto-détection réussie:', this.wizardData.detectedInfo);
        }
      }
    } catch (error) {
      console.log('⚠️ Auto-détection échouée (normale):', error.message);
      // Ne pas afficher d'erreur, c'est une détection automatique
    }
  }

  // Traitement étape 1: Détection de marque
  async processStep1() {
    if (!this.wizardData.domain) return;

    try {
      // Afficher le loading
      document.getElementById('wizardStep1Next').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Détection...';
      
      const response = await axios.post('/api/brand/detect', {
        domain: this.wizardData.domain
      });

      if (response.data.success) {
        this.wizardData.brandInfo = response.data.data;
        this.wizardData.step = 2;
        this.renderWizardStep2();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Brand detection failed:', error);
      this.showError('Échec de la détection de marque');
      document.getElementById('wizardStep1Next').innerHTML = 'Suivant';
    }
  }

  // Étape 2: Sélection des questions
  async renderWizardStep2() {
    try {
      // Générer les questions avec langue et pays
      const response = await axios.post('/api/questions/generate', {
        brandName: this.wizardData.brandInfo.detectedBrandName,
        industry: this.wizardData.brandInfo.industry,
        domain: this.wizardData.domain,
        country: this.wizardData.selectedCountry || this.wizardData.brandInfo?.country,
        language: this.wizardData.selectedLanguage || this.wizardData.brandInfo?.language
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      const questionsData = response.data.data;
      this.wizardData.availableQuestions = questionsData.questions;
      this.wizardData.selectedQuestions = questionsData.questions.filter(q => q.isSelected);

      const modal = document.getElementById('newProjectModal');
      const content = modal.querySelector('.bg-white');
      
      content.innerHTML = `
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
            <button id="closeWizard" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Indicateur d'étapes -->
          <div class="flex items-center justify-center mb-8">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
              <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
              <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">3</div>
              <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
              <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
            </div>
          </div>

          <!-- Info marque détectée -->
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                <div>
                  <p class="font-semibold text-gray-900">Marque détectée:</p>
                  <p class="text-aireach-blue font-bold text-lg">${this.wizardData.brandInfo.detectedBrandName}</p>
                  <p class="text-sm text-gray-600">Industrie: ${this.wizardData.brandInfo.industry}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-700">
                  <i class="fas fa-globe mr-1"></i>
                  ${this.getCountryFlag(this.wizardData.selectedCountry || this.wizardData.brandInfo?.country)} ${this.wizardData.selectedCountry || this.wizardData.brandInfo?.country || 'Auto'}
                </p>
                <p class="text-sm font-medium text-gray-700">
                  <i class="fas fa-language mr-1"></i>
                  ${this.getLanguageFlag(this.wizardData.selectedLanguage || this.wizardData.brandInfo?.language)} ${this.wizardData.selectedLanguage || this.wizardData.brandInfo?.language || 'Auto'}
                </p>
              </div>
            </div>
          </div>

          <!-- Limite -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Choisir/Ajouter des questions</h2>
            <span class="text-sm text-gray-500">
              Limites actuelles: <span id="selectedCount">${this.wizardData.selectedQuestions.length}</span> / 20
            </span>
          </div>

          <!-- Liste des questions -->
          <div class="space-y-3 max-h-96 overflow-y-auto mb-6" id="questionsList">
            ${this.renderQuestionsList()}
          </div>

          <!-- Boutons -->
          <div class="flex justify-between">
            <button id="wizardStep2Back" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Retour
            </button>
            <button 
              id="wizardStep2Next" 
              class="bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              ${this.wizardData.selectedQuestions.length === 0 ? 'disabled' : ''}
            >
              Suivant
            </button>
          </div>
        </div>
      `;

      // Event listeners
      this.setupStep2Listeners();

    } catch (error) {
      console.error('Question generation failed:', error);
      this.showError('Échec de la génération des questions');
    }
  }

  renderQuestionsList() {
    return this.wizardData.availableQuestions.map(q => `
      <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
        <input 
          type="checkbox" 
          id="q_${q.id}" 
          class="question-checkbox h-4 w-4 text-aireach-blue border-gray-300 rounded focus:ring-aireach-blue mr-3"
          ${q.isSelected ? 'checked' : ''}
          data-question-id="${q.id}"
        >
        <label for="q_${q.id}" class="flex-1 text-gray-900 cursor-pointer">
          ${q.text}
        </label>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          ${q.category}
        </span>
      </div>
    `).join('');
  }

  setupStep2Listeners() {
    // Close wizard
    document.getElementById('closeWizard').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    // Back button
    document.getElementById('wizardStep2Back').addEventListener('click', () => {
      this.wizardData.step = 1;
      this.renderWizardStep1();
    });

    // Checkbox handlers
    document.querySelectorAll('.question-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const questionId = e.target.getAttribute('data-question-id');
        const question = this.wizardData.availableQuestions.find(q => q.id === questionId);
        
        if (question) {
          question.isSelected = e.target.checked;
          this.wizardData.selectedQuestions = this.wizardData.availableQuestions.filter(q => q.isSelected);
          
          // Update counter
          document.getElementById('selectedCount').textContent = this.wizardData.selectedQuestions.length;
          
          // Update next button
          const nextBtn = document.getElementById('wizardStep2Next');
          nextBtn.disabled = this.wizardData.selectedQuestions.length === 0;
          nextBtn.className = this.wizardData.selectedQuestions.length > 0
            ? 'bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed';
        }
      });
    });

    // Next button
    document.getElementById('wizardStep2Next').addEventListener('click', () => {
      if (this.wizardData.selectedQuestions.length > 0) {
        this.processStep2();
      }
    });
  }

  // Traitement étape 2: Obtenir les volumes de recherche
  async processStep2() {
    try {
      document.getElementById('wizardStep2Next').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Chargement...';
      
      const response = await axios.post('/api/questions/volumes', {
        questions: this.wizardData.selectedQuestions
      });

      if (response.data.success) {
        this.wizardData.questionsWithVolumes = response.data.data.questions;
        this.wizardData.step = 3;
        this.renderWizardStep3();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Volume fetching failed:', error);
      this.showError('Échec de la récupération des volumes');
      document.getElementById('wizardStep2Next').innerHTML = 'Suivant';
    }
  }

  // Étape 3: Affichage des volumes de recherche
  renderWizardStep3() {
    const modal = document.getElementById('newProjectModal');
    const content = modal.querySelector('.bg-white');
    
    content.innerHTML = `
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
          <button id="closeWizard" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Indicateur d'étapes -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
          </div>
        </div>

        <!-- Titre -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Volume de Recherche</h2>
          <p class="text-gray-600">Volumes de recherche pour les questions sélectionnées</p>
        </div>

        <!-- Tableau des questions avec volumes -->
        <div class="bg-white border border-gray-200 rounded-lg mb-6">
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-900">
            <div>Question:</div>
            <div>Volume de Recherche:</div>
          </div>
          <div class="max-h-80 overflow-y-auto">
            ${this.wizardData.questionsWithVolumes.map(q => `
              <div class="grid grid-cols-2 gap-4 p-4 border-b border-gray-100 last:border-b-0">
                <div class="text-gray-900">${q.text}</div>
                <div class="font-bold ${q.searchVolume >= 1000 ? 'text-green-600' : q.searchVolume >= 100 ? 'text-yellow-600' : 'text-gray-600'}">
                  ${q.searchVolume >= 100 ? q.searchVolume.toLocaleString() : '<100'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex justify-between">
          <button id="wizardStep3Back" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Retour
          </button>
          <button id="wizardStep3Next" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold">
            Enregistrer & Lancer
          </button>
        </div>
      </div>
    `;

    this.setupStep3Listeners();
  }

  setupStep3Listeners() {
    document.getElementById('closeWizard').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    document.getElementById('wizardStep3Back').addEventListener('click', () => {
      this.wizardData.step = 2;
      this.renderWizardStep2();
    });

    document.getElementById('wizardStep3Next').addEventListener('click', () => {
      this.processStep3();
    });
  }

  // Traitement étape 3: Créer le projet
  async processStep3() {
    try {
      document.getElementById('wizardStep3Next').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Création...';
      
      // Passer à l'étape 4 (loading)
      this.renderWizardStep4();

      // Créer le projet
      const response = await axios.post('/api/projects/create-complete', {
        domain: this.wizardData.domain,
        brandName: this.wizardData.brandInfo.detectedBrandName,
        industry: this.wizardData.brandInfo.industry,
        questions: this.wizardData.questionsWithVolumes,
        websiteUrl: this.wizardData.brandInfo.domain
      });

      if (response.data.success) {
        // Attendre un peu pour l'effet visuel
        setTimeout(() => {
          // Fermer le modal
          document.getElementById('newProjectModal').classList.add('hidden');
          
          // Recharger les projets
          this.loadProjects();
          
          // Sélectionner le nouveau projet
          this.selectProject(response.data.data.project.id);
          
          this.showSuccess(`✅ Projet "${response.data.data.project.brand_name}" créé avec succès !`);
        }, 2000);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Project creation failed:', error);
      this.showError('Échec de la création du projet');
      this.renderWizardStep3(); // Retour à l'étape 3
    }
  }

  // Étape 4: Loading et finalisation
  renderWizardStep4() {
    const modal = document.getElementById('newProjectModal');
    const content = modal.querySelector('.bg-white');
    
    content.innerHTML = `
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
          <button id="closeWizard" class="text-gray-400 hover:text-gray-600 opacity-50 cursor-not-allowed" disabled>
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Indicateur d'étapes -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-16 h-0.5 bg-green-500 mx-2"></div>
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
          </div>
        </div>

        <!-- Loading état -->
        <div class="text-center py-12">
          <div class="loading-spinner w-16 h-16 border-4 border-aireach-blue border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Chargement des données</h2>
          <p class="text-gray-600 mb-4">Cela peut prendre un moment...</p>
          
          <div class="bg-gray-50 rounded-lg p-6 mt-8">
            <div class="text-sm text-gray-700 space-y-2">
              <div class="flex items-center justify-between">
                <span>Création du projet...</span>
                <i class="fas fa-check text-green-500"></i>
              </div>
              <div class="flex items-center justify-between">
                <span>Configuration des questions...</span>
                <i class="fas fa-check text-green-500"></i>
              </div>
              <div class="flex items-center justify-between">
                <span>Initialisation de la surveillance...</span>
                <div class="loading-spinner w-4 h-4 border-2 border-aireach-blue border-t-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showBrandNameInput() {
    // TODO: Implémenter la saisie par nom de marque au lieu du domaine
    this.showNotification('Fonctionnalité à venir', 'info');
  }

  // Configuration des handlers de collecte
  setupCollectionHandlers() {
    if (!this.currentProject) return;

    const collectBtn = document.getElementById('collectDataBtn');
    const scheduleBtn = document.getElementById('scheduleCollectionBtn');

    if (collectBtn) {
      collectBtn.addEventListener('click', () => {
        this.startDataCollection();
      });
    }

    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        this.showScheduleModal();
      });
    }

    // Charger le statut de collecte
    this.loadCollectionStatus();
  }

  // Lancer la collecte de données
  async startDataCollection() {
    if (!this.currentProject) return;

    const progressContainer = document.getElementById('collectionProgress');
    const collectBtn = document.getElementById('collectDataBtn');
    
    try {
      // Afficher le progrès
      progressContainer.classList.remove('hidden');
      collectBtn.disabled = true;
      collectBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Collecte...';

      console.log(`🚀 Starting data collection for project ${this.currentProject.id}`);

      const response = await axios.post(`/api/projects/${this.currentProject.id}/collect`);
      
      if (response.data.success) {
        const { total, successful, failed } = response.data.data.summary;
        
        // Mettre à jour la barre de progression
        document.getElementById('collectionProgressText').textContent = `${successful}/${total}`;
        document.getElementById('collectionProgressBar').style.width = '100%';

        // Afficher le résultat
        setTimeout(() => {
          progressContainer.classList.add('hidden');
          
          if (successful > 0) {
            this.showSuccess(`✅ Collecte terminée : ${successful}/${total} réponses collectées`);
            this.loadCollectionStatus(); // Recharger les données
            this.loadProjectAnalytics(); // Mettre à jour les graphiques
          } else {
            this.showError(`⚠️ Collecte terminée mais aucune réponse collectée`);
          }
        }, 1000);

        console.log(`✅ Collection completed: ${successful}/${total} successful`);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('❌ Data collection failed:', error);
      progressContainer.classList.add('hidden');
      this.showError('Échec de la collecte de données');
    } finally {
      collectBtn.disabled = false;
      collectBtn.innerHTML = '<i class="fas fa-robot mr-2"></i>Collecter Maintenant';
    }
  }

  // Charger le statut de collecte
  async loadCollectionStatus() {
    if (!this.currentProject) return;

    try {
      const response = await axios.get(`/api/projects/${this.currentProject.id}/collection-status`);
      
      if (response.data.success) {
        const { stats } = response.data.data;
        
        if (stats.last_collection) {
          const lastCollection = new Date(stats.last_collection).toLocaleString('fr-FR');
          document.getElementById('lastCollection').textContent = lastCollection;
        }

        // Mettre à jour les métriques si disponibles
        if (stats.total_responses) {
          console.log(`📊 Project has ${stats.total_responses} total responses from ${stats.platforms_used} platforms`);
        }
      }
    } catch (error) {
      console.error('Failed to load collection status:', error);
    }
  }

  // Afficher le modal de programmation
  showScheduleModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Programmer la Collecte</h3>
          <button id="closeScheduleModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
            <select id="scheduleInterval" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
              <option value="30">Toutes les 30 minutes</option>
              <option value="60" selected>Toutes les heures</option>
              <option value="240">Toutes les 4 heures</option>
              <option value="720">Toutes les 12 heures</option>
              <option value="1440">Quotidienne</option>
            </select>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
              <div class="text-sm text-blue-700">
                <p class="font-medium mb-1">Mode Démo</p>
                <p>La collecte utilise des données simulées pour la démonstration. En production, elle interrogerait les vraies APIs des plateformes IA.</p>
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button id="cancelSchedule" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button id="confirmSchedule" class="px-4 py-2 bg-aireach-blue text-white rounded-lg hover:bg-blue-700">
              Programmer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners pour le modal
    document.getElementById('closeScheduleModal').addEventListener('click', () => {
      modal.remove();
    });

    document.getElementById('cancelSchedule').addEventListener('click', () => {
      modal.remove();
    });

    document.getElementById('confirmSchedule').addEventListener('click', async () => {
      const interval = parseInt(document.getElementById('scheduleInterval').value);
      
      try {
        const response = await axios.post(`/api/projects/${this.currentProject.id}/schedule`, {
          intervalMinutes: interval
        });

        if (response.data.success) {
          this.showSuccess(`✅ Collecte programmée toutes les ${interval} minutes`);
          modal.remove();
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        console.error('Scheduling failed:', error);
        this.showError('Échec de la programmation');
      }
    });

    // Fermer en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Nouvelle méthode pour afficher l'overview du projet
  showProjectOverview() {
    this.currentSection = 'project-overview';
    this.updatePageHeader(`Overview - ${this.currentProject.brand_name}`, `Vue détaillée du projet ${this.currentProject.name}`);
    
    const content = `
      <div class="fade-in">
        <!-- Statistiques du projet -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-question-circle text-blue-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Questions Suivies</p>
                <p class="text-2xl font-bold text-gray-900">${this.currentProject.total_queries || 0}</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-comments text-green-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Réponses Collectées</p>
                <p class="text-2xl font-bold text-gray-900">${this.currentProject.total_responses || 0}</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-trophy text-purple-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Position Moyenne</p>
                <p class="text-2xl font-bold text-gray-900">#${this.currentProject.avg_position ? Math.round(this.currentProject.avg_position) : '-'}</p>
              </div>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-chart-line text-yellow-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Score Sentiment</p>
                <p class="text-2xl font-bold text-gray-900">${this.currentProject.avg_sentiment_score ? Math.round(this.currentProject.avg_sentiment_score * 100) : '-'}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations du projet -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations du Projet</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Détails</h4>
              <div class="space-y-2 text-sm text-gray-600">
                <p><strong>Nom:</strong> ${this.currentProject.name}</p>
                <p><strong>Marque:</strong> ${this.currentProject.brand_name}</p>
                <p><strong>Secteur:</strong> ${this.currentProject.industry || 'Non spécifié'}</p>
                <p><strong>Status:</strong> <span class="status-${this.currentProject.status} px-2 py-1 rounded-full text-xs font-medium">${this.getStatusLabel(this.currentProject.status)}</span></p>
                ${this.currentProject.website_url ? `<p><strong>Site web:</strong> <a href="${this.currentProject.website_url}" target="_blank" class="text-aireach-blue hover:underline">${this.currentProject.website_url}</a></p>` : ''}
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p class="text-sm text-gray-600">${this.currentProject.description || 'Aucune description disponible'}</p>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div class="flex flex-wrap gap-3">
            <button class="action-btn bg-aireach-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <i class="fas fa-play mr-2"></i>
              Lancer Collection
            </button>
            <button class="action-btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <i class="fas fa-download mr-2"></i>
              Exporter Données
            </button>
            <button class="action-btn bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
              <i class="fas fa-cog mr-2"></i>
              Paramètres
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;
    console.log(`📊 Showing overview for project: ${this.currentProject.name}`);
  }

  // Nouvelle méthode pour afficher les prompts suggérés
  showSuggestedPrompts() {
    this.currentSection = 'suggested-prompts';
    this.updatePageHeader(`Suggested Prompts - ${this.currentProject.brand_name}`, `Questions suggérées pour ${this.currentProject.name}`);
    
    // Récupérer les prompts suggérés pour ce projet
    this.loadSuggestedPrompts();
  }

  async loadSuggestedPrompts() {
    try {
      console.log('🔍 Loading suggested prompts for project:', this.currentProject);
      console.log('🔗 API URL will be:', `/api/projects/${this.currentProject.id}/questions`);
      
      const response = await axios.get(`/api/projects/${this.currentProject.id}/questions`);
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        this.renderSuggestedPrompts(response.data.data);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('❌ Failed to load suggested prompts:', error);
      console.error('📊 Current project at time of error:', this.currentProject);
      
      // Fallback direct pour Nicolas si l'API échoue
      if (this.currentProject && this.currentProject.brand_name === 'Nicolas') {
        console.log('🍷 Using fallback data for Nicolas');
        const nicolasPrompts = [
          {
            id: 1,
            question: "Quels sont les meilleurs vins de Nicolas pour les occasions spéciales ?",
            category: "Produits",
            description: "Questions sur la sélection premium de vins Nicolas",
            search_volume: 1250,
            is_active: true,
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            question: "Comment Nicolas compare-t-il ses prix avec d'autres cavistes ?",
            category: "Prix",
            description: "Comparaison tarifaire avec la concurrence",
            search_volume: 890,
            is_active: true,
            created_at: '2024-01-16T11:15:00Z'
          },
          {
            id: 3,
            question: "Quelle est la qualité du service client chez Nicolas ?",
            category: "Services",
            description: "Évaluation du service client et conseil",
            search_volume: 650,
            is_active: true,
            created_at: '2024-01-17T09:45:00Z'
          },
          {
            id: 4,
            question: "Où trouver les magasins Nicolas près de chez moi ?",
            category: "Général",
            description: "Localisation des points de vente",
            search_volume: 2100,
            is_active: true,
            created_at: '2024-01-19T16:30:00Z'
          }
        ];
        
        this.renderSuggestedPrompts(nicolasPrompts);
        return;
      }
      
      this.showError('Impossible de charger les prompts suggérés');
    }
  }

  renderSuggestedPrompts(prompts) {
    const content = `
      <div class="fade-in">
        <!-- Header avec bouton d'ajout -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Questions Suggérées</h3>
              <p class="text-sm text-gray-600">Gérez les questions à suivre pour ${this.currentProject.brand_name}</p>
            </div>
            <button id="addNewPrompt" class="bg-aireach-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <i class="fas fa-plus mr-2"></i>
              Ajouter Question
            </button>
          </div>
        </div>

        <!-- Liste des prompts -->
        <div class="space-y-4">
          ${prompts.length === 0 ? `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <i class="fas fa-lightbulb text-4xl text-gray-300 mb-4"></i>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune question suggérée</h3>
              <p class="text-gray-500 mb-4">Commencez par ajouter des questions à suivre pour ce projet</p>
              <button id="addFirstPrompt" class="bg-aireach-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Ajouter la première question
              </button>
            </div>
          ` : prompts.map(prompt => `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 prompt-card" data-prompt-id="${prompt.id}">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                      ${prompt.category || 'Général'}
                    </span>
                    <span class="text-xs text-gray-500">Vol. recherche: ${prompt.search_volume || 'N/A'}</span>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-2">${prompt.question}</h4>
                  <p class="text-sm text-gray-600 mb-3">${prompt.description || 'Aucune description'}</p>
                  <div class="flex items-center space-x-4 text-xs text-gray-500">
                    <span><i class="fas fa-eye mr-1"></i>Suivi: ${prompt.is_active ? 'Actif' : 'Inactif'}</span>
                    <span><i class="fas fa-calendar mr-1"></i>Ajouté: ${new Date(prompt.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <button class="text-blue-600 hover:text-blue-800 p-2" onclick="app.editPrompt(${prompt.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-gray-600 hover:text-gray-800 p-2" onclick="app.togglePromptStatus(${prompt.id})" title="${prompt.is_active ? 'Désactiver' : 'Activer'}">
                    <i class="fas fa-${prompt.is_active ? 'pause' : 'play'}"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800 p-2" onclick="app.deletePrompt(${prompt.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    // Event listeners
    const addButtons = document.querySelectorAll('#addNewPrompt, #addFirstPrompt');
    addButtons.forEach(btn => {
      btn.addEventListener('click', () => this.showAddPromptModal());
    });

    console.log(`💡 Showing ${prompts.length} suggested prompts for project: ${this.currentProject.name}`);
  }

  showAddPromptModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Ajouter une Question</h3>
              <button id="closeAddPromptModal" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form id="addPromptForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea id="newPromptQuestion" required rows="3" placeholder="Ex: Quels sont les avantages de [marque] par rapport à la concurrence ?" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select id="newPromptCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
                  <option value="Général">Général</option>
                  <option value="Produits">Produits</option>
                  <option value="Services">Services</option>
                  <option value="Comparaison">Comparaison</option>
                  <option value="Prix">Prix</option>
                  <option value="Avis">Avis</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                <input type="text" id="newPromptDescription" placeholder="Description de l'objectif de cette question" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancelAddPrompt" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" class="px-4 py-2 bg-aireach-blue text-white rounded-lg hover:bg-blue-700">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('closeAddPromptModal').addEventListener('click', () => modal.remove());
    document.getElementById('cancelAddPrompt').addEventListener('click', () => modal.remove());
    
    document.getElementById('addPromptForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        question: document.getElementById('newPromptQuestion').value,
        category: document.getElementById('newPromptCategory').value,
        description: document.getElementById('newPromptDescription').value
      };

      try {
        const response = await axios.post(`/api/projects/${this.currentProject.id}/questions`, formData);
        
        if (response.data.success) {
          this.showSuccess('Question ajoutée avec succès !');
          modal.remove();
          this.loadSuggestedPrompts(); // Recharger la liste
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        console.error('Failed to add prompt:', error);
        this.showError('Impossible d\'ajouter la question');
      }
    });

    // Fermer en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  async deletePrompt(promptId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/projects/${this.currentProject.id}/questions/${promptId}`);
      
      if (response.data.success) {
        this.showSuccess('Question supprimée avec succès !');
        this.loadSuggestedPrompts(); // Recharger la liste
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      this.showError('Impossible de supprimer la question');
    }
  }

  async togglePromptStatus(promptId) {
    try {
      const response = await axios.patch(`/api/projects/${this.currentProject.id}/questions/${promptId}/toggle`);
      
      if (response.data.success) {
        this.showSuccess('Statut de la question mis à jour !');
        this.loadSuggestedPrompts(); // Recharger la liste
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Failed to toggle prompt status:', error);
      this.showError('Impossible de mettre à jour le statut');
    }
  }

  getStatusLabel(status) {
    switch(status) {
      case 'active': return 'Actif';
      case 'paused': return 'En pause';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  }

  getCountryFlag(country) {
    const flags = {
      'Morocco': '🇲🇦',
      'France': '🇫🇷', 
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹'
    };
    return flags[country] || '🌍';
  }

  getLanguageFlag(language) {
    const flags = {
      'French': '🇫🇷',
      'English': '🇺🇸', 
      'Arabic': '🇸🇦',
      'Spanish': '🇪🇸',
      'German': '🇩🇪',
      'Italian': '🇮🇹'
    };
    return flags[language] || '🗣️';
  }

  // Méthode pour afficher directement la page Suggested Prompts de Nicolas
  showNicolasSuggestedPrompts() {
    console.log('🍷 Initializing Nicolas Suggested Prompts...');
    console.log('📊 Available projects:', this.projects);
    
    // Sélectionner le projet Nicolas
    this.currentProject = this.projects.find(p => p.brand_name === 'Nicolas') || this.projects[0];
    console.log('🎯 Selected current project:', this.currentProject);
    
    this.currentSection = 'suggested-prompts';
    this.expandedProject = this.currentProject?.id;
    
    if (!this.currentProject) {
      console.error('❌ No project found for Nicolas or fallback');
      this.showError('Aucun projet trouvé');
      return;
    }
    
    this.updatePageHeader(`Suggested Prompts - ${this.currentProject.brand_name}`, `Questions suggérées pour ${this.currentProject.name}`);
    
    // Essayer de charger depuis l'API d'abord
    this.loadSuggestedPrompts();
    this.renderProjectsList(); // Met à jour la sidebar pour montrer l'état actif
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIReachApp();
});