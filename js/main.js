// ===============================
// MINI RPG PRO + ULTRA FINAL FIXED
// ===============================

// ===== JUGADOR =====
const jugador = {
    vida: 100,
    vidaMax: 100,
    ataque: 10,
    defensa: 5,
    magia: 0,
    nivel: 1,
    puntaje: 0,
    inventario: { pocion: 30, espada: 1, armadura: 1, magia: 0, cristal: 0, orbe: 0, espadaLegendaria: 1, armaduraEpica: 0}
};

// ===== ESTADO =====
let enemigos = [];
let nivelActual = 1;

// ===== SONIDOS =====
const sonidoGolpe = new Audio("sonidos/golpe.mp3");
const sonidoCritico = new Audio("sonidos/critico.mp3");
const sonidoLoot = new Audio("sonidos/loot.mp3");

// ===============================
// ===== DOM =====
// ===============================
const gameArea = document.getElementById("gameArea");
const vidaJugadorFill = document.getElementById("vidaJugadorFill");
const ataqueJugadorEl = document.getElementById("ataqueJugador");
const defensaJugadorEl = document.getElementById("defensaJugador");
const magiaJugadorEl = document.getElementById("magiaJugador");
const nivelJugadorEl = document.getElementById("nivelJugador");
const puntajeEl = document.getElementById("puntaje");
const mensajeEl = document.getElementById("mensaje");
// jugador visual
const jugadorDiv = document.createElement("div");
jugadorDiv.id = "jugador";
jugadorDiv.style.left = "100px";
jugadorDiv.style.top = "300px";
gameArea.appendChild(jugadorDiv);
// ===============================
// ===== BOTONES =====
// ===============================
const atacarBtn = document.getElementById("atacarBtn");
const curarBtn = document.getElementById("curarBtn");
const equiparArmaBtn = document.getElementById("equiparArmaBtn");
const equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
const usarCristalBtn = document.getElementById("usarCristalBtn");
const usarOrbeBtn = document.getElementById("usarOrbeBtn");
const equiparEspadaLegendariaBtn = document.getElementById("equiparEspadaLegendariaBtn");
const equiparArmaduraEpicaBtn = document.getElementById("equiparArmaduraEpicaBtn");
const aprenderMagiaBtn = document.getElementById("aprenderMagiaBtn");
// ===============================
// BLOQUEO TOTAL AL MORIR
// ===============================
function bloquearBotones() {
    atacarBtn.disabled = true;
    curarBtn.disabled = true;
    equiparArmaBtn.disabled = true;
    equiparArmaduraBtn.disabled = true;
    aprenderMagiaBtn.disabled = true;
}
// ===============================
// UTILIDADES
// ===============================
function esCritico() {
    return Math.random() < 0.2;
}

