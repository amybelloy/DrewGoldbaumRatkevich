/* =========================================================
   agendamento.js
   - Agenda DEMONSTRATIVA (substituir por integração real)
   - Painel compacto de 3 dias (página Sobre), como nas referências
   - Página de agendamento: calendário, horários, modalidade,
     formulário e confirmação demonstrativa
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Configuração da agenda demonstrativa ----------
     Dias da semana: 0 = domingo ... 6 = sábado. Horários no fuso do visitante. */
  var AGENDA = {
    sessionMinutes: 60,
    modalities: { online: true, presencial: false },
    weekly: {
      2: ["11:00", "11:30", "12:30", "20:00"],
      3: ["12:00", "18:30"],
      4: ["09:00", "14:00", "19:00"]
    },
    daysAhead: 90
  };

  var STORAGE_KEY = "dgr_solicitacoes";
  var WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  var WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  var MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var ICON_VIDEO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="7" width="13" height="10" rx="1.5"/><path d="m15.5 10.5 6-3v9l-6-3"/></svg>';

  /* ---------- Datas ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fromISO(s) {
    var p = String(s).split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d) ? null : d;
  }
  function startOfToday() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function longDate(d) { return WEEKDAYS[d.getDay()] + ", " + d.getDate() + " de " + MONTHS[d.getMonth()] + " de " + d.getFullYear(); }
  function fmtTime(t) { var p = t.split(":"); return p[1] === "00" ? +p[0] + "h" : t; }
  function tzLabel() {
    var off = -new Date().getTimezoneOffset() / 60;
    var abs = Math.abs(off), h = Math.floor(abs), m = Math.round((abs - h) * 60);
    return "Fuso horário " + (off >= 0 ? "+" : "-") + pad(h) + (m ? ":" + pad(m) : "");
  }

  /* ---------- Disponibilidade ---------- */
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function getRequests() { return window.App.storeGet(STORAGE_KEY, []); }
  function saveRequests(list) { return window.App.storeSet(STORAGE_KEY, list); }

  function slotsFor(date) {
    var base = AGENDA.weekly[date.getDay()];
    var today = startOfToday();
    var limit = new Date(today); limit.setDate(limit.getDate() + AGENDA.daysAhead);
    if (!base || date < today || date > limit) return [];
    var iso = toISO(date);
    var booked = getRequests().filter(function (r) { return r.date === iso; }).map(function (r) { return r.time; });
    var now = new Date();
    return base.filter(function (time, i) {
      // Varia a agenda entre semanas de forma determinística (parece uma agenda real)
      if (i > 0 && hash(iso + time) % 3 === 0) return false;
      if (booked.indexOf(time) !== -1) return false;
      if (date.getTime() === today.getTime()) {
        var t = time.split(":");
        if (+t[0] * 60 + +t[1] <= now.getHours() * 60 + now.getMinutes() + 60) return false;
      }
      return true;
    });
  }

  function availableDays(count) {
    var out = [], d = startOfToday();
    for (var i = 0; i <= AGENDA.daysAhead && out.length < count; i++) {
      var s = slotsFor(d);
      if (s.length) out.push({ date: new Date(d), iso: toISO(d), slots: s });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }

  function slotButton(iso, time, selected, label) {
    return '<button type="button" class="slot' + (selected ? " is-selected" : "") + '" data-iso="' + iso + '" data-time="' + time +
      '" aria-pressed="' + selected + '"' + (label ? ' aria-label="' + label + '"' : "") + ">" +
      '<span class="slot-row">' + fmtTime(time) + ICON_VIDEO + "</span>" +
      '<span class="slot-duration">' + AGENDA.sessionMinutes + " minutos</span></button>";
  }

  /* =========================================================
     Painel compacto de 3 dias (Sobre)
     ========================================================= */
  function initMiniBooking(App) {
    var root = App.$("#mini-booking");
    if (!root) return;
    var days = availableDays(30);
    var page = 0, PER = 3;
    var selected = days.length ? { iso: days[0].iso, time: days[0].slots[0] } : null;
    var cols = App.$("#mb-days", root), prev = App.$("#mb-prev", root), next = App.$("#mb-next", root);
    var book = App.$("#mb-book", root), hint = App.$("#mb-hint", root);

    App.$("#mb-tz", root).textContent = tzLabel();
    App.$("#mb-duration", root).textContent = "Sessão de " + AGENDA.sessionMinutes + " minutos";

    function head(d) {
      var wd = d.getDay() === 3 ? "Qua" : WEEKDAYS[d.getDay()]; // como nas referências
      return "<strong>" + wd + "</strong>" + d.getDate() + " de<br>" + MONTHS[d.getMonth()];
    }

    function render() {
      if (!days.length) {
        cols.innerHTML = '<p class="no-slots no-slots--full">Sem horários nas próximas semanas.</p>';
        prev.disabled = next.disabled = book.disabled = true;
        return;
      }
      cols.innerHTML = days.slice(page * PER, page * PER + PER).map(function (day) {
        return '<div class="day-col" role="group" aria-label="' + longDate(day.date) + '"><div class="day-head">' + head(day.date) + "</div>" +
          day.slots.map(function (t) {
            return slotButton(day.iso, t, !!selected && selected.iso === day.iso && selected.time === t, longDate(day.date) + ", " + fmtTime(t));
          }).join("") + "</div>";
      }).join("");
      prev.disabled = page === 0;
      next.disabled = (page + 1) * PER >= days.length;
      book.disabled = !selected;
      hint.textContent = selected ? longDate(fromISO(selected.iso)) + " às " + fmtTime(selected.time) : "Selecione um horário para continuar.";
    }

    cols.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b) return;
      var same = selected && selected.iso === b.dataset.iso && selected.time === b.dataset.time;
      selected = same ? null : { iso: b.dataset.iso, time: b.dataset.time };
      render();
      var again = cols.querySelector('[data-iso="' + b.dataset.iso + '"][data-time="' + b.dataset.time + '"]');
      if (again) again.focus();
    });
    prev.addEventListener("click", function () { if (page > 0) { page--; render(); } });
    next.addEventListener("click", function () { if ((page + 1) * PER < days.length) { page++; render(); } });
    book.addEventListener("click", function () {
      if (!selected) return;
      location.href = "agendamento.html?" + new URLSearchParams({ data: selected.iso, hora: selected.time }).toString() + "#formulario";
    });
    render();
  }

  /* =========================================================
     Página de agendamento
     ========================================================= */
  function initScheduler(App) {
    var root = App.$("[data-scheduler]");
    if (!root) return;

    var params = new URLSearchParams(location.search);
    var state = { iso: params.get("data"), time: params.get("hora"), modality: null, month: null };

    var calTitle = App.$("#cal-title"), calGrid = App.$("#cal-grid");
    var slotsGrid = App.$("#slots-grid"), slotsTitle = App.$("#slots-title");
    var form = App.$("#booking-form"), formArea = App.$("#booking-form-area"), done = App.$("#booking-done");

    // Valida data/hora recebidas pela URL
    (function () {
      if (!state.iso) return;
      var d = fromISO(state.iso);
      if (!d || !slotsFor(d).length) { state.iso = null; state.time = null; return; }
      if (state.time && slotsFor(d).indexOf(state.time) === -1) {
        state.time = null;
        App.toast("O horário escolhido não está mais disponível. Selecione outro.", "error");
      }
    })();

    function initMonth() {
      var base = state.iso ? fromISO(state.iso) : ((availableDays(1)[0] || { date: new Date() }).date);
      state.month = new Date(base.getFullYear(), base.getMonth(), 1);
    }

    /* Calendário */
    function renderCalendar() {
      var m = state.month, today = startOfToday();
      var first = new Date(today.getFullYear(), today.getMonth(), 1);
      var last = new Date(today.getFullYear(), today.getMonth(), 1);
      last.setMonth(last.getMonth() + Math.ceil(AGENDA.daysAhead / 30));
      var mName = MONTHS[m.getMonth()];
      calTitle.textContent = mName.charAt(0).toUpperCase() + mName.slice(1) + " de " + m.getFullYear();
      App.$("#cal-prev").disabled = m <= first;
      App.$("#cal-next").disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) > last;

      var html = WEEKDAYS_SHORT.map(function (d) { return '<span class="dow" aria-hidden="true">' + d + "</span>"; }).join("");
      for (var i = 0; i < m.getDay(); i++) html += "<span></span>";
      var total = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      var todayISO = toISO(today);
      for (var day = 1; day <= total; day++) {
        var d = new Date(m.getFullYear(), m.getMonth(), day), iso = toISO(d);
        var ok = slotsFor(d).length > 0;
        html += '<button type="button" class="cal-day' + (ok ? " is-available" : "") + (iso === state.iso ? " is-selected" : "") + (iso === todayISO ? " is-today" : "") +
          '" data-iso="' + iso + '"' + (ok ? "" : " disabled") + ' aria-pressed="' + (iso === state.iso) +
          '" aria-label="' + longDate(d) + (ok ? ", horários disponíveis" : ", sem horários") + '">' + day + "</button>";
      }
      calGrid.innerHTML = html;
    }

    calGrid.addEventListener("click", function (e) {
      var b = e.target.closest(".cal-day.is-available");
      if (!b) return;
      if (state.iso !== b.dataset.iso) state.time = null;
      state.iso = b.dataset.iso;
      renderCalendar(); renderSlots(); renderSummary();
      var again = calGrid.querySelector('[data-iso="' + state.iso + '"]');
      if (again) again.focus();
    });
    App.$("#cal-prev").addEventListener("click", function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCalendar(); });
    App.$("#cal-next").addEventListener("click", function () { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCalendar(); });

    /* Horários */
    function renderSlots() {
      if (!state.iso) {
        slotsTitle.textContent = "Horários disponíveis";
        slotsGrid.innerHTML = '<p class="muted">Selecione uma data destacada no calendário.</p>';
        return;
      }
      var d = fromISO(state.iso);
      slotsTitle.textContent = "Horários em " + longDate(d).toLowerCase();
      slotsGrid.innerHTML = slotsFor(d).map(function (t) { return slotButton(state.iso, t, t === state.time); }).join("") ||
        '<p class="muted">Sem horários nesta data.</p>';
    }
    slotsGrid.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b) return;
      state.time = state.time === b.dataset.time ? null : b.dataset.time;
      App.$("#slot-error").textContent = "";
      renderSlots(); renderSummary();
      var again = slotsGrid.querySelector('[data-time="' + b.dataset.time + '"]');
      if (again) again.focus();
    });

    /* Modalidade */
    function renderModalities() {
      var info = {
        online: ["Online", "Videochamada em plataforma segura."],
        presencial: ["Presencial", "Indisponível no momento."]
      };
      var available = Object.keys(AGENDA.modalities).filter(function (k) { return AGENDA.modalities[k]; });
      if (available.length === 1) state.modality = available[0];
      App.$("#modality-options").innerHTML = Object.keys(info).map(function (k) {
        var ok = AGENDA.modalities[k];
        return '<label class="modality-option' + (ok ? "" : " is-disabled") + '"><input type="radio" name="modalidade" value="' + k + '"' +
          (ok ? "" : " disabled") + (state.modality === k ? " checked" : "") + "><span><strong>" + info[k][0] + "</strong><span>" + info[k][1] + "</span></span></label>";
      }).join("");
    }
    App.$("#modality-options").addEventListener("change", function (e) {
      if (e.target.name === "modalidade") { state.modality = e.target.value; App.$("#modality-error").textContent = ""; renderSummary(); }
    });

    /* Resumo */
    function renderSummary() {
      var rows = [
        ["Data", state.iso ? longDate(fromISO(state.iso)) : "Selecione no calendário"],
        ["Horário", state.time ? fmtTime(state.time) : "—"],
        ["Duração", AGENDA.sessionMinutes + " minutos"],
        ["Fuso", tzLabel().replace("Fuso horário ", "GMT")],
        ["Modalidade", state.modality === "online" ? "Online" : state.modality === "presencial" ? "Presencial" : "—"]
      ];
      App.$("#summary-rows").innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span><strong>" + r[1] + "</strong></li>"; }).join("");
    }

    /* Envio (demonstrativo) */
    App.bindLiveValidation(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      if (!state.iso || !state.time) {
        App.$("#slot-error").textContent = !state.iso ? "Selecione uma data no calendário." : "Selecione um horário.";
        ok = false;
      }
      if (!state.modality) { App.$("#modality-error").textContent = "Selecione a modalidade."; ok = false; }
      var fieldsOk = App.validateForm(form);
      if (!ok || !fieldsOk) {
        App.toast("Revise as informações destacadas.", "error");
        if (!ok && fieldsOk) App.$("#calendar-card").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var d = fromISO(state.iso);
      if (slotsFor(d).indexOf(state.time) === -1) {
        App.toast("Este horário acabou de ficar indisponível. Escolha outro.", "error");
        state.time = null; renderSlots(); renderSummary(); return;
      }
      var code = "DGR-" + Date.now().toString(36).toUpperCase().slice(-6);
      var list = getRequests();
      list.push({
        code: code, date: state.iso, time: state.time, modality: state.modality, minutes: AGENDA.sessionMinutes,
        nome: form.nome.value.trim(), email: form.email.value.trim(), telefone: form.telefone.value.trim(), criadoEm: new Date().toISOString()
      });
      var saved = saveRequests(list);

      App.$("#done-when").textContent = longDate(d) + " às " + fmtTime(state.time) + " · " + AGENDA.sessionMinutes + " minutos · Online";
      App.$("#done-code").textContent = code;
      App.$("#done-storage").hidden = saved;
      formArea.hidden = true;
      done.hidden = false;
      done.focus();
      renderCalendar(); renderSlots(); renderRequests();
      App.toast("Solicitação demonstrativa registrada.", "success");
    });

    App.$("#done-new").addEventListener("click", function () {
      form.reset();
      App.$$(".field.has-error", form).forEach(function (f) { f.classList.remove("has-error"); });
      state.iso = null; state.time = null;
      initMonth(); renderCalendar(); renderSlots(); renderModalities(); renderSummary();
      done.hidden = true; formArea.hidden = false;
      App.$("#calendar-card").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    /* Solicitações salvas neste navegador */
    function renderRequests() {
      var wrap = App.$("#requests"), list = getRequests().slice().reverse();
      wrap.hidden = !list.length;
      App.$("#requests-list").innerHTML = list.map(function (r) {
        var d = fromISO(r.date);
        return '<div class="request-item"><div><strong>' + (d ? longDate(d) : r.date) + " · " + fmtTime(r.time) + "</strong>" +
          '<span class="muted">Código ' + r.code + "</span></div>" +
          '<button type="button" class="btn btn--outline" data-cancel="' + r.code + '">Cancelar</button></div>';
      }).join("");
    }
    App.$("#requests-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cancel]");
      if (!b || !window.confirm("Remover esta solicitação demonstrativa?")) return;
      saveRequests(getRequests().filter(function (r) { return r.code !== b.dataset.cancel; }));
      renderRequests(); renderCalendar(); renderSlots();
      App.toast("Solicitação removida.", "success");
    });

    App.$("#s-tz").textContent = tzLabel();
    App.$("#s-duration").textContent = "Sessão de " + AGENDA.sessionMinutes + " minutos";
    initMonth();
    renderCalendar(); renderSlots(); renderModalities(); renderSummary(); renderRequests();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMiniBooking(window.App);
    initScheduler(window.App);
  });
})();
