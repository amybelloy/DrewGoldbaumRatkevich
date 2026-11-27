/* =========================================================
   Dados demonstrativos compartilhados entre as páginas.
   - O perfil "drew" usa as informações das referências enviadas.
   - Os demais perfis são FICTÍCIOS e servem apenas para demonstrar
     o catálogo e os filtros (marcados com demo: true).
   ========================================================= */
(function () {
  "use strict";

  var ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21c0-5 1.5-8.5 6-11-1 4.5-3 7.5-6 11Zm0 0c0-4-1.6-7-5.5-9 .6 3.8 2.4 6.5 5.5 9Zm-.6-9.2C10 8.6 10.4 5.6 13.5 3c1.3 3.5.5 6.4-2.1 8.8Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 15.5c1.8-1.4 3.6-2 5.5-1.6l4.3.9a1.4 1.4 0 0 1-.4 2.8H9.6c-.4 0-.4.6 0 .6h3.6c.9 0 1.5-.2 2.2-.7l4-3a1.4 1.4 0 0 1 1.8 2.1l-4.5 4.2c-.9.8-2 1.2-3.2 1.2H7.6L5 22l-2-6.5Z"/><circle cx="13" cy="7" r="3.2"/><path d="M10 11.6c.8-.5 1.8-.8 3-.8s2.2.3 3 .8"/></svg>',
    persons: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="7" r="3.4"/><path d="M2.5 19.5c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2v.5h-13v-.5Z"/><rect x="15" y="9" width="7" height="6.5" rx="1"/></svg>',
    group: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7.5" r="3"/><circle cx="5.5" cy="9.5" r="2.3"/><circle cx="18.5" cy="9.5" r="2.3"/><path d="M6.5 19c0-3 2.5-5.4 5.5-5.4s5.5 2.4 5.5 5.4v1h-11v-1ZM1 18.5c0-2.3 1.9-4 4.3-4 .7 0 1.4.2 2 .5-1 1-1.6 2.4-1.8 4H1v-.5Zm22 0c0-2.3-1.9-4-4.3-4-.7 0-1.4.2-2 .5 1 1 1.6 2.4 1.8 4H23v-.5Z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c5 0 9 3.6 9 8.1s-4 8.1-9 8.1c-1 0-2-.1-2.9-.4L4 21l1.4-4.2C3.9 15.3 3 13.3 3 11.1 3 6.6 7 3 12 3Zm-4 7a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8Z"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.4 4.7a1.3 1.3 0 0 1 2.2-.6l3.8 5V3.6a1.3 1.3 0 0 1 2.6 0v6.6l.6-3.3a1.3 1.3 0 0 1 2.6.5l-1.1 7.5c-.6 4-3.5 6.6-7.1 6.6-2.6 0-4.4-1.2-5.9-3.3L2.4 13a1.3 1.3 0 0 1 2-1.6l2.8 2.8-1.9-7.4a1.3 1.3 0 0 1 2.5-.6l1.6 5.4-2-6.9Z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm0 3h6V6H9v1ZM2 13.5h8V15h4v-1.5h8V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4.5Z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5L12 3Z"/><path d="M5.5 12.2v3.6C7 17.5 9.3 18.5 12 18.5s5-1 6.5-2.7v-3.6L12 15.5l-6.5-3.3Z"/></svg>',
    badge: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 1.8 2.6 1.9 3.2-.1.9 3.1 2.6 1.9-1 3 1 3.1-2.6 1.9-.9 3.1-3.2-.1L12 22.2l-2.6-1.9-3.2.1-.9-3.1-2.6-1.9 1-3.1-1-3 2.6-1.9.9-3.1 3.2.1L12 1.8Zm-1.3 13.5 5.6-5.6-1.4-1.4-4.2 4.2-2-2-1.4 1.4 3.4 3.4Z"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm2.5 4v2h3.5V9H5.5Zm0 3.5V15h3.5v-2.5H5.5ZM11 9.5v1.5h7.5V9.5H11Zm0 3.5v1.5h5V13h-5Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="7" width="13" height="10" rx="1.5"/><path d="m15.5 10.5 6-3v9l-6-3"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    seal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m12 2.5 2.3 1.7 2.9-.1.8 2.8 2.4 1.7-.9 2.7.9 2.8-2.4 1.6-.8 2.8-2.9-.1L12 21.5l-2.3-1.7-2.9.1-.8-2.8-2.4-1.6.9-2.8-.9-2.7 2.4-1.7.8-2.8 2.9.1L12 2.5Z"/><path d="m8.6 12 2.3 2.3 4.5-4.6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>'
  };

  var DREW = {
    id: "drew",
    demo: false,
    name: "Drew Goldbaum Ratkevich",
    pronouns: "ela/dela",
    photo: "assets/images/drew-retrato.svg",
    specialty: "Enfermagem em Saúde Mental Psiquiátrica",
    role: "Enfermeira de Saúde Mental Psiquiátrica (PMHNP-BC)",
    shortBio: "Atendimento psiquiátrico holístico, colaborativo e baseado em evidências.",
    years: 5,
    modalities: ["virtual"],
    location: "Nova York (EUA)",
    locationKey: "nova-york",
    sessionMinutes: 60,
    education: "Mestrado em Ciências da Enfermagem pela Universidade de Nova York; Bacharelado em Ciências pela Universidade Chamberlain.",
    institution: "Universidade de Nova York (NYU)",
    educationShort: "Mestrado em Enfermagem — NYU",
    license: "NP (Enfermeira Praticante) (Nova York)",
    licensedIn: "Nova York",
    insurance: ["Aetna", "Anthem Blue Cross and Blue Shield", "Carelon Behavioral Health", "Cigna", "Curative", "Oscar", "Oxford", "Providence Health Plan", "United Healthcare"],
    identity: "Mulher caucasiana cisgênero",
    style: "Mente aberta, holística, acolhedora",
    intro: [
      "Como enfermeira especializada em saúde mental psiquiátrica (PMHNP-BC), certificada pelo Conselho de Enfermagem e formada pela NYU, Drew traz mais de 10 anos de experiência em cuidados de enfermagem inclusivos, compassivos e baseados em evidências. Sua abordagem se concentra em criar um espaço seguro e acolhedor para que os pacientes explorem seus desafios, adquiram insights e alcancem mudanças significativas e duradouras.",
      "A área de atuação clínica de Drew abrange transtornos de ansiedade e humor, TDAH, transtornos alimentares, distúrbios do sono e uso de substâncias, entre outras questões de saúde mental."
    ],
    approach: "Utilizando uma abordagem holística, colaborativa e baseada em evidências, Drew oferece avaliações psiquiátricas, acompanhamento medicamentoso com psicoterapia breve e estratégias práticas de enfrentamento. Juntos, vocês dedicarão tempo para compreender o que você está vivenciando, abordar as causas profundas e criar um plano de tratamento que apoie seus objetivos e bem-estar.",
    expect: "Drew é uma parceira e defensora dedicada, comprometida em ajudar você a superar os desafios da vida, a se curar e a caminhar em direção à vida que você idealiza.",
    topSpecialties: ["Uso de substâncias/dependência", "Ansiedade", "TDAH/TDA", "Depressão", "Transtornos alimentares", "Distúrbios do sono", "Problemas familiares", "Controle da raiva", "Trauma"],
    moreSpecialties: ["TOC", "LGBTQIA+", "Gestão do estresse", "Transtornos de pânico", "Questões culturais e étnicas", "Cuidados paliativos", "Luto ou perda", "Problemas de saúde física", "Saúde mental materna", "Problemas de relacionamento", "Questões femininas", "Questões de identidade", "TEPT"],
    methods: ["Terapia Racional Emotiva Comportamental (TREC)", "Entrevista Motivacional", "Psicodinâmica", "Terapia Cognitivo-Comportamental (TCC)"],
    careTypes: ["Gestão de medicação", "Terapia individual"],
    ages: ["Idosos", "Adultos"],
    languages: ["Inglês"],
    // Horários base por dia da semana (0 = domingo ... 6 = sábado)
    schedule: { 2: ["11:00", "11:30", "12:30", "20:00"], 3: ["12:00", "18:30"], 4: ["09:00", "14:00"] }
  };

  // Perfis fictícios para demonstração do catálogo
  function demoPro(o) {
    return Object.assign({
      demo: true,
      photo: "",
      pronouns: "",
      sessionMinutes: 50,
      license: "Registro profissional (demonstrativo)",
      licensedIn: "Brasil",
      insurance: [],
      identity: "—",
      style: "Acolhedor(a), atento(a), colaborativo(a)",
      approach: "Perfil demonstrativo: este texto ilustra como a abordagem terapêutica do(a) profissional será apresentada.",
      expect: "Perfil demonstrativo: espaço para a profissional descrever o que o paciente pode esperar do acompanhamento.",
      moreSpecialties: [],
      ages: ["Adultos"],
      languages: ["Português"]
    }, o);
  }

  var DEMOS = [
    demoPro({
      id: "helena-moura", name: "Helena Moura", specialty: "Psicologia Clínica", role: "Psicóloga clínica",
      shortBio: "Psicoterapia individual com foco em ansiedade e autoconhecimento.",
      years: 8, modalities: ["virtual", "presencial"], location: "Rio de Janeiro (RJ)", locationKey: "rio-de-janeiro",
      education: "Graduação em Psicologia; especialização em Terapia Cognitivo-Comportamental.", institution: "Instituição demonstrativa",
      educationShort: "Especialização em TCC",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["Ansiedade", "Depressão", "Autoestima", "Relacionamentos"],
      methods: ["Terapia Cognitivo-Comportamental (TCC)"], careTypes: ["Terapia individual"],
      schedule: { 1: ["09:00", "10:00", "15:00"], 3: ["09:00", "16:00", "17:00"], 5: ["10:00", "11:00"] }
    }),
    demoPro({
      id: "rafael-antunes", name: "Rafael Antunes", specialty: "Neuropsicologia", role: "Neuropsicólogo",
      shortBio: "Avaliação neuropsicológica de adultos e idosos.",
      years: 12, modalities: ["presencial"], location: "Rio de Janeiro (RJ)", locationKey: "rio-de-janeiro", sessionMinutes: 90,
      education: "Graduação em Psicologia; especialização em Neuropsicologia.", institution: "Instituição demonstrativa",
      educationShort: "Especialização em Neuropsicologia",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["TDAH/TDA", "Avaliação de memória", "Demências", "Reabilitação cognitiva"],
      methods: ["Avaliação neuropsicológica", "Reabilitação cognitiva"], careTypes: ["Avaliação", "Terapia individual"],
      ages: ["Adultos", "Idosos"],
      schedule: { 1: ["14:00"], 2: ["08:30", "14:00"], 4: ["08:30", "10:30"] }
    }),
    demoPro({
      id: "marina-castilho", name: "Marina Castilho", specialty: "Psiquiatria", role: "Médica psiquiatra",
      shortBio: "Cuidado psiquiátrico integral com escuta atenta.",
      years: 15, modalities: ["virtual", "presencial"], location: "São Paulo (SP)", locationKey: "sao-paulo",
      education: "Graduação em Medicina; residência em Psiquiatria.", institution: "Instituição demonstrativa",
      educationShort: "Residência em Psiquiatria",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["Depressão", "Transtorno bipolar", "Ansiedade", "Distúrbios do sono"],
      methods: ["Psiquiatria clínica"], careTypes: ["Gestão de medicação"],
      schedule: { 2: ["18:00", "19:00"], 4: ["18:00", "19:00", "20:00"], 6: ["09:00", "10:00"] }
    }),
    demoPro({
      id: "julia-prado", name: "Júlia Prado", specialty: "Psicologia Clínica", role: "Psicóloga",
      shortBio: "Atendimento a mulheres, maternidade e luto.",
      years: 6, modalities: ["virtual"], location: "Atendimento on-line", locationKey: "online",
      education: "Graduação em Psicologia; formação em Psicologia Perinatal.", institution: "Instituição demonstrativa",
      educationShort: "Formação em Psicologia Perinatal",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["Saúde mental materna", "Luto ou perda", "Questões femininas"],
      methods: ["Psicodinâmica", "Terapia Humanista"], careTypes: ["Terapia individual"],
      schedule: { 1: ["19:00", "20:00"], 3: ["19:00", "20:00"], 5: ["08:00"] }
    }),
    demoPro({
      id: "bruno-teixeira", name: "Bruno Teixeira", specialty: "Terapia de Casal e Família", role: "Psicólogo e terapeuta familiar",
      shortBio: "Terapia de casal e família com abordagem sistêmica.",
      years: 10, modalities: ["virtual", "presencial"], location: "São Paulo (SP)", locationKey: "sao-paulo",
      education: "Graduação em Psicologia; especialização em Terapia Familiar Sistêmica.", institution: "Instituição demonstrativa",
      educationShort: "Especialização em Terapia Sistêmica",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["Problemas de relacionamento", "Problemas familiares", "Comunicação"],
      methods: ["Terapia Sistêmica"], careTypes: ["Terapia de casal", "Terapia familiar"],
      schedule: { 2: ["10:00", "17:00"], 3: ["10:00"], 6: ["09:00", "11:00"] }
    }),
    demoPro({
      id: "lucia-fernandes", name: "Lúcia Fernandes", specialty: "Nutrição Comportamental", role: "Nutricionista",
      shortBio: "Relação saudável com a comida e transtornos alimentares.",
      years: 9, modalities: ["virtual", "presencial"], location: "Rio de Janeiro (RJ)", locationKey: "rio-de-janeiro",
      education: "Graduação em Nutrição; especialização em Nutrição Comportamental.", institution: "Instituição demonstrativa",
      educationShort: "Especialização em Nutrição Comportamental",
      intro: ["Perfil demonstrativo criado para ilustrar o catálogo de profissionais da plataforma."],
      topSpecialties: ["Transtornos alimentares", "Comer emocional", "Reeducação alimentar"],
      methods: ["Entrevista Motivacional", "Nutrição comportamental"], careTypes: ["Acompanhamento nutricional"],
      schedule: { 1: ["08:00", "09:00"], 4: ["13:00", "14:00", "15:00"] }
    })
  ];

  var PROFESSIONALS = [DREW].concat(DEMOS);

  var MODALITY_LABEL = { virtual: "Virtual (on-line)", presencial: "Presencial" };
  var LOCATION_LABEL = {
    "nova-york": "Nova York (EUA)", "rio-de-janeiro": "Rio de Janeiro (RJ)",
    "sao-paulo": "São Paulo (SP)", "online": "Somente on-line"
  };

  /* ---------- Disponibilidade demonstrativa ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fromISO(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  // Hash simples e determinístico para variar os horários entre semanas
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }

  function slotsFor(pro, date) {
    var base = pro.schedule[date.getDay()];
    if (!base) return [];
    var iso = toISO(date);
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) return [];
    var booked = bookedSlots(pro.id, iso);
    return base.filter(function (time, i) {
      // Remove de forma determinística ~1/3 dos horários para parecer uma agenda real
      if (base.length > 1 && hash(pro.id + iso + time) % 3 === 0 && i !== 0) return false;
      if (booked.indexOf(time) !== -1) return false;
      if (date.getTime() === today.getTime()) {
        var t = time.split(":");
        if (+t[0] * 60 + +t[1] <= now.getHours() * 60 + now.getMinutes() + 60) return false;
      }
      return true;
    });
  }

  function availableDays(pro, fromDate, count, maxDays) {
    var out = [];
    var d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    for (var i = 0; i < (maxDays || 90) && out.length < count; i++) {
      var s = slotsFor(pro, d);
      if (s.length) out.push({ date: new Date(d), iso: toISO(d), slots: s });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }

  /* ---------- Solicitações salvas (localStorage) ---------- */
  var STORAGE_KEY = "dgr_solicitacoes";
  function safeGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function getRequests() { return safeGet(STORAGE_KEY, []); }
  function saveRequests(list) { return safeSet(STORAGE_KEY, list); }
  function bookedSlots(proId, iso) {
    return getRequests().filter(function (r) { return r.proId === proId && r.date === iso; })
      .map(function (r) { return r.time; });
  }

  function findPro(id) {
    for (var i = 0; i < PROFESSIONALS.length; i++) if (PROFESSIONALS[i].id === id) return PROFESSIONALS[i];
    return null;
  }

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("");
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function allSpecialties() {
    var set = {};
    PROFESSIONALS.forEach(function (p) { set[p.specialty] = true; });
    return Object.keys(set).sort();
  }

  window.DGR = {
    ICONS: ICONS,
    PROFESSIONALS: PROFESSIONALS,
    MODALITY_LABEL: MODALITY_LABEL,
    LOCATION_LABEL: LOCATION_LABEL,
    findPro: findPro,
    slotsFor: slotsFor,
    availableDays: availableDays,
    toISO: toISO,
    fromISO: fromISO,
    getRequests: getRequests,
    saveRequests: saveRequests,
    safeGet: safeGet,
    safeSet: safeSet,
    initials: initials,
    escapeHTML: escapeHTML,
    allSpecialties: allSpecialties
  };
})();
