import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

// Función para decodificar el JWT y obtener el idUsuario
function getIdUsuarioFromToken() {
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar los cursos del docente
function loadCursos() {
    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) {
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
        const container = document.getElementById("cursosContainer");
        container.innerHTML = ""; // Limpiar contenido previo

        data.data.forEach(curso => {
            const courseCard = document.createElement("div");
            courseCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");

            // HTML estructurado para que el botón esté debajo en móviles y al costado en PC
            courseCard.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso}</h3>
                        <p class="text-sm text-gray-600 mb-2 sm:mb-0">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                    </div>
                    <button onclick="openAnuncioModal('${curso.nombreCurso}', '${curso.seccion}')" class="bg-black text-white px-3 py-1 rounded mt-2 sm:mt-0">Anunciar</button>
                </div>
            `;

            container.appendChild(courseCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los cursos:", error);
        showNotification("Error al cargar los cursos", "bg-red-500");
    });
}

// Función para abrir el modal de anuncio
function openAnuncioModal(nombreCurso, seccion) {
    const modal = document.getElementById("anuncioModal");
    modal.style.display = "block";

    modal.dataset.nombreCurso = nombreCurso;
    modal.dataset.seccion = seccion;
}

// Función para cerrar el modal de anuncio
function closeAnuncioModal() {
    document.getElementById("anuncioModal").style.display = "none";
}

// Función para enviar el anuncio usando los datos del modal
function enviarAnuncio() {
    const idDocente = getIdUsuarioFromToken();
    const modal = document.getElementById("anuncioModal");

    const nombreCurso = modal.dataset.nombreCurso;
    const seccion = modal.dataset.seccion;
    const descripcion = document.getElementById("modalDescripcion").value;

    fetch(`${API_BASE_URL}/api/anuncios`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombreCurso, seccion, descripcion, idDocente })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            closeAnuncioModal();
            showNotification(data.message, "bg-green-500");
        } else {
            showNotification("Error al crear el anuncio", "bg-red-500");
        }
    })
    .catch(error => {
        console.error('Error al enviar Anuncio:', error);
        showNotification("Error al enviar Anuncio", "bg-red-500");
    });
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

// Hacer funciones accesibles en el ámbito global
window.openAnuncioModal = openAnuncioModal;
window.closeAnuncioModal = closeAnuncioModal;
window.enviarAnuncio = enviarAnuncio;
