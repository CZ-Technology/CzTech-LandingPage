// Animação de abertura: a marca CZ se monta, gira e abre a cortina
const STORAGE_KEY = 'czIntroPlayed';

// Centro visual de cada letra dentro do viewBox compartilhado (727x355).
// C ocupa x[0,373] e Z ocupa x[338,727], daí 25.65% e 73.25%.
const ORIGIN_C = '25.65% 50%';
const ORIGIN_Z = '73.25% 50%';

// sessionStorage lança em modos de privacidade mais restritos
function markAsPlayed() {
    try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
        /* sem persistência: a intro volta a rodar no próximo load */
    }
}

function hasPlayed() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

export function initIntro() {
    const overlay = document.getElementById('introOverlay');
    if (!overlay) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || hasPlayed()) {
        overlay.style.display = 'none';
        markAsPlayed();
        return;
    }

    // Gravado no início: um reload no meio da animação não a repete
    markAsPlayed();
    document.body.style.overflow = 'hidden';

    const group = overlay.querySelector('.intro-cz-group');
    const letterC = overlay.querySelector('.intro-letter-c');
    const letterZ = overlay.querySelector('.intro-letter-z');

    // Cada letra gira em torno do próprio centro, não do centro do grupo.
    // Sem isto a contra-rotação desfaria a rotação do grupo por inteiro e as
    // letras voltariam a ficar lado a lado.
    gsap.set(letterC, { transformOrigin: ORIGIN_C });
    gsap.set(letterZ, { transformOrigin: ORIGIN_Z });

    // Quanto cada letra precisa andar para acompanhar a metade da tela a que
    // está colada. A cortina desliza 50vh; o eixo x local vira o y da tela
    // depois do giro de 90 graus, e xPercent é relativo à largura do grupo.
    // offsetWidth e não getBoundingClientRect: este último devolveria a caixa
    // já rotacionada.
    const ride = () => (window.innerHeight * 0.5 / group.offsetWidth) * 100;

    const tl = gsap.timeline({
        onComplete: () => {
            // String vazia remove a regra inline; 'visible' sobrescreveria
            // o overflow-x do base.css pelo resto da sessão
            document.body.style.overflow = '';
            overlay.style.display = 'none';
            // O ScrollTrigger se atualiza sozinho no evento load, que com as
            // imagens pesadas desta página cai dentro da intro — ou seja, mede
            // sem barra de rolagem e com o layout travado. Remede agora.
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        },
    });

    tl
        // Entrada a partir de fora da viewport. O ponto de partida espelha o
        // translateX do CSS crítico, para não haver salto no primeiro quadro.
        // power3.out, e não expo.out: o expo cobria 11% da distância já no
        // primeiro quadro e as letras pareciam nascer na borda.
        .fromTo(letterC,
            { x: '-100vw', xPercent: 0 },
            { x: 0, duration: 1.10, ease: 'power3.out' }, 0)
        .fromTo(letterZ,
            { x: '100vw', xPercent: 0 },
            { x: 0, duration: 1.10, ease: 'power3.out' }, 0)

        // Halo sobe junto com o encaixe da marca
        .fromTo('.intro-glow',
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.35)

        // 810 = duas voltas + o quarto de volta que leva C ao topo e Z à base
        .to(group,
            { rotation: 810, duration: 1.0, ease: 'power3.inOut' }, 1.30)

        // Desfaz o tombamento que o giro impõe aos glifos. Termina depois do
        // giro do grupo, para ler como assentamento e não como tremor.
        // O xPercent afasta as letras: empilhadas na distância original da
        // marca elas se cruzariam.
        .to(letterC,
            { rotation: -90, xPercent: -3, duration: 0.45, ease: 'power2.out' }, 2.10)
        .to(letterZ,
            { rotation: -90, xPercent: 3, duration: 0.45, ease: 'power2.out' }, 2.10)

        .to('.intro-glow',
            { opacity: 0, duration: 0.5, ease: 'power2.in' }, 2.65)

        // Cortina: expo.inOut arranca com energia e desacelera muito devagar
        .to('.intro-split-top',
            { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 2.75)
        .to('.intro-split-bottom',
            { yPercent: 100, duration: 0.95, ease: 'expo.inOut' }, 2.75)

        // As letras viajam coladas às metades: mesmo instante, mesma duração e
        // mesma curva da cortina. C sobe com a metade de cima, Z desce com a
        // de baixo.
        .to(letterC,
            { xPercent: () => -ride(), duration: 0.95, ease: 'expo.inOut' }, 2.75)
        .to(letterZ,
            { xPercent: () => ride(), duration: 0.95, ease: 'expo.inOut' }, 2.75)

        // Só então somem, já com a cortina em movimento
        .to('.intro-letter',
            { opacity: 0, duration: 0.65, ease: 'power2.in' }, 2.90);
}
