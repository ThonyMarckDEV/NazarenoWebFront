import API_BASE_URL from './urlHelper.js';

// Obtener el token JWT desde el localStorage
const token = localStorage.getItem("jwt");

// Función para cargar especialidades
function loadEspecialidades() {
    fetch(`${API_BASE_URL}/api/listarEspecialidades`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("especialidad");
        select.innerHTML = ''; // Limpiar opciones anteriores

        data.data.forEach(especialidad => {
            const option = document.createElement("option");
            option.value = especialidad.idEspecialidad;
            option.textContent = especialidad.nombreEspecialidad;
            select.appendChild(option);
        });
    })
    .catch(error => console.error("Error al cargar especialidades:", error));
}

// Función para cargar docentes
function loadDocentes() {
    fetch(`${API_BASE_URL}/api/listarDocentes`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("docente");
        select.innerHTML = ''; // Limpiar opciones anteriores

        data.data.forEach(docente => {
            const option = document.createElement("option");
            option.value = docente.idUsuario;
            option.textContent = docente.nombreCompleto; // Usar el nombre completo
            select.appendChild(option);
        });
    })
    .catch(error => console.error("Error al cargar docentes:", error));
}

// Función para asignar especialidad a docente (con token)
function asignarEspecialidad() {

    const idEspecialidad = document.getElementById("especialidad").value;
    const idDocente = document.getElementById("docente").value;

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/asignarEspecialidadDocente`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        },
        body: JSON.stringify({ idEspecialidad, idDocente })
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
            showNotification("Asignación realizada con éxito", "bg-green-500");
            loadAsignaciones(); // Recargar lista de asignaciones
        } else {
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al asignar especialidad:", error

    ))    
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para cargar asignaciones de especialidades a docentes
function loadAsignaciones() {
    fetch(`${API_BASE_URL}/api/listarAsignacionesDocente`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("asignacionesTableBody");
        tableBody.innerHTML = ''; // Limpiar las asignaciones previas

        data.data.forEach(asignacion => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-3 border-b">${asignacion.id}</td>
                <td class="p-3 border-b">${asignacion.docente}</td>
                <td class="p-3 border-b">${asignacion.especialidad}</td>
                <td class="p-3 border-b">
                    <button onclick="eliminarAsignacion(${asignacion.id})" class="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error al cargar asignaciones:", error));
}

// Función para eliminar una asignación (con token)
function eliminarAsignacion(id) {

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarAsignacionDocente/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
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
            showNotification("Asignación eliminada exitosamente", "bg-green-500");
            loadAsignaciones(); // Recargar la lista después de eliminar
        } else {
            //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification(data.message || "Error al eliminar asignación", "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al eliminar asignación:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para mostrar notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Cargar las funciones al inicio
document.addEventListener("DOMContentLoaded", () => {
    loadEspecialidades();
    loadDocentes();
    loadAsignaciones();
});

// Hacer las funciones accesibles globalmente
window.asignarEspecialidad = asignarEspecialidad;
window.eliminarAsignacion = eliminarAsignacion;
