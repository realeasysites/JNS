(function(){
  // mobile menu
  var btn=document.querySelector('.menu-btn'),nav=document.querySelector('nav');
  btn&&btn.addEventListener('click',function(){nav.classList.toggle('open')});
  nav&&nav.addEventListener('click',function(e){if(e.target.tagName==='A')nav.classList.remove('open')});

  // reveal on scroll
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  // hide placeholder caption when a real photo loads; remove broken imgs
  document.querySelectorAll('.ph img').forEach(function(img){
    function ok(){var c=img.parentNode.querySelector('figcaption');if(c)c.style.display='none';img.parentNode.style.border='0'}
    if(img.complete&&img.naturalWidth)ok();else img.addEventListener('load',ok);
    img.addEventListener('error',function(){img.remove()});
  });
  var logo=document.querySelector('.logo-big img');
  if(logo){logo.addEventListener('load',function(){var f=document.querySelector('.logo-big .fallback');if(f)f.style.display='none'});
    logo.addEventListener('error',function(){logo.remove()});}
  var mark=document.querySelector('.brand .mark img');
  if(mark)mark.addEventListener('error',function(){mark.remove()});

  // quote form
  var form=document.getElementById('quote-form');
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var s=document.getElementById('status'),b=form.querySelector('button');
    s.className='';s.textContent='Sending…';b.disabled=true;
    fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))})
      .then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})})
      .then(function(x){
        if(x.ok){s.className='ok';s.textContent="Got it. We'll reach out soon. For anything urgent, call (207) 414-9658.";form.reset()}
        else{s.className='err';s.textContent=x.j.error||'Something went wrong. Please call us.'}
      }).catch(function(){s.className='err';s.textContent='Connection problem. Please call (207) 414-9658.'})
      .finally(function(){b.disabled=false});
  });
})();
