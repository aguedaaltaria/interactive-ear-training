/* ==========================================================
   LÓGICA DEL NIVEL 8 (PARTE 1): VARIABLES Y GENERADOR (trecenas.js)
   ========================================================== */

// 1. VARIABLES COMPARTIDAS (Fuera de las funciones para que trecenas2.js las pueda leer)
let listaDeNotasDelAcordeSecretoTrecena = [];
let cualidadSecretaDelAcordeTrecena = null; 
let listaDeNotasElegidasPorElUsuarioTrecena = [];
let cualidadElegidaPorElUsuarioTrecena = null;
let contadorDePuntosTotalesTrecenas = 0;

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA
    const cuadriculaDeNotasTrecenas = document.getElementById("grid-notas-trecenas");
    const botonDeEscucharAcordeTrecena = document.getElementById("boton-reto-trecenas");
    const cuadroDeMensajeVisualTrecenas = document.getElementById("mensaje-estado-trecenas");
    const botonParaBorrarSeleccionTrecenas = document.getElementById("btn-deseleccionar-trecenas");
    const listaDeBotonesDeCualidadTrecena = document.querySelectorAll(".btn-cualidad-trecena");

    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    function inicializarBotonesParaTrecenas() {
        if (cuadriculaDeNotasTrecenas === null) {
            return;
        }
        
        cuadriculaDeNotasTrecenas.innerHTML = "";
        
        window.bancoNotas36.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            // Usamos la misma clase pequeña para mantener la cuadrícula compacta de 36 notas
            nuevoBotonDeNota.className = "boton-nota-pequeno";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            cuadriculaDeNotasTrecenas.appendChild(nuevoBotonDeNota);
        });
    }
    inicializarBotonesParaTrecenas();

    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    if (botonDeEscucharAcordeTrecena) {
        botonDeEscucharAcordeTrecena.addEventListener("click", () => {
            
            if (listaDeNotasDelAcordeSecretoTrecena.length === 0) {
                
                // La treceava mayor está a 21 semitonos de distancia de la raíz.
                // En un banco de 36 notas (índices 0 a 35), la raíz más alta segura es 35 - 21 = 14.
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 15);
                
                // Definimos las estructuras base (Omitiendo siempre la 11va por regla de claridad)
                const listaDeCualidadesDeTrecena = [
                    { nombre: "Maj13", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 11, distanciaNovena: 14, distanciaTrecena: 21 },
                    { nombre: "13",    distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 10, distanciaNovena: 14, distanciaTrecena: 21 },
                    { nombre: "m13",   distanciaTercera: 3, distanciaQuinta: 7, distanciaSeptima: 10, distanciaNovena: 14, distanciaTrecena: 21 }
                ];
                
                const indiceAleatorioParaCualidad = Math.floor(Math.random() * listaDeCualidadesDeTrecena.length);
                const objetoDeCualidadSeleccionada = listaDeCualidadesDeTrecena[indiceAleatorioParaCualidad];
                cualidadSecretaDelAcordeTrecena = objetoDeCualidadSeleccionada.nombre;

                let objetoNotaRaiz = window.bancoNotas36[indiceDeLaNotaRaiz];
                let objetoNotaTercera = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera];
                let objetoNotaQuinta = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta];
                let objetoNotaSeptima = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaSeptima];
                let objetoNotaNovena = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaNovena];
                let objetoNotaTrecena = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTrecena];

                // Probabilidades de omisión para no saturar (Voicings reales de Jazz)
                // 1. ¿Omitimos la quinta justa? (60% de probabilidad de omitirla)
                let omitirQuintaJusta = false;
                if (Math.random() * 100 > 40) {
                    omitirQuintaJusta = true;
                }

                // 2. ¿Omitimos la novena? (40% de probabilidad de omitirla para un sonido más desnudo)
                let omitirNovena = false;
                if (Math.random() * 100 > 60) {
                    omitirNovena = true;
                }

                // Construimos el acorde base aplicando las omisiones dinámicas
                let listaNotasBase = [objetoNotaRaiz, objetoNotaTercera];
                
                if (omitirQuintaJusta === false) {
                    listaNotasBase.push(objetoNotaQuinta);
                }
                
                listaNotasBase.push(objetoNotaSeptima);
                
                if (omitirNovena === false) {
                    listaNotasBase.push(objetoNotaNovena);
                }
                
                listaNotasBase.push(objetoNotaTrecena);

                // Aplicamos inversiones de manera controlada para no reventar los altavoces con agudos extremos
                const numeroAleatorioInversion = Math.random() * 100;
                let listaNotasInvertidas = [...listaNotasBase];

                // Si hay suerte (25% de los casos), hacemos una primera inversión (subimos la raíz a la octava superior)
                if (numeroAleatorioInversion < 25) {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    listaNotasInvertidas.shift(); // Quitamos la raíz del principio
                    listaNotasInvertidas.push(raizEnOctavaSuperior); // La mandamos al final (agudo)
                } 
                // Otro 25% de los casos, hacemos segunda inversión (subimos la raíz y la tercera a la octava superior)
                else if (numeroAleatorioInversion >= 25 && numeroAleatorioInversion < 50) {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    let terceraEnOctavaSuperior = { nombre: objetoNotaTercera.nombre + " (St)", frecuencia: objetoNotaTercera.frecuencia * 2 };
                    listaNotasInvertidas.shift();
                    listaNotasInvertidas.shift();
                    listaNotasInvertidas.push(raizEnOctavaSuperior);
                    listaNotasInvertidas.push(terceraEnOctavaSuperior);
                }
                // El 50% restante se queda en estado fundamental sólido (las treceavas ya son bastante complejas)

                listaDeNotasDelAcordeSecretoTrecena = listaNotasInvertidas;

                listaDeNotasElegidasPorElUsuarioTrecena = [];
                cualidadElegidaPorElUsuarioTrecena = null;
                
                const botonesDeLaCuadricula = cuadriculaDeNotasTrecenas.querySelectorAll(".boton-nota-pequeno");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadTrecena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionTrecenas) {
                    botonParaBorrarSeleccionTrecenas.classList.add("oculto");
                }
            }

            cuadroDeMensajeVisualTrecenas.textContent = "🔊 Reproduciendo acorde de treceava (jazz voicing)...";
            cuadroDeMensajeVisualTrecenas.className = "mensaje-neutro";

            const frecuenciasParaReproducir = listaDeNotasDelAcordeSecretoTrecena.map(objetoNota => objetoNota.frecuencia);
            window.reproducirSecuenciaAcorde(frecuenciasParaReproducir);
        });
    }
});