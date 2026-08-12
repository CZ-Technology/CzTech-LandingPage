# Animação de Introdução "CZ" — Design

Data: 2026-08-11
Projeto: CzTech-LandingPage (`Frontend/`)

## Problema

A landing page abre direto no hero, sem nenhum momento de marca. Queremos uma
animação de abertura curta que apresente o logotipo "CZ" e faça a transição para
o site com um efeito de cortina horizontal.

## Decisão: código, não vídeo

A animação será construída em CSS + GSAP, não renderizada como vídeo.

Motivos:

- **Responsividade.** Um vídeo tem aspect ratio fixo. Entre desktop widescreen e
  mobile portrait o enquadramento quebra ou exige dois arquivos distintos.
- **Peso.** Um MP4 de 2,5s em qualidade aceitável custa centenas de KB e entra no
  caminho crítico de carregamento, degradando o LCP da página.
- **Nitidez.** Texto vetorial permanece nítido em qualquer densidade de tela;
  vídeo escalado borra em displays retina.
- **Controle.** Em código conseguimos pular a animação, respeitar
  `prefers-reduced-motion`, e sincronizar o fim da cortina com o site já montado
  por trás. Nada disso é possível com vídeo sem gambiarra.

O custo é código a manter, mas o volume é pequeno: um módulo JS e uma folha de
estilo.

## Stack

O projeto é **vanilla JS + Vite**, não React/Next.js. GSAP 3.12.5 já está
carregado por CDN em `Frontend/index.html` (linhas 973-974) e disponível como
`window.gsap`. A animação usa a API `gsap.timeline()`, sem dependências novas e
sem passo de build adicional.

## Arquitetura

Quatro pontos de contato, seguindo a estrutura modular já estabelecida no commit
de refactor (`7f69369`):

| Arquivo | Mudança |
|---|---|
| `Frontend/src/css/intro.css` | Novo. Estilos do overlay. |
| `Frontend/src/css/index.css` | Adiciona `@import './intro.css';` |
| `Frontend/src/js/modules/intro.js` | Novo. Exporta `initIntro()`. |
| `Frontend/src/js/main.js` | Importa e chama `initIntro()` primeiro. |
| `Frontend/index.html` | Markup do overlay como primeiro filho de `<body>`. |

O módulo `intro.js` é autocontido: recebe nada, retorna nada, e toda a
comunicação com o resto da página acontece via DOM (remoção do overlay) e via
`document.body` (lock de scroll). Nenhum outro módulo precisa saber que ele
existe.

## Markup

```html
<div class="intro-overlay" id="introOverlay" aria-hidden="true">
  <div class="intro-split intro-split-top"></div>
  <div class="intro-split intro-split-bottom"></div>
  <div class="intro-cz-group">
    <span class="intro-letter intro-letter-c">C</span>
    <span class="intro-letter intro-letter-z">Z</span>
  </div>
</div>
```

- `.intro-overlay` — `position: fixed`, cobre a viewport, `z-index: 9999` (o
  maior z-index existente no projeto é 100, na navbar).
