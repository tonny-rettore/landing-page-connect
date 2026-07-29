/* =========================================================================
   CONNECT PRODUÇÕES E MARKETING — LANDING PAGE
   JavaScript principal
   Organizado em funções reutilizáveis, inicializadas em DOMContentLoaded.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initClientsCarousel();
  initServicesPanel();
  initCaseModal();
  initWhatsappFloat();
  initFooterYear();
  initHeroSignal();
});

/* -------------------------------------------------------------------------
 * 1. NAVBAR: reduz altura, aplica blur e sombra ao rolar a página
 * ---------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 40;

  const updateNavbarLogo = (isScrolled) => {
    const logoImg = navbar.querySelector('.navbar-brand-connect img');
    if (!logoImg) return;
    const targetSrc = isScrolled ? logoImg.dataset.logoDark : logoImg.dataset.logoLight;
    if (targetSrc && logoImg.getAttribute('src') !== targetSrc) {
      logoImg.setAttribute('src', targetSrc);
    }
  };

  const handleScroll = () => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('is-scrolled', isScrolled);
    updateNavbarLogo(isScrolled);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Estado inicial

  // Marca o link ativo conforme a seção visível (navegação por scroll)
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a.nav-link-item');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

/* -------------------------------------------------------------------------
 * 2. MENU MOBILE: abre/fecha o menu off-canvas e overlay
 * ---------------------------------------------------------------------- */
function initMobileMenu() {
  const toggler = document.getElementById('navToggler');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  if (!toggler || !navLinks || !overlay) return;

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    toggler.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navLinks.classList.add('is-open');
    overlay.classList.add('is-visible');
    toggler.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggler.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em qualquer link (scroll suave nativo do CSS)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha o menu com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* -------------------------------------------------------------------------
 * 3. SCROLL REVEAL: anima elementos com [data-reveal] ao entrarem na viewport
 * ---------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
 * 4. CARROSSEL DE CLIENTES: duplica os logos para permitir loop infinito via CSS
 * ---------------------------------------------------------------------- */
function initClientsCarousel() {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  // Duplica o conteúdo uma vez, permitindo animar de 0% a -50% sem "salto"
  const clone = track.innerHTML;
  track.insertAdjacentHTML('beforeend', clone);

  // Torna os clones decorativos invisíveis para leitores de tela
  const originalCount = track.children.length / 2;
  Array.from(track.children)
    .slice(originalCount)
    .forEach((el) => el.setAttribute('aria-hidden', 'true'));
}

/* -------------------------------------------------------------------------
 * 5. SERVIÇOS: alterna o conteúdo da coluna direita conforme o item ativo
 * ---------------------------------------------------------------------- */
function initServicesPanel() {
  const menuItems = document.querySelectorAll('.service-menu-item');
  const panels = document.querySelectorAll('.service-panel-content');
  if (!menuItems.length || !panels.length) return;

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.service;

      menuItems.forEach((btn) => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'true');

      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });
}

/* -------------------------------------------------------------------------
 * 6. MODAL DE CASES: preenche o modal Bootstrap com os dados do case clicado
 * ---------------------------------------------------------------------- */
