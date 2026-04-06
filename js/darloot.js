// ===============================
// Función combinada de loot (básico + avanzado)
// ===============================
function darLoot(nivel, esBoss = false) {
    // Inicializar inventario seguro
    const keys = [
        "pocion", "espada", "armadura",
        "cristal", "orbe",
        "espadaLegendaria", "armaduraEpica"
    ];
    keys.forEach(k => {
        if (jugador.inventario[k] == null || isNaN(jugador.inventario[k])) {
            jugador.inventario[k] = 0;
        }
    });

    const base = Math.max(1, Math.ceil(nivel * 1.5));
    const bossMultiplier = esBoss ? 2.5 : 1;
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;

    // Inventario avanzado
    const inventarioItems = [
        { nombre: "🧪 Pocion", inventario: "pocion", tipo: "comun", factor: 0.8 },
        { nombre: "⚔️ Espada", inventario: "espada", tipo: "comun", factor: 0.6 },
        { nombre: "🛡️ Armadura", inventario: "armadura", tipo: "comun", factor: 0.6 },
        { nombre: "💎 Cristal Místico", inventario: "cristal", tipo: "raro", factor: 0.5 },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe", tipo: "raro", factor: 0.5 },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria", tipo: "raro", factor: 0.5 },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica", tipo: "raro", factor: 0.5 }
    ];

    const lootGenerado = [];

    // Determinar cuántos items dar
    const cantidadItems = esBoss
        ? Math.ceil(2 + Math.random() * 3)  // 2 a 5 items si es boss
        : Math.ceil(1 + Math.random() * 2); // 1 a 3 items normales

    for (let i = 0; i < cantidadItems; i++) {
        const r = Math.random();

        // Elegir entre raro o común
        const posiblesRaros = inventarioItems.filter(it => it.tipo === "raro");
        const posiblesComunes = inventarioItems.filter(it => it.tipo === "comun");

        const item = r < probRaro
            ? posiblesRaros[Math.floor(Math.random() * posiblesRaros.length)]
            : posiblesComunes[Math.floor(Math.random() * posiblesComunes.length)];

        // Cantidad basada en factor y nivel
        let cantidad = Math.max(1, Math.ceil(base * bossMultiplier * item.factor));

        // ===============================
        // Aquí agregamos un toque “old school”
        // Si es item común y no es boss, a veces solo da 1
        if (!esBoss && item.tipo === "comun" && Math.random() < 0.3) {
            cantidad = 1;
        }

        jugador.inventario[item.inventario] += cantidad;
        lootGenerado.push(`${item.nombre} x${cantidad}`);
    }

    return lootGenerado.join(", ");
}

// ===============================
// Uso del loot combinado
// ===============================
let loot = darLootCombinado(enemigo.nivel, enemigo.esBoss);
console.log("Loot obtenido:", loot);
