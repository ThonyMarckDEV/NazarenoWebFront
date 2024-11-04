<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursos</title>
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
        style="display: none; z-index: 9999; position: fixed; top: 20px; left: 50%; transform: translateX(-50%);"
        class="px-4 py-2 text-white font-semibold text-center rounded shadow-md">
    </div>
    
    <!-- Sidebar -->
    <?php include 'sidebarESTUDIANTE.php'; ?>

 
     <!-- Contenido Principal -->
     <div class="flex-1 p-4 sm:p-6 overflow-auto h-full">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Ver Anuncios Cursos</h2>
        <div id="cursosContainer" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <!-- Aquí se cargarán los cursos y módulos dinámicamente con JavaScript -->
            <div id="cursosList"></div>
        </div>
    </div>

 <!-- Modal para mostrar módulos del curso -->
    <div id="modulosModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 ml-auto sm:mx-auto sm:max-w-lg sm:p-6 sm:mt-32">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Módulos del Curso</h2>
            <div id="moduloContainer" class="space-y-2">
                <!-- Aquí se cargarán los módulos dinámicamente -->
            </div>
            <div class="flex justify-center sm:justify-end mt-4">
                <button onclick="closeModulosModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
            </div>
        </div>
    </div>

    <!-- Modal para mostrar materiales y actividades -->
    <div id="moduloModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-lg lg:max-w-2xl lg:w-2/3 sm:p-6 lg:mx-auto lg:my-auto lg:mt-20">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Materiales y Actividades del Módulo</h2>
            
            <!-- Contenedor de Materiales -->
            <div id="materialContainer" class="space-y-4 mb-6">
                <h3 class="font-semibold text-lg">Materiales:</h3> <!-- Título para materiales -->
                <!-- Aquí se cargarán los materiales dinámicamente -->
            </div>
            
            <!-- Contenedor de Actividades -->
            <div id="actividadContainer" class="space-y-4">
                <h3 class="font-semibold text-lg">Actividades:</h3> <!-- Título para actividades -->
                <!-- Aquí se cargarán las actividades dinámicamente -->
            </div>
            
            <div class="flex justify-center sm:justify-end mt-4">
                <button onclick="closeMaterialActividadModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
            </div>
        </div>
    </div>

    <div id="subirTareaModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-lg sm:p-6">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Subir Tarea</h2>
            <input type="file" id="archivoTarea" class="mb-4 w-full">
            <div class="flex justify-center sm:justify-end mt-4">
                <button onclick="enviarTarea()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded">Subir</button>
                <button onclick="cerrarSubirTareaModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded ml-2">Cancelar</button>
            </div>
        </div>
    </div>
    
    <!-- Incluir el script para cargar anuncios -->
    <script type="module" src="../../js/cursos.js"></script>
</body>
</html>
