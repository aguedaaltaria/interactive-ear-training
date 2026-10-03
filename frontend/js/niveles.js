/* ==========================================================
   LÓGICA DE NAVEGACIÓN Y NIVEL 1 (niveles.js)
   ========================================================== */

// Todo el código está envuelto aquí para asegurar que se ejecute solo cuando la página HTML esté 100% cargada y dibujada.
document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------
    // SECCIÓN 1: NAVEGACIÓN ENTRE PANTALLAS (Menú Principal)
    // ------------------------------------------------------
    
    // 1.1 Buscamos los botones del menú y las pantallas (tarjetas blancas) de cada nivel
    // Seleccionamos todos los botones que sirven para entrar a un nivel (ignorando los que estén bloqueados visualmente)
    const listaDeBotonesDelMenuDeNiveles = document.querySelectorAll(".boton-nivel:not(.bloqueado)");
    
    // Guardamos en variables las referencias a los contenedores principales (las "pantallas" del juego)
    const pantallaDelMenuPrincipal = document.getElementById("menu-niveles");
    const pantallaDelNivel1_NotasCromaticas = document.getElementById("vista-juego");
    const pantallaDelNivel2_IntervalosSimples = document.getElementById("vista-intervalos");
    const pantallaDelNivel3_IntervalosCompuestos = document.getElementById("vista-intervalos-compuestos");
    const pantallaDelNivel4_Triadas = document.getElementById("vista-triadas");
    const pantallaDelNivel5_Suspendidas = document.getElementById("vista-suspendidas");
    const pantallaDelNivel6_Septimas = document.getElementById("vista-septimas");

    // 1.2 Buscamos los botones pequeños azules de "Volver" que están en la esquina superior de cada nivel
    const botonDeVolverDelNivel1 = document.getElementById("btn-volver");
    const botonDeVolverDelNivel2 = document.getElementById("btn-volver-intervalos");
    const botonDeVolverDelNivel3 = document.getElementById("btn-volver-compuestos");
    const botonDeVolverDelNivel4 = document.getElementById("btn-volver-triadas");
    const botonDeVolverDelNivel5 = document.getElementById("btn-volver-suspendidas");
    const botonDeVolverDelNivel6 = document.getElementById("btn-volver-septimas");

    // Variable de control para llevar el registro interno de dónde está jugando el usuario
    let nombreDelNivelActivo = "Notas Cromáticas";

    // 1.3 Darle vida a los botones grandes del menú principal
    // Recorremos la lista de botones y le agregamos a cada uno la capacidad de "escuchar" un clic
    listaDeBotonesDelMenuDeNiveles.forEach(botonDelMenu => {
        botonDelMenu.addEventListener("click", () => {
            // Leemos el atributo oculto en el HTML (data-nivel) para saber a qué nivel exactamente quiere ir
            const tipoDeNivelElegido = botonDelMenu.getAttribute("data-nivel");
            
            // Primero, ocultamos el menú principal añadiéndole la clase CSS "oculto"
            pantallaDelMenuPrincipal.classList.add("oculto");

            // Segundo, dependiendo del botón presionado, mostramos la pantalla correcta quitándole la clase "oculto"
            if (tipoDeNivelElegido === "notas-cromaticas") {
                nombreDelNivelActivo = "Notas Cromáticas";
                pantallaDelNivel1_NotasCromaticas.classList.remove("oculto");
            } else if (tipoDeNivelElegido === "intervalos-simples") {
                nombreDelNivelActivo = "Intervalos Simples";
                pantallaDelNivel2_IntervalosSimples.classList.remove("oculto");
            } else if (tipoDeNivelElegido === "intervalos-compuestos") {
                nombreDelNivelActivo = "Intervalos Compuestos";
                pantallaDelNivel3_IntervalosCompuestos.classList.remove("oculto");
            } else if (tipoDeNivelElegido === "triadas-simples") {
                nombreDelNivelActivo = "Tríadas Simples";
                if (pantallaDelNivel4_Triadas) pantallaDelNivel4_Triadas.classList.remove("oculto");
            } else if (tipoDeNivelElegido === "triadas-suspendidas") {
                nombreDelNivelActivo = "Tríadas Suspendidas";
                if (pantallaDelNivel5_Suspendidas) pantallaDelNivel5_Suspendidas.classList.remove("oculto");
            } else if (tipoDeNivelElegido === "acordes-septima") {
                nombreDelNivelActivo = "Acordes de Séptima";
                if (pantallaDelNivel6_Septimas) pantallaDelNivel6_Septimas.classList.remove("oculto");
            }
        });
    });

    // 1.4 Darle vida a los botones de "Volver"
    // Si el usuario hace clic en "Volver", simplemente ocultamos la pantalla del nivel actual y volvemos a mostrar el menú
    if (botonDeVolverDelNivel1) {
        botonDeVolverDelNivel1.addEventListener("click", () => {
            pantallaDelNivel1_NotasCromaticas.classList.add("oculto");
            pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    if (botonDeVolverDelNivel2) {
        botonDeVolverDelNivel2.addEventListener("click", () => {
            pantallaDelNivel2_IntervalosSimples.classList.add("oculto");
            pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    if (botonDeVolverDelNivel3) {
        botonDeVolverDelNivel3.addEventListener("click", () => {
            if (pantallaDelNivel3_IntervalosCompuestos) pantallaDelNivel3_IntervalosCompuestos.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    if (botonDeVolverDelNivel4) {
        botonDeVolverDelNivel4.addEventListener("click", () => {
            if (pantallaDelNivel4_Triadas) pantallaDelNivel4_Triadas.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    if (botonDeVolverDelNivel5) {
        botonDeVolverDelNivel5.addEventListener("click", () => {
            if (pantallaDelNivel5_Suspendidas) pantallaDelNivel5_Suspendidas.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }
    
    if (botonDeVolverDelNivel6) {
        botonDeVolverDelNivel6.addEventListener("click", () => {
            if (pantallaDelNivel6_Septimas) pantallaDelNivel6_Septimas.classList.add("oculto");
            if (pantallaDelMenuPrincipal) pantallaDelMenuPrincipal.classList.remove("oculto");
        });
    }

    // ------------------------------------------------------
    // SECCIÓN 2: LÓGICA DEL NIVEL 1 (NOTAS CROMÁTICAS)
    // ------------------------------------------------------
    
    // 2.1 Buscar los elementos con los que interactúa el usuario dentro de la pantalla del Nivel 1
    const listaDeBotonesDeNotasNivel1 = document.querySelectorAll(".contenedor-botones .boton-nota");
    const botonDeEscucharNotaSecretaNivel1 = document.getElementById("boton-reto");
    const cuadroDeMensajeVisualNivel1 = document.getElementById("mensaje-estado");
    const etiquetaPuntajeMostradoNivel1 = document.querySelector("#marcador-puntaje span");
    
    // 2.2 Mini-banco de 12 notas exclusivo para el Nivel 1 (Porque este nivel solo usa una octava)
    const bancoDe12NotasParaNivel1 = [
        { nombre: "Do", frecuencia: 261.63 }, { nombre: "Do# / Reb", frecuencia: 277.18 },
        { nombre: "Re", frecuencia: 293.66 }, { nombre: "Re# / Mib", frecuencia: 311.13 },
        { nombre: "Mi", frecuencia: 329.63 }, { nombre: "Fa", frecuencia: 349.23 },
        { nombre: "Fa# / Solb", frecuencia: 369.99 }, { nombre: "Sol", frecuencia: 392.00 },
        { nombre: "Sol# / Lab", frecuencia: 415.30 }, { nombre: "La", frecuencia: 440.00 },
        { nombre: "La# / Sib", frecuencia: 466.16 }, { nombre: "Si", frecuencia: 493.88 }
    ];
    
    // 2.3 Variables de memoria para recordar la nota secreta actual y los puntos que lleva el jugador
    let notaOcultaGeneradaParaElUsuarioNivel1 = null;
    let contadorDePuntosTotalesNivel1 = 0;

    // 2.4 Lógica para Generar la Nota Secreta al presionar el botón azul "Escuchar Nota Secreta"
    if (botonDeEscucharNotaSecretaNivel1) {
        botonDeEscucharNotaSecretaNivel1.addEventListener("click", () => {
            // Math.random() genera un decimal aleatorio. Lo multiplicamos por 12 (el largo de la lista)
            // y usamos Math.floor para quitarle los decimales, obteniendo un número entero entre 0 y 11.
            const indiceAleatorio = Math.floor(Math.random() * bancoDe12NotasParaNivel1.length);
            
            // Extraemos la nota secreta de la lista utilizando ese número aleatorio
            notaOcultaGeneradaParaElUsuarioNivel1 = bancoDe12NotasParaNivel1[indiceAleatorio];
            
            // Le avisamos al usuario en pantalla y disparamos el sonido hacia el motor de audio global (audio.js)
            cuadroDeMensajeVisualNivel1.textContent = "🔊 ¡Nota secreta reproducida! ¿Cuál fue?";
            cuadroDeMensajeVisualNivel1.className = "mensaje-neutro";
            window.reproducirTono(notaOcultaGeneradaParaElUsuarioNivel1.frecuencia);
        });
    }

    // 2.5 Lógica para cuando el usuario intenta adivinar tocando uno de los 12 botones anaranjados
    listaDeBotonesDeNotasNivel1.forEach(botonDeNotaIndividual => {
        botonDeNotaIndividual.addEventListener("click", () => {
            
            // Protección: Si intenta responder sin haber escuchado el reto primero, detenemos el código aquí (return)
            if (!notaOcultaGeneradaParaElUsuarioNivel1) return;
            
            // Extraemos qué nota dice el botón que acaba de tocar leyendo su atributo 'data-nota' en el HTML
            const nombreDeLaNotaQueElUsuarioToco = botonDeNotaIndividual.getAttribute("data-nota");
            
            // Evaluamos: ¿El nombre del botón es idéntico al nombre de la nota secreta guardada?
            if (nombreDeLaNotaQueElUsuarioToco === notaOcultaGeneradaParaElUsuarioNivel1.nombre) {
                
                // ESCENARIO: ACIERTO
                // Cambiamos el texto y le ponemos la clase CSS de éxito (que lo pinta de verde)
                cuadroDeMensajeVisualNivel1.textContent = `🎉 ¡Correcto! Era la nota ${notaOcultaGeneradaParaElUsuarioNivel1.nombre}. (+10 pts)`;
                cuadroDeMensajeVisualNivel1.className = "mensaje-exito";
                
                // Sumamos los 10 puntos en la memoria y actualizamos el texto del marcador en el HTML
                contadorDePuntosTotalesNivel1 += 10;
                etiquetaPuntajeMostradoNivel1.textContent = contadorDePuntosTotalesNivel1;
                
                // Mandamos el aviso a la base de datos (Usando la función que programamos en audio.js)
                window.guardarPuntajeGenerico(10, "Notas Cromáticas", "acierto");
            } else {
                
                // ESCENARIO: FALLO
                // Le revelamos cuál era la nota correcta y pintamos la caja de rojo
                cuadroDeMensajeVisualNivel1.textContent = `❌ Fallaste. Era la nota ${notaOcultaGeneradaParaElUsuarioNivel1.nombre}.`;
                cuadroDeMensajeVisualNivel1.className = "mensaje-error";
                
                // Mandamos el aviso de fallo a la base de datos con 0 puntos ganados
                window.guardarPuntajeGenerico(0, "Notas Cromáticas", "fallo");
            }
        });
    });
});