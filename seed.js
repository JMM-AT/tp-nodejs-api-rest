/**
 * Étape 2.1 — Script de récupération des données (seed.js)
 * Récupère les posts depuis l'API JSONPlaceholder et les sauvegarde dans posts.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const OUTPUT_FILE = path.join(__dirname, 'posts.json');

/**
 * Effectue une requête GET vers une URL et retourne le corps de la réponse
 * sous forme de chaîne de caractères.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Point d'entrée du script.
 */
async function main() {
  try {
    console.log('Récupération des posts depuis', API_URL, '...');

    const response = await get(API_URL);
    const posts = JSON.parse(response);

    console.log(`${posts.length} posts récupupérés.`);

    // Sauvegarde dans posts.json (format pretty-print pour lisibilité)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');

    console.log('Posts sauvegardés dans', OUTPUT_FILE);
  } catch (err) {
    console.error('Erreur lors de la récupupération des posts :', err.message);
    process.exit(1);
  }
}

main();
