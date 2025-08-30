// AIREACH - Service de détection de marque et génération de questions
export interface BrandDetectionResult {
  domain: string
  detectedBrandName: string
  industry: string
  country: string
  language: string
  confidence: number
  suggestions: {
    brandNames: string[]
    industries: string[]
    countries: string[]
    languages: string[]
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
    
    // Détecter le pays et la langue
    const geoInfo = this.detectCountryAndLanguage(cleanDomain)
    
    return {
      domain: cleanDomain,
      detectedBrandName: detectedBrand,
      industry: industry.name,
      country: geoInfo.country,
      language: geoInfo.language,
      confidence: 0.85,
      suggestions: {
        brandNames: this.generateBrandNameSuggestions(detectedBrand),
        industries: industry.suggestions,
        countries: geoInfo.countrySuggestions,
        languages: geoInfo.languageSuggestions
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

  // Détecter le pays et la langue basés sur l'extension de domaine
  private detectCountryAndLanguage(domain: string): {
    country: string
    language: string
    countrySuggestions: string[]
    languageSuggestions: string[]
  } {
    // Mapping des extensions de domaine vers pays et langue
    const domainToCountry = {
      '.ma': { country: 'Morocco', language: 'French' },
      '.fr': { country: 'France', language: 'French' },
      '.com': { country: 'United States', language: 'English' },
      '.uk': { country: 'United Kingdom', language: 'English' },
      '.de': { country: 'Germany', language: 'German' },
      '.es': { country: 'Spain', language: 'Spanish' },
      '.it': { country: 'Italy', language: 'Italian' },
      '.be': { country: 'Belgium', language: 'French' },
      '.ch': { country: 'Switzerland', language: 'French' },
      '.ca': { country: 'Canada', language: 'English' },
      '.au': { country: 'Australia', language: 'English' }
    }

    // Détecter l'extension
    const extension = domain.includes('.') ? '.' + domain.split('.').pop() : ''
    const detected = domainToCountry[extension as keyof typeof domainToCountry]
    
    // Détections spéciales basées sur le contenu du domaine
    let detectedCountry = detected?.country || 'United States'
    let detectedLanguage = detected?.language || 'English'
    
    // Cas spéciaux pour le Maroc
    if (domain.includes('.ma') || domain.includes('maroc') || domain.includes('morocco')) {
      detectedCountry = 'Morocco'
      detectedLanguage = 'French' // Par défaut français pour le Maroc (business)
    }

    return {
      country: detectedCountry,
      language: detectedLanguage,
      countrySuggestions: [
        'Morocco', 'France', 'United States', 'United Kingdom', 
        'Canada', 'Germany', 'Spain', 'Italy', 'Belgium', 'Switzerland'
      ],
      languageSuggestions: [
        'French', 'English', 'Arabic', 'Spanish', 'German', 'Italian'
      ]
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
  
  // Générer des questions suggérées basées sur la marque, industrie, langue et pays
  async generateQuestions(
    brandName: string, 
    industry: string, 
    domain: string, 
    country?: string, 
    language?: string
  ): Promise<QuestionSuggestion[]> {
    // Détecter le pays et la langue si non fournis
    const brandDetection = new BrandDetectionService()
    const geoInfo = brandDetection['detectCountryAndLanguage'](domain)
    const targetCountry = country || geoInfo.country
    const targetLanguage = language || geoInfo.language

    const baseQuestions = this.getBaseQuestionTemplates(industry, targetLanguage, targetCountry)
    const brandSpecificQuestions = this.generateBrandSpecificQuestions(
      brandName, industry, domain, targetCountry, targetLanguage
    )
    
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

  // Templates de questions par industrie, langue et pays
  private getBaseQuestionTemplates(
    industry: string, 
    language: string = 'English', 
    country: string = 'United States'
  ): Omit<QuestionSuggestion, 'id' | 'searchVolume' | 'isSelected'>[] {
    
    // Templates multilingues pour Food & Beverage
    const foodBeverageTemplates = {
      'English': {
        'Morocco': [
          { text: 'Best wine shops in Morocco?', category: 'location', priority: 1 },
          { text: 'Where to buy alcohol in Morocco legally?', category: 'location', priority: 1 },
          { text: 'Top wine importers in Morocco?', category: 'suppliers', priority: 2 },
          { text: 'Moroccan wine vs imported wine quality?', category: 'comparison', priority: 2 },
          { text: 'Best wine delivery in Casablanca/Rabat?', category: 'service', priority: 2 }
        ],
        'France': [
          { text: 'Meilleurs cavistes en France?', category: 'location', priority: 1 },
          { text: 'Compare wine store prices France?', category: 'pricing', priority: 1 },
          { text: 'Best French wine regions to explore?', category: 'specialty', priority: 2 },
          { text: 'Wine delivery services in France?', category: 'service', priority: 2 }
        ],
        'default': [
          { text: 'Top rated wine delivery apps?', category: 'comparison', priority: 1 },
          { text: 'Best wine delivery services?', category: 'service', priority: 1 },
          { text: 'Compare wine store discounts?', category: 'pricing', priority: 2 },
          { text: 'Where to find rare wines?', category: 'specialty', priority: 2 }
        ]
      },
      'French': {
        'Morocco': [
          { text: 'Où acheter du vin au Maroc légalement ?', category: 'location', priority: 1 },
          { text: 'Meilleurs cavistes à Casablanca et Rabat ?', category: 'location', priority: 1 },
          { text: 'Importateurs de vin au Maroc ?', category: 'suppliers', priority: 2 },
          { text: 'Livraison de vin au Maroc - options ?', category: 'service', priority: 2 },
          { text: 'Vins marocains vs vins importés qualité ?', category: 'comparison', priority: 2 }
        ],
        'France': [
          { text: 'Meilleurs cavistes en France ?', category: 'location', priority: 1 },
          { text: 'Comparaison prix cavistes français ?', category: 'pricing', priority: 1 },
          { text: 'Meilleures appellations viticoles françaises ?', category: 'specialty', priority: 2 },
          { text: 'Services de livraison de vin en France ?', category: 'service', priority: 2 },
          { text: 'Abonnements vin français - comparatif ?', category: 'service', priority: 2 }
        ],
        'default': [
          { text: 'Meilleures applications de livraison de vin ?', category: 'comparison', priority: 1 },
          { text: 'Où trouver des vins rares ?', category: 'specialty', priority: 1 },
          { text: 'Comparaison des prix des cavistes ?', category: 'pricing', priority: 2 },
          { text: 'Services de livraison de vin - avis ?', category: 'service', priority: 2 }
        ]
      }
    }

    // Templates pour Technology (multilingue)
    const technologyTemplates = {
      'English': [
        { text: 'Best project management tools?', category: 'comparison', priority: 1 },
        { text: 'Top software solutions for teams?', category: 'service', priority: 1 },
        { text: 'Compare productivity apps pricing?', category: 'pricing', priority: 2 }
      ],
      'French': [
        { text: 'Meilleurs outils de gestion de projet ?', category: 'comparison', priority: 1 },
        { text: 'Solutions logicielles pour équipes ?', category: 'service', priority: 1 },
        { text: 'Comparaison prix applications productivité ?', category: 'pricing', priority: 2 }
      ]
    }

    // Sélectionner les templates appropriés
    if (industry === 'Food & Beverage') {
      const languageTemplates = foodBeverageTemplates[language as keyof typeof foodBeverageTemplates] || foodBeverageTemplates['English']
      const countryTemplates = languageTemplates[country as keyof typeof languageTemplates] || languageTemplates['default']
      return countryTemplates
    }
    
    if (industry === 'Technology') {
      return technologyTemplates[language as keyof typeof technologyTemplates] || technologyTemplates['English']
    }

    // Fallback générique selon la langue
    const fallbackTemplates = {
      'French': [
        { text: 'Meilleures solutions dans ce secteur ?', category: 'general', priority: 1 },
        { text: 'Comparaison des fournisseurs de services ?', category: 'comparison', priority: 2 },
        { text: 'Entreprises les mieux notées ?', category: 'rating', priority: 2 }
      ],
      'English': [
        { text: 'Best solutions in this industry?', category: 'general', priority: 1 },
        { text: 'Compare service providers?', category: 'comparison', priority: 2 },
        { text: 'Top rated companies?', category: 'rating', priority: 2 }
      ]
    }

    return fallbackTemplates[language as keyof typeof fallbackTemplates] || fallbackTemplates['English']
  }

  // Générer des questions spécifiques à la marque avec localisation
  private generateBrandSpecificQuestions(
    brandName: string, 
    industry: string, 
    domain: string,
    country: string = 'United States',
    language: string = 'English'
  ): Omit<QuestionSuggestion, 'id' | 'searchVolume' | 'isSelected'>[] {
    const questions = []
    
    // Questions directes sur la marque selon la langue
    if (language === 'French') {
      questions.push(
        { text: `Avis et notes sur ${brandName} ?`, category: 'brand_direct', priority: 1 },
        { text: `${brandName} vs concurrents - comparaison ?`, category: 'brand_comparison', priority: 1 },
        { text: `Prix et tarifs ${brandName} ?`, category: 'brand_pricing', priority: 2 },
        { text: `Qualité du service client ${brandName} ?`, category: 'brand_support', priority: 2 },
        { text: `${brandName} vaut-il la peine ?`, category: 'brand_value', priority: 1 }
      )
    } else {
      questions.push(
        { text: `${brandName} reviews and ratings?`, category: 'brand_direct', priority: 1 },
        { text: `${brandName} vs competitors comparison?`, category: 'brand_comparison', priority: 1 },
        { text: `${brandName} pricing and plans?`, category: 'brand_pricing', priority: 2 },
        { text: `${brandName} customer support quality?`, category: 'brand_support', priority: 2 },
        { text: `Is ${brandName} worth it?`, category: 'brand_value', priority: 1 }
      )
    }

    // Questions contextuelles selon le domaine, pays et langue
    if (domain.includes('wine') || domain.includes('vino') || industry === 'Food & Beverage') {
      if (country === 'Morocco') {
        if (language === 'French') {
          questions.push(
            { text: `Où acheter du vin ${brandName} au Maroc ?`, category: 'brand_location', priority: 1 },
            { text: `${brandName} livre-t-il au Maroc ?`, category: 'brand_service', priority: 2 },
            { text: `Qualité de la sélection ${brandName} ?`, category: 'brand_quality', priority: 2 },
            { text: `${brandName} Casablanca vs Rabat - disponibilité ?`, category: 'brand_location', priority: 2 }
          )
        } else {
          questions.push(
            { text: `Where to buy ${brandName} wine in Morocco?`, category: 'brand_location', priority: 1 },
            { text: `Does ${brandName} deliver to Morocco?`, category: 'brand_service', priority: 2 },
            { text: `${brandName} wine selection quality?`, category: 'brand_quality', priority: 2 }
          )
        }
      } else if (country === 'France') {
        if (language === 'French') {
          questions.push(
            { text: `Où acheter du vin ${brandName} en France ?`, category: 'brand_location', priority: 1 },
            { text: `${brandName} - livraison en France ?`, category: 'brand_service', priority: 2 },
            { text: `Sélection ${brandName} - vins français vs importés ?`, category: 'brand_quality', priority: 2 }
          )
        }
      } else {
        // Pays par défaut
        const locationText = language === 'French' 
          ? `Où acheter du vin ${brandName} ?`
          : `Where to buy ${brandName} wine?`
        const deliveryText = language === 'French'
          ? `Options de livraison ${brandName} ?`
          : `${brandName} wine delivery options?`
          
        questions.push(
          { text: locationText, category: 'brand_location', priority: 1 },
          { text: deliveryText, category: 'brand_service', priority: 2 }
        )
      }
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