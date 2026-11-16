    (function () {
      "use strict";
      var reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ── Year ── */
      var yr = document.getElementById("yr");
      if (yr) yr.textContent = new Date().getFullYear();

      /* ── Sticky nav state + progress bar ── */
      var nav = document.getElementById("nav");
      var bar = document.getElementById("progress");
      var ticking = false;

      function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        if (nav) nav.classList.toggle("solid", y > 24);
        if (bar) {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
        }
        ticking = false;
      }
      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
          }
        },
        { passive: true },
      );
      onScroll();

      /* ── Mobile menu ── */
      var burger = document.getElementById("burger");
      var links = document.getElementById("navlinks");
      if (burger && links) {
        burger.addEventListener("click", function () {
          var open = links.classList.toggle("open");
          burger.setAttribute("aria-expanded", open ? "true" : "false");
          burger.setAttribute(
            "aria-label",
            open ? "Close menu" : "Open menu",
          );
        });
        Array.prototype.forEach.call(
          links.querySelectorAll("a"),
          function (a) {
            a.addEventListener("click", function () {
              links.classList.remove("open");
              burger.setAttribute("aria-expanded", "false");
            });
          },
        );
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && links.classList.contains("open")) {
            links.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
            burger.focus();
          }
        });
      }

      /* ── Scroll reveal ── */
      var revealEls = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window) || reduce) {
        Array.prototype.forEach.call(revealEls, function (el) {
          el.classList.add("in");
        });
      } else {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                en.target.classList.add("in");
                io.unobserve(en.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
        );
        Array.prototype.forEach.call(revealEls, function (el) {
          io.observe(el);
        });
      }

      /* ── Form submit state (both forms) ── */

      document.querySelectorAll(".fsform, .enq").forEach(function (form) {
        form.addEventListener("submit", async function (event) {
          event.preventDefault();

          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }

          const button = form.querySelector('button[type="submit"]');
          const status = form.querySelector(".form-status");
          const originalText = button.textContent;

          button.disabled = true;
          button.textContent = "Sending...";

          status.textContent = "";
          status.className = "form-status";

          try {
            const response = await fetch(form.action, {
              method: "POST",
              body: new FormData(form),
              headers: {
                Accept: "application/json"
              }
            });

            if (response.ok) {
              form.reset();

              status.textContent =
                "Thank you! Your enquiry has been sent successfully. I'll contact you on WhatsApp within 24 hours.";

              status.classList.add("success");
            } else {
              throw new Error("Form submission failed");
            }
          } catch (error) {
            status.textContent =
              "Unable to send your enquiry right now. Please try again or contact me directly on WhatsApp.";

            status.classList.add("error");
          } finally {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
      });
      /* ── Subtle hero parallax on the device ── */
      if (!reduce && window.matchMedia("(min-width: 941px)").matches) {
        var device = document.querySelector(".device");
        var hero = document.querySelector("header.hero");
        if (device && hero) {
          window.addEventListener(
            "scroll",
            function () {
              var y = window.pageYOffset || 0;
              if (y > 900) return;
              var shift = Math.max(-26, y * -0.035); // clamped: max 26px upward
              device.style.translate = "0 " + shift + "px";
            },
            { passive: true },
          );
        }
      }
    })();
