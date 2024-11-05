import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

// Obtener el id del usuario desde el token
export function getIdUsuarioFromToken() {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar los cursos del alumno
function loadCursos() {
    const idUsuario = getIdUsuarioFromToken();
    if (!idUsuario) {
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
            return;
        }
        cursosList.innerHTML = "";

        if (data.success && data.data.length > 0) {
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
                        <button onclick="openModuloModal(${curso.idCurso}, '${curso.nombreCurso}', '${curso.seccion}')" class="bg-black text-white px-3 py-1 rounded">Ver Módulo</button>
                    </div>
                </div>
                `;

                cursosList.appendChild(courseCard);
            });
        } else {
            cursosList.innerHTML = "<p class='text-center text-gray-600'>No hay cursos disponibles.</p>";
        }
    })
    .catch(error => console.error("Error al cargar los cursos:", error));
}

function loadModulos(idCurso, nombreCurso, seccion) {
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
                        <button onclick="openMaterialActividadModal(${modulo.idModulo}, '${nombreCurso}', '${seccion}', '${modulo.nombre}')" 
                            class="bg-black text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-base">
                            Ver Calificaciones
                        </button>
                    </div>
                </div>
            `;
            moduloContainer.appendChild(moduloCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los módulos:", error);
        showNotification("Error al cargar los módulos", "bg-red-500");
    });
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


function openMaterialActividadModal(idModulo, nombreCurso, seccion, nombreModulo) {
    fetch(`${API_BASE_URL}/api/modulos/${idModulo}/calificaciones`, {
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
                let bgColorClass = "bg-green-200"; // Verde por defecto
                if (actividad.nota < 11) bgColorClass = "bg-red-200";
                else if (actividad.nota < 15) bgColorClass = "bg-yellow-200";

                actividadElement.classList.add("p-4", "rounded-lg", bgColorClass, "shadow-lg", "relative", "mb-4", "transform", "rotate-1");

                actividadElement.innerHTML = `
                    <div class="absolute top-1 left-1 h-4 w-4 bg-yellow-300 rounded-full shadow-lg"></div> <!-- Esquina simulando el pin -->
                    <p class="font-semibold text-gray-800 mb-1">${actividad.titulo}</p>
                    <p class="text-gray-600 text-sm">Nota: <span class="font-bold ${actividad.color}">${actividad.nota}</span></p>
                `;
                
                actividadContainer.appendChild(actividadElement);
            });
        } else {
            actividadContainer.innerHTML = "<p class='text-center text-gray-600'>No hay actividades con calificaciones disponibles.</p>";
        }

        // Mostrar el modal
        const modal = document.getElementById("moduloModal");
        if (modal) modal.style.display = "block";
    })
    .catch(error => {
        console.error("Error al cargar las calificaciones:", error);
    });
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