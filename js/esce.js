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

    const personajeRuta = "img/img/personaje.jpeg"; // 🔥 tu personaje

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
