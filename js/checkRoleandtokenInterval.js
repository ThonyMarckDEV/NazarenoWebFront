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

    const tokenExpiration = parseJwtExpiration(token);
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


async function renewToken() {
    if (isRenewingToken) return;
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
            localStorage.setItem('jwt', data.accessToken); 
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


import { logout as logoutExternal } from './logout.js';


function redirectToLogin() {
    window.location.href = `${window.location.origin}/index.php`;
}


function parseJwtExpiration(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp; // Extrae la expiración
}


setInterval(checkAndRenewToken, checkTokenInterval);
