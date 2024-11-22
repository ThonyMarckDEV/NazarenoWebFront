import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem("jwt");
// Obtener el id del usuario desde el token
export function getIdUsuarioFromToken() {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar los cursos del alumno
async function loadCursos() {

    const token = localStorage.getItem("jwt");

    showLoadingOverlay();

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idUsuario = getIdUsuarioFromToken();
    if (!idUsuario) {
        hideLoadingOverlay();
        showNotification("No se encontró el ID del estudiante en el token.", "bg-red-500");
        return;
    }

    fetch(`${API_BASE_URL}/api/estudiante/${idUsuario}/cursos`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const cursosList = document.getElementById("cursosContainer");
        if (!cursosList) {
            console.error("El contenedor de cursos no está en el DOM.");
            hideLoadingOverlay();
            return;
        }
        cursosList.innerHTML = "";

        if (data.success && data.data.length > 0) {
            hideLoadingOverlay();

            data.data.forEach(curso => {
                const courseCard = document.createElement("div");
                courseCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");

                courseCard.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso} - ${curso.seccion}</h3>
                        <p class="text-sm text-gray-600 mb-2">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                    </div>
                    <div class="flex items-center space-x-2 mt-2 sm:mt-0">
                     <!-- Contador visible al lado del botón en pantallas grandes, y junto al texto en móviles -->
                        <span id="contador-${curso.nombreCurso}-${curso.seccion}" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold" style="display: none;">0</span>
                        <button onclick="openModuloModal(${curso.idCurso}, '${curso.nombreCurso}', '${curso.seccion}')" class="bg-black text-white px-3 py-1 rounded">Ver Módulo</button>
                    </div>
                </div>
                `;

                cursosList.appendChild(courseCard);
            });
                   // Llamar a la función para actualizar el contador de tareas pendientes por curso
                   actualizarContadorCalificacionesRevisadasPorCurso(idUsuario);
        } else {
            hideLoadingOverlay();
            cursosList.innerHTML = "<p class='text-center text-gray-600'>No hay cursos disponibles.</p>";
        }
    })
    .catch(
        error => console.error("Error al cargar los cursos:", error

    ));
}

// Función para actualizar el contador de tareas revisadas por curso
async function actualizarContadorCalificacionesRevisadasPorCurso(idUsuario) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/tareas-revisadas-por-curso/${idUsuario}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.data.forEach(({ nombreCurso, seccion, tareas_revisadas }) => {
                const contadorElemento = document.getElementById(`contador-${nombreCurso}-${seccion}`);
                if (contadorElemento) {
                    if (tareas_revisadas > 0) {
                        contadorElemento.textContent = tareas_revisadas;
                        contadorElemento.style.display = "flex";
                    } else {
                        contadorElemento.style.display = "none";
                    }
                }
            });
        }
    })
    .catch(error => console.error("Error al obtener el contador de tareas revisadas por curso:", error));
}

async function loadModulos(idCurso, nombreCurso, seccion) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const moduloContainer = document.getElementById("moduloContainer");

    if (!idCurso || !moduloContainer) {
        console.error("El contenedor de módulos o idCurso no está definido.");
        return;
    }

    fetch(`${API_BASE_URL}/api/curso/${idCurso}/modulos`, {
        headers: { 'Authorization': `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
    })
    .then(response => response.json())
    .then(data => {
        moduloContainer.innerHTML = "";

        data.data.forEach(modulo => {
            const moduloCard = document.createElement("div");
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
            <div>
                <span class="font-semibold block">${modulo.nombre}</span>
                <div class="flex flex-row sm:flex-row space-x-2 mt-1 sm:mt-2">
                    <span id="contador-${modulo.idModulo}" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold order-1" style="display: none;">0</span>
                    <button onclick="openMaterialActividadModal(${modulo.idModulo}, '${nombreCurso}', '${seccion}', '${modulo.nombre}')" 
                        class="bg-black text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-base">
                        Ver Calificaciones
                    </button>
                </div>
            </div>
            `;

            // Obtener idUsuario y cargar el contador de tareas revisadas por módulo
            const idUsuario = getIdUsuarioFromToken();
            cargarCalificacionesRevisadasPorModulo(idUsuario, modulo.idModulo, moduloCard);
            moduloContainer.appendChild(moduloCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los módulos:", error);
        showNotification("Error al cargar los módulos", "bg-red-500");
    });
}
// Función para cargar el contador de tareas revisadas por módulo con logs
async function cargarCalificacionesRevisadasPorModulo(idUsuario, idModulo, moduloCard) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    console.log(`Cargando tareas revisadas para idUsuario: ${idUsuario}, idModulo: ${idModulo}`);

    fetch(`${API_BASE_URL}/api/tareas-revisadas-por-modulo/${idUsuario}/${idModulo}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tareasRevisadas = data.tareasRevisadas; // Asignamos aquí el valor correctamente
            console.log(`Total tareas revisadas para módulo ${idModulo}:`, tareasRevisadas);

            const contadorElemento = moduloCard.querySelector(`#contador-${idModulo}`);
            if (contadorElemento) {
                if (tareasRevisadas > 0) {
                    contadorElemento.textContent = tareasRevisadas;
                    contadorElemento.style.display = "flex";
                } else {
                    contadorElemento.style.display = "none";
                }
            } else {
                console.error(`No se encontró el elemento contador para idModulo: ${idModulo}`);
            }
        } else {
            console.error("La API no devolvió éxito al obtener tareas revisadas.");
        }
    })
    .catch(error => console.error("Error al obtener el contador de tareas revisadas por módulo:", error));
}

// Abrir el modal de módulos
function openModuloModal(idCurso, nombreCurso, seccion) {
    loadModulos(idCurso, nombreCurso, seccion);
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "block";
}

// Cerrar modal de módulos
function closeModulosModal() {
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "none";
}


async function openMaterialActividadModal(idModulo) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    const idUsuario = getIdUsuarioFromToken();
    if (!idUsuario) {
        showNotification("No se encontró el ID del usuario en el token.", "bg-red-500");
        return;
    }

    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/modulos/${idModulo}/calificaciones/${idUsuario}`, {
        headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    })
    .then(response => response.json())
    .then(data => {
        const actividadContainer = document.getElementById("actividadContainer");
        actividadContainer.innerHTML = ""; // Limpiar contenido anterior

        if (data.success && data.data.length > 0) {
            data.data.forEach(actividad => {
                const actividadElement = document.createElement("div");
                
                // Definir el color de fondo basado en la nota
                let bgColorClass = "bg-green-200";
                if (actividad.nota < 11) bgColorClass = "bg-red-200";
                else if (actividad.nota < 15) bgColorClass = "bg-yellow-200";

                actividadElement.classList.add("p-4", "rounded-lg", bgColorClass, "shadow-lg", "relative", "mb-4", "transform", "rotate-1");

                // Agregar botón solo si la tarea no ha sido vista
                const vistoButton = actividad.visto === 'no' ? `
                    <button onclick="marcarTareaComoVista(${actividad.idTarea}, ${idUsuario})" 
                            class="bg-blue-500 text-white px-3 py-1 rounded mt-2">Marcar como visto</button>
                ` : '';

                actividadElement.innerHTML = `
                    <div class="absolute top-1 left-1 h-4 w-4 bg-yellow-300 rounded-full shadow-lg"></div> 
                    <p class="font-semibold text-gray-800 mb-1">${actividad.titulo}</p>
                    <p class="text-gray-600 text-sm">Nota: <span class="font-bold ${actividad.color}">${actividad.nota}</span></p>
                    ${vistoButton}
                `;
                
                actividadContainer.appendChild(actividadElement);
            });
        } else {
            actividadContainer.innerHTML = "<p class='text-center text-gray-600'>No hay actividades con calificaciones disponibles.</p>";
        }

        const modal = document.getElementById("moduloModal");
        if (modal) modal.style.display = "block";
    })
    .catch(error => {
        console.error("Error al cargar las calificaciones:", error);
        showNotification("Error al cargar las calificaciones", "bg-red-500");
    })
    .finally(() => {
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}



// Función para marcar una tarea como vista y recargar el modal
async function marcarTareaComoVista(idTarea, idUsuario) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    fetch(`${API_BASE_URL}/api/tareas/${idTarea}/${idUsuario}/marcar-visto`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
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
            console.log("Tarea marcada como vista:", data.message);
            location.reload(); // Recarga la página si la tarea fue marcada como vista correctamente
        } else {
                        //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            console.error("Error al marcar tarea como vista:", data.message);
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error en la solicitud:", error)
        
    );
}

function closeMaterialActividadModal() {
    const modal = document.getElementById("moduloModal");
    if (modal) {
        modal.style.display = "none";
    }
}


function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");

    if (!notification) {
        console.error("Elemento de notificación no encontrado en el DOM");
        return;
    }

    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block"; // Asegurar que esté visible

    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

document.addEventListener("DOMContentLoaded", loadCursos);

window.openModuloModal = openModuloModal;
window.closeModulosModal = closeModulosModal;
window.openMaterialActividadModal = openMaterialActividadModal;
window.closeMaterialActividadModal = closeMaterialActividadModal;
// Hacer la función accesible globalmente
window.closeMaterialActividadModal = closeMaterialActividadModal;
window.marcarTareaComoVista = marcarTareaComoVista;