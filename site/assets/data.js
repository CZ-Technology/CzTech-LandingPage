// Conteúdo editável do site. Itens com ficticio: true são exemplos; trocar pelos reais.
window.CZ = {};
CZ.config = {
  video: false, // true quando assets/hero-scrub.mp4 existir
  videoBytes: 6000000,
  whatsapp: "5522992153465", // DDI 55 + DDD 22 + número, só dígitos
  mensagem: "Olá! Vi o site da CZ Tech e gostaria de receber a Auditoria Gratuita (Score GMN) do perfil da minha empresa. Como podemos começar?"
};

CZ.cases = [
  // Clientes reais. Só entra aqui número que o cliente confirmou ou que aparece no print do perfil.
  // Para acrescentar resultado de OMNIA e Eduarda Mello, preencher "stats" e "barras" como no Defende.
  { id: "defende", nome: "Defende", area: "Controle de pragas", cidade: "Cambé", img: "assets/phone-defende.webp",
    tag: "Case de Sucesso Real", titulo: "Defende · Controle de Pragas em Cambé",
    texto: "Perfil estagnado com menos de 30 interações mensais. Com a otimização estratégica iniciada em janeiro, o perfil mais que dobrou o volume de chamadas, solicitações de rota e acessos ao site em apenas 60 dias.",
    stats: [{ v: "198", l: "Interações em 4 Meses" }, { v: "+2x", l: "Aumento Real de Ligações e Rotas em 60 Dias" }],
    barras: { titulo: "Evolução do Volume de Interações Mensais", dados: [["dez", 30], ["jan", 60], ["fev", 75]] },
    nota: "Fonte: Dados oficiais do Painel do Perfil da Empresa no Google." },
  { id: "omnia", nome: "OMNIA", area: "Medicina integrativa", cidade: "Londrina", img: "assets/phone-omnia.webp",
    tag: "Perfil Autoridade no Google", titulo: "OMNIA · Medicina Integrativa em Londrina",
    texto: "Reestruturação completa do perfil com foco nas especialidades de endocrinologia, nutrologia e psiquiatria, fotos semânticas do espaço e reviews com avaliação máxima.",
    stats: [{ v: "5,0 ★", l: "Nota Máxima de Avaliação" }, { v: "8", l: "Avaliações no Perfil" }],
    nota: "Números lidos no print do perfil." },
  { id: "nail", nome: "Eduarda Mello", area: "Nail designer", cidade: "Londrina", img: "assets/phone-nail.webp",
    tag: "Perfil de Alta Conversão", titulo: "Eduarda Mello · Nail Designer em Londrina",
    texto: "Perfil enriquecido com fotos dos trabalhos, catálogo de serviços cadastrado e reviews otimizados, pronto para atrair quem busca estética das unhas na cidade.",
    stats: [{ v: "5,0 ★", l: "Nota de Satisfação dos Clientes" }, { v: "14", l: "Avaliações no Perfil" }],
    nota: "Números lidos no print do perfil." }
];

