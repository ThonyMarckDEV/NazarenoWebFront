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
                            Ver Materiales y Actividades
                        </button>
                    </div>
                </div>
            `;
        // <div class="flex flex-col h-full relative">
        //     <span class="font-semibold text-xl mb-2">${modulo.nombre}</span>
        //      <div class="flex justify-end items-center space-x-2 space-x-reverse mt-auto">
        //         <button onclick="openMaterialActividadModal(${modulo.idModulo}, '${nombreCurso}', '${seccion}', '${modulo.nombre}')"
        //             class="bg-black text-white px-4 py-2 rounded text-sm sm:text-base order-2">
        //             Ver Materiales y Actividades
        //         </button>
        //     </div>
        // </div>
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


function loadMaterialesYActividades(idModulo, nombreCurso, seccion, nombreModulo) {
    const idUsuario = getIdUsuarioFromToken();
    const materialContainer = document.getElementById("materialContainer");
    const actividadContainer = document.getElementById("actividadContainer");

    if (!materialContainer || !actividadContainer) {
        console.error("Los contenedores de materiales y actividades no están en el DOM.");
        return;
    }

    materialContainer.innerHTML = "<h3 class='font-semibold text-lg mb-2'>Materiales:</h3>";
    actividadContainer.innerHTML = "<h3 class='font-semibold text-lg mb-2'>Actividades:</h3>";

    // Cargar materiales
    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/materiales`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(material => {
            const materialCard = document.createElement("div");
            materialCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "mb-4", "flex", "items-center", "justify-between", "border", "border-gray-300");

            const extensionArchivo = material.ruta.split('.').pop();
            const nombreConExtension = `${material.nombre}.${extensionArchivo}`;
            const rutaCompletaMaterial = `${API_BASE_URL}/api/descargar/${encodeURIComponent(material.ruta)}`;

            materialCard.innerHTML = `
                <div class="flex items-center space-x-4">
                    <span class="font-semibold text-gray-800">${nombreConExtension}</span>
                </div>
                <button onclick="descargarArchivo('${rutaCompletaMaterial}', '${nombreConExtension}')" class="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded sm:px-3 sm:py-1 sm:text-sm lg:text-base lg:px-4 lg:py-2 lg:justify-center lg:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v4h16v-4m-8-8v10m0 0L8 12m4 4l4-4" />
                    </svg>
                    <span class="hidden sm:inline ml-2">Descargar</span>
                </button>
            `;
            materialContainer.appendChild(materialCard);
        });
    })
    .catch(error => console.error("Error al cargar los materiales:", error));

    // Cargar actividades con verificación de estado
    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/actividades`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(actividad => {
            const actividadCard = document.createElement("div");
            actividadCard.classList.add("bg-gray-100", "rounded-lg", "shadow-md", "p-4", "mb-4");

            // Llamar a la API para verificar el estado de la tarea
            fetch(`${API_BASE_URL}/api/verificar-estado-actividad`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idUsuario, idActividad: actividad.idActividad })
            })
            .then(response => response.json())
            .then(estado => {
                let botonTarea = `<button onclick="subirTarea(${actividad.idActividad})" class="bg-black text-white px-3 py-1 rounded mt-2">Subir Tarea</button>`;

                if (!estado.success) {
                    showNotification("Error al verificar el estado de la actividad", "bg-red-500");
                } else if (estado.tareaSubida) {
                    botonTarea = `<p class="text-green-500 font-semibold mt-2">Tarea subida</p>`;
                } else if (estado.fechaExpirada) {
                    botonTarea = `<p class="text-red-500 font-semibold mt-2">Fecha de vencimiento expirada</p>`;
                }

                actividadCard.innerHTML = `
                    <h3 class="font-semibold text-gray-800">${actividad.titulo}</h3>
                    <p class="text-gray-700">${actividad.descripcion}</p>
                    <p class="text-sm text-gray-600"><strong>Fecha de Entrega:</strong> ${actividad.fecha_vencimiento}</p>
                    <p class="text-sm text-gray-600"><strong>Nota:</strong> ${actividad.nota || "No asignada"}</p>
                    ${botonTarea}
                `;
                actividadContainer.appendChild(actividadCard);
            })
            .catch(error => {
                console.error("Error al verificar el estado de la tarea:", error);
                showNotification("Error al verificar el estado de la tarea", "bg-red-500");
            });
        });
    })
    .catch(error => console.error("Error al cargar las actividades:", error));
}

// Función para descargar el archivo desde la API de descarga
function descargarArchivo(url, nombreArchivo) {

      // Mostrar el loader al enviar el formulario
      document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la descarga del archivo");
        }
        return response.blob();
    })
    .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.click();
    })
    .catch(
        error => console.error("Error en la descarga:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

let idModulo, nombreCurso, seccion, nombreModulo;

function openMaterialActividadModal(moduloId, cursoNombre, cursoSeccion, moduloNombre) {
    idModulo = moduloId;
    nombreCurso = cursoNombre;
    seccion = cursoSeccion;
    nombreModulo = moduloNombre;

    loadMaterialesYActividades(idModulo, nombreCurso, seccion, nombreModulo);
    const modal = document.getElementById("moduloModal");
    if (modal) modal.style.display = "block";
}

// Cerrar modal de materiales y actividades
function closeMaterialActividadModal() {
    const modal = document.getElementById("moduloModal");
    if (modal) modal.style.display = "none";
}



let actividadSeleccionada = null;

function subirTarea(idActividad) {
    actividadSeleccionada = idActividad; // Guardar la actividad actual
    const modal = document.getElementById("subirTareaModal");
    if (modal) modal.style.display = "block";
}

function cerrarSubirTareaModal() {
    const modal = document.getElementById("subirTareaModal");
    if (modal) modal.style.display = "none";
    document.getElementById("archivoTarea").value = ""; // Limpiar selección de archivo
}

function enviarTarea() {
    const archivo = document.getElementById("archivoTarea").files[0];
    const idUsuario = getIdUsuarioFromToken();

    if (!archivo) {
        showNotification("Selecciona un archivo para subir", "bg-red-500");
        return;
    }

    if (!idUsuario || !actividadSeleccionada) {
        showNotification("Datos de usuario o actividad no encontrados", "bg-red-500");
        return;
    }

    const formData = new FormData();
    formData.append('idUsuario', idUsuario);
    formData.append('idActividad', actividadSeleccionada);
    formData.append('archivo', archivo);

         // Mostrar el loader al enviar el formulario
         document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/subir-tarea`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
    })
    .then(data => {
        cerrarSubirTareaModal(); // Cierra el modal primero
        showNotification(data.message, "bg-green-500"); // Luego muestra la notificación

        // Llama a loadMaterialesYActividades para actualizar el estado de las actividades
        loadMaterialesYActividades(idModulo, nombreCurso, seccion, nombreModulo);
    })
    .catch(error => {
        console.error("Error al subir tarea:", error);
        showNotification("Error al subir tarea", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
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
window.subirTarea = subirTarea;
window.descargarArchivo = descargarArchivo;
window.enviarTarea = enviarTarea;
window.cerrarSubirTareaModal = cerrarSubirTareaModal;