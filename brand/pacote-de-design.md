# Pacote de Design: CZ Tech (Nível 1)

## 1. A premissa da marca

**O ponto.** No mapa do Google, cada clínica é um ponto. O paciente só enxerga os três que brilham mais. A CZ Tech faz o ponto da sua clínica ser o que brilha. O vídeo desce até esse ponto, a página inteira acompanha o ponto azul (o pin assinatura), e a última seção entrega o ponto na mão do visitante: o botão do WhatsApp.

## 2. Paleta (direção; valores finais amostrados do vídeo aprovado)

```css
:root{
  --canvas:#EEF4FB;        /* gelo azulado, fundo da página */
  --panel:#F8FBFF;         /* cartões */
  --night:#061430;         /* seções escuras, mesmo azul noite do vídeo */
  --accent:#1A66D6;        /* o azul CZ: CTA, pin, ênfase rara */
  --accent-hover:#2F7DE1;
  --accent-muted:#8CC4FF;  /* brilhos, bordas, partículas */
  --text-secondary:#4E6180;
  --text-primary:#0B1A33;
}
```

## 3. Trio de fontes

- Display: **Bricolage Grotesque** 400 e 700 (personalidade, combina com os cortes do logo CZ).
- Texto: **Figtree** 300, 400 e 600.
- Rótulos: **JetBrains Mono** 400.

## 4. Mapa de faixas do hero (hero de 400vh; pontos de partida)

| Faixa | Intervalo | Momento da filmagem | Texto (ao pé da letra) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.30 | céu azul claro, névoa começando | "Clínicas que lotam a agenda." | desfoque para nítido (névoa clareando), montada no carregamento |
| 2 | 0.36 a 0.64 | atravessando a névoa, a cidade de luz aparece | "8 em cada 10 pacientes procuram dentista no Google antes de marcar." | deriva para baixo (a câmera desce) |
| 3 | 0.70 a 1.00 | a cidade assenta, um ponto azul brilha no centro | Título: "A gente faz o seu ponto brilhar." Sub: "Google Meu Negócio e landing pages para clínicas odontológicas." CTA: "Agendar diagnóstico gratuito" | subida palavra por palavra em etapas |

A faixa da ação (centro do quadro, onde o ponto azul pousa) fica livre: o texto da faixa 3 senta no terço de cima, com o ponto abaixo.

## 5. Hero estático (celular e movimento reduzido)

Imagem: o quadro final. Título: "A gente faz o seu ponto brilhar." Sub: "Google Meu Negócio e landing pages para clínicas odontológicas." CTA: "Agendar diagnóstico gratuito".

## 6. Abaixo da dobra (em ordem, afunilando para o WhatsApp)

1. **Manifesto (escuro).** "Movidos por dados. Feitos para converter." Parágrafo: "O paciente não procura dentista por indicação. Ele procura no Google e marca com uma das três primeiras clínicas do mapa. Nosso trabalho é colocar a sua lá e fazer o clique virar consulta."
2. **O que fazemos (lista editorial).**
   - Google Meu Negócio: "Categorias, descrição com as palavras que a sua cidade busca, fotos, serviços e postagens toda semana."
   - Landing pages: "Uma página por tratamento, rápida no celular, com um só objetivo: levar o paciente ao WhatsApp da recepção."
   - Avaliações: "Um jeito simples de pedir avaliação 5 estrelas, e resposta para todas, boas e ruins."
   - SEO local: "Sua clínica nos diretórios que o Google confia, e cada ligação, rota e mensagem medida."
3. **Na prática (três cartões vivos).** Rótulos: "01 Ranking no mapa", "02 Perfil completo", "03 Landing que converte".
4. **A jornada (scroll horizontal).** "A escolha leva 2 minutos." Passos: Busca, Mapa, Confiança, Contato, Agenda (textos atuais).
5. **Cases em destaque.** Defende, OMNIA, Eduarda Mello (prints reais, entram como estão).
6. **Resultados.** "Curvas que só sobem." Gráficos de exemplo e case real Defende.
7. **Em números (reais, Simples Dental, 500 pacientes).** "80%: pesquisam no Google antes de marcar." "85%: escolhem pelas avaliações de outros pacientes." "3 de 10: já usam IA para achar dentista." "3: clínicas no topo do mapa ficam com a maioria dos cliques."
8. **Momento interativo: o Score Google.** "Qual é o seu score?" 10 perguntas, 0 a 1000, o ponteiro mexe a cada resposta. Encena a premissa: o visitante mede o brilho do próprio ponto.
9. **Como trabalhamos.** 01 Diagnóstico, 02 Otimização, 03 Crescimento (textos atuais, sem travessão).
10. **Perguntas (FAQ, objeções reais).**
    - "Já paguei agência e não vi resultado." / "A gente mede ligações, rotas e mensagens do seu perfil todo mês. Você vê o número, não promessa."
    - "Preciso pagar anúncio?" / "Não. O perfil otimizado aparece no mapa sem pagar por clique. Anúncio é opcional."
    - "Quanto tempo até aparecer?" / "As primeiras mudanças aparecem em semanas. O crescimento firme vem entre o segundo e o terceiro mês."
    - "Atendem qualquer cidade?" / "Sim, mas só uma clínica por região e especialidade. Assim a gente nunca trabalha para o seu concorrente."
    - "Já tenho site. Preciso de landing page?" / "Site mostra a clínica. Landing page vende um tratamento. Uma não substitui a outra."
11. **CTA final (escuro).** "Vamos fazer o seu ponto brilhar." Sub: "Diagnóstico gratuito: seu Score Google, o comparativo com as 3 clínicas acima de você e um plano de 90 dias." Botão: "Agendar no WhatsApp".
12. **Rodapé.** Logo CZ TECH, "Google Meu Negócio e landing pages para clínicas odontológicas.", Privacidade.

**Formulário:** nenhum. A chamada para ação abre o WhatsApp com mensagem pronta (o número real entra em `config.whatsapp`).

## 7. Camada vetorial

- O pin assinatura: um ponto azul fixo na lateral que desce com o scroll e acende em cada seção.
- Linhas finas das listas que se traçam sozinhas.
- Camada de fundo fixa: grade de pontos de luz (a mesma cidade do vídeo) derivando em ciclo de 60s, em nível de sussurro.
- Tudo parado no estado final com movimento reduzido.

## 8. Engenharia

Blob com anel de carregamento, interpolação normalizada por dt, seeks travados, escritas de DOM por delta, faixas ritmadas com teste de flick, legibilidade de quatro camadas, cinco portões do hero estático com listeners, completo sem o vídeo, piso de qualidade. HTML puro, sem build.

## 9. Gate de texto

Todo texto acima embarca ao pé da letra. A página passa no grep de travessões e palavras de estoque, mais a varredura de sinais de IA, antes de alguém ver.
