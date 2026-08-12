// Partículas animadas no canvas do hero
export function initParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

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
