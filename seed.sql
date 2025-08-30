-- AIREACH Seed Data
-- Données initiales pour démonstration et développement

-- Insertion des plateformes IA
INSERT OR IGNORE INTO ai_platforms (name, display_name, api_endpoint, is_active) VALUES 
  ('chatgpt', 'ChatGPT', 'https://api.openai.com/v1', TRUE),
  ('gemini', 'Google Gemini', 'https://generativelanguage.googleapis.com/v1', TRUE),
  ('claude', 'Anthropic Claude', 'https://api.anthropic.com/v1', TRUE),
  ('perplexity', 'Perplexity AI', 'https://api.perplexity.ai', TRUE),
  ('llama', 'Meta Llama', 'https://api.together.xyz/v1', TRUE),
  ('deepseek', 'DeepSeek', 'https://api.deepseek.com/v1', TRUE),
  ('mistral', 'Mistral AI', 'https://api.mistral.ai/v1', TRUE),
  ('cohere', 'Cohere', 'https://api.cohere.ai/v1', TRUE);

-- Projets de démonstration
INSERT OR IGNORE INTO projects (name, brand_name, description, industry, website_url, status) VALUES 
  ('Tech Startup Monitor', 'TechFlow', 'Surveillance de la présence de notre startup dans les réponses IA', 'Technology', 'https://techflow.com', 'active'),
  ('Fashion Brand Analysis', 'StyleCorp', 'Analyse de la visibilité de notre marque de mode', 'Fashion', 'https://stylecorp.com', 'active'),
  ('Healthcare Watch', 'MedTech Solutions', 'Suivi de notre réputation dans le secteur médical', 'Healthcare', 'https://medtechsolutions.com', 'paused');

-- Questions types pour chaque projet
INSERT OR IGNORE INTO tracked_queries (project_id, query_text, query_type, priority) VALUES 
  -- TechFlow queries
  (1, 'Quelles sont les meilleures solutions de workflow pour les équipes tech ?', 'product_info', 1),
  (1, 'Comparaison entre TechFlow et les autres outils de gestion de projets', 'competitor_comparison', 2),
  (1, 'TechFlow avis utilisateurs et retours d''expérience', 'brand_mention', 1),
  (1, 'Outils de productivité pour développeurs recommandés en 2024', 'product_info', 2),
  
  -- StyleCorp queries  
  (2, 'Meilleures marques de mode durable et éthique', 'brand_mention', 1),
  (2, 'StyleCorp nouvelle collection printemps 2024', 'product_info', 1),
  (2, 'Comparaison qualité prix mode française vs internationale', 'competitor_comparison', 2),
  (2, 'Tendances mode femme 2024 marques émergentes', 'brand_mention', 2),
  
  -- MedTech queries
  (3, 'Solutions logicielles pour hôpitaux et cliniques', 'product_info', 1),
  (3, 'MedTech Solutions certification et conformité RGPD', 'brand_mention', 1),
  (3, 'Comparatif systèmes de gestion hospitalière', 'competitor_comparison', 2);

-- Concurrents suivis
INSERT OR IGNORE INTO competitors (project_id, competitor_name, competitor_domain) VALUES 
  (1, 'Asana', 'asana.com'),
  (1, 'Monday.com', 'monday.com'),
  (1, 'Notion', 'notion.so'),
  (1, 'Linear', 'linear.app'),
  (2, 'Zara', 'zara.com'),
  (2, 'H&M', 'hm.com'),  
  (2, 'Uniqlo', 'uniqlo.com'),
  (3, 'Epic Systems', 'epic.com'),
  (3, 'Cerner', 'cerner.com');

