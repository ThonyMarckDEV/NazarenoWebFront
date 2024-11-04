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
            background-image: url('./img/cebe.jpeg'); /* Cambia esta ruta */
            background-size: cover;
            background-position: center;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script> <!-- Incluye jwt-decode -->
</head>
<body class="background-image h-screen flex items-center justify-center">

    <!-- Contenedor del formulario -->
    <div class="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0 text-center">
        <!-- Título -->
        <h1 class="text-3xl font-bold text-white mb-4">C.E.B.E</h1>
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

  <!-- Loader -->
    <?php include './PHP/loader.php'; ?>

    <!-- Script de JavaScript para manejar la autenticación y redirección -->
    <script type="module" src="./js/login.js"></script>
</body>
</html>
