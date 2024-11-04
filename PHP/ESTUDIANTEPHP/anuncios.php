<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anuncios Cursos</title>
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
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>
    
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

   
    <!-- Modal de Anuncios -->
    <div id="anuncioModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 sm:mx-6 md:mx-auto mt-16">
            <!-- Título del modal -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800">Anuncios de <span id="cursoNombre"></span></h2>
                <button onclick="closeAnuncioModal()" class="text-gray-500 hover:text-gray-700 font-bold text-2xl">&times;</button>
            </div>

            <!-- Contenedor de anuncios -->
            <div id="anunciosContainer" class="overflow-y-auto max-h-64 md:max-h-80 bg-gray-100 p-3 rounded-lg">
                <p class="text-gray-600">Cargando anuncios...</p>
            </div>
        </div>
    </div>
    
    <!-- Incluir el script para cargar anuncios -->
    <script type="module" src="../../js/anunciosAlumno.js"></script>
</body>
</html>
