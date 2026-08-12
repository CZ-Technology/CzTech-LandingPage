// main.js — CzTechnology V1 Corporate Authority
// GSAP Animations + Chat Demo + Mobile Menu

import { initParticles } from './modules/particles.js';
import { initReveal } from './modules/reveal.js';
import { initChatDemo } from './modules/chat-demo.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initNavbarScroll } from './modules/navbar-scroll.js';
import { initIntro } from './modules/intro.js';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReveal();
    initChatDemo();
    initMobileMenu();
    initNavbarScroll();
    // Por último: o ScrollTrigger do reveal mede antes do lock de scroll
    initIntro();
});
