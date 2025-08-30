-- Migration pour le système de concurrents
-- Créée le: 2025-08-30

-- Table des concurrents identifiés
CREATE TABLE IF NOT EXISTS competitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  description TEXT,
  confidence_score REAL DEFAULT 0.0, -- Score de confiance de l'identification (0-1)
  identification_method TEXT, -- 'domain_analysis', 'industry_match', 'keyword_search', 'api_search'
  brand_score REAL DEFAULT 0.0,
  avg_position REAL DEFAULT 0.0,
  share_of_voice REAL DEFAULT 0.0,
  total_mentions INTEGER DEFAULT 0,
  trend TEXT DEFAULT 'stable', -- 'up', 'down', 'stable'
  position_trend INTEGER DEFAULT 0, -- -1 (improving), 0 (stable), 1 (declining)
  market_strength TEXT, -- 'leader', 'challenger', 'follower', 'niche'
  key_strength TEXT, -- Force principale du concurrent
  threat_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'monitoring'
  identified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des métriques concurrentielles historiques
CREATE TABLE IF NOT EXISTS competitor_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  competitor_id INTEGER NOT NULL,
  metric_date DATE NOT NULL,
  brand_score REAL DEFAULT 0.0,
  avg_position REAL DEFAULT 0.0,
  share_of_voice REAL DEFAULT 0.0,
  total_mentions INTEGER DEFAULT 0,
  sentiment_score REAL DEFAULT 0.0,
  visibility_score REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE
);

-- Table des insights concurrentiels
CREATE TABLE IF NOT EXISTS competitive_insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  insight_type TEXT NOT NULL, -- 'opportunity', 'threat', 'trend', 'gap'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  confidence_score REAL DEFAULT 0.0,
  related_competitor_id INTEGER,
  action_recommended TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'acted_upon', 'dismissed'
  priority INTEGER DEFAULT 3, -- 1 (high) to 5 (low)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (related_competitor_id) REFERENCES competitors(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances (seuls les index essentiels)
CREATE INDEX IF NOT EXISTS idx_competitors_project_id ON competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_competitive_insights_project ON competitive_insights(project_id);

-- Note: Vues complexes seront ajoutées dans une migration ultérieure
-- après validation du schéma de base