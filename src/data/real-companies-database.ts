// Base de données de vraies entreprises pour identification de concurrents réalistes
// Basée sur de vraies entreprises avec leurs vraies données

export interface RealCompany {
  name: string;
  domain: string;
  description: string;
  industry: string;
  subIndustry?: string;
  founded?: string;
  location: string;
  employees?: number;
  revenue?: string;
  valuation?: string;
  isPublic: boolean;
  stockSymbol?: string;
  keyStrengths: string[];
  knownFor: string;
}

export const REAL_COMPANIES_DATABASE: Record<string, RealCompany[]> = {
  'Wine': [
    {
      name: 'LVMH',
      domain: 'lvmh.com',
      description: 'Groupe de luxe français leader mondial',
      industry: 'Wine',
      subIndustry: 'Champagne & Vins',
      founded: '1987',
      location: 'Paris, France',
      employees: 200000,
      revenue: '79.2B EUR',
      isPublic: true,
      stockSymbol: 'MC.PA',
      keyStrengths: ['Portfolio Premium', 'Distribution Mondiale', 'Innovation Luxe'],
      knownFor: 'Dom Pérignon, Moët & Chandon, Krug, Hennessy'
    },
    {
      name: 'Pernod Ricard',
      domain: 'pernod-ricard.com', 
      description: 'Leader mondial des vins et spiritueux premium',
      industry: 'Wine',
      subIndustry: 'Vins & Spiritueux',
      founded: '1975',
      location: 'Paris, France',
      employees: 19000,
      revenue: '12.1B EUR',
      isPublic: true,
      stockSymbol: 'RI.PA',
      keyStrengths: ['Marques Internationales', 'Innovation Produits', 'Distribution'],
      knownFor: 'Absolut, Chivas, Jameson, Perrier-Jouët'
    },
    {
      name: 'Treasury Wine Estates',
      domain: 'treasurywine.com',
      description: 'Leader mondial des vins premium',
      industry: 'Wine',
      founded: '2011',
      location: 'Melbourne, Australie',
      employees: 3500,
      revenue: '2.8B AUD',
      isPublic: true,
      stockSymbol: 'TWE.AX',
      keyStrengths: ['Vins Australiens', 'Expansion Asie', 'Innovation Durable'],
      knownFor: 'Penfolds, Wolf Blass, Beringer, Castello di Gabbiano'
    },
    {
      name: 'Constellation Brands',
      domain: 'cbrands.com',
      description: 'Leader américain bières, vins et spiritueux',
      industry: 'Wine', 
      founded: '1945',
      location: 'Victor, NY, USA',
      employees: 9000,
      revenue: '9.3B USD',
      isPublic: true,
      stockSymbol: 'STZ',
      keyStrengths: ['Portfolio Diversifié', 'Marché US', 'Innovation Cannabis'],
      knownFor: 'Corona, Modelo, Robert Mondavi, Kim Crawford'
    },
    {
      name: 'E. & J. Gallo Winery',
      domain: 'gallo.com',
      description: 'Plus grand producteur de vin familial au monde',
      industry: 'Wine',
      founded: '1933',
      location: 'Modesto, CA, USA',
      employees: 6000,
      revenue: '6.2B USD',
      isPublic: false,
      keyStrengths: ['Production Massive', 'Distribution US', 'Innovation Technique'],
      knownFor: 'Barefoot, Apothic, La Marca, Louis M. Martini'
    }
  ],

  'Technology': [
    {
      name: 'Salesforce',
      domain: 'salesforce.com',
      description: 'Leader mondial CRM et cloud computing',
      industry: 'Technology',
      subIndustry: 'CRM Software',
      founded: '1999',
      location: 'San Francisco, CA, USA',
      employees: 73000,
      revenue: '31.4B USD',
      isPublic: true,
      stockSymbol: 'CRM',
      keyStrengths: ['CRM Leadership', 'Cloud Platform', 'IA Einstein'],
      knownFor: 'Sales Cloud, Service Cloud, Marketing Cloud, Tableau'
    },
    {
      name: 'HubSpot',
      domain: 'hubspot.com',
      description: 'Plateforme CRM et inbound marketing',
      industry: 'Technology',
      subIndustry: 'Marketing Automation',
      founded: '2006',
      location: 'Cambridge, MA, USA',
      employees: 7600,
      revenue: '1.7B USD',
      isPublic: true,
      stockSymbol: 'HUBS',
      keyStrengths: ['Inbound Marketing', 'UX Simple', 'Freemium Model'],
      knownFor: 'HubSpot CRM, Marketing Hub, Sales Hub, Service Hub'
    },
    {
      name: 'Zendesk',
      domain: 'zendesk.com',
      description: 'Plateforme de service client cloud',
      industry: 'Technology',
      subIndustry: 'Customer Service',
      founded: '2007', 
      location: 'San Francisco, CA, USA',
      employees: 6000,
      revenue: '1.7B USD',
      isPublic: true,
      stockSymbol: 'ZEN',
      keyStrengths: ['Support Client', 'Simplicité', 'Intégrations'],
      knownFor: 'Support Suite, Guide, Explore, Chat'
    },
    {
      name: 'Monday.com',
      domain: 'monday.com',
      description: 'Plateforme de gestion de travail cloud',
      industry: 'Technology',
      subIndustry: 'Project Management',
      founded: '2012',
      location: 'Tel Aviv, Israël',
      employees: 2000,
      revenue: '736M USD',
      isPublic: true,
      stockSymbol: 'MNDY',
      keyStrengths: ['Interface Visuelle', 'Personnalisation', 'Collaboration'],
      knownFor: 'Work OS, monday dev, monday sales, monday marketer'
    }
  ],

  'Fashion': [
    {
      name: 'Zara (Inditex)',
      domain: 'zara.com',
      description: 'Leader mondial fast fashion',
      industry: 'Fashion',
      subIndustry: 'Fast Fashion',
      founded: '1975',
      location: 'La Corogne, Espagne',
      employees: 174000,
      revenue: '32.6B EUR',
      isPublic: true,
      stockSymbol: 'ITX.MC',
      keyStrengths: ['Fast Fashion', 'Supply Chain', 'Design Tendances'],
      knownFor: 'Zara, Pull&Bear, Bershka, Stradivarius, Massimo Dutti'
    },
    {
      name: 'H&M',
      domain: 'hm.com',
      description: 'Géant suédois mode accessible',
      industry: 'Fashion',
      founded: '1947',
      location: 'Stockholm, Suède',
      employees: 120000,
      revenue: '23.2B USD',
      isPublic: true,
      stockSymbol: 'HM-B.ST',
      keyStrengths: ['Prix Accessibles', 'Durabilité', 'Collaborations'],
      knownFor: 'H&M, COS, & Other Stories, Arket, Weekday'
    },
    {
      name: 'Nike',
      domain: 'nike.com',
      description: 'Leader mondial équipement sportif',
      industry: 'Fashion',
      subIndustry: 'Sportswear',
      founded: '1964',
      location: 'Beaverton, OR, USA',
      employees: 83700,
      revenue: '51.2B USD',
      isPublic: true,
      stockSymbol: 'NKE',
      keyStrengths: ['Innovation Produit', 'Marketing Sport', 'Digital'],
      knownFor: 'Air Jordan, Air Max, React, VaporMax, Dri-FIT'
    },
    {
      name: 'Shein',
      domain: 'shein.com',
      description: 'Géant chinois e-commerce mode ultra-rapide',
      industry: 'Fashion',
      subIndustry: 'Ultra Fast Fashion',
      founded: '2008',
      location: 'Singapour',
      employees: 10000,
      revenue: '24B USD',
      isPublic: false,
      valuation: '100B USD',
      keyStrengths: ['Prix Ultra-Bas', 'Tendances Virales', 'Social Commerce'],
      knownFor: 'Mode jetable, influenceurs, Gen Z, marketplace'
    }
  ],

  'Automotive': [
    {
      name: 'Tesla',
      domain: 'tesla.com',
      description: 'Leader véhicules électriques et énergies propres',
      industry: 'Automotive',
      subIndustry: 'Electric Vehicles',
      founded: '2003',
      location: 'Austin, TX, USA',
      employees: 140000,
      revenue: '96.8B USD',
      isPublic: true,
      stockSymbol: 'TSLA',
      keyStrengths: ['Innovation EV', 'Autopilot', 'Supercharger Network'],
      knownFor: 'Model S/3/X/Y, Cybertruck, Solar, Energy Storage'
    },
    {
      name: 'BYD',
      domain: 'byd.com',
      description: 'Leader chinois véhicules électriques et batteries',
      industry: 'Automotive',
      subIndustry: 'Electric Vehicles',
      founded: '1995',
      location: 'Shenzhen, Chine',
      employees: 290000,
      revenue: '70.2B USD',
      isPublic: true,
      stockSymbol: '1211.HK',
      keyStrengths: ['Batteries LFP', 'Intégration Verticale', 'Marché Chinois'],
      knownFor: 'Dynasty series, Ocean series, Blade Battery'
    },
    {
      name: 'Rivian',
      domain: 'rivian.com',
      description: 'Startup américaine véhicules électriques aventure',
      industry: 'Automotive',
      subIndustry: 'Electric Trucks',
      founded: '2009',
      location: 'Irvine, CA, USA',
      employees: 17000,
      revenue: '4.4B USD',
      isPublic: true,
      stockSymbol: 'RIVN',
      keyStrengths: ['Pickups Électriques', 'Aventure', 'Amazon Partnership'],
      knownFor: 'R1T pickup, R1S SUV, Amazon delivery vans'
    },
    {
      name: 'Lucid Motors',
      domain: 'lucidmotors.com',
      description: 'Constructeur américain berlines électriques luxe',
      industry: 'Automotive',
      subIndustry: 'Luxury Electric Cars',
      founded: '2007',
      location: 'Newark, CA, USA',
      employees: 5000,
      revenue: '608M USD',
      isPublic: true,
      stockSymbol: 'LCID',
      keyStrengths: ['Luxe Électrique', 'Autonomie Record', 'Technologie'],
      knownFor: 'Lucid Air Dream, Glass Roof, 500+ mile range'
    }
  ],

  'Healthcare': [
    {
      name: 'Teladoc Health',
      domain: 'teladochealth.com',
      description: 'Leader mondial télémédecine et santé virtuelle',
      industry: 'Healthcare',
      subIndustry: 'Telemedicine',
      founded: '2002',
      location: 'Purchase, NY, USA',
      employees: 13000,
      revenue: '2.4B USD',
      isPublic: true,
      stockSymbol: 'TDOC',
      keyStrengths: ['Téléconsultation', 'IA Santé', 'Réseau Global'],
      knownFor: 'Teladoc, Livongo, myStrength, BetterHelp'
    },
    {
      name: 'Veracyte',
      domain: 'veracyte.com',
      description: 'Tests diagnostiques génomiques précision',
      industry: 'Healthcare',
      subIndustry: 'Genomic Diagnostics',
      founded: '2008',
      location: 'South San Francisco, CA, USA',
      employees: 800,
      revenue: '220M USD',
      isPublic: true,
      stockSymbol: 'VCYT',
      keyStrengths: ['Génomique', 'Diagnostic Précision', 'Cancer'],
      knownFor: 'Afirma, Percepta, Envisia, Prosigna, LymphMark'
    }
  ],

  'Food & Beverage': [
    {
      name: 'Beyond Meat',
      domain: 'beyondmeat.com',
      description: 'Leader alternatives végétales à la viande',
      industry: 'Food & Beverage',
      subIndustry: 'Plant-Based Foods',
      founded: '2009',
      location: 'El Segundo, CA, USA',
      employees: 2000,
      revenue: '406M USD',
      isPublic: true,
      stockSymbol: 'BYND',
      keyStrengths: ['Innovation Végétale', 'Goût Viande', 'Durabilité'],
      knownFor: 'Beyond Burger, Beyond Sausage, Beyond Chicken'
    },
    {
      name: 'Oatly',
      domain: 'oatly.com',
      description: 'Leader mondial boissons avoine durables',
      industry: 'Food & Beverage',
      subIndustry: 'Plant-Based Beverages',
      founded: '1994',
      location: 'Malmö, Suède',
      employees: 2000,
      revenue: '722M USD',
      isPublic: true,
      stockSymbol: 'OTLY',
      keyStrengths: ['Boissons Avoine', 'Durabilité', 'Marketing Créatif'],
      knownFor: 'Oat Milk, Barista Edition, Ice Cream, Yogurt'
    }
  ]
};

// Fonction utilitaire pour rechercher des entreprises par industrie
export function getCompaniesByIndustry(industry: string, limit: number = 10): RealCompany[] {
  const companies = REAL_COMPANIES_DATABASE[industry] || [];
  return companies.slice(0, limit);
}

// Fonction pour rechercher des entreprises similaires
export function findSimilarCompanies(
  targetCompany: string, 
  targetIndustry: string, 
  limit: number = 5
): RealCompany[] {
  const allCompanies: RealCompany[] = [];
  
  // Collecter toutes les entreprises
  Object.values(REAL_COMPANIES_DATABASE).forEach(industryCompanies => {
    allCompanies.push(...industryCompanies);
  });
  
  // Filtrer par industrie et exclure l'entreprise cible
  return allCompanies
    .filter(company => 
      company.industry === targetIndustry && 
      company.name.toLowerCase() !== targetCompany.toLowerCase()
    )
    .slice(0, limit);
}