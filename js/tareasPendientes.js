import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

import { actualizarContadorTareasPendientes } from './contadorTareas.js';

import { verificarYRenovarToken } from './authToken.js';

// Obtener `idUsuario` desde el token
function getIdUsuarioFromToken() {
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar cursos
async function loadCursos() {

    showLoadingOverlay();

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) {
        hideLoadingOverlay();
        showNotification("No se encontró el ID del docente en el token.", "bg-red-500");
        return;
    }

    fetch(`${API_BASE_URL}/api/docente/${idDocente}/cursos`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingOverlay();
        const container = document.getElementById("cursosContainer");
        container.innerHTML = ""; 
        if (data.success && data.data.length > 0) {

            hideLoadingOverlay();

            const cursosList = document.getElementById("cursosContainer");
            cursosList.innerHTML = ""; 

            data.data.forEach(curso => {
                if (!curso.idCurso) {
                    hideLoadingOverlay();
                    console.warn("idCurso no está definido en el curso:", curso);
                    showNotification("Error: idCurso no existe para un curso", "bg-red-500");
                    return;
                }
            
                const courseCard = document.createElement("div");
                courseCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");
                courseCard.id = `curso-${curso.idCurso}`;
                courseCard.dataset.nombreCurso = curso.nombreCurso;
                courseCard.dataset.seccion = curso.seccion;
            
                courseCard.innerHTML = `
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso}</h3>
                            <p class="text-sm text-gray-600">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                        </div>
                        <div class="flex items-center space-x-2 mt-2 sm:mt-0">
                            <!-- Contador visible al lado del botón en pantallas grandes, y junto al texto en móviles -->
                            <span id="contador-${curso.nombreCurso}-${curso.seccion}" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold" style="display: none;">0</span>
                           <button onclick="seleccionarCurso(${curso.idCurso})" class="bg-black text-white px-3 py-1 rounded w-full sm:w-auto">Ver Módulos</button>
                        </div>
                    </div>
                `;
                container.appendChild(courseCard);
            });

            // Llamar a la función para actualizar el contador de tareas pendientes por curso
            actualizarContadorTareasPendientesPorCurso(idDocente);
        } else {
            hideLoadingOverlay();
            document.getElementById("cursosContainer").innerHTML = "<p class='text-center text-gray-600'>No hay cursos disponibles.</p>";
        }
    })
    .catch(error => {
        console.error("Error al cargar los cursos:", error);
        showNotification("Error al cargar los cursos", "bg-red-500");
        hideLoadingOverlay();
    });
}

async function actualizarContadorTareasPendientesPorCurso(idDocente) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/docente/${idDocente}/tareas-pendientes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.data.forEach(({ nombreCurso, seccion, tareas_pendientes }) => {
                const contadorElemento = document.getElementById(`contador-${nombreCurso}-${seccion}`);
                if (contadorElemento) {
                    if (tareas_pendientes > 0) {
                        contadorElemento.textContent = tareas_pendientes;
                        contadorElemento.style.display = "flex";
                    } else {
                        contadorElemento.textContent = "";
                        contadorElemento.style.display = "none";
                    }
                }
            });
        }
    })
    .catch(error => console.error("Error al obtener el contador de tareas pendientes por curso:", error));
}


// Función para marcar el curso seleccionado
function seleccionarCurso(idCurso) {
    // Remueve la clase 'curso-seleccionado' de cualquier otro curso
    document.querySelectorAll(".curso-seleccionado").forEach(element => {
        element.classList.remove("curso-seleccionado");
    });

    // Agrega la clase 'curso-seleccionado' al curso actualmente seleccionado
    const cursoSeleccionado = document.querySelector(`#curso-${idCurso}`);
    if (cursoSeleccionado) {
        cursoSeleccionado.classList.add("curso-seleccionado");
    }

    openModulosModal(idCurso);
}

