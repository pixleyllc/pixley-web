// ===== Anti-zoom hard block (pinch, double-tap, ctrl+wheel) =====
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());

let __lastTouchEnd = 0;
document.addEventListener('touchend', function(e){
  const now = Date.now();
  if (now - __lastTouchEnd <= 300) { e.preventDefault(); }
  __lastTouchEnd = now;
}, true);

document.addEventListener('wheel', function(e){
  if (e.ctrlKey) e.preventDefault();
}, { passive:false });

// ===== Utility =====
function escapeHtml(str){
  return String(str ?? "").replace(/[&<>"']/g, s => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[s]
  ));
}
function timeAgoFromMillis(ms){
  if(!ms) return 'now';
  const diff = Date.now() - ms;
  const m = Math.floor(diff/60000);
  if(m < 1) return 'now';
  if(m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if(h < 24) return `${h}h ago`;
  const d = Math.floor(h/24);
  return `${d}d ago`;
}

// ===== Firebase (optional-safe) =====
let _fb = { app:null, db:null, ok:false };
async function initFirebaseIfPossible(){
  try{
    const cfgScript = document.getElementById('fb-config');
    const cfg = cfgScript ? JSON.parse(cfgScript.textContent) : null;
    if(!cfg || !cfg.projectId){
      console.info('Firebase config not provided — UI will run without data.');
      return;
    }
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const { getFirestore, collection, query, where, orderBy, getDocs, limit } =
      await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
    const app = initializeApp(cfg);
    const db = getFirestore(app);
    _fb = { app, db, ok:true, collection, query, where, orderBy, getDocs, limit };
  }catch(err){
    console.warn('Firebase init skipped:', err?.message || err);
    _fb.ok = false;
  }
}

// ===== Render helpers =====
function postCard(p){
  const createdMs = p.createdAt?._seconds ? p.createdAt._seconds*1000 : (p.createdAt?._milliseconds || null);
  const wrapper = document.createElement('article');
  wrapper.className = 'post';
  wrapper.innerHTML = `
    <div class="post-head">
      <div class="post-user">
        <img src="${p.authorPfp || './assets/default-pfp.jpg'}" alt="">
        <div>@${escapeHtml(p.author || 'user')}</div>
      </div>
      <div class="post-time">${timeAgoFromMillis(createdMs)}</div>
    </div>
    ${p.caption ? `<div class="post-caption">${escapeHtml(p.caption)}</div>` : ``}
    ${p.mediaUrl ? `<div class="post-media"><img src="${p.mediaUrl}" alt=""></div>` : ``}
    <div class="post-actions">❤️  💬  ↗️</div>
    <div class="small-tag">Powered by Anthany Intelligence™ 🤖</div>
  `;
  return wrapper;
}

// ===== Page loaders =====
async function loadFeed(){
  const feed = document.getElementById('feed');
  if(!feed) return;
  if(!_fb.ok){ return; }
  const { collection, query, orderBy, getDocs, limit } = _fb;
  const q = query(collection(_fb.db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
  const snap = await getDocs(q);
  feed.innerHTML = '';
  snap.forEach(doc => feed.appendChild(postCard(doc.data())));
}

async function loadProfile(){
  const feed = document.getElementById('profileFeed');
  const usernameEl = document.getElementById('profileUsername');
  const avatarEl = document.getElementById('profileAvatar');
  const followersEl = document.getElementById('followersCount');
  const followingEl = document.getElementById('followingCount');

  const params = new URLSearchParams(location.search);
  const username = params.get('u') || 'nike';
  if(usernameEl) usernameEl.textContent = `@${username}`;

  if(!_fb.ok){ return; }

  const { collection, query, where, orderBy, getDocs, limit } = _fb;

  // Load user info
  try{
    const uq = query(collection(_fb.db, 'users'), where('username', '==', username), limit(1));
    const usnap = await getDocs(uq);
    if(!usnap.empty){
      const u = usnap.docs[0].data();
      if(avatarEl && u.photoURL) avatarEl.src = u.photoURL;
      if(followersEl) followersEl.textContent = u.followersCount || 0;
      if(followingEl) followingEl.textContent = u.followingCount || 0;
    }
  }catch(e){ console.warn('user load error', e); }

  // Load posts
  try{
    const pq = query(collection(_fb.db, 'posts'), where('author', '==', username), orderBy('createdAt','desc'), limit(30));
    const psnap = await getDocs(pq);
    if(feed){ feed.innerHTML = ''; psnap.forEach(d => feed.appendChild(postCard(d.data()))); }
  }catch(e){ console.warn('posts load error', e); }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initFirebaseIfPossible();
  const page = document.documentElement.getAttribute('data-page');
  if(page === 'feed'){ loadFeed(); }
  if(page === 'profile'){ loadProfile(); }
});
