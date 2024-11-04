// Configuración del intervalo de verificación
const checkTokenInterval = 60000; // Verifica cada 60 segundos
const expirationThreshold = 120;  // Renueva 2 minutos antes de la expiración

// URL base de la API
import API_BASE_URL from './urlHelper.js';

// Función para verificar y renovar el token
function checkAndRenewToken() {

    const token = localStorage.getItem('jwt');
    if (!token) {
        redirectToLogin();
        return;
    }

    const tokenExpiration = parseJwtExpiration(token); // Función para extraer la expiración del token

    // Calcula el tiempo restante para la expiración
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = tokenExpiration - currentTime;

    if (timeRemaining < 0) {
        logout();
    } else if (timeRemaining <= expirationThreshold) {
        renewToken();
    }
}

// Función para renovar el token llamando al servidor Laravel
async function renewToken() {

    const token = localStorage.getItem('jwt'); // Recupera el token actualizado cada vez

    try {
        const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt', data.accessToken); // Guarda el nuevo token
        } else {
            logout();
        }
    } catch (error) {
        logout(); // Si ocurre un error, cierra sesión
    }
}

// Función para cerrar sesión del usuario y redirigir al login
export async function logout() {

    const token = localStorage.getItem("jwt");

    const decodedToken = parseJwt(token);

    if (token && decodedToken) {
        try {
            await fetch(`${API_BASE_URL}/api/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idUsuario: decodedToken.idUsuario }) // Enviar idUsuario en el cuerpo
            });
        } catch (error) {
        }
    }

    // Eliminar el token de localStorage
    localStorage.removeItem("jwt");

    // Eliminar la cookie JWT configurando su fecha de expiración en el pasado
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";

    // Redirigir a la página de inicio de sesión en el dominio raíz
    redirectToLogin();
}

// Función para redirigir al login
function redirectToLogin() {
    window.location.href = `${window.location.origin}/index.php`;
}

// Función auxiliar para extraer la expiración del token
function parseJwtExpiration(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp; // Extrae la expiración
}   

// Decodificar el token (función auxiliar)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const decoded = JSON.parse(jsonPayload);
        return decoded;
    } catch (error) {
        return null;
    }
}

// Ejecutar la verificación del token cada minuto
setInterval(checkAndRenewToken, checkTokenInterval);
