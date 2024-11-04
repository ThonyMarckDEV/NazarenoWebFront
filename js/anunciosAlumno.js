import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

import { actualizarContadorAnuncios } from './contadorAnuncios.js';

// Obtener el id del usuario desde el token
export function getIdUsuarioFromToken() {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar los cursos del alumno y actualizar el contador de anuncios no vistos por curso
function loadCursos() {
    const idUsuario = getIdUsuarioFromToken();
    if (!idUsuario) {
        showNotification("No se encontró el ID del estudiante en el token.", "bg-red-500");
        return;
    }

    // Obtener los cursos del alumno
    fetch(`${API_BASE_URL}/api/estudiante/${idUsuario}/cursos`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data.length > 0) {
            const cursosList = document.getElementById("cursosContainer");
            cursosList.innerHTML = ""; // Limpiar el contenedor antes de cargar los cursos

            data.data.forEach(curso => {
                const courseCard = document.createElement("div");
                courseCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");

                // Crear el contenido HTML del curso
                    courseCard.innerHTML = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso} - ${curso.seccion}</h3>
                            <!-- Texto de grado y sección, siempre visible -->
                            <p class="text-sm text-gray-600 mb-2">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                        </div>
                        <div class="flex items-center space-x-2 mt-2 sm:mt-0">
                            <!-- Contador visible al lado del botón en pantallas grandes, y junto al texto en móviles -->
                            <span id="contador-${curso.nombreCurso}-${curso.seccion}" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold" style="display: none;">0</span>
                            <button onclick="openAnuncioModal('${curso.nombreCurso}', '${curso.seccion}')" class="bg-black text-white px-3 py-1 rounded">Ver Anuncios</button>
                        </div>
                    </div>
                    `;

                cursosList.appendChild(courseCard);
            });

            // Llamar a la función para actualizar el contador de anuncios no vistos por curso
            actualizarContadorAnunciosPorCurso(idUsuario);
        } else {
            document.getElementById("cursosContainer").innerHTML = "<p class='text-center text-gray-600'>No hay cursos disponibles.</p>";
        }
    })
    .catch(error => console.error("Error al cargar los cursos:", error));
}

// Función para actualizar el contador de anuncios no vistos por curso
function actualizarContadorAnunciosPorCurso(idAlumno) {
    fetch(`${API_BASE_URL}/api/alumno/${idAlumno}/anuncios/no-vistos/por-curso`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.data.forEach(({ nombreCurso, seccion, cantidad }) => {
                const contadorElemento = document.getElementById(`contador-${nombreCurso}-${seccion}`);
                if (contadorElemento) {
                    // Mostrar el contador solo si hay anuncios no vistos
                    if (cantidad > 0) {
                        contadorElemento.textContent = cantidad;
                        contadorElemento.style.display = "flex";
                    } else {
                        contadorElemento.style.display = "none";
                    }
                }
            });
        }
    })
    .catch(error => console.error("Error al obtener el contador de anuncios no vistos por curso:", error));
}

// Función para abrir el modal de anuncios
function openAnuncioModal(nombreCurso, seccion) {
    const idAlumno = getIdUsuarioFromToken();
    document.getElementById("cursoNombre").textContent = `${nombreCurso} - ${seccion}`;
    const modal = document.getElementById("anuncioModal");
    modal.style.display = "flex";

    // Llamada a la API para obtener los anuncios no vistos del alumno para el curso y sección especificados
    fetch(`${API_BASE_URL}/api/cursos/${nombreCurso}/seccion/${seccion}/anuncios?idAlumno=${idAlumno}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("anunciosContainer");
        container.innerHTML = "";

        if (data.success && data.data.length > 0) {
            data.data.forEach(anuncio => {
                const anuncioElement = document.createElement("div");
                anuncioElement.classList.add("mb-4", "p-3", "bg-gray-200", "rounded");
                anuncioElement.id = `anuncio-${anuncio.idAnuncio}`;

                anuncioElement.innerHTML = `
                    <p><strong>Docente:</strong> ${anuncio.docente}</p>
                    <p><strong>Descripción:</strong> ${anuncio.descripcion}</p>
                    <p><strong>Fecha:</strong> ${anuncio.fecha} ${anuncio.hora}</p>
                    <button onclick="marcarRevisado(${anuncio.idAnuncio})" class="bg-black text-white px-3 py-1 rounded mt-2">Revisar</button>
                `;
                container.appendChild(anuncioElement);
            });
        } else {
            container.innerHTML = "<p class='text-center text-gray-600'>No hay anuncios disponibles.</p>";
        }
    })
    .catch(error => {
        console.error("Error al cargar los anuncios:", error);
    });
}

// Función para marcar un anuncio como revisado
function marcarRevisado(idAnuncio) {
    const idUsuario = getIdUsuarioFromToken();

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/anuncios/${idAnuncio}/revisar`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idAnuncio: idAnuncio, idAlumno: idUsuario })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Eliminar el anuncio del DOM sin recargar la página
            const anuncioElement = document.getElementById(`anuncio-${idAnuncio}`);
            if (anuncioElement) {
                anuncioElement.remove();
            }
            // Llamar a la función para actualizar el contador de anuncios no vistos
            actualizarContadorAnunciosPorCurso(idUsuario);
            actualizarContadorAnuncios();
                // Recargar la página para reflejar los cambios
                location.reload();
        } else {
            alert("No se pudo marcar el anuncio como revisado.");
        }
    })
    .catch(error => {
        console.error("Error al marcar el anuncio como revisado:", error);
        alert("Hubo un problema al intentar marcar el anuncio como revisado.");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para cerrar el modal de anuncio
function closeAnuncioModal() {
    document.getElementById("anuncioModal").style.display = "none";
}

// Función para mostrar la notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Llamada para cargar los cursos al cargar la página
document.addEventListener("DOMContentLoaded", loadCursos);

// Hacer que las funciones estén disponibles en el ámbito global
window.openAnuncioModal = openAnuncioModal;
window.closeAnuncioModal = closeAnuncioModal;
window.marcarRevisado = marcarRevisado;
