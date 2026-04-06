// ===============================
// SEGURIDAD INVENTARIO (ANTI-NaN)
// ===============================
function asegurarInventario() {
    const items = [
        "pocion", "espada", "armadura",
        "cristal", "orbe",
        "espadaLegendaria", "armaduraEpica"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    jugador.magia = Number(jugador.magia) || 0;
}

// ===============================
// ACCIONES JUGADOR
// ===============================
function curar() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.pocion <= 0) return;

    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 25);
    jugador.inventario.pocion--;

    mensajeEl.textContent = "🧪 Usaste Poción";
    actualizarUI();
}

function equiparArma() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.espada <= 0) return;

    jugador.ataque += 5;
    jugador.inventario.espada--;

    mensajeEl.textContent = "⚔️ Usaste 1 Espada (+5 ataque)";
    actualizarUI();
}

function equiparArmadura() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.armadura <= 0) return;

    jugador.defensa += 3;
    jugador.inventario.armadura--;

    mensajeEl.textContent = "🛡️ Usaste 1 Armadura (+3 defensa)";
    actualizarUI();
}

// ===============================
// ITEMS RAROS
// ===============================
function usarCristal() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.cristal <= 0) return;

    const boost = 15 + Math.floor(jugador.nivel * 1.5);
    jugador.ataque += boost;

    jugador.inventario.cristal--;

    mensajeEl.textContent = `💎 Cristal usado (+${boost} ataque)`;
    actualizarUI();
}

function usarOrbe() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.orbe <= 0) return;

    const maxMagia = Math.floor(jugador.nivel / 3) * 2;

    if (jugador.magia < maxMagia) {
        const aumento = 3;

        jugador.magia = Math.min(maxMagia, jugador.magia + aumento);
        jugador.inventario.orbe--;

        mensajeEl.textContent = `🔮 Orbe usado (+${aumento} magia)`;
    } else {
        mensajeEl.textContent = "⚠️ Magia al máximo";
    }

    actualizarUI();
    actualizarBarraMagia(maxMagia);
}

function equiparEspadaLegendaria() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.espadaLegendaria <= 0) return;

    const boost = 25 + jugador.nivel * 2;

    jugador.ataque += boost;
    jugador.inventario.espadaLegendaria--;

    mensajeEl.textContent = `⚔️ Espada Legendaria (+${boost} ataque)`;
    actualizarUI();
}

function equiparArmaduraEpica() {
    asegurarInventario();

    if (jugador.vida <= 0 || jugador.inventario.armaduraEpica <= 0) return;

    const boost = 15 + jugador.nivel * 2;

    jugador.defensa += boost;
    jugador.inventario.armaduraEpica--;

    mensajeEl.textContent = `🛡️ Armadura Épica (+${boost} defensa)`;
    actualizarUI();
}

// ===============================
// APRENDER MAGIA LIMITADA
// ===============================
function aprenderMagia() {
    asegurarInventario();

    if (jugador.vida <= 0) return;

    const maxMagia = Math.floor(jugador.nivel / 3) * 2;

    if (jugador.magia < maxMagia) {
        jugador.magia++;
        jugador.inventario.magia = Number(jugador.inventario.magia) || 0;
        jugador.inventario.magia++;

        const restante = maxMagia - jugador.magia;

        mensajeEl.textContent =
            `✨ Aprendiste magia (${jugador.magia}/${maxMagia})`;
    } else {
        mensajeEl.textContent =
            `⚠️ Magia al máximo para nivel ${jugador.nivel}`;
    }

    actualizarUI();
    actualizarBarraMagia(maxMagia);
}
