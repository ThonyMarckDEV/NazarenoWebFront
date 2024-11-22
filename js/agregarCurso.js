import API_BASE_URL from './urlHelper.js';



import { verificarYRenovarToken } from './authToken.js';


async function submitCursoForm() {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

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
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.volume = 1; // Ajusta el volumen (0.0 a 1.0)
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
            showNotification("Curso registrado exitosamente", "bg-green-500");
            form.reset();
            listCursos();
        } else {
             //=============================================================
             // Reproducir el sonido error
             var sonido = new Audio('../../songs/error.mp3');
             sonido.play().catch(function(error) {
                 console.error("Error al reproducir el sonido:", error);
             });           
            //=============================================================
            showNotification(data.message || "Error al registrar curso", "bg-red-500");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
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

// Cargar las opciones de especialidades
async function loadEspecialidades() {
    

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

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
async function loadGrados() {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

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

// Variable global para almacenar los cursos
let cursos = [];

// Función para listar los cursos
async function listCursos() {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    fetch(`${API_BASE_URL}/api/listarCursos`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            "bypass-tunnel-reminder": "true"
        }
    })
    .then(response => response.json())
    .then(data => {
        cursos = data.data; // Guardamos los cursos en la variable global
        renderCursosTable(cursos); // Renderizamos la tabla con todos los cursos

        // Añadimos el evento al campo de búsqueda
        const searchInput = document.getElementById("searchCursosInput");
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredCursos = cursos.filter(curso => {
                return (
                    curso.nombreCurso.toLowerCase().includes(searchTerm) ||
                    curso.especialidad.nombreEspecialidad.toLowerCase().includes(searchTerm) ||
                    curso.grado.nombreGrado.toLowerCase().includes(searchTerm) ||
                    curso.grado.seccion.toLowerCase().includes(searchTerm)
                );
            });
            renderCursosTable(filteredCursos);
        });
    })
    .catch(error => console.error("Error al cargar cursos:", error));
}

// Función para renderizar la tabla de cursos
function renderCursosTable(cursosList) {
    const cursosTableBody = document.getElementById("cursosTableBody");
    cursosTableBody.innerHTML = "";
    cursosList.forEach(curso => {
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
}


// Función para eliminar un curso
async function eliminarCurso(idCurso) {

    const token = localStorage.getItem("jwt");

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

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
            //=============================================================     
            // Reproducir el sonido success
            var sonido = new Audio('../../songs/success.mp3'); // Asegúrate de que la ruta sea correcta
            sonido.volume = 1;
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });
            //=============================================================
            listCursos(); 
        }else {
            //=============================================================
            // Reproducir el sonido error
            var sonido = new Audio('../../songs/error.mp3');
            sonido.play().catch(function(error) {
                console.error("Error al reproducir el sonido:", error);
            });           
           //=============================================================
           showNotification(data.message || "Error al eliminar curso", "bg-red-500");
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