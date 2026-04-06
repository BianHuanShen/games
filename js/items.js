// ===============================
// SEGURIDAD INVENTARIO (ANTI-NaN FIX)
// ===============================
function asegurarInventario() {
    const items = [
        "pocion", "espada", "armadura",
        "cristal", "orbe",
        "espadaLegendaria", "armaduraEpica", "magia", "orbeUsados"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    // Evitar NaN en magia
    jugador.magia = Number(jugador.magia) || 0;
    jugador.inventario.orbeUsados = Number(jugador.inventario.orbeUsados) || 0;
}

// ===============================
// APRENDER MAGIA FIX
// ===============================
function aprenderMagia() {
    if (jugador.vida <= 0) return;

    asegurarInventario();

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
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
    asegurarInventario();
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
    asegurarInventario();

    if (jugador.inventario.orbe <= 0) return;

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    jugador.magia += 2;
    if (jugador.magia > maxMagia) jugador.magia = maxMagia;

    mensajeEl.textContent = "🔮 +2 magia";

    animarBoton(usarOrbeBtn);
    actualizarUI();
    actualizarBarraMagia(maxMagia);
}

function equiparEspadaLegendaria() {
    asegurarInventario();
    if (jugador.inventario.espadaLegendaria <= 0) return;

    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ +25 ataque";

    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}

function equiparArmaduraEpica() {
    asegurarInventario();
    if (jugador.inventario.armaduraEpica <= 0) return;

    jugador.defensa += 15;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ +15 defensa";

    animarBoton(equiparArmaduraEpicaBtn);
    actualizarUI();
}

// ===============================
// ANIMACIÓN BOTONES
// ===============================
function animarBoton(btn) {
    if (!btn) return;

    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}
