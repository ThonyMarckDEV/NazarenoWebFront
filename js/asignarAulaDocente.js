import API_BASE_URL from './urlHelper.js';

// Obtener el token JWT desde el localStorage
const token = localStorage.getItem("jwt");


import { verificarYRenovarToken } from './authToken.js';

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

// Función para asignar un aula a un docente seleccionado
async function asignarAulaDocente() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idDocente = document.getElementById("idDocente").value;
    const idAula = document.getElementById("idAula").value;

    if (!idDocente || !idAula) {
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
        showNotification("Seleccione un docente y un aula para realizar la asignación.", "bg-red-500");
        return;
    }

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/docente/asignar-aula`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idDocente, idAula })
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
            listarAsignaciones(); // Refresca la lista de asignaciones
            showNotification(data.message, "bg-green-500");
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
    .catch(error => {
        console.error('Error:', error);
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
        showNotification("Error en la solicitud", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para cargar docentes en el select
async function cargarDocentes() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarDocentes`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const docenteSelect = document.getElementById("idDocente");
        docenteSelect.innerHTML = "<option value=''>Seleccione un docente</option>"; // Limpiar opciones previas

        data.data.forEach(docente => {
            const option = document.createElement("option");
            option.value = docente.idUsuario;
            option.textContent = docente.nombreCompleto; // Usar nombreCompleto en lugar de username
            docenteSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar docentes:', error);
        showNotification("Error al cargar docentes", "bg-red-500");
    });
}

// Función para cargar grados en el select
async function cargarGrados() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarGrados`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const gradoSelect = document.getElementById("idAula");
        gradoSelect.innerHTML = "<option value=''>Seleccione un aula</option>"; // Limpiar opciones previas

        data.data.forEach(grado => {
            const option = document.createElement("option");
            option.value = grado.idGrado;
            option.textContent = `${grado.nombreGrado} - ${grado.seccion}`;
            gradoSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar grados:', error);
        showNotification("Error al cargar grados", "bg-red-500");
    });
}

// Variable global para almacenar las asignaciones
let asignaciones = [];

// Función para listar todas las asignaciones
async function listarAsignaciones() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();
    
    fetch(`${API_BASE_URL}/api/asignaciones`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        asignaciones = data.data; // Guardar las asignaciones en la variable global
        renderAsignacionesTable(asignaciones); // Renderizar la tabla con todas las asignaciones

        // Añadir evento al campo de búsqueda
        const searchInput = document.getElementById("searchAsignacionesInput");
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredAsignaciones = asignaciones.filter(asignacion => {
                return (
                    asignacion.idAsignacion.toString().includes(searchTerm) ||
                    asignacion.nombreDocente.toLowerCase().includes(searchTerm) ||
                    asignacion.nombreAula.toLowerCase().includes(searchTerm) ||
                    asignacion.seccion.toLowerCase().includes(searchTerm)
                );
            });
            renderAsignacionesTable(filteredAsignaciones);
        });
    })
    .catch(error => {
        console.error('Error al listar asignaciones:', error);
        showNotification("Error al listar asignaciones", "bg-red-500");
    });
}

// Función para renderizar la tabla de asignaciones
function renderAsignacionesTable(asignacionesList) {
    const container = document.getElementById("asignacionesContainer");
    container.innerHTML = ""; // Limpiar asignaciones previas

    asignacionesList.forEach(asignacion => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border-b">${asignacion.idAsignacion}</td>
            <td class="p-3 border-b">${asignacion.nombreDocente}</td>
            <td class="p-3 border-b">${asignacion.nombreAula} - ${asignacion.seccion}</td>
            <td class="p-3 border-b text-center">
                <button onclick="eliminarAsignacion(${asignacion.idAsignacion})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
            </td>
        `;

        container.appendChild(row);
    });
}

// Inicializar la carga de asignaciones al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    listarAsignaciones();
});


// Función para eliminar una asignación
async function eliminarAsignacion(idAsignacion) {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/docente/asignacion/${idAsignacion}`, {
        method: 'DELETE',
        headers: 
        {
             'Authorization': `Bearer ${token}` ,
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
            listarAsignaciones(); // Refresca la lista de asignaciones
            showNotification(data.message, "bg-green-500");
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
    .catch(error => {
        console.error('Error al eliminar asignación:', error);
        //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
        showNotification("Error al eliminar asignación", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Ejecutar funciones de carga al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarDocentes();
    cargarGrados();
    listarAsignaciones();
});

// Hacer las funciones accesibles globalmente
window.asignarAulaDocente = asignarAulaDocente;
window.eliminarAsignacion = eliminarAsignacion;