const CASE_DATA = [
  {
    name: 'Vértice Moda',
    segment: 'Varejo de Moda',
    problem: 'Perfil desorganizado, sem identidade visual definida e baixo engajamento nas redes sociais.',
    strategy: 'Criação de nova identidade visual para o Instagram, calendário editorial mensal e produção de conteúdo em estúdio.',
    solutions: 'Captações quinzenais, reels de bastidores e lançamento de coleções, além de organização completa do feed.',
    metrics: [
      { value: '+180%', label: 'Engajamento' },
      { value: '+3.400', label: 'Novos seguidores' },
      { value: '+65%', label: 'Vendas via Instagram' },
    ],
    images: ['../assets/cases/case-1.svg', '../assets/cases/case-1.svg', '../assets/cases/case-1.svg'],
  },
  {
    name: 'Oráculo Estética',
    segment: 'Clínica de Estética',
    problem: 'Agenda com baixa ocupação e dependência exclusiva de indicações.',
    strategy: 'Campanhas de tráfego pago segmentadas por procedimento, com página de captura dedicada para agendamentos.',
    solutions: 'Estruturação de funil de anúncios no Meta Ads, remarketing para visitantes do site e automação de resposta inicial.',
    metrics: [
      { value: '+210%', label: 'Agendamentos' },
      { value: 'R$ 18', label: 'Custo por lead' },
      { value: '+40%', label: 'Ocupação da agenda' },
    ],
    images: ['../assets/cases/case-2.svg', '../assets/cases/case-2.svg', '../assets/cases/case-2.svg'],
  },
  {
    name: 'Grão Café',
    segment: 'Food Service',
    problem: 'Baixo movimento em horários específicos e pouca visibilidade local.',
    strategy: 'Produção de reels mostrando bastidores e cardápio, além de otimização do Google Business.',
    solutions: 'Captação semanal em vídeo, stories diários e campanha local de tráfego pago para horários de menor movimento.',
    metrics: [
      { value: '+95%', label: 'Visualizações' },
      { value: '+50%', label: 'Movimento no horário alvo' },
      { value: '+4,8★', label: 'Avaliação no Google' },
    ],
    images: ['../assets/cases/case-3.svg', '../assets/cases/case-3.svg', '../assets/cases/case-3.svg'],
  },
  {
    name: 'Nova Alfa Educação',
    segment: 'Educação',
    problem: 'Dificuldade em captar matrículas fora do período de rematrícula.',
    strategy: 'Automação de atendimento via WhatsApp e campanhas de captação de leads segmentadas por faixa etária.',
    solutions: 'Fluxo automatizado de qualificação de leads, landing page de matrícula e conteúdo institucional recorrente.',
    metrics: [
      { value: '+130%', label: 'Leads qualificados' },
      { value: '-35%', label: 'Custo por matrícula' },
      { value: '+22%', label: 'Novas matrículas' },
    ],
    images: ['../assets/cases/case-4.svg', '../assets/cases/case-4.svg', '../assets/cases/case-4.svg'],
  },
  {
    name: 'Atlas Imóveis',
    segment: 'Imobiliária',
    problem: 'Site institucional desatualizado e sem geração de leads própria.',
    strategy: 'Desenvolvimento de site institucional com landing pages específicas por empreendimento e otimização de SEO local.',
    solutions: 'Novo site responsivo, formulários de interesse por imóvel e integração com WhatsApp para atendimento imediato.',
    metrics: [
      { value: '+300%', label: 'Leads pelo site' },
      { value: '-45%', label: 'Tempo de carregamento' },
      { value: 'Top 3', label: 'No Google local' },
    ],
    images: ['../assets/cases/case-5.svg', '../assets/cases/case-5.svg', '../assets/cases/case-5.svg'],
  },
  {
    name: 'Aurora Fit',
    segment: 'Fitness & Saúde',
    problem: 'Alto índice de cancelamento de planos e pouca conexão com a comunidade local.',
    strategy: 'Produção de conteúdo em estúdio com foco em transformação de alunos e campanhas de tráfego pago para vendas de planos.',
    solutions: 'Captação mensal com alunos reais, stories motivacionais diários e campanha de remarketing para ex-alunos.',
    metrics: [
      { value: '+70%', label: 'Novas matrículas' },
      { value: '-28%', label: 'Cancelamentos' },
      { value: '+150%', label: 'Interações no perfil' },
    ],
    images: ['../assets/cases/case-6.svg', '../assets/cases/case-6.svg', '../assets/cases/case-6.svg'],
  },
];

