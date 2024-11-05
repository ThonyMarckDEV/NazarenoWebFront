import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");


function submitCursoForm() {
    const form = document.getElementById("cursoForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/agregarCurso`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Curso registrado exitosamente", "bg-green-500");
            form.reset();
            listCursos();
        } else {
            showNotification(data.message || "Error al registrar curso", "bg-red-500");
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

// Cargar las opciones de especialidades
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
        const select = document.getElementById("idEspecialidad");
        select.innerHTML = ''; // Limpiar opciones anteriores

          // Crear opción predeterminada
          const defaultOption = document.createElement("option");
          defaultOption.value = ''; // Valor vacío para opción no seleccionable
          defaultOption.textContent = "Seleccione una Especialidad";
          defaultOption.disabled = true;
          defaultOption.selected = true;
          select.appendChild(defaultOption);

        data.data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.idEspecialidad; // Asegurarse de que coincide con el JSON
            option.textContent = item.nombreEspecialidad; // Acceder a 'nombreEspecialidad'
            select.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}
//
// Cargar las opciones de grados con sus secciones
function loadGrados() {
    fetch(`${API_BASE_URL}/api/listarGrados`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("idGrado");
        select.innerHTML = 'Seleccione un grado:'; // Valor vacío para opción no seleccionable

        data.data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.idGrado; // Asegurarse de que coincide con el JSON
            // Combinar nombreGrado y seccion para mostrar ambos en la opción
            option.textContent = `${item.nombreGrado} - ${item.seccion}`;
            select.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}


// Función para listar los cursos
function listCursos() {
    fetch(`${API_BASE_URL}/api/listarCursos`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        const cursosTableBody = document.getElementById("cursosTableBody");
        cursosTableBody.innerHTML = ""; 
        data.data.forEach(curso => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-3 border-b">${curso.idCurso}</td>
                <td class="p-3 border-b">${curso.nombreCurso}</td>
                <td class="p-3 border-b">${curso.especialidad.nombreEspecialidad}</td>
                <td class="p-3 border-b">${curso.grado.nombreGrado} - ${curso.grado.seccion}</td>
                <td class="p-3 border-b">
                    <button onclick="eliminarCurso(${curso.idCurso})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                </td>
            `;
            cursosTableBody.appendChild(row);
        });
    })
    .catch(
      error => console.error("Error al cargar cursos:", error

    ));
}

// Función para eliminar un curso
function eliminarCurso(idCurso) {

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/eliminarCurso/${idCurso}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true" // O usa un encabezado personalizado
        }
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, data.success ? "bg-green-500" : "bg-red-500");
        if (data.success) {
            listCursos(); 
        }
    })
    .catch(
        error => console.error("Error al eliminar curso:", error

    ))    
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}




// Ejecutar carga de opciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadEspecialidades();
    loadGrados();
    listCursos();
});

// Mostrar notificación
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Hacer la función accesible globalmente
window.submitCursoForm = submitCursoForm;
window.eliminarCurso = eliminarCurso;