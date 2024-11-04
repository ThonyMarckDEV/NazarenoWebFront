<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tareas Alumnos</title>
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
<body class="background-image bg-gray-100 flex overflow-hidden h-screen">

    <!-- Contenedor de Notificación -->
    <div id="notification" 
        style="display: none; z-index: 9999;" 
        class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md cursor-pointer"
        onclick="this.style.display='none';">
    </div>

    <!-- Sidebar -->
    <?php include 'sidebarDOCENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 sm:p-6 overflow-auto h-full">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Cursos</h2>
        <div id="cursosContainer" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <!-- Aquí se cargarán los cursos y módulos dinámicamente con JavaScript -->
        </div>
    </div>

    <!-- Modal para mostrar módulos del curso -->
    <div id="modulosModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-10/12 max-w-xs ml-8 mx-2 sm:mx-auto sm:max-w-md sm:p-4 sm:max-h-[80vh] overflow-y-auto my-auto">
            <h2 class="text-base font-semibold mb-3 text-center">Módulos del Curso</h2>
            <div id="moduloContainer" class="space-y-3">
                <!-- Aquí se cargarán los módulos dinámicamente -->
            </div>
            <div class="flex justify-center sm:justify-end mt-3">
                <button onclick="closeModulosModal()" class="bg-gray-300 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 text-sm rounded">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- Modal deslizante para mostrar tareas de los estudiantes -->
    <div id="tareasModal" style="display: none;" class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 overflow-auto">
        <div class="p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Tareas de los Estudiantes</h2>
            
            <!-- Contenedor de tareas con desplazamiento vertical -->
            <div id="tareasContainer" class="space-y-4 max-h-[70vh] overflow-y-auto">
                <!-- Aquí se cargarán las tareas dinámicamente -->
            </div>
            
            <div class="flex justify-center mt-4">
                <button onclick="closeTareasModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- Incluir el script para manejar la carga de cursos, módulos, y modales -->
    <script type="module" src="../../js/tareasPendientes.js"></script>
</body>
</html>
