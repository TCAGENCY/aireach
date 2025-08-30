// AIREACH - Service de détection de marque et génération de questions
export interface BrandDetectionResult {
  domain: string
  detectedBrandName: string
  industry: string
  confidence: number
  suggestions: {
    brandNames: string[]
    industries: string[]
  }
}

export interface QuestionSuggestion {
  id: string
  text: string
  category: string
  priority: number
  searchVolume: number
  isSelected: boolean
}

// Service de détection de marque basé sur le domaine
export class BrandDetectionService {
  
  // Détecter la marque à partir du domaine
  async detectBrandFromDomain(domain: string): Promise<BrandDetectionResult> {
    // Nettoyer le domaine
    const cleanDomain = this.cleanDomain(domain)
    
    // Extraire le nom de la marque
    const detectedBrand = this.extractBrandName(cleanDomain)
    
    // Détecter l'industrie
    const industry = await this.detectIndustry(cleanDomain)
    
    return {
      domain: cleanDomain,
      detectedBrandName: detectedBrand,
      industry: industry.name,
      confidence: 0.85,
      suggestions: {
        brandNames: this.generateBrandNameSuggestions(detectedBrand),
        industries: industry.suggestions
      }
    }
  }

  // Nettoyer et normaliser le domaine
  private cleanDomain(domain: string): string {
    // Supprimer protocole et www
    let clean = domain.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
    
    // Garder seulement le nom de domaine principal
    const parts = clean.split('.')
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
    }
    
    return clean
  }

  // Extraire le nom de marque du domaine
  private extractBrandName(domain: string): string {
    const domainName = domain.split('.')[0]
    
    // Capitaliser la première lettre
    return domainName.charAt(0).toUpperCase() + domainName.slice(1)
  }

  // Détecter l'industrie basée sur le domaine
  private async detectIndustry(domain: string): Promise<{name: string, suggestions: string[]}> {
    // Base de données simplifiée d'industries par mots-clés
    const industryKeywords = {
      'Technology': ['tech', 'software', 'app', 'digital', 'cloud', 'ai', 'data'],
      'E-commerce': ['shop', 'store', 'buy', 'sell', 'market', 'commerce'],
      'Fashion': ['fashion', 'style', 'clothes', 'wear', 'boutique'],
      'Food & Beverage': ['food', 'restaurant', 'wine', 'coffee', 'delivery', 'cave', 'vins', 'vin', 'cellar', 'bottle'],
      'Healthcare': ['health', 'medical', 'care', 'wellness', 'pharma'],
      'Finance': ['bank', 'finance', 'invest', 'money', 'pay'],
      'Education': ['edu', 'school', 'learn', 'course', 'university'],
      'Travel': ['travel', 'hotel', 'booking', 'trip', 'vacation'],
      'Real Estate': ['real', 'estate', 'property', 'home', 'rent'],
      'Entertainment': ['game', 'music', 'video', 'entertainment', 'media']
    }

    const domainLower = domain.toLowerCase()
    let detectedIndustry = 'Other'
    let maxMatches = 0

    // Chercher les mots-clés dans le domaine
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matches = keywords.filter(keyword => domainLower.includes(keyword)).length
      if (matches > maxMatches) {
        maxMatches = matches
        detectedIndustry = industry
      }
    }

    // Cas spéciaux basés sur l'extension ou patterns
    if (domain.includes('.wine') || domain.includes('wine') || domain.includes('vino')) {
      detectedIndustry = 'Food & Beverage'
    } else if (domain.includes('.tech') || domain.includes('app')) {
      detectedIndustry = 'Technology'
    }

    return {
      name: detectedIndustry,
      suggestions: Object.keys(industryKeywords)
    }
  }

  // Générer des suggestions de noms de marque
  private generateBrandNameSuggestions(baseName: string): string[] {
    return [
      baseName,
      baseName + ' Inc',
      baseName + ' Company',
      baseName + ' Solutions',
      `The ${baseName} Group`
    ]
  }
}

// Service de génération de questions
export class QuestionGenerationService {
  
  // Générer des questions suggérées basées sur la marque et l'industrie
  async generateQuestions(brandName: string, industry: string, domain: string): Promise<QuestionSuggestion[]> {
    const baseQuestions = this.getBaseQuestionTemplates(industry)
    const brandSpecificQuestions = this.generateBrandSpecificQuestions(brandName, industry, domain)
    
    // Combiner et prioriser
    const allQuestions = [...baseQuestions, ...brandSpecificQuestions]
    
    // Ajouter des volumes de recherche simulés
    return allQuestions.map((q, index) => ({
      ...q,
      id: `q_${index + 1}`,
      searchVolume: this.simulateSearchVolume(),
      isSelected: index < 10 // Sélectionner les 10 premières par défaut
    })).slice(0, 20) // Limiter à 20 questions max
  }

