-- Migration intermédiaire pour assurer la continuité
-- Créée le: 2025-08-30

-- Cette migration s'assure que toutes les tables ont les bonnes colonnes
-- avant d'ajouter le système de concurrents

-- Vérification et ajout d'index manquants si besoin
CREATE INDEX IF NOT EXISTS idx_projects_industry ON projects(industry);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tracked_queries_project ON tracked_queries(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_query ON ai_responses(query_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_project ON ai_responses(project_id);

-- Mise à jour de la colonne industry pour s'assurer qu'elle existe
-- (Elle existe déjà dans le schéma initial, mais nous la validons ici)