/* =========================================================
   contato.js — formulário de contato com validação.
   Não há backend: a mensagem NÃO é enviada. Ela fica salva
   apenas neste navegador e o usuário é informado disso.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var App = window.App;
    var form = App.$("#contact-form");
    if (!form) return;

    var success = App.$("#contact-success");
    var error = App.$("#contact-error");
    var counter = App.$("#msg-count");
    var message = App.$("#c-message");
    var submit = form.querySelector("[type=submit]");

    App.bindLiveValidation(form);
    message.addEventListener("input", function () { counter.textContent = message.value.length; });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      success.hidden = true;
      error.hidden = true;

      if (!App.validateForm(form)) {
        error.hidden = false;
        error.querySelector("span").textContent = "Revise os campos destacados antes de continuar.";
        return;
      }

      // Pequeno estado de carregamento para dar feedback visual
      submit.disabled = true;
      submit.textContent = "Registrando…";

      setTimeout(function () {
        var data = {
          nome: form.nome.value.trim(),
          email: form.email.value.trim(),
          telefone: form.telefone.value.trim(),
          assunto: form.assunto.value,
          mensagem: form.mensagem.value.trim(),
          criadoEm: new Date().toISOString()
        };
        var list = App.storeGet("dgr_mensagens", []);
        list.push(data);
        var saved = App.storeSet("dgr_mensagens", list);

        form.reset();
        counter.textContent = "0";
        submit.disabled = false;
        submit.textContent = "Enviar mensagem";

        success.hidden = false;
        success.querySelector("span").textContent =
          "Obrigada, " + data.nome.split(" ")[0] + ". Esta é uma versão demonstrativa do site: sua mensagem " +
          (saved ? "foi registrada apenas neste navegador e " : "") +
          "não foi enviada. Para falar com Drew agora, use o WhatsApp ou o e-mail ao lado.";
        success.focus();
        App.toast("Mensagem registrada (demonstração).", "success");
      }, 500);
    });
  });
})();
