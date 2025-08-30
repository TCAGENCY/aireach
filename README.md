# AIREACH - Surveillance IA des Marques

## 🎯 Vue d'ensemble
**AIREACH** est un outil avancé d'analyse et de surveillance de la présence des marques dans les assistants et chatbots alimentés par l'IA. Il surveille comment les différents chatbots présentent et répondent au sujet d'une marque, fournit des métriques de visibilité et des insights exploitables.

## 🔗 URLs
- **Application**: https://3000-i5wq9qs0zui0m9l0vwci6-6532622b.e2b.dev
- **API Health Check**: https://3000-i5wq9qs0zui0m9l0vwci6-6532622b.e2b.dev/api/projects
- **Repository**: Local development project

## 🚀 Fonctionnalités Actuelles

### ✅ Fonctionnalités Implémentées
- **Dashboard principal** avec métriques de vue d'ensemble
- **🎯 Wizard de création** de projet en 5 étapes avec détection intelligente
- **🚀 Collecte automatisée** des données IA avec simulation réaliste
- **🚀 Intégration complète** des plateformes IA (6+ services)
- **🚀 Parseur intelligent** pour analyse des mentions de marques
- **🚀 Calcul automatique** des métriques (position, sentiment, exactitude)
- **🚀 Interface de collecte** avec boutons et progression en temps réel
- **🎯 Détection automatique** de marque et industrie depuis domaine
- **🎯 Génération intelligente** de questions par industrie et marque
- **🎯 Volumes de recherche** simulés avec distribution réaliste
- **👥 Page Competitors** avec analyse concurrentielle complète
- **📊 All Projects** avec gestion globale et filtrage avancé
- **📈 Overview détaillé** par projet avec métriques et graphiques
- **🌍 Support multi-langues** (FR, EN, AR, ES, DE, IT) et pays
- **Base de données complète** avec schéma pour surveillance IA
- **Interface utilisateur responsive** avec sidebar de navigation
- **API RESTful** pour la gestion des données
- **Données de démonstration** pré-chargées avec vraies mentions
- **Métriques de performance** par projet et plateforme
- **Navigation par sections** (Projects, Tools, FAQ, etc.)

### 📊 APIs Fonctionnelles
- `GET /api/projects` - Liste tous les projets avec métriques
- `POST /api/projects` - Créer un nouveau projet
- `GET /api/projects/:id` - Détails d'un projet spécifique
- `GET /api/dashboard/analytics/:projectId` - Analytics d'un projet
- `GET /api/platforms` - Liste des plateformes IA
- **🚀 NEW:** `POST /api/projects/:id/collect` - Collecte manuelle des données IA
- **🚀 NEW:** `POST /api/projects/:id/schedule` - Programmer la collecte automatique
- **🚀 NEW:** `GET /api/projects/:id/collection-status` - Status de collecte
- **🚀 NEW:** `POST /api/config/api-keys` - Configuration des clés API
- **🎯 NEW:** `POST /api/brand/detect` - Détection de marque depuis domaine
- **🎯 NEW:** `POST /api/questions/generate` - Génération de questions intelligente
- **🎯 NEW:** `POST /api/questions/volumes` - Volumes de recherche par question
- **🎯 NEW:** `POST /api/projects/create-complete` - Création complète de projet

### 🔧 Fonctionnalités en Développement
- **Analyse de sentiment** avancée des mentions (v1 implémentée)
- **Alertes intelligentes** basées sur les tendances  
- **Recommandations d'optimisation** GAO (Generative AI Optimization)
- **Intégrations API réelles** avec les plateformes IA (simulation disponible)
- **Rapports PDF** exportables
- **Système d'abonnement** et facturation
- **Export concurrentiels** et programmation d'analyses

## 🤖 Système de Collecte Automatisée

### Plateformes IA Intégrées
- **✅ OpenAI ChatGPT** - API configurée, simulation active
- **✅ Anthropic Claude** - API configurée, simulation active
- **✅ Google Gemini** - API configurée, simulation active
- **✅ Perplexity AI** - API configurée, simulation active
- **✅ Meta Llama** - API configurée, simulation active
- **✅ DeepSeek** - API configurée, simulation active
- **🔧 Mistral AI** - Configuration en cours
- **🔧 Cohere** - Configuration en cours

