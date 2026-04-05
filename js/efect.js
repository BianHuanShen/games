// ===============================
// efectosPro.js
// ===============================

// Crear contenedor para efectos
const efectosContenedor = document.createElement("div");
efectosContenedor.id = "efectosContenedor";
efectosContenedor.style.position = "absolute";
efectosContenedor.style.top = "0";
efectosContenedor.style.left = "0";
efectosContenedor.style.width = "100%";
efectosContenedor.style.height = "100%";
efectosContenedor.style.pointerEvents = "none";
gameArea.appendChild(efectosContenedor);

// ===== FUNCIONES DE EFECTOS =====

// Crear daño flotante
function efectoDaño(x, y, cantidad, critico = false) {
    const span = document.createElement("span");
    span.textContent = cantidad;
    span.style.position = "absolute";
    span.style.left = x + "px";
    span.style.top = y + "px";
    span.style.fontWeight = "bold";
    span.style.color = critico ? "gold" : "red";
    span.style.fontSize = critico ? "24px" : "18px";
    span.style.textShadow = "1px 1px 3px black";
    span.style.opacity = 1;
    efectosContenedor.appendChild(span);

    let offset = 0;
    const anim = setInterval(() => {
        offset += 1;
        span.style.top = y - offset + "px";
        span.style.opacity -= 0.03;
        if (span.style.opacity <= 0) {
            clearInterval(anim);
            span.remove();
        }
    }, 16);
}

// Animación de golpe en enemigo
function animarEnemigo(enemigoDiv, critico = false) {
    enemigoDiv.style.transition = "transform 0.1s";
    enemigoDiv.style.transform = "translateX(-5px) scale(1.1)";
    setTimeout(() => {
        enemigoDiv.style.transform = "translateX(0px) scale(1)";
        if (critico) {
            enemigoDiv.style.boxShadow = "0 0 15px gold";
            setTimeout(() => enemigoDiv.style.boxShadow = "", 200);
        }
    }, 100);
}

// Efecto loot brillante
function efectoLoot(x, y) {
    const div = document.createElement("div");
    div.textContent = "✨";
    div.style.position = "absolute";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.fontSize = "24px";
    div.style.opacity = 1;
    efectosContenedor.appendChild(div);

    let offset = 0;
    const anim = setInterval(() => {
        offset += 1;
        div.style.top = y - offset + "px";
        div.style.opacity -= 0.03;
        if (div.style.opacity <= 0) {
            clearInterval(anim);
            div.remove();
        }
    }, 16);
}

// Efecto vibración de jugador al recibir daño
function vibrarJugador() {
    let i = 0;
    const vib = setInterval(() => {
        const dx = (Math.random() - 0.5) * 6;
        const dy = (Math.random() - 0.5) * 6;
        jugadorDiv.style.transform = `translate(${dx}px, ${dy}px)`;
        i++;
        if (i > 8) {
            clearInterval(vib);
            jugadorDiv.style.transform = "translate(0,0)";
        }
    }, 16);
}

// ===== HOOKS SOBRE MAIN.JS =====
// Extender la función atacar() para mostrar efectos
const originalAtacar = atacar;
atacar = function() {
    if (jugador.vida <= 0 || enemigos.length === 0) return;

    const enemigo = enemigos[0];
    const enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);

    // Calcular daño y crítico
    let daño = jugador.ataque + jugador.magia - enemigo.defensa;
    const critico = esCritico();
    if (critico) daño *= 2;
    if (daño < 2) daño = 2;

    // Animaciones
    efectoDaño(enemigoDiv.offsetLeft + 20, enemigoDiv.offsetTop, Math.floor(daño), critico);
    animarEnemigo(enemigoDiv, critico);

    // Llamar la función original
    originalAtacar();
};

// Hook sobre loot para efecto visual
const originalDarLoot = darLoot;
darLoot = function() {
    const loot = originalDarLoot();
    efectoLoot(jugadorDiv.offsetLeft + 20, jugadorDiv.offsetTop);
    return loot;
};

// Hook sobre ataque de enemigos para efecto jugador
const originalAtaqueEnemigos = ataqueEnemigos;
ataqueEnemigos = function() {
    if (enemigos.length > 0) vibrarJugador();
    originalAtaqueEnemigos();
};

// ===== OPCIONAL: DESTELLOS CRÍTICOS GLOBALES =====
setInterval(() => {
    document.querySelectorAll(".enemigo").forEach(div => {
        if (Math.random() < 0.005) {
            div.style.boxShadow = "0 0 20px cyan";
            setTimeout(() => div.style.boxShadow = "", 300);
        }
    });
}, 200);

// ===== FIN efectosPro.js =====
