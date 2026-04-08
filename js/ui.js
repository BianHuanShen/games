function actualizarUI() {
    // Validar elementos
    if (!vidaJugadorFill || !ataqueJugadorEl || !mensajeEl) return;

    // Barras principales
    const porcentajeVida = Math.max(0, (jugador.vida / jugador.vidaMax) * 100);
    vidaJugadorFill.style.width = `${porcentajeVida}%`;

    // Cambiar color según vida
    if (porcentajeVida > 60) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #2ecc71, #27ae60)";
    } else if (porcentajeVida > 30) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #f1c40f, #f39c12)";
    } else {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #e74c3c, #c0392b)";
    }

    // Stats
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    // Calcular magia máxima
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;
       // ===== INVENTARIO COMPLETO =====
    if (listaInventarioEl) {
    listaInventarioEl.innerHTML = `
        <li><b>🟢 Posiones</b></li>
            <li>🧪 Pociones: ${jugador.inventario.pocion}</li>

            <li><b>🟢 Comunes</b></li>
            <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
            <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
            <li>⛑️ Casco: ${jugador.inventario.casco}</li>
            <li>👕 Camisas: ${jugador.inventario.camisa}</li>
            <li>🧤 Guantes: ${jugador.inventario.guantes}</li>
            <li>👖 Pantalones: ${jugador.inventario.pantalon}</li>
            <li>👢 Botas: ${jugador.inventario.botas}</li>

            <li><b>🔵 Raros</b></li>
            <li>💎 Cristales: ${jugador.inventario.cristal}</li>
            <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
            <li>🏹 Arcos: ${jugador.inventario.arco}</li>
            <li>🗡️ Dagas: ${jugador.inventario.daga}</li>

            <li><b>🟣 Épicos</b></li>
            <li>⛑️ Casco Épico: ${jugador.inventario.cascoEpico}</li>
            <li>🛡️ Armadura Épica: ${jugador.inventario.armaduraEpica}</li>
            <li>👕 Camisa Épica: ${jugador.inventario.camisaEpica}</li>
            <li>🧤 Guantes: ${jugador.inventario.guantesEpicos}</li>
            <li>👖 Pantalones: ${jugador.inventario.pantalonEpico}</li>
            <li>👢 Botas: ${jugador.inventario.botasEpicas}</li>

            <li><b>🟡 Legendarios</b></li>
            <li>⚔️ Espada Legendaria: ${jugador.inventario.espadaLegendaria}</li>
            <li>🛡️ Armadura Legendaria: ${jugador.inventario.armaduraLegendaria}</li>

                 <li>✨ Magia: ${jugador.magia} / ${maxMagia} ${bonusOrbes > 0 ? `(+${bonusOrbes} Orbes)` : ""}</li>
    `;
}

    // 🔹 Mostrar u ocultar botones de items raros
    if (curarBtn) curarBtn.style.display = jugador.inventario.pocion > 0 ? "block" : "none";
    if (usarCristalBtn) usarCristalBtn.style.display = jugador.inventario.cristal > 0 ? "block" : "none";
    if (usarOrbeBtn) usarOrbeBtn.style.display = jugador.inventario.orbe > 0 ? "block" : "none";
    if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.style.display = jugador.inventario.espadaLegendaria > 0 ? "block" : "none";
    if (equiparArmaBtn) equiparArmaBtn.style.display = jugador.inventario.espada > 0 ? "block" : "none";
    if (equiparArmaduraBtn) equiparArmaduraBtn.style.display = jugador.inventario.armadura > 0 ? "block" : "none";
    if (equiparCascoBtn) equiparCascoBtn.style.display = jugador.inventario.equiparCasco > 0 ? "block" : "none";
    if (equiparcamisaBtn) equiparcamisaBtn.style.display = jugador.inventario.camisa > 0 ? "block" : "none";
    if (equiparGuantesBtn) equiparGuantesBtn.style.display = jugador.inventario.guantes > 0 ? "block" : "none";
    if (equiparPantalonBtn) equiparPantalonBtn.style.display = jugador.inventario.pantalon > 0 ? "block" : "none";
    if (equiparBotasBtn) equiparBotasBtn.style.display = jugador.inventario.botas > 0 ? "block" : "none";
    if (equiparArcoBtn) equiparArcoBtn.style.display = jugador.inventario.arco > 0 ? "block" : "none";
    if (equiparDagaBtn) equiparDagaBtn.style.display = jugador.inventario.daga > 0 ? "block" : "none";
    if (equiparCascoEpicoBtn) equiparCascoEpicoBtn.style.display = jugador.inventario.cascoEpico > 0 ? "block" : "none"; 
    if (equiparArmaduraEpicaBtn) equiparArmaduraEpicaBtn.style.display = jugador.inventario.armaduraEpica > 0 ? "block" : "none";
    if (equiparCamisaEpicaBtn) equiparCamisaEpicaBtn.style.display jugador.inventario.camisaEpica > 0 ? "block" : "none"; 
    if (equiparGuantesEpicosBtn) equiparGuantesEpicosBtn.style.display = jugador.inventario.guantesEpicos > 0 ? "block" : "none";
    if (equiparPantalonEpicoBtn) equiparPantalonEpicoBtn.style.display jugador.inventario.pantalonEpico > 0 ? "block" : "none"; 
    if (equiparBotasEpicasBtn) equiparBotasEpicasBtn.style.display = jugador.inventario.botasEpicas > 0 ? "block" : "none";
        // Actualizar barra MMORPG
    actualizarBarraMMORPG(porcentajeVida, maxMagia);
}

function actualizarBarraMMORPG(porcentajeVida, maxMagia) {
    const vidaBarra = document.getElementById("vidaBarra");
    const magiaBarra = document.getElementById("magiaBarra");

    if (vidaBarra) {
        vidaBarra.style.width = `${porcentajeVida}%`;
    }

    if (magiaBarra) {
        const porcentajeMagia = maxMagia > 0 ? (jugador.magia / maxMagia) * 100 : 0;
        magiaBarra.style.width = `${porcentajeMagia}%`;
    }
}

function animarBoton(btn) {
    if (!btn) return;
    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}

// CSS para animación de botones
const style = document.createElement("style");
style.textContent = `
    .usar-item-anim {
        animation: pulse 0.3s ease;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px currentColor; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