// Score GMN: espelha a planilha SCORE GMN.xlsx. curto = título no simulador, titulo = pergunta completa
const P = [88.889, 44.449, 0];
CZ.score = {
  perguntas: [
    { pilar: "basicos", curto: "Categoria Principal e Secundárias?", titulo: "Sua empresa está cadastrada na categoria principal exata e possui categorias secundárias relevantes ativadas?", dica: "A categoria principal define seu nicho primário; as secundárias capturam buscas complementares.",
      opcoes: ["Categoria principal exata e secundárias estratégicas configuradas","Apenas a categoria principal está configurada","Categoria incorreta, genérica ou não configurada"] },
    { pilar: "basicos", curto: "Padronização do NAP (Endereço e Contato)?", titulo: "Os dados de Nome, Endereço e Telefone (NAP) estão completos, precisos e padronizados sem divergências?",
      opcoes: ["Todos os dados estão 100% corretos, padronizados e verificados","Dados presentes, mas com pequenas divergências ou abreviações","Endereço ou telefone incorretos, desatualizados ou ausentes"] },
    { pilar: "basicos", curto: "Horários de Funcionamento & Feriados?", titulo: "Seus horários normais e especiais de feriados estão atualizados na ficha?",
      opcoes: ["Horários de atendimento totalmente atualizados, incluindo datas comemorativas","Apenas horário padrão preenchido (sem feriados)","Horários incorretos, desatualizados ou não cadastrados"] },
    { pilar: "basicos", curto: "Descrição Otimizada para IA?", titulo: "A descrição da empresa possui até 750 caracteres incluindo palavras-chave, localização e contexto para IA?",
      opcoes: ["Descrição completa, fluida, com termos de busca e diferenciais bem definidos","Descrição cadastrada, mas curta e sem foco em termos de busca","Descrição ausente ou incompleta"] },
    { pilar: "atualizacao", curto: "Fotografias e Contexto Visual?", titulo: "O perfil recebe fotos e vídeos frequentes da fachada, ambiente, produtos e equipe?", dica: "Imagens reais funcionam como sinais de leitura semântica visual para o algoritmo do Google e IAs.",
      opcoes: ["Fotos recentes de alta qualidade da estrutura, equipe, logo e fachada","Poucas fotos cadastradas ou desatualizadas","Sem fotos ou apenas imagens genéricas de banco de imagem"] },
    { pilar: "atualizacao", curto: "Gestão Ativa de Avaliações?", titulo: "A empresa responde a 100% das avaliações utilizando palavras-chave e nome da cidade?",
      opcoes: ["Responde a todas as avaliações com termos estratégicos e empatia","Responde apenas algumas avaliações e sem palavras-chave","Não responde às avaliações dos clientes"] },
    { pilar: "atualizacao", curto: "Frequência de Postagens na Ficha?", titulo: "A empresa publica atualizações, ofertas e novidades regularmente no perfil?",
      opcoes: ["Postagens periódicas ativas com botões de chamada à ação (CTA)","Publicações raras ou esporádicas","Nenhuma publicação recente"] },
    { pilar: "gatilhos", curto: "Catálogo de Produtos e Serviços?", titulo: "Seus principais produtos e serviços possuem descrições ricas e link direto para o WhatsApp?", dica: "Produtos e serviços detalhados ajudam o algoritmo e a IA a compreender exatamente o que você vende.",
      opcoes: ["Catálogo completo com descrições ricas e links diretos de atendimento","Apenas nomes dos serviços sem descrições detalhadas","Produtos e serviços não cadastrados"] },
    { pilar: "atualizacao", curto: "Interação e Perguntas e Respostas?", titulo: "O perfil monitora e responde às perguntas frequentes dos usuários?",
      opcoes: ["Seção de perguntas e respostas monitorada e preenchida preventivamente","Algumas dúvidas respondidas","Nenhuma pergunta respondida na ficha"] },
    { pilar: "gatilhos", curto: "Indexação em Diretórios NAP (50+ Sites)?", titulo: "As informações da empresa (NAP) estão padronizadas em diretórios de autoridade do Google?", dica: "Possui peso elevado no algoritmo para construção de autoridade local.",
      opcoes: ["Indexação presente e padronizada em múltiplos diretórios de autoridade","Presente em poucos diretórios com divergências de dados","Não possui cadastro ou indexação externa em diretórios"], pontos: [199.999, 100, 0] }
  ].map(q => ({ ...q, pontos: q.pontos || P })),
  pilares: { basicos: ["Dados Básicos", 356], atualizacao: ["Atualização & Sinais", 356], gatilhos: ["Gatilhos & IA", 289] },
  faixas: [
    { ate: 300, status: "RUIM", titulo: "Perfil Apagado e Vulnerável", cor: "#ef4444", texto: "Sua ficha possui falhas graves que impedem o ranqueamento no Google Maps. A empresa está invisível para novos clientes e doando vendas para a concorrência todos os dias." },
    { ate: 600, status: "REGULAR", titulo: "Perfil Visível, Mas Sem Destaque", cor: "#f59e0b", texto: "Sua empresa até aparece em buscas muito específicas, mas carece de otimização técnica, fotos semânticas e avaliações estratégicas para alcançar o Top 3 do mapa." },
    { ate: 900, status: "BOM", titulo: "Perfil Relevante. Pronto para Liderar.", cor: "#1a66d6", texto: "Sua ficha está bem estruturada, mas ainda necessita de ajustes avançados em diretórios de autoridade, busca conversacional e gestão contínua para assumir o 1º lugar." },
    { ate: 1000, status: "ÓTIMO", titulo: "Autoridade Máxima em Buscas Locais", cor: "#5fae12", texto: "Seu perfil no Google está no mais alto nível técnico. O próximo passo estratégico para acelerar o faturamento é conectar uma Landing Page de alta conversão." }
  ]
};
