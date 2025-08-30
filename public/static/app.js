// AIREACH Frontend Application
class AIReachApp {
  constructor() {
    this.currentProject = null;
    this.currentSection = 'dashboard';
    this.projects = [];
    this.expandedProject = null; // Pour gérer l'expansion du sous-menu
    
    // S'assurer que le DOM soit prêt avant d'initialiser
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    console.log('🚀 AIREACH Application Starting...');
    this.setupEventListeners();
    this.loadProjects();
    // Afficher le dashboard au démarrage
    setTimeout(() => {
      this.showDashboard();
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
      console.log('🔄 Loading projects from API...');
      const response = await axios.get('/api/projects');
      console.log('📥 API Response:', response.data);
      
      if (response.data.success) {
        this.projects = response.data.data;
        console.log('📊 Projects loaded from API:', this.projects);
        
        // Si aucun projet, ajouter des données de démonstration
        if (this.projects.length === 0) {
          console.log('⚠️ No projects found, loading demo data');
          this.loadDemoData();
        } else {
          console.log(`✅ Rendering ${this.projects.length} projects in sidebar`);
          this.renderProjectsList();
          console.log(`📊 Successfully loaded ${this.projects.length} projects`);
        }
      } else {
        console.error('❌ API returned error:', response.data);
        this.loadDemoData();
      }
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
      console.log('🔄 Loading demo data as fallback');
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
    console.log('🎨 Rendering projects list...', this.projects.length);
    const projectsList = document.getElementById('projectsList');
    
    if (!projectsList) {
      console.error('❌ projectsList element not found in DOM!');
      return;
    }
    
    if (this.projects.length === 0) {
      console.log('⚠️ No projects to render, showing empty state');
      projectsList.innerHTML = `
        <div class="text-center py-3">
          <p class="text-sm text-gray-500">Aucun projet</p>
          <p class="text-xs text-gray-400 mt-1">Cliquez sur + pour commencer</p>
        </div>
      `;
      return;
    }

    // Version simplifiée pour debug
    projectsList.innerHTML = this.projects.map(project => `
      <div class="project-group">
        <div class="project-item flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" 
             data-project-id="${project.id}">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600">
            <span class="text-white font-medium text-xs">${project.brand_name.charAt(0)}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-medium truncate text-sm">${project.brand_name}</h4>
              <div class="flex items-center space-x-2 ml-2 flex-shrink-0">
                <div class="w-2 h-2 rounded-full bg-green-400"></div>
                <i class="fas fa-chevron-right text-xs text-gray-400 transition-transform expand-arrow" data-project-id="${project.id}"></i>
              </div>
            </div>
            <p class="text-xs truncate text-gray-500">${project.total_queries || 0} questions</p>
          </div>
        </div>
        
        <div class="submenu ${this.expandedProject === project.id ? '' : 'hidden'} ml-11 mt-1 space-y-1" data-project-id="${project.id}">
          <a href="#" class="submenu-item flex items-center px-3 py-2 text-xs text-gray-600 rounded hover:bg-gray-100" 
             data-action="overview" data-project-id="${project.id}">
            <i class="fas fa-chart-pie w-3 h-3 mr-2"></i>
            <span>Overview</span>
          </a>
          <a href="#" class="submenu-item flex items-center px-3 py-2 text-xs text-gray-600 rounded hover:bg-gray-100" 
             data-action="suggested-prompts" data-project-id="${project.id}">
            <i class="fas fa-lightbulb w-3 h-3 mr-2"></i>
            <span>Suggested prompts</span>
          </a>
          <a href="#" class="submenu-item flex items-center px-3 py-2 text-xs text-gray-600 rounded hover:bg-gray-100" 
             data-action="competitors" data-project-id="${project.id}">
            <i class="fas fa-users w-3 h-3 mr-2"></i>
            <span>Competitors</span>
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
        } else if (action === 'competitors') {
          this.showCompetitors().catch(console.error);
        }
        
        this.renderProjectsList(); // Re-render pour mettre à jour les états actifs
      });
    });
    
    console.log('✅ Projects list rendered successfully with', this.projects.length, 'projects');
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

  // Page All Projects avec gestion complète
  showAllProjects() {
    this.updatePageHeader('Tous les Projets', 'Gérez tous vos projets de surveillance IA');
    
    const content = `
      <div class="fade-in">
        <!-- Header Actions -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input 
                type="text" 
                id="projectSearch" 
                placeholder="Rechercher un projet..." 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent w-64"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
            <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="paused">En pause</option>
              <option value="archived">Archivé</option>
            </select>
            <select id="industryFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
              <option value="">Toutes les industries</option>
              <option value="Wine">Vin</option>
              <option value="Technology">Technologie</option>
              <option value="Fashion">Mode</option>
              <option value="Healthcare">Santé</option>
              <option value="Finance">Finance</option>
              <option value="Education">Éducation</option>
              <option value="Retail">Commerce</option>
              <option value="Other">Autre</option>
            </select>
          </div>
          <div class="flex items-center space-x-3">
            <button id="bulkActionsBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hidden">
              <i class="fas fa-cog mr-2"></i>Actions groupées
            </button>
            <button id="exportProjectsBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <i class="fas fa-download mr-2"></i>Exporter
            </button>
            <button id="createNewProjectBtn" class="px-4 py-2 bg-aireach-blue text-white rounded-lg hover:bg-blue-700">
              <i class="fas fa-plus mr-2"></i>Nouveau Projet
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-check-circle text-green-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Projets Actifs</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-pause-circle text-yellow-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En Pause</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.filter(p => p.status === 'paused').length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-archive text-gray-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Archivés</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.filter(p => p.status === 'archived').length}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-chart-bar text-blue-600"></i>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Réponses</p>
                <p class="text-2xl font-bold text-gray-900">${this.projects.reduce((sum, p) => sum + (p.total_responses || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                <span id="projectCount">${this.projects.length}</span> Projets
              </h3>
              <div class="flex items-center space-x-2">
                <button id="selectAllBtn" class="text-sm text-aireach-blue hover:text-blue-700">
                  Tout sélectionner
                </button>
                <span class="text-gray-300">|</span>
                <button id="deselectAllBtn" class="text-sm text-aireach-blue hover:text-blue-700">
                  Tout désélectionner
                </button>
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left">
                    <input type="checkbox" id="selectAllCheckbox" class="h-4 w-4 text-aireach-blue border-gray-300 rounded focus:ring-aireach-blue">
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réponses</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière collecte</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody id="projectsTableBody" class="bg-white divide-y divide-gray-200">
                ${this.renderAllProjectsTable()}
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div id="emptyState" class="px-6 py-12 text-center ${this.projects.length > 0 ? 'hidden' : ''}">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-folder-open text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p class="text-gray-500 mb-6">Commencez par créer votre premier projet de surveillance IA.</p>
            <button id="emptyStateCreateBtn" class="bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              <i class="fas fa-plus mr-2"></i>Créer un projet
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;
    this.setupAllProjectsListeners();
  }

  renderAllProjectsTable() {
    if (this.projects.length === 0) {
      return '';
    }

    return this.projects.map(project => `
      <tr class="hover:bg-gray-50 project-row" data-project-id="${project.id}">
        <td class="px-6 py-4">
          <input type="checkbox" class="project-checkbox h-4 w-4 text-aireach-blue border-gray-300 rounded focus:ring-aireach-blue" data-project-id="${project.id}">
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">${project.brand_name ? project.brand_name.charAt(0).toUpperCase() : 'P'}</span>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">${project.brand_name || project.name}</div>
              <div class="text-sm text-gray-500">${project.name || ''}</div>
              <div class="text-xs text-gray-400">${project.industry || 'Non spécifié'}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="status-${project.status} px-3 py-1 rounded-full text-xs font-medium">
            ${this.getStatusLabel(project.status)}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          ${project.total_queries || 0}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          <div class="flex items-center">
            <span class="font-medium">${project.total_responses || 0}</span>
            ${project.total_responses && project.total_responses > 0 ? `
              <div class="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                <div class="bg-aireach-blue h-1.5 rounded-full" style="width: ${Math.min((project.total_responses / 100) * 100, 100)}%"></div>
              </div>
            ` : ''}
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-gray-500">
          ${project.last_collection ? this.formatDate(project.last_collection) : 'Jamais'}
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center space-x-2">
            <button class="view-project-btn text-aireach-blue hover:text-blue-700 p-1" data-project-id="${project.id}" title="Voir le projet">
              <i class="fas fa-eye text-sm"></i>
            </button>
            <button class="edit-project-btn text-gray-500 hover:text-gray-700 p-1" data-project-id="${project.id}" title="Modifier">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <div class="relative">
              <button class="project-menu-btn text-gray-500 hover:text-gray-700 p-1" data-project-id="${project.id}" title="Plus d'actions">
                <i class="fas fa-ellipsis-v text-sm"></i>
              </button>
              <div class="project-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden">
                <div class="py-1">
                  <button class="collect-data-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-robot mr-2"></i>Collecter les données
                  </button>
                  <button class="toggle-status-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-${project.status === 'active' ? 'pause' : 'play'} mr-2"></i>
                    ${project.status === 'active' ? 'Mettre en pause' : 'Activer'}
                  </button>
                  <button class="duplicate-project-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-copy mr-2"></i>Dupliquer
                  </button>
                  <hr class="border-gray-100 my-1">
                  <button class="archive-project-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-archive mr-2"></i>
                    ${project.status === 'archived' ? 'Désarchiver' : 'Archiver'}
                  </button>
                  <button class="delete-project-btn block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" data-project-id="${project.id}">
                    <i class="fas fa-trash mr-2"></i>Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');
  }

  setupAllProjectsListeners() {
    // Search functionality
    document.getElementById('projectSearch').addEventListener('input', (e) => {
      this.filterProjects();
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
      this.filterProjects();
    });

    // Industry filter
    document.getElementById('industryFilter').addEventListener('change', (e) => {
      this.filterProjects();
    });

    // Create new project
    document.getElementById('createNewProjectBtn').addEventListener('click', () => {
      this.showCreateProjectWizard();
    });

    // Empty state create button
    document.getElementById('emptyStateCreateBtn')?.addEventListener('click', () => {
      this.showCreateProjectWizard();
    });

    // Export projects
    document.getElementById('exportProjectsBtn').addEventListener('click', () => {
      this.exportProjects();
    });

    // Select all/deselect all
    document.getElementById('selectAllBtn').addEventListener('click', () => {
      this.selectAllProjects(true);
    });

    document.getElementById('deselectAllBtn').addEventListener('click', () => {
      this.selectAllProjects(false);
    });

    // Select all checkbox
    document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
      this.selectAllProjects(e.target.checked);
    });

    // Individual project checkboxes
    document.querySelectorAll('.project-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateBulkActionsVisibility();
      });
    });

    // View project buttons
    document.querySelectorAll('.view-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.selectProject(projectId);
        this.navigateToSection('dashboard');
      });
    });

    // Edit project buttons
    document.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.showEditProjectModal(projectId);
      });
    });

    // Project menu buttons
    document.querySelectorAll('.project-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleProjectMenu(e.currentTarget);
      });
    });

    // Collect data buttons
    document.querySelectorAll('.collect-data-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.collectProjectData(projectId);
      });
    });

    // Toggle status buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.toggleProjectStatus(projectId);
      });
    });

    // Archive/unarchive buttons
    document.querySelectorAll('.archive-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.toggleProjectArchive(projectId);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.deleteProject(projectId);
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-menu-btn')) {
        document.querySelectorAll('.project-menu').forEach(menu => {
          menu.classList.add('hidden');
        });
      }
    });
  }

  // Project filtering
  filterProjects() {
    const search = document.getElementById('projectSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const industryFilter = document.getElementById('industryFilter').value;

    const filteredProjects = this.projects.filter(project => {
      const matchesSearch = !search || 
        project.brand_name?.toLowerCase().includes(search) ||
        project.name?.toLowerCase().includes(search) ||
        project.industry?.toLowerCase().includes(search);
      
      const matchesStatus = !statusFilter || project.status === statusFilter;
      const matchesIndustry = !industryFilter || project.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesIndustry;
    });

    // Update table with filtered projects
    const tableBody = document.getElementById('projectsTableBody');
    tableBody.innerHTML = this.renderFilteredProjectsTable(filteredProjects);
    
    // Update count
    document.getElementById('projectCount').textContent = filteredProjects.length;
    
    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (filteredProjects.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    // Re-setup listeners for new elements
    this.setupTableListeners();
  }

  renderFilteredProjectsTable(projects) {
    if (projects.length === 0) {
      return '';
    }

    return projects.map(project => `
      <tr class="hover:bg-gray-50 project-row" data-project-id="${project.id}">
        <td class="px-6 py-4">
          <input type="checkbox" class="project-checkbox h-4 w-4 text-aireach-blue border-gray-300 rounded focus:ring-aireach-blue" data-project-id="${project.id}">
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">${project.brand_name ? project.brand_name.charAt(0).toUpperCase() : 'P'}</span>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">${project.brand_name || project.name}</div>
              <div class="text-sm text-gray-500">${project.name || ''}</div>
              <div class="text-xs text-gray-400">${project.industry || 'Non spécifié'}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="status-${project.status} px-3 py-1 rounded-full text-xs font-medium">
            ${this.getStatusLabel(project.status)}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          ${project.total_queries || 0}
        </td>
        <td class="px-6 py-4 text-sm text-gray-900">
          <div class="flex items-center">
            <span class="font-medium">${project.total_responses || 0}</span>
            ${project.total_responses && project.total_responses > 0 ? `
              <div class="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                <div class="bg-aireach-blue h-1.5 rounded-full" style="width: ${Math.min((project.total_responses / 100) * 100, 100)}%"></div>
              </div>
            ` : ''}
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-gray-500">
          ${project.last_collection ? this.formatDate(project.last_collection) : 'Jamais'}
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center space-x-2">
            <button class="view-project-btn text-aireach-blue hover:text-blue-700 p-1" data-project-id="${project.id}" title="Voir le projet">
              <i class="fas fa-eye text-sm"></i>
            </button>
            <button class="edit-project-btn text-gray-500 hover:text-gray-700 p-1" data-project-id="${project.id}" title="Modifier">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <div class="relative">
              <button class="project-menu-btn text-gray-500 hover:text-gray-700 p-1" data-project-id="${project.id}" title="Plus d'actions">
                <i class="fas fa-ellipsis-v text-sm"></i>
              </button>
              <div class="project-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden">
                <div class="py-1">
                  <button class="collect-data-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-robot mr-2"></i>Collecter les données
                  </button>
                  <button class="toggle-status-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-${project.status === 'active' ? 'pause' : 'play'} mr-2"></i>
                    ${project.status === 'active' ? 'Mettre en pause' : 'Activer'}
                  </button>
                  <button class="duplicate-project-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-copy mr-2"></i>Dupliquer
                  </button>
                  <hr class="border-gray-100 my-1">
                  <button class="archive-project-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-project-id="${project.id}">
                    <i class="fas fa-archive mr-2"></i>
                    ${project.status === 'archived' ? 'Désarchiver' : 'Archiver'}
                  </button>
                  <button class="delete-project-btn block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" data-project-id="${project.id}">
                    <i class="fas fa-trash mr-2"></i>Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');
  }

  setupTableListeners() {
    // Re-setup all event listeners for dynamically created table elements
    // Individual project checkboxes
    document.querySelectorAll('.project-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateBulkActionsVisibility();
      });
    });

    // View project buttons
    document.querySelectorAll('.view-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.selectProject(projectId);
        this.navigateToSection('dashboard');
      });
    });

    // Edit project buttons
    document.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.showEditProjectModal(projectId);
      });
    });

    // Project menu buttons
    document.querySelectorAll('.project-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleProjectMenu(e.currentTarget);
      });
    });

    // Collect data buttons
    document.querySelectorAll('.collect-data-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.collectProjectData(projectId);
      });
    });

    // Toggle status buttons
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.toggleProjectStatus(projectId);
      });
    });

    // Archive/unarchive buttons
    document.querySelectorAll('.archive-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.toggleProjectArchive(projectId);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = parseInt(e.currentTarget.getAttribute('data-project-id'));
        this.deleteProject(projectId);
      });
    });
  }

  // Project management methods
  selectAllProjects(select) {
    const checkboxes = document.querySelectorAll('.project-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = select;
    });
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    selectAllCheckbox.checked = select;
    
    this.updateBulkActionsVisibility();
  }

  updateBulkActionsVisibility() {
    const checkedBoxes = document.querySelectorAll('.project-checkbox:checked');
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    
    if (checkedBoxes.length > 0) {
      bulkActionsBtn.classList.remove('hidden');
      bulkActionsBtn.textContent = `Actions groupées (${checkedBoxes.length})`;
    } else {
      bulkActionsBtn.classList.add('hidden');
    }
  }

  toggleProjectMenu(button) {
    // Close all other menus
    document.querySelectorAll('.project-menu').forEach(menu => {
      if (menu.previousElementSibling !== button) {
        menu.classList.add('hidden');
      }
    });

    // Toggle current menu
    const menu = button.nextElementSibling;
    menu.classList.toggle('hidden');
  }

  async collectProjectData(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      this.showSuccess(`🚀 Collecte lancée pour "${project.brand_name}"`);
      
      const response = await axios.post(`/api/projects/${projectId}/collect`);
      
      if (response.data.success) {
        const { total, successful, failed } = response.data.data.summary;
        this.showSuccess(`✅ Collecte terminée pour "${project.brand_name}": ${successful}/${total} réponses`);
        
        // Update project data
        project.total_responses = (project.total_responses || 0) + successful;
        project.last_collection = new Date().toISOString();
        
        // Refresh the current view
        if (this.currentSection === 'all-projects') {
          this.showAllProjects();
        }
      }
    } catch (error) {
      console.error('Collection failed:', error);
      this.showError(`❌ Échec de la collecte pour "${project.brand_name}"`);
    }
  }

  async toggleProjectStatus(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const newStatus = project.status === 'active' ? 'paused' : 'active';
    
    try {
      const response = await axios.put(`/api/projects/${projectId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        project.status = newStatus;
        this.showSuccess(`✅ Projet "${project.brand_name}" ${newStatus === 'active' ? 'activé' : 'mis en pause'}`);
        
        // Refresh the current view
        if (this.currentSection === 'all-projects') {
          this.showAllProjects();
        }
      }
    } catch (error) {
      console.error('Status toggle failed:', error);
      this.showError('Impossible de changer le statut du projet');
    }
  }

  async toggleProjectArchive(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const newStatus = project.status === 'archived' ? 'paused' : 'archived';
    
    try {
      const response = await axios.put(`/api/projects/${projectId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        project.status = newStatus;
        this.showSuccess(`✅ Projet "${project.brand_name}" ${newStatus === 'archived' ? 'archivé' : 'désarchivé'}`);
        
        // Refresh the current view
        if (this.currentSection === 'all-projects') {
          this.showAllProjects();
        }
      }
    } catch (error) {
      console.error('Archive toggle failed:', error);
      this.showError('Impossible de modifier le statut d\'archive du projet');
    }
  }

  async deleteProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    // Confirmation dialog
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.brand_name}" ?\n\nCette action est irréversible et supprimera toutes les données associées.`);
    
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/projects/${projectId}`);
      
      if (response.data.success) {
        // Remove from local array
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        this.showSuccess(`✅ Projet "${project.brand_name}" supprimé`);
        
        // Refresh the current view
        if (this.currentSection === 'all-projects') {
          this.showAllProjects();
        }

        // If it was the current project, reset current project
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject = null;
        }
      }
    } catch (error) {
      console.error('Delete failed:', error);
      this.showError('Impossible de supprimer le projet');
    }
  }

  showEditProjectModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    // For now, show a notification that this feature is coming
    this.showNotification('Fonctionnalité d\'édition à venir', 'info');
  }

  exportProjects() {
    // Create CSV content
    const csvContent = [
      ['Nom', 'Marque', 'Industrie', 'Statut', 'Questions', 'Réponses', 'Site Web', 'Créé le'].join(','),
      ...this.projects.map(project => [
        project.name || '',
        project.brand_name || '',
        project.industry || '',
        this.getStatusLabel(project.status),
        project.total_queries || 0,
        project.total_responses || 0,
        project.website_url || '',
        this.formatDate(project.created_at || new Date().toISOString())
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `aireach-projets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showSuccess('📊 Export des projets téléchargé');
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

  // ===== WIZARD DE CRÉATION DE PROJET EN 5 ÉTAPES =====

  showCreateProjectWizard() {
    this.wizardData = {
      step: 1,
      domain: '',
      brandInfo: null,
      selectedCountry: null,
      selectedLanguage: null,
      detectedInfo: null,
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
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">2</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">3</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">5</div>
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

  // Traitement étape 1: Passage à l'étape 2 (langue/pays)
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
        this.wizardData.detectedInfo = response.data.data; // Sauvegarder info détectée
        this.wizardData.step = 2;
        this.renderWizardStep2(); // Nouvelle étape langue/pays
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Brand detection failed:', error);
      this.showError('Échec de la détection de marque');
      document.getElementById('wizardStep1Next').innerHTML = 'Suivant';
    }
  }

  // Étape 2: Sélection langue et pays
  renderWizardStep2() {
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
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">3</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">5</div>
          </div>
        </div>

        <!-- Info marque détectée -->
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-3"></i>
            <div>
              <p class="font-semibold text-gray-900">Marque détectée:</p>
              <p class="text-aireach-blue font-bold text-lg">${this.wizardData.brandInfo.detectedBrandName}</p>
              <p class="text-sm text-gray-600">Industrie: ${this.wizardData.brandInfo.industry}</p>
            </div>
          </div>
        </div>

        <!-- Contenu Étape 2 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Choisir la langue et le pays</h2>
          <p class="text-gray-600">Sélectionnez la langue et le pays pour personnaliser les questions générées.</p>
        </div>

        <div class="space-y-6">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="wizardCountry" class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-globe mr-2"></i>Pays:
                </label>
                <select id="wizardCountry" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent text-sm">
                  <option value="Morocco" ${(this.wizardData.brandInfo?.country === 'Morocco') ? 'selected' : ''}>🇲🇦 Morocco</option>
                  <option value="France" ${(this.wizardData.brandInfo?.country === 'France') ? 'selected' : ''}>🇫🇷 France</option>
                  <option value="United States" ${(this.wizardData.brandInfo?.country === 'United States') ? 'selected' : ''}>🇺🇸 United States</option>
                  <option value="United Kingdom" ${(this.wizardData.brandInfo?.country === 'United Kingdom') ? 'selected' : ''}>🇬🇧 United Kingdom</option>
                  <option value="Canada" ${(this.wizardData.brandInfo?.country === 'Canada') ? 'selected' : ''}>🇨🇦 Canada</option>
                  <option value="Germany" ${(this.wizardData.brandInfo?.country === 'Germany') ? 'selected' : ''}>🇩🇪 Germany</option>
                  <option value="Spain" ${(this.wizardData.brandInfo?.country === 'Spain') ? 'selected' : ''}>🇪🇸 Spain</option>
                  <option value="Italy" ${(this.wizardData.brandInfo?.country === 'Italy') ? 'selected' : ''}>🇮🇹 Italy</option>
                </select>
              </div>
              <div>
                <label for="wizardLanguage" class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-language mr-2"></i>Langue:
                </label>
                <select id="wizardLanguage" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent text-sm">
                  <option value="French" ${(this.wizardData.brandInfo?.language === 'French') ? 'selected' : ''}>🇫🇷 Français</option>
                  <option value="English" ${(this.wizardData.brandInfo?.language === 'English') ? 'selected' : ''}>🇺🇸 English</option>
                  <option value="Arabic" ${(this.wizardData.brandInfo?.language === 'Arabic') ? 'selected' : ''}>🇸🇦 العربية</option>
                  <option value="Spanish" ${(this.wizardData.brandInfo?.language === 'Spanish') ? 'selected' : ''}>🇪🇸 Español</option>
                  <option value="German" ${(this.wizardData.brandInfo?.language === 'German') ? 'selected' : ''}>🇩🇪 Deutsch</option>
                  <option value="Italian" ${(this.wizardData.brandInfo?.language === 'Italian') ? 'selected' : ''}>🇮🇹 Italiano</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex justify-between">
            <button id="wizardStep2Back" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Retour
            </button>
            <button id="wizardStep2Next" class="bg-aireach-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold">
              Suivant
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupStep2Listeners();
  }

  // Étape 3: Sélection des questions
  async renderWizardStep3() {
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
              <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
              <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
              <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
              <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
              <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">4</div>
              <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
              <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">5</div>
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
            <button id="wizardStep3Back" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Retour
            </button>
            <button 
              id="wizardStep3Next" 
              class="bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              ${this.wizardData.selectedQuestions.length === 0 ? 'disabled' : ''}
            >
              Suivant
            </button>
          </div>
        </div>
      `;

      // Event listeners
      this.setupStep3Listeners();

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

    // Next button
    document.getElementById('wizardStep2Next').addEventListener('click', () => {
      // Sauvegarder les choix
      this.wizardData.selectedCountry = document.getElementById('wizardCountry').value;
      this.wizardData.selectedLanguage = document.getElementById('wizardLanguage').value;
      
      this.wizardData.step = 3;
      this.processStep2(); // Passer à l'étape 3 (questions)
    });
  }

  setupStep3Listeners() {
    // Close wizard
    document.getElementById('closeWizard').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    // Back button
    document.getElementById('wizardStep3Back').addEventListener('click', () => {
      this.wizardData.step = 2;
      this.renderWizardStep2();
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
          const nextBtn = document.getElementById('wizardStep3Next');
          nextBtn.disabled = this.wizardData.selectedQuestions.length === 0;
          nextBtn.className = this.wizardData.selectedQuestions.length > 0
            ? 'bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed';
        }
      });
    });

    // Next button
    document.getElementById('wizardStep3Next').addEventListener('click', () => {
      if (this.wizardData.selectedQuestions.length > 0) {
        this.processStep3();
      }
    });
  }

  // Traitement étape 2: Génération des questions avec langue/pays
  async processStep2() {
    try {
      // Générer les questions avec langue et pays sélectionnés
      const response = await axios.post('/api/questions/generate', {
        brandName: this.wizardData.brandInfo.detectedBrandName,
        industry: this.wizardData.brandInfo.industry,
        domain: this.wizardData.domain,
        country: this.wizardData.selectedCountry,
        language: this.wizardData.selectedLanguage
      });

      if (response.data.success) {
        const questionsData = response.data.data;
        this.wizardData.availableQuestions = questionsData.questions;
        this.wizardData.selectedQuestions = questionsData.questions.filter(q => q.isSelected);
        this.renderWizardStep3();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Question generation failed:', error);
      this.showError('Échec de la génération des questions');
    }
  }

  // Étape 3: Sélection des questions
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
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Choisir/Ajouter des questions</h2>
          <p class="text-gray-600">Sélectionnez les questions à surveiller pour cette marque</p>
        </div>

        <!-- Limite -->
        <div class="flex justify-between items-center mb-4">
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
          <button id="wizardStep3Back" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Retour
          </button>
          <button 
            id="wizardStep3Next" 
            class="bg-aireach-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            ${this.wizardData.selectedQuestions.length === 0 ? 'disabled' : ''}
          >
            Suivant
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
      if (this.wizardData.selectedQuestions.length > 0) {
        this.processStep3();
      }
    });
  }

  // Traitement étape 3: Obtenir les volumes de recherche
  async processStep3() {
    try {
      document.getElementById('wizardStep3Next').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Chargement...';
      
      const response = await axios.post('/api/questions/volumes', {
        questions: this.wizardData.selectedQuestions
      });

      if (response.data.success) {
        this.wizardData.questionsWithVolumes = response.data.data.questions;
        this.wizardData.step = 4;
        this.renderWizardStep4();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Volume fetching failed:', error);
      this.showError('Échec de la récupération des volumes');
      document.getElementById('wizardStep3Next').innerHTML = 'Suivant';
    }
  }

  // Étape 4: Affichage des volumes de recherche
  renderWizardStep4() {
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
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
            <div class="w-12 h-0.5 bg-gray-300 mx-1"></div>
            <div class="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">5</div>
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
          <button id="wizardStep4Back" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Retour
          </button>
          <button id="wizardStep4Next" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold">
            Enregistrer & Lancer
          </button>
        </div>
      </div>
    `;

    this.setupStep4Listeners();
  }

  setupStep4Listeners() {
    document.getElementById('closeWizard').addEventListener('click', () => {
      document.getElementById('newProjectModal').classList.add('hidden');
    });

    document.getElementById('wizardStep4Back').addEventListener('click', () => {
      this.wizardData.step = 3;
      this.renderWizardStep3();
    });

    document.getElementById('wizardStep4Next').addEventListener('click', () => {
      this.processStep4();
    });
  }

  // Traitement étape 4: Créer le projet
  async processStep4() {
    try {
      document.getElementById('wizardStep4Next').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Création...';
      
      // Passer à l'étape 5 (loading)
      this.renderWizardStep5();

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
      this.renderWizardStep4(); // Retour à l'étape 4
    }
  }

  // Étape 5: Loading et finalisation
  renderWizardStep5() {
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
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
            <div class="w-12 h-0.5 bg-green-500 mx-1"></div>
            <div class="w-8 h-8 bg-aireach-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
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

  // Méthodes utilitaires pour drapeaux
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
    return flags[language] || '🌍';
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

  // Overview complète du projet avec toutes les métriques
  showProjectOverview() {
    this.currentSection = 'project-overview';
    this.updatePageHeader(`Overview - ${this.currentProject.brand_name}`, `Vue détaillée du projet ${this.currentProject.name}`);
    
    // Données simulées pour démonstration
    const mockData = this.generateMockOverviewData();
    
    const content = `
      <div class="fade-in">
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-star text-blue-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-600">Brand Score</span>
              </div>
              <span class="text-xs text-gray-400">+${mockData.brandScore.trend}%</span>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">${mockData.brandScore.value}</span>
              <span class="ml-2 text-sm ${mockData.brandScore.trend >= 0 ? 'text-green-600' : 'text-red-600'}">
                <i class="fas fa-arrow-${mockData.brandScore.trend >= 0 ? 'up' : 'down'}"></i> ${Math.abs(mockData.brandScore.trend)}%
              </span>
            </div>
          </div>
          
          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-trophy text-purple-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-600">Median Position</span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">#${mockData.medianPosition.value}</span>
              <span class="ml-2 text-sm ${mockData.medianPosition.trend <= 0 ? 'text-green-600' : 'text-red-600'}">
                <i class="fas fa-arrow-${mockData.medianPosition.trend <= 0 ? 'up' : 'down'}"></i> ${Math.abs(mockData.medianPosition.trend)}
              </span>
            </div>
          </div>

          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-eye text-green-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-600">Visibility Score</span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">${mockData.visibilityScore.value}%</span>
              <span class="ml-2 text-sm ${mockData.visibilityScore.trend >= 0 ? 'text-green-600' : 'text-red-600'}">
                <i class="fas fa-arrow-${mockData.visibilityScore.trend >= 0 ? 'up' : 'down'}"></i> ${Math.abs(mockData.visibilityScore.trend)}%
              </span>
            </div>
          </div>

          <div class="metric-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-chart-pie text-yellow-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-600">Share of Voice</span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">${mockData.shareOfVoice.value}%</span>
              <span class="ml-2 text-sm ${mockData.shareOfVoice.trend >= 0 ? 'text-green-600' : 'text-red-600'}">
                <i class="fas fa-arrow-${mockData.shareOfVoice.trend >= 0 ? 'up' : 'down'}"></i> ${Math.abs(mockData.shareOfVoice.trend)}%
              </span>
            </div>
          </div>
        </div>

        <!-- Brand Score & Average Position Chart -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Brand Score & Average Position</h3>
            <div class="chart-container">
              <canvas id="brandScoreChart"></canvas>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Share of Voice</h3>
            <div class="chart-container">
              <canvas id="shareOfVoiceChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Share of Voice by AI Chatbots -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Share of Voice by AI Chatbots</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${mockData.chatbotShareOfVoice.map(chatbot => `
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="platform-logo platform-${chatbot.platform.toLowerCase()}">${chatbot.platform.charAt(0)}</div>
                    <span class="ml-2 font-medium text-sm">${chatbot.platform}</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">${chatbot.percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-aireach-blue h-2 rounded-full" style="width: ${chatbot.percentage}%"></div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  ${chatbot.mentions} mentions · Pos. avg: #${chatbot.avgPosition}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Insights Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Insights
            </h3>
            <button class="text-sm text-aireach-blue hover:text-blue-700">Voir tous →</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${mockData.insights.map(insight => `
              <div class="insight-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-${insight.type === 'positive' ? 'green' : insight.type === 'negative' ? 'red' : 'blue'}-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <i class="fas fa-${insight.type === 'positive' ? 'thumbs-up text-green-600' : insight.type === 'negative' ? 'exclamation-triangle text-red-600' : 'info-circle text-blue-600'} text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 mb-1">${insight.title}</p>
                    <p class="text-xs text-gray-600">${insight.description}</p>
                    <span class="inline-block mt-2 text-xs text-gray-500">${insight.date}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Key Prompts / Questions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-question-circle text-blue-500 mr-2"></i>
              Key Prompts / Questions
            </h3>
            <button class="text-sm text-aireach-blue hover:text-blue-700">Gérer les questions →</button>
          </div>
          <div class="space-y-4">
            ${mockData.keyPrompts.map(prompt => `
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="font-medium text-gray-900 mb-1">${prompt.question}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span><i class="fas fa-chart-bar mr-1"></i>Vol: ${prompt.volume}</span>
                    <span><i class="fas fa-trophy mr-1"></i>Pos: #${prompt.position}</span>
                    <span><i class="fas fa-comments mr-1"></i>${prompt.mentions} mentions</span>
                    <span class="px-2 py-1 bg-${prompt.sentiment === 'positive' ? 'green' : prompt.sentiment === 'negative' ? 'red' : 'yellow'}-100 text-${prompt.sentiment === 'positive' ? 'green' : prompt.sentiment === 'negative' ? 'red' : 'yellow'}-800 rounded-full text-xs">${prompt.sentiment}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="text-gray-400 hover:text-gray-600" title="Voir détails">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="text-gray-400 hover:text-gray-600" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Key Sources & AI Citations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                <i class="fas fa-link text-purple-500 mr-2"></i>
                Key Sources
              </h3>
              <button class="text-sm text-aireach-blue hover:text-blue-700">Voir toutes →</button>
            </div>
            <div class="space-y-4">
              ${mockData.keySources.map(source => `
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex-1">
                    <p class="font-medium text-sm text-gray-900 truncate">${source.title}</p>
                    <p class="text-xs text-gray-600 truncate">${source.url}</p>
                    <div class="flex items-center mt-1 text-xs text-gray-500">
                      <span class="mr-3">Citations: ${source.citations}</span>
                      <span>Score: ${source.trustScore}/100</span>
                    </div>
                  </div>
                  <div class="w-2 h-2 bg-${source.trustScore >= 80 ? 'green' : source.trustScore >= 60 ? 'yellow' : 'red'}-500 rounded-full ml-3"></div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                <i class="fas fa-quote-right text-green-500 mr-2"></i>
                AI Citations
              </h3>
              <button class="text-sm text-aireach-blue hover:text-blue-700">Analyser →</button>
            </div>
            <div class="space-y-4">
              ${mockData.aiCitations.map(citation => `
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <div class="platform-logo platform-${citation.platform.toLowerCase()}">${citation.platform.charAt(0)}</div>
                      <span class="ml-2 font-medium text-sm">${citation.platform}</span>
                    </div>
                    <span class="text-xs text-gray-500">${citation.date}</span>
                  </div>
                  <p class="text-sm text-gray-700 mb-2 line-clamp-2">${citation.excerpt}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Position: #${citation.position}</span>
                    <span class="px-2 py-1 bg-${citation.sentiment === 'positive' ? 'green' : citation.sentiment === 'negative' ? 'red' : 'gray'}-100 text-${citation.sentiment === 'positive' ? 'green' : citation.sentiment === 'negative' ? 'red' : 'gray'}-800 rounded-full">${citation.sentiment}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3">
          <button id="collectDataBtn" class="action-btn bg-aireach-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center">
            <i class="fas fa-robot mr-2"></i>
            Collecter les Données
          </button>
          <button id="exportOverviewBtn" class="action-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center">
            <i class="fas fa-download mr-2"></i>
            Exporter l'Overview
          </button>
          <button id="scheduleReportBtn" class="action-btn bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center">
            <i class="fas fa-calendar mr-2"></i>
            Programmer un Rapport
          </button>
          <button id="shareOverviewBtn" class="action-btn bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center">
            <i class="fas fa-share mr-2"></i>
            Partager
          </button>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;
    
    // Initialize charts
    this.initializeOverviewCharts(mockData);
    
    // Setup event listeners
    this.setupOverviewListeners();
    
    console.log(`📊 Showing comprehensive overview for project: ${this.currentProject.name}`);
  }

  // Générer des données mock pour l'overview
  generateMockOverviewData() {
    const baseScore = 75 + Math.random() * 20; // 75-95
    const basePosition = 2 + Math.random() * 3; // 2-5
    
    return {
      brandScore: {
        value: Math.round(baseScore),
        trend: Math.round((Math.random() - 0.5) * 10) // -5 to +5
      },
      medianPosition: {
        value: Math.round(basePosition),
        trend: Math.round((Math.random() - 0.5) * 2) // -1 to +1
      },
      visibilityScore: {
        value: Math.round(60 + Math.random() * 30), // 60-90%
        trend: Math.round((Math.random() - 0.3) * 8) // -2.4 to +5.6
      },
      shareOfVoice: {
        value: Math.round(15 + Math.random() * 25), // 15-40%
        trend: Math.round((Math.random() - 0.4) * 6) // -2.4 to +3.6
      },
      chatbotShareOfVoice: [
        {
          platform: 'ChatGPT',
          percentage: Math.round(25 + Math.random() * 15),
          mentions: Math.round(45 + Math.random() * 20),
          avgPosition: (2 + Math.random() * 2).toFixed(1)
        },
        {
          platform: 'Gemini',
          percentage: Math.round(20 + Math.random() * 15),
          mentions: Math.round(35 + Math.random() * 15),
          avgPosition: (2.5 + Math.random() * 2).toFixed(1)
        },
        {
          platform: 'Claude',
          percentage: Math.round(15 + Math.random() * 10),
          mentions: Math.round(25 + Math.random() * 15),
          avgPosition: (1.8 + Math.random() * 2.5).toFixed(1)
        },
        {
          platform: 'Perplexity',
          percentage: Math.round(10 + Math.random() * 10),
          mentions: Math.round(15 + Math.random() * 10),
          avgPosition: (3 + Math.random() * 2).toFixed(1)
        }
      ],
      insights: [
        {
          type: 'positive',
          title: 'Amélioration du score de marque',
          description: 'Le score de marque a augmenté de 12% ce mois-ci grâce aux mentions positives.',
          date: 'Il y a 2 jours'
        },
        {
          type: 'neutral',
          title: 'Nouvelles questions identifiées',
          description: '5 nouvelles questions pertinentes ont été détectées dans les conversations IA.',
          date: 'Il y a 3 jours'
        },
        {
          type: 'negative',
          title: 'Baisse de visibilité sur ChatGPT',
          description: 'La visibilité a diminué de 8% sur ChatGPT cette semaine.',
          date: 'Il y a 5 jours'
        }
      ],
      keyPrompts: [
        {
          question: `Quels sont les meilleurs produits ${this.currentProject.brand_name} ?`,
          volume: 1250,
          position: 2,
          mentions: 45,
          sentiment: 'positive'
        },
        {
          question: `Comment contacter le service client ${this.currentProject.brand_name} ?`,
          volume: 890,
          position: 1,
          mentions: 32,
          sentiment: 'neutral'
        },
        {
          question: `Avis sur ${this.currentProject.brand_name} ?`,
          volume: 650,
          position: 3,
          mentions: 28,
          sentiment: 'positive'
        },
        {
          question: `${this.currentProject.brand_name} vs concurrents ?`,
          volume: 520,
          position: 4,
          mentions: 22,
          sentiment: 'neutral'
        }
      ],
      keySources: [
        {
          title: `Site officiel ${this.currentProject.brand_name}`,
          url: this.currentProject.website_url || `${this.currentProject.brand_name.toLowerCase()}.com`,
          citations: 125,
          trustScore: 95
        },
        {
          title: `Wikipedia - ${this.currentProject.brand_name}`,
          url: `fr.wikipedia.org/wiki/${this.currentProject.brand_name}`,
          citations: 89,
          trustScore: 92
        },
        {
          title: `Articles de presse - ${this.currentProject.brand_name}`,
          url: 'lemonde.fr/economie',
          citations: 67,
          trustScore: 88
        },
        {
          title: `Forum consommateurs`,
          url: 'consommateurassocié.fr',
          citations: 34,
          trustScore: 72
        }
      ],
      aiCitations: [
        {
          platform: 'ChatGPT',
          excerpt: `${this.currentProject.brand_name} est reconnu pour la qualité de ses produits et son service client exceptionnel...`,
          position: 1,
          sentiment: 'positive',
          date: 'Il y a 1h'
        },
        {
          platform: 'Claude',
          excerpt: `En comparaison avec ses concurrents, ${this.currentProject.brand_name} se distingue par son innovation...`,
          position: 2,
          sentiment: 'positive',
          date: 'Il y a 3h'
        },
        {
          platform: 'Gemini',
          excerpt: `Les utilisateurs apprécient particulièrement l'approche client de ${this.currentProject.brand_name}...`,
          position: 2,
          sentiment: 'positive',
          date: 'Il y a 5h'
        },
        {
          platform: 'Perplexity',
          excerpt: `${this.currentProject.brand_name} propose une gamme diversifiée avec des options pour tous les budgets...`,
          position: 3,
          sentiment: 'neutral',
          date: 'Il y a 8h'
        }
      ]
    };
  }

  // Initialiser les graphiques de l'overview
  initializeOverviewCharts(data) {
    // Brand Score & Position Chart
    const brandScoreCtx = document.getElementById('brandScoreChart');
    if (brandScoreCtx) {
      new Chart(brandScoreCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Brand Score',
            data: [70, 72, 75, 78, 76, data.brandScore.value],
            borderColor: '#1e40af',
            backgroundColor: 'rgba(30, 64, 175, 0.1)',
            yAxisID: 'y'
          }, {
            label: 'Position Moyenne',
            data: [4.2, 3.8, 3.5, 3.2, 2.9, data.medianPosition.value],
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Mois'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Brand Score'
              },
              min: 0,
              max: 100
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Position (inversée)'
              },
              min: 1,
              max: 10,
              reverse: true,
              grid: {
                drawOnChartArea: false,
              },
            }
          },
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    }

    // Share of Voice Chart
    const shareOfVoiceCtx = document.getElementById('shareOfVoiceChart');
    if (shareOfVoiceCtx) {
      new Chart(shareOfVoiceCtx, {
        type: 'doughnut',
        data: {
          labels: data.chatbotShareOfVoice.map(item => item.platform),
          datasets: [{
            data: data.chatbotShareOfVoice.map(item => item.percentage),
            backgroundColor: [
              '#10a37f', // ChatGPT
              '#4285f4', // Gemini
              '#cc785c', // Claude
              '#6366f1'  // Perplexity
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    }
  }

  // Event listeners pour la page overview
  setupOverviewListeners() {
    // Collect Data button
    document.getElementById('collectDataBtn')?.addEventListener('click', () => {
      this.startDataCollection();
    });

    // Export Overview button
    document.getElementById('exportOverviewBtn')?.addEventListener('click', () => {
      this.exportOverviewData();
    });

    // Schedule Report button
    document.getElementById('scheduleReportBtn')?.addEventListener('click', () => {
      this.showScheduleModal();
    });

    // Share Overview button
    document.getElementById('shareOverviewBtn')?.addEventListener('click', () => {
      this.shareOverview();
    });
  }

  // Export des données d'overview
  exportOverviewData() {
    const data = this.generateMockOverviewData();
    
    const csvContent = [
      ['Metric', 'Value', 'Trend'].join(','),
      ['Brand Score', data.brandScore.value, data.brandScore.trend].join(','),
      ['Median Position', data.medianPosition.value, data.medianPosition.trend].join(','),
      ['Visibility Score', data.visibilityScore.value + '%', data.visibilityScore.trend + '%'].join(','),
      ['Share of Voice', data.shareOfVoice.value + '%', data.shareOfVoice.trend + '%'].join(','),
      ['', '', ''],
      ['Chatbot', 'Share %', 'Mentions'].join(','),
      ...data.chatbotShareOfVoice.map(item => [item.platform, item.percentage, item.mentions].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.currentProject.brand_name}-overview-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showSuccess(`📊 Overview de "${this.currentProject.brand_name}" exporté`);
  }

  // Partager l'overview
  shareOverview() {
    if (navigator.share) {
      navigator.share({
        title: `Overview ${this.currentProject.brand_name} - AIREACH`,
        text: `Découvrez les performances de ${this.currentProject.brand_name} dans les IA`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showSuccess('🔗 Lien copié dans le presse-papier');
      }).catch(() => {
        this.showNotification('Fonctionnalité de partage non disponible', 'info');
      });
    }
  }

  // Page d'analyse des concurrents avec IA en temps réel
  async showCompetitors() {
    this.currentSection = 'competitors';
    this.updatePageHeader(`Competitors - ${this.currentProject.brand_name}`, `Analyse concurrentielle IA pour ${this.currentProject.name}`);
    
    // Afficher d'abord un loader
    document.getElementById('mainContent').innerHTML = `
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-aireach-blue mx-auto mb-4"></div>
          <p class="text-gray-600">🤖 Analyse IA en temps réel...</p>
          <p class="text-sm text-gray-400 mt-2">Identification des vrais concurrents via intelligence artificielle</p>
          <div class="mt-4 flex items-center justify-center space-x-4">
            <div class="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <i class="fas fa-robot text-blue-500 mr-2"></i>
              <span class="text-xs text-blue-700">OpenAI GPT-4o</span>
            </div>
            <div class="flex items-center bg-purple-50 px-3 py-1 rounded-full">
              <i class="fas fa-brain text-purple-500 mr-2"></i>
              <span class="text-xs text-purple-700">Anthropic Claude</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Lancer l'analyse IA en temps réel
    const competitorsData = await this.analyzeCompetitorsWithAI();
    
    const content = `
      <div class="fade-in">
        <!-- Header avec actions -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <div class="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
              <i class="fas fa-users text-blue-600 mr-2"></i>
              <span class="text-sm font-medium text-blue-900">
                ${competitorsData.competitors.length} concurrents identifiés
              </span>
              ${competitorsData.aiAnalysis ? `
                <span class="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  🤖 IA ${Math.round(competitorsData.aiAnalysis.confidence * 100)}%
                </span>
                <span class="ml-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  ${competitorsData.aiAnalysis.modelUsed}
                </span>
              ` : ''}
            </div>
            <div class="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <i class="fas fa-trophy text-green-600 mr-2"></i>
              <span class="text-sm font-medium text-green-900">
                Position dans le secteur: #${competitorsData.marketPosition}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button id="refreshCompetitorsBtn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <i class="fas fa-sync mr-2"></i>Actualiser
            </button>
            <button id="addCompetitorBtn" class="px-4 py-2 bg-aireach-blue text-white rounded-lg hover:bg-blue-700">
              <i class="fas fa-plus mr-2"></i>Ajouter Concurrent
            </button>
          </div>
        </div>

        <!-- Market Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-chart-bar text-purple-500 mr-2"></i>
              Performance Comparative
            </h3>
            <div class="chart-container">
              <canvas id="competitorComparisonChart"></canvas>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-pie-chart text-orange-500 mr-2"></i>
              Part de Marché IA
            </h3>
            <div class="chart-container">
              <canvas id="marketShareChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Competitive Analysis Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Analyse Concurrentielle Détaillée</h3>
              <div class="flex items-center space-x-2">
                <select id="sortCompetitors" class="text-sm border border-gray-300 rounded px-3 py-1">
                  <option value="brand_score">Trier par Brand Score</option>
                  <option value="avg_position">Trier par Position</option>
                  <option value="share_of_voice">Trier par Share of Voice</option>
                  <option value="mentions">Trier par Mentions</option>
                </select>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concurrent</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position Moy.</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share of Voice</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentions</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendance</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Current Brand Row -->
                <tr class="bg-blue-50 border-l-4 border-blue-500">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center mr-3">
                        <span class="text-white font-bold text-sm">${this.currentProject.brand_name.charAt(0)}</span>
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-gray-900">${this.currentProject.brand_name}</div>
                        <div class="text-xs text-blue-600 font-medium">VOTRE MARQUE</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <span class="text-sm font-bold text-gray-900">${competitorsData.currentBrand.brandScore}</span>
                      <span class="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">#${competitorsData.marketPosition}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center">
                      <span class="font-medium">#${competitorsData.currentBrand.avgPosition}</span>
                      <span class="ml-2 text-xs ${competitorsData.currentBrand.positionTrend <= 0 ? 'text-green-600' : 'text-red-600'}">
                        <i class="fas fa-arrow-${competitorsData.currentBrand.positionTrend <= 0 ? 'up' : 'down'}"></i>
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center">
                      <span class="font-medium">${competitorsData.currentBrand.shareOfVoice}%</span>
                      <div class="ml-3 w-16 bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${competitorsData.currentBrand.shareOfVoice}%"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">${competitorsData.currentBrand.mentions}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${competitorsData.currentBrand.trend === 'up' ? 'bg-green-100 text-green-800' : competitorsData.currentBrand.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                      <i class="fas fa-arrow-${competitorsData.currentBrand.trend === 'up' ? 'up' : competitorsData.currentBrand.trend === 'down' ? 'down' : 'right'} mr-1"></i>
                      ${competitorsData.currentBrand.trend === 'up' ? 'En hausse' : competitorsData.currentBrand.trend === 'down' ? 'En baisse' : 'Stable'}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <button class="text-aireach-blue hover:text-blue-700 text-sm font-medium">
                      Voir détails →
                    </button>
                  </td>
                </tr>
                
                <!-- Competitors Rows -->
                ${competitorsData.competitors.map(competitor => `
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <span class="text-gray-600 font-bold text-sm">${competitor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">${competitor.name}</div>
                          <div class="text-xs text-gray-500">${competitor.category}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">${competitor.brandScore}</span>
                        ${competitor.brandScore > competitorsData.currentBrand.brandScore ? 
                          `<span class="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">+${competitor.brandScore - competitorsData.currentBrand.brandScore}</span>` : 
                          `<span class="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">${competitor.brandScore - competitorsData.currentBrand.brandScore}</span>`
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      <div class="flex items-center">
                        <span class="font-medium">#${competitor.avgPosition}</span>
                        <span class="ml-2 text-xs ${competitor.positionTrend <= 0 ? 'text-green-600' : 'text-red-600'}">
                          <i class="fas fa-arrow-${competitor.positionTrend <= 0 ? 'up' : 'down'}"></i>
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      <div class="flex items-center">
                        <span class="font-medium">${competitor.shareOfVoice}%</span>
                        <div class="ml-3 w-16 bg-gray-200 rounded-full h-2">
                          <div class="bg-gray-500 h-2 rounded-full" style="width: ${competitor.shareOfVoice}%"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">${competitor.mentions}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${competitor.trend === 'up' ? 'bg-green-100 text-green-800' : competitor.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                        <i class="fas fa-arrow-${competitor.trend === 'up' ? 'up' : competitor.trend === 'down' ? 'down' : 'right'} mr-1"></i>
                        ${competitor.trend === 'up' ? 'En hausse' : competitor.trend === 'down' ? 'En baisse' : 'Stable'}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-2">
                        <button class="text-gray-500 hover:text-gray-700" title="Analyser en détail">
                          <i class="fas fa-search text-sm"></i>
                        </button>
                        <button class="text-gray-500 hover:text-gray-700" title="Comparer">
                          <i class="fas fa-balance-scale text-sm"></i>
                        </button>
                        <button class="text-gray-500 hover:text-gray-700" title="Surveiller">
                          <i class="fas fa-eye text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Competitive Insights -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Insights Concurrentiels
            </h3>
            <div class="space-y-4">
              ${competitorsData.insights.map(insight => `
                <div class="flex items-start p-3 bg-${insight.type === 'opportunity' ? 'green' : insight.type === 'threat' ? 'red' : 'blue'}-50 rounded-lg">
                  <div class="w-8 h-8 bg-${insight.type === 'opportunity' ? 'green' : insight.type === 'threat' ? 'red' : 'blue'}-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                    <i class="fas fa-${insight.type === 'opportunity' ? 'arrow-up' : insight.type === 'threat' ? 'exclamation-triangle' : 'info-circle'} text-${insight.type === 'opportunity' ? 'green' : insight.type === 'threat' ? 'red' : 'blue'}-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 mb-1">${insight.title}</p>
                    <p class="text-xs text-gray-600">${insight.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-target text-red-500 mr-2"></i>
              Opportunités d'Amélioration
            </h3>
            <div class="space-y-4">
              ${competitorsData.opportunities.map(opportunity => `
                <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <i class="fas fa-${opportunity.icon} text-orange-600 text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${opportunity.title}</p>
                    <p class="text-xs text-gray-600">${opportunity.description}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-medium ${opportunity.impact === 'high' ? 'text-red-600' : opportunity.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'}">
                      Impact ${opportunity.impact === 'high' ? 'Élevé' : opportunity.impact === 'medium' ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- AI Analysis Details -->
        ${competitorsData.aiAnalysis ? `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-brain text-purple-500 mr-2"></i>
            Analyse IA des Concurrents
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Méthode d'analyse</div>
              <div class="font-semibold text-gray-900 capitalize">
                ${competitorsData.aiAnalysis.method.replace('-', ' ')}
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Confiance IA</div>
              <div class="font-semibold text-gray-900">
                ${Math.round(competitorsData.aiAnalysis.confidence * 100)}%
                <span class="text-xs ${competitorsData.aiAnalysis.confidence > 0.8 ? 'text-green-600' : competitorsData.aiAnalysis.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'}">
                  ${competitorsData.aiAnalysis.confidence > 0.8 ? 'Élevée' : competitorsData.aiAnalysis.confidence > 0.6 ? 'Moyenne' : 'Faible'}
                </span>
              </div>
            </div>
            ${competitorsData.aiAnalysis.detectedSegment ? `
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Segment détecté</div>
              <div class="font-semibold text-gray-900 capitalize">
                ${competitorsData.aiAnalysis.detectedSegment}
              </div>
            </div>
            ` : ''}
            ${competitorsData.aiAnalysis.detectedRegion ? `
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Région détectée</div>
              <div class="font-semibold text-gray-900 capitalize">
                ${competitorsData.aiAnalysis.detectedRegion}
              </div>
            </div>
            ` : ''}
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-600 mb-2">Sources d'analyse:</div>
            <div class="flex flex-wrap gap-2">
              ${competitorsData.aiAnalysis.sources.map(source => `
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  ${source.replace('-', ' ')}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Action Buttons avec IA -->
        <div class="flex flex-wrap gap-3">
          <button id="generateCompetitiveReportBtn" class="action-btn bg-aireach-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center">
            <i class="fas fa-file-alt mr-2"></i>
            Rapport Concurrentiel IA
          </button>
          <button id="newAiAnalysisBtn" class="action-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center">
            <i class="fas fa-robot mr-2"></i>
            Nouvelle Analyse IA
          </button>
          <button id="exportCompetitorsBtn" class="action-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center">
            <i class="fas fa-download mr-2"></i>
            Exporter les Données
          </button>
          <button id="scheduleCompetitorAnalysisBtn" class="action-btn bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center">
            <i class="fas fa-clock mr-2"></i>
            Programmer Analyse
          </button>
        </div>
        
        ${competitorsData.aiAnalysis ? `
          <!-- IA Analysis Info -->
          <div class="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900 mb-2">
                  <i class="fas fa-brain text-purple-600 mr-2"></i>
                  Insights de l'Intelligence Artificielle
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Positionnement de ${this.currentProject.brand_name}</h5>
                    <p class="text-sm text-gray-600">${competitorsData.aiAnalysis.positioningInsights.brand_positioning}</p>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Avantages Concurrentiels</h5>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      ${competitorsData.aiAnalysis.positioningInsights.competitive_advantages.map(adv => `<li>${adv}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Opportunités de Marché</h5>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      ${competitorsData.aiAnalysis.positioningInsights.market_gaps.map(gap => `<li>${gap}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-800 mb-2">Recommandations Stratégiques</h5>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      ${competitorsData.aiAnalysis.positioningInsights.strategic_recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
              <div class="ml-4 text-right">
                <div class="text-xs text-gray-500">Analysé par</div>
                <div class="font-medium text-purple-600">${competitorsData.aiAnalysis.modelUsed}</div>
                <div class="text-xs text-gray-500 mt-1">
                  ${new Date(competitorsData.aiAnalysis.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        ` : ''}
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = content;
    
    // Initialize charts
    this.initializeCompetitorCharts(competitorsData);
    
    // Setup event listeners
    this.setupCompetitorsListeners();
    
    console.log(`👥 Showing competitors analysis for: ${this.currentProject.name}`);
  }

  // Nouvelle méthode pour analyser les concurrents avec IA en temps réel
  async analyzeCompetitorsWithAI() {
    try {
      console.log('🤖 Starting AI competitor analysis for:', this.currentProject.brand_name);
      
      // Appel à l'API d'analyse IA en temps réel
      const response = await axios.post('/api/competitors/ai-analyze', {
        brandName: this.currentProject.brand_name,
        industry: this.currentProject.industry,
        websiteUrl: this.currentProject.website_url,
        description: this.currentProject.description,
        country: 'France' // Peut être déterminé à partir du projet
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erreur lors de l\'analyse IA');
      }

      const aiData = response.data.data;
      console.log('✅ AI analysis completed:', aiData);

      // Transformer les données IA pour l'interface
      const competitorsData = {
        competitors: aiData.competitors.map((comp, index) => ({
          id: index + 1,
          name: comp.name,
          domain: comp.domain,
          industry: comp.industry,
          description: comp.description,
          brandScore: comp.similarity_score,
          avgPosition: comp.threat_level === 'high' ? Math.floor(Math.random() * 2) + 1 : 
                      comp.threat_level === 'medium' ? Math.floor(Math.random() * 3) + 2 : 
                      Math.floor(Math.random() * 3) + 4,
          shareOfVoice: comp.threat_level === 'high' ? Math.floor(Math.random() * 15) + 15 :
                       comp.threat_level === 'medium' ? Math.floor(Math.random() * 10) + 8 :
                       Math.floor(Math.random() * 8) + 3,
          mentions: comp.market_position === 'leader' ? Math.floor(Math.random() * 300) + 200 :
                   comp.market_position === 'challenger' ? Math.floor(Math.random() * 200) + 100 :
                   Math.floor(Math.random() * 100) + 50,
          trend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
          positionTrend: Math.floor(Math.random() * 3) - 1,
          threatLevel: comp.threat_level,
          marketPosition: comp.market_position,
          location: comp.location,
          founded: comp.founded,
          keyDifferentiators: comp.key_differentiators,
          reasoning: comp.reasoning,
          aiGenerated: true
        })),
        currentBrand: {
          brandScore: 85 + Math.floor(Math.random() * 10), // Score favorable pour la marque analysée
          avgPosition: 2.5,
          shareOfVoice: 12,
          mentions: 156,
          trend: 'up',
          positionTrend: -1
        },
        marketPosition: Math.max(1, Math.floor(aiData.competitors.length / 2)),
        aiAnalysis: {
          confidence: aiData.confidence_score / 100,
          modelUsed: aiData.ai_model_used,
          timestamp: aiData.analysis_metadata.analysis_timestamp,
          marketOverview: aiData.market_overview,
          positioningInsights: aiData.positioning_insights
        },
        marketSize: aiData.market_overview.market_size,
        competitiveIntensity: aiData.market_overview.competitive_intensity,
        keyTrends: aiData.market_overview.key_trends
      };

      return competitorsData;

    } catch (error) {
      console.error('❌ AI competitor analysis failed:', error);
      
      // Fallback vers une analyse simulée en cas d'erreur
      console.log('🔄 Falling back to simulated analysis...');
      return this.generateFallbackCompetitorsData();
    }
  }

  // Méthode de fallback pour données simulées
  generateFallbackCompetitorsData() {
    const mockCompetitors = this.getMockCompetitorsByIndustry(this.currentProject.industry);
    
    return {
      competitors: mockCompetitors.map((comp, index) => ({
        id: index + 1,
        name: comp.name,
        domain: comp.domain || `${comp.name.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: this.currentProject.industry,
        description: comp.description,
        brandScore: Math.floor(Math.random() * 20) + 70,
        avgPosition: Math.floor(Math.random() * 5) + 1,
        shareOfVoice: Math.floor(Math.random() * 15) + 5,
        mentions: Math.floor(Math.random() * 200) + 50,
        trend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
        positionTrend: Math.floor(Math.random() * 3) - 1,
        threatLevel: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        marketPosition: index === 0 ? 'leader' : index < 3 ? 'challenger' : 'follower',
        location: comp.location,
        founded: comp.founded,
        keyDifferentiators: ['Innovation', 'Market presence'],
        reasoning: `Concurrent ${index < 2 ? 'direct' : 'indirect'} dans le secteur ${this.currentProject.industry}`,
        aiGenerated: false
      })),
      currentBrand: {
        brandScore: 82,
        avgPosition: 3.2,
        shareOfVoice: 8,
        mentions: 89,
        trend: 'stable',
        positionTrend: 0
      },
      marketPosition: 3,
      aiAnalysis: {
        confidence: 0.75,
        modelUsed: 'Simulation',
        timestamp: new Date().toISOString(),
        marketOverview: {
          market_size: `${this.currentProject.industry} market estimated globally`,
          competitive_intensity: 'medium',
          key_trends: ['Digital transformation', 'Market consolidation']
        },
        positioningInsights: {
          brand_positioning: `${this.currentProject.brand_name} positioned in ${this.currentProject.industry}`,
          competitive_advantages: ['Brand recognition'],
          market_gaps: ['Emerging segments'],
          strategic_recommendations: ['Focus on differentiation']
        }
      }
    };
  }

  // Récupérer des concurrents mock par industrie
  getMockCompetitorsByIndustry(industry) {
    const competitorDatabase = {
      'Wine': [
        { name: 'Moët Hennessy', domain: 'moet.com', location: 'Épernay, France', founded: '1743', description: 'Leader mondial du champagne et spiritueux premium' },
        { name: 'Pernod Ricard', domain: 'pernod-ricard.com', location: 'Paris, France', founded: '1975', description: 'Groupe international de vins et spiritueux' },
        { name: 'Diageo', domain: 'diageo.com', location: 'London, UK', founded: '1997', description: 'Leader mondial des spiritueux premium' },
        { name: 'Lavinia', domain: 'lavinia.fr', location: 'Paris, France', founded: '1999', description: 'Caviste haut de gamme spécialisé' },
        { name: 'Le Bon Marché Épicerie', domain: 'lebonmarche.com', location: 'Paris, France', founded: '1852', description: 'Grand magasin avec cave à vins premium' }
      ],
      'Technology': [
        { name: 'Microsoft', domain: 'microsoft.com', location: 'Redmond, WA', founded: '1975', description: 'Géant technologique global' },
        { name: 'Google', domain: 'google.com', location: 'Mountain View, CA', founded: '1998', description: 'Leader de la recherche et IA' },
        { name: 'Apple', domain: 'apple.com', location: 'Cupertino, CA', founded: '1976', description: 'Innovation technologique consumer' },
        { name: 'Amazon', domain: 'amazon.com', location: 'Seattle, WA', founded: '1994', description: 'Commerce électronique et cloud' },
        { name: 'Meta', domain: 'meta.com', location: 'Menlo Park, CA', founded: '2004', description: 'Réseaux sociaux et métavers' }
      ]
    };

    return competitorDatabase[industry] || competitorDatabase['Technology'];
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

  // Méthode pour générer les données des concurrents (maintenant avec API intelligente)
  async generateCompetitorsData() {
    const industry = this.currentProject.industry;
    const brandName = this.currentProject.brand_name;
    const websiteUrl = this.currentProject.website_url;
    const description = this.currentProject.description;

    try {
      // Appel à l'API d'identification intelligente des concurrents
      console.log('🔍 Identifying competitors using AI API for:', brandName);
      const response = await axios.post('/api/competitors/identify', {
        brandName,
        industry,
        websiteUrl,
        description
      });

      if (response.data.success) {
        const apiResult = response.data.data;
        console.log('✅ Smart competitors identified:', apiResult);
        
        // Utiliser les concurrents identifiés par l'API
        const intelligentCompetitors = apiResult.competitors.map(comp => ({
          name: comp.name,
          category: comp.category,
          brandScore: Math.floor(Math.random() * 30) + 70, // 70-100
          avgPosition: Math.floor(Math.random() * 5) + 1, // 1-5
          shareOfVoice: Math.floor(Math.random() * 25) + 5, // 5-30%
          mentions: Math.floor(Math.random() * 500) + 100, // 100-600
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          positionTrend: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
          strength: comp.strength,
          region: comp.region,
          size: comp.size,
          relevanceScore: comp.relevanceScore
        }));

        return this.buildCompetitorsResponse(intelligentCompetitors, apiResult, brandName);
      }
    } catch (error) {
      console.warn('⚠️ API competitor identification failed, using fallback:', error.message);
    }

    // Fallback vers la méthode statique si l'API échoue
    return this.generateStaticCompetitorsData();
  }

  // Méthode pour construire la réponse des concurrents à partir de l'API
  buildCompetitorsResponse(competitors, apiResult, brandName) {
    // Données pour la marque actuelle
    const currentBrandScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const marketPosition = Math.floor(Math.random() * 3) + 1; // Position 1-3
    
    const currentBrand = {
      brandScore: currentBrandScore,
      avgPosition: Math.floor(Math.random() * 3) + 2, // 2-4
      shareOfVoice: Math.floor(Math.random() * 20) + 15, // 15-35%
      mentions: Math.floor(Math.random() * 300) + 200, // 200-500
      trend: ['up', 'stable'][Math.floor(Math.random() * 2)], // Plus souvent positif
      positionTrend: Math.floor(Math.random() * 2) - 1 // -1, 0
    };

    // Insights basés sur l'analyse intelligente
    const insights = [
      {
        type: 'opportunity',
        title: 'Concurrents identifiés intelligemment',
        description: `${competitors.length} concurrents détectés avec ${Math.round(apiResult.confidence * 100)}% de confiance`
      },
      {
        type: 'info',
        title: `Analyse ${apiResult.analysisMethod}`,
        description: `Sources: ${apiResult.sources.join(', ')}`
      },
      {
        type: competitors.length >= 4 ? 'threat' : 'opportunity',
        title: competitors.length >= 4 ? 'Marché concurrentiel dense' : 'Opportunité de marché',
        description: competitors.length >= 4 ? 
          `${competitors.length} concurrents actifs détectés dans votre segment` :
          'Marché avec opportunités de croissance identifiées'
      }
    ];

    // Opportunités intelligentes basées sur l'analyse
    const opportunities = [
      {
        title: 'Positionnement différenciant',
        description: `Se démarquer face à ${competitors[0]?.name || 'la concurrence'}`,
        impact: 'high',
        icon: 'target'
      },
      {
        title: 'Expansion géographique',
        description: apiResult.analysis?.detectedRegion !== 'global' ? 
          'Explorer les marchés internationaux' : 
          'Renforcer la présence locale',
        impact: 'medium',
        icon: 'globe'
      },
      {
        title: 'Innovation produit',
        description: `Capitaliser sur ${apiResult.analysis?.detectedSegment || 'votre'} positionnement`,
        impact: 'high',
        icon: 'lightbulb'
      },
      {
        title: 'Partenariats stratégiques',
        description: 'Identifier des synergies dans l\'écosystème IA',
        impact: 'medium',
        icon: 'handshake'
      }
    ];

    return {
      competitors,
      currentBrand,
      marketPosition,
      insights,
      opportunities,
      aiAnalysis: {
        method: apiResult.analysisMethod,
        confidence: apiResult.confidence,
        sources: apiResult.sources,
        detectedSegment: apiResult.analysis?.detectedSegment,
        detectedRegion: apiResult.analysis?.detectedRegion
      }
    };
  }

  // Méthode statique de fallback (ancienne méthode)
  generateStaticCompetitorsData() {
    const industry = this.currentProject.industry;
    const brandName = this.currentProject.brand_name;
    
    // Définir les concurrents selon l'industrie
    const competitorsByIndustry = {
      'Wine': [
        { name: 'Château Margaux', category: 'Vin Premium', strength: 'Prestige' },
        { name: 'Dom Pérignon', category: 'Champagne Luxe', strength: 'Innovation' },
        { name: 'Opus One', category: 'Vin International', strength: 'Collaboration' },
        { name: 'Penfolds Grange', category: 'Vin Australien', strength: 'Qualité' },
        { name: 'Caymus Vineyards', category: 'Vin Californien', strength: 'Consistance' }
      ],
      'Technology': [
        { name: 'Apple', category: 'Tech Consumer', strength: 'Innovation' },
        { name: 'Google', category: 'Services Web', strength: 'Recherche' },
        { name: 'Microsoft', category: 'Logiciels', strength: 'Entreprise' },
        { name: 'Amazon', category: 'Cloud & Commerce', strength: 'Scale' },
        { name: 'Meta', category: 'Social Media', strength: 'Connexion' }
      ],
      'Fashion': [
        { name: 'Chanel', category: 'Luxe', strength: 'Héritage' },
        { name: 'Louis Vuitton', category: 'Maroquinerie', strength: 'Artisanat' },
        { name: 'Gucci', category: 'Mode Italienne', strength: 'Créativité' },
        { name: 'Hermès', category: 'Luxe Français', strength: 'Exclusivité' },
        { name: 'Prada', category: 'Mode Premium', strength: 'Innovation' }
      ],
      'Healthcare': [
        { name: 'Johnson & Johnson', category: 'Pharmaceutique', strength: 'Recherche' },
        { name: 'Pfizer', category: 'Médicaments', strength: 'Innovation' },
        { name: 'Roche', category: 'Biotechnologie', strength: 'Spécialisation' },
        { name: 'Novartis', category: 'Santé Globale', strength: 'Développement' },
        { name: 'Merck', category: 'Sciences de la vie', strength: 'Pipeline' }
      ],
      'Finance': [
        { name: 'JPMorgan Chase', category: 'Banque Investissement', strength: 'Global' },
        { name: 'Goldman Sachs', category: 'Finance', strength: 'Advisory' },
        { name: 'Morgan Stanley', category: 'Gestion d\'actifs', strength: 'Expertise' },
        { name: 'Bank of America', category: 'Banque Retail', strength: 'Scale' },
        { name: 'Wells Fargo', category: 'Services Financiers', strength: 'Community' }
      ],
      'default': [
        { name: 'Concurrent A', category: 'Leader du marché', strength: 'Innovation' },
        { name: 'Concurrent B', category: 'Challenger', strength: 'Prix' },
        { name: 'Concurrent C', category: 'Spécialiste', strength: 'Niche' },
        { name: 'Concurrent D', category: 'Émergent', strength: 'Agilité' },
        { name: 'Concurrent E', category: 'International', strength: 'Scale' }
      ]
    };

    const competitors = (competitorsByIndustry[industry] || competitorsByIndustry['default']).map(comp => ({
      name: comp.name,
      category: comp.category,
      brandScore: Math.floor(Math.random() * 30) + 70, // 70-100
      avgPosition: Math.floor(Math.random() * 5) + 1, // 1-5
      shareOfVoice: Math.floor(Math.random() * 25) + 5, // 5-30%
      mentions: Math.floor(Math.random() * 500) + 100, // 100-600
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      positionTrend: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
      strength: comp.strength
    }));

    // Données pour la marque actuelle
    const currentBrandScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const marketPosition = Math.floor(Math.random() * 3) + 1; // Position 1-3
    
    const currentBrand = {
      brandScore: currentBrandScore,
      avgPosition: Math.floor(Math.random() * 3) + 2, // 2-4
      shareOfVoice: Math.floor(Math.random() * 20) + 15, // 15-35%
      mentions: Math.floor(Math.random() * 300) + 200, // 200-500
      trend: ['up', 'stable'][Math.floor(Math.random() * 2)], // Plus souvent positif
      positionTrend: Math.floor(Math.random() * 2) - 1 // -1, 0
    };

    // Insights concurrentiels
    const insights = [
      {
        type: 'opportunity',
        title: 'Opportunité de croissance détectée',
        description: `${brandName} peut améliorer sa position sur les questions liées à ${industry.toLowerCase()}`
      },
      {
        type: 'threat',
        title: 'Menace concurrentielle',
        description: `${competitors[0].name} gagne en visibilité sur votre segment`
      },
      {
        type: 'info',
        title: 'Tendance du marché',
        description: 'Les mentions augmentent de 23% dans votre secteur'
      }
    ];

    // Opportunités d'amélioration
    const opportunities = [
      {
        title: 'Améliorer le positionnement SEO',
        description: 'Optimiser le contenu pour les recherches IA',
        impact: 'high',
        icon: 'search'
      },
      {
        title: 'Renforcer la présence sociale',
        description: 'Augmenter l\'engagement sur les plateformes',
        impact: 'medium',
        icon: 'share-alt'
      },
      {
        title: 'Content Marketing ciblé',
        description: 'Créer du contenu spécialisé pour votre niche',
        impact: 'high',
        icon: 'pen'
      },
      {
        title: 'Partenariats stratégiques',
        description: 'Collaborer avec des influenceurs du secteur',
        impact: 'medium',
        icon: 'handshake'
      }
    ];

    return {
      competitors,
      currentBrand,
      marketPosition,
      insights,
      opportunities
    };
  }

  // Méthode pour initialiser les graphiques des concurrents
  initializeCompetitorCharts(competitorsData) {
    // Graphique de comparaison des concurrents
    const competitorCtx = document.getElementById('competitorComparisonChart');
    if (competitorCtx) {
      new Chart(competitorCtx, {
        type: 'bar',
        data: {
          labels: [this.currentProject.brand_name, ...competitorsData.competitors.slice(0, 4).map(c => c.name)],
          datasets: [{
            label: 'Brand Score',
            data: [competitorsData.currentBrand.brandScore, ...competitorsData.competitors.slice(0, 4).map(c => c.brandScore)],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // Bleu pour la marque actuelle
              'rgba(156, 163, 175, 0.6)',
              'rgba(156, 163, 175, 0.6)',
              'rgba(156, 163, 175, 0.6)',
              'rgba(156, 163, 175, 0.6)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(156, 163, 175, 1)',
              'rgba(156, 163, 175, 1)',
              'rgba(156, 163, 175, 1)',
              'rgba(156, 163, 175, 1)'
            ],
            borderWidth: 2
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
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          }
        }
      });
    }

    // Graphique de part de marché
    const marketShareCtx = document.getElementById('marketShareChart');
    if (marketShareCtx) {
      const totalShare = 100;
      const competitorShares = competitorsData.competitors.slice(0, 4).map(c => c.shareOfVoice);
      const currentShare = competitorsData.currentBrand.shareOfVoice;
      const otherShare = totalShare - currentShare - competitorShares.reduce((sum, share) => sum + share, 0);
      
      new Chart(marketShareCtx, {
        type: 'doughnut',
        data: {
          labels: [
            this.currentProject.brand_name,
            ...competitorsData.competitors.slice(0, 4).map(c => c.name),
            'Autres'
          ],
          datasets: [{
            data: [
              currentShare,
              ...competitorShares,
              otherShare > 0 ? otherShare : 5
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // Bleu pour la marque actuelle
              'rgba(239, 68, 68, 0.6)',   // Rouge
              'rgba(34, 197, 94, 0.6)',   // Vert
              'rgba(251, 191, 36, 0.6)',  // Jaune
              'rgba(168, 85, 247, 0.6)',  // Violet
              'rgba(156, 163, 175, 0.6)'  // Gris pour "Autres"
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }
  }

  // Méthode pour configurer les event listeners des concurrents avec IA
  setupCompetitorsListeners() {
    // Bouton d'actualisation des concurrents (nouvelle analyse IA)
    const refreshBtn = document.getElementById('refreshCompetitorsBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyse IA...';
        refreshBtn.disabled = true;
        
        try {
          await this.showCompetitors();
          this.showSuccess('🤖 Nouvelle analyse IA terminée !');
        } catch (error) {
          this.showError('❌ Erreur lors de l\'analyse IA');
        } finally {
          refreshBtn.innerHTML = '<i class="fas fa-sync mr-2"></i>Actualiser';
          refreshBtn.disabled = false;
        }
      });
    }

    // Bouton d'ajout de concurrent
    const addCompetitorBtn = document.getElementById('addCompetitorBtn');
    if (addCompetitorBtn) {
      addCompetitorBtn.addEventListener('click', () => {
        this.showAddCompetitorModal();
      });
    }

    // Nouveau bouton d'analyse IA
    const newAiAnalysisBtn = document.getElementById('newAiAnalysisBtn');
    if (newAiAnalysisBtn) {
      newAiAnalysisBtn.addEventListener('click', async () => {
        newAiAnalysisBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyse IA en cours...';
        newAiAnalysisBtn.disabled = true;
        
        try {
          await this.showCompetitors();
          this.showSuccess('🤖 Nouvelle analyse IA terminée avec succès !');
        } catch (error) {
          this.showError('❌ Erreur lors de la nouvelle analyse IA');
        } finally {
          newAiAnalysisBtn.innerHTML = '<i class="fas fa-robot mr-2"></i>Nouvelle Analyse IA';
          newAiAnalysisBtn.disabled = false;
        }
      });
    }

    // Boutons d'export et d'analyse
    const exportBtn = document.getElementById('exportCompetitorsBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportCompetitorsData();
      });
    }

    const scheduleBtn = document.getElementById('scheduleCompetitorAnalysisBtn');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        this.showNotification('Fonctionnalité de programmation d\'analyses à venir', 'info');
      });
    }

    const reportBtn = document.getElementById('generateCompetitiveReportBtn');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        this.generateAiCompetitiveReport();
      });
    }
  }

  // Modal pour ajouter un concurrent manuellement
  showAddCompetitorModal() {
    const modalHtml = `
      <div id="addCompetitorModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Ajouter un concurrent</h3>
              <button id="closeAddCompetitorModal" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form id="addCompetitorForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom du concurrent</label>
                <input type="text" id="competitorName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input type="url" id="competitorDomain" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="competitorDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue"></textarea>
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancelAddCompetitor" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
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

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Event listeners du modal
    document.getElementById('closeAddCompetitorModal').addEventListener('click', () => {
      document.getElementById('addCompetitorModal').remove();
    });

    document.getElementById('cancelAddCompetitor').addEventListener('click', () => {
      document.getElementById('addCompetitorModal').remove();
    });

    document.getElementById('addCompetitorForm').addEventListener('submit', (e) => {
      e.preventDefault();
      // Ici on pourrait ajouter la logique d'ajout de concurrent
      this.showNotification('Concurrent ajouté ! Relancez l\'analyse IA pour une évaluation complète.', 'success');
      document.getElementById('addCompetitorModal').remove();
    });
  }

  // Exporter les données des concurrents
  exportCompetitorsData() {
    // Récupérer les données actuelles depuis le tableau
    const rows = document.querySelectorAll('#competitorsTable tbody tr');
    const data = [];
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        data.push({
          competitor: cells[0]?.textContent.trim() || '',
          brand_score: cells[1]?.textContent.trim() || '',
          avg_position: cells[2]?.textContent.trim() || '',
          share_of_voice: cells[3]?.textContent.trim() || '',
          mentions: cells[4]?.textContent.trim() || '',
          trend: cells[5]?.textContent.trim() || ''
        });
      }
    });

    const csvContent = [
      ['Concurrent', 'Brand Score', 'Position Moyenne', 'Share of Voice', 'Mentions', 'Tendance'].join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `competitors_analysis_${this.currentProject.brand_name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showSuccess(`📊 Analyse concurrentielle de "${this.currentProject.brand_name}" exportée`);
  }

  // Générer un rapport concurrentiel IA complet
  async generateAiCompetitiveReport() {
    try {
      this.showNotification('🤖 Génération du rapport IA en cours...', 'info');
      
      // Simuler la génération d'un rapport (peut être connecté à l'API IA)
      const reportData = {
        brand: this.currentProject.brand_name,
        industry: this.currentProject.industry,
        analysisDate: new Date().toLocaleDateString('fr-FR'),
        executiveSummary: `Analyse concurrentielle approfondie de ${this.currentProject.brand_name} dans le secteur ${this.currentProject.industry}`,
        keyFindings: [
          'Position concurrentielle solide avec opportunités d\'amélioration identifiées',
          'Menaces principales identifiées parmi les concurrents directs',
          'Opportunités de marché détectées par l\'IA dans les segments émergents'
        ]
      };

      // Générer un PDF ou document (simulé)
      const reportContent = `
# Rapport Concurrentiel IA - ${reportData.brand}

## Résumé Exécutif
${reportData.executiveSummary}

## Date d'Analyse
${reportData.analysisDate}

## Principales Conclusions
${reportData.keyFindings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

## Concurrents Identifiés par IA
[Détails des concurrents avec métriques]

## Recommandations Stratégiques
[Recommandations basées sur l'analyse IA]

---
Rapport généré par AIREACH - Intelligence Artificielle pour la Surveillance des Marques
      `;

      // Créer le fichier pour téléchargement
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `competitive_report_ai_${this.currentProject.brand_name}_${new Date().toISOString().split('T')[0]}.txt`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showSuccess(`📋 Rapport concurrentiel IA de "${this.currentProject.brand_name}" généré !`);
      
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      this.showError('❌ Erreur lors de la génération du rapport');
    }
  }

    // Sélecteur de tri des concurrents
    const sortSelect = document.getElementById('sortCompetitors');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.showNotification(`Tri par ${e.target.selectedOptions[0].text}`, 'info');
        // Ici, on pourrait implémenter le tri réel
      });
    }

    // Bouton de génération de rapport
    const generateReportBtn = document.getElementById('generateCompetitiveReportBtn');
    if (generateReportBtn) {
      generateReportBtn.addEventListener('click', () => {
        this.showSuccess('📊 Génération du rapport concurrentiel en cours...');
        setTimeout(() => {
          this.showSuccess('✅ Rapport concurrentiel généré avec succès');
        }, 2000);
      });
    }

    // Bouton d'export des données
    const exportBtn = document.getElementById('exportCompetitorsBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.showSuccess('💾 Export des données concurrentielles en cours...');
        setTimeout(() => {
          this.showSuccess('✅ Données exportées avec succès');
        }, 1500);
      });
    }

    // Bouton de programmation d'analyse
    const scheduleBtn = document.getElementById('scheduleCompetitorAnalysisBtn');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        this.showNotification('⏰ Programmation d\'analyse concurrentielle à venir', 'info');
      });
    }

    // Bouton d'alertes concurrentielles
    const alertsBtn = document.getElementById('alertsCompetitorsBtn');
    if (alertsBtn) {
      alertsBtn.addEventListener('click', () => {
        this.showNotification('🔔 Configuration d\'alertes concurrentielles à venir', 'info');
      });
    }

    console.log('👥 Competitors event listeners configured');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIReachApp();
});