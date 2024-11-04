<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, minimum-scale=1">
    <title>Perfil Docente</title>
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            background-image: url('../../img/cebe.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        .profile-img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
        }
    </style>
</head>
<body class="background-image bg-gray-100 flex h-screen">
    
    <!-- Contenedor de Notificación -->
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>

    <!-- Sidebar -->
    <?php include 'sidebarDOCENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col items-center p-4 sm:p-6 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto overflow-y-auto h-full">
        <h2 class="text-2xl font-semibold mb-4 text-white mt-10 text-center">Perfil Docente</h2>

        <!-- Imagen de Perfil -->
        <div class="flex justify-center mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <form id="uploadForm" enctype="multipart/form-data" class="flex flex-col items-center w-full">
                <input type="hidden" id="idUsuario" value="<!-- ID del docente cargado dinámicamente -->">
                <img src="<!-- Ruta de imagen de perfil -->" alt="Perfil" id="profileImage" class="profile-img border-2 border-gray-300 shadow-md mb-3">
                <input type="file" id="profileInput" name="perfil" accept="image/*" class="mt-2 block w-full">
                <button type="button" onclick="uploadProfileImage()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mt-2">Actualizar Foto</button>
            </form>
        </div>

        <!-- Formulario de Actualización de Datos -->
        <form id="updateForm" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
            <div>
                <label for="nombres" class="block text-gray-700 font-semibold">Nombres</label>
                <input type="text" id="nombres" name="nombres" required 
                    class="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0" 
                    readonly>
            </div>
            <div>
                <label for="apellidos" class="block text-gray-700 font-semibold">Apellidos</label>
                <input type="text" id="apellidos" name="apellidos" required 
                    class="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0" 
                    readonly>
            </div>
            <div>
                <label for="dni" class="block text-gray-700 font-semibold">DNI</label>
                <input type="text" id="dni" name="dni" maxlength="8" required 
                    class="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0" 
                    readonly>
            </div>
            <div>
                <label for="correo" class="block text-gray-700 font-semibold">Correo</label>
                <input type="email" id="correo" name="correo" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
                <label for="edad" class="block text-gray-700 font-semibold">Edad</label>
                <input type="number" id="edad" name="edad" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
                <label for="nacimiento" class="block text-gray-700 font-semibold">Fecha de Nacimiento</label>
                <input type="date" id="nacimiento" name="nacimiento" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
                <label for="sexo" class="block text-gray-700 font-semibold">Sexo</label>
                <select id="sexo" name="sexo" required class="w-full px-4 py-2 border rounded-lg">
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                </select>
            </div>
            <div>
                <label for="direccion" class="block text-gray-700 font-semibold">Dirección</label>
                <input type="text" id="direccion" name="direccion" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
                <label for="telefono" class="block text-gray-700 font-semibold">Teléfono</label>
                <input type="text" id="telefono" name="telefono" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
                <label for="departamento" class="block text-gray-700 font-semibold">Departamento</label>
                <input type="text" id="departamento" name="departamento" required class="w-full px-4 py-2 border rounded-lg">
            </div>

            <div class="col-span-full text-center">
                <button type="button" onclick="updateDocente()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">Guardar Cambios</button>
            </div>
        </form>
    </div>

    <!-- Scripts de manejo de imagen y actualización -->
    <script type="module" src="../../js/perfilDocente.js"></script>
</body>
</html>
