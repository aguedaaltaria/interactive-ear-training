/* ==========================================================
   GUÍA DE CONSULTA HISTÓRICA - ENTRENADOR AUDITIVO
   ========================================================== */

/* ----------------------------------------------------------
   1. EJEMPLO BÁSICO CRUDO (Día 3 - Inicio de la Web Audio API)
   const contexto = new AudioContext();
   const oscilador = contexto.createOscillator();
   const volumen = contexto.createGain();
   volumen.gain.value = 0.1;
   oscilador.connect(volumen);
   volumen.connect(contexto.destination);
   oscilador.start();
   oscilador.stop(contexto.currentTime + 1);
-------------------------------------------------------------

   2. VERSIÓN MODULAR DE MÚLTIPLES NOTAS (Día 4)
   Función genérica para recibir frecuencias mediante querySelectorAll.
-------------------------------------------------------------

   3. LÓGICA DE JUEGO LOCAL (Día 5)
   Selección aleatoria con Math.random() y validación de aciertos.
---------------------------------------------------------- */


/* ==========================================================
   LÓGICA ACTIVA DEL JUEGO + NAVEGACIÓN DE NIVELES (Día 9)
   ========================================================== */

/* ==========================================================
   MOTOR DE AUDIO Y GESTIÓN DE HISTORIAL (audio.js)
   ========================================================== */

// 1. EL BANCO DE NOTAS MUSICALES
// Este banco mantiene su nombre porque niveles.js y triadas.js lo buscan exactamente así.
window.bancoNotas24 = [
    { nombre: "Do 4", frecuencia: 261.63 }, { nombre: "Do#4 / Reb4", frecuencia: 277.18 },
    { nombre: "Re 4", frecuencia: 293.66 }, { nombre: "Re#4 / Mib4", frecuencia: 311.13 },
    { nombre: "Mi 4", frecuencia: 329.63 }, { nombre: "Fa 4", frecuencia: 349.23 },
    { nombre: "Fa#4 / Solb4", frecuencia: 369.99 }, { nombre: "Sol 4", frecuencia: 392.00 },
    { nombre: "Sol#4 / Lab4", frecuencia: 415.30 }, { nombre: "La 4", frecuencia: 440.00 },
    { nombre: "La#4 / Sib4", frecuencia: 466.16 }, { nombre: "Si 4", frecuencia: 493.88 },
    { nombre: "Do 5", frecuencia: 523.25 }, { nombre: "Do#5 / Reb5", frecuencia: 554.37 },
    { nombre: "Re 5", frecuencia: 587.33 }, { nombre: "Re#5 / Mib5", frecuencia: 622.25 },
    { nombre: "Mi 5", frecuencia: 659.25 }, { nombre: "Fa 5", frecuencia: 698.46 },
    { nombre: "Fa#5 / Solb5", frecuencia: 739.99 }, { nombre: "Sol 5", frecuencia: 783.99 },
    { nombre: "Sol#5 / Lab5", frecuencia: 830.61 }, { nombre: "La 5", frecuencia: 880.00 },
    { nombre: "La#5 / Sib5", frecuencia: 932.33 }, { nombre: "Si 5", frecuencia: 987.77 }
];

// 2. REPRODUCTOR DE TONO BÁSICO (Para el Nivel 1 o clics rápidos)
window.reproducirTono = function(frecuenciaHertzios) {
    // Inicializamos el motor de audio que viene escondido en tu navegador web
    const ConstructorDeAudioNavegador = window.AudioContext || window.webkitAudioContext;
    const motorDeAudioActivo = new ConstructorDeAudioNavegador();
    
    // Creamos un "oscilador" (una maquinita que genera ondas de sonido digital)
    const generadorDeOndaSonora = motorDeAudioActivo.createOscillator();
    // "sine" significa que la onda es redonda, lo que produce un pitido suave como un flautín
    generadorDeOndaSonora.type = "sine"; 
    
    // Le decimos al generador qué nota (frecuencia) debe tocar ahora mismo
    generadorDeOndaSonora.frequency.setValueAtTime(frecuenciaHertzios, motorDeAudioActivo.currentTime);
    
    // Creamos un nodo de ganancia (básicamente es una perilla de volumen)
    const perillaDeVolumen = motorDeAudioActivo.createGain();
    // Bajamos el volumen al 10% (0.1) para no asustar al usuario ni romper bocinas
    perillaDeVolumen.gain.setValueAtTime(0.1, motorDeAudioActivo.currentTime);
    
    // Conectamos los cables: El generador va a la perilla de volumen, y de la perilla a los parlantes
    generadorDeOndaSonora.connect(perillaDeVolumen);
    perillaDeVolumen.connect(motorDeAudioActivo.destination);
    
    // Disparamos el sonido y programamos que se calle solito 1.2 segundos después
    generadorDeOndaSonora.start();
    generadorDeOndaSonora.stop(motorDeAudioActivo.currentTime + 1.2);
};

