// ==== Pixley App Core Script ====

// 1. Full Firebase Config (this stays public, you're all good)
const firebaseConfig = {
  apiKey: "AIzaSyDHX_86B2eFSA3jgGkNgVlL57Crd2RoIf8",
  authDomain: "pixley-4632c.firebaseapp.com",
  projectId: "pixley-4632c",
  storageBucket: "pixley-4632c.firebasestorage.app",
  messagingSenderId: "1006119196484",
  appId: "1:1006119196484:web:d7c48070f62b9b42f0a911",
  measurementId: "G-R56KM3Y9VD"
};

// 2. Initialize Firebase (only once per app!)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use that one
}

// 3. Get Auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// ====== USER AUTH SECTION ======

// -- Listen to login state changes --
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User is logged in:", user.email);
    // Example: document.getElementById("user-email").textContent = user.email;
  } else {
    console.log("No user is logged in");
    // Example: Hide user-only sections
  }
});

// -- Register new user --
function pixleyRegister(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      alert("Welcome to Pixley, " + userCred.user.email + "!");
      // Optionally, create a user profile doc in Firestore here
    })
    .catch(err => {
      alert("Sign up failed: " + err.message);
    });
}

// -- Login existing user --
function pixleyLogin(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      alert("Logged in as " + userCred.user.email);
    })
    .catch(err => {
      alert("Login failed: " + err.message);
    });
}

// -- Log out user --
function pixleyLogout() {
  return auth.signOut().then(() => {
    alert("Logged out!");
  });
}

// -- Password Reset --
function pixleyResetPassword(email) {
  return auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch(err => {
      alert("Failed to send reset: " + err.message);
    });
}

// ====== POSTS SECTION (Firestore) ======

// -- Add a post --
function pixleyAddPost(postData) {
  return db.collection("posts").add(postData)
    .then(docRef => {
      alert("Post created! ID: " + docRef.id);
    })
    .catch(err => {
      alert("Failed to create post: " + err.message);
    });
}

// -- Get all posts (latest 20) --
function pixleyGetPosts() {
  return db.collection("posts")
    .orderBy("createdAt", "desc")
    .limit(20)
    .get()
    .then(snapshot => {
      // Map over posts and return array of data
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
}

// ====== OPTIONAL: EXPORT FUNCTIONS FOR HTML FORMS ======
window.pixleyRegister = pixleyRegister;
window.pixleyLogin = pixleyLogin;
window.pixleyLogout = pixleyLogout;
window.pixleyResetPassword = pixleyResetPassword;
window.pixleyAddPost = pixleyAddPost;
window.pixleyGetPosts = pixleyGetPosts;
