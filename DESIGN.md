---
name: CZ Technology
description: Automação inteligente para resultados reais — plataforma de agentes de IA para atendimento, processos e crescimento operacional B2B.
colors:
  navy-profundo: "#0F172A"
  surface: "#1E293B"
  texto-primario: "#F8F9FA"
  texto-secundario: "#94A3B8"
  borda: "#334155"
  laranja-sinal: "#FF6B35"
  laranja-sinal-hover: "#FF8657"
  laranja-sinal-active: "#E85A2A"
typography:
  display:
    fontFamily: "Space Grotesk, 'Segoe UI', sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontWeight: 600
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "50%"
components:
  button-primary:
    backgroundColor: "{colors.laranja-sinal}"
    textColor: "{colors.navy-profundo}"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.laranja-sinal-hover}"
  button-primary-active:
    backgroundColor: "{colors.laranja-sinal-active}"
---

# Design System: CZ Technology

## Overview

**Creative North Star: "O Sinal Claro"**

CZ TECH vende simplicidade operacional — a promessa é que agentes de IA absorvem a complexidade da rotina comercial em vez de somar mais uma ferramenta para aprender. O sistema visual traduz isso literalmente: ruído se resolve em um único sinal deliberado. Um campo navy profundo e quase sem decoração carrega o peso; um único laranja aparece só onde existe uma ação real a tomar, e o motivo assinatura do hero — linhas cinzas dispersas convergindo num único traço laranja — é essa mesma ideia desenhada.

A voz é confiante e contida: autoridade tecnológica que não precisa se provar com brilho. Silêncio visual é o luxo aqui, não escassez de recursos. O sistema rejeita explicitamente o vocabulário genérico de "AI slop" — gradiente roxo/azul brilhante, esferas 3D flutuantes, glow ambiente — em favor de tipografia com peso real, espaço negativo disciplinado e uma única cor de ação usada com extrema economia.

