// main.js — CzTechnology V1 Corporate Authority
// GSAP Animations + Chat Demo + Mobile Menu

import { initParticles } from './modules/particles.js';
import { initReveal } from './modules/reveal.js';
import { initChatDemo } from './modules/chat-demo.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initNavbarScroll } from './modules/navbar-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReveal();
    initChatDemo();
    initMobileMenu();
    initNavbarScroll();
});
