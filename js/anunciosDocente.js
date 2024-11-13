import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

import { verificarYRenovarToken } from './authToken.js';

// Función para decodificar el JWT y obtener el idUsuario
function getIdUsuarioFromToken() {
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar los cursos del docente
async function loadCursos() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

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
        
           // HTML estructurado para que el enlace esté encima en móviles y al costado en pantallas grandes
            courseCard.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso}</h3>
                    <p class="text-sm text-gray-600 mb-2 sm:mb-0">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-2 sm:mt-0">
                    <button onclick="openEstudiantesModal(${curso.idCurso})" class="text-gray-500 hover:text-gray-600 text-sm sm:text-base mb-2 sm:mb-0 no-underline">
                        Estudiantes matriculados
                    </button>
                    <button onclick="openAnuncioModal('${curso.nombreCurso}', '${curso.seccion}')" class="bg-black text-white px-3 py-1 rounded">
                        Anunciar
                    </button>
                </div>
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
async function enviarAnuncio() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idDocente = getIdUsuarioFromToken();
    const modal = document.getElementById("anuncioModal");

    const nombreCurso = modal.dataset.nombreCurso;
    const seccion = modal.dataset.seccion;
    const descripcion = document.getElementById("modalDescripcion").value;

        // Mostrar el "loading screen" antes de enviar el anuncio
        document.getElementById("loadingScreen").classList.remove("hidden");


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
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
            showNotification(data.message, "bg-green-500");
        } else {
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification("Error al crear el anuncio", "bg-red-500");
        }
    })
    .catch(error => {
        console.error('Error al enviar Anuncio:', error);
            //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
        showNotification("Error al enviar Anuncio", "bg-red-500");
    })
    .finally(() => {
        // Ocultar el "loading screen" después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}

// Función asincrónica para cargar la foto de perfil
async function loadFotoPerfil(idUsuario) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    try {
        const response = await fetch(`${API_BASE_URL}/api/alumnos/${idUsuario}/foto-perfil`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Retorna la URL completa de la foto de perfil proporcionada por Laravel o null si no existe
        return data.data.perfil || null;
    } catch (error) {
        console.error("Error al cargar la foto de perfil:", error);
        return null; // En caso de error, regresa null sin ruta predeterminada
    }
}

// Función para abrir el modal de estudiantes matriculados
async function openEstudiantesModal(idCurso) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    const modal = document.getElementById("estudiantesModal");
    const estudiantesContainer = document.getElementById("estudiantesContainer");

    // Mostrar el "loading screen" antes de cargar estudiantes
    document.getElementById("loadingScreen").classList.remove("hidden");

    // Mostrar el modal
    modal.classList.remove("hidden");

    // Limpiar contenido previo
    estudiantesContainer.innerHTML = "<p class='text-center text-gray-600'>Cargando estudiantes...</p>";

    // Obtener idDocente desde el token
    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) {
        estudiantesContainer.innerHTML = "<p class='text-center text-red-500'>Error de autenticación.</p>";
        document.getElementById("loadingScreen").classList.add("hidden"); // Ocultar el loading screen en caso de error
        return;
    }

    // Realizar la petición a la API para obtener estudiantes
    fetch(`${API_BASE_URL}/api/cursos/${idCurso}/estudiantes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        estudiantesContainer.innerHTML = ""; // Limpiar el mensaje de carga

        if (data.success && data.data.length > 0) {
            // Crear una lista de promesas para cargar todas las fotos de perfil
            const cargarEstudiantes = data.data.map(async (estudiante) => {
                const estudianteCard = document.createElement("div");

                // Añadir clases para una disposición horizontal y tamaño adecuado
                estudianteCard.classList.add("flex", "items-center", "space-x-4", "p-2", "border-b");

                // Crear la imagen de perfil
                const perfilImg = document.createElement("img");
                perfilImg.classList.add("w-10", "h-10", "rounded-full", "object-cover", "cursor-pointer");
                perfilImg.alt = `${estudiante.nombreCompleto}`;

                // Obtener la foto de perfil del estudiante usando su idUsuario
                const fotoPerfil = await loadFotoPerfil(estudiante.idUsuario);
                perfilImg.src = fotoPerfil ? fotoPerfil : `${window.location.origin}/img/default-profile.jpg`;

                // Añadir evento para abrir la imagen en el modal ampliado
                perfilImg.onclick = () => openImageModal(perfilImg.src);

                // Crear el contenedor de información
                const infoContainer = document.createElement("div");
                infoContainer.classList.add("flex", "flex-col");

                // Añadir el nombre y el departamento
                const nombre = document.createElement("p");
                nombre.classList.add("text-sm", "sm:text-base", "font-semibold");
                nombre.textContent = estudiante.nombreCompleto;

                const departamento = document.createElement("p");
                departamento.classList.add("text-sm", "text-gray-600");
                departamento.textContent = estudiante.departamento;

                // Añadir los elementos al contenedor de información
                infoContainer.appendChild(nombre);
                infoContainer.appendChild(departamento);

                // Añadir la imagen y la información al contenedor de estudiante
                estudianteCard.appendChild(perfilImg);
                estudianteCard.appendChild(infoContainer);

                // Añadir la tarjeta al contenedor de estudiantes
                estudiantesContainer.appendChild(estudianteCard);
            });

            // Esperar a que todas las fotos de perfil de los estudiantes se hayan cargado
            return Promise.all(cargarEstudiantes);
        } else {
            estudiantesContainer.innerHTML = "<p class='text-center text-gray-600'>No hay estudiantes matriculados en este curso.</p>";
        }
    })
    .catch(error => {
        console.error("Error al obtener estudiantes:", error);
        estudiantesContainer.innerHTML = "<p class='text-center text-red-500'>Error al cargar los estudiantes.</p>";
    })
    .finally(() => {
        // Ocultar el "loading screen" después de que todos los estudiantes y sus fotos hayan cargado
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}

// Función para abrir el modal de imagen ampliada
function openImageModal(imageSrc) {
    document.getElementById("modalProfileImage").src = imageSrc;
    document.getElementById("imageModal").classList.remove("hidden");
}

// Función para cerrar el modal de imagen ampliada
function closeImageModal() {
    document.getElementById("imageModal").classList.add("hidden");
}

// Función para cerrar el modal de estudiantes matriculados
function closeEstudiantesModal() {
    document.getElementById("estudiantesModal").classList.add("hidden");
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
// Hacer las nuevas funciones accesibles globalmente
window.openEstudiantesModal = openEstudiantesModal;
window.closeEstudiantesModal = closeEstudiantesModal;
window.closeImageModal = closeImageModal;