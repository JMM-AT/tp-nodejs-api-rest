/**
 * Étape 4.1 — Serveur API REST (server.js)
 * Point d'entrée du serveur HTTP qui expose les endpoints de l'API posts.
 */

const http = require('http');
const url = require('url');
const postManager = require('./postManager');

const PORT = process.env.PORT || 3000;

/**
 * Lit le corps de la requête HTTP et le retourne sous forme de chaîne.
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Envoie une réponse JSON au client.
 */
function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Envoie une réponse texte simple.
 */
function sendText(res, statusCode, message) {
  const body = message;
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Extrait l'ID depuis l'URL /api/posts/:id
 */
function extractId(pathname) {
  const match = pathname.match(/^\/api\/posts\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Gestionnaire principal des requêtes HTTP.
 */
async function handler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // --- Routes sur la collection /api/posts ---
  if (pathname === '/api/posts' || pathname === '/api/posts/') {
    if (method === 'GET') {
      const posts = postManager.getAllPosts();
      return sendJson(res, 200, posts);
    }

    if (method === 'POST') {
      try {
        const body = await readBody(req);
        const data = JSON.parse(body);

        // Validation minimale
        if (!data.title || !data.body) {
          return sendJson(res, 400, {
            error: 'Les champs "title" et "body" sont requis.',
          });
        }

        const newPost = postManager.createPost(data);
        return sendJson(res, 201, newPost);
      } catch (err) {
        return sendJson(res, 400, { error: 'JSON invalide dans le corps de la requête.' });
      }
    }

    return sendJson(res, 405, { error: 'Méthode non autorisée sur cette route.' });
  }

  // --- Routes sur un post précis /api/posts/:id ---
  const id = extractId(pathname);

  if (id !== null) {
    if (method === 'GET') {
      const post = postManager.getPostById(id);
      if (!post) {
        return sendJson(res, 404, { error: `Post avec l'id ${id} non trouvé.` });
      }
      return sendJson(res, 200, post);
    }

    if (method === 'PUT') {
      try {
        const body = await readBody(req);
        const data = JSON.parse(body);

        const updated = postManager.updatePost(id, data);
        if (!updated) {
          return sendJson(res, 404, { error: `Post avec l'id ${id} non trouvé.` });
        }
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendJson(res, 400, { error: 'JSON invalide dans le corps de la requête.' });
      }
    }

    if (method === 'DELETE') {
      const deleted = postManager.deletePost(id);
      if (!deleted) {
        return sendJson(res, 404, { error: `Post avec l'id ${id} non trouvé.` });
      }
      return sendJson(res, 200, { message: `Post ${id} supprimé avec succès.` });
    }

    return sendJson(res, 405, { error: 'Méthode non autorisée sur cette route.' });
  }

  // --- Route inconnue ---
  return sendJson(res, 404, { error: 'Route non trouvée.' });
}

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log(`Serveur API REST démarré sur http://localhost:${PORT}`);
  console.log(`Endpoints disponibles :`);
  console.log(`  GET    /api/posts`);
  console.log(`  GET    /api/posts/:id`);
  console.log(`  POST   /api/posts`);
  console.log(`  PUT    /api/posts/:id`);
  console.log(`  DELETE /api/posts/:id`);
});