// 3. REPRODUCTOR DE NOTAS LARGAS Y SUAVES (Con difuminado de entrada y salida)
window.reproducirTonoLargo = function(frecuenciaHertzios, duracionEnSegundos = 1.2, volumenMaximoBase = 0.08) {
    const ConstructorDeAudio = window.AudioContext || window.webkitAudioContext;
    const motorDeAudioActivo = new ConstructorDeAudio();
    const tiempoJustoAhora = motorDeAudioActivo.currentTime;
    
    const generadorDeOndaSonora = motorDeAudioActivo.createOscillator();
    const perillaDeVolumen = motorDeAudioActivo.createGain();
    
    generadorDeOndaSonora.type = "sine";
    generadorDeOndaSonora.frequency.setValueAtTime(frecuenciaHertzios, tiempoJustoAhora);
    
    // Efectos de difuminado (Fade in y Fade out) para que el sonido no haga "clic" al cortarse:
    // 1. Inicia en silencio total
    perillaDeVolumen.gain.setValueAtTime(0.001, tiempoJustoAhora);
    // 2. Sube rápido al volumen normal en los primeros instantes
    perillaDeVolumen.gain.linearRampToValueAtTime(volumenMaximoBase, tiempoJustoAhora + 0.05);
    // 3. Mantiene el volumen estable casi hasta el final
    perillaDeVolumen.gain.setValueAtTime(volumenMaximoBase, tiempoJustoAhora + duracionEnSegundos - 0.2);
    // 4. Se apaga suavemente al finalizar la nota
    perillaDeVolumen.gain.exponentialRampToValueAtTime(0.0001, tiempoJustoAhora + duracionEnSegundos);
    
    generadorDeOndaSonora.connect(perillaDeVolumen);
    perillaDeVolumen.connect(motorDeAudioActivo.destination);
    
    generadorDeOndaSonora.start(tiempoJustoAhora);
    generadorDeOndaSonora.stop(tiempoJustoAhora + duracionEnSegundos);
};

// 4. REPRODUCTOR DE MÚLTIPLES NOTAS AL MISMO TIEMPO (Para formar acordes enteros)
window.reproducirAcordeSimultaneo = function(listaDeVariasFrecuencias) {
    const ConstructorDeAudio = window.AudioContext || window.webkitAudioContext;
    const motorDeAudioActivo = new ConstructorDeAudio();
    const tiempoJustoAhora = motorDeAudioActivo.currentTime;
    const duracionFijaDelAcorde = 2.0;
    
    // Matemáticas para el volumen: Si tocamos 3 notas a la vez, sonarían el triple de fuerte.
    // Esta fórmula ajusta el volumen general dividiéndolo entre la cantidad de notas que van a sonar.
    const volumenEquilibradoPorNota = 0.07 / Math.sqrt(listaDeVariasFrecuencias.length);

    // Repetimos el proceso de crear un generador por cada nota musical que haya en la lista
    listaDeVariasFrecuencias.forEach(frecuenciaIndividual => {
        const generadorDeOndaSonora = motorDeAudioActivo.createOscillator();
        const perillaDeVolumen = motorDeAudioActivo.createGain();
        
        generadorDeOndaSonora.type = "sine";
        generadorDeOndaSonora.frequency.setValueAtTime(frecuenciaIndividual, tiempoJustoAhora);
        
        // Difuminado de volumen para cada nota del acorde
        perillaDeVolumen.gain.setValueAtTime(0.001, tiempoJustoAhora);
        perillaDeVolumen.gain.linearRampToValueAtTime(volumenEquilibradoPorNota, tiempoJustoAhora + 0.08);
        perillaDeVolumen.gain.setValueAtTime(volumenEquilibradoPorNota, tiempoJustoAhora + duracionFijaDelAcorde - 0.3);
        perillaDeVolumen.gain.exponentialRampToValueAtTime(0.0001, tiempoJustoAhora + duracionFijaDelAcorde);
        
        generadorDeOndaSonora.connect(perillaDeVolumen);
        perillaDeVolumen.connect(motorDeAudioActivo.destination);
        
        generadorDeOndaSonora.start(tiempoJustoAhora);
        generadorDeOndaSonora.stop(tiempoJustoAhora + duracionFijaDelAcorde);
    });
};

// 5. CREADOR DE SECUENCIAS (Toca nota por nota separada y al final las junta todas)
window.reproducirSecuenciaAcorde = async function(listaDeVariasFrecuencias) {
    // "async" nos permite usar "await" para hacer que el código se espere y no toque todo a la vez
    
    // Paso 1: Tocamos cada nota de la lista de forma individual
    for (let frecuenciaIndividual of listaDeVariasFrecuencias) {
        window.reproducirTonoLargo(frecuenciaIndividual, 1.2, 0.09);
        
        // Creamos una pausa (Promesa) que obliga al sistema a esperar 1.4 segundos antes de tocar la siguiente nota
        await new Promise(funcionParaResolverLaPausa => setTimeout(funcionParaResolverLaPausa, 1400));
    }
    
    // Paso 2: Hacemos un breve silencio de 0.3 segundos para que el cerebro separe las notas del acorde final
    await new Promise(funcionParaResolverLaPausa => setTimeout(funcionParaResolverLaPausa, 300));
    
    // Paso 3: Disparamos el acorde con todas las notas juntas de golpe
    window.reproducirAcordeSimultaneo(listaDeVariasFrecuencias);
};


