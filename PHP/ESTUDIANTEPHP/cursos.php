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

    <!-- Modal para mostrar materiales y actividades -->
    <div id="moduloModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-lg lg:max-w-2xl lg:w-2/3 sm:p-6 lg:mx-auto lg:my-auto lg:mt-20">
            <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Materiales y Actividades del Módulo</h2>

            <div class="overflow-y-auto max-h-80 p-4">
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
            </div>

            <div class="flex justify-center sm:justify-end mt-4">
                <button onclick="closeMaterialActividadModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
            </div>
        </div>
    </div>


        <div id="subirTareaModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-md md:max-w-lg lg:max-w-2xl lg:p-8 lg:mx-auto">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-center">Subir Tarea</h2>
            <input type="file" id="archivoTarea" class="mb-4 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            
            <div class="flex flex-col sm:flex-row justify-center sm:justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <button onclick="enviarTarea()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base">Subir</button>
                <button onclick="cerrarSubirTareaModal()" class="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg text-sm sm:text-base">Cancelar</button>
            </div>
        </div>
    </div>

<!-- Modal para listar estudiantes matriculados -->
<div id="estudiantesModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 hidden">
    <div class="bg-white p-6 rounded-lg w-full max-w-md mx-4 sm:p-8 relative">
        <!-- Botón para cerrar el modal -->
        <button onclick="closeEstudiantesModal()" class="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl">&times;</button>
        
        <!-- Título del modal -->
        <h2 class="text-xl font-semibold mb-6 text-center">Estudiantes Matriculados</h2>
        
        <!-- Contenedor para la lista de estudiantes con límite de altura -->
        <div id="estudiantesContainer" class="space-y-4 max-h-56 overflow-y-auto">
            <!-- Las tarjetas de estudiantes se cargarán aquí dinámicamente -->
        </div>
    </div>
</div>

<!-- Modal para mostrar imagen de perfil ampliada -->
<div id="imageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden">
    <div class="relative bg-white rounded-lg p-4 max-w-sm sm:max-w-md md:max-w-lg w-full mx-4">
        <button onclick="closeImageModal()" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-xl font-bold">&times;</button>
        <img src="" alt="Perfil Ampliado" id="modalProfileImage" class="w-full h-auto rounded-lg">
    </div>
</div>


    
    <!-- Incluir el script para cargar anuncios -->
    <script type="module" src="../../js/cursos.js"></script>
</body>
</html>
