import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

async function checkTokenExpiration() {
    const token = localStorage.getItem("jwt");
    const decodedToken = parseJwt(token);

    if (!token || !decodedToken) {
        console.log("No token found, redirecting to login.");
        window.location.href = "../index.php";
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        alert("Your session has expired. Please log in again.");

        // Llamada a la API para actualizar el estado a loggedOff sin encabezado de token
        try {
            await fetch(`${API_BASE_URL}/api/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idUsuario: decodedToken.idUsuario }) // Enviar idUsuario en el cuerpo
            });
        } catch (error) {
            console.error("Error al desloguear al usuario:", error);
        }

        localStorage.removeItem("jwt");
        window.location.href = "../index.php";
    }
}

// Revisar cada 10 segundos si el token ha expirado
setInterval(checkTokenExpiration, 10000);
