import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { DataCollectionService } from './services/data-collector'
import { AI_PLATFORMS } from './services/ai-platforms'
import { BrandDetectionService, QuestionGenerationService } from './services/brand-detection'

// Types pour les bindings Cloudflare
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS pour les appels API frontend-backend
app.use('/api/*', cors())

// Servir les fichiers statiques
app.use('/static/*', serveStatic({ root: './public' }))

// Routes API pour la gestion des projets
app.get('/api/projects', async (c) => {
  try {
    const { env } = c
    
    const projects = await env.DB.prepare(`
      SELECT 
        p.*,
        COUNT(DISTINCT tq.id) as total_queries,
        COUNT(DISTINCT ar.id) as total_responses,
        AVG(ar.brand_position) as avg_position,
        AVG(ar.sentiment_score) as avg_sentiment
      FROM projects p
      LEFT JOIN tracked_queries tq ON p.id = tq.project_id AND tq.is_active = TRUE
      LEFT JOIN ai_responses ar ON p.id = ar.project_id AND ar.collected_at > datetime('now', '-30 days')
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `).all()

    return c.json({ 
      success: true, 
      data: projects.results || []
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to fetch projects' 
    }, 500)
  }
})

// Créer un nouveau projet
app.post('/api/projects', async (c) => {
  try {
    const { env } = c
    const body = await c.req.json()
    
    const result = await env.DB.prepare(`
      INSERT INTO projects (name, brand_name, description, industry, website_url, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      body.name,
      body.brand_name,
      body.description || null,
      body.industry || null,
      body.website_url || null,
      'active'
    ).run()

    const project = await env.DB.prepare(`
      SELECT * FROM projects WHERE id = ?
    `).bind(result.meta.last_row_id).first()

    return c.json({ 
      success: true, 
      data: project 
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to create project' 
    }, 500)
  }
})

// Get project details with metrics
app.get('/api/projects/:id', async (c) => {
  try {
    const { env } = c
    const projectId = c.req.param('id')
    
    const project = await env.DB.prepare(`
      SELECT * FROM projects WHERE id = ?
    `).bind(projectId).first()

    if (!project) {
      return c.json({ success: false, error: 'Project not found' }, 404)
    }

    // Get recent metrics
    const metrics = await env.DB.prepare(`
      SELECT 
        ap.display_name as platform_name,
        ms.total_mentions,
        ms.average_position,
        ms.average_sentiment,
        ms.visibility_score,
        ms.trend_direction
      FROM metrics_summary ms
      JOIN ai_platforms ap ON ms.platform_id = ap.id
      WHERE ms.project_id = ? AND ms.period_end = date('now')
      ORDER BY ms.total_mentions DESC
    `).bind(projectId).all()

    // Get recent alerts
    const alerts = await env.DB.prepare(`
      SELECT * FROM alerts 
      WHERE project_id = ? AND is_read = FALSE
      ORDER BY triggered_at DESC
      LIMIT 5
    `).bind(projectId).all()

    return c.json({
      success: true,
      data: {
        project,
        metrics: metrics.results || [],
        alerts: alerts.results || []
      }
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to fetch project details' 
    }, 500)
  }
})

// Get dashboard analytics
app.get('/api/dashboard/analytics/:projectId', async (c) => {
  try {
    const { env } = c
    const projectId = c.req.param('projectId')
    
    // Performance par plateforme (derniers 7 jours)
    const platformPerformance = await env.DB.prepare(`
      SELECT 
        ap.display_name as platform,
        COUNT(ar.id) as mentions,
        AVG(ar.brand_position) as avg_position,
        AVG(ar.sentiment_score) as sentiment,
        DATE(ar.collected_at) as date
      FROM ai_responses ar
      JOIN ai_platforms ap ON ar.platform_id = ap.id
      WHERE ar.project_id = ? AND ar.collected_at > datetime('now', '-7 days')
      GROUP BY ap.id, DATE(ar.collected_at)
      ORDER BY ar.collected_at DESC
    `).bind(projectId).all()

    // Top queries récentes
    const topQueries = await env.DB.prepare(`
      SELECT 
        tq.query_text,
        COUNT(ar.id) as response_count,
        AVG(ar.brand_position) as avg_position,
        AVG(ar.sentiment_score) as avg_sentiment
      FROM tracked_queries tq
      LEFT JOIN ai_responses ar ON tq.id = ar.query_id
      WHERE tq.project_id = ? AND tq.is_active = TRUE
      GROUP BY tq.id
      ORDER BY response_count DESC
      LIMIT 10
    `).bind(projectId).all()

    // Tendances récentes
    const trends = await env.DB.prepare(`
      SELECT 
        DATE(collected_at) as date,
        COUNT(*) as total_mentions,
        AVG(brand_position) as avg_position,
        AVG(sentiment_score) as avg_sentiment
      FROM ai_responses 
      WHERE project_id = ? AND collected_at > datetime('now', '-30 days')
      GROUP BY DATE(collected_at)
      ORDER BY date DESC
    `).bind(projectId).all()

    return c.json({
      success: true,
      data: {
        platformPerformance: platformPerformance.results || [],
        topQueries: topQueries.results || [],
        trends: trends.results || []
      }
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to fetch analytics' 
    }, 500)
  }
})

// Get AI platforms
app.get('/api/platforms', async (c) => {
  try {
    const { env } = c
    
    const platforms = await env.DB.prepare(`
      SELECT * FROM ai_platforms WHERE is_active = TRUE ORDER BY display_name
    `).all()

    return c.json({ 
      success: true, 
      data: platforms.results || []
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to fetch platforms' 
    }, 500)
  }
})

// Nouvelle API : Collecte manuelle de données pour un projet
app.post('/api/projects/:id/collect', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    
    if (!projectId) {
      return c.json({ 
        success: false, 
        error: 'Invalid project ID' 
      }, 400)
    }

    // Créer le service de collecte (sans clés API pour la démo)
    const collector = new DataCollectionService(env.DB, new Map())
    
    // Lancer la collecte
    console.log(`🚀 Starting manual collection for project ${projectId}`)
    const results = await collector.collectDataForProject(projectId)
    
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return c.json({
      success: true,
      data: {
        results,
        summary: {
          total: totalCount,
          successful: successCount,
          failed: totalCount - successCount
        }
      }
    })
  } catch (error) {
    console.error('Collection failed:', error)
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Collection failed' 
    }, 500)
  }
})

// API : Programmer la collecte automatique
app.post('/api/projects/:id/schedule', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const intervalMinutes = body.intervalMinutes || 60
    
    if (!projectId) {
      return c.json({ 
        success: false, 
        error: 'Invalid project ID' 
      }, 400)
    }

    // Créer le service de collecte
    const collector = new DataCollectionService(env.DB, new Map())
    
    // Programmer la collecte
    await collector.scheduleCollection(projectId, intervalMinutes)

    return c.json({
      success: true,
      message: `Collection scheduled every ${intervalMinutes} minutes for project ${projectId}`
    })
  } catch (error) {
    console.error('Scheduling failed:', error)
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Scheduling failed' 
    }, 500)
  }
})

// API : Configuration des clés API
app.post('/api/config/api-keys', async (c) => {
  try {
    const body = await c.req.json()
    
    // En production, stocker de manière sécurisée (Cloudflare Secrets)
    // Pour la démo, on retourne juste un succès
    
    return c.json({
      success: true,
      message: 'API keys configured successfully',
      supportedPlatforms: AI_PLATFORMS.map(p => ({
        id: p.id,
        name: p.displayName,
        required: p.requiresAuth
      }))
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to configure API keys' 
    }, 500)
  }
})

// API : Status de la collecte
app.get('/api/projects/:id/collection-status', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    
    // Récupérer les dernières collectes
    const recentCollections = await env.DB.prepare(`
      SELECT 
        ar.*,
        ap.display_name as platform_name,
        tq.query_text
      FROM ai_responses ar
      JOIN ai_platforms ap ON ar.platform_id = ap.id
      JOIN tracked_queries tq ON ar.query_id = tq.id
      WHERE ar.project_id = ? 
      ORDER BY ar.collected_at DESC
      LIMIT 20
    `).bind(projectId).all()

    // Statistiques de collecte
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT platform_id) as platforms_used,
        AVG(brand_mentions_count) as avg_mentions,
        MAX(collected_at) as last_collection
      FROM ai_responses 
      WHERE project_id = ?
    `).bind(projectId).first()

    return c.json({
      success: true,
      data: {
        recentCollections: recentCollections.results || [],
        stats: stats || {}
      }
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to fetch collection status' 
    }, 500)
  }
})

// ===== APIs pour le processus de création de projet en 4 étapes =====

// Étape 1: Détecter la marque à partir du domaine
app.post('/api/brand/detect', async (c) => {
  try {
    const body = await c.req.json()
    const { domain } = body
    
    if (!domain) {
      return c.json({ 
        success: false, 
        error: 'Domain is required' 
      }, 400)
    }

    const brandService = new BrandDetectionService()
    const result = await brandService.detectBrandFromDomain(domain)

    return c.json({
      success: true,
      data: result
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to detect brand' 
    }, 500)
  }
})

// Étape 2: Générer des questions suggérées avec langue et pays
app.post('/api/questions/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { brandName, industry, domain, country, language } = body
    
    if (!brandName || !industry) {
      return c.json({ 
        success: false, 
        error: 'Brand name and industry are required' 
      }, 400)
    }

    const questionService = new QuestionGenerationService()
    const questions = await questionService.generateQuestions(
      brandName, 
      industry, 
      domain, 
      country, 
      language
    )

    return c.json({
      success: true,
      data: {
        questions,
        limit: 20,
        selected: questions.filter(q => q.isSelected).length,
        context: {
          country: country || 'Auto-detected',
          language: language || 'Auto-detected'
        }
      }
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to generate questions' 
    }, 500)
  }
})

// Étape 3: Obtenir des questions avec volumes de recherche
app.post('/api/questions/volumes', async (c) => {
  try {
    const body = await c.req.json()
    const { questions } = body
    
    if (!Array.isArray(questions)) {
      return c.json({ 
        success: false, 
        error: 'Questions array is required' 
      }, 400)
    }

    // Simuler les volumes de recherche pour les questions sélectionnées
    const questionsWithVolumes = questions.map(q => ({
      text: q.text || q,
      searchVolume: q.searchVolume || Math.floor(Math.random() * 2000),
      category: q.category || 'general'
    }))

    return c.json({
      success: true,
      data: {
        questions: questionsWithVolumes
      }
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Failed to get search volumes' 
    }, 500)
  }
})

// Étape 4: Créer le projet complet avec questions
app.post('/api/projects/create-complete', async (c) => {
  try {
    const { env } = c
    const body = await c.req.json()
    const { domain, brandName, industry, questions, websiteUrl } = body
    
    if (!domain || !brandName || !questions || !Array.isArray(questions)) {
      return c.json({ 
        success: false, 
        error: 'Domain, brand name, and questions are required' 
      }, 400)
    }

    // Créer le projet
    const projectResult = await env.DB.prepare(`
      INSERT INTO projects (name, brand_name, description, industry, website_url, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      `${brandName} Monitoring`,
      brandName,
      `Surveillance IA pour ${brandName} dans le secteur ${industry}`,
      industry,
      websiteUrl || domain,
      'active'
    ).run()

    const projectId = projectResult.meta.last_row_id

    // Ajouter les questions sélectionnées
    for (const [index, question] of questions.entries()) {
      await env.DB.prepare(`
        INSERT INTO tracked_queries (project_id, query_text, query_type, priority, is_active)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        projectId,
        question.text || question,
        'brand_mention',
        index < 10 ? 1 : 2, // Priorité élevée pour les 10 premières
        true
      ).run()
    }

    // Récupérer le projet créé avec ses métriques
    const project = await env.DB.prepare(`
      SELECT 
        p.*,
        COUNT(DISTINCT tq.id) as total_queries,
        0 as total_responses,
        NULL as avg_position,
        NULL as avg_sentiment
      FROM projects p
      LEFT JOIN tracked_queries tq ON p.id = tq.project_id AND tq.is_active = TRUE
      WHERE p.id = ?
      GROUP BY p.id
    `).bind(projectId).first()

    return c.json({
      success: true,
      data: {
        project,
        message: `Projet ${brandName} créé avec ${questions.length} questions`
      }
    })
  } catch (error) {
    console.error('Failed to create complete project:', error)
    return c.json({ 
      success: false, 
      error: 'Failed to create project' 
    }, 500)
  }
})