function initCaseModal() {
  const modalEl = document.getElementById('caseModal');
  const modalBody = document.getElementById('caseModalBody');
  const modalTitle = document.getElementById('caseModalLabel');
  const triggers = document.querySelectorAll('[data-case]');
  if (!modalEl || !modalBody || !triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const index = parseInt(trigger.dataset.case, 10);
      const data = CASE_DATA[index];
      if (!data) return;

      modalTitle.textContent = `${data.name} — ${data.segment}`;

      modalBody.innerHTML = `
        <div class="case-metrics">
          ${data.metrics
            .map(
              (m) => `
            <div class="metric-item">
              <div class="metric-value">${m.value}</div>
              <div class="metric-label">${m.label}</div>
            </div>`
            )
            .join('')}
        </div>

        <div class="case-block">
          <h6>Problema enfrentado</h6>
          <p>${data.problem}</p>
        </div>

        <div class="case-block">
          <h6>Estratégia aplicada</h6>
          <p>${data.strategy}</p>
        </div>

        <div class="case-block">
          <h6>Soluções implementadas</h6>
          <p>${data.solutions}</p>
        </div>

        <div class="case-block">
          <h6>Registros do projeto</h6>
          <div class="case-gallery">
            ${data.images
              .map((src) => `<img src="${src}" alt="Registro do case ${data.name}" loading="lazy">`)
              .join('')}
          </div>
        </div>
      `;
    });
  });
}

/* -------------------------------------------------------------------------
 * 7. WHATSAPP FLUTUANTE: reposiciona quando o rodapé entra na tela
 * ---------------------------------------------------------------------- */
function initWhatsappFloat() {
  const floatBtn = document.getElementById('whatsappFloat');
  const footer = document.querySelector('.footer-connect');
  if (!floatBtn || !footer) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        floatBtn.classList.toggle('is-docked', entry.isIntersecting);
        if (entry.isIntersecting) {
          footer.style.position = 'relative';
          footer.appendChild(floatBtn);
        } else if (floatBtn.parentElement !== document.body) {
          document.body.appendChild(floatBtn);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(footer);
}

/* -------------------------------------------------------------------------
 * 8. RODAPÉ: atualiza o ano corrente automaticamente
 * ---------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* -------------------------------------------------------------------------
 * 9. HERO SIGNAL: gera a rede de pontos conectados (elemento de assinatura)
 * ---------------------------------------------------------------------- */
function initHeroSignal() {
  const svg = document.getElementById('heroSignal');
  if (!svg) return;

  const NUM_POINTS = 26;
  const WIDTH = 1200;
  const HEIGHT = 800;
  const MAX_DISTANCE = 230;

  const points = Array.from({ length: NUM_POINTS }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
  }));

  const svgNS = 'http://www.w3.org/2000/svg';
  const fragment = document.createDocumentFragment();

  // Linhas entre pontos próximos
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAX_DISTANCE) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', points[i].x.toFixed(1));
        line.setAttribute('y1', points[i].y.toFixed(1));
        line.setAttribute('x2', points[j].x.toFixed(1));
        line.setAttribute('y2', points[j].y.toFixed(1));
        line.setAttribute('stroke', '#6E8FD3');
        line.setAttribute('stroke-width', '0.6');
        line.setAttribute('opacity', (1 - distance / MAX_DISTANCE).toFixed(2));
        fragment.appendChild(line);
      }
    }
  }

  // Pontos com leve animação de pulsação escalonada
  points.forEach((point, index) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', point.x.toFixed(1));
    circle.setAttribute('cy', point.y.toFixed(1));
    circle.setAttribute('r', '2.4');
    circle.setAttribute('fill', '#FFFFFF');

    const animate = document.createElementNS(svgNS, 'animate');
    animate.setAttribute('attributeName', 'opacity');
    animate.setAttribute('values', '0.35;1;0.35');
    animate.setAttribute('dur', `${4 + (index % 5)}s`);
    animate.setAttribute('repeatCount', 'indefinite');
    animate.setAttribute('begin', `${(index % 6) * 0.3}s`);

    circle.appendChild(animate);
    fragment.appendChild(circle);
  });

  svg.appendChild(fragment);
}