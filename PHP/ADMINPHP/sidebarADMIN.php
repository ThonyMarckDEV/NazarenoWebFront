<script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>
<!-- sidebar.php -->
<div class="w-36 sm:w-64 bg-white shadow-md min-h-screen px-3 sm:px-6 py-4"> <!-- Ajuste de ancho a w-36 solo en móviles -->
    <div class="flex items-center space-x-4">
        <a href="Admin.php"><img src="../../img/C.E.B.E.LOGO.png" alt="Logo" class="h-10 w-10"></a>
        <a href="Admin.php"><h1 class="text-xl font-bold">C.E.B.E</h1></a>
    </div>
    <hr class="my-4 border-gray-300">

    <!-- Menu items -->
    <ul class="space-y-4">
        <li>
            <a href="agregar_usuario.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/agregarusuario.png" alt="Agregar Usuarios" class="w-5 h-5">
                <span>Agregar Usuarios</span>
            </a>
        </li>
        <li>
            <a href="agregar_especialidad.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/addespecialidad.jpg" alt="Agregar Especialidad" class="w-5 h-5">
                <span>Agregar Especialidad</span>
            </a>
        </li>
        <li>
            <a href="agregar_curso.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/addcurso.jpg" alt="Agregar Cursos" class="w-5 h-5">
                <span>Agregar Cursos</span>
            </a>
        </li>
        <li>
            <a href="asignarEspecialidadDocente.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/asignar.png" alt="Asignar Especialidad Docente" class="w-5 h-5">
                <span>Asignar Especialidad Docente</span>
            </a>
        </li>
        <li>
            <a href="asignarAulaDocente.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/asignar.png" alt="Asignar Especialidad Docente" class="w-5 h-5">
                <span>Asignar Aula Docente</span>
            </a>
        </li>
        <li>
            <a href="matricularEstudiante.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/matricular.png" alt="Matricular Estudiante" class="w-5 h-5">
                <span>Matricular Estudiante</span>
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
  <!-- Loader -->
  <?php include '../loader.php'; ?>
<!-- Overlay de Carga Fijo -->
<div id="loadingOverlay" class="fixed inset-0 flex items-center justify-center bg-white hidden z-50" style="width: 100vw; height: 100vh;">
        <img src="../../img/loading.gif" alt="Cargando..." class="w-20 h-20"> <!-- Tamaño fijo del GIF -->
</div>
<script src="../../js/loadingOverlay.js"></script>
<!-- Incluir el script de autenticación y el script para el botón de menú -->
<!-- <script type="module" src="../../js/authAdmin.js"></script> -->
<script type="module" src="../../js/checkRole.js"></script>
<!-- Script para manejar el cierre de sesión -->
<script type="module" src="../../js/logout.js"></script>
<!-- Cargar el archivo JavaScript en todas las páginas -->
<script type="module" src="../../js/checkTokenInterval.js"></script>
<script type="module" src="../../js/lastActivity.js"></script>



