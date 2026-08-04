/* Coastal Crest Notary - site interactions (hand-coded, no dependencies) */
(function () {
  "use strict";

  // --- mobile nav ---
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var ans = btn.nextElementSibling;
      var isOpen = item.classList.toggle("open");
      ans.style.maxHeight = isOpen ? ans.scrollHeight + "px" : null;
    });
  });

  // --- reveal on scroll ---
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // --- current year ---
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // --- contact form (Web3Forms AJAX) ---
  var form = document.getElementById("notaryForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]').value;
      if (!key || key.indexOf("YOUR_") === 0) {
        show("Form is not connected yet. Please call or text 561-316-0749.", "#c0392b");
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending...";
      show("", "");
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            show("Thank you - your request is in. We'll reach out shortly. For anything urgent, call or text 561-316-0749.", "#0f8a86");
          } else {
            show("Something went wrong. Please call or text 561-316-0749.", "#c0392b");
          }
        })
        .catch(function () {
          show("Network error. Please call or text 561-316-0749.", "#c0392b");
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  }
  function show(msg, color) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = color;
    status.style.display = msg ? "block" : "none";
  }

  // --- mock AI chat widget (demo of the DV8 GHL assistant) ---
  var cw = document.getElementById("chatWidget");
  if (cw) {
    var launch = document.getElementById("cwLaunch");
    var closeBtn = document.getElementById("cwClose");
    var teaser = document.getElementById("cwTeaser");
    var teaserX = document.getElementById("cwTeaserX");
    var body = document.getElementById("cwBody");
    var chips = document.getElementById("cwChips");
    var form = document.getElementById("cwForm");
    var input = document.getElementById("cwInput");
    var seeded = false;

    var greeting = "Hi there! I'm Coastal Crest's virtual assistant - available 24/7 and trained on everything we do. Ask me about mobile notary visits, loan signings, apostille, pricing, or booking an appointment.";
    var qa = [
      { q: "Do you come to me?", a: "Yes! We're a mobile notary, so we come to your home, office, hospital, or care facility anywhere in Palm Beach County. Where would you like to meet?" },
      { q: "How much does it cost?", a: "It's the state-authorized notary fee per signature plus a travel fee based on your location and timing. I can arrange an exact quote - want a team member to text you back?" },
      { q: "Book an appointment", a: "Happy to help you book. What service do you need, and what day and time works best? For the fastest response you can also call or text 561-316-0749." },
      { q: "What can you notarize?", a: "Acknowledgments, jurats, powers of attorney, real estate and loan signings, apostille documents, and more. What are you signing?" }
    ];
    var fallback = "Great question. In the live version I answer instantly from Coastal Crest's own information, any time of day. For now, the fastest way to get help is to call or text 561-316-0749.";

    function scroll() { body.scrollTop = body.scrollHeight; }
    function addMsg(text, who) {
      var d = document.createElement("div");
      d.className = "cw-msg " + who;
      d.textContent = text;
      body.appendChild(d); scroll();
    }
    function typing(then) {
      var t = document.createElement("div");
      t.className = "cw-typing";
      t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t); scroll();
      setTimeout(function () { t.remove(); then(); }, 850);
    }
    function renderChips() {
      chips.innerHTML = "";
      qa.forEach(function (item) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "cw-chip"; b.textContent = item.q;
        b.addEventListener("click", function () { ask(item.q, item.a); });
        chips.appendChild(b);
      });
    }
    function ask(q, a) {
      addMsg(q, "user");
      chips.innerHTML = "";
      typing(function () { addMsg(a, "ai"); renderChips(); });
    }
    function seed() {
      if (seeded) return; seeded = true;
      typing(function () { addMsg(greeting, "ai"); renderChips(); });
    }
    function openChat() {
      cw.classList.add("open");
      launch.setAttribute("aria-expanded", "true");
      hideTeaser();
      seed();
      setTimeout(function () { input.focus(); }, 300);
    }
    function closeChat() {
      cw.classList.remove("open");
      launch.setAttribute("aria-expanded", "false");
    }
    function hideTeaser() { if (teaser) teaser.classList.remove("show"); }

    launch.addEventListener("click", function () {
      cw.classList.contains("open") ? closeChat() : openChat();
    });
    closeBtn.addEventListener("click", closeChat);
    if (teaserX) teaserX.addEventListener("click", function (e) { e.stopPropagation(); hideTeaser(); });
    if (teaser) teaser.addEventListener("click", openChat);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (input.value || "").trim();
      if (!v) return;
      input.value = "";
      addMsg(v, "user");
      chips.innerHTML = "";
      typing(function () { addMsg(fallback, "ai"); renderChips(); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && cw.classList.contains("open")) closeChat(); });

    // auto-show the teaser once, shortly after load
    setTimeout(function () { if (teaser && !cw.classList.contains("open")) teaser.classList.add("show"); }, 2600);
  }
})();
