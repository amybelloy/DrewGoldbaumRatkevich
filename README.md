# Drew Goldbaum-Ratkevich, NP — Site pessoal

Site institucional de Drew Goldbaum-Ratkevich, NP, enfermeira de saúde mental psiquiátrica (PMHNP-BC). Feito com **HTML5, CSS3 e JavaScript puro**, sem frameworks.

> **Versão demonstrativa (somente frontend).** Os formulários de agendamento e de contato **não enviam** dados. As solicitações ficam salvas só no navegador (`localStorage`), e o site avisa isso ao visitante. Os horários exibidos também são demonstrativos.

## Como abrir

Abra o `index.html` no navegador ou sirva a pasta localmente:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Banner, apresentação, avaliação, frase inspiradora, abordagem, especialidades, como funciona, chamada para agendamento |
| `sobre.html` | Perfil completo: formação, certificação, licença, experiência, missão, abordagem, seguros, detalhes de cuidados, avaliações e painel de agendamento fixo na lateral |
| `servicos.html` | 12 especialidades e serviços, métodos terapêuticos e público atendido |
| `agendamento.html` | Calendário, horários, duração, modalidade, formulário e confirmação demonstrativa |
| `faq.html` | Perguntas frequentes em acordeão, com busca e filtro por tema |
| `contato.html` | Formulário, e-mail, WhatsApp, redes sociais e informações de atendimento |
| `blog.html` | Artigos com filtro por categoria e leitura em janela; seção **Recursos** (`#recursos`) com respiração guiada e contatos de crise |

## Estrutura

```
css/      style.css (componentes e páginas) · responsive.css (tablets e celulares)
js/       main.js (comum a todas as páginas) · agendamento.js · faq.js · contato.js
assets/   images/ (foto, banners e capas) · icons/ (favicon) · logo/ (logotipo)
```

## Antes de publicar

1. **WhatsApp e e-mail:** preencha `CONFIG.whatsapp` (somente números, com código do país) e `CONFIG.email` no início de `js/main.js`. Enquanto estiverem vazios, os botões de WhatsApp avisam que o número ainda não foi configurado.
2. **E-mail exibido:** em `contato.html`, o texto `contato@exemplo.com` é substituído automaticamente quando `CONFIG.email` estiver preenchido.
3. **Redes sociais:** troque os links genéricos do Instagram e do LinkedIn pelos perfis oficiais (rodapé e `contato.html`).
4. **Agenda:** os horários vêm de `AGENDA` em `js/agendamento.js` (dias da semana, horários, duração de 60 min, modalidade online). Para receber agendamentos reais, integre um sistema de agenda ou um backend.
5. **Blog:** os seis artigos são exemplos educativos gerais, marcados como tal na página. Revise ou substitua pelos textos da Drew. Cada artigo fica em um `<template id="artigo-…">` no fim do `blog.html`.
6. **Formas de pagamento:** a FAQ lista apenas os planos de saúde confirmados. Acrescente as demais formas quando forem definidas.

## Origem das informações

Formação, licença, certificação, seguros, especialidades, métodos, idiomas, idades atendidas, textos de apresentação e a avaliação (4,56 em 11 avaliações) vêm do perfil profissional da Drew fornecido como referência. Nenhuma qualificação ou serviço foi acrescentado.
