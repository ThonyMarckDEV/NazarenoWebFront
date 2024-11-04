window.addEventListener("beforeunload", (event) => {
    if (isTabClosing) {
        const token = localStorage.getItem("jwt");
        const decodedToken = parseJwt(token);
        
        if (token && decodedToken) {
            const logoutData = new Blob([JSON.stringify({ idUsuario: decodedToken.idUsuario })], {
                type: "application/json"
            });
            navigator.sendBeacon(`${API_BASE_URL}/api/logout`, logoutData);
        }

        localStorage.removeItem("jwt");
        document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
    }
});
