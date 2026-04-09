/* =============================================
   MAURÍCIO JÚNIOR — PORTFOLIO
   script.js
   ============================================= */

/* =============================================
   1. CURSOR MAGNÉTICO CUSTOMIZADO
   ============================================= */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Cursor principal: segue o mouse instantaneamente
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Anel externo: segue com delay (efeito elástico)
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

/* =============================================
   2. NOISE ORGÂNICO NO FUNDO (Canvas)
   ============================================= */
const noiseCanvas = document.getElementById('noise-canvas');
const noiseCtx   = noiseCanvas.getContext('2d');

function resizeNoise() {
  noiseCanvas.width  = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
}

resizeNoise();
window.addEventListener('resize', resizeNoise);

function drawNoise() {
  const imageData = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i]     = value; // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
    data[i + 3] = 255;   // A
  }

  noiseCtx.putImageData(imageData, 0, 0);

  // Atualiza a cada 100ms para não pesar o CPU
  setTimeout(() => requestAnimationFrame(drawNoise), 100);
}

drawNoise();

/* =============================================
   3. NAVBAR — SCROLL + PROGRESS BAR
   ============================================= */
const navbar       = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.body.scrollHeight - window.innerHeight;
  const percentage = (scrollTop / docHeight) * 100;

  // Adiciona classe ao rolar
  navbar.classList.toggle('scrolled', scrollTop > 50);

  // Atualiza barra de progresso
  scrollProgress.style.width = percentage + '%';
});

/* =============================================
   4. EFEITO DE DIGITAÇÃO (Typed)
   ============================================= */
const typedElement = document.getElementById('typed');

const words = [
  'Integrador de IA',
  'Builder de Produtos',
  'Aprendiz Determinado',
  'Criador de Experiências',
];

let wordIndex    = 0;
let charIndex    = 0;
let isDeleting   = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    // Digitando
    typedElement.textContent = currentWord.slice(0, ++charIndex);

    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800); // pausa no final da palavra
      return;
    }
  } else {
    // Apagando
    typedElement.textContent = currentWord.slice(0, --charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
    }
  }

  const speed = isDeleting ? 60 : 100;
  setTimeout(typeEffect, speed);
}

// Inicia após a animação do hero
setTimeout(typeEffect, 1500);

/* =============================================
   5. CARD 3D — Rotação ao mouse
   ============================================= */
const card3d = document.getElementById('card3d');

if (card3d) {
  const cardWrapper = card3d.parentElement;

  cardWrapper.addEventListener('mousemove', (e) => {
    const rect   = card3d.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top  + rect.height / 2;

    const rotateY =  ((e.clientX - centerX) / rect.width)  * 12;
    const rotateX = -((e.clientY - centerY) / rect.height) * 12;

    card3d.style.transform = `perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  cardWrapper.addEventListener('mouseleave', () => {
    card3d.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
  });
}

/* =============================================
   6. INTERSECTION OBSERVER — Animações de entrada
   ============================================= */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Anima as barras de skill quando entram na tela
      entry.target.querySelectorAll('.skill-bar').forEach((bar) => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, observerOptions);

// Observa todos os elementos que precisam de animação de entrada
const elementsToObserve = document.querySelectorAll(`
  section,
  .project-card,
  .skill-category,
  .contact-card,
  .about-visual,
  .about-text-col
`);

elementsToObserve.forEach((el) => observer.observe(el));

/* =============================================
   7. PROJECT CARDS — Delay escalonado
   ============================================= */
document.querySelectorAll('.project-card').forEach((card, index) => {
  card.style.transitionDelay = (index * 0.1) + 's';
});

/* =============================================
   8. PARALLAX NOS ORBS — Segue o mouse
   ============================================= */
const heroOrbs = document.querySelectorAll('.hero-orb');

document.addEventListener('mousemove', (e) => {
  const xPercent = (e.clientX / window.innerWidth)  - 0.5;
  const yPercent = (e.clientY / window.innerHeight) - 0.5;

  heroOrbs.forEach((orb, index) => {
    const factor = (index + 1) * 15;
    orb.style.transform = `translate(${xPercent * factor}px, ${yPercent * factor}px)`;
  });
});

/* =============================================
   9. SMOOTH SCROLL — Links da navegação
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const navHeight = 64;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* =============================================
   10. SKILL PILLS — Hover com brilho magnético
   ============================================= */
document.querySelectorAll('.skill-pill').forEach((pill) => {
  pill.addEventListener('mousemove', (e) => {
    const rect = pill.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    pill.style.setProperty('--glow-x', x + '%');
    pill.style.setProperty('--glow-y', y + '%');
  });
});