async function loadModulos(idCurso) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    console.log("Cargando módulos para idCurso:", idCurso);
    if (!idCurso) {
        showNotification("Error: idCurso no está definido en loadModulos", "bg-red-500");
        return;
    }

    fetch(`${API_BASE_URL}/api/curso/${idCurso}/modulos`, {
        headers: { 'Authorization': `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
    })
    .then(response => response.json())
    .then(data => {
        const moduloContainer = document.getElementById("moduloContainer");
        moduloContainer.innerHTML = ""; 

        data.data.forEach(modulo => {
            const moduloCard = document.createElement("div");
            moduloCard.id = `modulo-${modulo.idModulo}`;
            moduloCard.dataset.nombreModulo = modulo.nombre;

            moduloCard.classList.add(
                "bg-gray-200",
                "rounded-lg",
                "shadow-md",
                "text-sm",
                "p-2",
                "sm:p-4",
                "mb-2",
                "sm:mb-4"
            );

            moduloCard.innerHTML = `
                <div class="flex flex-col h-full relative">
                    <span class="font-semibold text-xl mb-2">${modulo.nombre}</span>
                    <div class="flex justify-end items-center space-x-2 space-x-reverse mt-auto">
                        <span id="contador-${modulo.idModulo}" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold order-1" style="display: none;">0</span>
                        <button onclick="openTareasModal(${modulo.idModulo})" class="bg-black text-white px-4 py-2 rounded text-sm sm:text-base order-2">
                            Ver Tareas
                        </button>
                    </div>
                </div>
            `;

            // Llama a la función para cargar el contador de tareas pendientes por módulo
            cargarTareasPendientesPorModulo(modulo.idModulo, moduloCard);

            moduloContainer.appendChild(moduloCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los módulos:", error);
        showNotification("Error al cargar los módulos", "bg-red-500");
    });
}


async function cargarTareasPendientesPorModulo(idModulo, moduloCard) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/tareas-pendientes`, {
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tareasPendientes = data.tareasPendientes.length;

            // Verifica si tareasPendientes es mayor a 0 antes de crear el contador
            if (tareasPendientes > 0) {
                const contadorElemento = document.createElement("span");
                contadorElemento.classList.add("bg-red-500", "text-white", "rounded-full", "w-6", "h-6", "flex", "items-center", "justify-center", "text-xs", "font-bold");
                contadorElemento.textContent = tareasPendientes; // Solo el número
                
                // Insertar el contador junto al botón de "Ver Tareas"
                const buttonContainer = moduloCard.querySelector(".flex.justify-end.items-center.space-x-2");
                buttonContainer.appendChild(contadorElemento);
            }
        }
    })
    .catch(
        error => console.error("Error al obtener tareas pendientes para el módulo:", error

    ));
}

function openModulosModal(idCurso) {
    console.log("Abriendo modal para idCurso:", idCurso);
    if (!idCurso) {
        showNotification("Error: idCurso no está definido en openModulosModal", "bg-red-500");
        return;
    }

    const curso = document.querySelector(`#curso-${idCurso}`);
    const nombreCurso = curso ? curso.dataset.nombreCurso : "";
    const seccion = curso ? curso.dataset.seccion : "";

    const materialModal = document.getElementById("materialModal");
    if (materialModal) {
        materialModal.dataset.nombreCurso = nombreCurso;
        materialModal.dataset.seccion = seccion;
    }

    loadModulos(idCurso);
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "block";
}

async function openTareasModal(idModulo) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const tareasContainer = document.getElementById("tareasContainer");
    tareasContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar nuevas tareas
    console.log("Token:", token);

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/tareas`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        data.tareas.forEach(tarea => {
            const tareaCard = document.createElement("div");
            tareaCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");

            // Utiliza el nombre completo del estudiante
            const nombreEstudiante = tarea.usuario && tarea.usuario.nombre_completo ? tarea.usuario.nombre_completo : "Estudiante Desconocido";
            
            tareaCard.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800">${nombreEstudiante}</h3>
                <p class="text-sm text-gray-600">Actividad: ${tarea.actividad.titulo}</p>
                <a href="${API_BASE_URL}/storage/${tarea.ruta}" target="_blank" class="text-blue-500 underline">Ver Archivo</a>
                <input type="text" id="nota-${tarea.idTarea}" placeholder="Calificación" class="mt-2 p-2 border rounded w-full"/>
                <button onclick="revisarTarea(${tarea.idTarea})" class="bg-green-500 text-white px-3 py-1 rounded mt-2">Marcar como Revisado</button>
            `;
            tareasContainer.appendChild(tareaCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar las tareas:", error);
        showNotification("Error al cargar las tareas", "bg-red-500");
    })
    .finally(()=>{
         // Ocultar el loader después de la operación
         document.getElementById("loadingScreen").classList.add("hidden");
    });

    const modal = document.getElementById("tareasModal");
    if (modal) modal.style.display = "block";
}

function closeTareasModal() {
    const modal = document.getElementById("tareasModal");
    if (modal) modal.style.display = "none";
}

async function revisarTarea(idTarea) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    const nota = document.getElementById(`nota-${idTarea}`).value;
    const idDocente = getIdUsuarioFromToken();

    // Mostrar el "loading screen" antes de enviar el anuncio
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/tarea/revisar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idTarea, nota })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
            showNotification("Tarea revisada correctamente", "bg-green-500");

            // Espera 2 segundos para que el usuario vea la notificación, luego recarga la página
            setTimeout(() => {
                location.reload();
            }, 1000); // Espera 2 segundos antes de recargar
        } else {
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification("Error al revisar la tarea", "bg-red-500");
        }
    })
    .catch(error => {
        console.error("Error al revisar la tarea:", error);
        showNotification("Error al revisar la tarea", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}


// Cerrar modal de módulos
function closeModulosModal() {
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "none";
}


// Función para mostrar notificaciones
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => { 
        notification.style.display = "none"; 
    }, 5000); // Ocultar después de 5 segundos
}



// Cargar cursos al iniciar la página
document.addEventListener("DOMContentLoaded", loadCursos);

// Hacer funciones accesibles en el ámbito global
window.openModulosModal = openModulosModal;
window.closeModulosModal = closeModulosModal;
window.seleccionarCurso = seleccionarCurso; // Añadir esta línea
window.openTareasModal = openTareasModal;
window.closeTareasModal = closeTareasModal;
window.revisarTarea = revisarTarea;