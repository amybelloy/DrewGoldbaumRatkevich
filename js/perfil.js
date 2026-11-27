/* =========================================================
   Perfil do profissional + painel lateral de agendamento
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var App = window.App, DGR = window.DGR, I = DGR.ICONS, esc = DGR.escapeHTML;
    var root = App.$("[data-profile]");
    if (!root) return;

    var id = new URLSearchParams(location.search).get("id") || "drew";
    var pro = DGR.findPro(id);
    if (!pro) {
      App.$("#profile-main").innerHTML = '<section class="profile-card"><div class="empty-state">' +
        "<h3>Perfil não encontrado</h3><p>O endereço acessado não corresponde a nenhum profissional.</p>" +
        '<a class="btn btn--outline" href="profissionais.html">Ver profissionais</a></div></section>';
      App.$("#booking-aside").hidden = true;
      return;
    }

    document.title = pro.name + " — Perfil e agendamento";
    App.$("#crumb-name").textContent = pro.name;

    function list(items) { return items.map(esc).join(", "); }

    function detail(icon, title, body, clampLines) {
      var content = clampLines
        ? '<p class="clamp clamp--' + clampLines + '">' + body + "</p>" +
          '<button type="button" class="link-underline show-more" hidden>Mostrar mais</button>'
        : "<p>" + body + "</p>";
      return '<li class="detail-item"><span class="icon-bubble">' + I[icon] + "</span><div><h3>" + esc(title) + "</h3>" + content + "</div></li>";
    }

    var photo = pro.photo
      ? '<img src="' + esc(pro.photo) + '" alt="Retrato de ' + esc(pro.name) + '">'
      : '<div class="pro-photo pro-photo--fill"><span class="pro-monogram" aria-hidden="true">' + esc(DGR.initials(pro.name)) + "</span></div>";
    var mods = pro.modalities.map(function (m) { return DGR.MODALITY_LABEL[m]; }).join(" · ");

    var sections = [];

    // Cabeçalho
    sections.push(
      '<section class="profile-card profile-hero" aria-labelledby="pro-name">' +
        '<div class="profile-photo">' + photo + "</div>" +
        "<div>" +
          '<h1 id="pro-name">' + esc(pro.name) + "</h1>" +
          '<p class="profile-role">' + esc(pro.role) + (pro.pronouns ? " (" + esc(pro.pronouns) + ")" : "") + "</p>" +
          '<p class="profile-exp">' + pro.years + " anos de experiência</p>" +
          '<ul class="profile-tags">' +
            '<li><span class="icon-bubble">' + I.pin + "</span><span>" + esc(mods) + "</span></li>" +
            '<li><span class="icon-bubble">' + I.leaf + "</span><span>" + list(pro.topSpecialties.slice(0, 6)) + (pro.topSpecialties.length > 6 ? "…" : "") + "</span></li>" +
            '<li><span class="icon-bubble">' + I.hand + "</span><span>" + list(pro.careTypes) + "</span></li>" +
          "</ul>" +
          (pro.demo ? '<p class="demo-note profile-demo-flag">Perfil fictício, criado apenas para demonstração do layout.</p>' : "") +
        "</div>" +
      "</section>"
    );

    // Apresentação
    sections.push(
      '<section class="profile-card profile-text" aria-labelledby="h-intro">' +
        '<h2 id="h-intro">Prazer em conhecê-lo(a)!</h2>' +
        '<div class="clamp clamp--5">' + pro.intro.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" +
        '<button type="button" class="link-underline show-more" hidden>Mostrar mais</button>' +
      "</section>"
    );

    // Mais fornecedores
    sections.push(
      '<a class="more-providers" href="profissionais.html">' +
        '<span class="avatars"><span class="stack" aria-hidden="true"><i>HM</i><i>RA</i><i>MC</i></span>Veja mais profissionais</span>' +
        '<span class="icon-bubble icon-bubble--plain">' + I.arrowRight + "</span>" +
      "</a>"
    );

    sections.push(
      '<section class="profile-card" aria-labelledby="h-approach"><h2 id="h-approach">Minha abordagem à terapia</h2><p>' + esc(pro.approach) + "</p></section>",
      '<section class="profile-card" aria-labelledby="h-expect"><h2 id="h-expect">O que você pode esperar de mim</h2><p>' + esc(pro.expect) + "</p></section>"
    );

    sections.push(
      '<section class="profile-card" aria-labelledby="h-about"><h2 id="h-about">Sobre mim</h2><ul class="detail-list">' +
        detail("wave", "Eu me identifico como", esc(pro.identity)) +
        detail("persons", "Meu estilo é", esc(pro.style)) +
      "</ul></section>"
    );

    sections.push(
      '<section class="profile-card" aria-labelledby="h-qual"><h2 id="h-qual">Qualificação e seguro</h2><ul class="detail-list">' +
        detail("briefcase", "Anos de experiência", pro.years + " anos de experiência") +
        detail("cap", "Treinamento", esc(pro.education)) +
        detail("cap", "Instituição de ensino", esc(pro.institution)) +
        detail("badge", "Tipo de licença", esc(pro.license)) +
        detail("badge", "Licenciado em", esc(pro.licensedIn)) +
        detail("card", "Seguro aceito", pro.insurance.length ? list(pro.insurance) : "Atendimento particular. Consulte a profissional sobre reembolso.") +
      "</ul></section>"
    );

    var care = [
      detail("leaf", "Principais especialidades", list(pro.topSpecialties), 2)
    ];
    if (pro.moreSpecialties.length) care.push(detail("leaf", "Mais especialidades", list(pro.moreSpecialties), 3));
    care.push(
      detail("persons", "Métodos de terapia", list(pro.methods)),
      detail("hand", "Tipos de cuidados", list(pro.careTypes)),
      detail("group", "Idades atendidas", list(pro.ages)),
      detail("chat", "Idiomas", list(pro.languages))
    );
    sections.push('<section class="profile-card" aria-labelledby="h-care"><h2 id="h-care">Detalhes de cuidados</h2><ul class="detail-list">' + care.join("") + "</ul></section>");

    App.$("#profile-main").innerHTML = sections.join("");

    // "Mostrar mais": aparece apenas quando o texto realmente está cortado
    function setupShowMore() {
      App.$$(".show-more").forEach(function (btn) {
        var target = btn.previousElementSibling;
        if (target.classList.contains("is-open")) { btn.hidden = false; return; }
        btn.hidden = target.scrollHeight <= target.clientHeight + 2;
      });
    }
    App.$("#profile-main").addEventListener("click", function (e) {
      var btn = e.target.closest(".show-more");
      if (!btn) return;
      var target = btn.previousElementSibling;
      var open = target.classList.toggle("is-open");
      btn.textContent = open ? "Mostrar menos" : "Mostrar mais";
      btn.setAttribute("aria-expanded", String(open));
    });
    setupShowMore();
    window.addEventListener("resize", setupShowMore);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setupShowMore);

    /* ---------- Painel de agendamento ---------- */
    var days = DGR.availableDays(pro, new Date(), 30, 120);
    var page = 0;
    var PER_PAGE = 3;
    var selected = days.length ? { iso: days[0].iso, time: days[0].slots[0] } : null;

    App.$("#bk-tz").textContent = App.timezoneLabel();
    App.$("#bk-duration").textContent = "Sessão de " + pro.sessionMinutes + " minutos";
    var columns = App.$("#bk-days");
    var prev = App.$("#bk-prev");
    var next = App.$("#bk-next");
    var bookBtn = App.$("#bk-book");
    var hint = App.$("#bk-hint");

    function dayHead(d) {
      var wd = App.WEEKDAYS[d.getDay()];
      // As referências abreviam a quarta-feira ("Qua")
      if (d.getDay() === 3) wd = "Qua";
      return "<strong>" + wd + "</strong>" + d.getDate() + " de<br>" + App.MONTHS[d.getMonth()];
    }

    function renderDays() {
      if (!days.length) {
        columns.innerHTML = '<p class="no-slots no-slots--full">Sem horários disponíveis nas próximas semanas.</p>';
        prev.disabled = next.disabled = true;
        bookBtn.disabled = true;
        return;
      }
      var slice = days.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
      columns.innerHTML = slice.map(function (day) {
        return '<div class="day-col" role="group" aria-label="' + esc(App.formatLongDate(day.date)) + '">' +
          '<div class="day-head">' + dayHead(day.date) + "</div>" +
          day.slots.map(function (t) {
            var sel = selected && selected.iso === day.iso && selected.time === t;
            return '<button type="button" class="slot' + (sel ? " is-selected" : "") + '" data-iso="' + day.iso + '" data-time="' + t + '" aria-pressed="' + sel + '" aria-label="' + esc(App.formatLongDate(day.date)) + ", " + App.formatTime(t) + '">' +
              '<span class="slot-row">' + App.formatTime(t) + I.video + "</span>" +
              '<span class="slot-duration">' + pro.sessionMinutes + " minutos</span></button>";
          }).join("") +
        "</div>";
      }).join("");
      prev.disabled = page === 0;
      next.disabled = (page + 1) * PER_PAGE >= days.length;
      updateHint();
    }

    function updateHint() {
      bookBtn.disabled = !selected;
      if (!selected) { hint.textContent = "Selecione um horário para continuar."; return; }
      hint.textContent = App.formatLongDate(DGR.fromISO(selected.iso)) + " às " + App.formatTime(selected.time);
    }

    columns.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b) return;
      var same = selected && selected.iso === b.dataset.iso && selected.time === b.dataset.time;
      selected = same ? null : { iso: b.dataset.iso, time: b.dataset.time };
      renderDays();
      var again = columns.querySelector('[data-iso="' + b.dataset.iso + '"][data-time="' + b.dataset.time + '"]');
      if (again) again.focus();
    });
    prev.addEventListener("click", function () { if (page > 0) { page--; renderDays(); } });
    next.addEventListener("click", function () { if ((page + 1) * PER_PAGE < days.length) { page++; renderDays(); } });

    bookBtn.addEventListener("click", function () {
      if (!selected) { App.toast("Selecione um horário antes de agendar.", "error"); return; }
      var p = new URLSearchParams({ pro: pro.id, data: selected.iso, hora: selected.time });
      location.href = "agendamento.html?" + p.toString();
    });

    renderDays();

    /* ---------- Plano de saúde (sem estimativa simulada) ---------- */
    var modal = App.$("#insurance-modal");
    var options = App.$("#insurance-options");
    var savedBox = App.$("#bk-insurance");
    var KEY = "dgr_plano_" + pro.id;

    function showSaved() {
      var saved = DGR.safeGet(KEY, null);
      savedBox.hidden = !saved;
      if (saved) savedBox.textContent = "Plano informado: " + saved;
      App.$("#bk-insurance-btn").textContent = saved ? "Alterar seguro" : "Adicionar seguro";
    }

    App.$("#bk-insurance-btn").addEventListener("click", function () {
      var saved = DGR.safeGet(KEY, null);
      var plans = pro.insurance.length ? pro.insurance : [];
      options.innerHTML = plans.length
        ? plans.concat(["Outro plano / particular"]).map(function (p) {
            return '<label><input type="radio" name="plano" value="' + esc(p) + '"' + (saved === p ? " checked" : "") + "> " + esc(p) + "</label>";
          }).join("")
        : '<p class="muted">Este perfil não informa convênios. O atendimento é particular.</p>';
      App.$("#insurance-save").hidden = !plans.length;
      App.$("#insurance-error").hidden = true;
      App.openModal(modal);
    });

    App.$("#insurance-save").addEventListener("click", function () {
      var checked = options.querySelector("input:checked");
      if (!checked) { App.$("#insurance-error").hidden = false; return; }
      DGR.safeSet(KEY, checked.value);
      App.closeModal(modal);
      showSaved();
      App.toast("Plano registrado neste navegador.", "success");
    });

    App.$("#insurance-remove").addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* armazenamento indisponível */ }
      App.closeModal(modal);
      showSaved();
    });

    showSaved();
  });
})();
