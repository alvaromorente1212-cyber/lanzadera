(() => {
  "use strict";

  const ICONS = {
    piggy: '<path d="M6 13c0-4 3.6-6.5 8-6.5 1.2 0 2.3.2 3.3.5L20 5v3.6c1 .9 1.6 2 1.8 3.4H23v3h-1.6c-.6 1.3-1.6 2.3-2.9 3V21h-3v-1.6h-3V21h-3v-2.6C7.4 17.3 6 15.3 6 13z"/><path d="M6 12.5H4.5a1.5 1.5 0 0 1-1.5-1.5"/><circle cx="17" cy="11" r=".6" fill="currentColor"/><path d="M11 6.6V5h4"/>',
    jar: '<path d="M8 4h10"/><path d="M8.5 4v2.5c-2 1-3 2.6-3 4.5v7.5A2.5 2.5 0 0 0 8 21h10a2.5 2.5 0 0 0 2.5-2.5V11c0-1.9-1-3.5-3-4.5V4"/><path d="M5.5 12h15"/><path d="M9 16h3"/>',
    slide: '<path d="M5 21V6"/><path d="M5 6h4"/><path d="M5 10h4"/><path d="M5 14h4"/><path d="M9 4v17"/><path d="M9 6c5 0 6 4 8 8s2.5 5 4.5 5"/>',
    paper: '<path d="M5 5h12v14a2 2 0 0 0 2 2H7a2 2 0 0 1-2-2z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M8 9h6"/><path d="M8 13h6"/><path d="M8 17h4"/>',
    board: '<rect x="3.5" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="16.5" y="4" width="5" height="7" rx="1.5"/>',
    palm: '<path d="M12 22c0-5 .5-9 2-13"/><path d="M14 9c-1.5-2.5-4.5-3.5-8-2.5"/><path d="M14 9c1-3 4-4.5 7.5-3.5"/><path d="M14 9c-3 0-6 1.5-7 5"/><path d="M14 9c3 .5 5.5 2.5 6 6"/><path d="M4 22h16"/>',
    fork: '<path d="M7 3v8a2 2 0 0 0 4 0V3"/><path d="M9 11v10"/><path d="M17 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 1.4.9 2.5 2 2.5H17"/>',
    gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Saludo y fecha
  function tick() {
    const now = new Date();
    const h = now.getHours();
    const saludo = h < 6 ? "Buenas noches" : h < 13 ? "Buenos días" : h < 21 ? "Buenas tardes" : "Buenas noches";
    document.getElementById("greeting").textContent = `${saludo}, Álvaro`;
    const fecha = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    const hora = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("clock").textContent = `${fecha}, ${hora}`;
  }
  tick();
  setInterval(tick, 30000);

  // Apps
  const last = store.get("lz_last");
  document.getElementById("apps").innerHTML = window.LZ_APPS.map((sec) => `
    <section class="section">
      <h2>${esc(sec.section)}</h2>
      <div class="grid">
        ${sec.apps.map((a) => `
          <a class="app" href="${esc(a.url)}" data-id="${esc(a.id)}" style="--c:${esc(a.color)}">
            ${a.id === last ? '<span class="last">Última</span>' : ""}
            <span class="glyph" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[a.icon] || ICONS.layers}</svg></span>
            <span class="name">${esc(a.name)}</span>
            <span class="desc">${esc(a.desc)}</span>
          </a>`).join("")}
      </div>
    </section>`).join("");

  // Despegue al abrir una app
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.app");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    store.set("lz_last", a.dataset.id);
    if (reduce) return;
    e.preventDefault();
    a.classList.add("go");
    document.body.classList.add("launch");
    setTimeout(() => { location.href = a.href; }, 420);
  });
  // Al volver atrás, deja el cohete en su sitio
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("launch");
    document.querySelectorAll(".app.go").forEach((x) => x.classList.remove("go"));
  });

  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) document.body.classList.add("standalone");
})();
