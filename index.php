<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="icon" href="./img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }

        .carousel-image {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }

        .carousel-image.active {
            opacity: 1;
        }

        .background-filter {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(3px);
            z-index: 0;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
</head>
<body class="relative h-screen flex items-center justify-center">

    <!-- Fondo del carrusel -->
    <div class="background-image">
        <img src="./img/cebemain.jpeg" alt="Fondo 1" class="carousel-image active">
        <img src="./img/cebe2.jpeg" alt="Fondo 2" class="carousel-image">
        <img src="./img/cebe3.jpeg" alt="Fondo 3" class="carousel-image">
    </div>

    <!-- Filtro de fondo -->
    <div class="background-filter"></div>

    <!-- Contenedor del formulario -->
    <div class="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0 text-center z-10">
        <!-- Título -->
        <h1 class="text-3xl font-bold text-white mb-4">C.E.B.E - Jesús de Nazareno</h1>
        <h2 class="text-xl text-white mb-6">Iniciar Sesión</h2>

        <!-- Formulario -->
        <form id="loginForm" class="space-y-4">
            <div>
                <label for="username" class="block text-white text-left">Usuario:</label>
                <input type="text" id="username" name="username" required 
                    class="w-full px-4 py-2 rounded bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:bg-opacity-80 focus:ring-2 focus:ring-white transition duration-300">
            </div>

            <div>
                <label for="password" class="block text-white text-left">Contraseña:</label>
                <input type="password" id="password" name="password" required 
                    class="w-full px-4 py-2 rounded bg-gray-800 bg-opacity-60 text-white placeholder-gray-400 focus:outline-none focus:bg-opacity-80 focus:ring-2 focus:ring-white transition duration-300">
            </div>

            <button type="submit" 
                class="w-full bg-white text-gray-800 font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-white hover:bg-opacity-20 transition duration-300">
                Iniciar Sesión
            </button>
        </form>
    </div>

    <!-- Script del carrusel -->
    <script>
        const images = document.querySelectorAll('.carousel-image');
        let currentIndex = 0;

        function changeImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        setInterval(changeImage, 5000); // Cambiar imagen cada 5 segundos
    </script>

  <!-- Loader -->
    <?php include './PHP/loader.php'; ?>

    <!-- Script de JavaScript para manejar la autenticación y redirección -->
    <script type="module" src="./js/login.js"></script>
    <!-- Script de autenticación -->
    <script type="module" src="./js/checkStorageTokenINDEX.js"></script>
    <!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/click-sound.js"></script>
<!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/typing-sound.js"></script>
</body>
</html>
