// ============ HEADER SCROLL STATE + PROGRESS BAR ============
const header = document.getElementById('site-header');
const progress = document.querySelector('.progress');

function onScroll(){
  if(header) header.classList.toggle('scrolled', window.scrollY > 24);
  if(progress){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// ============ CUSTOM CURSOR ============
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if(dot && ring && matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove', e=>{
    dot.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    ring.animate(
      { transform:`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)` },
      { duration:450, fill:'forwards' }
    );
  });
  document.querySelectorAll('a, button, .zoomable, .mosaic .item, .hover-compare').forEach(el=>{
    el.addEventListener('mouseenter', ()=>ring.classList.add('active'));
    el.addEventListener('mouseleave', ()=>ring.classList.remove('active'));
  });
}

// ============ MOBILE MENU ============
const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
if(burger && mobileNav){
  burger.addEventListener('click', ()=>{
    mobileNav.classList.toggle('open');
    burger.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>mobileNav.classList.remove('open')));
}

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .stagger');
const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold:.14, rootMargin:'0px 0px -60px 0px' });
revealEls.forEach(el=>io.observe(el));

// stagger children delay
document.querySelectorAll('.stagger').forEach(group=>{
  group.querySelectorAll('.stg').forEach((el,i)=>{
    el.style.transitionDelay = (i*90)+'ms';
  });
});

// ============ ANIMATED COUNTERS ============
document.querySelectorAll('[data-count]').forEach(el=>{
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const cio = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      const t0 = performance.now();
      const dur = 1400;
      function tick(now){
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.disconnect();
    }
  }, { threshold:.5 });
  cio.observe(el);
});

// ============ MAGNETIC BUTTONS ============
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * .25;
    const y = (e.clientY - r.top - r.height/2) * .25;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', ()=>btn.style.transform='');
});

// ============ TILT ON HOVER CARDS ============
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', ()=>card.style.transform='');
});

// ============ HERO PARALLAX ============
const heroBg = document.querySelector('.hero-bg');
if(heroBg){
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y < window.innerHeight) heroBg.style.transform = `translateY(${y*.28}px) scale(1.08)`;
  }, { passive:true });
}

// ============ SERVICES TABS (servicos.html) ============
document.querySelectorAll('[data-scroll-tab]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.querySelector(btn.dataset.scrollTab);
    if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});
const tabSections = document.querySelectorAll('[data-tab-section]');
if(tabSections.length){
  const tabBtns = document.querySelectorAll('[data-scroll-tab]');
  const tabIo = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        tabBtns.forEach(b=>b.classList.toggle('solid', b.dataset.scrollTab === '#'+entry.target.id));
      }
    });
  }, { rootMargin:'-45% 0px -45% 0px' });
  tabSections.forEach(s=>tabIo.observe(s));
}

// ============ PROJETO / EXECUÇÃO — ZIPPER REVEAL ============
// The "execução" photo unzips left-to-right, following the cursor/finger position.
document.querySelectorAll('.hover-compare').forEach(comp=>{
  const reveal = comp.querySelector('.reveal-layer');
  const seam = comp.querySelector('.compare-seam');
  const tagProjeto = comp.querySelector('.tag-projeto');
  const tagExecucao = comp.querySelector('.tag-execucao');

  function setPos(clientX){
    const r = comp.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    reveal.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    seam.style.left = pct + '%';
    seam.style.opacity = '1';
    tagProjeto.style.opacity = pct > 55 ? '0' : '1';
    tagExecucao.style.opacity = pct > 45 ? '1' : '0';
  }
  function reset(){
    reveal.style.clipPath = 'inset(0 100% 0 0)';
    seam.style.opacity = '0';
    tagProjeto.style.opacity = '1';
    tagExecucao.style.opacity = '0';
  }
  comp.addEventListener('mouseenter', e=> setPos(e.clientX));
  comp.addEventListener('mousemove', e=> setPos(e.clientX));
  comp.addEventListener('mouseleave', reset);
  comp.addEventListener('touchstart', e=> setPos(e.touches[0].clientX), { passive:true });
  comp.addEventListener('touchmove', e=> setPos(e.touches[0].clientX), { passive:true });
  comp.addEventListener('touchend', reset);
});

// ============ INSTAGRAM TAB (cosmetic) ============
document.querySelectorAll('.ig-tabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelector('.ig-tabs button.active')?.classList.remove('active');
    btn.classList.add('active');
  });
});

// ============ CONTACT FORM -> WHATSAPP ============
const contactForm = document.querySelector('#contact-form');
if(contactForm){
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = contactForm.nome.value.trim();
    const telefone = contactForm.telefone.value.trim();
    const mensagem = contactForm.mensagem.value.trim();
    const texto = `Olá! Meu nome é ${nome}.%0A${mensagem}%0A(Contato: ${telefone})`;
    window.open(`https://wa.me/5546999357929?text=${texto}`, '_blank');
  });
}

// ============ SCROLLSPY: HIGHLIGHT NAV LINK FOR SECTION IN VIEW ============
const topSections = [...document.querySelectorAll('main > section[id]')];
const navAnchors = [...document.querySelectorAll('nav.main-nav a[href^="#"], .mobile-nav a[href^="#"]')];
if(topSections.length && navAnchors.length){
  const setActive = id=>{
    navAnchors.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+id));
  };
  const spy = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
  topSections.forEach(s=>spy.observe(s));
  setActive(topSections[0].id);
}

// ============ SMOOTH-CLOSE MOBILE MENU ON ANY ANCHOR CLICK ============
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', ()=> mobileNav && mobileNav.classList.remove('open'));
});
