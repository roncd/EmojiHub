# EmojiHub Ops
Projet DevOps - Micro-services d’analyse d’emojis avec CI/CD, Docker et Monitoring.

Cahier des chagres : https://univcergy.phpnet.org/tps/CDC_emoji.pdf.

Réalisé par Rosalie NICAUD et Laetitia TANOH.

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

## Choix des technologies 
* `Service REST` : Node Express
* `Service Stockage` : Postgrsql
* `Service Analyse` : cron
* `Interface utilisateur` : Web (HTML/JS)