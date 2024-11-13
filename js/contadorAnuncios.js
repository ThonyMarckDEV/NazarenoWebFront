import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

import { verificarYRenovarToken } from './authToken.js';

// Obtener el id del alumno desde el token
export function getIdUsuarioFromToken() {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para actualizar el contador de anuncios no vistos
export async function actualizarContadorAnuncios() {

    // Verificar y renovar el token antes de cualquier solicitud
    await verificarYRenovarToken();

    const idAlumno = getIdUsuarioFromToken();
    if (!idAlumno) return;

    fetch(`${API_BASE_URL}/api/alumno/${idAlumno}/anuncios/no-vistos`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const contador = data.cantidad;
            const contadorElemento = document.getElementById("contadorAnuncios");

            // Mostrar el contador solo si hay anuncios no vistos
            if (contador > 0) {
                contadorElemento.textContent = contador;
                contadorElemento.style.display = "flex";
            } else {
                contadorElemento.style.display = "none";
            }
        }
    })
    .catch(error => console.error("Error al obtener el contador de anuncios no vistos:", error));
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarContadorAnuncios);