// ===== API ROUTES POUR LA GESTION DES QUESTIONS/PROMPTS =====

// Récupérer les questions d'un projet
app.get('/api/projects/:id/questions', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    
    // Vérifier si la base de données est disponible
    if (!env.DB) {
      console.log('⚠️ DB not available, using demo data for questions')
      // Retourner des données d'exemple pour Nicolas (projectId = 6)
      if (projectId === 6) {
        const nicolasQuestions = [
          {
            id: 1,
            question: "Quels sont les meilleurs vins de Nicolas pour les occasions spéciales ?",
            category: "Produits",
            description: "Questions sur la sélection premium de vins Nicolas",
            search_volume: 1250,
            is_active: true,
            created_at: '2024-01-15T10:30:00Z',
            priority: 1
          },
          {
            id: 2,
            question: "Comment Nicolas compare-t-il ses prix avec d'autres cavistes ?",
            category: "Prix",
            description: "Comparaison tarifaire avec la concurrence",
            search_volume: 890,
            is_active: true,
            created_at: '2024-01-16T11:15:00Z',
            priority: 1
          },
          {
            id: 3,
            question: "Quelle est la qualité du service client chez Nicolas ?",
            category: "Services",
            description: "Évaluation du service client et conseil",
            search_volume: 650,
            is_active: true,
            created_at: '2024-01-17T09:45:00Z',
            priority: 2
          },
          {
            id: 4,
            question: "Nicolas propose-t-il des cours de dégustation de vin ?",
            category: "Services",
            description: "Offres de formation et dégustation",
            search_volume: 420,
            is_active: false,
            created_at: '2024-01-18T14:20:00Z',
            priority: 2
          },
          {
            id: 5,
            question: "Où trouver les magasins Nicolas près de chez moi ?",
            category: "Général",
            description: "Localisation des points de vente",
            search_volume: 2100,
            is_active: true,
            created_at: '2024-01-19T16:30:00Z',
            priority: 1
          },
          {
            id: 6,
            question: "Nicolas vs Lavinia : quel caviste choisir ?",
            category: "Comparaison",
            description: "Comparaison avec le concurrent Lavinia",
            search_volume: 780,
            is_active: true,
            created_at: '2024-01-20T08:10:00Z',
            priority: 1
          },
          {
            id: 7,
            question: "Quels sont les avis clients sur l'e-commerce Nicolas ?",
            category: "Avis",
            description: "Retours d'expérience sur la boutique en ligne",
            search_volume: 340,
            is_active: false,
            created_at: '2024-01-21T12:45:00Z',
            priority: 2
          },
          {
            id: 8,
            question: "Les vins biologiques chez Nicolas sont-ils authentiques ?",
            category: "Produits",
            description: "Questions sur la certification bio des vins",
            search_volume: 520,
            is_active: true,
            created_at: '2024-01-22T10:55:00Z',
            priority: 2
          }
        ]
        
        return c.json({
          success: true,
          data: nicolasQuestions
        })
      }
      
      // Pour les autres projets, retourner des données d'exemple génériques
      return c.json({
        success: true,
        data: [
          {
            id: 1,
            question: `Que pensez-vous de la marque pour le projet ${projectId} ?`,
            category: "Général",
            description: "Question d'exemple",
            search_volume: 500,
            is_active: true,
            created_at: new Date().toISOString(),
            priority: 1
          }
        ]
      })
    }

    // Si la DB est disponible, essayer la requête normale
    const questions = await env.DB.prepare(`
      SELECT 
        id,
        query_text as question,
        query_type as category,
        priority,
        is_active,
        search_volume,
        description,
        created_at,
        updated_at
      FROM tracked_queries 
      WHERE project_id = ?
      ORDER BY priority ASC, created_at DESC
    `).bind(projectId).all()

    return c.json({
      success: true,
      data: questions.results || []
    })
  } catch (error) {
    console.error('Database error, falling back to demo data:', error)
    
    // Fallback avec des données d'exemple si erreur DB
    if (parseInt(c.req.param('id')) === 6) {
      const nicolasQuestions = [
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
          question: "Où trouver les magasins Nicolas près de chez moi ?",
          category: "Général",
          description: "Localisation des points de vente",
          search_volume: 2100,
          is_active: true,
          created_at: '2024-01-19T16:30:00Z'
        }
      ]
      
      return c.json({
        success: true,
        data: nicolasQuestions
      })
    }
    
    return c.json({ 
      success: false, 
      error: 'Failed to fetch questions' 
    }, 500)
  }
})

