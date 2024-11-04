<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anunciar - Docente</title>
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
    <?php include 'sidebarDOCENTE.php'; ?>

     <!-- Contenido Principal -->
     <div class="flex-1 p-4 sm:p-6 overflow-auto h-full">
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Agregar Material y Actividades</h2>
        <div id="cursosContainer" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <!-- Aquí se cargarán los cursos y módulos dinámicamente con JavaScript -->
        </div>
    </div>

<!-- Modal para crear un anuncio -->
<div id="anuncioModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 ml-auto sm:mx-auto sm:max-w-md sm:p-6 sm:mt-32 mt-20"> <!-- Añadido mt-20 para móviles -->
        <!-- ml-auto solo se aplica en móviles para desplazarse hacia la derecha -->
        <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Crear Anuncio</h2>
        <form onsubmit="event.preventDefault(); enviarAnuncio();">
            <input type="hidden" id="modalNombreCurso">
            <input type="hidden" id="modalSeccion">
            <div class="mb-4">
                <label for="modalDescripcion" class="block text-gray-700">Descripción</label>
                <textarea id="modalDescripcion" class="w-full p-2 border rounded text-sm sm:text-base" rows="3"></textarea>
            </div>
            <div class="flex justify-center sm:justify-end space-x-2 mt-4">
                <button type="button" onclick="closeAnuncioModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cancelar</button>
                <button type="submit" class="bg-black text-white px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Enviar</button>
            </div>
        </form>
    </div>
</div>


    <!-- Incluir el script para cargar anuncios -->
    <script type="module" src="../../js/anunciosDocente.js"></script>
</body>
</html>
