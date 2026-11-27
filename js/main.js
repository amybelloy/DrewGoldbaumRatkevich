/* =========================================================
   main.js — scripts compartilhados por todas as páginas
   - Configuração de contato (edite CONFIG)
   - Menu responsivo, cabeçalho e animações de entrada
   - Utilidades: toast, modal, máscara de telefone, validação
   - WhatsApp, compartilhar/salvar, "Mostrar mais", abas do perfil
   - Blog: filtros e leitura de artigos; exercício de respiração
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Configuração ----------
     Preencha com os contatos oficiais antes de publicar.
     whatsapp: somente números, com código do país (ex.: "15551234567"). */
  var CONFIG = {
    whatsapp: "",
    whatsappMessage: "Olá, Drew! Gostaria de mais informações sobre o atendimento.",
    email: ""
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Armazenamento local seguro ---------- */
  function storeGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ---------- Toasts (feedback visual) ---------- */
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
    setTimeout(function () { el.remove(); }, 4500);
  }

  /* ---------- Máscara de telefone (BR e internacional) ---------- */
  function maskPhone(value) {
    var raw = value.trim();
    if (raw.charAt(0) === "+") {
      // Internacional: formatos variam por país; apenas remove caracteres inválidos
      return "+" + raw.slice(1).replace(/[^\d\s()-]/g, "").slice(0, 20);
    }
    var d = raw.replace(/\D/g, "").slice(0, 11);
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

  /* ---------- Validação de formulários ----------
     Use data-validate="required email phone name min20 checked" nos campos.
     O erro aparece no .field-error dentro do mesmo .field. */
  var RULES = {
    required: function (v) { return v.trim() ? "" : "Este campo é obrigatório."; },
    name: function (v) { return v.trim().split(/\s+/).length >= 2 ? "" : "Informe nome e sobrenome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido."; },
    phone: function (v) { var n = v.replace(/\D/g, ""); return n.length >= 10 && n.length <= 15 ? "" : "Informe um telefone válido, com DDD ou código do país."; },
    min20: function (v) { return v.trim().length >= 20 ? "" : "Escreva ao menos 20 caracteres."; },
    checked: function (v, el) { return el.checked ? "" : "É necessário aceitar para continuar."; }
  };

  function validateField(el) {
    var field = el.closest(".field") || el.parentElement;
    var errorEl = field ? field.querySelector(".field-error") : null;
    var rules = (el.getAttribute("data-validate") || "").split(" ").filter(Boolean);
    var optional = rules.indexOf("required") === -1 && rules.indexOf("checked") === -1;
    var msg = "";
    if (!(optional && !el.value.trim())) {
      for (var i = 0; i < rules.length && !msg; i++) {
        if (RULES[rules[i]]) msg = RULES[rules[i]](el.value || "", el);
      }
    }
    if (field) field.classList.toggle("has-error", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errorEl) {
      errorEl.textContent = msg;
      if (errorEl.id) el.setAttribute("aria-describedby", errorEl.id);
    }
    return !msg;
  }

  function validateForm(form) {
    var ok = true, first = null;
    $$("[data-validate]", form).forEach(function (el) {
      var valid = validateField(el);
      if (!valid && !first) first = el;
      ok = ok && valid;
    });
    if (first) first.focus();
    return ok;
  }

  function bindLiveValidation(form) {
    $$("[data-validate]", form).forEach(function (el) {
      el.addEventListener(el.type === "checkbox" ? "change" : "blur", function () { validateField(el); });
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field && field.classList.contains("has-error")) validateField(el);
      });
    });
  }

  /* ---------- Modal acessível ---------- */
  var lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var target = modal.querySelector("[data-autofocus]") || modal.querySelector(".modal-close");
    if (target) target.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
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
    closeModal($(".modal:not([hidden])"));
    toggleNav(false);
  });

  /* ---------- Menu responsivo ---------- */
  function toggleNav(force) {
    var btn = $(".nav-toggle"), nav = $(".main-nav");
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
    window.addEventListener("resize", function () { if (window.innerWidth > 1200) toggleNav(false); });

    // Destaca a página atual no menu
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".main-nav ul a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      var isRecursos = href.indexOf("#recursos") !== -1;
      if (href.split("#")[0] === page && (!isRecursos || location.hash === "#recursos")) a.setAttribute("aria-current", "page");
    });
    // Em blog.html, "Blog" e "Recursos" alternam conforme a seção visível
    if (page === "blog.html") {
      var links = $$('.main-nav ul a[href^="blog.html"]');
      var recursos = $("#recursos");
      var sync = function () {
        var inRecursos = recursos && recursos.getBoundingClientRect().top < window.innerHeight * 0.4;
        links.forEach(function (a) {
          var r = a.getAttribute("href").indexOf("#recursos") !== -1;
          if (r === !!inRecursos) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
      };
      window.addEventListener("scroll", sync, { passive: true });
      sync();
    }

    var header = $(".site-header");
    var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Animações de entrada ---------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Estrelas de avaliação ---------- */
  function initStars() {
    $$("[data-rating]").forEach(function (el) {
      var value = parseFloat(el.getAttribute("data-rating")) || 0;
      var fill = el.querySelector("span");
      if (fill) fill.style.width = Math.max(0, Math.min(100, value / 5 * 100)) + "%";
    });
  }

  /* ---------- WhatsApp ---------- */
  function initWhatsApp() {
    $$("[data-whatsapp]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (!CONFIG.whatsapp) {
          toast("O número de WhatsApp ainda não foi configurado. Use o formulário de contato.", "error");
          return;
        }
        var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
        window.open(url, "_blank", "noopener");
      });
    });
    $$("[data-email]").forEach(function (el) {
      if (CONFIG.email) { el.textContent = CONFIG.email; el.setAttribute("href", "mailto:" + CONFIG.email); }
    });
  }

  /* ---------- Compartilhar e salvar ---------- */
  function initShareSave() {
    $$("[data-share]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var data = { title: document.title, url: location.href.split("#")[0] };
        if (navigator.share) { navigator.share(data).catch(function () {}); return; }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(data.url).then(function () { toast("Link copiado.", "success"); },
            function () { toast("Não foi possível copiar o link.", "error"); });
        } else {
          window.prompt("Copie o link:", data.url);
        }
      });
    });
    $$("[data-save]").forEach(function (btn) {
      var sync = function (saved) {
        btn.setAttribute("aria-pressed", String(saved));
        btn.querySelector("span").textContent = saved ? "Salvo" : "Salvar";
      };
      sync(storeGet("dgr_salvo", false));
      btn.addEventListener("click", function () {
        var saved = !storeGet("dgr_salvo", false);
        storeSet("dgr_salvo", saved);
        sync(saved);
        toast(saved ? "Perfil salvo neste navegador." : "Perfil removido dos salvos.", "success");
      });
    });
  }

  /* ---------- "Mostrar mais" para textos cortados ---------- */
  function initShowMore() {
    var buttons = $$(".show-more");
    if (!buttons.length) return;
    var update = function () {
      buttons.forEach(function (btn) {
        var target = btn.previousElementSibling;
        btn.hidden = !target.classList.contains("is-open") && target.scrollHeight <= target.clientHeight + 2;
      });
    };
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.previousElementSibling.classList.toggle("is-open");
        btn.textContent = open ? "Mostrar menos" : "Mostrar mais";
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    update();
    window.addEventListener("resize", update);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  }

  /* ---------- Abas do perfil (destaca a seção visível) ---------- */
  function initProfileTabs() {
    var links = $$(".profile-tabs a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
        var link = map[entry.target.id];
        if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Blog: filtros e leitura ---------- */
  function initBlog() {
    var grid = $("#blog-grid");
    if (!grid) return;
    var chips = $$(".filter-bar .chip");
    var status = $("#blog-status");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        var visible = 0;
        $$(".post-card", grid).forEach(function (card) {
          var show = cat === "todos" || card.getAttribute("data-category") === cat;
          card.hidden = !show;
          if (show) visible++;
        });
        status.textContent = visible === 1 ? "1 artigo" : visible + " artigos";
      });
    });

    var modal = $("#article-modal");
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-article]");
      if (!btn) return;
      var tpl = document.getElementById("artigo-" + btn.getAttribute("data-article"));
      var card = btn.closest(".post-card");
      $("#article-title").textContent = card.querySelector("h3").textContent;
      $("#article-meta").textContent = card.querySelector(".post-meta").textContent.replace(/\s+/g, " ").trim();
      var body = $("#article-body");
      body.innerHTML = "";
      body.appendChild(tpl.content.cloneNode(true));
      openModal(modal);
    });
  }

  /* ---------- Exercício de respiração (4-4-6) ---------- */
  function initBreathing() {
    var circle = $("#breath-circle");
    if (!circle) return;
    var label = $("#breath-label");
    var btn = $("#breath-toggle");
    var timers = [];
    var running = false;
    var phases = [
      { cls: "is-in", text: "Inspire", ms: 4000 },
      { cls: "is-hold", text: "Segure", ms: 4000 },
      { cls: "is-out", text: "Expire", ms: 6000 }
    ];
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function cycle(i) {
      var p = phases[i % phases.length];
      circle.className = "breathing-circle " + p.cls;
      label.textContent = p.text;
      timers.push(setTimeout(function () { if (running) cycle(i + 1); }, p.ms));
    }
    btn.addEventListener("click", function () {
      running = !running;
      btn.textContent = running ? "Pausar" : "Começar";
      btn.setAttribute("aria-pressed", String(running));
      clear();
      if (running) cycle(0);
      else { circle.className = "breathing-circle"; label.textContent = "Pronto"; }
    });
  }

  function initYear() { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  /* ---------- API compartilhada com os demais scripts ---------- */
  window.App = {
    $: $, $$: $$, toast: toast, storeGet: storeGet, storeSet: storeSet,
    maskPhone: maskPhone, bindPhoneMasks: bindPhoneMasks,
    validateForm: validateForm, validateField: validateField, bindLiveValidation: bindLiveValidation,
    openModal: openModal, closeModal: closeModal, CONFIG: CONFIG
  };

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initStars();
    initWhatsApp();
    initShareSave();
    initShowMore();
    initProfileTabs();
    initBlog();
    initBreathing();
    bindPhoneMasks();
    initYear();
  });
})();
