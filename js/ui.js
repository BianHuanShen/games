// ===============================
// Actualización de UI del jugador
// ===============================
function actualizarUI() {
    vidaJugadorFill.style.width = `${Math.max(0, (jugador.vida / jugador.vidaMax) * 100)}%`;
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    listaInventarioEl.innerHTML = `
        <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
        <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
        <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
        <li>💎 Cristales: ${jugador.inventario.cristal}</li>
        <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
        <li>⚔️ Espadas Legendarias: ${jugador.inventario.espadaLegendaria}</li>
        <li>🛡️ Armaduras Épicas: ${jugador.inventario.armaduraEpica}</li>
        <li>✨ Magia: ${jugador.magia} / ${maxMagia} ${bonusOrbes > 0 ? `(+${bonusOrbes})` : ""}</li>
    `;

    usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";
    equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";

    if (abrirInventarioBtn) abrirInventarioBtn.style.display = "block";
}

// ===============================
// APRENDER MAGIA
// ===============================
function aprenderMagia() {
    if (jugador.vida <= 0) return;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    if (jugador.magia < maxMagia) {
        jugador.magia++;
        jugador.inventario.magia++;
        const magiaRestante = maxMagia - jugador.magia;
        mensajeEl.textContent = `✨ Magia: ${jugador.magia} (faltan ${magiaRestante})`;
    } else {
        mensajeEl.textContent = `⚠️ Límite alcanzado`;
    }

    actualizarUI();
    actualizarBarraMagia(maxMagia);
}

// ===============================
// ACCIONES BÁSICAS
// ===============================
function curar() {
    if (jugador.vida <= 0 || jugador.inventario.pocion <= 0) return;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
    jugador.inventario.pocion--;
    mensajeEl.textContent = "🧪 Usaste Poción";
    animarBoton(curarBtn);
    actualizarUI();
}

function equiparArma() {
    if (jugador.inventario.espada <= 0) return;
    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ +5 ataque";
    animarBoton(equiparArmaBtn);
    actualizarUI();
}

function equiparArmadura() {
    if (jugador.inventario.armadura <= 0) return;
    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ +3 defensa";
    animarBoton(equiparArmaduraBtn);
    actualizarUI();
}

// ===============================
// ITEMS
// ===============================
function usarCristal() {
    if (jugador.inventario.cristal <= 0) return;
    jugador.ataque += 15;
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 +15 ataque";
    animarBoton(usarCristalBtn);
    actualizarUI();
}

// ===============================
// 🔮 ORBE FIX DEFINITIVO
// ===============================
function usarOrbe() {
    if (jugador.inventario.orbe <= 0) return;

    if (!jugador.inventario.orbeUsados) jugador.inventario.orbeUsados = 0;

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // 🔥 subir magia REAL
    jugador.magia += 2;

    // 🔥 evitar overflow
    if (jugador.magia > maxMagia) {
        jugador.magia = maxMagia;
    }

    mensajeEl.textContent = `🔮 +2 magia permanente`;

    animarBoton(usarOrbeBtn);
    actualizarUI();
    actualizarBarraMagia(maxMagia);
}

function equiparEspadaLegendaria() {
    if (jugador.inventario.espadaLegendaria <= 0) return;
    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ +25 ataque";
    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}

function equiparArmaduraEpica() {
    if (jugador.inventario.armaduraEpica <= 0) return;
    jugador.defensa += 15;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ +15 defensa";
    animarBoton(equiparArmaduraEpicaBtn);
    actualizarUI();
}

// ===============================
// ANIMACIÓN
// ===============================
function animarBoton(btn) {
    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}

// ===============================
// BARRA DE MAGIA
// ===============================
function actualizarBarraMagia(maxMagia) {
    let barraMagia = document.getElementById("barraMagia");

    if (!barraMagia) {
        barraMagia = document.createElement("div");
        barraMagia.id = "barraMagia";

        const fill = document.createElement("div");
        fill.id = "barraMagiaFill";
        fill.style.height = "100%";
        fill.style.width = "0%";
        fill.style.background = "#00f";

        barraMagia.appendChild(fill);
        document.getElementById("gameArea").appendChild(barraMagia);
    }

    const fill = document.getElementById("barraMagiaFill");
    fill.style.width = maxMagia > 0 ? (jugador.magia / maxMagia) * 100 + "%" : "0%";
}
