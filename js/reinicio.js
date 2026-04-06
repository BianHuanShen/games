// ===============================
// REINICIO PLUG-AND-PLAY
// ===============================

// Crear modal de juego terminado
const modalGameOver = document.createElement("div");
modalGameOver.id = "modalGameOver";
modalGameOver.style.position = "fixed";
modalGameOver.style.top = "0";
modalGameOver.style.left = "0";
modalGameOver.style.width = "100%";
modalGameOver.style.height = "100%";
modalGameOver.style.background = "rgba(0,0,0,0.8)";
modalGameOver.style.display = "flex";
modalGameOver.style.flexDirection = "column";
modalGameOver.style.alignItems = "center";
modalGameOver.style.justifyContent = "center";
modalGameOver.style.color = "#fff";
modalGameOver.style.fontSize = "24px";
modalGameOver.style.zIndex = "1000";
modalGameOver.style.display = "none"; // oculto inicialmente
modalGameOver.innerHTML = `
    <p>💀 Has muerto</p>
    <p>¿Deseas volver a jugar?</p>
    <button id="reiniciarBtn" style="
        padding: 10px 20px;
        font-size: 18px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background: #28a745;
        color: #fff;
        margin-top: 20px;
    ">Comenzar de nuevo</button>
`;
document.body.appendChild(modalGameOver);

const reiniciarBtn = document.getElementById("reiniciarBtn");

// Función para reiniciar el juego
function reiniciarJuego() {
    // Reset jugador
    jugador.vida = jugador.vidaMax = 100;
    jugador.ataque = 10;
    jugador.defensa = 5;
    jugador.magia = 0;
    jugador.nivel = 1;
    jugador.puntaje = 0;
    jugador.inventario = { pocion: 30, espada: 1, armadura: 1, magia: 0 };

    // Reset nivel
    nivelActual = 1;

    // Limpiar enemigos
    enemigos = [];
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // Ocultar modal
    modalGameOver.style.display = "none";

    // Reactivar botones
    atacarBtn.disabled = false;
    curarBtn.disabled = false;
    equiparArmaBtn.disabled = false;
    equiparArmaduraBtn.disabled = false;
    aprenderMagiaBtn.disabled = false;

    // Regenerar nivel
    generarNivel();
    actualizarUI();

    mensajeEl.textContent = "✨ ¡Nuevo juego iniciado!";
}

// Evento botón reiniciar
reiniciarBtn.addEventListener("click", reiniciarJuego);

// ===============================
// OBSERVER DE VIDA DEL JUGADOR
// ===============================
let vidaAnterior = jugador.vida;

setInterval(() => {
    // Si vida cayó a 0 y el modal no está visible
    if (jugador.vida <= 0 && modalGameOver.style.display === "none") {
        modalGameOver.style.display = "flex";

        // Bloquear botones
        atacarBtn.disabled = true;
        curarBtn.disabled = true;
        equiparArmaBtn.disabled = true;
        equiparArmaduraBtn.disabled = true;
        aprenderMagiaBtn.disabled = true;
    }

    vidaAnterior = jugador.vida;
}, 100); // chequea cada 100ms