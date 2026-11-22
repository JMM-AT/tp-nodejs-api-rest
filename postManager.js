/**
 * Étape 3.1 — Module de gestion des posts (postManager.js)
 * Fournit les opérations CRUD sur le fichier posts.json (base de données simulée).
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'posts.json');

/**
 * Lit tous les posts depuis le fichier JSON.
 * Retourne un tableau (vide si le fichier n'existe pas encore).
 */
function readPosts() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

/**
 * Écrit la liste complète des posts dans le fichier JSON.
 */
function writePosts(posts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

/**
 * Retourne tous les posts.
 */
function getAllPosts() {
  return readPosts();
}

/**
 * Retourne un post par son ID, ou undefined s'il n'existe pas.
 */
function getPostById(id) {
  const posts = readPosts();
  return posts.find((p) => p.id === id);
}

/**
 * Crée un nouveau post.
 * Génère un nouvel ID (max existant + 1).
 * Retourne le post créé.
 */
function createPost(post) {
  const posts = readPosts();

  const newId = posts.length > 0
    ? Math.max(...posts.map((p) => p.id)) + 1
    : 1;

  const newPost = {
    id: newId,
    ...post,
  };

  posts.push(newPost);
  writePosts(posts);

  return newPost;
}

/**
 * Met à jour un post existant par son ID.
 * Retourne le post mis à jour, ou undefined si le post n'existe pas.
 */
function updatePost(id, updatedPost) {
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return undefined;
  }

  const updated = {
    id,
    ...updatedPost,
  };

  posts[index] = updated;
  writePosts(posts);

  return updated;
}

/**
 * Supprime un post par son ID.
 * Retourne true si le post a été supprimé, false sinon.
 */
function deletePost(id) {
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  posts.splice(index, 1);
  writePosts(posts);

  return true;
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
