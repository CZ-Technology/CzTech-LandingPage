// main.js — CzTechnology V1 Corporate Authority
// GSAP Animations + Chat Demo + Mobile Menu

document.addEventListener('DOMContentLoaded', () => {

    // ============ 0. HERO CANVAS PARTICLES ============
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        heroSection.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let cw, ch, dpr;
        let pts = [];
        const rand = (a, b) => a + Math.random() * (b - a);

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            cw = canvas.clientWidth;
            ch = canvas.clientHeight;
            canvas.width  = cw * dpr;
            canvas.height = ch * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initPts();
        };

        const initPts = () => {
            pts = [];
            const count = Math.min(130, Math.floor((cw * ch) / 10000));
            for (let i = 0; i < count; i++) {
                pts.push({
                    x: Math.random() * cw,
                    y: Math.random() * ch,
                    vx: rand(-0.28, 0.28),
                    vy: rand(-0.28, 0.28),
                    r: rand(0.7, 2.0),
                    base: rand(0.25, 0.8),
                    orange: Math.random() > 0.75,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, cw, ch);

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];

                // movimento + limite de velocidade
                p.x += p.vx; p.y += p.vy;
                p.vx += (Math.random() - 0.5) * 0.018;
                p.vy += (Math.random() - 0.5) * 0.018;
                const sp = Math.hypot(p.vx, p.vy);
                if (sp > 0.45) { p.vx = (p.vx / sp) * 0.45; p.vy = (p.vy / sp) * 0.45; }

                // wrap nas bordas
                if (p.x < -20) p.x = cw + 20; if (p.x > cw + 20) p.x = -20;
                if (p.y < -20) p.y = ch + 20; if (p.y > ch + 20) p.y = -20;

                ctx.fillStyle = p.orange
                    ? `rgba(255,122,0,${p.base})`
                    : `rgba(255,255,255,${p.base})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        draw();
    }


    gsap.registerPlugin(ScrollTrigger);

    // ============ 1. GSAP REVEAL ============
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

    // ============ 2. CHAT DEMO ============
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
        const messages = [
            { from: 'user', text: 'Vocês entregam em SP capital?', t: 200 },
            { from: 'bot', text: 'Sim! Entregamos em SP capital com prazo de 24h. Posso já agendar?', t: 1400 },
            { from: 'user', text: 'Pode sim, amanhã de manhã', t: 2800 },
            { from: 'bot', text: 'Perfeito ✓ Agendado para amanhã 09h. Vou te enviar a confirmação por aqui.', t: 4000 },
        ];

        function runChat() {
            chatBody.innerHTML = '';
            const timers = [];

            messages.forEach((m, i) => {
                timers.push(setTimeout(() => {
                    if (m.from === 'bot') {
                        // Show typing
                        const typing = document.createElement('div');
                        typing.className = 'chat-typing';
                        typing.innerHTML = '<span></span><span></span><span></span>';
                        chatBody.appendChild(typing);
                        chatBody.scrollTop = chatBody.scrollHeight;

                        timers.push(setTimeout(() => {
                            typing.remove();
                            addMsg(m);
                        }, 700));
                    } else {
                        addMsg(m);
                    }
                }, m.t));
            });

            // Reset after full cycle
            timers.push(setTimeout(() => {
                chatBody.innerHTML = '';
            }, 7000));

            return timers;
        }

        function addMsg(m) {
            const div = document.createElement('div');
            div.className = `chat-msg ${m.from}`;
            div.textContent = m.text;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        // Initial run + loop
        let timers = runChat();
        setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runChat();
        }, 8000);
    }

    // ============ 3. MOBILE MENU ============
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // ============ 4. NAVBAR HIDE ON SCROLL ============
    const navbar = document.getElementById('navbar');
    if (navbar) {
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
});
