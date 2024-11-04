import API_BASE_URL from './urlHelper.js';

// Obtener el token JWT desde el localStorage
const token = localStorage.getItem("jwt");

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
function asignarAulaDocente() {
    const idDocente = document.getElementById("idDocente").value;
    const idAula = document.getElementById("idAula").value;

    if (!idDocente || !idAula) {
        showNotification("Seleccione un docente y un aula para realizar la asignación.", "bg-red-500");
        return;
    }

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
            listarAsignaciones(); // Refresca la lista de asignaciones
            showNotification(data.message, "bg-green-500");
        } else {
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Función para cargar docentes en el select
function cargarDocentes() {
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
function cargarGrados() {
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

// Función para listar todas las asignaciones
function listarAsignaciones() {
    fetch(`${API_BASE_URL}/api/asignaciones`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("asignacionesContainer");
        container.innerHTML = ""; // Limpiar asignaciones previas

        data.data.forEach(asignacion => {
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
    })
    .catch(error => {
        console.error('Error al listar asignaciones:', error);
        showNotification("Error al listar asignaciones", "bg-red-500");
    });
}

// Función para eliminar una asignación
function eliminarAsignacion(idAsignacion) {
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
            listarAsignaciones(); // Refresca la lista de asignaciones
            showNotification(data.message, "bg-green-500");
        } else {
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(error => {
        console.error('Error al eliminar asignación:', error);
        showNotification("Error al eliminar asignación", "bg-red-500");
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
