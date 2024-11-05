import API_BASE_URL from './urlHelper.js';

// Agregar un evento para verificar el token almacenado al cargar la página
document.addEventListener("DOMContentLoaded", checkStoredToken);

// Evento de envío de formulario
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario

    // Mostrar el "loader"
    document.getElementById("loadingScreen").classList.remove("hidden");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Realizar la solicitud POST a la API para iniciar sesión
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        // Manejar diferentes respuestas según el estado HTTP
        if (response.status === 409) {
            alert("El usuario ya está logueado en otra sesión.");
            return;
        } else if (response.status === 401) {
            alert("Credenciales inválidas. Por favor, intenta de nuevo.");
            return;
        } else if (response.status === 404) {
            alert("Usuario no encontrado.");
            return;
        } else if (!response.ok) {
            throw new Error("Error en la autenticación");
        }

        // Procesar la respuesta con el token JWT
        const data = await response.json();
        const token = data.token;

        // Guardar el token en localStorage y establecer la bandera de inicio de sesión reciente
        localStorage.setItem("jwt", token);
        localStorage.setItem("justLoggedIn", "true"); // Bandera para control de redirección
        setCookie("jwt", token, 1); // Expira en 1 día

        // Redirigir según el rol del usuario
        handleRedirection(token);

    } catch (error) {
        console.error("Error:", error);
        alert("Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.");
    } finally {
        // Ocultar el "loader" después de completar la operación
        document.getElementById("loadingScreen").classList.add("hidden");
    }
});

function checkStoredToken() {
    const token = localStorage.getItem("jwt");
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp <= currentTime && decodedToken.estado === 'loggedOn') {
            changeUserStatusToLoggedOff(decodedToken.idUsuario);
            clearAuthData();
        } else if (decodedToken && decodedToken.exp > currentTime && decodedToken.estado === 'loggedOn') {
            if (!justLoggedIn) {
                handleRedirection(token);
            }
        } else {
            clearAuthData();
        }
    }

    if (justLoggedIn) {
        localStorage.removeItem("justLoggedIn");
    }
}

function handleRedirection(token) {
    const decodedToken = parseJwt(token);
    const rol = decodedToken.rol;

    switch (rol) {
        case "admin":
            window.location.href = "../PHP/ADMINPHP/Admin.php";
            break;
        case "estudiante":
            window.location.href = "../PHP/ESTUDIANTEPHP/Estudiante.php";
            break;
        case "docente":
            window.location.href = "../PHP/DOCENTEPHP/Docente.php";
            break;
        default:
            alert("Rol no reconocido");
            break;
    }
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};expires=${expires};path=/;Secure;SameSite=Strict`;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

function clearAuthData() {
    localStorage.removeItem("jwt");
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
}

async function changeUserStatusToLoggedOff(idUsuario) {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario })
        });
    } catch (error) {
        console.error("Error al cambiar el estado del usuario:", error);
    }
}
