import API_BASE_URL from './urlHelper.js';

import { verificarYRenovarToken } from './authToken.js';

const token = localStorage.getItem("jwt");

// Obtener el id del docente desde el token
export function getIdUsuarioFromToken() {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para actualizar el contador de tareas pendientes
export async function actualizarContadorTareasPendientes() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) return;

    fetch(`${API_BASE_URL}/api/docente/${idDocente}/tareas/pendientes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const contadorElemento = document.getElementById("contadorTareasPendientes");
            const tareasPendientes = data.tareasPendientes.reduce((acc, item) => acc + item.tareas_pendientes, 0);

            // Mostrar el contador solo si hay tareas pendientes
            if (tareasPendientes > 0) {
                contadorElemento.textContent = tareasPendientes;
                contadorElemento.style.display = "flex";
            } else {
                contadorElemento.style.display = "none";
            }
        }
    })
    .catch(error => console.error("Error al obtener el contador de tareas pendientes:", error));
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarContadorTareasPendientes);