// ========== 1. Initialize Firebase ==========
const firebaseConfig = {
  apiKey: "AIzaSyCI8yF4gOnTaJ--YEZ1GddgPSgNnJzlWXM",
  authDomain: "pixley-4632c.firebaseapp.com",
  projectId: "pixley-4632c",
  storageBucket: "pixley-4632c.appspot.com",
  messagingSenderId: "1006119196484",
  appId: "1:1006119196484:web:d7c48070f62b9b42f0a911",
  measurementId: "G-R56"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const feedContainer = document.getElementById('feedContainer');

// ========== 2. Helper: Format Timestamp ==========
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

// ========== 3. Render a Single Post ==========
function renderPost(post, user) {
  // Use user's profile pic, verified, display name, etc.
  const pfp = user?.photoURL || "https://pixley.social/assets/default-pfp.png";
  const username = user?.displayName || post.username || "user";
  const verified = user?.verified || post.verified || false;
  const timestamp = post.createdAt ? timeSince(post.createdAt.toDate()) : '';
  const caption = post.caption || '';
  const imageUrl = post.imageUrl || '';

  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-user">
          <img class="post-pfp" src="${pfp}" alt="PFP">
          <span class="post-username">${username}</span>
          ${verified ? `<span class="post-verified">VERIFIED</span>` : ''}
        </div>
        <span class="post-timestamp">${timestamp}</span>
      </div>
      <div class="
