import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");
const decodedToken = parseJwt(token);
const idUsuario = decodedToken ? decodedToken.idUsuario : null;


// Función para decodificar el token JWT y obtener el payload
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}



if (!idUsuario) {
    console.error("No se pudo obtener el ID de usuario del token.");
    showNotification("Error de autenticación", "bg-red-500");
}

// Función para cargar datos del docente
async function loadAlumnoData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/perfilAlumno`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("nombres").value = data.data.nombres;
        document.getElementById("apellidos").value = data.data.apellidos;
        document.getElementById("dni").value = data.data.dni;
        document.getElementById("correo").value = data.data.correo;
        document.getElementById("edad").value = data.data.edad;
        document.getElementById("nacimiento").value = data.data.nacimiento;
        document.getElementById("sexo").value = data.data.sexo;
        document.getElementById("direccion").value = data.data.direccion;
        document.getElementById("telefono").value = data.data.telefono;
        document.getElementById("departamento").value = data.data.departamento;

         // Cargar imagen de perfil con la URL completa desde Laravel
        // Si no hay imagen, cargar la imagen por defecto del frontend en /img/default-profile.jpg
        document.getElementById("profileImage").src = data.data.perfil || '../../img/default-profile.jpg';
    } catch (error) {
        console.error("Error al cargar datos del docente:", error);
    }
}

// Función para subir la imagen de perfil
function uploadProfileImage() {
    const formData = new FormData();
    formData.append("perfil", document.getElementById("profileInput").files[0]);

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/uploadProfileImageAlumno/${idUsuario}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("profileImage").src = `${API_BASE_URL}/storage/profiles/${idUsuario}/${data.filename}`;
            showNotification("Foto de perfil actualizada correctamente", "bg-green-500");
        } else {
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al subir imagen de perfil:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para actualizar los datos del alumno
function updateAlumno() {
    const data = {
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        dni: document.getElementById("dni").value,
        correo: document.getElementById("correo").value,
        edad: document.getElementById("edad").value,
        nacimiento: document.getElementById("nacimiento").value,
        sexo: document.getElementById("sexo").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        departamento: document.getElementById("departamento").value,
    };

       // Mostrar el loader al enviar el formulario
       document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/updateAlumno/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Datos actualizados correctamente", "bg-green-500");
        } else {
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(
        error => console.error("Error al actualizar datos del docente:", error

    ))
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para mostrar notificaciones
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Cargar los datos del docente al cargar la página
document.addEventListener("DOMContentLoaded", loadAlumnoData);

window.uploadProfileImage = uploadProfileImage;
window.updateAlumno = updateAlumno;
