/* ==========================================================
   GESTOR DE AUTENTICACIÓN Y SESIÓN (auth.js)
   ========================================================== */

// 1. MOSTRAR EL NOMBRE DEL USUARIO EN TODAS LAS PANTALLAS
window.mostrarBadgeUsuarioGlobal = function(nombreDelUsuarioActivo) {
    // Menú Principal
    const etiquetaNombreMenu = document.getElementById("nombre-usuario-badge");
    const contenedorFlotanteMenu = document.getElementById("indicador-usuario-flotante");
    if (etiquetaNombreMenu && contenedorFlotanteMenu) {
        etiquetaNombreMenu.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteMenu.classList.remove("oculto");
    }

    // Nivel 1 (Notas Cromáticas)
    const etiquetaNombreNivel1 = document.getElementById("nombre-usuario-badge-nivel1");
    const contenedorFlotanteNivel1 = document.getElementById("indicador-usuario-flotante-nivel1");
    if (etiquetaNombreNivel1 && contenedorFlotanteNivel1) {
        etiquetaNombreNivel1.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteNivel1.classList.remove("oculto");
    }

    // Nivel 2 (Intervalos Simples)
    const etiquetaNombreIntervalos = document.getElementById("nombre-usuario-badge-intervalos");
    const contenedorFlotanteIntervalos = document.getElementById("indicador-usuario-flotante-intervalos");
    if (etiquetaNombreIntervalos && contenedorFlotanteIntervalos) {
        etiquetaNombreIntervalos.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteIntervalos.classList.remove("oculto");
    }

    // Nivel 3 (Intervalos Compuestos)
    const etiquetaNombreCompuestos = document.getElementById("nombre-usuario-badge-compuestos");
    const contenedorFlotanteCompuestos = document.getElementById("indicador-usuario-flotante-compuestos");
    if (etiquetaNombreCompuestos && contenedorFlotanteCompuestos) {
        etiquetaNombreCompuestos.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteCompuestos.classList.remove("oculto");
    }

    // Nivel 4 (Tríadas Simples)
    const etiquetaNombreTriadas = document.getElementById("nombre-usuario-badge-triadas");
    const contenedorFlotanteTriadas = document.getElementById("indicador-usuario-flotante-triadas");
    if (etiquetaNombreTriadas && contenedorFlotanteTriadas) {
        etiquetaNombreTriadas.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteTriadas.classList.remove("oculto");
    }

    // Nivel 5 (Tríadas Suspendidas)
    const etiquetaNombreSuspendidas = document.getElementById("nombre-usuario-badge-suspendidas");
    const contenedorFlotanteSuspendidas = document.getElementById("indicador-usuario-flotante-suspendidas");
    if (etiquetaNombreSuspendidas && contenedorFlotanteSuspendidas) {
        etiquetaNombreSuspendidas.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteSuspendidas.classList.remove("oculto");
    }

    // Nivel 6 (Séptimas)
    const etiquetaNombreSeptimas = document.getElementById("nombre-usuario-badge-septimas");
    const contenedorFlotanteSeptimas = document.getElementById("indicador-usuario-flotante-septimas");
    if (etiquetaNombreSeptimas && contenedorFlotanteSeptimas) {
        etiquetaNombreSeptimas.textContent = nombreDelUsuarioActivo;
        contenedorFlotanteSeptimas.classList.remove("oculto");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. REVISAR SI YA HAY ALGUIEN CONECTADO
    let idDelUsuarioGuardado = localStorage.getItem("ear_training_usuario_id");
    let nombreDelUsuarioGuardado = localStorage.getItem("ear_training_usuario_nombre");

    const pantallaDeIngreso = document.getElementById("vista-usuario");
    const pantallaDelMenuDeNiveles = document.getElementById("menu-niveles");
    const cajaDeTextoIngresoUsuario = document.getElementById("input-usuario");
    const botonDeIngresar = document.getElementById("btn-ingresar");
    const textoDeMensajeDeError = document.getElementById("mensaje-error-usuario");

    if (idDelUsuarioGuardado && nombreDelUsuarioGuardado) {
        if (pantallaDeIngreso) pantallaDeIngreso.classList.add("oculto");
        if (pantallaDelMenuDeNiveles) pantallaDelMenuDeNiveles.classList.remove("oculto");
        
        window.mostrarBadgeUsuarioGlobal(nombreDelUsuarioGuardado);
        if (typeof cargarHistorial === "function") cargarHistorial();
    }

    // 3. CERRAR SESIÓN (Cambiar Usuario)
    // Agrupamos TODOS los botones de "Cambiar" en una lista para asegurar que funcionen en todas las pantallas
    const listaDeBotonesParaCerrarSesion = [
        document.getElementById("btn-cambiar-usuario"),
        document.getElementById("btn-cambiar-usuario-nivel1"),
        document.getElementById("btn-cambiar-usuario-intervalos"),
        document.getElementById("btn-cambiar-usuario-compuestos"),
        document.getElementById("btn-cambiar-usuario-triadas"),
        document.getElementById("btn-cambiar-usuario-suspendidas"),
        document.getElementById("btn-cambiar-usuario-septimas")
    ];

    // Recorremos la lista y le damos la orden de cerrar sesión a cada botón que exista
    listaDeBotonesParaCerrarSesion.forEach(botonIndividual => {
        if (botonIndividual) {
            botonIndividual.addEventListener("click", () => {
                localStorage.removeItem("ear_training_usuario_id");
                localStorage.removeItem("ear_training_usuario_nombre");
                
                document.querySelectorAll(".tarjeta-juego").forEach(tarjeta => tarjeta.classList.add("oculto"));
                if (pantallaDelMenuDeNiveles) pantallaDelMenuDeNiveles.classList.add("oculto");
                
                if (pantallaDeIngreso) pantallaDeIngreso.classList.remove("oculto");
                if (cajaDeTextoIngresoUsuario) cajaDeTextoIngresoUsuario.value = "";
            });
        }
    });

    // 4. INICIAR SESIÓN O CREAR USUARIO NUEVO
    if (botonDeIngresar) {
        botonDeIngresar.addEventListener("click", async () => {
            const nombreEscritoPorElUsuario = cajaDeTextoIngresoUsuario.value.trim().toLowerCase();

            if (!nombreEscritoPorElUsuario) {
                textoDeMensajeDeError.textContent = "⚠️ Por favor ingresa un nombre de usuario.";
                textoDeMensajeDeError.classList.remove("oculto");
                return; 
            }

            if (nombreEscritoPorElUsuario.includes(" ")) {
                textoDeMensajeDeError.textContent = "⚠️ El nombre de usuario no debe contener espacios.";
                textoDeMensajeDeError.classList.remove("oculto");
                return;
            }

            try {
                const respuestaDelServidorBD = await fetch("http://localhost:5001/api/usuarios", {
                    method: "POST", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreEscritoPorElUsuario })
                });

                const datosProcesadosDeRespuesta = await respuestaDelServidorBD.json();

                if (respuestaDelServidorBD.ok) {
                    localStorage.setItem("ear_training_usuario_id", datosProcesadosDeRespuesta.usuario_id);
                    localStorage.setItem("ear_training_usuario_nombre", datosProcesadosDeRespuesta.nombre);

                    pantallaDeIngreso.classList.add("oculto");
                    pantallaDelMenuDeNiveles.classList.remove("oculto");
                    
                    window.mostrarBadgeUsuarioGlobal(datosProcesadosDeRespuesta.nombre);
                    if (typeof cargarHistorial === "function") cargarHistorial();
                } else {
                    textoDeMensajeDeError.textContent = `⚠️ ${datosProcesadosDeRespuesta.error}`;
                    textoDeMensajeDeError.classList.remove("oculto");
                }
            } catch (errorDeConexion) {
                console.error("Error al registrar usuario:", errorDeConexion);
                textoDeMensajeDeError.textContent = "⚠️ Error al conectar con el servidor.";
                textoDeMensajeDeError.classList.remove("oculto");
            }
        });
    }

    // 5. SISTEMA DE AUTOCOMPLETADO
    const contenedorDeSugerenciasFlotantes = document.getElementById("sugerencias-usuarios");
    let listaGlobalDeUsuariosRegistrados = [];

    async function solicitarListaDeUsuariosAlServidor() {
        try {
            const respuestaDelServidor = await fetch("http://localhost:5001/api/usuarios");
            const datosExtraidos = await respuestaDelServidor.json();
            if (respuestaDelServidor.ok) listaGlobalDeUsuariosRegistrados = datosExtraidos.usuarios;
        } catch (errorDeConexion) {
            console.error("Error al cargar la lista completa de usuarios:", errorDeConexion);
        }
    }
    solicitarListaDeUsuariosAlServidor();

    if (cajaDeTextoIngresoUsuario) {
        cajaDeTextoIngresoUsuario.addEventListener("input", () => {
            const textoQueVaEscribiendo = cajaDeTextoIngresoUsuario.value.trim().toLowerCase();
            
            contenedorDeSugerenciasFlotantes.innerHTML = "";
            
            if (textoQueVaEscribiendo.length === 0) {
                contenedorDeSugerenciasFlotantes.style.display = "none";
                return;
            }
            
            const listaDeUsuariosFiltrados = listaGlobalDeUsuariosRegistrados.filter(usuarioIndividual => 
                usuarioIndividual.nombre.startsWith(textoQueVaEscribiendo)
            );
            
            if (listaDeUsuariosFiltrados.length > 0) {
                contenedorDeSugerenciasFlotantes.style.display = "block";
                
                listaDeUsuariosFiltrados.forEach(usuarioEncontrado => {
                    const bloqueDeSugerencia = document.createElement("div");
                    bloqueDeSugerencia.className = "sugerencia-item";
                    bloqueDeSugerencia.textContent = usuarioEncontrado.nombre;
                    
                    bloqueDeSugerencia.addEventListener("click", () => {
                        cajaDeTextoIngresoUsuario.value = usuarioEncontrado.nombre;
                        contenedorDeSugerenciasFlotantes.style.display = "none";
                    });
                    
                    contenedorDeSugerenciasFlotantes.appendChild(bloqueDeSugerencia);
                });
            } else {
                contenedorDeSugerenciasFlotantes.style.display = "none";
            }
        });

        document.addEventListener("click", (eventoDeClicGeneral) => {
            if (eventoDeClicGeneral.target !== cajaDeTextoIngresoUsuario && eventoDeClicGeneral.target !== contenedorDeSugerenciasFlotantes) {
                contenedorDeSugerenciasFlotantes.style.display = "none";
            }
        });
    }
});