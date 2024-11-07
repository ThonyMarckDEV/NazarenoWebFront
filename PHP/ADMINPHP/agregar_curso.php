<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, minimum-scale=1">
    <title>Agregar Curso</title>
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            background-image: url('../../img/cebe.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
    </style>
</head>
<body class="background-image bg-gray-100 flex">

    <!-- Contenedor de Notificación -->
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>

    <!-- Sidebar -->
    <?php include 'sidebarAdmin.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 ml-0 md:ml-10 lg:ml-5">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Agregar Curso</h2>

        <!-- Formulario -->
        <form id="cursoForm" class="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 w-full max-w-lg md:max-w-md lg:max-w-sm">
            <!-- Nombre del Curso -->
            <div>
                <label for="nombreCurso" class="block text-gray-700 font-semibold">Nombre del Curso</label>
                <input type="text" id="nombreCurso" name="nombreCurso" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Selección de Especialidad -->
            <div>
                <label for="idEspecialidad" class="block text-gray-700 font-semibold">Especialidad</label>
                <select id="idEspecialidad" name="idEspecialidad" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <!-- Las opciones se llenarán dinámicamente -->
                </select>
            </div>

            <!-- Selección de Grado -->
            <div>
                <label for="idGrado" class="block text-gray-700 font-semibold">Grado</label>
                <select id="idGrado" name="idGrado" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <!-- Las opciones se llenarán dinámicamente -->
                </select>
            </div>

            <!-- Botón de Enviar -->
            <button type="button" onclick="submitCursoForm()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                Registrar Curso
            </button>
        </form>

    <!-- Tabla de Cursos -->
    <div class="overflow-x-auto mt-4">

    <h3 class="text-xl font-semibold mb-4 mt-10 text-white">Curso agregados</h3>
    <!-- Campo de búsqueda para la tabla de cursos -->
    <div class="mb-4">
        <input type="text" id="searchCursosInput" placeholder="Buscar cursos..." class="border p-2 rounded w-full sm:w-1/2">
    </div>

        <table class="min-w-full bg-white shadow-md rounded-lg text-sm sm:text-base">
            <thead>
                <tr class="bg-gray-200 text-gray-600 uppercase leading-normal">
                    <th class="p-2 sm:p-3 text-left">ID</th>
                    <th class="p-2 sm:p-3 text-left">Curso</th>
                    <th class="p-2 sm:p-3 text-left">Especialidad</th>
                    <th class="p-2 sm:p-3 text-left">Grado - Sección</th>
                    <th class="p-2 sm:p-3 text-left">Acciones</th>
                </tr>
            </thead>
            <tbody id="cursosTableBody" class="text-gray-700 font-light">
                <!-- Contenido dinámico generado por JavaScript -->
            </tbody>
        </table>
    </div>

    <!-- Script para enviar datos en formato JSON y obtener las listas -->
    <script type="module" src="../../js/agregarCurso.js"></script>
</body>
</html>
