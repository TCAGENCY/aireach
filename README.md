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
- **Gestion des projets** (création, visualisation, sélection)
- **Base de données complète** avec schéma pour surveillance IA
- **Interface utilisateur responsive** avec sidebar de navigation
- **API RESTful** pour la gestion des données
- **Données de démonstration** pré-chargées (TechFlow, StyleCorp, MedTech Solutions)
- **Métriques de performance** par projet et plateforme
- **Navigation par sections** (Projects, Tools, FAQ, etc.)

### 📊 APIs Fonctionnelles
- `GET /api/projects` - Liste tous les projets avec métriques
- `POST /api/projects` - Créer un nouveau projet
- `GET /api/projects/:id` - Détails d'un projet spécifique
- `GET /api/dashboard/analytics/:projectId` - Analytics d'un projet
- `GET /api/platforms` - Liste des plateformes IA

### 🔧 Fonctionnalités en Développement
- **Collecte automatisée** des réponses IA en temps réel
- **Analyse de sentiment** avancée des mentions
- **Alertes intelligentes** basées sur les tendances
- **Comparaison concurrentielle** détaillée
- **Recommandations d'optimisation** GAO (Generative AI Optimization)
- **Intégrations API** avec les plateformes IA
- **Rapports PDF** exportables
- **Système d'abonnement** et facturation

## 🏗️ Architecture Technique

### Backend
- **Framework**: Hono (edge-optimized)
- **Runtime**: Cloudflare Workers
- **Base de données**: Cloudflare D1 SQLite
- **Déploiement**: Cloudflare Pages

### Frontend  
- **Style**: Tailwind CSS + CSS personnalisé
- **Charts**: Chart.js pour visualisations
- **Icons**: Font Awesome 6
- **HTTP Client**: Axios

### Structure des Données
- **Projects**: Projets de surveillance des marques
- **AI Platforms**: 8 plateformes IA surveillées (ChatGPT, Gemini, Claude, Perplexity, Llama, DeepSeek, Mistral, Cohere)
- **Tracked Queries**: Questions/prompts suivis
- **AI Responses**: Réponses collectées avec métriques
- **Metrics Summary**: Métriques agrégées par période
- **Alerts**: Système d'alertes et notifications
- **Recommendations**: Suggestions d'optimisation

## 📱 Guide d'Utilisation

### 1. Tableau de Bord Principal
- Vue d'ensemble des projets actifs
- Métriques globales (projets, réponses, plateformes, alertes)
- Actions rapides pour créer nouveaux projets

### 2. Gestion des Projets
- **Créer un projet** : Cliquer sur "+" à côté de "Projets"
- **Sélectionner un projet** : Cliquer sur un projet dans la sidebar
- **Voir détails** : Dashboard spécifique avec métriques détaillées

### 3. Navigation
- **Projets** : Liste des projets de surveillance
- **All Projects** : Vue globale de tous les projets
- **Prompts/Questions** : Gestion des requêtes surveillées
- **Subscription** : Gestion de l'abonnement
- **FAQ** : Questions fréquemment posées
- **Improve AI Ranking** : Optimisation GAO
- **Video Tutorial** : Tutoriels d'utilisation

### 4. Plateformes Surveillées
L'application surveille 8 plateformes IA principales :
- ChatGPT (OpenAI)
- Google Gemini 
- Anthropic Claude
- Perplexity AI
- Meta Llama
- DeepSeek
- Mistral AI
- Cohere

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

## 📈 Métriques et KPI

### Métriques Suivies
- **Position moyenne** de la marque dans les réponses (1-10+)
- **Sentiment score** des mentions (-1 à +1)
- **Nombre de mentions** total par période
- **Score de visibilité** calculé (0-100%)
- **Trends** (up/down/stable)

### Données de Démonstration
- **TechFlow** (Technology) : 4 questions, 3 réponses, position moy. #2
- **StyleCorp** (Fashion) : 4 questions, 2 réponses, position moy. #3  
- **MedTech Solutions** (Healthcare) : 3 questions, 2 réponses, position moy. #3

## 🔮 Prochaines Étapes

### Phase 2 - Collecte Automatisée
- Intégration APIs des plateformes IA
- Collecte automatique des réponses
- Système de prompts intelligents

### Phase 3 - Intelligence Avancée  
- Analyse de sentiment en temps réel
- Détection d'anomalies et trends
- Alertes proactives

### Phase 4 - Optimisation GAO
- Recommandations personnalisées
- A/B testing de contenus
- ROI measurement

## 🎨 Design System
- **Couleurs primaires** : aireach-blue (#1e3a8a), aireach-purple (#7c3aed)
- **Typography** : Font system avec Tailwind
- **Components** : Cards, modals, charts responsives
- **Animations** : Transitions fluides, états hover

## 📊 Status du Projet
- **Plateforme** : Cloudflare Pages ✅ Active
- **Base de données** : D1 SQLite ✅ Configurée
- **APIs** : Backend Hono ✅ Fonctionnel  
- **Frontend** : Interface responsive ✅ Opérationnelle
- **Tech Stack** : Hono + D1 + Tailwind + Chart.js
- **Dernière mise à jour** : 30 août 2025

---

💡 **AIREACH** vous aide à maîtriser votre présence dans l'écosystème IA en fournissant des insights exploitables pour optimiser votre visibilité et corriger les informations inexactes dans les réponses des chatbots.