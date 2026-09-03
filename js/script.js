/* == SCRIPT PRINCIPAL ==
  Os recursos da página são inicializados quando o HTML termina de carregar. */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initStatsCounter();
    initClientsCarousel();
    initServicesPanel();
    initCaseModal();
    initPlanSelector();
    initFooterYear();
    initHeroSignal();
});

/* == MENU PRINCIPAL == */
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
    handleScroll(); // Aplica o estado certo já na abertura

    // Destaca no menu a seção que está na tela
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

/* == MENU NO CELULAR == */
function initMobileMenu() {
    const collapseEl = document.getElementById('navLinks');
    if (!collapseEl || typeof bootstrap === 'undefined') return;

    collapseEl.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (collapseEl.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
            }
        });
    });
}

/* == ENTRADA DOS ELEMENTOS == */
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

/* == CONTADORES == */
function initStatsCounter() {
    const statEls = document.querySelectorAll('.stat-value[data-count-to]');
    if (!statEls.length) return;

    const DURATION = 1400; // ms

    const animateCount = (el) => {
        const target = parseFloat(el.dataset.countTo);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / DURATION, 1);
            // Desacelera no final para a contagem não parar de repente
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = value.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(decimals) + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
        statEls.forEach(animateCount);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.6 }
    );

    statEls.forEach((el) => observer.observe(el));
}

/* == CARROSSEL DE CLIENTES == */
function initClientsCarousel() {
    const track = document.getElementById('clientsTrack');
    if (!track) return;

    // A cópia permite que a animação recomece sem um salto visível
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);

    // A cópia é só visual e não precisa ser lida duas vezes
    const originalCount = track.children.length / 2;
    Array.from(track.children)
        .slice(originalCount)
        .forEach((el) => el.setAttribute('aria-hidden', 'true'));
}

/* == SERVIÇOS == */
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

/* == DETALHES DOS PROJETOS == */
const CASE_DATA = [
    {
        name: 'Montra',
        segment: 'Centro Automotivo',
        problem: 'A Montra já entregava qualidade no dia a dia, mas essa percepção ainda não estava sendo transmitida para um público maior no digital.',
        strategy: 'Criar uma comunicação mais próxima e profissional, mostrando a estrutura, os serviços e a qualidade da empresa através de conteúdo estratégico.',
        solutions: 'Produção de vídeos, criação de roteiros, gestão de redes sociais e conteúdos voltados para gerar alcance, reconhecimento e autoridade regional.',
        metrics: [
            { value: '+882 MIL', label: 'Visualizações' },
            { value: '+900', label: 'Novos Seguidores' },
            { value: '+22 MIL', label: 'Interações' },
        ],
    },
    {
        name: 'Lottermann',
        segment: 'Barbearia',
        problem: 'A comunicação mostrava principalmente o serviço, mas ainda não transmitia toda a experiência, personalidade e identidade da Lottermann.',
        strategy: 'Construir uma identidade digital mais autêntica, mostrando o ambiente, os profissionais e a experiência por trás do serviço.',
        solutions: 'Produção de reels, criação de roteiros, conteúdo audiovisual, gestão de redes sociais e posicionamento de marca para aproximar a Lottermann do público.',
        metrics: [
            { value: '+233 MIL', label: 'Visualizações' },
            { value: '+4,2 MIL', label: 'Interações' },
            { value: '+700', label: 'Novos seguidores líquidos' },
        ],
    },
    {
        name: 'Stock Car',
        segment: 'Estética Automotiva',
        problem: 'A necessidade de ampliar a visibilidade da marca no digital sem transformar sua comunicação em uma sequência de propagandas.',
        strategy: 'Desenvolver conteúdos mais dinâmicos e interessantes, transformando a rotina da empresa em formatos capazes de gerar atenção e conexão com o público.',
        solutions: 'Criação de ideias e roteiros, produção audiovisual, gestão de redes sociais, tráfego pago e acompanhamento dos resultados para otimizar a estratégia.',
        metrics: [
            { value: '+350 MIL', label: 'Visualizações' },
            { value: '+90 MIL', label: 'Contas alcançadas' },
            { value: '+1.000', label: 'Novos seguidores' },
        ],
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

            const periodTextMap = {
                'Montra': 'Alguns resultados',
                'Stock Car': 'Em 30 dias',
                'Lottermann': 'E os resultados aparecem',
            };

            const periodText = periodTextMap[data.name] || 'Últimos 90 dias';

            modalBody.innerHTML = `
        <div class="case-results-header">
          <strong>${periodText}</strong>
        </div>

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
      `;
        });
    });
}

