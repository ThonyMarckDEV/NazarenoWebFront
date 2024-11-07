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
            option.textContent = estudiante.nombre_completo; // Usamos 'nombre_completo'
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar estudiantes:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

function loadGrados() {
    const gradoSelect = document.getElementById("grado");
    if (!gradoSelect) {
        console.error("Error: El elemento con ID 'grado' no se encuentra en el DOM.");
        return;
    }

    fetch(`${API_BASE_URL}/api/listarGradosCupos`, {
        method: "GET",
        headers: { 
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true"
        }
    })
    .then(response => response.json())
    .then(data => {
        gradoSelect.innerHTML = "<option value=''>Seleccione un aula</option>"; // Limpiar opciones previas

        data.data.forEach(grado => {
            const option = document.createElement("option");
            option.value = grado.idGrado;
            // Mostrar grado, sección y cupos en cada opción del select
            option.textContent = `${grado.nombreGrado} - Sección: ${grado.seccion} - Cupos: ${grado.cupos}`;
            gradoSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar grados:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Variable global para almacenar las matrículas
let matriculas = [];

// Función para listar todas las matrículas
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
        matriculas = data.data; // Guardar las matrículas en la variable global
        renderMatriculasTable(matriculas); // Renderizar la tabla con todas las matrículas

        // Añadir evento al campo de búsqueda
        const searchInput = document.getElementById("searchMatriculasInput");
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredMatriculas = matriculas.filter(matricula => {
                return (
                    matricula.idMatricula.toString().includes(searchTerm) ||
                    matricula.nombre_completo.toLowerCase().includes(searchTerm) ||
                    matricula.grado.nombreGrado.toLowerCase().includes(searchTerm) ||
                    matricula.grado.seccion.toLowerCase().includes(searchTerm) ||
                    matricula.fechaMatricula.toLowerCase().includes(searchTerm)
                );
            });
            renderMatriculasTable(filteredMatriculas);
        });
    })
    .catch(error => {
        console.error("Error al cargar matriculas:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Función para renderizar la tabla de matrículas
function renderMatriculasTable(matriculasList) {
    const matriculasTableBody = document.getElementById("matriculasTableBody");
    matriculasTableBody.innerHTML = ""; // Limpiar contenido anterior

    matriculasList.forEach(matricula => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="p-3 border-b">${matricula.idMatricula}</td>
            <td class="p-3 border-b">${matricula.nombre_completo}</td>
            <td class="p-3 border-b">${matricula.grado.nombreGrado} - ${matricula.grado.seccion}</td>
            <td class="p-3 border-b">${matricula.fechaMatricula}</td>
            <td class="p-3 border-b">
                <button onclick="eliminarMatricula(${matricula.idMatricula})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
            </td>
        `;
        matriculasTableBody.appendChild(row);
    });
}

// Eliminar matricula con token
function eliminarMatricula(idMatricula) {

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

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
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Matricular estudiante con token
function submitMatricula() {

    const idUsuario = document.getElementById("estudiante").value;
    const idGrado = document.getElementById("grado").value;

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

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
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
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
