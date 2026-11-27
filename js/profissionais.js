/* =========================================================
   Catálogo de profissionais: busca e filtros dinâmicos
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var App = window.App, DGR = window.DGR;
    var form = App.$("#filters");
    if (!form) return;

    var grid = App.$("#pro-results");
    var count = App.$("#result-count");
    var q = App.$("#f-q");
    var esp = App.$("#f-specialty");
    var mod = App.$("#f-modality");
    var loc = App.$("#f-location");

    App.fillSpecialtySelect(esp);

    // Localizações a partir dos dados
    var seen = {};
    DGR.PROFESSIONALS.forEach(function (p) {
      if (seen[p.locationKey]) return;
      seen[p.locationKey] = true;
      var o = document.createElement("option");
      o.value = p.locationKey;
      o.textContent = DGR.LOCATION_LABEL[p.locationKey] || p.location;
      loc.appendChild(o);
    });

    // Estado inicial a partir da URL (vindo da busca da home)
    var params = new URLSearchParams(location.search);
    q.value = params.get("q") || "";
    if (params.get("especialidade")) esp.value = params.get("especialidade");
    if (params.get("modalidade")) mod.value = params.get("modalidade");
    if (params.get("local")) loc.value = params.get("local");

    function normalize(s) {
      return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function matches(p) {
      var term = normalize(q.value.trim());
      if (term) {
        var hay = normalize([p.name, p.specialty, p.role, p.shortBio].concat(p.topSpecialties, p.moreSpecialties || [], p.methods).join(" "));
        var words = term.split(/\s+/);
        for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) === -1) return false;
      }
      if (esp.value && p.specialty !== esp.value) return false;
      if (mod.value && p.modalities.indexOf(mod.value) === -1) return false;
      if (loc.value && p.locationKey !== loc.value) return false;
      return true;
    }

    function render() {
      var list = DGR.PROFESSIONALS.filter(matches);
      count.textContent = list.length === 1 ? "1 profissional encontrado" : list.length + " profissionais encontrados";
      if (!list.length) {
        grid.innerHTML = '<div class="empty-state"><h3>Nenhum profissional encontrado</h3>' +
          "<p>Tente remover algum filtro ou buscar por outro termo.</p>" +
          '<button type="button" class="btn btn--outline" data-clear>Limpar filtros</button></div>';
      } else {
        grid.innerHTML = list.map(App.proCardHTML).join("");
      }
      // Mantém a URL compartilhável
      var p = new URLSearchParams();
      if (q.value.trim()) p.set("q", q.value.trim());
      if (esp.value) p.set("especialidade", esp.value);
      if (mod.value) p.set("modalidade", mod.value);
      if (loc.value) p.set("local", loc.value);
      history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p.toString() : ""));
    }

    function clear() { form.reset(); q.value = ""; render(); q.focus(); }

    var debounce;
    q.addEventListener("input", function () { clearTimeout(debounce); debounce = setTimeout(render, 180); });
    [esp, mod, loc].forEach(function (s) { s.addEventListener("change", render); });
    form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
    App.$("#f-clear").addEventListener("click", clear);
    grid.addEventListener("click", function (e) { if (e.target.closest("[data-clear]")) clear(); });

    render();
  });
})();