  // Templates de questions par industrie
  private getBaseQuestionTemplates(industry: string): Omit<QuestionSuggestion, 'id' | 'searchVolume' | 'isSelected'>[] {
    const templates = {
      'Food & Beverage': [
        { text: 'Top rated wine delivery apps?', category: 'comparison', priority: 1 },
        { text: 'Compare wine store discounts?', category: 'pricing', priority: 2 },
        { text: 'Best wine delivery services?', category: 'service', priority: 1 },
        { text: 'Where to find rare wines?', category: 'specialty', priority: 2 },
        { text: 'Best online deals on wine?', category: 'pricing', priority: 1 },
        { text: 'Where to buy organic wine?', category: 'specialty', priority: 2 },
        { text: 'Compare wine subscription services?', category: 'service', priority: 2 },
        { text: 'Where to buy organic wine?', category: 'specialty', priority: 2 },
        { text: 'Compare wine store return policies?', category: 'policy', priority: 3 }
      ],
      'Technology': [
        { text: 'Best project management tools?', category: 'comparison', priority: 1 },
        { text: 'Top software solutions for teams?', category: 'service', priority: 1 },
        { text: 'Compare productivity apps pricing?', category: 'pricing', priority: 2 },
        { text: 'Most reliable cloud platforms?', category: 'reliability', priority: 1 },
        { text: 'Best collaboration software features?', category: 'features', priority: 1 },
        { text: 'Top automation tools for businesses?', category: 'automation', priority: 2 },
        { text: 'Compare API integration options?', category: 'integration', priority: 2 },
        { text: 'Best customer support platforms?', category: 'support', priority: 2 }
      ],
      'E-commerce': [
        { text: 'Best online shopping platforms?', category: 'platform', priority: 1 },
        { text: 'Compare e-commerce solutions?', category: 'comparison', priority: 1 },
        { text: 'Most secure payment gateways?', category: 'security', priority: 1 },
        { text: 'Best shipping and logistics services?', category: 'logistics', priority: 2 },
        { text: 'Top customer service tools?', category: 'service', priority: 2 },
        { text: 'Compare return policy options?', category: 'policy', priority: 3 }
      ],
      'Healthcare': [
        { text: 'Best telemedicine platforms?', category: 'service', priority: 1 },
        { text: 'Top healthcare management systems?', category: 'management', priority: 1 },
        { text: 'Compare medical record software?', category: 'software', priority: 2 },
        { text: 'Most trusted health apps?', category: 'apps', priority: 2 },
        { text: 'Best patient care solutions?', category: 'care', priority: 1 }
      ]
    }

    return templates[industry as keyof typeof templates] || [
      { text: 'Best solutions in this industry?', category: 'general', priority: 1 },
      { text: 'Compare service providers?', category: 'comparison', priority: 2 },
      { text: 'Top rated companies?', category: 'rating', priority: 2 },
      { text: 'Most reliable services?', category: 'reliability', priority: 2 }
    ]
  }

  // Générer des questions spécifiques à la marque
  private generateBrandSpecificQuestions(brandName: string, industry: string, domain: string): Omit<QuestionSuggestion, 'id' | 'searchVolume' | 'isSelected'>[] {
    const questions = []
    
    // Questions directes sur la marque
    questions.push(
      { text: `${brandName} reviews and ratings?`, category: 'brand_direct', priority: 1 },
      { text: `${brandName} vs competitors comparison?`, category: 'brand_comparison', priority: 1 },
      { text: `${brandName} pricing and plans?`, category: 'brand_pricing', priority: 2 },
      { text: `${brandName} customer support quality?`, category: 'brand_support', priority: 2 },
      { text: `Is ${brandName} worth it?`, category: 'brand_value', priority: 1 }
    )

    // Questions contextuelles selon le domaine
    if (domain.includes('wine') || domain.includes('vino')) {
      questions.push(
        { text: `Where to buy ${brandName} wine?`, category: 'brand_location', priority: 1 },
        { text: `${brandName} wine delivery options?`, category: 'brand_service', priority: 2 },
        { text: `${brandName} wine selection quality?`, category: 'brand_quality', priority: 2 }
      )
    } else if (domain.includes('.ma') || industry === 'Food & Beverage') {
      questions.push(
        { text: `Where to buy Moroccan wine?`, category: 'location_specific', priority: 1 },
        { text: `Best wine shops in Morocco?`, category: 'location_specific', priority: 2 }
      )
    }

    return questions
  }

  // Simuler les volumes de recherche avec des données plus réalistes
  private simulateSearchVolume(): number {
    const random = Math.random()
    
    if (random < 0.2) {
      // 20% de volumes élevés (1000+)
      return Math.floor(Math.random() * 1000) + 1000 // 1000-2000
    } else if (random < 0.4) {
      // 20% de volumes moyens (100-999)
      return Math.floor(Math.random() * 900) + 100 // 100-999
    } else {
      // 60% de volumes faibles (<100)
      return Math.floor(Math.random() * 100) // 0-99
    }
  }

  // Obtenir des questions suggérées par industrie
  async getSuggestedQuestionsForIndustry(industry: string): Promise<string[]> {
    const suggestions = {
      'Food & Beverage': [
        'Best wine delivery apps?',
        'Top rated restaurants?',
        'Organic food stores nearby?',
        'Compare meal delivery services?',
        'Best coffee subscription services?'
      ],
      'Technology': [
        'Best project management tools?',
        'Top cloud storage solutions?',
        'Compare CRM software?',
        'Most secure VPN services?',
        'Best AI development platforms?'
      ],
      'E-commerce': [
        'Best online shopping platforms?',
        'Compare dropshipping suppliers?',
        'Most trusted payment gateways?',
        'Best inventory management tools?',
        'Top customer service software?'
      ]
    }

    return suggestions[industry as keyof typeof suggestions] || [
      'Best services in this industry?',
      'Top rated providers?',
      'Compare solutions?',
      'Most reliable options?'
    ]
  }
}