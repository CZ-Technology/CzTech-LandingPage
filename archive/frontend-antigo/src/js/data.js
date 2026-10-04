// Conteúdo editável do site. Itens com `ficticio: true` são métricas de
// exemplo — trocar pelos números reais quando disponíveis.

export const config = {
  whatsapp: "5500000000000", // TROCAR: só dígitos, com DDI + DDD
  mensagem: "Olá! Vi o site da CZ Tech e quero agendar o diagnóstico gratuito da minha clínica."
};

export const stats = [
  { valor: 46, sufixo: "%", rotulo: "Buscas com intenção local", texto: "como “dentista perto de mim”", ficticio: true },
  { valor: 3, sufixo: "", rotulo: "Clínicas no topo do mapa", texto: "ficam com a maioria dos cliques" },
  { valor: 88, sufixo: "%", rotulo: "Leem avaliações antes", texto: "de marcar a primeira consulta", ficticio: true },
  { valor: 15, prefixo: "8–", sufixo: "%", rotulo: "Conversão das nossas landing pages", texto: "mercado: 2–5%", ficticio: true }
];

export const cases = [
  { nome: "Clínica Sorriso Pleno", cidade: "Londrina · PR", foco: "Implantes e prótese", ficticio: true,
    meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"], interacoes: [34, 52, 89, 131, 164, 212],
    destaques: [["+523%", "interações no perfil"], ["+41", "avaliações 5★ em 6 meses"], ["Top 3", "em “implante dentário Londrina”"]] },
  { nome: "OdontoVida Família", cidade: "Cambé · PR", foco: "Clínica geral e ortodontia", ficticio: true,
    meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"], interacoes: [21, 38, 60, 84, 97, 118],
    destaques: [["+190%", "ligações vindas do Google"], ["11,8%", "conversão da landing page"], ["−42%", "custo por agendamento"]] },
  { nome: "Studio Dental Estética", cidade: "Maringá · PR", foco: "Lentes e clareamento", ficticio: true,
    meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"], interacoes: [48, 61, 95, 120, 158, 186],
    destaques: [["+287%", "cliques para o WhatsApp"], ["4,9★", "nota média (era 4,3)"], ["27", "avaliações de lentes no mês 6"]] }
];

// Score GMN — espelha a planilha SCORE GMN.xlsx
const P = [88.889, 44.449, 0];
export const score = {
  perguntas: [
    { pilar: "basicos", titulo: "A clínica está cadastrada na categoria correta e relevante?", dica: "Ex.: “Dentista” + “Implantodontista”, “Ortodontista”.",
      opcoes: ["Sim, categoria principal e secundárias corretas", "Apenas categoria principal está correta", "Categoria incorreta ou não definida"] },
    { pilar: "basicos", titulo: "Os dados de endereço e contato estão completos e precisos?",
      opcoes: ["Sim, todos os dados estão corretos e atualizados", "Alguns dados estão corretos, mas não todos", "Dados estão incorretos ou incompletos"] },
    { pilar: "basicos", titulo: "O horário de funcionamento está atualizado?",
      opcoes: ["Sim, incluindo horários especiais e feriados", "Apenas horário padrão atualizado", "Não atualizado ou incorreto"] },
    { pilar: "basicos", titulo: "A descrição da clínica está completa e otimizada com palavras-chave?",
      opcoes: ["Sim, com palavras-chave e foco no diferencial", "Sim, mas sem palavras-chave ou pouco detalhada", "Incompleta ou inexistente"] },
    { pilar: "atualizacao", titulo: "O perfil tem fotos atuais e de alta qualidade?", dica: "Fachada, recepção, consultórios, equipe e logo.",
      opcoes: ["Sim, com fotos de localização, equipe e logo", "Algumas fotos, mas não de todos os tipos", "Sem fotos ou fotos inadequadas"] },
    { pilar: "atualizacao", titulo: "A clínica responde às avaliações regularmente?",
      opcoes: ["Sim, tanto positivas quanto negativas", "Sim, mas de forma esporádica", "Não responde as avaliações"] },
    { pilar: "atualizacao", titulo: "A clínica faz postagens regulares?",
      opcoes: ["Sim, com frequência e variedade", "Postagens esporádicas", "Não faz postagens"] },
    { pilar: "gatilhos", titulo: "Os principais tratamentos estão listados e descritos?", dica: "Ex.: implantes, ortodontia, clareamento, lentes, canal.",
      opcoes: ["Sim, com fotos e descrições", "Listados, mas sem detalhes ou fotos", "Não listados"] },
    { pilar: "atualizacao", titulo: "A clínica responde a perguntas de pacientes no perfil?",
      opcoes: ["Sim, regularmente e de forma completa", "Responde algumas perguntas", "Não responde"] },
    { pilar: "gatilhos", titulo: "A clínica está indexada em diretórios de confiança do Google?", dica: "Peso maior: vale até 200 pontos.",
      opcoes: ["Sim, está em todos os diretórios", "Encontrada em alguns diretórios apenas", "Não foi encontrada em nenhum"], pontos: [199.999, 100, 0] }
  ].map(q => ({ ...q, pontos: q.pontos || P })),
  pilares: { basicos: ["Dados básicos", 356], atualizacao: ["Atualização", 356], gatilhos: ["Gatilhos internos", 289] },
  faixas: [
    { ate: 300, status: "RUIM", cor: "#ef4444", texto: "O perfil tem deficiências sérias que comprometem a visibilidade e a confiança no Google. A clínica está deixando pacientes para o concorrente todos os dias." },
    { ate: 600, status: "REGULAR", cor: "#f59e0b", texto: "O perfil existe, mas está pouco preenchido ou mal configurado, o que prejudica o ranqueamento. Há potencial, mas sem otimização ele não se destaca." },
    { ate: 900, status: "BOM", cor: "#1a66d6", texto: "O perfil está bem configurado, mas ainda faltam recursos avançados como publicações frequentes e gestão de avaliações para chegar ao topo." },
    { ate: 1000, status: "ÓTIMO", cor: "#5fae12", texto: "Perfil totalmente otimizado e preparado para atrair pacientes com máxima eficiência. Agora o próximo passo é converter: landing page." }
  ]
};
