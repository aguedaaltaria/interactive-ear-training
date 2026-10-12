/* ==========================================================
   LÓGICA DEL NIVEL 7 (PARTE 1): VARIABLES Y GENERADOR (novenas.js)
   ========================================================== */

// 1. VARIABLES COMPARTIDAS (Fuera de las funciones para que novenas2.js las pueda leer)
let listaDeNotasDelAcordeSecretoNovena = [];
let cualidadSecretaDelAcordeNovena = null; 
let listaDeNotasElegidasPorElUsuario = [];
let cualidadElegidaPorElUsuario = null;
let contadorDePuntosTotalesNovenas = 0;

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. CONEXIÓN CON LOS ELEMENTOS DE LA PANTALLA
    const cuadriculaDeNotasNovenas = document.getElementById("grid-notas-novenas");
    const botonDeEscucharAcordeNovena = document.getElementById("boton-reto-novenas");
    const cuadroDeMensajeVisualNovenas = document.getElementById("mensaje-estado-novenas");
    const botonParaBorrarSeleccionNovenas = document.getElementById("btn-deseleccionar-novenas");
    const listaDeBotonesDeCualidadNovena = document.querySelectorAll(".btn-cualidad-novena");

    // 3. CONSTRUCCIÓN DE LA CUADRÍCULA DE NOTAS
    function inicializarBotonesParaNovenas() {
        if (cuadriculaDeNotasNovenas === null) {
            return;
        }
        
        cuadriculaDeNotasNovenas.innerHTML = "";
        
        window.bancoNotas36.forEach((notaIndividualDelBanco, numeroDeIndice) => {
            const nuevoBotonDeNota = document.createElement("button");
            nuevoBotonDeNota.className = "boton-nota-pequeno";
            nuevoBotonDeNota.textContent = notaIndividualDelBanco.nombre;
            
            nuevoBotonDeNota.setAttribute("data-index", numeroDeIndice);
            nuevoBotonDeNota.setAttribute("data-frecuencia", notaIndividualDelBanco.frecuencia);
            
            cuadriculaDeNotasNovenas.appendChild(nuevoBotonDeNota);
        });
    }
    inicializarBotonesParaNovenas();

    // 4. LÓGICA PARA GENERAR Y ESCUCHAR EL ACORDE SECRETO
    if (botonDeEscucharAcordeNovena) {
        botonDeEscucharAcordeNovena.addEventListener("click", () => {
            
            if (listaDeNotasDelAcordeSecretoNovena.length === 0) {
                
                // Índice máximo seguro para la raíz es 21 (35 - 14)
                const indiceDeLaNotaRaiz = Math.floor(Math.random() * 22);
                
                const listaDeCualidadesDeNovena = [
                    { nombre: "Maj9", distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 11, distanciaNovena: 14 },
                    { nombre: "9",    distanciaTercera: 4, distanciaQuinta: 7, distanciaSeptima: 10, distanciaNovena: 14 },
                    { nombre: "m9",   distanciaTercera: 3, distanciaQuinta: 7, distanciaSeptima: 10, distanciaNovena: 14 }
                ];
                
                const indiceAleatorioParaCualidad = Math.floor(Math.random() * listaDeCualidadesDeNovena.length);
                const objetoDeCualidadSeleccionada = listaDeCualidadesDeNovena[indiceAleatorioParaCualidad];
                cualidadSecretaDelAcordeNovena = objetoDeCualidadSeleccionada.nombre;

                let objetoNotaRaiz = window.bancoNotas36[indiceDeLaNotaRaiz];
                let objetoNotaTercera = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaTercera];
                let objetoNotaQuinta = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaQuinta];
                let objetoNotaSeptima = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaSeptima];
                let objetoNotaNovena = window.bancoNotas36[indiceDeLaNotaRaiz + objetoDeCualidadSeleccionada.distanciaNovena];

                let omitirQuintaJusta = false;
                const numeroAleatorioOmision = Math.random() * 100;
                
                if (numeroAleatorioOmision > 50) {
                    omitirQuintaJusta = true;
                }

                let listaNotasBase = [];
                if (omitirQuintaJusta === true) {
                    listaNotasBase = [objetoNotaRaiz, objetoNotaTercera, objetoNotaSeptima, objetoNotaNovena];
                } else {
                    listaNotasBase = [objetoNotaRaiz, objetoNotaTercera, objetoNotaQuinta, objetoNotaSeptima, objetoNotaNovena];
                }

                const numeroAleatorioInversion = Math.random() * 100;
                let listaNotasInvertidas = [...listaNotasBase];

                const cantidadNotasEnBase = listaNotasBase.length;

                if (cantidadNotasEnBase === 5) {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    let terceraEnOctavaSuperior = { nombre: objetoNotaTercera.nombre + " (St)", frecuencia: objetoNotaTercera.frecuencia * 2 };
                    let quintaEnOctavaSuperior = { nombre: objetoNotaQuinta.nombre + " (St)", frecuencia: objetoNotaQuinta.frecuencia * 2 };
                    let septimaEnOctavaSuperior = { nombre: objetoNotaSeptima.nombre + " (St)", frecuencia: objetoNotaSeptima.frecuencia * 2 };

                    const esEstadoFundamental = numeroAleatorioInversion < 40; 
                    const esPrimeraInversion = numeroAleatorioInversion >= 40 && numeroAleatorioInversion < 55; 
                    const esSegundaInversion = numeroAleatorioInversion >= 55 && numeroAleatorioInversion < 70; 
                    const esTerceraInversion = numeroAleatorioInversion >= 70 && numeroAleatorioInversion < 85; 
                    const esCuartaInversion = numeroAleatorioInversion >= 85; 

                    if (esPrimeraInversion) {
                        listaNotasInvertidas = [objetoNotaTercera, objetoNotaQuinta, objetoNotaSeptima, objetoNotaNovena, raizEnOctavaSuperior];
                    } else if (esSegundaInversion) {
                        listaNotasInvertidas = [objetoNotaQuinta, objetoNotaSeptima, objetoNotaNovena, raizEnOctavaSuperior, terceraEnOctavaSuperior];
                    } else if (esTerceraInversion) {
                        listaNotasInvertidas = [objetoNotaSeptima, objetoNotaNovena, raizEnOctavaSuperior, terceraEnOctavaSuperior, quintaEnOctavaSuperior];
                    } else if (esCuartaInversion) {
                        listaNotasInvertidas = [objetoNotaNovena, raizEnOctavaSuperior, terceraEnOctavaSuperior, quintaEnOctavaSuperior, septimaEnOctavaSuperior];
                    }
                } else {
                    let raizEnOctavaSuperior = { nombre: objetoNotaRaiz.nombre + " (St)", frecuencia: objetoNotaRaiz.frecuencia * 2 };
                    let terceraEnOctavaSuperior = { nombre: objetoNotaTercera.nombre + " (St)", frecuencia: objetoNotaTercera.frecuencia * 2 };
                    let septimaEnOctavaSuperior = { nombre: objetoNotaSeptima.nombre + " (St)", frecuencia: objetoNotaSeptima.frecuencia * 2 };

                    const esEstadoFundamentalCuatroNotas = numeroAleatorioInversion < 40; 
                    const esPrimeraInversionCuatroNotas = numeroAleatorioInversion >= 40 && numeroAleatorioInversion < 60; 
                    const esSegundaInversionCuatroNotas = numeroAleatorioInversion >= 60 && numeroAleatorioInversion < 80; 
                    const esTerceraInversionCuatroNotas = numeroAleatorioInversion >= 80; 

                    if (esPrimeraInversionCuatroNotas) {
                        listaNotasInvertidas = [objetoNotaTercera, objetoNotaSeptima, objetoNotaNovena, raizEnOctavaSuperior];
                    } else if (esSegundaInversionCuatroNotas) {
                        listaNotasInvertidas = [objetoNotaSeptima, objetoNotaNovena, raizEnOctavaSuperior, terceraEnOctavaSuperior];
                    } else if (esTerceraInversionCuatroNotas) {
                        listaNotasInvertidas = [objetoNotaNovena, raizEnOctavaSuperior, terceraEnOctavaSuperior, septimaEnOctavaSuperior];
                    }
                }

                const numeroAleatorioDuplicacion = Math.random() * 100;
                if (numeroAleatorioDuplicacion < 35) {
                    let notaMasGraveActual = listaNotasInvertidas[0];
                    let notaBajoDuplicada = { 
                        nombre: notaMasGraveActual.nombre + " (Dub)", 
                        frecuencia: notaMasGraveActual.frecuencia * 2 
                    };
                    listaNotasInvertidas.push(notaBajoDuplicada);
                }

                listaDeNotasDelAcordeSecretoNovena = listaNotasInvertidas;

                listaDeNotasElegidasPorElUsuario = [];
                cualidadElegidaPorElUsuario = null;
                
                const botonesDeLaCuadricula = cuadriculaDeNotasNovenas.querySelectorAll(".boton-nota-triada");
                botonesDeLaCuadricula.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                listaDeBotonesDeCualidadNovena.forEach(botonIndividual => botonIndividual.classList.remove("seleccionada"));
                
                if (botonParaBorrarSeleccionNovenas) {
                    botonParaBorrarSeleccionNovenas.classList.add("oculto");
                }
            }

            cuadroDeMensajeVisualNovenas.textContent = "🔊 Reproduciendo acorde de novena con inversión y sonoridad real...";
            cuadroDeMensajeVisualNovenas.className = "mensaje-neutro";

            const frecuenciasParaReproducir = listaDeNotasDelAcordeSecretoNovena.map(objetoNota => objetoNota.frecuencia);
            window.reproducirSecuenciaAcorde(frecuenciasParaReproducir);
        });
    }
});