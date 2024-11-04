// Script de Overlay de Carga
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('a'); // Selecciona todos los enlaces

    links.forEach(link => {
        // Excluir el enlace de logout (si tiene el atributo "onclick")
        if (link.hasAttribute("onclick")) {
            return; // Ignora este enlace
        }

        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetUrl = link.href;

            // Muestra el overlay
            const loadingOverlay = document.getElementById("loadingOverlay");
            loadingOverlay.classList.remove("hidden");

            // Espera 1.5 segundos antes de redirigir a la nueva URL
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1500);
        });
    });
});
