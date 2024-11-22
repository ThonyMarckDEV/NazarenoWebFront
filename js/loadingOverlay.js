// Script de Overlay de Carga
document.addEventListener("DOMContentLoaded", () => {
    const loadingOverlay = document.getElementById("loadingOverlay"); // Overlay de carga

    // Función global para mostrar el overlay
    window.showLoadingOverlay = () => {
        if (loadingOverlay) {
            loadingOverlay.classList.remove("hidden");
        }
    };

    // Función global para ocultar el overlay después de 2 segundos
    window.hideLoadingOverlay = () => {
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add("hidden");
            }, 1000); // 2000 ms = 2 segundos
        }
    };
});