/* == PLANOS == */
function initPlanSelector() {
    const WHATSAPP_NUMBER = '555596288142'; // Mesmo número usado nos outros CTAs

    const radios = document.querySelectorAll('input[name="plano"]');
    const cards = document.querySelectorAll('.plan-card');
    const nameEl = document.getElementById('planSelectedName');
    const ctaBtn = document.getElementById('planCtaBtn');
    const personalizadoRadio = document.getElementById('planoPersonalizadoRadio');

    if (!radios.length || !ctaBtn) return;

    const customFields = [
        document.getElementById('customReels'),
        document.getElementById('customStories'),
        document.getElementById('customTrafego'),
        document.getElementById('customLanding'),
        document.getElementById('customCaptacao'),
    ].filter(Boolean);

    const buildMessage = () => {
        const selected = document.querySelector('input[name="plano"]:checked');
        const planName = selected ? selected.value : 'Básico';

        if (planName === 'Personalizado') {
            const reels = document.getElementById('customReels')?.value || '0';
            const stories = document.getElementById('customStories')?.value || '0';
            const extraFields = [
                ['customTrafego', 'Tráfego pago'],
                ['customLanding', 'Landing page'],
                ['customCaptacao', 'Captação sob demanda'],
            ];
            const extras = extraFields
                .filter(([id]) => document.getElementById(id)?.checked)
                .map(([, label]) => label);

            let message = `Olá! Quero montar um plano personalizado com ${reels} reels e ${stories} stories por mês`;
            if (extras.length) message += `, incluindo: ${extras.join(', ')}`;
            return `${message}.`;
        }

        return `Olá! Quero solicitar um orçamento do plano ${planName}.`;
    };

    const updateSelection = () => {
        const selected = document.querySelector('input[name="plano"]:checked');
        const planName = selected ? selected.value : 'Básico';

        cards.forEach((card) => {
            const input = card.querySelector('.plan-radio');
            card.classList.toggle('is-selected', Boolean(input && input.checked));
        });

        if (nameEl) nameEl.textContent = planName;
        ctaBtn.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`);
    };

    radios.forEach((radio) => radio.addEventListener('change', updateSelection));

    // Ao editar um campo, o plano personalizado vira a escolha atual
    customFields.forEach((field) => {
        ['input', 'change'].forEach((evt) => {
            field.addEventListener(evt, () => {
                if (personalizadoRadio) personalizadoRadio.checked = true;
                updateSelection();
            });
        });
    });

    updateSelection();
}

/* == RODAPÉ == */
function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* == REDE DE PONTOS == */
function initHeroSignal() {
    renderSignalNetwork('heroSignal', { numPoints: 26, maxDistance: 230 });
    renderSignalNetwork('diffSignal', { numPoints: 16, maxDistance: 240 });
}

function renderSignalNetwork(svgId, options = {}) {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    const {
        numPoints: NUM_POINTS = 24,
        maxDistance: MAX_DISTANCE = 220,
        width: WIDTH = 1200,
        height: HEIGHT = 800,
    } = options;

    const points = Array.from({ length: NUM_POINTS }, () => ({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
    }));

    const svgNS = 'http://www.w3.org/2000/svg';
    const fragment = document.createDocumentFragment();

    // Liga os pontos que estão próximos
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

    // Cada ponto pulsa em um momento diferente
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