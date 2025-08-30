// AIREACH - Services d'intégration des plateformes IA
import { z } from 'zod'

// Types pour les réponses des plateformes IA
export interface AIResponse {
  platform: string
  query: string
  response: string
  timestamp: string
  metadata?: {
    model?: string
    tokens?: number
    latency?: number
  }
}

// Configuration des plateformes IA
export interface PlatformConfig {
  id: string
  name: string
  displayName: string
  endpoint: string
  isActive: boolean
  requiresAuth: boolean
  rateLimit: {
    requestsPerMinute: number
    requestsPerDay: number
  }
}

// Configuration des plateformes supportées
export const AI_PLATFORMS: PlatformConfig[] = [
  {
    id: 'openai',
    name: 'chatgpt',
    displayName: 'ChatGPT',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 3000 }
  },
  {
    id: 'anthropic',
    name: 'claude',
    displayName: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 2000 }
  },
  {
    id: 'google',
    name: 'gemini',
    displayName: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 1500 }
  },
  {
    id: 'perplexity',
    name: 'perplexity',
    displayName: 'Perplexity AI',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 20, requestsPerDay: 500 }
  },
  {
    id: 'together',
    name: 'llama',
    displayName: 'Meta Llama',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    isActive: true,
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 1000 }
  },
  {
    id: 'deepseek',
    name: 'deepseek',
    displayName: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    isActive: false, // API en beta
    requiresAuth: true,
    rateLimit: { requestsPerMinute: 30, requestsPerDay: 500 }
  }
]

// Service de base pour les intégrations IA
export abstract class AIServiceBase {
  protected platform: PlatformConfig
  protected apiKey: string

  constructor(platform: PlatformConfig, apiKey: string) {
    this.platform = platform
    this.apiKey = apiKey
  }

  abstract generateResponse(query: string): Promise<AIResponse>
  
  protected buildHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'AIREACH/1.0 Brand-Monitoring-Tool'
    }
  }

  protected handleRateLimit(response: Response): void {
    if (response.status === 429) {
      console.warn(`Rate limit hit for ${this.platform.displayName}`)
      throw new Error(`Rate limit exceeded for ${this.platform.displayName}`)
    }
  }
}

// Service OpenAI ChatGPT
export class OpenAIService extends AIServiceBase {
  async generateResponse(query: string): Promise<AIResponse> {
    const headers = {
      ...this.buildHeaders(),
      'Authorization': `Bearer ${this.apiKey}`
    }

    const body = {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }

    try {
      const response = await fetch(this.platform.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      this.handleRateLimit(response)

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        platform: this.platform.name,
        query,
        response: data.choices[0]?.message?.content || '',
        timestamp: new Date().toISOString(),
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens,
          latency: Date.now()
        }
      }
    } catch (error) {
      console.error(`OpenAI request failed:`, error)
      throw error
    }
  }
}

// Service Anthropic Claude
export class AnthropicService extends AIServiceBase {
  async generateResponse(query: string): Promise<AIResponse> {
    const headers = {
      ...this.buildHeaders(),
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01'
    }

    const body = {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: query
        }
      ]
    }

    try {
      const response = await fetch(this.platform.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      this.handleRateLimit(response)

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        platform: this.platform.name,
        query,
        response: data.content[0]?.text || '',
        timestamp: new Date().toISOString(),
        metadata: {
          model: data.model,
          tokens: data.usage?.output_tokens,
          latency: Date.now()
        }
      }
    } catch (error) {
      console.error(`Anthropic request failed:`, error)
      throw error
    }
  }
}

// Service Google Gemini
export class GeminiService extends AIServiceBase {
  async generateResponse(query: string): Promise<AIResponse> {
    const url = `${this.platform.endpoint}?key=${this.apiKey}`
    
    const body = {
      contents: [{
        parts: [{
          text: query
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 500
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body)
      })

      this.handleRateLimit(response)

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        platform: this.platform.name,
        query,
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'gemini-pro',
          latency: Date.now()
        }
      }
    } catch (error) {
      console.error(`Gemini request failed:`, error)
      throw error
    }
  }
}

// Service Perplexity
export class PerplexityService extends AIServiceBase {
  async generateResponse(query: string): Promise<AIResponse> {
    const headers = {
      ...this.buildHeaders(),
      'Authorization': `Bearer ${this.apiKey}`
    }

    const body = {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }

    try {
      const response = await fetch(this.platform.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      this.handleRateLimit(response)

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        platform: this.platform.name,
        query,
        response: data.choices[0]?.message?.content || '',
        timestamp: new Date().toISOString(),
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens,
          latency: Date.now()
        }
      }
    } catch (error) {
      console.error(`Perplexity request failed:`, error)
      throw error
    }
  }
}

// Factory pour créer les services appropriés
export class AIServiceFactory {
  static createService(platformId: string, apiKey: string): AIServiceBase {
    const platform = AI_PLATFORMS.find(p => p.id === platformId)
    if (!platform) {
      throw new Error(`Platform ${platformId} not supported`)
    }

    switch (platformId) {
      case 'openai':
        return new OpenAIService(platform, apiKey)
      case 'anthropic':
        return new AnthropicService(platform, apiKey)
      case 'google':
        return new GeminiService(platform, apiKey)
      case 'perplexity':
        return new PerplexityService(platform, apiKey)
      case 'together':
        // Utilise la même interface que OpenAI
        return new OpenAIService({...platform, endpoint: platform.endpoint}, apiKey)
      default:
        throw new Error(`Service for ${platformId} not implemented`)
    }
  }

  static getActivePlatforms(): PlatformConfig[] {
    return AI_PLATFORMS.filter(p => p.isActive)
  }
}

// Service simulé pour le développement (quand pas d'API keys)
export class SimulatedAIService extends AIServiceBase {
  private responses = [
    "D'après mes connaissances, {BRAND} est une solution intéressante dans le domaine {INDUSTRY}. Elle se distingue par sa facilité d'utilisation et son support client réactif.",
    "Pour répondre à votre question sur {BRAND}, il s'agit d'une marque reconnue qui offre des produits de qualité. Comparé à ses concurrents, {BRAND} présente l'avantage d'être plus accessible.",
    "Je peux vous parler de {BRAND}. Cette entreprise {INDUSTRY} est appréciée pour son approche innovante et ses solutions sur mesure. Beaucoup d'utilisateurs recommandent {BRAND} pour sa fiabilité.",
    "{BRAND} est effectivement une option à considérer dans le secteur {INDUSTRY}. Ses points forts incluent un excellent rapport qualité-prix et une communauté active d'utilisateurs.",
    "Concernant {BRAND}, c'est une marque qui a gagné en popularité récemment. Elle propose des fonctionnalités intéressantes et un service client de qualité, ce qui en fait un choix solide."
  ]

  async generateResponse(query: string, brandName?: string, industry?: string): Promise<AIResponse> {
    // Simulation d'une latence réseau
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    let randomResponse = this.responses[Math.floor(Math.random() * this.responses.length)]
    
    // Remplacer les templates par les vraies valeurs
    if (brandName) {
      randomResponse = randomResponse.replace(/{BRAND}/g, brandName)
    }
    if (industry) {
      randomResponse = randomResponse.replace(/{INDUSTRY}/g, industry)
    }
    
    return {
      platform: this.platform.name,
      query,
      response: randomResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        model: `${this.platform.displayName}-simulated`,
        tokens: Math.floor(Math.random() * 300) + 100,
        latency: Math.floor(Math.random() * 2000) + 500
      }
    }
  }
}