function tipoIA() {
    const tipos = ["agresivo", "defensivo", "mago"];
    return tipos[Math.floor(Math.random() * tipos.length)];
}
// ===============================
// CREAR ENEMIGO
// ===============================
function crearEnemigo(nivel, jefe = false) {
    let vida = 30 + nivel * 10;
    let ataque = 5 + nivel * 2;
    let defensa = 2 + nivel;

    let ia = tipoIA();

    if (jefe) {
        vida *= 2.5;
        ataque *= 1.5;
        defensa *= 1.3;
    }

    return {
        vida,
        vidaMax: vida,
        ataque,
        defensa,
        jefe,
        ia
    };
}
// ===============================
// IMAGEN ENEMIGO
// ===============================
function getRutaEnemigo(e) {
    if (e.jefe) return "img/boss.jpeg";
    if (nivelActual >= 2) return "img/mago.jpeg";
    return "img/enemigo1.jpeg";
}
// ===============================
// DIBUJAR ENEMIGOS
// ===============================
function dibujarEnemigos() {
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");
        div.dataset.index = index;

        div.style.left = `${220 + index * 90}px`;
        div.style.top = `${260 + Math.random() * 80}px`;

        div.style.width = e.jefe ? "100px" : "70px";
        div.style.height = e.jefe ? "100px" : "70px";

        div.style.backgroundImage = `url('${getRutaEnemigo(e)}')`;

        // ===== BARRA VIDA PRO =====
        const barra = document.createElement("div");
        barra.style.position = "absolute";
        barra.style.top = "-12px";
        barra.style.left = "0";
        barra.style.width = "100%";
        barra.style.height = "6px";
        barra.style.background = "rgba(0,0,0,0.7)";
        barra.style.borderRadius = "5px";
        barra.style.overflow = "hidden";

        const fill = document.createElement("div");
        fill.classList.add("vida-enemigo");
        fill.style.height = "100%";
        fill.style.width = "100%";
        fill.style.transition = "width 0.3s ease";

        fill.style.background = e.jefe
            ? "linear-gradient(90deg, #ff0000, #7a0000)"
            : "linear-gradient(90deg, #00ff88, #00994d)";

        barra.appendChild(fill);
        div.appendChild(barra);

        gameArea.appendChild(div);
    });
}
// ===============================
// GENERAR NIVEL PROFESIONAL
// ===============================
function generarNivel() {
    enemigos = [];
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // Calcular dificultad base según el nivel
    // Nivel 1-2: fácil, nivel 3: un poco más difícil, progresivo
    const dificultadBase = 1 + Math.floor(nivelActual / 2); // aumenta cada 2 niveles
    const multiplicadorDificultad = 1 + (nivelActual * 0.1); // 10% más fuerte por nivel

    // Número de enemigos: de 1 a 8, aumenta con el nivel pero no demasiado
    let numEnemigos;
    if (nivelActual % 5 === 0) { 
        // jefe cada 5 niveles
        numEnemigos = 1;
    } else {
        numEnemigos = Math.min(3 + dificultadBase, 8); 
    }

    for (let i = 0; i < numEnemigos; i++) {
        // Crear enemigos con stats ajustadas por dificultad
        const esJefe = (nivelActual % 5 === 0);
        const enemigo = crearEnemigo(nivelActual, esJefe);

        // Ajustar stats por nivel: vida, ataque, defensa
        enemigo.vidaMax = Math.floor(enemigo.vidaMax * multiplicadorDificultad);
        enemigo.vida = enemigo.vidaMax;
        enemigo.ataque = Math.floor(enemigo.ataque * multiplicadorDificultad);
        enemigo.defensa = Math.floor(enemigo.defensa * multiplicadorDificultad);

        enemigos.push(enemigo);
    }

    dibujarEnemigos();
}
// ===============================
// ===== CLASES =====
// ===============================
class Personaje {
    constructor(vida, ataque, defensa, magia, nivel, puntaje, inventario) {
        this.vida = vida;
        this.vidaMax = vida;
        this.ataque = ataque;
        this.defensa = defensa;
        this.magia = magia;
        this.nivel = nivel;
        this.puntaje = puntaje;
        this.inventario = inventario;
    }
}
class Enemigo {
    constructor(vida, ataque, defensa, ia) {
        this.vida = vida;
        this.vidaMax = vida;
        this.ataque = ataque;
        this.defensa = defensa;
        this.ia = ia; // "agresivo", "defensivo", "mago"
    }
}
// ===============================
// ATAQUE JUGADOR
// ===============================
function atacar() {
    if (enemigos.length === 0) return;

    const enemigo = enemigos[0];
    const enemigoDiv = document.querySelector(".enemigo");

    let daño = jugador.ataque + jugador.magia - enemigo.defensa;

    if (esCritico()) {
        daño *= 2;
        enemigoDiv.classList.add("golpe");
        sonidoCritico.play();
        mensajeEl.textContent = "💥 CRÍTICO!";
    } else {
        sonidoGolpe.play();
    }

    if (daño < 2) daño = 2;

    enemigo.vida -= daño;
    enemigo.vida = Math.max(0, enemigo.vida);

    // 🔥 actualizar barra enemigo
    const fill = enemigoDiv.querySelector(".vida-enemigo");
    fill.style.width = `${(enemigo.vida / enemigo.vidaMax) * 100}%`;

    // efecto golpe
    enemigoDiv.style.transform = "scale(1.1)";
    setTimeout(() => enemigoDiv.style.transform = "scale(1)", 120);

    // muerte
    if (enemigo.vida <= 0) {
        enemigoDiv.style.opacity = "0";
        setTimeout(() => enemigoDiv.remove(), 200);

        enemigos.shift();
        jugador.puntaje += 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 10);
        sonidoLoot.play();
    }

    actualizarUI();
}
// ===============================
// ATAQUE ENEMIGOS
// ===============================
function ataqueEnemigos() {
    enemigos.forEach(e => {
        let daño = e.ataque;
        if (e.ia === "agresivo") daño *= 1.0;
        if (e.ia === "defensivo") daño *= 0.7;
        if (e.ia === "mago") daño += 3;
        daño -= jugador.defensa;
        if (daño < 1) daño = 1;
        jugador.vida -= daño;
    });
}
// ===============================
// IA ENEMIGOS (ATAQUE POR PROXIMIDAD)
// ===============================
(function iniciarAtaqueEnemigos() {
    const rangoAtaque = 60;

    function atacarEnemigos() {
        const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
        const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

        document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
            const enemigo = enemigos[i];
            if (!enemigo) return;

            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx*dx + dy*dy);

            // Ataque solo si está dentro del rango
            if (distancia <= rangoAtaque) {
                let daño = enemigo.ataque;
                if (enemigo.ia === "agresivo") daño *= 1.2;
                if (enemigo.ia === "defensivo") daño *= 0.7;
                if (enemigo.ia === "mago") daño += 3;

                daño -= jugador.defensa;
                if (daño < 1) daño = 1;

                jugador.vida -= daño;
                jugador.vida = Math.max(0, jugador.vida);

                // Animación de ataque
                enemigoDiv.style.transform = "scale(1.1)";
                setTimeout(() => enemigoDiv.style.transform = "scale(1)", 100);

                actualizarUI();
            }
        });

        requestAnimationFrame(atacarEnemigos);
    }

    window.addEventListener("load", () => atacarEnemigos());
})();
// ===============================
// IA ENEMIGOS (MOVIMIENTO)
// ===============================
(function iniciarMovimientoEnemigos() {
    const velocidadBase = 0.3;
    const rangoAtaque = 60;
    const aceleracion = 0.02; // suavizado de velocidad
    const enemigosVelocidad = [];
    const enemigosOscilacion = [];

    function moverEnemigos() {
        const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
        const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

        document.querySelectorAll(".enemigo").forEach((enemigoDiv, i) => {
            const enemigo = enemigos[i];
            if (!enemigo) return;

            // Inicializar velocidad y oscilación si no existen
            if (!enemigosVelocidad[i]) enemigosVelocidad[i] = { vx: 0, vy: 0 };
            if (!enemigosOscilacion[i]) enemigosOscilacion[i] = Math.random() * Math.PI * 2;

            const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
            const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
            const dx = jx - ex;
            const dy = jy - ey;
            const distancia = Math.sqrt(dx*dx + dy*dy);

            // Ajustar velocidad según tipo
            let velocidadObjetivo = velocidadBase;
            if (enemigo.ia === "agresivo") velocidadObjetivo *= 1.2;
            if (enemigo.ia === "defensivo") velocidadObjetivo *= 0.7;
            if (enemigo.ia === "mago") velocidadObjetivo *= 0.5;

            if (distancia > rangoAtaque) {
                // Vector unitario hacia el jugador
                const dirX = dx / distancia;
                const dirY = dy / distancia;

                // Oscilación para curvas suaves
                enemigosOscilacion[i] += 0.05 + Math.random()*0.02;
                const curvaX = Math.sin(enemigosOscilacion[i]) * 0.5;
                const curvaY = Math.cos(enemigosOscilacion[i]) * 0.5;

                // Velocidad deseada con curva
                const targetVX = (dirX * velocidadObjetivo) + curvaX * 0.1;
                const targetVY = (dirY * velocidadObjetivo) + curvaY * 0.1;

                // Suavizado: aceleración gradual hacia la velocidad objetivo
                enemigosVelocidad[i].vx += (targetVX - enemigosVelocidad[i].vx) * aceleracion;
                enemigosVelocidad[i].vy += (targetVY - enemigosVelocidad[i].vy) * aceleracion;

                // Actualiza posición
                enemigoDiv.style.left = enemigoDiv.offsetLeft + enemigosVelocidad[i].vx + "px";
                enemigoDiv.style.top = enemigoDiv.offsetTop + enemigosVelocidad[i].vy + "px";
            } else {
                // Dentro del rango de ataque, desacelerar suavemente
                enemigosVelocidad[i].vx += (0 - enemigosVelocidad[i].vx) * aceleracion;
                enemigosVelocidad[i].vy += (0 - enemigosVelocidad[i].vy) * aceleracion;
                enemigoDiv.style.left = enemigoDiv.offsetLeft + enemigosVelocidad[i].vx + "px";
                enemigoDiv.style.top = enemigoDiv.offsetTop + enemigosVelocidad[i].vy + "px";
            }
        });

        requestAnimationFrame(moverEnemigos);
    }

    window.addEventListener("load", () => moverEnemigos());
})();
// ===============================
// REVISAR ESTADO JUEGO
// ===============================
function revisarEstado() {
    if (jugador.vida <= 0) {
        jugador.vida = 0;
        mensajeEl.textContent += "\n💀 Has sido derrotado";
        bloquearBotones();
    }

    if (enemigos.length === 0) {
        jugador.nivel++;
        nivelActual++;
        mensajeEl.textContent += `\n✨ Nivel ${jugador.nivel}`;
        generarNivel();
    }
}
// ===============================
// ===== EVENTOS =====
// ===============================

