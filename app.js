document.addEventListener('click',function(e){
  var b=e.target.closest('.burger');
  var head=document.querySelector('header.site');
  if(b){ if(head) head.classList.toggle('nav-open'); return; }
  if(e.target.closest('header.site nav a')){ if(head) head.classList.remove('nav-open'); }
});