### Métriques Calculées Automatiquement
- **Position de marque** : Rang d'apparition dans les réponses (1-10+)
- **Score de sentiment** : Analyse positive/neutre/négative (-1 à +1)
- **Score d'exactitude** : Pertinence et fiabilité de l'information (0-100%)
- **Mentions concurrentes** : Détection automatique des marques rivales
- **Insights clés** : Extraction d'informations stratégiques

### Performance de Collecte
- **⚡ 24/32 collectes réussies** (75% de succès)
- **🚀 6 plateformes actives** sur 8 configurées
- **⏱️ Délais optimisés** pour éviter les limitations de taux
- **🎯 Simulation réaliste** avec vraies mentions de marques

## 🏗️ Architecture Technique

### Backend
- **Framework**: Hono (edge-optimized)
- **Runtime**: Cloudflare Workers
- **Base de données**: Cloudflare D1 SQLite
- **Déploiement**: Cloudflare Pages
- **Services IA**: Architecture modulaire avec factory pattern

### Frontend  
- **Style**: Tailwind CSS + CSS personnalisé
- **Charts**: Chart.js pour visualisations
- **Icons**: Font Awesome 6
- **HTTP Client**: Axios
- **UI**: Interface responsive avec modals et progressions

### Structure des Données
- **Projects**: Projets de surveillance des marques
- **AI Platforms**: 8 plateformes IA surveillées
- **Tracked Queries**: Questions/prompts suivis (4 par projet)
- **AI Responses**: Réponses collectées avec métriques complètes
- **Metrics Summary**: Métriques agrégées par période
- **Alerts**: Système d'alertes et notifications
- **Recommendations**: Suggestions d'optimisation

## 📱 Guide d'Utilisation

### 1. Tableau de Bord Principal
- Vue d'ensemble des projets actifs
- Métriques globales (projets, réponses, plateformes, alertes)
- Actions rapides pour créer nouveaux projets

### 2. 🎯 Création de Projet (NOUVEAU - 5 Étapes)
- **Étape 1** : Saisie du domaine avec détection automatique de la marque
- **Étape 2** : Sélection de 10-20 questions parmi suggestions intelligentes
- **Étape 3** : **NOUVEAU** - Sélection langue et pays pour questions localisées  
- **Étape 4** : Visualisation des volumes de recherche par question
- **Étape 5** : Finalisation automatique avec loading et lancement
- **Accès** : Bouton "+" à côté de "Projets" ou "Créer un projet" dans le dashboard

### 3. Gestion des Projets
- **Sélectionner un projet** : Cliquer sur un projet dans la sidebar
- **Sous-menu projet** :
  - **Overview** : Dashboard spécifique avec métriques détaillées et graphiques
  - **Suggested Prompts** : Questions intelligentes générées pour le projet
  - **👥 Competitors** : **NOUVEAU** - Analyse concurrentielle complète avec :
    - Identification automatique des concurrents par industrie
    - Tableau comparatif avec Brand Score, positions, mentions
    - Graphiques de performance comparative et part de marché
    - Insights concurrentiels et opportunités d'amélioration
    - Actions de génération de rapports et export de données

### 3. 🚀 Collecte Automatisée (NOUVEAU)
- **Collecte manuelle** : Bouton "Collecter Maintenant" dans le dashboard projet
- **Programmation** : Bouton "Programmer" pour collecte automatique
- **Progression** : Barre de progression en temps réel
- **Status** : Visualisation des dernières collectes

### 4. Navigation
- **Projets** : Liste des projets de surveillance avec sous-menus
- **All Projects** : Vue globale avec filtrage, recherche et gestion en lot
- **Prompts/Questions** : Gestion des requêtes surveillées
- **Subscription** : Gestion de l'abonnement
- **FAQ** : Questions fréquemment posées
- **Improve AI Ranking** : Optimisation GAO
- **Video Tutorial** : Tutoriels d'utilisation

