import API_BASE_URL from './urlHelper.js';

// Obtener el JWT desde el localStorage en el ámbito global
const token = localStorage.getItem("jwt");

function submitSpecialtyForm() {
    const form = document.getElementById("specialtyForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/agregarEspecialidad`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Especialidad registrada exitosamente", "bg-green-500");
            form.reset();
            listEspecialidades();
        } else {
            showNotification(data.message || "Error al registrar especialidad", "bg-red-500");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Variable global para almacenar las especialidades
let especialidades = [];

// Función para listar las especialidades
function listEspecialidades() {

    fetch(`${API_BASE_URL}/api/listarEspecialidades`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        especialidades = data.data; // Guardamos las especialidades en la variable global
        renderEspecialidadesTable(especialidades); // Renderizamos la tabla con todas las especialidades

        // Añadimos el evento al campo de búsqueda
        const searchInput = document.getElementById("searchEspecialidadesInput");
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredEspecialidades = especialidades.filter(especialidad => {
                return especialidad.nombreEspecialidad.toLowerCase().includes(searchTerm);
            });
            renderEspecialidadesTable(filteredEspecialidades);
        });
    })
    .catch(error => {
        console.error("Error al cargar especialidades:", error);
        showNotification("Error al cargar especialidades", "bg-red-500");
    });
}

// Función para renderizar la tabla de especialidades
function renderEspecialidadesTable(especialidadesList) {
    const especialidadesTableBody = document.getElementById("especialidadesTableBody");
    especialidadesTableBody.innerHTML = ""; // Limpiar el contenido anterior
    especialidadesList.forEach(especialidad => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-3 border-b">${especialidad.idEspecialidad}</td>
            <td class="p-3 border-b">${especialidad.nombreEspecialidad}</td>
            <td class="p-3 border-b">
                <button onclick="eliminarEspecialidad(${especialidad.idEspecialidad})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
            </td>
        `;
        especialidadesTableBody.appendChild(row);
    });
}

// Función para eliminar una especialidad
function eliminarEspecialidad(idEspecialidad) {

    // Mostrar el loader al enviar el formulario
     document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarEspecialidad/${idEspecialidad}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, data.success ? "bg-green-500" : "bg-red-500");
        if (data.success) {
            listEspecialidades(); // Refrescar la lista de especialidades
        }
    })
    .catch(error => {
        console.error("Error al eliminar especialidad:", error);
        showNotification("Error al eliminar especialidad", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
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

// Cargar la lista de especialidades al iniciar la página
document.addEventListener("DOMContentLoaded", listEspecialidades);

// Exportar funciones para hacerlas accesibles globalmente
window.submitSpecialtyForm = submitSpecialtyForm;
window.eliminarEspecialidad = eliminarEspecialidad;
