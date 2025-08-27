// ==== Pixley App Core Script ====

// 1. Firebase Config (locked-in Pixley production)
const firebaseConfig = {
  apiKey: "AIzaSyDHX_86B2eFSA3jgGkNgVlL57Crd2RoIf8",
  authDomain: "pixley-4632c.firebaseapp.com",
  projectId: "pixley-4632c",
  storageBucket: "pixley-4632c.firebasestorage.app",
  messagingSenderId: "1006119196484",
  appId: "1:1006119196484:web:d7c48070f62b9b42f0a911",
  measurementId: "G-R56KM3Y9VD"
};

// 2. Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// 3. Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// ==== USER AUTH FUNCTIONS ====

// Check if user is logged in and redirect if needed
auth.onAuthStateChanged(user => {
  if(user){
    // Optionally, store user info in global variable
    window.currentUser = user;
  } else {
    // Redirect to login for protected pages
    if(!window.location.href.includes('/auth/')){
      window.location.href='/auth/login.html';
    }
  }
});

// ==== PROFILE HELPERS ====

// Get user profile info from Firestore
async function getUserProfile(uid){
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

// Update user profile
async function updateProfile({displayName, bio, photoURL}){
  const user = auth.currentUser;
  if(!user) return;

  await user.updateProfile({displayName, photoURL});
  await db.collection('users').doc(user.uid).update({displayName, bio, photoURL});
}

// ==== POST HELPERS ====

// Create a new post
async function createPost({caption, mediaURL}){
  const user = auth.currentUser;
  if(!user) return;

  await db.collection('posts').add({
    userId: user.uid,
    username: user.displayName,
    userPhotoURL: user.photoURL,
    caption,
    mediaURL: mediaURL || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Load posts dynamically into container
async function loadFeed(containerId){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = '';

  const snapshot = await db.collection('posts').orderBy('createdAt','desc').limit(50).get();
  snapshot.forEach(doc => {
    const post = doc.data();
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    postDiv.innerHTML = `
      <div class="post-user">
        <img src="${post.userPhotoURL}" alt="${post.username}">
        <div>@${post.username}</div>
      </div>
      <div class="post-caption">${post.caption}</div>
      ${post.mediaURL?`<div class="post-media"><img src="${post.mediaURL}" alt="media"></div>`:''}
      <div class="post-actions">❤️ 🔁 💬</div>
    `;
    container.appendChild(postDiv);
  });
}

// ==== DISCOVER / SEARCH HELPERS ====
// (add your dynamic discover functionality here)

// ==== DMS / NOTIFICATIONS ====
// (add your dynamic DM / notification functions here)

// ==== LIVE / STORIES HELPERS ====
// (add your live stream and stories helper functions here)
