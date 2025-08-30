-- AIREACH Database Schema
-- Tables pour la surveillance et l'analyse des marques dans les IA

-- Table des projets (marques surveillées)
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  website_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des plateformes IA surveillées
CREATE TABLE IF NOT EXISTS ai_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des questions/prompts suivis
CREATE TABLE IF NOT EXISTS tracked_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  query_text TEXT NOT NULL,
  query_type TEXT DEFAULT 'brand_mention' CHECK (query_type IN ('brand_mention', 'competitor_comparison', 'product_info', 'custom')),
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des réponses collectées des IA
CREATE TABLE IF NOT EXISTS ai_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  response_text TEXT NOT NULL,
  brand_mentions_count INTEGER DEFAULT 0,
  brand_position INTEGER, -- Position de la marque dans la réponse (1=première, etc.)
  sentiment_score REAL, -- Score de sentiment (-1 à 1)
  accuracy_score REAL, -- Score d'exactitude (0 à 1)
  response_length INTEGER,
  collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (query_id) REFERENCES tracked_queries(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES ai_platforms(id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des métriques agrégées par période
CREATE TABLE IF NOT EXISTS metrics_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  platform_id INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  total_mentions INTEGER DEFAULT 0,
  average_position REAL,
  average_sentiment REAL,
  average_accuracy REAL,
  visibility_score REAL, -- Score calculé de visibilité globale
  trend_direction TEXT DEFAULT 'stable' CHECK (trend_direction IN ('up', 'down', 'stable')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES ai_platforms(id)
);

-- Table des concurrents suivis
CREATE TABLE IF NOT EXISTS competitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  competitor_name TEXT NOT NULL,
  competitor_domain TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des alertes et notifications
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('position_drop', 'mention_spike', 'sentiment_change', 'new_trend', 'competitor_activity')),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des recommandations d'optimisation
CREATE TABLE IF NOT EXISTS optimization_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('content_gap', 'keyword_optimization', 'competitor_opportunity', 'platform_focus')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  estimated_impact TEXT DEFAULT 'medium' CHECK (estimated_impact IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_ai_responses_project_platform ON ai_responses(project_id, platform_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_collected_at ON ai_responses(collected_at);
CREATE INDEX IF NOT EXISTS idx_metrics_summary_project_period ON metrics_summary(project_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_alerts_project_read ON alerts(project_id, is_read);
CREATE INDEX IF NOT EXISTS idx_tracked_queries_project_active ON tracked_queries(project_id, is_active);

-- Vues pour faciliter les requêtes fréquentes
CREATE VIEW IF NOT EXISTS project_overview AS
SELECT 
  p.id,
  p.name,
  p.brand_name,
  p.status,
  COUNT(DISTINCT tq.id) as total_queries,
  COUNT(DISTINCT ar.id) as total_responses,
  AVG(ar.brand_position) as avg_position,
  AVG(ar.sentiment_score) as avg_sentiment,
  p.created_at
FROM projects p
LEFT JOIN tracked_queries tq ON p.id = tq.project_id AND tq.is_active = TRUE
LEFT JOIN ai_responses ar ON p.id = ar.project_id AND ar.collected_at > datetime('now', '-30 days')
GROUP BY p.id, p.name, p.brand_name, p.status, p.created_at;

CREATE VIEW IF NOT EXISTS recent_performance AS
SELECT 
  p.name as project_name,
  ap.display_name as platform_name,
  COUNT(ar.id) as mention_count,
  AVG(ar.brand_position) as avg_position,
  AVG(ar.sentiment_score) as avg_sentiment,
  DATE(ar.collected_at) as date
FROM projects p
JOIN ai_responses ar ON p.id = ar.project_id
JOIN ai_platforms ap ON ar.platform_id = ap.id
WHERE ar.collected_at > datetime('now', '-7 days')
GROUP BY p.id, ap.id, DATE(ar.collected_at)
ORDER BY ar.collected_at DESC;