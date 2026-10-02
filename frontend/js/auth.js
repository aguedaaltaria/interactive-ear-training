// Definir la función globalmente de forma explícita y sin bucles complejos
window.mostrarBadgeUsuarioGlobal = function(nombre) {
    // Nivel 1 (Notas Cromáticas)
    const badgeNivel1 = document.getElementById("nombre-usuario-badge-nivel1");
    const indicadorNivel1 = document.getElementById("indicador-usuario-flotante-nivel1");
    if (badgeNivel1 && indicadorNivel1) {
        badgeNivel1.textContent = nombre;
        indicadorNivel1.classList.remove("oculto");
    }

    // Nivel 2 (Intervalos Simples)
    const badgeIntervalos = document.getElementById("nombre-usuario-badge-intervalos");
    const indicadorIntervalos = document.getElementById("indicador-usuario-flotante-intervalos");
    if (badgeIntervalos && indicadorIntervalos) {
        badgeIntervalos.textContent = nombre;
        indicadorIntervalos.classList.remove("oculto");
    }

    // Nivel 3 (Intervalos Compuestos)
    const badgeCompuestos = document.getElementById("nombre-usuario-badge-compuestos");
    const indicadorCompuestos = document.getElementById("indicador-usuario-flotante-compuestos");
    if (badgeCompuestos && indicadorCompuestos) {
        badgeCompuestos.textContent = nombre;
        indicadorCompuestos.classList.remove("oculto");
    }

    // Nivel 4 (Tríadas Simples)
    const badgeTriadas = document.getElementById("nombre-usuario-badge-triadas");
    const indicadorTriadas = document.getElementById("indicador-usuario-flotante-triadas");
    if (badgeTriadas && indicadorTriadas) {
        badgeTriadas.textContent = nombre;
        indicadorTriadas.classList.remove("oculto");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    let usuarioActualId = localStorage.getItem("ear_training_usuario_id");
    let usuarioActualNombre = localStorage.getItem("ear_training_usuario_nombre");

    const vistaUsuario = document.getElementById("vista-usuario");
    const menuNiveles = document.getElementById("menu-niveles");
    const inputUsuario = document.getElementById("input-usuario");
    const btnIngresar = document.getElementById("btn-ingresar");
    const mensajeErrorUsuario = document.getElementById("mensaje-error-usuario");
    const indicadorUsuarioFlotante = document.getElementById("indicador-usuario-flotante");
    const btnCambiarUsuario = document.getElementById("btn-cambiar-usuario");

    if (usuarioActualId && usuarioActualNombre) {
        if (vistaUsuario) vistaUsuario.classList.add("oculto");
        if (menuNiveles) menuNiveles.classList.remove("oculto");
        window.mostrarBadgeUsuarioGlobal(usuarioActualNombre);
        if (typeof cargarHistorial === "function") cargarHistorial();
    }

    if (btnCambiarUsuario) {
        btnCambiarUsuario.addEventListener("click", () => {
            localStorage.removeItem("ear_training_usuario_id");
            localStorage.removeItem("ear_training_usuario_nombre");
            
            document.querySelectorAll(".tarjeta-juego").forEach(v => v.classList.add("oculto"));
            if (menuNiveles) menuNiveles.classList.add("oculto");
            if (indicadorUsuarioFlotante) indicadorUsuarioFlotante.classList.add("oculto");
            if (vistaUsuario) vistaUsuario.classList.remove("oculto");
            if (inputUsuario) inputUsuario.value = "";
        });
    }

    if (btnIngresar) {
        btnIngresar.addEventListener("click", async () => {
            const nombreIngresado = inputUsuario.value.trim().toLowerCase();

            if (!nombreIngresado) {
                mensajeErrorUsuario.textContent = "⚠️ Por favor ingresa un nombre de usuario.";
                mensajeErrorUsuario.classList.remove("oculto");
                return;
            }

            if (nombreIngresado.includes(" ")) {
                mensajeErrorUsuario.textContent = "⚠️ El nombre de usuario no debe contener espacios.";
                mensajeErrorUsuario.classList.remove("oculto");
                return;
            }

            try {
                const respuesta = await fetch("http://localhost:5001/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombreIngresado })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    localStorage.setItem("ear_training_usuario_id", resultado.usuario_id);
                    localStorage.setItem("ear_training_usuario_nombre", resultado.nombre);

                    vistaUsuario.classList.add("oculto");
                    menuNiveles.classList.remove("oculto");
                    window.mostrarBadgeUsuarioGlobal(resultado.nombre);

                    if (typeof cargarHistorial === "function") cargarHistorial();
                } else {
                    mensajeErrorUsuario.textContent = `⚠️ ${resultado.error}`;
                    mensajeErrorUsuario.classList.remove("oculto");
                }
            } catch (error) {
                console.error("Error al registrar usuario:", error);
                mensajeErrorUsuario.textContent = "⚠️ Error al conectar con el servidor.";
                mensajeErrorUsuario.classList.remove("oculto");
            }
        });
    }

    // Autocompletado de usuarios
    const contenedorSugerencias = document.getElementById("sugerencias-usuarios");
    let listaUsuariosGlobal = [];

    async function cargarUsuariosExistentes() {
        try {
            const respuesta = await fetch("http://localhost:5001/api/usuarios");
            const resultado = await respuesta.json();
            if (respuesta.ok) listaUsuariosGlobal = resultado.usuarios;
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }
    cargarUsuariosExistentes();

    if (inputUsuario) {
        inputUsuario.addEventListener("input", () => {
            const textoEscrito = inputUsuario.value.trim().toLowerCase();
            contenedorSugerencias.innerHTML = "";
            if (textoEscrito.length === 0) {
                contenedorSugerencias.style.display = "none";
                return;
            }
            const filtrados = listaUsuariosGlobal.filter(u => u.nombre.startsWith(textoEscrito));
            if (filtrados.length > 0) {
                contenedorSugerencias.style.display = "block";
                filtrados.forEach(usuario => {
                    const divItem = document.createElement("div");
                    divItem.className = "sugerencia-item";
                    divItem.textContent = usuario.nombre;
                    divItem.addEventListener("click", () => {
                        inputUsuario.value = usuario.nombre;
                        contenedorSugerencias.style.display = "none";
                    });
                    contenedorSugerencias.appendChild(divItem);
                });
            } else {
                contenedorSugerencias.style.display = "none";
            }
        });

        document.addEventListener("click", (e) => {
            if (e.target !== inputUsuario && e.target !== contenedorSugerencias) {
                contenedorSugerencias.style.display = "none";
            }
        });
    }
});