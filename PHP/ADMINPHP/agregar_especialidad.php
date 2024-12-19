<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, minimum-scale=1">
    <title>Agregar Especialidad</title>
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            background-image: url('../../img/cebe.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: fixed; /* Fija el fondo */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; /* Envía el fondo al fondo de la capa */
        }
    </style>
</head>
<body class="bg-gray-100 flex">

    <!-- Fondo Fijo -->
    <div class="background-image"></div>

    <!-- Contenedor de Notificación -->
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>

    <!-- Sidebar -->
    <?php include 'sidebarAdmin.php'; ?>

    <!-- Contenido Principal -->
    <div class="main-content flex-1 p-4 ml-0 md:ml-10 lg:ml-5">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Agregar Especialidad</h2>

        <!-- Formulario -->
        <form id="specialtyForm" class="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 w-full max-w-lg md:max-w-md lg:max-w-sm">
            <!-- Nombre de Especialidad -->
            <div>
                <label for="nombreEspecialidad" class="block text-gray-700 font-semibold">Nombre de Especialidad</label>
                <input type="text" id="nombreEspecialidad" name="nombreEspecialidad" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Botón de Enviar -->
            <button type="button" onclick="submitSpecialtyForm()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                Registrar Especialidad
            </button>
        </form>

        <!-- Tabla de Especialidades -->
        <h3 class="text-xl font-semibold mb-4 mt-10 text-white">Especialidades Agregadas</h3>

        <!-- Campo de búsqueda -->
        <div class="mb-4">
            <input type="text" id="searchEspecialidadesInput" placeholder="Buscar especialidades..." class="border p-2 rounded w-full sm:w-1/2">
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-lg text-sm sm:text-base">
                <thead>
                    <tr class="bg-gray-200 text-gray-600 uppercase leading-normal">
                        <th class="p-2 sm:p-3 text-left">ID</th>
                        <th class="p-2 sm:p-3 text-left">Nombre de Especialidad</th>
                        <th class="p-2 sm:p-3 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody id="especialidadesTableBody" class="text-gray-700 font-light">
                    <!-- Contenido dinámico generado por JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Script para manejar las especialidades -->
    <script type="module" src="../../js/agregarEspecialidad.js"></script>
</body>
</html>