- `.intro-split-top` / `.intro-split-bottom` — dois retângulos sólidos de
  `50vh` cada, na cor `var(--bg-main)` (#1F2937). Juntos escondem o site durante
  toda a animação. São eles que deslizam no passo 4.
- `.intro-cz-group` — contêiner flex das duas letras, centralizado, em camada
  acima dos splits.
- `aria-hidden="true"` porque o conteúdo é puramente decorativo; leitores de tela
  vão direto ao conteúdo real.

## Timeline

Duração total ~2,5s. Uma única `gsap.timeline()` coordena tudo — os quatro
passos são posições nessa timeline, não animações independentes, o que elimina
qualquer risco de dessincronização.

| t (s) | Passo | Tween |
|---|---|---|
| 0,0 → 0,9 | **Entrada** | `.intro-letter-c` de `{ x: '-50vw', xPercent: -100 }` até `{ x: 0, xPercent: 0 }`; `.intro-letter-z` espelhado (`+50vw`, `+100`). Simultâneos, `power3.out`. |
| 0,9 → 2,0 | **Rotação + alinhamento** | `.intro-cz-group` gira `rotation: 0 → 810`, `power2.inOut`. |
| 1,8 → 2,0 | **Endireitar letras** | Cada `.intro-letter` gira `rotation: 0 → -90`, sobrepondo o fim da rotação do grupo. |
| 2,0 → 2,2 | **Saída das letras** | `.intro-cz-group` faz fade para `opacity: 0` com `scale: 0.9`. |
| 2,0 → 2,5 | **Cortina** | `.intro-split-top` sobe (`yPercent: -100`), `.intro-split-bottom` desce (`yPercent: 100`). Simultâneos, `power4.inOut`. |

### Por que 810 graus

Os passos 2 e 3 do briefing original (girar, depois terminar na vertical) são um
único tween, não dois. A geometria resolve sozinha:

As letras começam lado a lado — C em `x = -d`, Z em `x = +d`. Uma rotação CSS
positiva é horária na tela e mapeia `(x, y) → (-y, x)` a 90 graus. Logo C em
`(-d, 0)` vai para `(0, -d)`, o topo; e Z em `(+d, 0)` vai para `(0, +d)`, a
base. Exatamente o alinhamento pedido.

810 graus = 720 (duas voltas completas) + 90 (o quarto de volta que produz a
vertical). Uma única propriedade animada entrega giro e alinhamento final.

### Por que endireitar as letras

Girar o grupo 810 graus também gira os glifos: ao final da rotação as letras
estariam deitadas de lado. O tween de contra-rotação (`-90`) nos últimos 0,2s faz
cada letra se endireitar enquanto o grupo assenta na vertical — lê-se como as
letras girando e depois se acertando na posição.

**Alternativa descartada:** girar 720 graus e reposicionar as letras com
`translateY`. Funciona, mas o alinhamento vertical vira um movimento separado em
vez de consequência natural do giro, e perde a leitura de "a rotação terminou na
vertical" do briefing.

Se o resultado visual não agradar, reverter é trocar `810` por `720` e remover o
tween de contra-rotação; as letras então terminam na horizontal, em pé.

## Responsividade

Sem breakpoints e sem `gsap.matchMedia()`. A responsividade vem das unidades:

- Distância de entrada como `x: '-50vw'` somado a `xPercent: -100`. O primeiro
  termo leva o centro da letra até a borda da viewport; o segundo empurra pela
  própria largura dela. A soma garante que a letra comece inteiramente fora da
  tela em qualquer proporção de viewport e qualquer tamanho de fonte — o que
  `xPercent` sozinho não garante em telas muito largas.
- Tamanho da fonte em `clamp()`, escalando com a viewport.
- Splits em `50vh` cada, `yPercent` para a saída.

Nada depende de largura de tela medida em pixels, então não há o que ajustar por
breakpoint.

## Sessão e acessibilidade

`initIntro()` verifica duas condições antes de montar a timeline:

1. `sessionStorage.getItem('czIntroPlayed')` — se já rodou nesta sessão, pula.
2. `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — se o usuário
   pediu menos movimento, pula.

Em ambos os casos o caminho é idêntico: o overlay recebe `display: none`
imediatamente, nenhuma timeline é criada, nenhum lock de scroll é aplicado, e a
página aparece normal. A flag `czIntroPlayed` é gravada ao final da animação (ou
no início do caminho de pulo).

Sem botão de pular: 2,5s é curto o bastante, e quem já viu não vê de novo na
mesma sessão.

## Lock de scroll

`document.body.style.overflow = 'hidden'` no início, revertido no callback
`onComplete` da timeline.

**Cuidado com ScrollTrigger.** O módulo `reveal.js` registra ScrollTriggers no
`DOMContentLoaded`, e ScrollTrigger calcula posições a partir da altura do
documento. Mudar `overflow` do body durante esse cálculo pode produzir posições
erradas. Mitigação: chamar `ScrollTrigger.refresh()` no `onComplete` da intro,
depois de liberar o scroll. As revelações do hero não dependem disso — em
`base.css` o seletor `.hero .reveal` já força opacidade 1 sem esperar scroll.

## Ordem de inicialização

`initIntro()` roda **antes** dos demais inits em `main.js`. O site é montado
normalmente por trás do overlay durante os 2,5s, de forma que a cortina revela
uma página já pronta e pintada, sem flash de conteúdo carregando.

## Verificação

A animação será validada rodando `npm run dev` e conferindo, em desktop e em
viewport mobile emulada:

1. As letras entram das bordas opostas e se encontram no centro.
2. O giro completa duas voltas e para com C acima e Z abaixo, ambas em pé.
3. A cortina abre na horizontal e revela o site já renderizado.
4. Recarregar a página não repete a animação (mesma sessão).
5. Com `prefers-reduced-motion` ativo, o site aparece direto.
6. O scroll está livre e as animações de reveal funcionam após a intro.