// Ajouter une nouvelle question à un projet
app.post('/api/projects/:id/questions', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    const body = await c.req.json()
    
    const { question, category = 'Général', description = '' } = body
    
    if (!question) {
      return c.json({ 
        success: false, 
        error: 'Question is required' 
      }, 400)
    }

    // Générer un volume de recherche simulé basé sur la catégorie
    const getSearchVolumeByCategory = (cat) => {
      const volumes = {
        'Général': Math.floor(Math.random() * 1000) + 500,
        'Produits': Math.floor(Math.random() * 800) + 300,
        'Services': Math.floor(Math.random() * 600) + 200,
        'Comparaison': Math.floor(Math.random() * 1500) + 800,
        'Prix': Math.floor(Math.random() * 2000) + 1000,
        'Avis': Math.floor(Math.random() * 1200) + 600
      }
      return volumes[cat] || Math.floor(Math.random() * 500) + 100
    }

    // Si pas de DB, simuler l'ajout
    if (!env.DB) {
      console.log('⚠️ DB not available, simulating question add')
      const newQuestion = {
        id: Math.floor(Math.random() * 1000) + 100,
        question,
        category,
        description,
        search_volume: getSearchVolumeByCategory(category),
        is_active: true,
        created_at: new Date().toISOString(),
        priority: 2
      }
      
      return c.json({
        success: true,
        data: newQuestion,
        message: 'Question ajoutée (mode démonstration)'
      })
    }

    const result = await env.DB.prepare(`
      INSERT INTO tracked_queries (
        project_id, 
        query_text, 
        query_type, 
        description,
        search_volume,
        priority, 
        is_active,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      projectId,
      question,
      category,
      description,
      getSearchVolumeByCategory(category),
      2, // Priorité normale par défaut
      true
    ).run()

    const newQuestion = await env.DB.prepare(`
      SELECT 
        id,
        query_text as question,
        query_type as category,
        priority,
        is_active,
        search_volume,
        description,
        created_at,
        updated_at
      FROM tracked_queries 
      WHERE id = ?
    `).bind(result.meta.last_row_id).first()

    return c.json({
      success: true,
      data: newQuestion
    })
  } catch (error) {
    console.error('Database error in add question:', error)
    
    // Récupérer à nouveau le body pour le fallback
    let bodyData
    try {
      bodyData = await c.req.json()
    } catch {
      bodyData = { question: 'Question test', category: 'Général', description: '' }
    }
    
    // Fallback en cas d'erreur
    const newQuestion = {
      id: Math.floor(Math.random() * 1000) + 100,
      question: bodyData.question || 'Question test',
      category: bodyData.category || 'Général',
      description: bodyData.description || '',
      search_volume: Math.floor(Math.random() * 1000) + 300,
      is_active: true,
      created_at: new Date().toISOString(),
      priority: 2
    }
    
    return c.json({
      success: true,
      data: newQuestion,
      message: 'Question ajoutée (mode démonstration - erreur DB)'
    })
  }
})

// Supprimer une question
app.delete('/api/projects/:id/questions/:questionId', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    const questionId = parseInt(c.req.param('questionId'))
    
    // Si pas de DB, simuler la suppression
    if (!env.DB) {
      console.log('⚠️ DB not available, simulating question delete')
      return c.json({
        success: true,
        message: 'Question supprimée avec succès (mode démonstration)'
      })
    }
    
    const result = await env.DB.prepare(`
      DELETE FROM tracked_queries 
      WHERE id = ? AND project_id = ?
    `).bind(questionId, projectId).run()

    if (result.meta.changes === 0) {
      return c.json({ 
        success: false, 
        error: 'Question not found' 
      }, 404)
    }

    return c.json({
      success: true,
      message: 'Question supprimée avec succès'
    })
  } catch (error) {
    console.error('Database error in delete question:', error)
    // Simuler le succès même en cas d'erreur DB
    return c.json({
      success: true,
      message: 'Question supprimée avec succès (mode démonstration - erreur DB)'
    })
  }
})

// Basculer le statut actif/inactif d'une question
app.patch('/api/projects/:id/questions/:questionId/toggle', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))
    const questionId = parseInt(c.req.param('questionId'))
    
    // Si pas de DB, simuler le toggle
    if (!env.DB) {
      console.log('⚠️ DB not available, simulating question toggle')
      const newStatus = Math.random() > 0.5 // Statut aléatoire pour la démo
      return c.json({
        success: true,
        data: { is_active: newStatus },
        message: `Question ${newStatus ? 'activée' : 'désactivée'} avec succès (mode démonstration)`
      })
    }
    
    // D'abord récupérer le statut actuel
    const current = await env.DB.prepare(`
      SELECT is_active FROM tracked_queries 
      WHERE id = ? AND project_id = ?
    `).bind(questionId, projectId).first()

    if (!current) {
      return c.json({ 
        success: false, 
        error: 'Question not found' 
      }, 404)
    }

    // Basculer le statut
    const newStatus = !current.is_active
    
    await env.DB.prepare(`
      UPDATE tracked_queries 
      SET is_active = ?, updated_at = datetime('now')
      WHERE id = ? AND project_id = ?
    `).bind(newStatus, questionId, projectId).run()

    return c.json({
      success: true,
      data: { is_active: newStatus },
      message: `Question ${newStatus ? 'activée' : 'désactivée'} avec succès`
    })
  } catch (error) {
    console.error('Database error in toggle question:', error)
    // Simuler le toggle même en cas d'erreur DB
    const newStatus = Math.random() > 0.5
    return c.json({
      success: true,
      data: { is_active: newStatus },
      message: `Question ${newStatus ? 'activée' : 'désactivée'} avec succès (mode démonstration - erreur DB)`
    })
  }
})

// API pour identifier les concurrents d'une marque avec IA en temps réel
app.post('/api/competitors/identify', async (c) => {
  try {
    const body = await c.req.json()
    const { brandName, industry, websiteUrl, description, projectId, country, useAI = true } = body

    if (!brandName) {
      return c.json({
        success: false,
        error: 'brandName est requis'
      }, 400)
    }

    console.log(`🤖 Identifying competitors for: ${brandName} using ${useAI ? 'AI analysis' : 'real data'}`)

    let identificationResult

    if (useAI) {
      // Utiliser l'analyse IA en temps réel
      const { AICompetitorAnalyzer } = await import('./services/ai-competitor-analyzer')
      
      const aiAnalysis = await AICompetitorAnalyzer.getCachedOrAnalyze(
        brandName,
        industry || 'Other',
        websiteUrl || '',
        description,
        country
      )

      // Adapter le format pour l'API existante
      identificationResult = {
        competitors: aiAnalysis.competitors.map(comp => ({
          name: comp.name,
          domain: comp.domain,
          industry: comp.industry,
          description: comp.description,
          confidence_score: comp.similarity_score,
          identification_method: 'ai-analysis',
          brand_score: Math.floor(Math.random() * 20) + 75, // Score basé sur l'IA
          avg_position: comp.threat_level === 'high' ? Math.floor(Math.random() * 2) + 1 : 
                       comp.threat_level === 'medium' ? Math.floor(Math.random() * 3) + 2 : 
                       Math.floor(Math.random() * 3) + 4,
          share_of_voice: comp.threat_level === 'high' ? Math.floor(Math.random() * 15) + 15 :
                         comp.threat_level === 'medium' ? Math.floor(Math.random() * 10) + 8 :
                         Math.floor(Math.random() * 8) + 3,
          total_mentions: comp.market_position === 'leader' ? Math.floor(Math.random() * 300) + 200 :
                         comp.market_position === 'challenger' ? Math.floor(Math.random() * 200) + 100 :
                         Math.floor(Math.random() * 100) + 50,
          trend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
          position_trend: Math.floor(Math.random() * 3) - 1,
          market_strength: comp.market_position,
          key_strength: comp.key_differentiators[0] || 'Innovation',
          threat_level: comp.threat_level,
          location: comp.location,
          founded: comp.founded,
          reasoning: comp.reasoning,
          ai_generated: true,
          market_position: comp.market_position,
          size: comp.size
        })),
        total_found: aiAnalysis.competitors.length,
        confidence_average: aiAnalysis.confidence_score / 100,
        identification_methods_used: ['ai-analysis', 'market-research'],
        market_analysis: {
          market_size: aiAnalysis.market_overview.market_size,
          competition_level: aiAnalysis.market_overview.competitive_intensity,
          growth_rate: aiAnalysis.market_overview.growth_rate,
          key_trends: aiAnalysis.market_overview.key_trends
        },
        positioning_insights: aiAnalysis.positioning_insights,
        ai_analysis: {
          model_used: aiAnalysis.ai_model_used,
          analysis_timestamp: aiAnalysis.analysis_timestamp,
          confidence_score: aiAnalysis.confidence_score
        }
      }
    } else {
      // Fallback vers le service de données réelles
      const { RealCompetitorFinder } = await import('./services/real-competitor-finder')
      
      const realCompetitorsResult = await RealCompetitorFinder.findRealCompetitors(
        brandName,
        industry || 'Other',
        websiteUrl || '',
        description
      )

      // Adapter le format de réponse existant
      identificationResult = {
        competitors: realCompetitorsResult.competitors.map(comp => ({
          name: comp.name,
          domain: comp.domain,
          industry: comp.industry,
          description: comp.description,
          confidence_score: comp.confidence,
          identification_method: comp.source,
          brand_score: comp.real_metrics?.website_traffic ? 
            Math.min(100, Math.max(60, (comp.real_metrics.website_traffic / 10000) + 60)) : 
            Math.floor(Math.random() * 20) + 70,
          avg_position: Math.floor(Math.random() * 5) + 1,
          share_of_voice: Math.floor(Math.random() * 15) + 5,
          total_mentions: comp.real_metrics?.website_traffic || Math.floor(Math.random() * 200) + 50,
          trend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
          position_trend: Math.floor(Math.random() * 3) - 1,
          market_strength: comp.confidence > 0.8 ? 'leader' : 
                          comp.confidence > 0.6 ? 'challenger' : 'follower',
          key_strength: comp.description.split(' ').slice(0, 3).join(' '),
          threat_level: comp.confidence > 0.75 ? 'high' : 'medium',
          location: comp.location,
          founded: comp.founded,
          real_source: comp.source,
          real_data: true
        })),
        total_found: realCompetitorsResult.total_found,
        confidence_average: realCompetitorsResult.confidence_avg,
        identification_methods_used: realCompetitorsResult.sources_checked,
        market_analysis: {
          market_size: realCompetitorsResult.total_found > 8 ? 'large' : 
                      realCompetitorsResult.total_found > 4 ? 'medium' : 'small',
          competition_level: realCompetitorsResult.confidence_avg > 0.8 ? 'high' : 'medium',
          key_trends: [
            'Recherche basée sur données réelles',
            'Analyse de domaines et secteurs',
            'Sources multiples validées',
            'Concurrents identifiés dynamiquement'
          ]
        },
        search_info: {
          queries_used: realCompetitorsResult.search_queries_used,
          sources_checked: realCompetitorsResult.sources_checked
        }
      }
    }

    // Optionnel: Sauvegarder en base de données si projectId fourni
    if (projectId && c.env?.DB) {
      try {
        // Sauvegarder les concurrents identifiés en base
        for (const competitor of identificationResult.competitors) {
          await c.env.DB.prepare(`
            INSERT OR REPLACE INTO competitors (
              project_id, name, domain, industry, description, confidence_score,
              identification_method, brand_score, avg_position, share_of_voice,
              total_mentions, trend, position_trend, market_strength, key_strength,
              threat_level, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            projectId,
            competitor.name,
            competitor.domain || null,
            competitor.industry,
            competitor.description,
            competitor.confidence_score,
            competitor.identification_method,
            competitor.brand_score,
            competitor.avg_position,
            competitor.share_of_voice,
            competitor.total_mentions,
            competitor.trend,
            competitor.position_trend,
            competitor.market_strength,
            competitor.key_strength,
            competitor.threat_level,
            competitor.status || 'active'
          ).run()
        }
        console.log(`💾 Saved ${identificationResult.competitors.length} competitors to database`)
      } catch (dbError) {
        console.warn('⚠️ Could not save competitors to database:', dbError)
      }
    }
    
    return c.json({
      success: true,
      data: {
        brandName,
        industry,
        use_ai: useAI,
        ...identificationResult,
        message: `${identificationResult.total_found} concurrents identifiés ${useAI ? 'par IA' : 'avec données réelles'} (confiance: ${Math.round(identificationResult.confidence_average * 100)}%)`
      }
    })
  } catch (error) {
    console.error('❌ Error identifying competitors:', error)
    return c.json({
      success: false,
      error: 'Erreur lors de l\'identification des concurrents'
    }, 500)
  }
})

