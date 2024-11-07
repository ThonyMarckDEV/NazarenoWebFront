<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calificaciones</title>
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
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Ver Calificaciones Cursos</h2>
        <div id="cursosContainer" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <!-- Aquí se cargarán los cursos y módulos dinámicamente con JavaScript -->
            <div id="cursosList"></div>
        </div>
    </div>

<!-- Modal para mostrar módulos del curso -->
<div id="modulosModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg w-10/12 max-w-xs ml-8 mx-2 sm:mx-auto sm:max-w-md sm:p-4 my-auto">
        <h2 class="text-base font-semibold mb-3 text-center">Módulos del Curso</h2>
        <div id="moduloContainer" class="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
            <!-- Aquí se cargarán los módulos dinámicamente -->
        </div>
        <div class="flex justify-center sm:justify-end mt-3">
            <button onclick="closeModulosModal()" class="bg-gray-300 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 text-sm rounded">Cerrar</button>
        </div>
    </div>
</div>


    <!-- Modal para mostrar calificaciones de actividades -->
    <div id="moduloModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-lg lg:max-w-3xl lg:w-3/4 sm:p-6 lg:mx-auto lg:my-auto lg:mt-20 shadow-2xl">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Calificaciones de Actividades del Módulo</h2>
            
            <!-- Contenedor de Actividades -->
            <div id="actividadContainer" class="space-y-4 overflow-y-auto max-h-96 lg:max-h-[60vh]">
                <!-- Aquí se cargarán las actividades dinámicamente -->
            </div>
            
            <div class="flex justify-center sm:justify-end mt-4">
                <button onclick="closeMaterialActividadModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
            </div>
        </div>
    </div>
    
    <!-- Incluir el script para cargar anuncios -->
    <script type="module" src="../../js/calificaciones.js"></script>
</body>
</html>
