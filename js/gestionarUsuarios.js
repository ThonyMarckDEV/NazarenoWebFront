import API_BASE_URL from './urlHelper.js';

// Obtener el token JWT del localStorage
const token = localStorage.getItem("jwt");

// Función para listar usuarios
export function listUsers() {
    fetch(`${API_BASE_URL}/api/listarUsuarios`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = ""; // Limpiar el contenido existente en la tabla
        data.data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="p-3 border-b">${user.idUsuario}</td>
            <td class="p-3 border-b">
                <input type="text" value="${user.username}" class="border p-1 rounded-md w-full" id="username-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <input type="text" value="${user.rol}" class="border p-1 rounded-md w-full role-input" id="rol-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <input type="text" value="${user.correo}" class="border p-1 rounded-md w-full" id="correo-${user.idUsuario}">
            </td>
            <td class="p-3 border-b">
                <div class="actions flex md:flex-row flex-col gap-2">
                    <button onclick="updateUser(${user.idUsuario})" class="action-button bg-blue-500 text-white px-3 py-1 rounded">Actualizar</button>
                    <button onclick="deleteUser(${user.idUsuario})" class="action-button bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                </div>
            </td>
            `;
            userTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al cargar usuarios:", error);
        showNotification("Error en la solicitud", "bg-red-500");
    });
}

// Función para eliminar usuario con token
function deleteUser(userId) {
    fetch(`${API_BASE_URL}/api/eliminarUsuario/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Usuario eliminado exitosamente", "bg-green-500");
            listUsers(); // Recargar la lista de usuarios
        } else {
            showNotification(data.message || "Error al eliminar usuario", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al eliminar usuario:", error));
}

// Función para actualizar usuario con token
function updateUser(userId) {
    const username = document.getElementById(`username-${userId}`).value;
    const rol = document.getElementById(`rol-${userId}`).value;
    const correo = document.getElementById(`correo-${userId}`).value;

    fetch(`${API_BASE_URL}/api/actualizarUsuario/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ username, rol, correo }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Usuario actualizado exitosamente", "bg-green-500");
            listUsers();
        } else {
            showNotification(data.message || "Error al actualizar usuario", "bg-red-500");
        }
    })
    .catch(error => console.error("Error al actualizar usuario:", error));
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

// Cargar la lista de usuarios al iniciar la página
document.addEventListener("DOMContentLoaded", listUsers);

window.deleteUser = deleteUser;
window.updateUser = updateUser;
