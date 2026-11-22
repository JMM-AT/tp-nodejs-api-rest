# TP Node.js — API REST

Projet réalisé dans le cadre du TP "Initiation à Node.js - Création d'une API REST" (Groupe B, XML-Frameworks-nosql, 100 points).

## Structure du projet

```
tp-nodejs-api-rest/
├── package.json          # Description du projet et scripts
├── .gitignore            # Fichiers ignorés par Git
├── README.md             # Ce fichier
├── seed.js               # Étape 2 — Récupération des données depuis JSONPlaceholder
├── postManager.js        # Étape 3 — Module CRUD sur posts.json
├── server.js             # Étape 4 — Serveur HTTP / API REST
├── client/
│   └── index.html        # Étape 6 — Interface web pour consommer l'API
└── test/
    └── api.test.js       # Étape 5 — Tests des endpoints REST
```

## Installation

```bash
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd tp-nodejs-api-rest

# Installer les dépendances (aucune dépendance externe requise, mais on prépare l'avenir)
npm install
```

## Utilisation

### 1. Générer la base de données simulée (posts.json)

```bash
npm run seed
```

Ce script récupère les posts depuis [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) et les enregistre dans `posts.json`.

### 2. Démarrer le serveur

```bash
npm start
# ou
node server.js
```

Le serveur écoute sur `http://localhost:3000`.

### 3. Tester l'API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/posts` | Liste tous les posts |
| `GET` | `/api/posts/:id` | Détail d'un post |
| `POST` | `/api/posts` | Crée un post |
| `PUT` | `/api/posts/:id` | Modifie un post |
| `DELETE` | `/api/posts/:id` | Supprime un post |

Exemple avec `curl` :

```bash
# Lister les posts
curl http://localhost:3000/api/posts

# Créer un post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon titre","body":"Mon contenu"}'

# Modifier un post
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Titre modifié"}'

# Supprimer un post
curl -X DELETE http://localhost:3000/api/posts/1
```

### 4. Interface web

Ouvrez `client/index.html` dans votre navigateur (ou servez-la avec un serveur statique) pour interagir avec l'API via une interface graphique.

### 5. Exécuter les tests automatisés

```bash
node test/api.test.js
```

## Auteurs

Abdelaziz DAAIF — Groupe B
