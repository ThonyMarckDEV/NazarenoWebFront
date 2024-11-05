import API_BASE_URL from './urlHelper.js';

function updateLastActivity() {
    const token = localStorage.getItem('jwt'); // Obtener el token de acceso

    if (token) {
        const decoded = jwt_decode(token);
        const userId = decoded.idUsuario;  // Asegúrate de que el payload del token tenga este campo

        fetch(`${API_BASE_URL}/api/update-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado de autorización
            },
            body: JSON.stringify({ idUsuario: userId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Last activity updated:', data.message);
        })
        .catch(error => {
            console.error('Error updating last activity:', error);
        });
    }
}

// Llamar a la función inmediatamente cuando se carga el archivo
updateLastActivity();

// Configurar el intervalo para ejecutar cada 1 minutos
setInterval(updateLastActivity, 60000);
