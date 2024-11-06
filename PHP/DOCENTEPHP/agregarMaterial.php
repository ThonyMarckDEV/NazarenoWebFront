<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Material y Actividades</title>
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
        <h2 class="text-2xl font-semibold mb-6 text-white mt-10">Agregar Material y Actividades</h2>
        <div id="cursosContainer" class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <!-- Aquí se cargarán los cursos y módulos dinámicamente con JavaScript -->
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

<!-- Modal para agregar Material -->
<div id="materialModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 ml-auto sm:mx-auto sm:max-w-md sm:p-6 sm:mt-32">
        <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Agregar Material</h2>
        <form onsubmit="event.preventDefault(); enviarMaterial();">
            <input type="hidden" id="modalIdModulo">
            <div class="mb-4">
                <label for="materialNombre" class="block text-gray-700">Nombre del Material</label>
                <input type="text" id="materialNombre" class="w-full p-2 border rounded text-sm sm:text-base" required>
            </div>
            <div class="mb-4">
                <label for="materialArchivo" class="block text-gray-700">Seleccionar Archivo</label>
                <input type="file" id="materialArchivo" class="w-full p-2 border rounded text-sm sm:text-base" required>
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" onclick="closeMaterialModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded">Cancelar</button>
                <button type="submit" class="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded">Enviar</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para asignar Actividad -->
<div id="actividadModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 ml-auto sm:mx-auto sm:max-w-md sm:p-6 sm:mt-32">
        <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Asignar Actividad</h2>
        <form onsubmit="event.preventDefault(); enviarActividad();">
            <input type="hidden" id="actividadIdModulo">
            <div class="mb-4">
                <label for="actividadTitulo" class="block text-gray-700">Título de la Actividad</label>
                <input type="text" id="actividadTitulo" class="w-full p-2 border rounded text-sm sm:text-base" required>
            </div>
            <div class="mb-4">
                <label for="actividadDescripcion" class="block text-gray-700">Descripción</label>
                <textarea id="actividadDescripcion" class="w-full p-2 border rounded text-sm sm:text-base" rows="3"></textarea>
            </div>
            <div class="mb-4">
                <label for="actividadFechaVencimiento" class="block text-gray-700">Fecha de Vencimiento</label>
                <input type="date" id="actividadFechaVencimiento" class="w-full p-2 border rounded text-sm sm:text-base" required>
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" onclick="closeActividadModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded">Cancelar</button>
                <button type="submit" class="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded">Enviar</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para mostrar materiales y actividades -->
<div id="moduloModal" style="display: none;" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white p-4 rounded-lg w-full max-w-xs mx-4 sm:max-w-lg lg:max-w-2xl lg:w-2/3 sm:p-6 lg:mx-auto lg:my-auto lg:mt-20">
        <h2 class="text-lg sm:text-xl font-semibold mb-4 text-center">Materiales y Actividades del Módulo</h2>

        <div class="overflow-y-auto max-h-80 p-4">
            <!-- Contenedor de Materiales -->
            <div id="materialContainer" class="space-y-4 mb-6">
                <!-- Aquí se cargarán los materiales dinámicamente -->
            </div>

            <!-- Contenedor de Actividades -->
            <div id="actividadContainer" class="space-y-4">
                <!-- Aquí se cargarán las actividades dinámicamente -->
            </div>
        </div>

        <div class="flex justify-center sm:justify-end mt-4">
            <button onclick="closeMaterialActividadModal()" class="bg-gray-300 text-gray-800 px-3 py-1 sm:px-5 sm:py-3 text-sm sm:text-base rounded">Cerrar</button>
        </div>
    </div>
</div>


<!-- Modal de Actualización de Actividad -->
<div id="modalActualizarActividad" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden z-50">
    <div class="bg-white w-11/12 max-w-md mx-auto rounded shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Actualizar Actividad</h2>
        <input type="hidden" id="actividadIdActualizar">
        <input type="hidden" id="actividadModuloIdActualizar">
        
        <label for="actividadTituloActualizar" class="block text-sm font-medium text-gray-700">Nuevo Título</label>
        <input id="actividadTituloActualizar" type="text" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Título de la Actividad">
        
        <label for="actividadDescripcionActualizar" class="block text-sm font-medium text-gray-700 mt-4">Nueva Descripción</label>
        <textarea id="actividadDescripcionActualizar" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="3"></textarea>
        
        <label for="actividadFechaVencimientoActualizar" class="block text-sm font-medium text-gray-700 mt-4">Nueva Fecha de Vencimiento</label>
        <input id="actividadFechaVencimientoActualizar" type="date" class="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
        
        <div class="flex justify-end mt-6 space-x-4">
            <button onclick="cerrarModal('modalActualizarActividad')" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            <button onclick="guardarActividadActualizada()" class="bg-indigo-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
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

    <!-- Incluir el script para manejar la carga de cursos, módulos, y modales -->
    <script type="module" src="../../js/agregarMaterialDocente.js"></script>
</body>
</html>