/* ==========================================================
   CONEXIÓN A BASE DE DATOS (HISTORIAL Y PUNTAJES)
   ========================================================== */

// 6. SOLICITAR LOS PUNTAJES ANTIGUOS AL SERVIDOR PARA MOSTRARLOS
window.cargarHistorial = async function() {
    // Buscamos en el almacenamiento de la pestaña web el ID del usuario
    const identificadorDeUsuarioLogueado = localStorage.getItem("ear_training_usuario_id");
    
    // Si la persona no se ha logueado, cancelamos la operación para no pedir datos a lo loco
    if (!identificadorDeUsuarioLogueado) return;
    
    try {
        // Le pedimos a nuestro backend (el servidor en Python Flask) que nos de la lista de puntajes de esta persona
        const respuestaDirectaDelServidor = await fetch(`http://localhost:5001/api/puntajes?usuario_id=${identificadorDeUsuarioLogueado}`);
        
        // Convertimos la respuesta del servidor en un formato que Javascript pueda leer (JSON)
        const informacionTransformadaEnDatos = await respuestaDirectaDelServidor.json();
        
        // Esta es la lista de todas las "cajas blancas" de historial que existen en el HTML
        const nombresDeCajasHtmlDeHistorial = [
            "lista-historial", 
            "lista-historial-intervalos", 
            "lista-historial-compuestos", 
            "lista-historial-triadas"
        ];

        // Recorremos una por una las cajas y las rellenamos con la información
        nombresDeCajasHtmlDeHistorial.forEach(nombreDeLaCajaHtml => {
            const cajitaDelDomHTML = document.getElementById(nombreDeLaCajaHtml);
            
            // Si la caja no existe en la pantalla actual, saltamos a la siguiente
            if (!cajitaDelDomHTML) return; 
            
            // Si el servidor nos dice que este usuario aún no ha jugado, ponemos un texto de aviso
            if (informacionTransformadaEnDatos.puntajes.length === 0) {
                cajitaDelDomHTML.innerHTML = "<li style='justify-content: center; color: var(--color-texto-suave);'>No hay puntajes registrados aún para este usuario.</li>";
            } else {
                // Variable temporal donde iremos pegando los textos para el historial
                let bloqueDeTextoHtmlParaInsertar = "";
                
                // Por cada jugada guardada, creamos una tarjetita
                informacionTransformadaEnDatos.puntajes.forEach(jugadaIndividual => {
                    const emoticonoVisual = jugadaIndividual.resultado === 'fallo' ? '❌' : '✅';
                    bloqueDeTextoHtmlParaInsertar += `<li><span>${emoticonoVisual} Nivel: ${jugadaIndividual.nivel}</span> <strong>+${jugadaIndividual.puntaje} pts</strong> <small>${jugadaIndividual.fecha}</small></li>`;
                });
                
                // Finalmente inyectamos todo el texto armado dentro de la caja en el navegador
                cajitaDelDomHTML.innerHTML = bloqueDeTextoHtmlParaInsertar;
            }
        });
    } catch (errorDeConexionConBackend) {
        console.error("Falló la conexión al tratar de traer el historial:", errorDeConexionConBackend);
    }
};

// 7. ENVIAR UN NUEVO PUNTAJE AL SERVIDOR CADA QUE GANAS O PIERDES
window.guardarPuntajeGenerico = async function(cantidadDePuntosGanados, nombreLiteralDelNivel, resultadoFinalAciertoFallo = 'acierto') {
    // Revisamos de nuevo quién es el usuario activo
    const identificadorDeUsuarioLogueado = localStorage.getItem("ear_training_usuario_id");
    if (!identificadorDeUsuarioLogueado) return;
    
    try {
        // Esta vez usamos POST porque no queremos PEDIR información, sino MANDAR información nueva al servidor
        await fetch("http://localhost:5001/api/puntajes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Empaquetamos los datos en un texto (JSON.stringify) para que viajen por internet
            body: JSON.stringify({ 
                usuario_id: identificadorDeUsuarioLogueado, 
                puntaje: cantidadDePuntosGanados, 
                nivel: nombreLiteralDelNivel, 
                resultado: resultadoFinalAciertoFallo 
            })
        });
        
        // Como acabamos de subir un punto nuevo, le decimos al sistema que recargue las tablas para que el usuario vea su avance inmediato
        window.cargarHistorial();
        
    } catch (errorAlTratarDeGuardar) {
        console.error("Hubo un error de conexión al tratar de enviar tu nuevo puntaje:", errorAlTratarDeGuardar);
    }
};