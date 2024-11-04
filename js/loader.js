import API_BASE_URL from './urlHelper.js';

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Mostrar el "loader"
    document.getElementById("loadingScreen").classList.remove("hidden");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Hacer la solicitud POST a la API
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        // Manejo de errores según el código de estado
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

        // Obtener el token JWT de la respuesta
        const data = await response.json();
        const token = data.token;

        // Guardar el token en localStorage
        localStorage.setItem("jwt", token);

        // Guardar el token en una cookie
        setCookie("jwt", token, 1); // Expira en 1 día (puedes ajustar el tiempo)

        // Decodificar el token para obtener el rol del usuario
        const decodedToken = parseJwt(token);
        const rol = decodedToken.rol;

        // Redirigir según el rol del usuario
        if (rol === "admin") {
            window.location.href = "./PHP/ADMINPHP/Admin.php";
        } else if (rol === "estudiante") {
            window.location.href = "./PHP/ESTUDIANTEPHP/Estudiante.php";
        } else if (rol === "docente") {
            window.location.href = "./PHP/DOCENTEPHP/Docente.php";
        } else {
            alert("Rol no reconocido");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.");
    } finally {
        // Ocultar el "loader" después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
    }
});

// Función para crear una cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString(); // Tiempo en días
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
}

// Decodificar el token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}
