// ===============================
// SEGURIDAD INVENTARIO (ANTI-NaN FIX)
// ===============================
function asegurarInventario() {
    const items = [
        // Básicos
        "pocion", "espada", "armadura",
        // Especiales
        "cristal", "orbe",
        // Magia
        "magia", "orbeUsados",
        // Legendarios / épicos
        "espadaLegendaria", "armaduraEpica", "armaduraLegendaria",
        // Equipamiento completo
        "casco", "camisa", "guantes", "pantalon", "botas",
        // Variantes épicas
        "botasEpicas", "cascoEpico", "camisaEpica", "guantesEpicos", "pantalonEpico",
        // Armas extra
        "daga", "arco"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    jugador.magia = Number(jugador.magia) || 0;
    jugador.inventario.orbeUsados = Number(jugador.inventario.orbeUsados) || 0;
}

// ===============================
// APRENDER MAGIA (MISMA LÓGICA)
// ===============================
function aprenderMagia() {
    if (!juegoActivo || jugador.vida <= 0) return;
    asegurarInventario();

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    if (jugador.magia < maxMagia) {
        jugador.magia++;
        jugador.inventario.magia++;
        const magiaRestante = maxMagia - jugador.magia;
        mensajeEl.textContent = `✨ Magia aumentada: ${jugador.magia}/${maxMagia}`;
    } else {
        mensajeEl.textContent = `⚠️ Límite de magia alcanzado (${maxMagia})`;
    }

    actualizarUI();
}

// ===============================
// ACCIONES BÁSICAS (MISMA LÓGICA)
// ===============================
function curar() {
    if (!juegoActivo || jugador.vida <= 0) return;
    asegurarInventario();

    if (jugador.inventario.pocion <= 0) {
        mensajeEl.textContent = "❌ No tienes pociones";
        return;
    }

    const curacion = 25;
    const vidaAnterior = jugador.vida;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + curacion);
    jugador.inventario.pocion--;

    const curadoReal = jugador.vida - vidaAnterior;
    mensajeEl.textContent = `🧪 Curado +${curadoReal} HP`;

    animarBoton(curarBtn);
    actualizarUI();
}

function equiparArma() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.espada <= 0) {
        mensajeEl.textContent = "❌ No tienes espadas";
        return;
    }

    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ Espada equipada (+5 ataque)";

    animarBoton(equiparArmaBtn);
    actualizarUI();
}

function equiparArmadura() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.armadura <= 0) {
        mensajeEl.textContent = "❌ No tienes armaduras";
        return;
    }

    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ Armadura equipada (+3 defensa)";

    animarBoton(equiparArmaduraBtn);
    actualizarUI();
}

// ===============================
// ITEMS (MISMA LÓGICA)
// ===============================
function usarCristal() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.cristal <= 0) {
        mensajeEl.textContent = "❌ No tienes cristales";
        return;
    }

    jugador.ataque += 15;
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 Cristal usado (+15 ataque)";

    animarBoton(usarCristalBtn);
    actualizarUI();
}

function usarOrbe() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.orbe <= 0) {
        mensajeEl.textContent = "❌ No tienes orbes";
        return;
    }

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    jugador.magia = Math.min(jugador.magia + 2, maxMagia);

    mensajeEl.textContent = "🔮 Orbe usado (+2 magia máxima)";

    animarBoton(usarOrbeBtn);
    actualizarUI();
}

// ===============================
// LEGENDARIOS / NUEVOS ITEMS
// ===============================
function equiparArmaduraLegendaria() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.armaduraLegendaria <= 0) {
        mensajeEl.textContent = "❌ No tienes armaduras legendarias";
        return;
    }

    jugador.defensa += 15;
    jugador.vidaMax += 25;
    jugador.inventario.armaduraLegendaria--;

    mensajeEl.textContent = "🛡️ ¡Armadura Legendaria equipada! (+15 defensa, +25 vida)";
    actualizarUI();
}

