<script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>

<!-- Botón de menú hamburguesa -->
<button id="toggleSidebar" class="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded shadow-lg sm:hidden">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>

<!-- Overlay para cerrar el menú -->
<div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden sm:hidden"></div>

<!-- sidebar.php -->
<div id="mobileSidebar" class="fixed inset-y-0 left-0 w-64 bg-white shadow-md transform -translate-x-full transition-transform duration-300 z-50 sm:translate-x-0 sm:static sm:w-64 sm:min-h-screen px-3 sm:px-6 py-4">
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
                <span>Asignar Especialidad al Docente</span>
            </a>
        </li>
        <li>
            <a href="asignarAulaDocente.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <img src="../../img/asignar.png" alt="Asignar Aula Docente" class="w-5 h-5">
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
            <a href="reportes.php" class="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6M4 6h16M4 6a2 2 0 012-2h12a2 2 0 012 2M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" />
                </svg>
                <span>Reportes</span>
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
<?php include '../loader.php'; ?>

<!-- Overlay de Carga Fijo -->
<div id="loadingOverlay" class="fixed inset-0 flex items-center justify-center bg-white hidden z-50" style="width: 100vw; height: 100vh;">
    <img src="../../img/loading.gif" alt="Cargando..." class="w-20 h-20">
</div>

<script src="../../js/loadingOverlay.js"></script>
<script type="module" src="../../js/checkRoleandtokenInterval.js"></script>
<script type="module" src="../../js/logout.js"></script>
<script type="module" src="../../js/lastActivity.js"></script>
<script type="module" src="../../js/click-sound.js"></script>
<script type="module" src="../../js/typing-sound.js"></script>
<script type="module" src="../../js/checkInactivity.js"></script>

<script>
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('overlay');

    const toggleSidebar = () => {
        const isOpen = sidebar.classList.contains('translate-x-0');
        if (isOpen) {
            sidebar.classList.replace('translate-x-0', '-translate-x-full');
            overlay.classList.add('hidden');
        } else {
            sidebar.classList.replace('-translate-x-full', 'translate-x-0');
            overlay.classList.remove('hidden');
        }
    };

    toggleSidebarButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
</script>