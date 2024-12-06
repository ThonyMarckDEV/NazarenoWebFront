<script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
<!-- sidebar.php -->
<div class="w-38 sm:w-64 bg-white shadow-md min-h-screen px-3 sm:px-6 py-4"> <!-- Ajuste de ancho a w-36 solo en móviles -->
    <div class="flex items-center space-x-4">
        <a href="Estudiante.php"><img src="../../img/C.E.B.E.LOGO.png" alt="Logo" class="h-10 w-10"></a>
        <a href="Estudiante.php"><h1 class="text-xl font-bold">C.E.B.E</h1></a>
    </div>
    <hr class="my-4 border-gray-300">

    <!-- Menu items -->
    <ul class="space-y-4">
        <li>
            <a href="perfilEstudiante.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/perfil.png" alt="Agregar Usuarios" class="w-5 h-5">
                <span>Perfil</span>
            </a>
        </li>
        <li>
            <a href="anuncios.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded relative">
                <img src="../../img/anunciar.png" alt="Agregar Especialidad" class="w-5 h-5">
                <span>Anuncios</span>
                <span id="contadorAnuncios" class="absolute top-2 right-0 transform translate-y-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center hidden">0</span>
            </a>
        </li>
        <li>
            <a href="cursos.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/tareas.png" alt="Agregar Cursos" class="w-5 h-5">
                <span>Cursos</span>
            </a>
        </li>
        <li>
            <a href="calificaciones.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded relative">
                <img src="../../img/calificaciones.png" alt="" class="w-5 h-5">
                <span>calificaciones</span>
                <span id="contadorCalificaciones" class="absolute top-2 right-0 transform translate-y-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center hidden">0</span>
            </a>
        </li>
        <li>
            <a onclick="logout()" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded cursor-pointer">
                <img src="../../img/logout.png" alt="Cerrar Sesión" class="w-5 h-5">
                <span>Cerrar Sesión</span>
            </a>
        </li>
    </ul>
</div>
<!-- Incluir el Modal de Inactividad -->
<?php include '../inactivity.php'; ?>
<!-- <script Checka inactyividad Usuario></script> -->
<script type="module" src="../../js/checkInactivity.js"></script>
  <!-- Loader -->
  <?php include '../loader.php'; ?>
<!-- Overlay de Carga Fijo -->
<div id="loadingOverlay" class="fixed inset-0 flex items-center justify-center bg-white hidden z-50" style="width: 100vw; height: 100vh;">
        <img src="../../img/loading.gif" alt="Cargando..." class="w-20 h-20"> <!-- Tamaño fijo del GIF -->
</div>
<script src="../../js/loadingOverlay.js"></script>
<!-- Incluir el script de autenticación y el script para el botón de menú -->
<!-- Incluir el script de autenticación y el script para el botón de menú -->
<script type="module" src="../../js/checkRoleandtokenInterval.js"></script>
<!-- Script para manejar el cierre de sesión -->
<script type="module" src="../../js/logout.js"></script>
<!-- Script para actualizar el contador de anuncios no vistos -->
<script type="module" src="../../js/contadorAnuncios.js"></script>
<!-- Cargar el archivo JavaScript en todas las páginas -->
<script type="module"  src="../../js/lastActivity.js"></script>
<!-- Script para actualizar el contador de anuncios no vistos -->
<script type="module" src="../../js/contadorCalificaciones.js"></script>
<!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/click-sound.js"></script>
<!-- Incluir el script al final del body para mejorar la carga -->
<script type="module" src="../../js/typing-sound.js"></script>