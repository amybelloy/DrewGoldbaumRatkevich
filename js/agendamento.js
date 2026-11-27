/* =========================================================
   Página de agendamento em 4 etapas:
   1. Data e horário  2. Seus dados  3. Revisão  4. Solicitação registrada
   Demonstração frontend: nada é enviado a um servidor.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var App = window.App, DGR = window.DGR, I = DGR.ICONS, esc = DGR.escapeHTML;
    var root = App.$("[data-scheduler]");
    if (!root) return;

    var params = new URLSearchParams(location.search);
    var state = {
      step: 1,
      pro: DGR.findPro(params.get("pro")) || DGR.findPro("drew"),
      iso: params.get("data") || null,
      time: params.get("hora") || null,
      modality: null,
      month: null
    };

    var proSelect = App.$("#s-pro");
    var calTitle = App.$("#cal-title");
    var calGrid = App.$("#cal-grid");
    var slotsGrid = App.$("#slots-grid");
    var slotsTitle = App.$("#slots-title");
    var form = App.$("#patient-form");

    /* ---------- Seleção de profissional ---------- */
    DGR.PROFESSIONALS.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name + " — " + p.specialty + (p.demo ? " (demonstrativo)" : "");
      proSelect.appendChild(o);
    });
    proSelect.value = state.pro.id;
    proSelect.addEventListener("change", function () {
      state.pro = DGR.findPro(proSelect.value);
      state.iso = null; state.time = null; state.modality = null;
      initMonth();
      renderCalendar(); renderSlots(); renderModalities(); renderSummary();
    });

    /* ---------- Validação da data/hora vinda da URL ---------- */
    function validateIncoming() {
      if (!state.iso) return;
      var d = DGR.fromISO(state.iso);
      if (isNaN(d) || DGR.slotsFor(state.pro, d).indexOf(state.time) === -1) {
        if (state.time) App.toast("O horário escolhido não está mais disponível. Selecione outro.", "error");
        if (isNaN(d) || !DGR.slotsFor(state.pro, d).length) state.iso = null;
        state.time = null;
      }
    }

    function initMonth() {
      var base = state.iso ? DGR.fromISO(state.iso) : (DGR.availableDays(state.pro, new Date(), 1, 120)[0] || { date: new Date() }).date;
      state.month = new Date(base.getFullYear(), base.getMonth(), 1);
    }

    /* ---------- Calendário ---------- */
    function renderCalendar() {
      var m = state.month;
      var now = new Date();
      var thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      var limit = new Date(now.getFullYear(), now.getMonth() + 3, 1);
      calTitle.textContent = App.MONTHS[m.getMonth()] + " de " + m.getFullYear();
      App.$("#cal-prev").disabled = m <= thisMonth;
      App.$("#cal-next").disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) >= limit;

      var html = App.WEEKDAYS_SHORT.map(function (d) { return '<span class="dow" aria-hidden="true">' + d + "</span>"; }).join("");
      var first = m.getDay();
      for (var i = 0; i < first; i++) html += "<span></span>";
      var daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      var todayISO = DGR.toISO(now);
      for (var day = 1; day <= daysInMonth; day++) {
        var d = new Date(m.getFullYear(), m.getMonth(), day);
        var iso = DGR.toISO(d);
        var available = DGR.slotsFor(state.pro, d).length > 0;
        var cls = "cal-day" + (available ? " is-available" : "") + (iso === state.iso ? " is-selected" : "") + (iso === todayISO ? " is-today" : "");
        html += '<button type="button" class="' + cls + '" data-iso="' + iso + '"' + (available ? "" : " disabled") +
          ' aria-pressed="' + (iso === state.iso) + '" aria-label="' + esc(App.formatLongDate(d)) + (available ? ", com horários" : ", sem horários") + '">' + day + "</button>";
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
    App.$("#cal-prev").addEventListener("click", function () {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderCalendar();
    });
    App.$("#cal-next").addEventListener("click", function () {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderCalendar();
    });

    /* ---------- Horários ---------- */
    function renderSlots() {
      App.$("#s-tz").textContent = App.timezoneLabel();
      App.$("#s-duration").textContent = "Sessão de " + state.pro.sessionMinutes + " minutos";
      if (!state.iso) {
        slotsTitle.textContent = "Horários disponíveis";
        slotsGrid.innerHTML = '<p class="muted">Selecione uma data destacada no calendário.</p>';
        return;
      }
      var d = DGR.fromISO(state.iso);
      var slots = DGR.slotsFor(state.pro, d);
      slotsTitle.textContent = "Horários em " + App.formatLongDate(d).toLowerCase();
      slotsGrid.innerHTML = slots.map(function (t) {
        var sel = t === state.time;
        return '<button type="button" class="slot' + (sel ? " is-selected" : "") + '" data-time="' + t + '" aria-pressed="' + sel + '">' +
          '<span class="slot-row">' + App.formatTime(t) + I.video + "</span>" +
          '<span class="slot-duration">' + state.pro.sessionMinutes + " minutos</span></button>";
      }).join("") || '<p class="muted">Sem horários nesta data.</p>';
    }

    slotsGrid.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b) return;
      state.time = state.time === b.dataset.time ? null : b.dataset.time;
      renderSlots(); renderSummary();
      var again = slotsGrid.querySelector('[data-time="' + b.dataset.time + '"]');
      if (again) again.focus();
    });

    /* ---------- Modalidade ---------- */
    function renderModalities() {
      var wrap = App.$("#modality-options");
      var desc = { virtual: "Videochamada em plataforma segura.", presencial: "No consultório, no endereço informado pelo(a) profissional." };
      if (state.pro.modalities.length === 1) state.modality = state.pro.modalities[0];
      wrap.innerHTML = ["virtual", "presencial"].map(function (m) {
        var ok = state.pro.modalities.indexOf(m) !== -1;
        return '<label class="modality-option' + (ok ? "" : " is-disabled") + '">' +
          '<input type="radio" name="modalidade" value="' + m + '"' + (ok ? "" : " disabled") + (state.modality === m ? " checked" : "") + ">" +
          "<span><strong>" + DGR.MODALITY_LABEL[m] + "</strong><span>" + (ok ? desc[m] : "Não oferecido por este(a) profissional.") + "</span></span></label>";
      }).join("");
    }
    App.$("#modality-options").addEventListener("change", function (e) {
      if (e.target.name === "modalidade") { state.modality = e.target.value; App.$("#modality-error").textContent = ""; renderSummary(); }
    });

    /* ---------- Resumo lateral ---------- */
    function renderSummary() {
      var p = state.pro;
      var avatar = p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : '<span class="mini-mono" aria-hidden="true">' + esc(DGR.initials(p.name)) + "</span>";
      App.$("#summary-pro").innerHTML = avatar + "<div><strong>" + esc(p.name) + "</strong><span>" + esc(p.specialty) + "</span></div>";
      var rows = [
        ["Data", state.iso ? App.formatLongDate(DGR.fromISO(state.iso)) : "—"],
        ["Horário", state.time ? App.formatTime(state.time) : "—"],
        ["Duração", p.sessionMinutes + " minutos"],
        ["Fuso", App.timezoneLabel().replace("Fuso horário ", "GMT")],
        ["Modalidade", state.modality ? DGR.MODALITY_LABEL[state.modality] : "—"]
      ];
      App.$("#summary-rows").innerHTML = rows.map(function (r) {
        return "<li><span>" + r[0] + "</span><strong>" + esc(r[1]) + "</strong></li>";
      }).join("");
      App.$("#summary-profile").href = "perfil-profissional.html?id=" + encodeURIComponent(p.id);
    }

    /* ---------- Etapas ---------- */
    function goTo(step) {
      state.step = step;
      App.$$(".step-panel").forEach(function (panel) { panel.classList.toggle("is-active", +panel.dataset.step === step); });
      App.$$(".stepper li").forEach(function (li, i) {
        li.classList.toggle("is-active", i + 1 === step);
        li.classList.toggle("is-done", i + 1 < step);
        if (i + 1 === step) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      var heading = App.$('.step-panel[data-step="' + step + '"] h2');
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    App.$("#to-step-2").addEventListener("click", function () {
      var err = App.$("#step1-error");
      if (!state.iso || !state.time) {
        err.hidden = false;
        err.querySelector("span").textContent = !state.iso ? "Selecione uma data no calendário." : "Selecione um horário disponível.";
        return;
      }
      err.hidden = true;
      goTo(2);
    });

    App.bindLiveValidation(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = App.validateForm(form);
      if (!state.modality) { App.$("#modality-error").textContent = "Selecione a modalidade de atendimento."; ok = false; }
      if (!ok) { App.toast("Revise os campos destacados.", "error"); return; }
      renderReview();
      goTo(3);
    });

    function renderReview() {
      var d = DGR.fromISO(state.iso);
      var rows = [
        ["Profissional", state.pro.name + " — " + state.pro.specialty],
        ["Data", App.formatLongDate(d)],
        ["Horário", App.formatTime(state.time) + " (" + App.timezoneLabel().replace("Fuso horário ", "GMT") + ")"],
        ["Duração", state.pro.sessionMinutes + " minutos"],
        ["Modalidade", DGR.MODALITY_LABEL[state.modality]],
        ["Nome", form.nome.value.trim()],
        ["E-mail", form.email.value.trim()],
        ["Telefone", form.telefone.value.trim()],
        ["Motivo", form.motivo.value.trim() || "Não informado"]
      ];
      App.$("#review-list").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("");
    }

    App.$$("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () { goTo(+b.dataset.go); });
    });

    App.$("#confirm").addEventListener("click", function () {
      var d = DGR.fromISO(state.iso);
      // Revalida: outro agendamento neste navegador pode ter ocupado o horário
      if (DGR.slotsFor(state.pro, d).indexOf(state.time) === -1) {
        App.toast("Este horário acabou de ficar indisponível. Escolha outro.", "error");
        state.time = null; renderSlots(); renderSummary(); goTo(1); return;
      }
      var code = "DGR-" + Date.now().toString(36).toUpperCase().slice(-6);
      var req = {
        code: code, proId: state.pro.id, proName: state.pro.name, date: state.iso, time: state.time,
        minutes: state.pro.sessionMinutes, modality: state.modality,
        nome: form.nome.value.trim(), email: form.email.value.trim(), telefone: form.telefone.value.trim(),
        criadoEm: new Date().toISOString()
      };
      var list = DGR.getRequests();
      list.push(req);
      var saved = DGR.saveRequests(list);
      App.$("#confirm-code").textContent = code;
      App.$("#confirm-when").textContent = App.formatLongDate(d) + " às " + App.formatTime(state.time) + " com " + state.pro.name;
      App.$("#confirm-storage").hidden = saved;
      goTo(4);
      renderRequests();
      App.toast("Solicitação demonstrativa registrada.", "success");
    });

    App.$("#new-request").addEventListener("click", function () {
      form.reset();
      state.iso = null; state.time = null;
      initMonth();
      renderCalendar(); renderSlots(); renderModalities(); renderSummary();
      goTo(1);
    });

    /* ---------- Solicitações salvas ---------- */
    function renderRequests() {
      var wrap = App.$("#requests");
      var list = DGR.getRequests().slice().reverse();
      if (!list.length) { wrap.hidden = true; return; }
      wrap.hidden = false;
      App.$("#requests-list").innerHTML = list.map(function (r) {
        return '<div class="request-item"><div><strong>' + esc(r.proName) + "</strong>" +
          esc(App.formatLongDate(DGR.fromISO(r.date))) + " · " + App.formatTime(r.time) + " · " + esc(DGR.MODALITY_LABEL[r.modality] || "") +
          ' <span class="muted">(' + esc(r.code) + ")</span></div>" +
          '<button type="button" class="btn btn--outline" data-cancel="' + esc(r.code) + '">Cancelar</button></div>';
      }).join("");
    }
    App.$("#requests-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cancel]");
      if (!b) return;
      if (!window.confirm("Remover esta solicitação demonstrativa?")) return;
      DGR.saveRequests(DGR.getRequests().filter(function (r) { return r.code !== b.dataset.cancel; }));
      renderRequests(); renderCalendar(); renderSlots();
      App.toast("Solicitação removida.", "success");
    });

    validateIncoming();
    initMonth();
    renderCalendar(); renderSlots(); renderModalities(); renderSummary(); renderRequests();
  });
})();
