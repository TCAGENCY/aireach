// AIREACH Frontend Application
class AIReachApp {
  constructor() {
    this.currentProject = null;
    this.currentSection = 'dashboard';
    this.projects = [];
    this.init();
  }

  init() {
    console.log('🚀 AIREACH Application Starting...');
    this.setupEventListeners();
    this.loadProjects();
    this.showDashboard();
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
        this.renderProjectsList();
        console.log(`📊 Loaded ${this.projects.length} projects`);
      }
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
      this.showError('Impossible de charger les projets');
    }
  }

  renderProjectsList() {
    const projectsList = document.getElementById('projectsList');
    
    if (this.projects.length === 0) {
      projectsList.innerHTML = `
        <div class="text-center py-4">
          <p class="text-sm text-gray-500">Aucun projet</p>
          <p class="text-xs text-gray-400 mt-1">Cliquez sur + pour commencer</p>
        </div>
      `;
      return;
    }

    projectsList.innerHTML = this.projects.map(project => `
      <div class="project-item p-3 rounded-lg cursor-pointer ${this.currentProject?.id === project.id ? 'active' : ''}" 
           data-project-id="${project.id}">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium text-gray-900 truncate">${project.name}</h4>
          <span class="status-${project.status} px-2 py-1 rounded-full text-xs font-medium">
            ${this.getStatusLabel(project.status)}
          </span>
        </div>
        <p class="text-sm text-gray-600 truncate mb-2">${project.brand_name}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${project.total_queries || 0} questions</span>
          <span>${project.total_responses || 0} réponses</span>
        </div>
        ${project.avg_position ? `
          <div class="flex items-center mt-2 text-xs">
            <span class="text-gray-500">Position moy:</span>
            <span class="ml-1 font-medium ${project.avg_position <= 2 ? 'text-green-600' : project.avg_position <= 4 ? 'text-yellow-600' : 'text-red-600'}">
              #${Math.round(project.avg_position)}
            </span>
          </div>
        ` : ''}
      </div>
    `).join('');

    // Add click listeners to project items
    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', () => {
        const projectId = parseInt(item.getAttribute('data-project-id'));
        this.selectProject(projectId);
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
      // Générer les questions
      const response = await axios.post('/api/questions/generate', {
        brandName: this.wizardData.brandInfo.detectedBrandName,
        industry: this.wizardData.brandInfo.industry,
        domain: this.wizardData.domain
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
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>
              <div>
                <p class="font-semibold text-gray-900">Nom de marque détecté:</p>
                <p class="text-aireach-blue font-bold text-lg">${this.wizardData.brandInfo.detectedBrandName}</p>
                <p class="text-sm text-gray-600">Industrie: ${this.wizardData.brandInfo.industry}</p>
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIReachApp();
});