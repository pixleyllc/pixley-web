const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const createPostForm = document.getElementById('createPostForm');
const captionInput = document.getElementById('caption');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const statusMsg = document.getElementById('postStatusMsg');

let currentUser = null;
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "/log-in-form.html";
    return;
  }
  currentUser = user;
});
imageUpload.addEventListener('change', function () {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = "";
    imagePreview.style.display = 'none';
  }
});
createPostForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  statusMsg.textContent = "";

  if (!currentUser) {
    statusMsg.textContent = "You must be logged in.";
    return;
  }
  const caption = captionInput.value.trim();
  if (!caption) {
    statusMsg.textContent = "Caption required.";
    return;
  }
  if (caption.length > 300) {
    statusMsg.textContent = "Caption too long (max 300).";
    return;
  }
  const file = imageUpload.files[0];
  let imageUrl = "";
  try {
    if (file) {
      const storageRef = storage.ref(`postImages/${currentUser.uid}_${Date.now()}_${file.name}`);
      const snapshot = await storageRef.put(file);
      imageUrl = await snapshot.ref.getDownloadURL();
    }
    await db.collection("posts").add({
      userId: currentUser.uid,
      caption: caption,
      imageUrl: imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    createPostForm.reset();
    imagePreview.innerHTML = "";
    imagePreview.style.display = 'none';
    statusMsg.textContent = "Posted! Redirecting…";
    setTimeout(() => window.location.href = "/feed.html", 1200);
  } catch (err) {
    console.error("Error posting:", err);
    statusMsg.textContent = "Error posting! Try again.";
  }
});
