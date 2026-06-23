# EmojiHub Ops
Projet DevOps - Micro-services d’analyse d’emojis avec CI/CD, Docker et Monitoring.

Cahier des chagres : https://univcergy.phpnet.org/tps/CDC_emoji.pdf.

Réalisé par Rosalie NICAUD et Laetitia TANOH.

## Choix des technologies 
* `Service REST` : Node Express
* `Service Stockage` : Postgrsql
* `Service Analyse` : cron
* `Interface utilisateur` : Web (HTML/JS/ Nginx)
* `Containerisation` : Docker / Docker Compose

## Schéma architecture DevOps
Notre schéma de l'architecture DevOps est visibile [ici](architectureDevOps.png).

## Variables d'environnement
 
### `.env` (à la racine: utilisé par Docker Compose)
| Variable | Description | Exemple |
|---|---|---|
| `DB_HOST` | Hôte PostgreSQL | `db` |
| `DB_NAME` | Nom de la base | `emojihub` |
| `DB_USER` | Utilisateur PostgreSQL | `emoji` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `emoji` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `STOCKAGE_URL` | URL interne du stockage-service | `http://stockage-service:5001` |
 
### `stockage-service/.env`
| Variable | Description | Exemple |
|---|---|---|
| `DB_HOST` | Hôte PostgreSQL | `db` (Docker) / `localhost` (local) |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base | `emojihub` |
| `DB_USER` | Utilisateur PostgreSQL | `emoji` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `emoji` |
| `PORT` | Port d'écoute du service | `5001` |
 
### `api-service/.env` (dev local uniquement)
| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port d'écoute du service | `3000` |
| `STOCKAGE_URL` | URL du stockage-service | `http://localhost:5001` |
 
### `analyse-service/.env`
| Variable | Description | Exemple |
|---|---|---|
| `STOCKAGE_URL` | URL du stockage-service | `http://stockage-service:5001` |
| `ANALYSE_INTERVAL_MS` | Intervalle d'analyse en ms | `60000` |
 
> Aucun fichier `.env` n'est commité. Copier les exemples ci-dessus et adapter les valeurs.
 
## Lancer le projet en local
Le projet peut être lancé :
* via Docker (recommandé) 
* sans Docker (mode dev: frontend + backend + PostgreSQL local).

### Prérequis 
* Node.js 20+
* npm
* Docker Desktop (pour le mode Docker)

### Lancer avec Docker Compose
```bash
docker compose up --build
```

L'application est accessible sur :
* Frontend : http://localhost
* API : http://localhost:3000
* Stockage : http://localhost:5001
* PostgreSQL : localhost:5433

### Sans Docker Compose
 
#### 1. Lancer PostgreSQL
 
**Via Docker :**
```bash
docker run --name emoji-db \
  -e POSTGRES_DB=emojihub \
  -e POSTGRES_USER=emoji \
  -e POSTGRES_PASSWORD=emoji \
  -p 5433:5432 \
  -d postgres:15
```
 
**Via PostgreSQL installé localement :**
```bash
psql -U postgres
CREATE USER emoji WITH PASSWORD 'emoji';
CREATE DATABASE emojihub OWNER emoji;
GRANT ALL PRIVILEGES ON DATABASE emojihub TO emoji;
```
 
#### 2. Migration de la base de données
 
```bash
cd stockage-service
psql -h localhost -p 5433 -U emoji -d emojihub -f migration/init.sql
```
 
#### 3. Connexion à la base (optionnel)
 
```bash
psql -h localhost -p 5433 -U emoji -d emojihub
```
 
#### 4. Lancer les services
 
```bash
# stockage-service
cd stockage-service
npm install
npm run dev
 
# api-service
cd api-service
npm install
npm run dev
 
# analyse-service
cd analyse-service
npm install
npm run dev
 
# frontend
start frontend/index.html
```

## Workflow

### Branches 
* `main` : stable, code prêt pour la production
* `develop` : stable, intégration des fonctionnalités
* `feature/...` : une fonctionnalité par branche

### Commit
| Type | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `test:` | Ajout de tests |
| `docs:` | Documentation |
| `ci:` | Pipeline CI/CD |
| `chore:` | Fichiers techniques |

### Etapes d'un push
```bash
git checkout develop 
git pull origin develop 
git checkout -b feature/[nom-fonctionnalité]

# Si modification entre temps
git stash  
git pull origin develop 
git stash pop 

git add . 
git commit -m "type: description"
git push origin feature/[nom-fonctionnalité] 
```
Sur GitHub -> ouvre pull request branch `feature/[nom-fonctionnalité]` vers branch `develop` 

### Règles obligatoires
* Pas de push direct sur `develop` et `main`
* Review obligatoire pour PR vers `main`
* Ne pas travailler directement dans `develop`
* Avant de créer une branche, toujours faire un `git pull`
* Supprimer la branche `feature/` après merge