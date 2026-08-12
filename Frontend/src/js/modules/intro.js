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

    const letterC = overlay.querySelector('.intro-letter-c');
    const letterZ = overlay.querySelector('.intro-letter-z');

    // Cada letra gira em torno do próprio centro, não do centro do grupo.
    // Sem isto a contra-rotação desfaria a rotação do grupo por inteiro e as
    // letras voltariam a ficar lado a lado.
    gsap.set(letterC, { transformOrigin: ORIGIN_C });
    gsap.set(letterZ, { transformOrigin: ORIGIN_Z });

    const tl = gsap.timeline({
        onComplete: () => {
            // String vazia remove a regra inline; 'visible' sobrescreveria
            // o overflow-x do base.css pelo resto da sessão
            document.body.style.overflow = '';
            overlay.style.display = 'none';
        },
    });

    tl
        // Entrada: cada metade parte inteiramente fora da sua borda.
        // expo.out arranca rápido e assenta longo — leitura de peso e controle.
        .fromTo(letterC,
            { xPercent: -100, x: '-50vw' },
            { xPercent: 0, x: 0, duration: 0.95, ease: 'expo.out' }, 0)
        .fromTo(letterZ,
            { xPercent: 100, x: '50vw' },
            { xPercent: 0, x: 0, duration: 0.95, ease: 'expo.out' }, 0)

        // Halo sobe junto com o encaixe da marca
        .fromTo('.intro-glow',
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.35)

        // 810 = duas voltas + o quarto de volta que leva C ao topo e Z à base
        .to('.intro-cz-group',
            { rotation: 810, duration: 1.0, ease: 'power3.inOut' }, 1.15)

        // Desfaz o tombamento que o giro impõe aos glifos. Termina depois do
        // giro do grupo, para ler como assentamento e não como tremor.
        // O xPercent afasta as letras: empilhadas na distância original da
        // marca elas se cruzariam, porque o eixo x local vira o y da tela
        // depois do giro de 90 graus do grupo.
        .to(letterC,
            { rotation: -90, xPercent: -3, duration: 0.45, ease: 'power2.out' }, 1.95)
        .to(letterZ,
            { rotation: -90, xPercent: 3, duration: 0.45, ease: 'power2.out' }, 1.95)

        // Pausa em 2.40-2.55 para a forma empilhada respirar antes de sair.
        // A marca se dissolve crescendo, em vez de encolher.
        .to('.intro-cz-group',
            { opacity: 0, scale: 1.08, duration: 0.42, ease: 'power2.inOut' }, 2.55)
        .to('.intro-glow',
            { opacity: 0, duration: 0.5, ease: 'power2.in' }, 2.55)

        // Cortina: expo.inOut arranca com energia e desacelera muito devagar
        .to('.intro-split-top',
            { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 2.65)
        .to('.intro-split-bottom',
            { yPercent: 100, duration: 0.95, ease: 'expo.inOut' }, 2.65);
}
