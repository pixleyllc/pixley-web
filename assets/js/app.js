document.querySelectorAll('[data-tab]').forEach(el=>{
  el.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    el.classList.add('active');
  });
});
