<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <title>Panel de Docente</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            background-image: url('../../img/cebe.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100%; /* Para asegurar la altura total */
        }
    </style>
</head>
<body class="background-image min-h-screen flex flex-col">

    <!-- Sidebar -->
    <?php include 'sidebarDOCENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-4">
        <!-- Bloque con fondo para el texto de bienvenida -->
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold">Bienvenido, <span id="usernameDisplay"></span></h2>
            <p class="mt-2">Has ingresado al panel de Docente.</p>
        </div>
    </div>
</body>
</html>
