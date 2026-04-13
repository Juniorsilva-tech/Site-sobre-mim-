/* ============================================
   MAURÍCIO JÚNIOR — PORTFOLIO v2
   script.js
   ============================================ */

/* ============================================
   1. CURSOR MAGNÉTICO
   ============================================ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});

(function animCursor(){
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animCursor);
})();

/* ============================================
   2. PARTICLE CANVAS
   ============================================ */
const pc = document.getElementById('particle-canvas');
const pctx = pc.getContext('2d');
let particles = [];

function resizePC(){ pc.width=window.innerWidth; pc.height=window.innerHeight; }
resizePC();
window.addEventListener('resize',()=>{resizePC();initParticles();});

function initParticles(){
  particles=[];
  const count = Math.floor(window.innerWidth/12);
  for(let i=0;i<count;i++){
    particles.push({
      x:Math.random()*pc.width, y:Math.random()*pc.height,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.5+.3,
      a:Math.random()*.6+.1,
    });
  }
}
initParticles();

function drawParticles(){
  pctx.clearRect(0,0,pc.width,pc.height);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=pc.width; if(p.x>pc.width)p.x=0;
    if(p.y<0)p.y=pc.height; if(p.y>pc.height)p.y=0;
    pctx.beginPath();
    pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.fillStyle=`rgba(168,85,247,${p.a})`;
    pctx.fill();
  });
  /* linhas entre partículas próximas */
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<100){
        pctx.beginPath();
        pctx.moveTo(particles[i].x,particles[i].y);
        pctx.lineTo(particles[j].x,particles[j].y);
        pctx.strokeStyle=`rgba(124,58,237,${.15*(1-dist/100)})`;
        pctx.lineWidth=.5;
        pctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================================
   3. NAVBAR + SCROLL PROGRESS
   ============================================ */
const navbar = document.getElementById('navbar');
const sp     = document.getElementById('scroll-progress');

window.addEventListener('scroll',()=>{
  const s=window.scrollY;
  navbar.classList.toggle('scrolled',s>50);
  sp.style.width=(s/(document.body.scrollHeight-window.innerHeight)*100)+'%';
});

/* ============================================
   4. MENU MOBILE
   ============================================ */
const toggle = document.getElementById('menuToggle');
const mMenu  = document.getElementById('mobileMenu');

toggle.addEventListener('click',()=>{
  mMenu.classList.toggle('open');
  toggle.classList.toggle('active');
});
document.querySelectorAll('.mobile-link').forEach(l=>{
  l.addEventListener('click',()=>{
    mMenu.classList.remove('open');
    toggle.classList.remove('active');
  });
});

/* ============================================
   5. TYPED ROLE EFFECT
   ============================================ */
const roles = ['sistemas full stack','agentes de IA','APIs robustas','experiências web','automações inteligentes'];
const typedEl = document.getElementById('typed-role');
let ri=0,ci=0,del=false;

function typeRole(){
  const w=roles[ri];
  if(!del){ typedEl.textContent=w.slice(0,++ci);
    if(ci===w.length){del=true;setTimeout(typeRole,2000);return;}
  } else { typedEl.textContent=w.slice(0,--ci);
    if(ci===0){del=false;ri=(ri+1)%roles.length;}
  }
  setTimeout(typeRole,del?55:95);
}
setTimeout(typeRole,1400);

/* ============================================
   6. CONTADORES ANIMADOS
   ============================================ */
function animateCounter(el){
  const target=+el.dataset.target;
  let current=0;
  const step=target/50;
  const timer=setInterval(()=>{
    current=Math.min(current+step,target);
    el.textContent=Math.round(current);
    if(current>=target)clearInterval(timer);
  },30);
}

/* ============================================
   7. INTERSECTION OBSERVER — animações de entrada
   ============================================ */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    el.classList.add('in-view');

    /* barras skill */
    el.querySelectorAll('.sk-bar').forEach(b=>{b.style.width=b.dataset.w+'%';});

    /* contadores */
    el.querySelectorAll('.stat-num').forEach(animateCounter);

    io.unobserve(el);
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.proj-card,.tl-item').forEach(el=>io.observe(el));
document.querySelectorAll('#hero .hero-stats').forEach(el=>io.observe(el));

/* ============================================
   8. SKILL TABS
   ============================================ */
document.querySelectorAll('.stab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const id=tab.dataset.tab;
    document.querySelectorAll('.stab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.skill-panel').forEach(p=>p.classList.remove('active'));
    const panel=document.getElementById('panel-'+id);
    if(panel){
      panel.classList.add('active');
      panel.querySelectorAll('.sk-bar').forEach(b=>{b.style.width='0';});
      setTimeout(()=>panel.querySelectorAll('.sk-bar').forEach(b=>{b.style.width=b.dataset.w+'%';}),80);
    }
  });
});

/* ============================================
   9. PARALLAX ORBS
   ============================================ */
const orbs = document.querySelectorAll('.hero-orb');
document.addEventListener('mousemove',e=>{
  const xp=(e.clientX/window.innerWidth-.5);
  const yp=(e.clientY/window.innerHeight-.5);
  orbs.forEach((o,i)=>{
    const f=(i+1)*18;
    o.style.transform=`translate(${xp*f}px,${yp*f}px)`;
  });
});

/* ============================================
   10. CARD 3D — SOBRE
   ============================================ */
const card3d = document.querySelector('.about-card');
if(card3d){
  const wrap=card3d.parentElement;
  wrap.addEventListener('mousemove',e=>{
    const r=card3d.getBoundingClientRect();
    const rx2=((e.clientX-r.left-r.width/2)/r.width)*10;
    const ry2=-((e.clientY-r.top-r.height/2)/r.height)*10;
    card3d.style.transform=`perspective(500px) rotateY(${rx2}deg) rotateX(${ry2}deg)`;
  });
  wrap.addEventListener('mouseleave',()=>{card3d.style.transform='perspective(500px) rotateY(0) rotateX(0)';});
}

/* ============================================
   11. SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t){
      const offset=t.getBoundingClientRect().top+window.scrollY-60;
      window.scrollTo({top:offset,behavior:'smooth'});
    }
  });
});

/* ============================================
   12. ATIVAR BARS DE SKILL DO PAINEL INICIAL
   ============================================ */
setTimeout(()=>{
  document.querySelectorAll('#panel-fe .sk-bar').forEach(b=>{b.style.width=b.dataset.w+'%';});
},800);

/* ============================================
   13. SAUDAÇÃO DINÂMICA
   ============================================ */
const hour=new Date().getHours();
const gEl=document.querySelector('.greeting');
if(gEl){
  if(hour>=5&&hour<12)gEl.textContent='Bom dia! Eu sou';
  else if(hour>=12&&hour<18)gEl.textContent='Boa tarde! Eu sou';
  else gEl.textContent='Boa noite! Eu sou';
}
