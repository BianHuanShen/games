// ===============================
// RENDER SYSTEM (ESCENARIO PRO)
// ===============================

(function () {

    console.log("🎨 Render cargado");

    const escenario = document.getElementById("escenario");

    if (!escenario) {
        console.warn("⚠️ No existe #escenario en el HTML");
        return;
    }

    // ===============================
    // CONFIG (RUTA CORRECTA 🔥)
    // ===============================
    const rutas = [
        "img/escenario1.jpeg" // ✅ correcta desde index.html
    ];

    // ===============================
    // CAMBIAR ESCENARIO DINÁMICO
    // ===============================
    function cambiarEscenario() {

        if (typeof nivelActual === "undefined") return;

        let index = nivelActual % rutas.length;

        const rutaFinal = rutas[index];

        // 🔥 FORZAR CARGA (debug incluido)
        const img = new Image();
        img.src = rutaFinal;

        img.onload = () => {
            escenario.style.backgroundImage = `url('${rutaFinal}')`;
            escenario.style.backgroundSize = "cover";
            escenario.style.backgroundPosition = "center";
            escenario.style.backgroundRepeat = "no-repeat";

            console.log("✅ Escenario cargado:", rutaFinal);
        };

        img.onerror = () => {
            console.error("❌ ERROR cargando imagen:", rutaFinal);
        };
    }

    // ===============================
    // INTERCEPTAR GENERAR NIVEL 🔥
    // ===============================
    const originalGenerarNivel = window.generarNivel;

    window.generarNivel = function () {

        if (originalGenerarNivel) {
            originalGenerarNivel();
        }

        cambiarEscenario();
    };

    // ===============================
    // PRIMER CARGA
    // ===============================
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(cambiarEscenario, 200);
    });

})();
