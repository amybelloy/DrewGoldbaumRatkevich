/* =========================================================
   Scripts globais: navegação, utilidades, formulários,
   depoimentos, busca da home, contato e FAQ.
   ========================================================= */
(function () {
  "use strict";

  var DGR = window.DGR || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Formatação de datas ---------- */
  var WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  var WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  var MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function formatLongDate(d) {
    return WEEKDAYS[d.getDay()] + ", " + d.getDate() + " de " + MONTHS[d.getMonth()] + " de " + d.getFullYear();
  }
  function formatTime(t) {
    var p = t.split(":");
    return p[1] === "00" ? +p[0] + "h" : t;
  }
  function timezoneLabel() {
    var off = -new Date().getTimezoneOffset() / 60;
    var sign = off >= 0 ? "+" : "-";
    var abs = Math.abs(off);
    var h = Math.floor(abs);
    var m = Math.round((abs - h) * 60);
    return "Fuso horário " + sign + (h < 10 ? "0" : "") + h + (m ? ":" + (m < 10 ? "0" : "") + m : "");
  }

  /* ---------- Toasts ---------- */
  function toast(message, type) {
    var region = $(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var el = document.createElement("div");
    el.className = "toast" + (type ? " toast--" + type : "");
    el.textContent = message;
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  /* ---------- Máscara de telefone ---------- */
  function maskPhone(value) {
    var d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function bindPhoneMasks(ctx) {
    $$("[data-mask='phone']", ctx).forEach(function (input) {
      input.addEventListener("input", function () { input.value = maskPhone(input.value); });
    });
  }

  /* ---------- Validação ---------- */
  var RULES = {
    required: function (v) { return v.trim() ? "" : "Este campo é obrigatório."; },
    name: function (v) { return v.trim().split(/\s+/).length >= 2 ? "" : "Informe nome e sobrenome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido."; },
    phone: function (v) { var n = v.replace(/\D/g, ""); return n.length >= 10 && n.length <= 11 ? "" : "Informe um telefone com DDD."; },
    min20: function (v) { return v.trim().length >= 20 ? "" : "Escreva ao menos 20 caracteres."; },
    checked: function (v, el) { return el.checked ? "" : "É necessário aceitar para continuar."; }
  };

  function validateField(el) {
    var field = el.closest(".field") || el.parentElement;
    var errorEl = field ? field.querySelector(".field-error") : null;
    var rules = (el.getAttribute("data-validate") || "").split(" ").filter(Boolean);
    var msg = "";
    for (var i = 0; i < rules.length && !msg; i++) {
      var rule = RULES[rules[i]];
      if (!rule) continue;
      if (rules[i] !== "required" && rules[i] !== "checked" && !el.value.trim() && rules.indexOf("required") === -1) continue;
      msg = rule(el.value || "", el);
    }
    if (field) field.classList.toggle("has-error", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  function validateForm(form) {
    var ok = true;
    var first = null;
    $$("[data-validate]", form).forEach(function (el) {
      if (el.closest("[hidden]")) return;
      var valid = validateField(el);
      if (!valid && !first) first = el;
      ok = ok && valid;
    });
    if (first) first.focus();
    return ok;
  }

  function bindLiveValidation(form) {
    $$("[data-validate]", form).forEach(function (el) {
      var evt = el.type === "checkbox" ? "change" : "blur";
      el.addEventListener(evt, function () { validateField(el); });
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field && field.classList.contains("has-error")) validateField(el);
      });
    });
  }

  /* ---------- Modal ---------- */
  var lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var focusable = modal.querySelector("input, button:not(.modal-close), select, textarea, a[href]");
    (focusable || modal.querySelector(".modal-close")).focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var closer = e.target.closest("[data-close-modal]");
    if (closer) closeModal(closer.closest(".modal"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = $(".modal:not([hidden])");
    if (open) closeModal(open);
    var nav = $(".main-nav.is-open");
    if (nav) toggleNav(false);
  });

  /* ---------- Navegação ---------- */
  function toggleNav(force) {
    var btn = $(".nav-toggle");
    var nav = $(".main-nav");
    if (!btn || !nav) return;
    var open = typeof force === "boolean" ? force : btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  function initNav() {
    var btn = $(".nav-toggle");
    if (btn) btn.addEventListener("click", function () { toggleNav(); });
    $$(".main-nav a").forEach(function (a) { a.addEventListener("click", function () { toggleNav(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024) toggleNav(false); });

    // Marca o link da página atual
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (page === "perfil-profissional.html") page = "profissionais.html";
    $$(".main-nav a").forEach(function (a) {
      if ((a.getAttribute("href") || "").toLowerCase() === page) a.setAttribute("aria-current", "page");
    });

    var header = $(".site-header");
    var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Animação de entrada ---------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Depoimentos ---------- */
  function initTestimonials() {
    var root = $("[data-testimonials]");
    if (!root) return;
    var items = $$(".testimonial", root);
    var dotsWrap = $(".dots", root);
    var index = 0;
    var timer = null;

    items.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Depoimento " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });

    function go(i) {
      index = (i + items.length) % items.length;
      items.forEach(function (el, j) { el.classList.toggle("is-active", j === index); });
      $$("button", dotsWrap).forEach(function (b, j) { b.setAttribute("aria-current", j === index ? "true" : "false"); });
    }
    function restart() {
      clearInterval(timer);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(function () { go(index + 1); }, 7000);
    }
    $("[data-prev]", root).addEventListener("click", function () { go(index - 1); restart(); });
    $("[data-next]", root).addEventListener("click", function () { go(index + 1); restart(); });
    go(0);
    restart();
  }

  /* ---------- Busca na página inicial ---------- */
  function fillSpecialtySelect(select) {
    if (!select || !DGR.allSpecialties) return;
    DGR.allSpecialties().forEach(function (s) {
      var o = document.createElement("option");
      o.value = s; o.textContent = s;
      select.appendChild(o);
    });
  }

  function initHomeSearch() {
    var form = $("#home-search");
    if (!form) return;
    fillSpecialtySelect($("#home-specialty", form));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      var q = $("#home-q", form).value.trim();
      var esp = $("#home-specialty", form).value;
      if (q) params.set("q", q);
      if (esp) params.set("especialidade", esp);
      location.href = "profissionais.html" + (params.toString() ? "?" + params.toString() : "");
    });
  }

  /* ---------- Profissionais em destaque (home) ---------- */
  function proCardHTML(p) {
    var I = DGR.ICONS;
    var esc = DGR.escapeHTML;
    var photo = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="Retrato de ' + esc(p.name) + '" loading="lazy">'
      : '<span class="pro-monogram" aria-hidden="true">' + esc(DGR.initials(p.name)) + "</span>";
    var mods = p.modalities.map(function (m) { return DGR.MODALITY_LABEL[m]; }).join(" · ");
    return '<article class="pro-card">' +
      '<div class="pro-photo">' + (p.demo ? '<span class="pro-badge">Perfil demonstrativo</span>' : '<span class="pro-badge">Agenda aberta</span>') + photo + "</div>" +
      '<div class="pro-body">' +
        '<span class="pro-specialty">' + esc(p.specialty) + "</span>" +
        "<h3>" + esc(p.name) + "</h3>" +
        '<ul class="pro-meta">' +
          "<li>" + I.cap + "<span>" + esc(p.educationShort) + "</span></li>" +
          "<li>" + I.briefcase + "<span>" + p.years + " anos de experiência</span></li>" +
          "<li>" + I.pin + "<span>" + esc(mods) + " — " + esc(p.location) + "</span></li>" +
        "</ul>" +
        '<a class="btn btn--outline btn--block" href="perfil-profissional.html?id=' + encodeURIComponent(p.id) + '">Ver perfil</a>' +
      "</div></article>";
  }

  function initFeatured() {
    var grid = $("[data-featured]");
    if (!grid || !DGR.PROFESSIONALS) return;
    grid.innerHTML = DGR.PROFESSIONALS.slice(0, 3).map(proCardHTML).join("");
  }

  /* ---------- FAQ ---------- */
  function initFAQ() {
    $$(".faq-question").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
      });
    });
  }

  /* ---------- Formulário de contato ---------- */
  function initContact() {
    var form = $("#contact-form");
    if (!form) return;
    bindLiveValidation(form);
    var success = $("#contact-success");
    var error = $("#contact-error");
    var counter = $("#msg-count");
    var msg = $("#c-message");
    if (counter && msg) msg.addEventListener("input", function () { counter.textContent = msg.value.length; });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      success.hidden = true;
      error.hidden = true;
      if (!validateForm(form)) {
        error.hidden = false;
        error.querySelector("span").textContent = "Revise os campos destacados antes de enviar.";
        return;
      }
      var data = {
        nome: form.nome.value.trim(), email: form.email.value.trim(), telefone: form.telefone.value.trim(),
        assunto: form.assunto.value, mensagem: form.mensagem.value.trim(), criadoEm: new Date().toISOString()
      };
      var list = DGR.safeGet("dgr_mensagens", []);
      list.push(data);
      DGR.safeSet("dgr_mensagens", list);
      form.reset();
      if (counter) counter.textContent = "0";
      success.hidden = false;
      success.querySelector("span").textContent = "Obrigada, " + data.nome.split(" ")[0] + "! Sua mensagem foi registrada neste navegador. Esta é uma demonstração: nenhum e-mail foi enviado.";
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("Mensagem registrada (demonstração).", "success");
    });
  }

  /* ---------- Newsletter do rodapé ---------- */
  function initNewsletter() {
    $$("[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        if (RULES.email(input.value)) { toast("Informe um e-mail válido.", "error"); input.focus(); return; }
        var list = DGR.safeGet("dgr_newsletter", []);
        list.push(input.value.trim());
        DGR.safeSet("dgr_newsletter", list);
        form.reset();
        toast("E-mail registrado neste navegador (demonstração).", "success");
      });
    });
  }

  function initYear() { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  // API compartilhada com os scripts de cada página
  window.App = {
    $: $, $$: $$, toast: toast, maskPhone: maskPhone, bindPhoneMasks: bindPhoneMasks,
    validateForm: validateForm, validateField: validateField, bindLiveValidation: bindLiveValidation,
    openModal: openModal, closeModal: closeModal, proCardHTML: proCardHTML, fillSpecialtySelect: fillSpecialtySelect,
    formatLongDate: formatLongDate, formatTime: formatTime, timezoneLabel: timezoneLabel,
    WEEKDAYS: WEEKDAYS, WEEKDAYS_SHORT: WEEKDAYS_SHORT, MONTHS: MONTHS
  };

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initTestimonials();
    initHomeSearch();
    initFeatured();
    initFAQ();
    initContact();
    initNewsletter();
    bindPhoneMasks();
    initYear();
  });
})();