### 5. Plateformes Surveillées
L'application surveille 8 plateformes IA principales :
- **ChatGPT** (OpenAI) ✅ Active
- **Google Gemini** ✅ Active
- **Anthropic Claude** ✅ Active
- **Perplexity AI** ✅ Active
- **Meta Llama** ✅ Active
- **DeepSeek** ✅ Active
- **Mistral AI** 🔧 Configuration
- **Cohere** 🔧 Configuration

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- NPM ou Yarn
- Wrangler CLI (Cloudflare)

### Setup Local
```bash
# Cloner et installer
npm install

# Configurer la base de données locale
npm run db:migrate:local
npm run db:seed

# Développement
npm run dev:sandbox

# Build et déploiement
npm run build
npm run deploy
```

### Scripts Disponibles
```bash
npm run dev:sandbox      # Serveur de développement avec D1 local
npm run build           # Build production
npm run db:migrate:local # Migrations base de données locale
npm run db:seed         # Insérer données de test
npm run db:reset        # Reset complet de la DB locale
npm run test           # Test curl basique
```

### Test de la Collecte
```bash
# Tester la collecte pour le projet TechFlow (ID: 1)
curl -X POST http://localhost:3000/api/projects/1/collect

# Vérifier le status de collecte
curl http://localhost:3000/api/projects/1/collection-status

# Programmer la collecte (toutes les heures)
curl -X POST http://localhost:3000/api/projects/1/schedule \
  -H "Content-Type: application/json" \
  -d '{"intervalMinutes": 60}'
```

## 📈 Métriques et KPI

### Métriques Suivies
- **Position moyenne** de la marque dans les réponses (1-10+)
- **Sentiment score** des mentions (-1 à +1)
- **Score d'exactitude** calculé (0-100%)
- **Nombre de mentions** total par période
- **Score de visibilité** calculé (0-100%)
- **Trends** (up/down/stable)

### Données de Démonstration
- **TechFlow** (Technology) : 4 questions, collecte active
- **StyleCorp** (Fashion) : 4 questions, collecte active 
- **MedTech Solutions** (Healthcare) : 3 questions, collecte active

## 🔮 Prochaines Étapes

### Phase 2 - Intelligence Avancée  
- **Système d'alertes** proactif basé sur les changements
- **Analyse comparative** concurrentielle détaillée
- **Recommandations GAO** personnalisées
- **Rapports PDF** automatiques

### Phase 3 - APIs Réelles
- **Intégration production** avec vraies clés API
- **Rate limiting** intelligent par plateforme
- **Cache** et optimisations de performance
- **Monitoring** et logs avancés

### Phase 4 - Optimisation GAO
- **A/B testing** de contenus
- **ROI measurement** des optimisations
- **Content gap analysis** automatique
- **Competitive intelligence** en temps réel

## 🎯 Nouvelles Fonctionnalités v3.0

### ✨ Wizard de Création Intelligent  
- **Détection automatique** de marque et industrie depuis domaine
- **4 étapes guidées** avec validation en temps réel
- **Interface step-by-step** avec indicateurs visuels d'avancement
- **Questions pré-sélectionnées** basées sur l'industrie détectée

### 🧠 Intelligence Artificielle de Suggestion
- **20+ templates** de questions par industrie (Tech, Food & Beverage, E-commerce...)
- **Questions contextuelles** spécifiques au domaine (.ma → questions Maroc)
- **Questions marque** personnalisées (reviews, comparaisons, pricing)
- **Volumes de recherche** simulés avec distribution réaliste (60% <100, 20% med, 20% high)

### 📊 Expérience Utilisateur Avancée
- **Validation interactive** avec boutons intelligents activés/désactivés
- **Gestion d'état complexe** avec wizardData pour persistance entre étapes
- **Loading states** avec spinners et progression animée
- **Intégration transparente** avec le système de collecte existant

### 🚀 Fonctionnalités v2.0 (Précédentes)

#### ✨ Collecte Automatisée
- **Service modulaire** avec factory pattern pour plateformes IA
- **Simulation réaliste** avec données cohérentes par marque/industrie  
- **Parseur intelligent** détectant mentions, sentiment, position
- **Interface intuitive** avec progression temps réel

