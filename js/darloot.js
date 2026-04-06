function darLoot(nivel, esBoss = false) {
    const r = Math.random();

    // ===============================
    // Configuración del inventario base
    // ===============================
    const inventarioItems = ["pocion", "espada", "armadura", "cristal", "orbe", "espadaLegendaria", "armaduraEpica"];
    inventarioItems.forEach(item => {
        jugador.inventario[item] = jugador.inventario[item] || 0;
    });

    // ===============================
    // Escala de loot
    // ===============================
    const base = Math.max(1, Math.ceil(nivel * 1.5)); // Base según nivel
    const bossMultiplier = esBoss ? 2.5 : 1;           // Multiplicador de bosses

    // ===============================
    // Probabilidades dinámicas
    // ===============================
    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;        // Raro
    const probPocion = Math.max(0.5 - nivel * 0.03, 0.25);        // Pociones
    const probEspada = Math.min(0.3 + nivel * 0.04, 0.5);         // Espadas
    const probArmadura = 1 - probPocion - probEspada;            // Armaduras comunes

    const lootRaro = [
        { nombre: "💎 Cristal Místico", inventario: "cristal" },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe" },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria" },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica" }
    ];

    // ===============================
    // Determinar loot
    // ===============================
    let cantidad;
    let loot;

    if (r < probRaro) {
        // Loot raro
        const item = lootRaro[Math.floor(Math.random() * lootRaro.length)];
        cantidad = Math.ceil(base * bossMultiplier * 0.5); // Raros son más escasos
        cantidad = Math.max(1, cantidad); // Siempre al menos 1
        jugador.inventario[item.inventario] += cantidad;
        loot = `${item.nombre} x${cantidad}`;
    } else if (r < probRaro + probPocion) {
        // Pociones
        cantidad = Math.ceil(base * bossMultiplier * 0.8);
        jugador.inventario.pocion += cantidad;
        loot = `🧪 Pociones x${cantidad}`;
    } else if (r < probRaro + probPocion + probEspada) {
        // Espadas
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.espada += cantidad;
        loot = `⚔️ Espadas x${cantidad}`;
    } else {
        // Armaduras
        cantidad = Math.ceil(base * bossMultiplier * 0.6);
        jugador.inventario.armadura += cantidad;
        loot = `🛡️ Armaduras x${cantidad}`;
    }

    return loot;
}
function darLootAvanzado(nivel, esBoss = false) {
    // ===============================
    // Inventario base y loot posible
    // ===============================
    const inventarioItems = [
        { nombre: "🧪 Pocion", inventario: "pocion", tipo: "comun", factor: 0.8 },
        { nombre: "⚔️ Espada", inventario: "espada", tipo: "comun", factor: 0.6 },
        { nombre: "🛡️ Armadura", inventario: "armadura", tipo: "comun", factor: 0.6 },
        { nombre: "💎 Cristal Místico", inventario: "cristal", tipo: "raro", factor: 0.5 },
        { nombre: "🔮 Orbe Arcano", inventario: "orbe", tipo: "raro", factor: 0.5 },
        { nombre: "⚔️ Espada Legendaria", inventario: "espadaLegendaria", tipo: "raro", factor: 0.5 },
        { nombre: "🛡️ Armadura Épica", inventario: "armaduraEpica", tipo: "raro", factor: 0.5 }
    ];

    // Inicializar inventario si no existe
    inventarioItems.forEach(item => {
        jugador.inventario[item.inventario] = jugador.inventario[item.inventario] || 0;
    });

    // ===============================
    // Configuración del loot
    // ===============================
    const base = Math.max(1, Math.ceil(nivel * 1.5));
    const bossMultiplier = esBoss ? 2.5 : 1;

    const probRaro = esBoss ? 0.15 + nivel * 0.02 : 0.02;

    // Número de ítems a soltar
    const cantidadItems = esBoss
        ? Math.ceil(2 + Math.random() * 3) // Boss: 2 a 5 items
        : Math.ceil(1 + Math.random() * 2); // Normal: 1 a 3 items

    const lootGenerado = [];

    for (let i = 0; i < cantidadItems; i++) {
        const r = Math.random();

        // Filtrar raros y comunes
        const posiblesRaros = inventarioItems.filter(it => it.tipo === "raro");
        const posiblesComunes = inventarioItems.filter(it => it.tipo === "comun");

        let item;
        if (r < probRaro) {
            // Escoger un raro
            item = posiblesRaros[Math.floor(Math.random() * posiblesRaros.length)];
        } else {
            // Escoger un común
            item = posiblesComunes[Math.floor(Math.random() * posiblesComunes.length)];
        }

        // Cantidad del item
        let cantidad = Math.ceil(base * bossMultiplier * item.factor);
        cantidad = Math.max(1, cantidad);

        // Sumar al inventario
        jugador.inventario[item.inventario] += cantidad;

        // Guardar descripción
        lootGenerado.push(`${item.nombre} x${cantidad}`);
    }

    // Devolver todos los ítems generados como texto
    return lootGenerado.join(", ");
}