// ===============================
// SET COMPLETO
// ===============================
function equiparCasco() {
    asegurarInventario();

    if (jugador.inventario.casco <= 0) return;

    jugador.defensa += 5;
    jugador.vidaMax += 3;
    jugador.inventario.casco--;

    mensajeEl.textContent = "⛑️ Casco equipado (+5 defensa, +3 vida)";
    actualizarUI();
}

function equiparCamisa() {
    asegurarInventario();

    if (jugador.inventario.camisa <= 0) return;

    jugador.defensa += 7;
    jugador.vidaMax += 10;
    jugador.inventario.camisa--;

    mensajeEl.textContent = "👕 Camisa equipada (+7 defensa, +10 vida)";
    actualizarUI();
}

function equiparGuantes() {
    asegurarInventario();

    if (jugador.inventario.guantes <= 0) return;

    jugador.ataque += 10;
    jugador.magia += 2; // FIX

    jugador.inventario.guantes--;

    mensajeEl.textContent = "🧤 Guantes equipados (+10 ataque, +2 magia)";
    actualizarUI();
}

function equiparPantalon() {
    asegurarInventario();

    if (jugador.inventario.pantalon <= 0) return;

    jugador.defensa += 8;
    jugador.vidaMax += 6;
    jugador.inventario.pantalon--;

    mensajeEl.textContent = "👖 Pantalón equipado (+8 defensa, +6 vida)";
    actualizarUI();
}

function equiparBotas() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.botas <= 0) return;

    jugador.defensa += 6;
    jugador.vidaMax += 2;
    jugador.inventario.botas--;

    mensajeEl.textContent = "👢 Botas equipadas (+6 defensa, +2 vida)";
    actualizarUI();
}

// ===============================
// ARMAS EXTRA
// ===============================
function equiparDaga() {
    asegurarInventario();

    if (jugador.inventario.daga <= 0) return;

    jugador.ataque += 15;
    jugador.inventario.daga--;

    mensajeEl.textContent = "🗡️ Daga equipada (+15 ataque)";
    actualizarUI();
}

function equiparArco() {
    asegurarInventario();

    if (jugador.inventario.arco <= 0) return; // FIX

    jugador.ataque += 12;
    jugador.inventario.arco--;

    mensajeEl.textContent = "🏹 Arco equipado (+12 ataque)";
    actualizarUI();
}
function equiparCascoEpico() {
    asegurarInventario();

    if (jugador.inventario.cascoEpico <= 0) return;

    jugador.defensa += 7;
    jugador.vidaMax += 12;
    jugador.inventario.cascoEpico--;

    mensajeEl.textContent = "⛑️ Casco épico equipado (+7 defensa, +12 vida)";

    actualizarUI();
}

function equiparCamisaEpica() {
    asegurarInventario();

    if (jugador.inventario.camisaEpica <= 0) return;

    jugador.defensa += 9;
    jugador.vidaMax += 15;
    jugador.inventario.camisaEpica--;

    mensajeEl.textContent = "👕 Camisa épica equipada (+9 defensa, +15 vida)";

    actualizarUI();
}

function equiparGuantesEpicos() {
    asegurarInventario();

    if (jugador.inventario.guantesEpicos <= 0) return;

    jugador.ataque += 15;
    jugador.magia += 3;
    jugador.inventario.guantesEpicos--;

    mensajeEl.textContent = "🧤 Guantes épicos equipados (+15 ataque, +3 magia)";

    actualizarUI();
}

function equiparPantalonEpico() {
    asegurarInventario();

    if (jugador.inventario.pantalonEpico <= 0) return;

    jugador.defensa += 10;
    jugador.vidaMax += 12;
    jugador.inventario.pantalonEpico--;

    mensajeEl.textContent = "👖 Pantalón épico equipado (+10 defensa, +12 vida)";

    actualizarUI();
}

function equiparBotasEpicas() {
    asegurarInventario();

    if (jugador.inventario.botasEpicas <= 0) return;

    jugador.defensa += 9;
    jugador.vidaMax += 10;
    jugador.inventario.botasEpicas--;

    mensajeEl.textContent = "👢 Botas épicas equipadas (+9 defensa, +10 vida)";

    actualizarUI();
}
