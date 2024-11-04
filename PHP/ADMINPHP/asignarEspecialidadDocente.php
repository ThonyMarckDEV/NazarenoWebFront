<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Asignar Especialidad a Docente</title>
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

    <!-- Notificación -->
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>

    <!-- Sidebar -->
    <?php include 'sidebarAdmin.php'; ?>

     <!-- Contenido Principal -->
     <div class="flex-1 p-4 ml-0 md:ml-10 lg:ml-5">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Asignar Especialidad a Docente</h2>

        
        <!-- Formulario de Matrícula -->
        <form id="asignarForm" class="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-lg md:max-w-md lg:max-w-sm">
            <!-- Selección de Especialidad -->
            <div>
                <label for="especialidad" class="block text-gray-700 font-semibold">Especialidad</label>
                <select id="especialidad" name="especialidad" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <!-- Opciones generadas dinámicamente -->
                </select>
            </div>

            <!-- Selección de Docente -->
            <div>
                <label for="docente" class="block text-gray-700 font-semibold">Docente</label>
                <select id="docente" name="docente" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <!-- Opciones generadas dinámicamente -->
                </select>
            </div>

            <!-- Botón de Asignar -->
            <button type="button" onclick="asignarEspecialidad()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                Asignar Especialidad
            </button>
        </form>

        <!-- Tabla de Especialidades Asignadas -->
        <h3 class="text-xl font-semibold mb-4 mt-10 text-white">Especialidades Asignadas</h3>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th class="p-3 text-left">ID</th>
                        <th class="p-3 text-left">Docente</th>
                        <th class="p-3 text-left">Especialidad</th>
                        <th class="p-3 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody id="asignacionesTableBody" class="text-gray-700 text-sm font-light">
                    <!-- Contenido dinámico generado por JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <style>
        /* Asegura que la tabla se desplace en pantallas pequeñas */
        .overflow-x-auto {
            white-space: nowrap;
        }
    </style>

    </div>

    <!-- Script para manejar la asignación -->
    <script type="module" src="../../js/asignarEspecialidadDocente.js"></script>
</body>
</html>
