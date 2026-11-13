/* ==========================================================
   KANOUJIA & ASSOCIATES: site behaviour
   CUSTOMISE: edit CONFIG below. Everything else works as-is.
   ========================================================== */
(function () {
  "use strict";

  var CONFIG = {
    firmName: "Kanoujia & Associates",
    whatsappNumber: "910000000000",        // country code + number, digits only (e.g. 919876543210)
    phoneDisplay: "+91 00000 00000",
    phoneHref: "+910000000000",
    email: "contact@example.com",
    // Connect a real form service (e.g. Formspree, Web3Forms, your own server) by pasting its URL here.
    // While this is empty, the form validates but does NOT send anything, and says so.
    formEndpoint: ""
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add("js");

  /* Apply contact details from CONFIG */
  $$("[data-wa]").forEach(function (a) { a.href = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent("Hello, I would like to enquire about a consultation."); });
  $$("[data-phone]").forEach(function (a) { a.textContent = CONFIG.phoneDisplay; a.href = "tel:" + CONFIG.phoneHref; });
  $$("[data-email]").forEach(function (a) { a.textContent = CONFIG.email; a.href = "mailto:" + CONFIG.email; });
  $("#year").textContent = new Date().getFullYear();

  /* Sticky nav + scroll-to-top */
  var nav = $("#nav"), toTop = $("#toTop");
  function onScroll() {
    nav.classList.toggle("is-solid", window.scrollY > 20);
    toTop.classList.toggle("is-on", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Mobile menu */
  var btn = $("#menuBtn");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.innerHTML = '<svg class="ic"><use href="#' + (open ? "i-x" : "i-menu") + '"/></svg>';
  }
  btn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Active link highlighting */
  var links = $$(".nav__links a[href^='#']:not(.btn)");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + x.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });

    /* Reveal on scroll */
    var rv = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); rv.unobserve(x.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + "ms"; rv.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }

  /* FAQ accordion (one open at a time) */
  $$("#faq button").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      $$("#faq button").forEach(function (o) { o.setAttribute("aria-expanded", "false"); });
      b.setAttribute("aria-expanded", String(!open));
    });
  });

  /* Practice "Learn more" pre-selects the service in the form */
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = $("#service"), v = a.getAttribute("data-service");
      $$("option", sel).forEach(function (o) { if (o.textContent === v) sel.value = o.value || o.textContent; });
    });
  });

  /* Dialog: team profiles and policy text */
  var dlg = $("#dlg");
  var DOCS = {
    privacy: ["Privacy Policy", "<p>[Replace with your privacy policy.] It should explain what personal data this website collects (for example, details entered in the contact form), why, how long it is kept, and how to contact you about it, in line with the Digital Personal Data Protection Act, 2023.</p>"],
    terms: ["Terms of Use", "<p>[Replace with your terms of use.] It should cover use of the website's content, links to third-party sites, intellectual property, and the limits of liability.</p>"],
    disclaimer: ["Disclaimer", "<p>This website is for general information only and is not legal advice. Nothing on it creates an advocate-client relationship. It does not solicit work or advertise, in line with the Bar Council of India Rules. Please obtain advice specific to your situation before acting on any information here.</p>"]
  };
  function openDlg(title, html) {
    $("#dlgTitle").textContent = title; $("#dlgBody").innerHTML = html;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  $$("[data-profile]").forEach(function (b) {
    b.addEventListener("click", function () {
      var m = b.closest(".member");
      openDlg($("h3", m).textContent, "<p><em>" + $(".role", m).textContent + "</em></p>" + $(".profile-more", m).innerHTML +
        '<p><a class="btn btn--navy" href="#contact" data-close>Book a consultation</a></p>');
    });
  });
  $$("[data-doc]").forEach(function (b) { b.addEventListener("click", function () { var d = DOCS[b.dataset.doc]; openDlg(d[0], d[1]); }); });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.closest("[data-close]")) { dlg.close ? dlg.close() : dlg.removeAttribute("open"); }
  });

  /* Contact form: validation and honest status */
  var form = $("#form"), status = $("#status");
  var RULES = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Enter your full name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."; },
    phone: function (v) { var n = v.replace(/\D/g, ""); if (n.length === 12 && n.indexOf("91") === 0) n = n.slice(2); if (n.length === 11 && n[0] === "0") n = n.slice(1); return /^[6-9]\d{9}$/.test(n) ? "" : "Enter a valid 10-digit Indian mobile number."; },
    service: function (v) { return v ? "" : "Choose a service."; },
    message: function (v) { return v.trim().length >= 15 ? "" : "Describe your matter in at least 15 characters."; },
    ack: function (_, el) { return el.checked ? "" : "Please confirm to continue."; }
  };
  function check(el) {
    var msg = RULES[el.name](el.value, el), f = el.closest(".field");
    f.classList.toggle("has-err", !!msg);
    $(".err", f).textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  $$("input,select,textarea", form).forEach(function (el) {
    el.addEventListener("blur", function () { check(el); });
    el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-err")) check(el); });
  });
  function show(kind, title, text, extra) {
    status.innerHTML = '<div class="box ' + (kind === "err" ? "box--err" : "") + '"><strong></strong><span></span>' + (extra || "") + "</div>";
    $("strong", status).textContent = title; $("span", status).textContent = text;
    status.focus();
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("input,select,textarea", form).filter(function (el) { return !check(el); });
    if (bad.length) { bad[0].focus(); show("err", "Check the highlighted fields.", "Some details are missing or not valid."); return; }
    var d = {}; $$("input,select,textarea", form).forEach(function (el) { d[el.name] = el.type === "checkbox" ? el.checked : el.value.trim(); });
    if (CONFIG.formEndpoint) {
      var submit = $("button[type=submit]", form); submit.disabled = true;
      fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); show("ok", "Enquiry sent.", "Thank you. We will contact you to arrange a time."); })
        .catch(function () { show("err", "Your enquiry was not sent.", "Please try again, or contact us by phone or WhatsApp."); })
        .then(function () { submit.disabled = false; });
      return;
    }
    /* No backend connected: say so, and offer working channels with the details prefilled */
    var text = "Hello, I would like to book a consultation.\nName: " + d.name + "\nPhone: " + d.phone + "\nService: " + d.service + "\nMatter: " + d.message;
    var wa = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
    var mail = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Consultation request: " + d.service) + "&body=" + encodeURIComponent(text);
    show("ok", "Details checked. Not sent yet.", "This form is not connected to a server, so nothing has been submitted. Send your enquiry using one of these:",
      '<div class="acts"><a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa + '">Send on WhatsApp</a><a class="btn btn--navy" href="' + mail + '">Send by email</a></div>');
  });
})();
