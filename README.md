# CZ Tech · Landing page

Site da CZ Tech: otimização de Google Meu Negócio e landing pages para qualquer empresa que queira ser encontrada e vender mais.

## Como o repositório está organizado

| Pasta | O que tem | Vai para o ar? |
|---|---|---|
| `site/` | **O site.** HTML, CSS e JavaScript puros, sem build. É daqui que sai a publicação. | Sim |
| `brand/` | Identidade visual: tokens de cor e fonte (`cz-tech-tokens.json`), pacote de design, símbolo vetorizado e os textos do site (`textos-do-site.md` e a versão otimizada). | Não |
| `docs/` | Documentos da empresa e especificações (`sobre-a-empresa.md`, `superpowers/specs`). | Não |
| `sitede10k-skill/` | Roteiro usado para construir o site (SKILL.md e referências). | Não |
| `archive/frontend-antigo/` | Versão antiga do site (Vite, com a intro animada). Guardada só para consulta. | Não |
| `review/` | Material bruto e de apoio: imagens originais, vídeo e quadros de referência, mapa-mundi de origem, capturas de teste. **Fica fora do Git** (`.gitignore`). | Nunca |

## Como ver o site no computador

```
cd site
npx http-server -p 5520 -c-1
```

Depois abra http://localhost:5520/.

## Onde mudar o quê

- **Textos fixos:** `site/index.html`.
- **Cases dos clientes, perguntas e resultados do Score, número do WhatsApp e mensagem pronta:** `site/assets/data.js`.
- **Cores, tamanhos e animações de entrada:** `site/assets/style.css`.
- **Comportamento (menu, funil, Score, carrosséis):** `site/assets/app.js`.
- **Mapa do fundo do hero:** `site/assets/mapa-topo.svg`.

## Regras do texto do site

Português simples, sem travessão e sem as palavras de estoque do roteiro (alavancar, robusto, soluções, escalável e semelhantes). Não inventar número de cliente: só entra dado que o cliente confirmou ou que aparece no print do perfil.
