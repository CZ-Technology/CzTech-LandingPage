// Animação de entrada (fade+slide) via GSAP ScrollTrigger
export function initReveal() {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.reveal').forEach(el => {
        const delay = parseInt(el.dataset.delay || '0', 10) / 1000;
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out',
        });
    });
}
