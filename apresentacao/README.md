# Apresentação comercial CZ Tech

Dois materiais feitos a partir do texto do site, com a mesma marca.

| Material | Para quê | Onde |
|---|---|---|
| PDF de leitura (8 páginas, cada uma com um layout diferente) | O cliente lê sozinho, sem ninguém apresentando. Curto, com pouco texto e números grandes. | `pdf/CZ-Tech-Apresentacao.pdf` (fonte em `pdf/leitura.html`) |
| Apresentação web (14 slides) | Reunião guiada pela equipe. Mais completa, com roteiro de fala por slide. | `web/index.html` |

## Apresentação web

Abra `web/index.html` no navegador (ou publique a pasta `apresentacao/`).

- Setas, espaço ou toque: trocam de slide. `Home` e `End` vão ao primeiro e ao último.
- `F`: tela cheia. `O`: visão geral dos slides. `N`: roteiro de fala (só para quem apresenta).
- O endereço guarda o slide atual (por exemplo `#4`), então dá para abrir direto em um ponto.

## Gerar o PDF de novo

Depois de editar `pdf/leitura.html`, rode no Edge (ajuste os caminhos):

```
msedge --headless --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf=pdf/CZ-Tech-Apresentacao.pdf file:///CAMINHO/apresentacao/pdf/leitura.html
```

## Cuidados com os dados

- Só entram números que já estão no site e têm origem: Defende (painel do Google), OMNIA e Eduarda Mello (prints dos perfis).
- Ficaram de fora as estatísticas de mercado sem fonte (90%+, 70%+, 9 em 10) e os exemplos fictícios do site.
- A "Gestão contínua de 6 meses" e os prazos por semana vêm da escada do site. Confirme o escopo real do pacote antes de prometer.
