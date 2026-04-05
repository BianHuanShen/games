// ===============================
// RENDER SYSTEM (ESCENARIO + PLAYER)
// ===============================

(function () {

    console.log("🎨 Render cargado");

    const escenario = document.getElementById("escenario");

    if (!escenario) {
        console.warn("⚠️ No existe #escenario en el HTML");
        return;
    }

    // ===============================
    // CONFIG
    // ===============================
    const rutas = [
        "img/escenario1.jpeg"
    ];

    const personajeRuta = "img/personaje.jpeg"; // 🔥 tu personaje

    // ===============================
    // FONDO
    // ===============================
    function cambiarEscenario() {

        if (typeof nivelActual === "undefined") return;

        let index = nivelActual % rutas.length;
        const rutaFinal = rutas[index];

        const img = new Image();
        img.src = rutaFinal;

        img.onload = () => {
            escenario.style.backgroundImage = `url('${rutaFinal}')`;
            escenario.style.backgroundSize = "cover";
            escenario.style.backgroundPosition = "center";
            escenario.style.backgroundRepeat = "no-repeat";

            console.log("✅ Escenario cargado");
        };

        img.onerror = () => {
            console.error("❌ Error fondo:", rutaFinal);
        };
    }

    // ===============================
    // 🧍 APLICAR IMAGEN AL JUGADOR
    // ===============================
    function aplicarPersonaje() {

        const jugador = document.getElementById("jugador");

        if (!jugador) {
            console.warn("⏳ Jugador aún no existe...");
            return;
        }

        const img = new Image();
        img.src = personajeRuta;

        img.onload = () => {

            jugador.style.backgroundImage = `url('${personajeRuta}')`;
            jugador.style.backgroundSize = "contain";
            jugador.style.backgroundRepeat = "no-repeat";
            jugador.style.backgroundPosition = "center";

            // 🔥 quitar color azul original
            jugador.style.backgroundColor = "transparent";

            console.log("🧍 Personaje cargado");
        };

        img.onerror = () => {
            console.error("❌ Error personaje:", personajeRuta);
        };
    }
// ===============================
// 🧟 APLICAR IMAGEN A ENEMIGOS
// ===============================
function aplicarImagenEnemigos() {
    document.querySelectorAll(".enemigo").forEach(enemigoDiv => {
        const index = enemigoDiv.dataset.index;
        const enemigo = enemigos[index];

        if (!enemigo) return;

        // Selección de imagen según tipo
        let ruta = "img/enemigo1.png"; // default
        if (enemigo.jefe) ruta = "img/boss.png";
        else if (enemigo.ia === "mago") ruta = "img/mago.png";
        else ruta = `img/enemigo${Math.floor(Math.random() * 3) + 1}.png`;

        const img = new Image();
        img.src = ruta;

        img.onload = () => {
            enemigoDiv.style.backgroundImage = `url('${ruta}')`;
            enemigoDiv.style.backgroundSize = "contain";
            enemigoDiv.style.backgroundRepeat = "no-repeat";
            enemigoDiv.style.backgroundPosition = "center";

            // Quitar color de fondo por defecto
            enemigoDiv.style.backgroundColor = "transparent";

            console.log(`🧟 Enemigo #${index} cargado: ${ruta}`);
        };

        img.onerror = () => {
            console.error(`❌ Error cargando enemigo #${index}: ${ruta}`);
        };
    });
}

// ===============================
// HOOK: después de dibujar enemigos
// ===============================
const originalDibujarEnemigos = window.dibujarEnemigos;
window.dibujarEnemigos = function () {
    if (originalDibujarEnemigos) originalDibujarEnemigos();
    // Aplicar imágenes a todos los enemigos dibujados
    setTimeout(aplicarImagenEnemigos, 50);
};
    // ===============================
    // INTERCEPTAR NIVEL
    // ===============================
    const originalGenerarNivel = window.generarNivel;

    window.generarNivel = function () {

        if (originalGenerarNivel) {
            originalGenerarNivel();
        }

        cambiarEscenario();

        // 🔥 asegurar personaje siempre visible
        setTimeout(aplicarPersonaje, 50);
    };

    // ===============================
    // INICIO
    // ===============================
    document.addEventListener("DOMContentLoaded", () => {

        setTimeout(() => {
            cambiarEscenario();
            aplicarPersonaje();
        }, 300);

    });

})();
