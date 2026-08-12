// Simulação de chat da seção AI Demo
export function initChatDemo() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const messages = [
        { from: 'user', text: 'Vocês entregam em SP capital?', t: 200 },
        { from: 'bot', text: 'Sim! Entregamos em SP capital com prazo de 24h. Posso já agendar?', t: 1400 },
        { from: 'user', text: 'Pode sim, amanhã de manhã', t: 2800 },
        { from: 'bot', text: 'Perfeito ✓ Agendado para amanhã 09h. Vou te enviar a confirmação por aqui.', t: 4000 },
    ];

    function addMsg(m) {
        const div = document.createElement('div');
        div.className = `chat-msg ${m.from}`;
        div.textContent = m.text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

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

    // Initial run + loop
    let timers = runChat();
    setInterval(() => {
        timers.forEach(clearTimeout);
        timers = runChat();
    }, 8000);
}
