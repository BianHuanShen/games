// ===============================
// 🔮 SISTEMA DE LOOT AVANZADO PROFESIONAL
// ===============================
/**
 * Genera loot escalable y con rarezas según nivel y tipo de enemigo.
 * @param {number} nivel - Nivel del enemigo.
 * @param {boolean} esBoss - True si el enemigo es un boss.
 * @returns {string} - Descripción del loot obtenido.
 */
function darLoot(nivel, esBoss = false) {
    const r = Math.random();

    // ===============================
    // Escala base de loot según nivel
    // ===============================
    const base = Math.max(1, Math.ceil(nivel * 1.5));       // Mínimo 1 loot por enemigo
    const bossMultiplier = esBoss ? 2.5 : 1;               // Boss da loot más generoso

    // ===============================
    // Probabilidades dinámicas para loot común
    // ===============================
    const probPocion   = Math.max(0.5 - nivel * 0.03, 0.25); // Pociones más frecuentes en niveles bajos
    const probEspada   = Math.min(0.3 + nivel * 0.04, 0.5);  // Espadas suben con nivel
    const probArmadura = 1 - probPocion - probEspada;       // Armadura ocupa el resto

    // ===============================
    // Loot raro con íconos especiales
    // ===============================
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02; // Más chance de raro para bosses altos
    const lootRaro = [
        { nombre: "💎 Cristal Místico", inventario: "cristal" },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe" },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria" },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica" }
    ];

    // ===============================
    // Determinar y asignar loot
    // ===============================
    let cantidad;

    if (r < probRaro) {
        // Loot raro
        const item = lootRaro[Math.floor(Math.random() * lootRaro.length)];
        jugador.inventario[item.inventario] = (jugador.inventario[item.inventario] || 0) + 1;
        return `${item.nombre} x1`;
    } else if (r < probRaro + probPocion) {
        // Pociones
        cantidad = Math.ceil(base * bossMultiplier * 0.8);
        jugador.inventario.pocion += cantidad;
        return `🧪 Pociones x${cantidad}`;
    } else if (r < probRaro + probPocion + probEspada) {
        // Espadas
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.espada += cantidad;
        return `⚔️ Espada x${cantidad}`;
    } else {
        // Armaduras
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.armadura += cantidad;
        return `🛡️ Armadura x${cantidad}`;
    }
}
