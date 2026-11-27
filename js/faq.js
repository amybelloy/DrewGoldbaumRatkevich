/* =========================================================
   faq.js — acordeões com animação suave, busca e categorias
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var App = window.App;
    var items = App.$$(".faq-item");
    if (!items.length) return;

    /* Abre ou fecha um item animando a altura */
    function setOpen(item, open) {
      var btn = item.querySelector(".faq-question");
      var panel = item.querySelector(".faq-answer");
      btn.setAttribute("aria-expanded", String(open));
      if (open) {
        panel.hidden = false;
        panel.style.height = "0px";
        void panel.offsetHeight; // força o reflow para a transição começar do zero
        panel.style.height = panel.scrollHeight + "px";
        panel.addEventListener("transitionend", function done() {
          if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
          panel.removeEventListener("transitionend", done);
        });
      } else {
        panel.style.height = panel.scrollHeight + "px";
        requestAnimationFrame(function () { panel.style.height = "0px"; });
        panel.addEventListener("transitionend", function done() {
          if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true;
          panel.removeEventListener("transitionend", done);
        });
      }
    }

    items.forEach(function (item) {
      item.querySelector(".faq-question").addEventListener("click", function () {
        var open = this.getAttribute("aria-expanded") !== "true";
        // Mantém apenas um item aberto por vez
        if (open) items.forEach(function (other) {
          if (other !== item && other.querySelector(".faq-question").getAttribute("aria-expanded") === "true") setOpen(other, false);
        });
        setOpen(item, open);
      });
    });

    /* Busca e filtro por categoria */
    var search = App.$("#faq-search");
    var chips = App.$$(".faq-tools .chip");
    var empty = App.$("#faq-empty");
    var status = App.$("#faq-status");
    var category = "todas";

    function normalize(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

    function apply() {
      var term = normalize(search ? search.value.trim() : "");
      var visible = 0;
      items.forEach(function (item) {
        var matchCat = category === "todas" || item.getAttribute("data-category") === category;
        var matchText = !term || normalize(item.textContent).indexOf(term) !== -1;
        item.hidden = !(matchCat && matchText);
        if (!item.hidden) visible++;
      });
      empty.hidden = visible > 0;
      status.textContent = visible === 1 ? "1 pergunta encontrada" : visible + " perguntas encontradas";
    }

    if (search) search.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        category = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        apply();
      });
    });

    // Abre a pergunta indicada no endereço (ex.: faq.html#pagamento)
    function openFromHash() {
      if (!location.hash) return;
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains("faq-item") && target.querySelector(".faq-question").getAttribute("aria-expanded") !== "true") {
        setOpen(target, true);
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  });
})();
