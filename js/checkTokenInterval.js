// Configuración del intervalo de verificación
const checkTokenInterval = 60000; // Verifica cada 60 segundos
const expirationThreshold = 120;   // Intenta renovar si quedan 2 minutos o menos

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
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = tokenExpiration - currentTime;


    if (timeRemaining <= 0) {
        alert("Tu sesión ha caducado, serás redirigido para iniciar sesión nuevamente.");
        console.log("El token ha expirado, cerrando sesión...");
        logoutExternal();
    } else if (timeRemaining <= expirationThreshold) {
        console.log(`Renovando el token, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
        renewToken();
    } else {
        console.log(`No es necesario renovar aún, tiempo restante hasta expiración: ${timeRemaining} segundos.`);
    }
}

let isRenewingToken = false;

// Función para renovar el token llamando al servidor Laravel
async function renewToken() {
    if (isRenewingToken) return; // Evita llamadas concurrentes
    isRenewingToken = true;
    const token = localStorage.getItem('jwt');
    console.log(`Intentando renovar el token actual`);
    
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
            console.log(`Token renovado`);
            localStorage.setItem('jwt', data.accessToken); // Guarda el nuevo token
        } else {
            console.log("Error al renovar el token, cerrando sesión...");
            logoutExternal();
        }
    } catch (error) {
        console.error("Excepción al renovar el token:", error);
        logoutExternal();
    }
    isRenewingToken = false;
}

// Importar y usar la función de logout externo
import { logout as logoutExternal } from './logout.js';

// Función para redirigir al login
function redirectToLogin() {
    window.location.href = `${window.location.origin}/index.php`; // Asegura que la URL es correcta
}

// Función auxiliar para extraer la expiración del token
function parseJwtExpiration(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp; // Extrae la expiración
}

// Ejecutar la verificación del token cada segundo
setInterval(checkAndRenewToken, checkTokenInterval);