-- Exemples de réponses IA (données simulées pour démonstration)
INSERT OR IGNORE INTO ai_responses (query_id, platform_id, project_id, response_text, brand_mentions_count, brand_position, sentiment_score, accuracy_score, response_length, collected_at) VALUES 
  -- TechFlow mentions
  (1, 1, 1, 'Pour les équipes tech, plusieurs solutions se démarquent : TechFlow pour sa simplicité, Asana pour sa flexibilité, et Monday.com pour ses visualisations. TechFlow est particulièrement apprécié pour son interface intuitive et ses fonctionnalités de collaboration en temps réel.', 2, 1, 0.7, 0.9, 245, datetime('now', '-2 days')),
  (1, 2, 1, 'Les meilleures solutions incluent Notion, TechFlow, Linear et Asana. TechFlow se distingue par sa rapidité d''exécution et son support client réactif, ce qui en fait un choix populaire parmi les startups technologiques.', 1, 2, 0.8, 0.85, 198, datetime('now', '-2 days')),
  (1, 3, 1, 'Recommandations pour les workflows tech : 1) Linear pour les équipes produit, 2) TechFlow pour les équipes agiles, 3) Notion pour la documentation. TechFlow excelle dans la gestion des sprints et l''intégration avec les outils de développement.', 2, 2, 0.6, 0.9, 210, datetime('now', '-1 day')),
  
  -- StyleCorp mentions
  (5, 1, 2, 'Les marques de mode durable recommandées incluent Patagonia, Eileen Fisher, et StyleCorp. StyleCorp se démarque particulièrement par ses collections éthiques et sa transparence sur sa chaîne d''approvisionnement.', 1, 3, 0.8, 0.85, 167, datetime('now', '-3 days')),
  (5, 2, 2, 'Pour la mode éthique, considérez : Reformation, StyleCorp, et Everlane. StyleCorp propose des pièces intemporelles fabriquées en France avec des matériaux recyclés, alignant style et responsabilité environnementale.', 1, 2, 0.9, 0.9, 189, datetime('now', '-1 day')),
  
  -- MedTech mentions
  (10, 1, 3, 'Les solutions hospitalières leaders incluent Epic Systems, Cerner, et MedTech Solutions. MedTech Solutions est apprécié pour sa conformité RGPD stricte et ses modules personnalisables adaptés aux hôpitaux européens.', 1, 3, 0.7, 0.8, 203, datetime('now', '-4 days')),
  (10, 4, 3, 'Pour les systèmes de gestion hospitalière : Epic domine le marché américain, Cerner reste solide, et MedTech Solutions gagne du terrain en Europe grâce à sa spécialisation dans les réglementations locales.', 1, 3, 0.6, 0.85, 178, datetime('now', '-2 days'));

-- Métriques agrégées (derniers 7 jours)
INSERT OR IGNORE INTO metrics_summary (project_id, platform_id, period_start, period_end, period_type, total_mentions, average_position, average_sentiment, average_accuracy, visibility_score, trend_direction) VALUES 
  (1, 1, date('now', '-7 days'), date('now'), 'weekly', 15, 2.1, 0.75, 0.88, 0.82, 'up'),
  (1, 2, date('now', '-7 days'), date('now'), 'weekly', 12, 1.8, 0.8, 0.85, 0.85, 'up'),
  (1, 3, date('now', '-7 days'), date('now'), 'weekly', 9, 2.3, 0.7, 0.9, 0.78, 'stable'),
  (2, 1, date('now', '-7 days'), date('now'), 'weekly', 8, 2.5, 0.85, 0.87, 0.73, 'up'),
  (2, 2, date('now', '-7 days'), date('now'), 'weekly', 6, 2.0, 0.9, 0.9, 0.8, 'stable'),
  (3, 1, date('now', '-7 days'), date('now'), 'weekly', 4, 3.0, 0.65, 0.8, 0.65, 'down');

-- Alertes récentes
INSERT OR IGNORE INTO alerts (project_id, alert_type, title, description, severity, is_read, triggered_at) VALUES 
  (1, 'mention_spike', 'Pic de mentions détecté', 'TechFlow a été mentionné 40% plus souvent cette semaine sur ChatGPT', 'medium', FALSE, datetime('now', '-1 day')),
  (2, 'position_drop', 'Baisse de position moyenne', 'StyleCorp est passé de la position 2.0 à 2.5 sur Gemini', 'medium', FALSE, datetime('now', '-2 days')),
  (3, 'sentiment_change', 'Changement de sentiment', 'Le sentiment global pour MedTech Solutions a baissé de 0.8 à 0.65', 'high', FALSE, datetime('now', '-3 days')),
  (1, 'new_trend', 'Nouvelle tendance émergente', 'Questions sur "workflow automation" en hausse de 25%', 'low', TRUE, datetime('now', '-4 days'));

-- Recommandations d'optimisation
INSERT OR IGNORE INTO optimization_recommendations (project_id, recommendation_type, title, description, priority, estimated_impact, status) VALUES 
  (1, 'content_gap', 'Créer du contenu sur l''intégration Git', 'Les questions sur l''intégration avec Git sont fréquentes mais TechFlow n''apparaît pas souvent dans les réponses', 1, 'high', 'pending'),
  (1, 'keyword_optimization', 'Optimiser pour "workflow automation"', 'Terme en forte croissance, opportunité d''améliorer la visibilité', 2, 'medium', 'pending'),
  (2, 'competitor_opportunity', 'Différenciation vs fast fashion', 'Opportunité de se positionner contre H&M et Zara sur la durabilité', 1, 'high', 'in_progress'),
  (3, 'platform_focus', 'Concentrer efforts sur ChatGPT', 'Performance plus faible sur ChatGPT, potentiel d''amélioration important', 1, 'medium', 'pending');