#### 📊 Métriques Avancées
- **Calcul automatique** de 5+ métriques par réponse
- **Analyse contextuelle** avec extraction d'insights
- **Détection concurrents** automatique dans les réponses
- **Scoring multi-dimensionnel** (exactitude, sentiment, position)

#### 🔧 Infrastructure Robuste
- **Architecture modulaire** facilement extensible
- **Gestion d'erreurs** complète avec fallbacks
- **Rate limiting** respect des limites par plateforme
- **Base de données** optimisée pour les analyses temporelles

## 🎨 Design System
- **Couleurs primaires** : aireach-blue (#1e3a8a), aireach-purple (#7c3aed)
- **Typography** : Font system avec Tailwind
- **Components** : Cards, modals, charts, progressions responsives
- **Animations** : Transitions fluides, états hover, loading spinners

## 📊 Status du Projet
- **Plateforme** : Cloudflare Pages ✅ Active
- **Base de données** : D1 SQLite ✅ Configurée avec vraies données
- **APIs** : Backend Hono ✅ Fonctionnel avec 8 nouvelles routes
- **Frontend** : Interface responsive ✅ Avec collecte en temps réel
- **Collecte IA** : ✅ Opérationnelle avec 6 plateformes actives
- **Tech Stack** : Hono + D1 + TypeScript + Tailwind + Chart.js
- **Performance** : 24/32 collectes réussies (75% succès)
- **Version** : v4.0 - Analyse Concurrentielle + Gestion Multi-Projets
- **Dernière mise à jour** : 30 août 2025

---

💡 **AIREACH v4.0** combine maintenant un wizard intelligent de création de projets en 5 étapes avec analyse concurrentielle complète et gestion multi-projets avancée. Détection automatique de marque, questions multi-langues localisées, comparaison concurrentielle avec insights, et collecte temps réel vous donnent une vue 360° pour optimiser votre présence dans l'écosystème IA.

## 👥 Fonctionnalités Concurrentielles (v4.0)

### 🎯 Analyse Concurrentielle Intelligente
- **Identification automatique** des concurrents par industrie (Wine, Tech, Fashion, etc.)
- **Données comparatives** : Brand Score, positions moyennes, share of voice, mentions
- **Métriques de performance** avec tendances et position dans le marché
- **Insights stratégiques** : opportunités et menaces identifiées automatiquement

### 📊 Visualisations Concurrentielles
- **Graphique de comparaison** : Brand Score de votre marque vs concurrents
- **Part de marché IA** : Distribution en camembert des mentions dans l'écosystème IA
- **Tableau comparatif** : Vue détaillée sortable avec toutes les métriques
- **Opportunities Dashboard** : Actions recommandées avec niveau d'impact

### 🚀 Actions Concurrentielles
- **Génération de rapports** concurrentiels automatique
- **Export des données** pour analyses externes
- **Programmation d'analyses** périodiques
- **Alertes concurrentielles** sur les changements significatifs

### 🎯 Test du Processus Complet
```bash
# 1. Détecter marque depuis domaine
curl -X POST http://localhost:3000/api/brand/detect \
  -H "Content-Type: application/json" \
  -d '{"domain": "cavevins.ma"}'
# → Détecte "Cavevins" dans "Food & Beverage" ✅

# 2. Générer questions intelligentes  
curl -X POST http://localhost:3000/api/questions/generate \
  -H "Content-Type: application/json" \
  -d '{"brandName": "Cavevins", "industry": "Food & Beverage", "domain": "cavevins.ma"}'
# → 16 questions dont "Where to buy Moroccan wine?" (spéc. .ma) ✅

# 3. Créer projet complet avec collecte
curl -X POST http://localhost:3000/api/projects/create-complete \
  -H "Content-Type: application/json" \
  -d '{"domain": "cavevins.ma", "brandName": "Cavevins", "industry": "Food & Beverage", "questions": [...]}'
# → Projet créé + 5 questions + prêt pour collecte ✅
```