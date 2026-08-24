// Esconde navbar ao rolar pra baixo, mostra ao rolar pra cima
export function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 80 && currentScrollY > lastScrollY) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        navbar.style.boxShadow = currentScrollY > 50
            ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';
        lastScrollY = currentScrollY;
    }, { passive: true });
}
