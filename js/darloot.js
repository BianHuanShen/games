// ===============================
// Función básica de loot
// ===============================
function darLoot(nivel, esBoss = false) {
    const r = Math.random();

    // Inventario base
    const inventarioItems = ["pocion", "espada", "armadura", "cristal", "orbe", "espadaLegendaria", "armaduraEpica"];
    inventarioItems.forEach(item => jugador.inventario[item] = jugador.inventario[item] || 0);

    // Escala de loot
    const base = Math.max(1, Math.ceil(nivel * 1.5));
    const bossMultiplier = esBoss ? 2.5 : 1;

    // Probabilidades
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;
    const probPocion = Math.max(0.5 - nivel * 0.03, 0.25);
    const probEspada = Math.min(0.3 + nivel * 0.04, 0.5);

    const lootRaro = [
        { nombre: "💎 Cristal Místico", inventario: "cristal" },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe" },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria" },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica" }
    ];

    let cantidad;
    let loot;

    if (r < probRaro) {
        const item = lootRaro[Math.floor(Math.random() * lootRaro.length)];
        cantidad = Math.max(1, Math.ceil(base * bossMultiplier * 0.5));
        jugador.inventario[item.inventario] += cantidad;
        loot = `${item.nombre} x${cantidad}`;
    } else if (r < probRaro + probPocion) {
        cantidad = Math.ceil(base * bossMultiplier * 0.8);
        jugador.inventario.pocion += cantidad;
        loot = `🧪 Pociones x${cantidad}`;
    } else if (r < probRaro + probPocion + probEspada) {
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.espada += cantidad;
        loot = `⚔️ Espadas x${cantidad}`;
    } else {
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.armadura += cantidad;
        loot = `🛡️ Armaduras x${cantidad}`;
    }

    return loot;
}

// ===============================
// Función avanzada de loot
// ===============================
function darLootAvanzado(nivel, esBoss = false) {
    const inventarioItems = [
        { nombre: "🧪 Pocion", inventario: "pocion", tipo: "comun", factor: 0.8 },
        { nombre: "⚔️ Espada", inventario: "espada", tipo: "comun", factor: 0.6 },
        { nombre: "🛡️ Armadura", inventario: "armadura", tipo: "comun", factor: 0.6 },
        { nombre: "💎 Cristal Místico", inventario: "cristal", tipo: "raro", factor: 0.5 },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe", tipo: "raro", factor: 0.5 },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria", tipo: "raro", factor: 0.5 },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica", tipo: "raro", factor: 0.5 }
    ];

    // Inicializar inventario
    inventarioItems.forEach(item => jugador.inventario[item.inventario] = jugador.inventario[item.inventario] || 0);

    const base = Math.max(1, Math.ceil(nivel * 1.5));
    const bossMultiplier = esBoss ? 2.5 : 1;
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;

    // Cantidad de ítems a generar
    const cantidadItems = esBoss
        ? Math.ceil(2 + Math.random() * 3) // 2 a 5 items
        : Math.ceil(1 + Math.random() * 2); // 1 a 3 items

    const lootGenerado = [];

    for (let i = 0; i < cantidadItems; i++) {
        const r = Math.random();
        const posiblesRaros = inventarioItems.filter(it => it.tipo === "raro");
        const posiblesComunes = inventarioItems.filter(it => it.tipo === "comun");

        const item = r < probRaro
            ? posiblesRaros[Math.floor(Math.random() * posiblesRaros.length)]
            : posiblesComunes[Math.floor(Math.random() * posiblesComunes.length)];

        let cantidad = Math.max(1, Math.ceil(base * bossMultiplier * item.factor));
        jugador.inventario[item.inventario] += cantidad;

        lootGenerado.push(`${item.nombre} x${cantidad}`);
    }

    return lootGenerado.join(", ");
}

// ===============================
// Uso del loot con enemigo
// ===============================
let loot = darLootAvanzado(enemigo.nivel, enemigo.esBoss);
console.log("Loot obtenido:", loot);
