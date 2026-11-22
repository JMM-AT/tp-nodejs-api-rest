/**
 * Étape 5.1 — Fichier de tests de l'API REST (api.test.js)
 *
 * Ce script exécute une série de requêtes HTTP contre le serveur démarré
 * sur http://localhost:3000 et affiche le résultat de chaque test.
 *
 * Prérequis : le serveur doit être en cours d'exécution (`node server.js`),
 * et la base posts.json doit avoir été initialisée (`npm run seed`).
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000/api/posts';

let passed = 0;
let failed = 0;

/**
 * Effectue une requête HTTP et retourne { statusCode, body }.
 */
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Assertion simple qui compte les succès/échecs.
 */
function assert(condition, message) {
  if (condition) {
    console.log(`  [OK] ${message}`);
    passed++;
  } else {
    console.log(`  [KO] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== Tests de l\'API REST ===\n');

  // --- Test 1 : GET /api/posts (liste) ---
  console.log('1. GET /api/posts — liste des posts');
  try {
    const res = await request('GET', '/api/posts');
    const posts = JSON.parse(res.body);
    assert(res.statusCode === 200, `Status 200 (reçu ${res.statusCode})`);
    assert(Array.isArray(posts), 'Le corps est un tableau');
    assert(posts.length > 0, `Le tableau contient des posts (${posts.length} trouvés)`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // Récupère un ID existant pour les tests suivants
  let testId = null;
  try {
    const res = await request('GET', '/api/posts');
    const posts = JSON.parse(res.body);
    testId = posts[0].id;
  } catch (err) {}

  // --- Test 2 : GET /api/posts/:id ---
  console.log(`\n2. GET /api/posts/${testId} — détail d'un post`);
  try {
    const res = await request('GET', `/api/posts/${testId}`);
    const post = JSON.parse(res.body);
    assert(res.statusCode === 200, `Status 200 (reçu ${res.statusCode})`);
    assert(post.id === testId, `L'ID correspond (${post.id} === ${testId})`);
    assert(typeof post.title === 'string', 'Le post a un titre');
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 3 : GET /api/posts/:id inexistant ---
  console.log('\n3. GET /api/posts/999999 — post inexistant');
  try {
    const res = await request('GET', '/api/posts/999999');
    assert(res.statusCode === 404, `Status 404 (reçu ${res.statusCode})`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 4 : POST /api/posts — création ---
  console.log('\n4. POST /api/posts — création d\'un post');
  let createdId = null;
  try {
    const res = await request('POST', '', {
      title: 'Post de test',
      body: 'Ceci est un post créé par les tests automatisés.',
    });
    const created = JSON.parse(res.body);
    assert(res.statusCode === 201, `Status 201 (reçu ${res.statusCode})`);
    assert(created.id, 'Un ID a été généré');
    assert(created.title === 'Post de test', 'Le titre est correct');
    createdId = created.id;
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 5 : PUT /api/posts/:id — modification ---
  console.log(`\n5. PUT /api/posts/${createdId} — modification d'un post`);
  try {
    const res = await request('PUT', `/api/posts/${createdId}`, {
      title: 'Titre modifié',
      body: 'Contenu modifié par les tests.',
    });
    const updated = JSON.parse(res.body);
    assert(res.statusCode === 200, `Status 200 (reçu ${res.statusCode})`);
    assert(updated.title === 'Titre modifié', 'Le titre a été modifié');
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 6 : PUT /api/posts/:id inexistant ---
  console.log('\n6. PUT /api/posts/999999 — modification post inexistant');
  try {
    const res = await request('PUT', '/api/posts/999999', {
      title: 'X',
      body: 'Y',
    });
    assert(res.statusCode === 404, `Status 404 (reçu ${res.statusCode})`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 7 : POST avec données invalides ---
  console.log('\n7. POST /api/posts — données invalides (champs manquants)');
  try {
    const res = await request('POST', '', { title: 'Sans body' });
    assert(res.statusCode === 400, `Status 400 (reçu ${res.statusCode})`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 8 : DELETE /api/posts/:id — suppression ---
  console.log(`\n8. DELETE /api/posts/${createdId} — suppression d'un post`);
  try {
    const res = await request('DELETE', `/api/posts/${createdId}`);
    assert(res.statusCode === 200, `Status 200 (reçu ${res.statusCode})`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Test 9 : DELETE /api/posts/:id déjà supprimé ---
  console.log(`\n9. DELETE /api/posts/${createdId} — suppression d'un post déjà supprimé`);
  try {
    const res = await request('DELETE', `/api/posts/${createdId}`);
    assert(res.statusCode === 404, `Status 404 (reçu ${res.statusCode})`);
  } catch (err) {
    console.log(`  [KO] Erreur : ${err.message}`);
    failed++;
  }

  // --- Résumé ---
  console.log('\n=== Résumé ===');
  console.log(`Réussis : ${passed}`);
  console.log(`Échoués : ${failed}`);
  console.log(`Total   : ${passed + failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
