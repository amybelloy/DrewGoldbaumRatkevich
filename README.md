# Drew Goldbaum Ratkevich — Site de agendamento

Site institucional e de agendamento de consultas em saúde mental, feito com **HTML5, CSS3 e JavaScript puro** (sem frameworks).

> **Demonstração frontend.** Nenhum dado é enviado a servidores: as solicitações de agendamento, as mensagens de contato e o plano de saúde informado ficam salvos apenas no navegador (`localStorage`). Nenhuma consulta é confirmada, e o site não faz pagamentos nem consulta convênios.

## Como abrir

Abra o `index.html` no navegador. Também é possível servir a pasta localmente:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Banner, busca, profissionais em destaque, categorias, como funciona, depoimentos ilustrativos |
| `profissionais.html` | Catálogo com busca e filtros por especialidade, modalidade e localização |
| `perfil-profissional.html` | Perfil completo (`?id=drew`) com painel de agendamento fixo na lateral |
| `agendamento.html` | Fluxo em 4 etapas: data e horário → dados → revisão → solicitação |
| `sobre.html` | Objetivo, funcionamento, diferenciais, qualidade, segurança e privacidade |
| `contato.html` | Formulário validado, informações de contato e perguntas frequentes |

## Estrutura

```
css/   style.css (global) · responsive.css · agendamento.css (perfil e agendamento)
js/    data.js (dados e agenda) · main.js (global) · profissionais.js · perfil.js · agendamento.js
assets/images/   ilustrações botânicas e retrato provisório (SVG)
assets/icons/    favicon
```

## O que substituir antes de publicar

- **Retrato:** `assets/images/drew-retrato.svg` é uma ilustração provisória. Coloque a foto real (por exemplo, `drew-retrato.jpg`) e atualize o caminho em `js/data.js`, `index.html` e `sobre.html`.
- **Fotografias:** `hero-jardim.svg`, `folhagem.svg` e `flores.svg` são ilustrações. Podem ser trocadas por fotos de flores e jardins com o mesmo nome de arquivo, atualizando a extensão nos arquivos CSS e HTML.
- **Contatos:** e-mail, telefone e redes sociais no rodapé e em `contato.html` são provisórios.
- **Dados do perfil:** em `js/data.js`. As listas de especialidades que apareciam cortadas nas referências foram mantidas apenas até onde estavam visíveis.
- **Agenda:** os horários são gerados a partir de `schedule` em `js/data.js`. Para produção, substitua por uma integração com uma agenda real.
- **Perfis fictícios:** os outros seis profissionais do catálogo são demonstrativos e estão marcados como tal no site. Remova-os de `js/data.js` quando não forem mais necessários.