// Acciones básicas y items raros
atacarBtn.addEventListener("click", atacar);
curarBtn.addEventListener("click", curar);
equiparArmaBtn.addEventListener("click", equiparArma);
equiparArmaduraBtn.addEventListener("click", equiparArmadura);
usarCristalBtn.addEventListener("click", usarCristal);
usarOrbeBtn.addEventListener("click", usarOrbe);
equiparEspadaLegendariaBtn.addEventListener("click", equiparEspadaLegendaria);
equiparArmaduraEpicaBtn.addEventListener("click", equiparArmaduraEpica);
aprenderMagiaBtn.addEventListener("click", aprenderMagia);

// Inventario
abrirInventarioBtn.addEventListener("click", () => ventanaInventario.style.display = "block");
cerrarInventario.addEventListener("click", () => ventanaInventario.style.display = "none");

// Movimiento con teclado
document.addEventListener("keydown", e => {
    const left = jugadorDiv.offsetLeft;
    if (e.key === "ArrowRight") jugadorDiv.style.left = left + 20 + "px";
    if (e.key === "ArrowLeft") jugadorDiv.style.left = left - 20 + "px";
});
// ===============================
// FUNCIONALIDAD DE ARRASTRE
// ===============================
(function enableDrag() {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function startDrag(e) {
        dragging = true;
        const rect = jugadorDiv.getBoundingClientRect();
        if (e.type.startsWith("touch")) {
            offsetX = e.touches[0].clientX - rect.left;
            offsetY = e.touches[0].clientY - rect.top;
        } else {
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
        e.preventDefault();
    }

    function onDrag(e) {
        if (!dragging) return;
        let x, y;
        if (e.type.startsWith("touch")) {
            x = e.touches[0].clientX - offsetX;
            y = e.touches[0].clientY - offsetY;
        } else {
            x = e.clientX - offsetX;
            y = e.clientY - offsetY;
        }
        const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;
        jugadorDiv.style.left = Math.min(Math.max(0, x), maxX) + "px";
        jugadorDiv.style.top = Math.min(Math.max(0, y), maxY) + "px";
    }

    function stopDrag() {
        dragging = false;
    }

    jugadorDiv.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);

    jugadorDiv.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
})();
// ===============================
// START
// ===============================
generarNivel();
actualizarUI();
