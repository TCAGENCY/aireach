// AIREACH - Système de collecte automatisée des données IA
import { AIServiceFactory, AIResponse, SimulatedAIService, AI_PLATFORMS } from './ai-platforms'

// Interface pour les résultats de collecte
export interface CollectionResult {
  success: boolean
  projectId: number
  queryId: number
  platformId: number
  response?: AIResponse
  analysis?: BrandAnalysis
  error?: string
}

// Interface pour l'analyse de marque
export interface BrandAnalysis {
  brandMentions: BrandMention[]
  brandMentionsCount: number
  brandPosition: number | null
  sentimentScore: number
  accuracyScore: number
  competitorMentions: string[]
  keyInsights: string[]
}

// Interface pour une mention de marque
export interface BrandMention {
  brand: string
  context: string
  position: number
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
}

// Configuration de la collecte
export interface CollectionConfig {
  projectId: number
  brandName: string
  queries: string[]
  platforms: string[]
  maxConcurrent: number
  delayBetweenRequests: number
}

// Service principal de collecte de données
export class DataCollectionService {
  private db: D1Database
  private apiKeys: Map<string, string>

  constructor(db: D1Database, apiKeys: Map<string, string> = new Map()) {
    this.db = db
    this.apiKeys = apiKeys
  }

  // Collecte des données pour un projet
  async collectDataForProject(projectId: number): Promise<CollectionResult[]> {
    try {
      // Récupérer les informations du projet
      const project = await this.db.prepare(`
        SELECT * FROM projects WHERE id = ? AND status = 'active'
      `).bind(projectId).first()

      if (!project) {
        throw new Error(`Project ${projectId} not found or inactive`)
      }

      // Récupérer les requêtes actives
      const queries = await this.db.prepare(`
        SELECT * FROM tracked_queries 
        WHERE project_id = ? AND is_active = TRUE
        ORDER BY priority ASC
      `).bind(projectId).all()

      if (!queries.results || queries.results.length === 0) {
        console.warn(`No active queries found for project ${projectId}`)
        return []
      }

      // Récupérer les plateformes actives
      const platforms = await this.db.prepare(`
        SELECT * FROM ai_platforms WHERE is_active = TRUE
      `).all()

      const results: CollectionResult[] = []

      // Collecter pour chaque combinaison query/platform
      for (const query of queries.results as any[]) {
        for (const platform of platforms.results as any[]) {
          try {
            const result = await this.collectSingleResponse(
              projectId,
              query,
              platform,
              project.brand_name as string,
              project
            )
            results.push(result)

            // Délai entre les requêtes pour éviter rate limiting
            await this.delay(2000)
          } catch (error) {
            console.error(`Collection failed for query ${query.id}, platform ${platform.id}:`, error)
            results.push({
              success: false,
              projectId,
              queryId: query.id,
              platformId: platform.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }
      }

      return results
    } catch (error) {
      console.error(`Project collection failed for ${projectId}:`, error)
      throw error
    }
  }

  // Collecte d'une réponse unique
  private async collectSingleResponse(
    projectId: number,
    query: any,
    platform: any,
    brandName: string,
    project?: any
  ): Promise<CollectionResult> {
    try {
      console.log(`🔄 Collecting response for "${query.query_text}" on ${platform.display_name}`)

      // Obtenir le service IA approprié
      const aiService = this.getAIService(platform.name)
      
      // Générer la réponse (avec les vraies données pour la simulation)
      let response;
      if (aiService instanceof SimulatedAIService) {
        response = await (aiService as any).generateResponse(query.query_text, brandName, project?.industry)
      } else {
        response = await aiService.generateResponse(query.query_text)
      }
      
      // Analyser la réponse pour extraire les mentions de marque
      const analysis = await this.analyzeBrandMentions(response.response, brandName, query)

      // Stocker en base de données
      await this.storeResponse(projectId, query.id, platform.id, response, analysis)

      console.log(`✅ Successfully collected and analyzed response from ${platform.display_name}`)

      return {
        success: true,
        projectId,
        queryId: query.id,
        platformId: platform.id,
        response,
        analysis
      }
    } catch (error) {
      console.error(`Single response collection failed:`, error)
      throw error
    }
  }

  // Obtenir le service IA approprié
  private getAIService(platformName: string) {
    // Pour le développement, utiliser le service simulé si pas de clés API
    const platformConfig = AI_PLATFORMS.find(p => p.name === platformName)
    if (!platformConfig) {
      throw new Error(`Platform ${platformName} not found`)
    }

    const apiKey = this.apiKeys.get(platformName)
    
    // Si pas de clé API, utiliser le service simulé
    if (!apiKey) {
      console.log(`⚡ Using simulated service for ${platformName} (no API key)`)
      return new SimulatedAIService(platformConfig, '')
    }

    try {
      return AIServiceFactory.createService(
        AI_PLATFORMS.find(p => p.name === platformName)?.id || platformName,
        apiKey
      )
    } catch (error) {
      console.warn(`Falling back to simulated service for ${platformName}:`, error)
      return new SimulatedAIService(platformConfig, '')
    }
  }

  // Analyser les mentions de marque dans une réponse
  private async analyzeBrandMentions(response: string, brandName: string, query: any): Promise<BrandAnalysis> {
    const brandAnalyzer = new BrandMentionAnalyzer()
    return brandAnalyzer.analyze(response, brandName, query)
  }

  // Stocker la réponse en base de données
  private async storeResponse(
    projectId: number,
    queryId: number,
    platformId: number,
    response: AIResponse,
    analysis: BrandAnalysis
  ) {
    await this.db.prepare(`
      INSERT INTO ai_responses (
        query_id, platform_id, project_id, response_text,
        brand_mentions_count, brand_position, sentiment_score, accuracy_score,
        response_length, collected_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      queryId,
      platformId,
      projectId,
      response.response,
      analysis.brandMentionsCount,
      analysis.brandPosition,
      analysis.sentimentScore,
      analysis.accuracyScore,
      response.response.length,
      new Date().toISOString()
    ).run()
  }

  // Utilitaire pour délai
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Planifier la collecte automatique
  async scheduleCollection(projectId: number, intervalMinutes: number = 60): Promise<void> {
    console.log(`📅 Scheduling collection for project ${projectId} every ${intervalMinutes} minutes`)
    
    // Dans un environnement production, ceci serait implémenté avec Cloudflare Cron Triggers
    // Pour le développement, on simule avec un interval simple
    const collect = async () => {
      try {
        console.log(`🚀 Starting scheduled collection for project ${projectId}`)
        const results = await this.collectDataForProject(projectId)
        console.log(`✅ Scheduled collection completed: ${results.filter(r => r.success).length}/${results.length} successful`)
      } catch (error) {
        console.error(`❌ Scheduled collection failed for project ${projectId}:`, error)
      }
    }

    // Collecte immédiate puis programmée
    await collect()
    
    // Note: En production, utiliser Cloudflare Cron Triggers au lieu de setInterval
    if (typeof setInterval !== 'undefined') {
      setInterval(collect, intervalMinutes * 60 * 1000)
    }
  }
}

// Analyseur de mentions de marque
export class BrandMentionAnalyzer {
  async analyze(responseText: string, brandName: string, query: any): Promise<BrandAnalysis> {
    try {
      // Normaliser le texte
      const normalizedText = responseText.toLowerCase()
      const normalizedBrand = brandName.toLowerCase()

      // Rechercher les mentions de la marque
      const mentions = this.findBrandMentions(responseText, brandName)
      
      // Calculer la position de la marque
      const brandPosition = this.calculateBrandPosition(normalizedText, normalizedBrand)
      
      // Analyser le sentiment
      const sentimentScore = this.analyzeSentiment(responseText, brandName)
      
      // Calculer le score d'exactitude
      const accuracyScore = this.calculateAccuracyScore(responseText, brandName, query)

      // Identifier les concurrents mentionnés
      const competitorMentions = this.findCompetitorMentions(responseText)

      // Extraire les insights clés
      const keyInsights = this.extractKeyInsights(responseText, brandName)

      return {
        brandMentions: mentions,
        brandMentionsCount: mentions.length,
        brandPosition,
        sentimentScore,
        accuracyScore,
        competitorMentions,
        keyInsights
      }
    } catch (error) {
      console.error('Brand analysis failed:', error)
      return {
        brandMentions: [],
        brandMentionsCount: 0,
        brandPosition: null,
        sentimentScore: 0,
        accuracyScore: 0,
        competitorMentions: [],
        keyInsights: []
      }
    }
  }

  private findBrandMentions(text: string, brandName: string): BrandMention[] {
    const mentions: BrandMention[] = []
    const words = text.split(/\s+/)
    
    words.forEach((word, index) => {
      if (word.toLowerCase().includes(brandName.toLowerCase())) {
        // Extraire le contexte (5 mots avant et après)
        const start = Math.max(0, index - 5)
        const end = Math.min(words.length, index + 6)
        const context = words.slice(start, end).join(' ')

        mentions.push({
          brand: brandName,
          context,
          position: index + 1,
          sentiment: this.determineMentionSentiment(context),
          confidence: 0.8 // Score de confiance simplifié
        })
      }
    })

    return mentions
  }

  private calculateBrandPosition(text: string, brandName: string): number | null {
    // Diviser le texte en "sections" logiques (phrases, paragraphes)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i].includes(brandName)) {
        return i + 1 // Position basée sur l'ordre d'apparition
      }
    }
    
    return null // Marque non mentionnée
  }

  private analyzeSentiment(text: string, brandName: string): number {
    // Mots-clés positifs et négatifs pour analyse de sentiment simplifiée
    const positiveWords = ['excellent', 'best', 'great', 'amazing', 'good', 'recommended', 'popular', 'quality', 'innovative', 'reliable', 'effective', 'outstanding', 'superior']
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'worst', 'disappointing', 'unreliable', 'expensive', 'slow', 'difficult', 'problems', 'issues', 'failed']

    // Extraire les phrases contenant la marque
    const sentences = text.toLowerCase().split(/[.!?]+/)
    const brandSentences = sentences.filter(s => s.includes(brandName.toLowerCase()))

    if (brandSentences.length === 0) return 0

    let totalSentiment = 0
    let count = 0

    brandSentences.forEach(sentence => {
      let sentimentScore = 0
      
      positiveWords.forEach(word => {
        if (sentence.includes(word)) sentimentScore += 1
      })
      
      negativeWords.forEach(word => {
        if (sentence.includes(word)) sentimentScore -= 1
      })

      totalSentiment += sentimentScore
      count++
    })

    // Normaliser entre -1 et 1
    const averageSentiment = count > 0 ? totalSentiment / count : 0
    return Math.max(-1, Math.min(1, averageSentiment / 3)) // Diviser par 3 pour normaliser
  }

  private calculateAccuracyScore(text: string, brandName: string, query: any): number {
    // Score d'exactitude basé sur la pertinence de la réponse
    let score = 0.5 // Score de base

    // Vérifier si la marque est mentionnée (bonus)
    if (text.toLowerCase().includes(brandName.toLowerCase())) {
      score += 0.3
    }

    // Vérifier la longueur de la réponse (réponses trop courtes ou trop longues sont moins fiables)
    if (text.length > 50 && text.length < 1000) {
      score += 0.1
    }

    // Vérifier la présence d'informations spécifiques
    const infoKeywords = ['features', 'benefits', 'pricing', 'support', 'company', 'product', 'service']
    const keywordCount = infoKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length

    score += (keywordCount / infoKeywords.length) * 0.1

    return Math.max(0, Math.min(1, score))
  }

  private findCompetitorMentions(text: string): string[] {
    // Liste de concurrents communs (à étendre selon l'industrie)
    const commonCompetitors = [
      'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Tesla',
      'Samsung', 'Sony', 'Netflix', 'Spotify', 'Slack', 'Zoom',
      'Salesforce', 'HubSpot', 'Monday.com', 'Asana', 'Notion',
      'Figma', 'Canva', 'Adobe', 'Shopify', 'WordPress'
    ]

    return commonCompetitors.filter(competitor =>
      text.toLowerCase().includes(competitor.toLowerCase())
    )
  }

  private extractKeyInsights(text: string, brandName: string): string[] {
    const insights: string[] = []
    
    // Rechercher des patterns d'insights
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      
      if (lowerSentence.includes(brandName.toLowerCase())) {
        // Extraire les phrases avec des mots-clés d'insight
        if (lowerSentence.includes('compare') || lowerSentence.includes('vs') || lowerSentence.includes('versus')) {
          insights.push(`Comparison: ${sentence.trim()}`)
        }
        
        if (lowerSentence.includes('advantage') || lowerSentence.includes('benefit') || lowerSentence.includes('strength')) {
          insights.push(`Strength: ${sentence.trim()}`)
        }
        
        if (lowerSentence.includes('weakness') || lowerSentence.includes('limitation') || lowerSentence.includes('drawback')) {
          insights.push(`Weakness: ${sentence.trim()}`)
        }
        
        if (lowerSentence.includes('recommend') || lowerSentence.includes('suggest')) {
          insights.push(`Recommendation: ${sentence.trim()}`)
        }
      }
    })

    return insights.slice(0, 5) // Limiter à 5 insights max
  }

  private determineMentionSentiment(context: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'excellent', 'best', 'recommended', 'popular', 'effective']
    const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'disappointing', 'unreliable']

    const lowerContext = context.toLowerCase()
    
    const positiveCount = positiveWords.filter(word => lowerContext.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerContext.includes(word)).length

    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }
}