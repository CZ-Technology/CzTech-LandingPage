// Animação de abertura: letras CZ entram, giram e abrem a cortina
const STORAGE_KEY = 'czIntroPlayed';

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

    const tl = gsap.timeline({
        onComplete: () => {
            // String vazia remove a regra inline; 'visible' sobrescreveria
            // o overflow-x do base.css pelo resto da sessão
            document.body.style.overflow = '';
            overlay.style.display = 'none';
        },
    });

    // Entrada: cada letra parte inteiramente fora da sua borda
    tl.fromTo('.intro-letter-c',
        { x: '-50vw', xPercent: -100 },
        { x: 0, xPercent: 0, duration: 0.9, ease: 'power3.out' }, 0)
        .fromTo('.intro-letter-z',
            { x: '50vw', xPercent: 100 },
            { x: 0, xPercent: 0, duration: 0.9, ease: 'power3.out' }, 0)
        // 810 = duas voltas + o quarto de volta que leva C ao topo e Z à base
        .to('.intro-cz-group',
            { rotation: 810, duration: 1.1, ease: 'power2.inOut' }, 0.9)
        // Desfaz o tombamento que o giro do grupo impõe aos glifos
        .to('.intro-letter',
            { rotation: -90, duration: 0.2, ease: 'power2.out' }, 1.8)
        .to('.intro-cz-group',
            { opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' }, 2.0)
        .to('.intro-split-top',
            { yPercent: -100, duration: 0.5, ease: 'power4.inOut' }, 2.0)
        .to('.intro-split-bottom',
            { yPercent: 100, duration: 0.5, ease: 'power4.inOut' }, 2.0);
}
