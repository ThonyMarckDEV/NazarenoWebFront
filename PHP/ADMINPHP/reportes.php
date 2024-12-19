<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, minimum-scale=1">
    <title>Reportes</title>
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
<body class="background-image bg-gray-100 flex">

    <!-- Contenedor de Notificación -->
    <div id="notification" style="display: none;" class="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center rounded shadow-md"></div>

    <!-- Sidebar -->
    <?php include 'sidebarAdmin.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4 ml-0 md:ml-10 lg:ml-5">

        <div class="bg-white shadow-md rounded p-4">
            <h2 class="text-lg font-semibold mb-4">Listado de Grados</h2>
            <table class="table-auto w-full text-left border-collapse border border-gray-200">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="hidden">ID</th> <!-- Columna ID invisible -->
                        <th class="p-2 border border-gray-200">Nombre del Grado</th>
                        <th class="p-2 border border-gray-200">Nivel</th>
                        <th class="p-2 border border-gray-200">Sección</th>
                        <th class="p-2 border border-gray-200">Accion</th>
                    </tr>
                </thead>
                <tbody id="grado-table-body">
                    <!-- Los datos se llenarán dinámicamente aquí -->
                </tbody>
            </table>
        </div>

    </div>

    <!-- MODALES -->

    <div id="alumnos-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white rounded shadow-lg w-3/4 h-3/4 p-4 relative">
            <button id="close-modal" class="absolute top-2 right-2 text-gray-700 font-bold">X</button>
            <h3 class="text-lg font-semibold mb-4">Alumnos Matriculados</h3>
            <div class="overflow-y-auto h-4/5">
                <table class="table-auto w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="hidden">ID</th> <!-- ID del alumno, invisible -->
                            <th class="p-2 border border-gray-200">Foto</th>
                            <th class="p-2 border border-gray-200">Nombres</th>
                            <th class="p-2 border border-gray-200">Apellidos</th>
                            <th class="p-2 border border-gray-200">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="alumnos-table-body">
                        <!-- Los datos de alumnos se llenarán dinámicamente aquí -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

<!-- Modal notas geenrales de grado -->
    <div id="notas-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white rounded shadow-lg w-3/4 h-3/4 p-4 relative">
            <button id="close-notas-modal" class="absolute top-2 right-2 text-gray-700 font-bold">X</button>
            <h3 class="text-lg font-semibold mb-4">Notas Generales</h3>
            <!-- Botón Exportar como Excel -->
            <button id="exportar-excel" class="mb-4 bg-green-500 text-white px-4 py-2 rounded">Exportar como Excel</button>
            <div class="overflow-y-auto h-4/5">
                <table id="notas-table" class="table-auto w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-2 border border-gray-200">Foto</th>
                            <th class="p-2 border border-gray-200">Nombres</th>
                            <th class="p-2 border border-gray-200">Apellidos</th>
                            <th class="p-2 border border-gray-200">Actividad</th>
                            <th class="p-2 border border-gray-200">Nota</th>
                            <th class="p-2 border border-gray-200">Fecha Subida</th>
                            <th class="p-2 border border-gray-200">Fecha Vencimiento</th>
                            <th class="p-2 border border-gray-200">Curso</th>
                        </tr>
                    </thead>
                    <tbody id="notas-table-body">
                        <!-- Datos dinámicos -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Modal de Cursos de alumno-->
    <div id="cursos-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white rounded shadow-lg w-3/4 h-3/4 p-4 relative">
            <button id="close-cursos-modal" class="absolute top-2 right-2 text-gray-700 font-bold">X</button>
            <h3 class="text-lg font-semibold mb-4">Cursos del Alumno</h3>
            <div class="overflow-y-auto h-4/5">
                <table id="cursos-table" class="table-auto w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="hidden">ID Curso</th> <!-- ID del curso, invisible -->
                            <th class="p-2 border border-gray-200">Nombre del Curso</th>
                            <th class="p-2 border border-gray-200">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="cursos-table-body">
                        <!-- Datos dinámicos -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal de Notas del Curso -->
    <div id="notas-curso-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white rounded shadow-lg w-3/4 h-3/4 p-4 relative">
            <button id="close-notas-curso-modal" class="absolute top-2 right-2 text-gray-700 font-bold">X</button>
            <h3 id="modal-curso-title" class="text-lg font-semibold mb-4">Notas del Curso</h3>
            <div class="overflow-y-auto h-4/5">
                <table id="notas-curso-table" class="table-auto w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-2 border border-gray-200">Foto</th>
                            <th class="p-2 border border-gray-200">Nombres</th>
                            <th class="p-2 border border-gray-200">Apellidos</th>
                            <th class="p-2 border border-gray-200">Actividad</th>
                            <th class="p-2 border border-gray-200">Nota</th>
                            <th class="p-2 border border-gray-200">Fecha Subida</th>
                            <th class="p-2 border border-gray-200">Fecha Vencimiento</th>
                        </tr>
                    </thead>
                    <tbody id="notas-curso-table-body">
                        <!-- Datos dinámicos -->
                    </tbody>
                </table>
            </div>
            <!-- Botón Exportar como Excel -->
            <button id="exportar-notas-curso-excel" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Exportar como Excel</button>
        </div>
    </div>


    
    <!-- Script para excel -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <!-- Script para manejar verNotasGeneralesGrado -->
    <script type="module" src="../../js/verNotasGeneralesGrado.js"></script>
    <!-- Script para manejar verNotasGeneralesGrado -->
    <script type="module" src="../../js/veralumnos.js"></script>
</body>
</html>
