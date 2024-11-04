import API_BASE_URL from './urlHelper.js';

// Obtener el token JWT del localStorage
const token = localStorage.getItem("jwt");

function loadEstudiantes() {
    fetch(`${API_BASE_URL}/api/listarEstudiantes`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("estudiante");
        select.innerHTML = ''; 

        data.data.forEach(estudiante => {
            const option = document.createElement("option");
            option.value = estudiante.idUsuario;
            option.textContent = estudiante.username;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar estudiantes:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

function loadGrados() {
    fetch(`${API_BASE_URL}/api/listarGradosCupos`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("grado");
        select.innerHTML = '';

        data.data.forEach(grado => {
            const option = document.createElement("option");
            option.value = grado.idGrado;
            option.textContent = `${grado.nombreGrado} - Cupos: ${grado.cupos}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar grados:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Listar matriculas
function listMatriculas() {
    fetch(`${API_BASE_URL}/api/listarMatriculas`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const matriculasTableBody = document.getElementById("matriculasTableBody");
        matriculasTableBody.innerHTML = ""; // Limpiar contenido anterior
        data.data.forEach(matricula => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-3 border-b">${matricula.idMatricula}</td>
                <td class="p-3 border-b">${matricula.usuario.username}</td>
                <td class="p-3 border-b">${matricula.grado.nombreGrado}</td>
                <td class="p-3 border-b">${matricula.fechaMatricula}</td>
                <td class="p-3 border-b">
                    <button onclick="eliminarMatricula(${matricula.idMatricula})" 
                        class="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                </td>
            `;
            matriculasTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al cargar matriculas:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Eliminar matricula con token
function eliminarMatricula(idMatricula) {
    fetch(`${API_BASE_URL}/api/eliminarMatricula/${idMatricula}`, {
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
            showNotification(data.message, "bg-green-500");
            listMatriculas(); // Recargar lista de matriculas
            loadGrados(); 
        } else {
            showNotification(data.message || "Error al eliminar matrícula", "bg-red-500");
        }
    })
    .catch(error => {
        console.error("Error al eliminar matrícula:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Matricular estudiante con token
function submitMatricula() {
    const idUsuario = document.getElementById("estudiante").value;
    const idGrado = document.getElementById("grado").value;

    fetch(`${API_BASE_URL}/api/matricularEstudiante`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        },
        body: JSON.stringify({ idUsuario, idGrado })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, data.success ? "bg-green-500" : "bg-red-500");
        if (data.success) {
            loadGrados(); 
            listMatriculas(); // Recargar lista de matriculas
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Mostrar notificación en pantalla
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";
    setTimeout(() => { notification.style.display = "none"; }, 5000);
}

// Cargar estudiantes y grados al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    loadEstudiantes();
    loadGrados();
    listMatriculas();
});

// Asegurarte de que la función esté en el ámbito global
window.submitMatricula = submitMatricula;
window.eliminarMatricula = eliminarMatricula;