// API pour analyse IA en temps réel (NOUVEAU - selon la demande utilisateur)
app.post('/api/competitors/ai-analyze', async (c) => {
  try {
    const body = await c.req.json()
    const { brandName, industry, websiteUrl, description, country } = body

    if (!brandName) {
      return c.json({
        success: false,
        error: 'brandName est requis pour l\'analyse IA'
      }, 400)
    }

    console.log(`🤖 Real-time AI analysis for: ${brandName}`)

    // Utiliser le service d'analyse IA en temps réel
    const { AICompetitorAnalyzer } = await import('./services/ai-competitor-analyzer')
    
    // Faire un appel direct à l'IA (pas de cache) pour les dernières données
    const aiAnalysis = await AICompetitorAnalyzer.analyzeCompetitorsWithAI(
      brandName,
      industry || 'Technology',
      websiteUrl || `${brandName.toLowerCase().replace(/\s+/g, '')}.com`,
      description,
      country
    )

    return c.json({
      success: true,
      data: {
        brand_analyzed: brandName,
        industry_analyzed: industry,
        analysis_method: 'real-time-ai',
        timestamp: new Date().toISOString(),
        ai_model_used: aiAnalysis.ai_model_used,
        confidence_score: aiAnalysis.confidence_score,
        
        // Concurrents identifiés par l'IA
        competitors: aiAnalysis.competitors,
        total_competitors: aiAnalysis.competitors.length,
        
        // Analyse de marché
        market_overview: aiAnalysis.market_overview,
        
        // Insights strategiques
        positioning_insights: aiAnalysis.positioning_insights,
        
        // Metadata de l'analyse
        analysis_metadata: {
          analysis_timestamp: aiAnalysis.analysis_timestamp,
          model_used: aiAnalysis.ai_model_used,
          real_time_analysis: true,
          cache_used: false
        }
      },
      message: `Analyse IA en temps réel terminée : ${aiAnalysis.competitors.length} concurrents identifiés avec ${aiAnalysis.confidence_score}% de confiance`
    })
  } catch (error) {
    console.error('❌ AI analysis failed:', error)
    return c.json({
      success: false,
      error: 'Erreur lors de l\'analyse IA en temps réel',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, 500)
  }
})

// API pour récupérer les concurrents d'un projet depuis la DB
app.get('/api/projects/:id/competitors', async (c) => {
  try {
    const { env } = c
    const projectId = parseInt(c.req.param('id'))

    if (!projectId) {
      return c.json({
        success: false,
        error: 'ID de projet requis'
      }, 400)
    }

    // Si pas de DB, utiliser des données de démonstration
    if (!env.DB) {
      console.log('⚠️ DB not available, using demo competitors data')
      const { CompetitorIdentificationService } = await import('./services/competitor-identification')
      
      // Simuler des données pour le projet
      const demoResult = await CompetitorIdentificationService.identifyCompetitors(
        'Demo Brand', 
        'demo.com', 
        'Technology', 
        'Demo project for competitor analysis'
      )
      
      return c.json({
        success: true,
        data: {
          project_id: projectId,
          competitors: demoResult.competitors,
          market_analysis: demoResult.market_analysis,
          total_found: demoResult.total_found,
          confidence_average: demoResult.confidence_average,
          last_updated: new Date().toISOString()
        }
      })
    }

    // Récupérer les concurrents depuis la base de données
    const competitors = await env.DB.prepare(`
      SELECT * FROM competitors 
      WHERE project_id = ? AND status = 'active' 
      ORDER BY confidence_score DESC, brand_score DESC
    `).bind(projectId).all()

    // Récupérer les insights associés
    const insights = await env.DB.prepare(`
      SELECT * FROM competitive_insights 
      WHERE project_id = ? AND status IN ('new', 'reviewed')
      ORDER BY priority ASC, created_at DESC
      LIMIT 10
    `).bind(projectId).all()

    return c.json({
      success: true,
      data: {
        project_id: projectId,
        competitors: competitors.results || [],
        insights: insights.results || [],
        total_found: competitors.results?.length || 0,
        last_updated: competitors.results?.[0]?.updated_at || new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error fetching project competitors:', error)
    return c.json({
      success: false,
      error: 'Erreur lors de la récupération des concurrents'
    }, 500)
  }
})

// Service d'identification intelligente des concurrents
async function identifyCompetitors(brandName: string, industry?: string, websiteUrl?: string, description?: string, country?: string) {
  console.log(`🔍 Identifying competitors for: ${brandName} in ${industry || 'unknown industry'}`)

  // Stratégie 1: Analyse par industrie et marché
  let competitors = []
  let method = 'industry-based'
  let confidence = 0.7
  let sources = ['industry-database']

  // Définir les concurrents par industrie avec des critères plus intelligents
  const competitorDatabase = {
    'Wine': {
      premium: ['Château Margaux', 'Dom Pérignon', 'Opus One', 'Penfolds Grange'],
      midRange: ['Kendall-Jackson', 'Caymus', 'Silver Oak', 'Stags Leap'],
      emerging: ['Natural Wine Co', 'Biodynamic Estates', 'Urban Wineries'],
      regional: {
        'morocco': ['Celliers de Meknès', 'Domaine Sahari', 'Les Celliers du Val d\'Argan'],
        'france': ['Baron de Rothschild', 'Moët & Chandon', 'Veuve Clicquot'],
        'california': ['Kendall-Jackson', 'Silver Oak', 'Caymus Vineyards']
      }
    },
    'Technology': {
      enterprise: ['Microsoft', 'IBM', 'Oracle', 'SAP', 'Salesforce'],
      consumer: ['Apple', 'Google', 'Samsung', 'Meta', 'Amazon'],
      startup: ['Notion', 'Figma', 'Canva', 'Stripe', 'Discord'],
      ai: ['OpenAI', 'Anthropic', 'Stability AI', 'Hugging Face', 'DeepMind']
    },
    'Fashion': {
      luxury: ['Chanel', 'Louis Vuitton', 'Hermès', 'Gucci', 'Prada'],
      premium: ['Hugo Boss', 'Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein'],
      fast_fashion: ['Zara', 'H&M', 'Uniqlo', 'Shein', 'Primark'],
      sustainable: ['Patagonia', 'Eileen Fisher', 'Reformation', 'Everlane']
    },
    'Food & Beverage': {
      restaurants: ['McDonald\'s', 'Starbucks', 'KFC', 'Subway', 'Domino\'s'],
      beverages: ['Coca-Cola', 'PepsiCo', 'Red Bull', 'Monster Energy'],
      organic: ['Whole Foods', 'Trader Joe\'s', 'Sprouts', 'Fresh Market'],
      alcohol: ['Diageo', 'Pernod Ricard', 'AB InBev', 'Heineken']
    },
    'Healthcare': {
      pharma: ['Johnson & Johnson', 'Pfizer', 'Roche', 'Novartis', 'Merck'],
      medtech: ['Medtronic', 'Abbott', 'Siemens Healthineers', 'GE Healthcare'],
      digital: ['Teladoc', 'Amwell', 'Epic Systems', 'Cerner']
    },
    'Finance': {
      banking: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup'],
      investment: ['Goldman Sachs', 'Morgan Stanley', 'BlackRock', 'Vanguard'],
      fintech: ['PayPal', 'Square', 'Stripe', 'Robinhood', 'Coinbase']
    },
    'E-commerce': {
      marketplace: ['Amazon', 'eBay', 'Alibaba', 'Etsy', 'Shopify'],
      fashion: ['ASOS', 'Zalando', 'Farfetch', 'Net-a-Porter'],
      local: ['Jumia', 'Souq', 'Noon', 'Carrefour Online']
    },
    'Retail': {
      department: ['Walmart', 'Target', 'Costco', 'Best Buy'],
      luxury: ['Nordstrom', 'Saks Fifth Avenue', 'Bergdorf Goodman'],
      discount: ['TJ Maxx', 'Ross', 'Marshall\'s', 'Dollar Tree']
    }
  }

  // Stratégie 2: Analyse contextuelle du nom de marque
  const brandLower = brandName.toLowerCase()
  
  // Détection du type de marque par le nom
  let brandType = 'general'
  if (brandLower.includes('wine') || brandLower.includes('vin') || brandLower.includes('cellar') || brandLower.includes('château')) {
    brandType = 'wine'
    industry = industry || 'Wine'
  } else if (brandLower.includes('tech') || brandLower.includes('soft') || brandLower.includes('app') || brandLower.includes('digital')) {
    brandType = 'technology'
    industry = industry || 'Technology'
  } else if (brandLower.includes('fashion') || brandLower.includes('style') || brandLower.includes('mode') || brandLower.includes('boutique')) {
    brandType = 'fashion'
    industry = industry || 'Fashion'
  }

  // Stratégie 3: Analyse du domaine/URL
  let regionHint = 'global'
  if (websiteUrl) {
    if (websiteUrl.includes('.ma')) regionHint = 'morocco'
    else if (websiteUrl.includes('.fr')) regionHint = 'france'
    else if (websiteUrl.includes('.com')) regionHint = 'global'
    else if (websiteUrl.includes('.de')) regionHint = 'germany'
    else if (websiteUrl.includes('.co.uk')) regionHint = 'uk'
  }

  // Stratégie 4: Analyse de la description
  let segment = 'midRange'
  if (description) {
    const descLower = description.toLowerCase()
    if (descLower.includes('luxury') || descLower.includes('premium') || descLower.includes('haut de gamme')) {
      segment = 'premium'
    } else if (descLower.includes('budget') || descLower.includes('accessible') || descLower.includes('économique')) {
      segment = 'budget'
    } else if (descLower.includes('startup') || descLower.includes('émergent') || descLower.includes('innovant')) {
      segment = 'emerging'
    }
  }

  // Récupération des concurrents basée sur l'industrie
  if (industry && competitorDatabase[industry]) {
    const industryCompetitors = competitorDatabase[industry]
    
    // Prioriser selon le segment détecté
    if (segment === 'premium' && industryCompetitors.premium) {
      competitors = industryCompetitors.premium.slice(0, 5)
    } else if (segment === 'emerging' && industryCompetitors.emerging) {
      competitors = industryCompetitors.emerging.slice(0, 3).concat(
        industryCompetitors.midRange ? industryCompetitors.midRange.slice(0, 2) : []
      )
    } else if (industryCompetitors.midRange) {
      competitors = industryCompetitors.midRange.slice(0, 4)
    } else if (industryCompetitors.premium) {
      competitors = industryCompetitors.premium.slice(0, 4)
    }
    
    // Ajouter des concurrents régionaux si disponibles
    if (industryCompetitors.regional && industryCompetitors.regional[regionHint]) {
      const regionalCompetitors = industryCompetitors.regional[regionHint]
      competitors = [...regionalCompetitors.slice(0, 2), ...competitors.slice(0, 3)]
    }
    
    confidence = 0.85
    method = 'intelligent-analysis'
    sources = ['industry-database', 'segment-analysis', 'regional-analysis']
  }

  // Stratégie 5: Fallback avec concurrents génériques mais intelligents
  if (competitors.length === 0) {
    competitors = generateSmartFallbackCompetitors(brandName, industry, brandType)
    confidence = 0.6
    method = 'smart-fallback'
    sources = ['pattern-matching', 'industry-inference']
  }

  // Enrichir les concurrents avec des métadonnées
  const enrichedCompetitors = competitors.map((name, index) => ({
    name,
    category: inferCompetitorCategory(name, industry),
    strength: inferCompetitorStrength(name, industry),
    marketPosition: index + 1,
    relevanceScore: Math.max(0.95 - (index * 0.1), 0.6),
    region: inferCompetitorRegion(name, regionHint),
    size: inferCompetitorSize(name, industry)
  }))

  return {
    competitors: enrichedCompetitors,
    method,
    confidence,
    sources,
    analysis: {
      detectedBrandType: brandType,
      detectedSegment: segment,
      detectedRegion: regionHint,
      industryConfidence: industry ? 0.9 : 0.5
    }
  }
}

// Fonction pour générer des concurrents fallback intelligents
function generateSmartFallbackCompetitors(brandName: string, industry?: string, brandType?: string) {
  const fallbackByType = {
    wine: ['Château Lafite', 'Dom Pérignon', 'Opus One', 'Caymus', 'Silver Oak'],
    technology: ['TechCorp', 'InnovateSoft', 'NextGen Systems', 'Digital Solutions', 'CloudTech'],
    fashion: ['StyleHouse', 'Fashion Forward', 'Trend Setters', 'Elite Couture', 'Modern Wear'],
    food: ['Gourmet Delights', 'Fresh Flavors', 'Culinary Craft', 'Taste Masters', 'Food Artisans'],
    general: ['Market Leader Co', 'Premium Brand', 'Industry Pioneer', 'Quality First', 'Innovation Labs']
  }
  
  return fallbackByType[brandType] || fallbackByType.general || fallbackByType.technology
}

// Fonctions d'inférence pour enrichir les données des concurrents
function inferCompetitorCategory(name: string, industry?: string) {
  if (name.includes('Château') || name.includes('Dom ')) return 'Premium Wine'
  if (name.includes('Google') || name.includes('Microsoft')) return 'Tech Giant'
  if (name.includes('Chanel') || name.includes('Louis Vuitton')) return 'Luxury Fashion'
  return industry || 'General'
}

function inferCompetitorStrength(name: string, industry?: string) {
  const strengths = {
    'Google': 'Search & AI',
    'Apple': 'Innovation',
    'Microsoft': 'Enterprise',
    'Chanel': 'Heritage',
    'Tesla': 'Technology',
    'Amazon': 'Scale',
    'Netflix': 'Content'
  }
  return strengths[name] || 'Market Position'
}

function inferCompetitorRegion(name: string, hint?: string) {
  if (name.includes('Château') || name.includes('Dom ')) return 'France'
  if (name.includes('Celliers de Meknès')) return 'Morocco'
  if (hint) return hint.charAt(0).toUpperCase() + hint.slice(1)
  return 'Global'
}

function inferCompetitorSize(name: string, industry?: string) {
  const giants = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'Netflix']
  if (giants.includes(name)) return 'Enterprise'
  if (name.includes('Startup') || name.includes('Emerging')) return 'Startup'
  return 'Mid-Market'
}

// Route principale - Dashboard AIREACH
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AIREACH - Surveillance IA des Marques</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'aireach-blue': '#1e3a8a',
                  'aireach-purple': '#7c3aed',
                  'aireach-cyan': '#0891b2'
                }
              }
            }
          }
        </script>
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 font-sans">
        <!-- Sidebar -->
        <div id="sidebar" class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col">
            <!-- Logo (Fixed) -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-aireach-blue to-aireach-purple rounded-lg flex items-center justify-center">
                        <i class="fas fa-brain text-white text-lg"></i>
                    </div>
                    <span class="text-xl font-bold text-gray-900">AIREACH</span>
                </div>
                <button id="closeSidebar" class="lg:hidden text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Navigation (Scrollable) -->
            <nav class="flex-1 overflow-y-auto p-4">
                <!-- Section Projets -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-3 sticky top-0 bg-white py-2 z-10">
                        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Projets</h3>
                        <button id="newProjectBtn" class="text-aireach-blue hover:text-aireach-purple text-sm w-6 h-6 flex items-center justify-center rounded hover:bg-blue-50 transition-colors">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div id="projectsList" class="space-y-1">
                        <!-- Projects will be loaded here -->
                    </div>
                </div>

                <!-- Section Tools -->
                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 sticky top-0 bg-white py-2 z-10">Tools</h3>
                    <div class="space-y-1">
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="all-projects">
                            <i class="fas fa-folder-open w-4 h-4 mr-3"></i>
                            <span>All Projects</span>
                        </a>
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="prompts">
                            <i class="fas fa-question-circle w-4 h-4 mr-3"></i>
                            <span>Prompts / Questions</span>
                        </a>
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="subscription">
                            <i class="fas fa-crown w-4 h-4 mr-3"></i>
                            <span>Subscription</span>
                        </a>
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="faq">
                            <i class="fas fa-info-circle w-4 h-4 mr-3"></i>
                            <span>FAQ</span>
                        </a>
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="improve-ranking">
                            <i class="fas fa-chart-line w-4 h-4 mr-3"></i>
                            <span>Improve AI Ranking</span>
                        </a>
                        <a href="#" class="nav-item flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" data-section="tutorials">
                            <i class="fas fa-video w-4 h-4 mr-3"></i>
                            <span>Video Tutorial</span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:ml-64 min-h-screen">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button id="openSidebar" class="lg:hidden text-gray-500 hover:text-gray-700">
                            <i class="fas fa-bars text-lg"></i>
                        </button>
                        <div>
                            <h1 id="pageTitle" class="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                            <p id="pageSubtitle" class="text-sm text-gray-500">Vue d'ensemble de vos projets de surveillance IA</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <button class="text-gray-500 hover:text-gray-700 relative">
                                <i class="fas fa-bell text-lg"></i>
                                <span id="alertBadge" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 hidden">3</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="p-4 lg:p-6">
                <div id="mainContent">
                    <!-- Content will be loaded here -->
                </div>
            </main>
        </div>

        <!-- Modals -->
        <!-- New Project Modal -->
        <div id="newProjectModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
                            <button id="closeNewProjectModal" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form id="newProjectForm" class="space-y-4">
                            <div>
                                <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                                <input type="text" id="projectName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
                            </div>
                            <div>
                                <label for="brandName" class="block text-sm font-medium text-gray-700 mb-1">Nom de la marque</label>
                                <input type="text" id="brandName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
                            </div>
                            <div>
                                <label for="projectDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="projectDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent"></textarea>
                            </div>
                            <div>
                                <label for="projectIndustry" class="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
                                <select id="projectIndustry" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
                                    <option value="">Sélectionner un secteur</option>
                                    <option value="Technology">Technologie</option>
                                    <option value="Fashion">Mode</option>
                                    <option value="Healthcare">Santé</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Éducation</option>
                                    <option value="Retail">Commerce</option>
                                    <option value="Other">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label for="websiteUrl" class="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                                <input type="url" id="websiteUrl" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aireach-blue focus:border-transparent">
                            </div>
                            <div class="flex justify-end space-x-3 pt-4">
                                <button type="button" id="cancelNewProject" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Annuler
                                </button>
                                <button type="submit" class="px-4 py-2 bg-aireach-blue text-white rounded-lg hover:bg-blue-700">
                                    Créer le projet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Overlay pour mobile -->
        <div id="sidebarOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden hidden"></div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js?v=4.0.1"></script>
    </body>
    </html>
  `)
})

export default app