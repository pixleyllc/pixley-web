// ==== Pixley App Core Script ====

// 1. Firebase Config (full Pixley locked branding)
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// 3. Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// ===== USER AUTH =====
auth.onAuthStateChanged(user => {
  console.log(user ? "Logged in as " + user.email : "No user logged in");
});

function pixleyRegister(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => alert("Welcome to Pixley, " + userCred.user.email + "!"))
    .catch(err => alert("Sign up failed: " + err.message));
}

function pixleyLogin(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(userCred => alert("Logged in as " + userCred.user.email))
    .catch(err => alert("Login failed: " + err.message));
}

function pixleyLogout() {
  return auth.signOut().then(() => alert("Logged out!"));
}

function pixleyResetPassword(email) {
  return auth.sendPasswordResetEmail(email)
    .then(() => alert("Password reset email sent!"))
    .catch(err => alert("Failed to send reset: " + err.message));
}

// ===== POSTS SECTION =====
function pixleyAddPost(postData) {
  return db.collection("posts").add(postData)
    .then(docRef => alert("Post created! ID: " + docRef.id))
    .catch(err => alert("Failed to create post: " + err.message));
}

function pixleyGetPosts() {
  return db.collection("posts")
    .orderBy("createdAt", "desc")
    .limit(20)
    .get()
    .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}

// EXPORT FUNCTIONS TO GLOBAL
window.pixleyRegister = pixleyRegister;
window.pixleyLogin = pixleyLogin;
window.pixleyLogout = pixleyLogout;
window.pixleyResetPassword = pixleyResetPassword;
window.pixleyAddPost = pixleyAddPost;
window.pixleyGetPosts = pixleyGetPosts;
