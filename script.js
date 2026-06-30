document.addEventListener("DOMContentLoaded", () => {

const path = window.location.pathname;

// Kijkt of in de URL of je op de pagina bent
const isLogin =
  path.includes("login") ||
  path.endsWith("/login") ||
  path.endsWith("login.html");

const isRegister =
  path.includes("registreer") ||
  path.endsWith("/registreer") ||
  path.endsWith("registreer.html");

const isAuth = isLogin || isRegister;

const loggedIn = localStorage.getItem("isLoggedIn") === "true";

// Stuurt je terug naar login als je niet ingelogd bent en niet op de login of registreer pagina bent
if (!loggedIn && !isAuth) {
  window.location.href = "login.html";
  return;
}

  // login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;
      const user = JSON.parse(localStorage.getItem("user_" + email));
      if (user && user.pass === pass) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", email);
        window.location.href = "index.html";
      } else {
        alert("Onjuiste login gegevens");
      }
    });
  }

  /* REGISTER */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const pass = document.getElementById("regPassword").value;
      const gender = document.getElementById("regGender")?.value || "";
      const age = document.getElementById("regAge")?.value || "";

      localStorage.setItem("user_" + email,
        JSON.stringify({ name, email, pass, gender, age }));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", email);
      if (!localStorage.getItem("sleepHistory")) {
        localStorage.setItem("sleepHistory", JSON.stringify([]));
      }
      window.location.href = "index.html";
    });
  }

  /* LOGOUT */
  document.querySelectorAll("#logoutBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  });

  /* SLEEP SYSTEM */
  const sleepBtn = document.getElementById("sleepBtn");
  if (sleepBtn) {
    const status = document.getElementById("status");
    const info = document.getElementById("info");
    let sleepStart = localStorage.getItem("sleepStart");
    let timer;

    function format(ms) {
      return { h: Math.floor(ms / 3600000), m: Math.floor((ms % 3600000) / 60000) };
    }
    function startTimer() {
      timer = setInterval(() => {
        const diff = Date.now() - parseInt(sleepStart);
        const t = format(diff);
        if (info) info.innerText = `Je slaapt nu: ${t.h}u ${t.m}m`;
      }, 1000);
    }

    if (sleepStart) {
      status.innerText = "Je slaapt 😴";
      sleepBtn.innerText = "Wakker worden";
      startTimer();
    }

    sleepBtn.addEventListener("click", () => {
      if (!sleepStart) {
        sleepStart = Date.now();
        localStorage.setItem("sleepStart", sleepStart);
        status.innerText = "Je slaapt 😴";
        sleepBtn.innerText = "Wakker worden";
        startTimer();
      } else {
        clearInterval(timer);
        status.innerText = "Hoe heb je geslapen?";
        sleepBtn.style.display = "none";

        let box = document.getElementById("qualityBox");
        if (!box) {
          box = document.createElement("div");
          box.id = "qualityBox";
          box.innerHTML = `
            <button id="badSleep">Slecht 😴</button>
            <button id="avgSleep">Gemiddeld 😐</button>
            <button id="goodSleep">Goed 😄</button>`;
          document.body.appendChild(box);
        } else {
          box.style.display = "block";
        }

        const badBtn = document.getElementById("badSleep");
        const avgBtn = document.getElementById("avgSleep");
        const goodBtn = document.getElementById("goodSleep");

        function saveSleep(quality) {
          const end = Date.now();
          const start = parseInt(localStorage.getItem("sleepStart"));
          const duration = end - start;
          const hours = Math.floor(duration / 3600000);
          const minutes = Math.floor((duration % 3600000) / 60000);

          let history = JSON.parse(localStorage.getItem("sleepHistory")) || [];
          history.push({ start, end, hours, minutes, date: new Date().toDateString(), quality });
          localStorage.setItem("sleepHistory", JSON.stringify(history));

          localStorage.removeItem("sleepStart");
          sleepStart = null;
          box.style.display = "none";
          sleepBtn.style.display = "inline-block";
          status.innerText = "Je bent wakker ☀️";
          sleepBtn.innerText = "Ga slapen";
          if (info) info.innerText = `Laatste slaap: ${hours}u ${minutes}m (${quality})`;
        }

        badBtn.onclick = () => saveSleep("Slecht 😴");
        avgBtn.onclick = () => saveSleep("Gemiddeld 😐");
        goodBtn.onclick = () => saveSleep("Goed 😄");
      }
    });
  }

  /* DASHBOARD */
  const history = JSON.parse(localStorage.getItem("sleepHistory")) || [];
  const sleepHours = document.getElementById("sleepHours");
  const bedTime = document.getElementById("bedTime");
  const wakeTime = document.getElementById("wakeTime");
  const sleepQuality = document.getElementById("sleepQuality");

  if (history.length > 0) {
    const last = history[history.length - 1];
    if (sleepHours) sleepHours.innerText = `${last.hours}u ${last.minutes}m`;
    if (bedTime) bedTime.innerText = new Date(last.start).toLocaleTimeString();
    if (wakeTime) wakeTime.innerText = new Date(last.end).toLocaleTimeString();
    if (sleepQuality) sleepQuality.innerText = last.quality;
  }

  /* PROFILE */
  const profileBox = document.getElementById("profileBox");
  if (profileBox) {
    const email = localStorage.getItem("currentUser");
    const user = JSON.parse(localStorage.getItem("user_" + email));
    if (user) {
      profileBox.innerHTML = `
        <div class="card"><h2>Naam</h2><p>${user.name || "-"}</p></div>
        <div class="card"><h2>Email</h2><p>${user.email || "-"}</p></div>
        <div class="card"><h2>Geslacht</h2><p>${user.gender || "Niet ingevuld"}</p></div>
        <div class="card"><h2>Leeftijd</h2><p>${user.age ? user.age + " jaar" : "Niet ingevuld"}</p></div>`;
    }
  }

  /* HISTORY */
  const historyContainer = document.getElementById("historyContainer");
  if (historyContainer) {
    const data = JSON.parse(localStorage.getItem("sleepHistory")) || [];
    const emptyMsg = document.getElementById("emptyMsg");
    if (data.length === 0) {
      if (emptyMsg) emptyMsg.innerText = "Geen slaapgeschiedenis.";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      data.reverse().forEach((sleep, index) => {
        const start = new Date(sleep.start);
        const end = new Date(sleep.end);
        const id = "h_" + index;
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <div class="history-header" data-target="${id}"><h3>${sleep.date}</h3></div>
          <div id="${id}" style="display:none;">
            <p>Bedtijd: ${start.toLocaleTimeString()}</p>
            <p>Wektijd: ${end.toLocaleTimeString()}</p>
            <p>Duur: ${sleep.hours}u ${sleep.minutes}m</p>
            <p>Kwaliteit: ${sleep.quality}</p>
          </div>`;
        historyContainer.appendChild(div);
      });
      document.querySelectorAll(".history-header").forEach(h => {
        h.addEventListener("click", () => {
          const target = document.getElementById(h.dataset.target);
          target.style.display = target.style.display === "none" ? "block" : "none";
        });
      });
    }
  }

  /* HOME */
  const homeName = document.getElementById("homeName");
  const homeEmail = document.getElementById("homeEmail");
  const homeSleep = document.getElementById("homeSleep");
  const homeStats = document.getElementById("homeStats");
  if (homeName || homeEmail || homeSleep || homeStats) {
    const email = localStorage.getItem("currentUser");
    const user = JSON.parse(localStorage.getItem("user_" + email));
    if (user) {
      if (homeName) homeName.innerText = "Naam: " + user.name;
      if (homeEmail) homeEmail.innerText = "Email: " + user.email;
    }
    if (history.length > 0) {
      const last = history[history.length - 1];
      if (homeSleep) homeSleep.innerText = `${last.hours}u ${last.minutes}m (${last.quality})`;
      const avg = history.reduce((a, b) => a + b.hours, 0) / history.length;
      if (homeStats) homeStats.innerText = `Gemiddeld: ${avg.toFixed(1)} uur slaap over ${history.length} nachten`;
    }
  }

  /* MOBILE MENU */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("Service Worker geregistreerd"))
        .catch(err => console.log("SW fout:", err));
}