**Key Characteristics:**
- Campo único navy profundo (#0F172A), quase sem gradientes, sem imagem de fundo.
- Laranja de sinal usado exclusivamente em ação/conversão — nunca decorativo.
- Space Grotesk exclusivo para títulos; Inter para todo o resto.
- Motivo assinatura: caos (linhas cinzas) resolvendo-se em ordem (um traço laranja).
- Sombra existe em um único lugar do sistema: o botão de ação.

## Colors

Paleta restrita e deliberada: um campo neutro escuro, uma escala de cinza-azulado para hierarquia de texto/borda, e uma única cor saturada reservada para ação.

### Primary
- **Laranja de Sinal** (#FF6B35): a única cor saturada do sistema. Aparece somente em botões de conversão, links críticos, o estado ativo dos pontos de progresso, e o traço final do motivo gráfico do hero. Nunca usada como decoração, preenchimento de fundo ou destaque estético.

### Neutral
- **Navy Profundo** (#0F172A): campo de fundo de toda a página; também a cor do texto sobre o botão laranja (alto contraste).
- **Surface** (#1E293B): segunda camada tonal — usada para alternar o fundo de painéis (ex.: painel de capacidade par, faixa de CTA final, nav em estado sólido) sem introduzir uma nova cor.
- **Texto Primário** (#F8F9FA): títulos e texto de alto contraste.
- **Texto Secundário** (#94A3B8): parágrafos de corpo, labels de navegação em repouso, legendas.
- **Borda** (#334155): divisórias entre painéis, contornos de controle, cor de repouso dos pontos de progresso.

### Named Rules
**The Signal Rule.** O laranja de sinal ocupa menos de 5% de qualquer viewport. Sua raridade é o que o torna legível como "aja aqui" — usá-lo em mais de um elemento por tela dilui o sinal.

## Typography

**Display Font:** Space Grotesk (com fallback 'Segoe UI', sans-serif)
**Body Font:** Inter (com fallback -apple-system, sans-serif)

**Character:** Space Grotesk carrega peso geométrico e confiante nos títulos; Inter mantém o corpo neutro e altamente legível. O par nunca se mistura — um título nunca usa Inter, um parágrafo nunca usa Space Grotesk.

### Hierarchy
- **Display** (700, clamp(2.1rem, 5.6vw, 4.25rem), line-height 1.08): headline do hero, único uso do maior corte da escala.
- **Headline** (700, clamp(1.75rem, 4vw, 3rem), line-height 1.15–1.22): título de cada painel/seção (Diferencial, Como funciona, CTA final).
- **Title** (700, clamp(1.5rem, 3vw, 2.25rem)): título de cada capacidade dentro do painel "como funciona".
- **Body** (400, 1.0625rem, line-height 1.6, max 68ch): parágrafos correntes — largura de linha sempre limitada para legibilidade.
- **Label** (600, 0.875–0.9375rem): links de navegação, texto de botão; opacidade 0.85 em repouso subindo a 1 no hover em vez de mudar de cor.

### Named Rules
**The Weight Rule.** Nenhum título usa uma fonte genérica sem personalidade — Space Grotesk é obrigatório em h1–h3, sem exceção, mesmo em componentes novos.

## Layout

Painéis de viewport cheio (`min-height: 100svh`) empilhados com `scroll-snap-type: y mandatory` — uma ideia por tela, nunca duas se misturando no mesmo golpe de scroll. Conteúdo centralizado num container de `max-width: 1100px`. Nav fixo de 76px (`--header-h`) permanece presente sobre todos os painéis, alternando de transparente (sobre o hero) para sólido com blur ao cruzar a fronteira do hero.

Abaixo de 860px, a navegação colapsa num overlay de tela cheia com blur, o grid de duas colunas do painel de capacidade vira coluna única, e os pontos de progresso laterais somem (a rolagem por gesto substitui a navegação por clique). O rodapé é o único bloco fora do sistema de snap — rola livremente após o último painel.

## Elevation & Depth

Sistema quase inteiramente plano. Nenhuma superfície usa sombra em repouso; a profundidade entre blocos vem da alternância de tom (Navy Profundo ↔ Surface), não de elevação simulada. A única sombra do sistema pertence ao botão de ação primário — reforça que é o único elemento clicável que "levanta" fisicamente ao ser alcançável.

### Shadow Vocabulary
- **button-rest** (`box-shadow: 0 6px 16px -4px rgba(0,0,0,0.45)`): estado de repouso do botão primário.
- **button-hover** (`box-shadow: 0 10px 22px -4px rgba(0,0,0,0.5)`): botão primário no hover, junto com `translateY(-2px)`.

### Named Rules
**The One Shadow Rule.** Sombra existe em exatamente um componente do sistema — o botão de ação. Nenhum painel, cartão ou elemento de navegação recebe sombra; adicionar uma segunda fonte de elevação dilui o sinal de "isto é clicável".

## Shapes

Cantos discretamente arredondados nos controles (8px em botões, 6px em elementos menores como o toggle de menu, 4px no anel de foco), nunca nos painéis — os painéis em si são retangulares, edge-to-edge, sem raio algum, porque são o campo, não um objeto sobre o campo. O único círculo perfeito do sistema é o ponto de progresso (50%), reservado para esse controle específico.

## Components

### Buttons
- **Shape:** cantos suavemente arredondados (8px); `btn-large` mantém o mesmo raio, só aumenta padding.
- **Primary:** fundo Laranja de Sinal, texto Navy Profundo, padding `0.85rem 1.6rem`; a única sombra do sistema.
- **Hover / Focus:** hover troca para Laranja de Sinal Hover (#FF8657) e sobe 2px com sombra mais profunda; active escurece para Laranja de Sinal Active (#E85A2A) e volta à posição de repouso; foco usa anel de 2px na cor de ação, offset 3px.

### Navigation
- **Style:** fixo no topo, transparente com gradiente sutil sobre o hero, alterna para sólido (`rgba(15,23,42,0.85)` + blur 14px) ao cruzar a fronteira do hero via `IntersectionObserver`.
- **Typography:** labels em Inter 600, 0.9rem, opacidade 0.85 em repouso → 1 no hover (sem mudança de cor).
- **Mobile (<860px):** colapsa num overlay de tela cheia (`rgba(15,23,42,0.92)` + blur 18px), links em 1.375rem, hamburguer com três barras que giram em X.

### Progress Dots (componente assinatura)
Coluna vertical fixa de círculos de 9px, um por painel. Em repouso: cor de borda. Ativo (painel atual, via `IntersectionObserver`): escala 1.35× e vira Laranja de Sinal. Único indicador de estado no sistema que usa escala como sinal, não só cor.

### Capability Panel (componente assinatura)
Painel de viewport cheio que combina um numeral-índice monumental (Space Grotesk 700, 4.5–9rem, contorno via `-webkit-text-stroke` na cor de superfície em vez de preenchimento sólido — o número é estrutura, não conteúdo) com um ícone de linha em laranja e prosa. Fundo alterna Navy Profundo / Surface painel a painel para dar ritmo sem introduzir nova cor.

### Hero Signal Graphic (componente assinatura)
O motivo gráfico central do sistema, construído em SVG puro — nenhuma fotografia de estoque. Oito traços cinza (`--borda`, largura 1.5–2px, opacidade 0.35–0.6 crescente em direção ao centro) entram pela esquerda e convergem visualmente sem ponto de marcador; a partir daí, um único traço laranja (4.5px) continua e se desenha (`stroke-dashoffset`, 2.6s) ao carregar a página. Sob `prefers-reduced-motion`, o traço aparece completo, sem animação. Este é o dispositivo de imagem padrão do sistema — substitui fotografia de paisagem, que foi explicitamente rejeitada por não ter relação com o negócio.

## Do's and Don'ts

### Do:
- **Do** reservar Laranja de Sinal exclusivamente para botões de conversão, links críticos e o traço final do motivo gráfico — nunca decoração.
- **Do** usar Space Grotesk 700 em todo título (h1–h3); nunca uma fonte genérica sem personalidade nesse papel.
- **Do** manter o motivo "caos que se resolve em um traço" como o dispositivo de imagem assinatura do sistema ao invés de fotografia de estoque.
- **Do** respeitar `prefers-reduced-motion`: desativar o desenho do traço, o pulso dos pontos e qualquer scroll-snap forçado.
- **Do** limitar sombra ao botão de ação primário; toda outra profundidade vem de alternância de tom (Navy ↔ Surface).

### Don't:
- **Don't** usar gradientes roxo/azul brilhantes de SaaS genérico.
- **Don't** usar esferas ou formas 3D flutuantes sem propósito.
- **Don't** usar fotografia de paisagem ou imagem de estoque genérica como hero — rejeitado explicitamente nesta sessão por não comunicar nada sobre o produto.
- **Don't** adicionar sombra a painéis, cartões ou elementos de navegação — a sombra é exclusiva do botão de ação.
- **Don't** misturar Inter em títulos ou Space Grotesk em corpo de texto.
