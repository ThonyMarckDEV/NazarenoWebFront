<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Docente</title>
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        /* Estilos para la imagen de fondo */
        .background-image {
            background-image: url('../../img/cebe.jpeg'); /* Cambia la ruta de la imagen */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        /* Fondo suave detrás del bloque de texto */
        .highlighted-text {
            background-color: rgba(0, 0, 0, 0.6); /* Fondo negro con opacidad */
            padding: 1rem; /* Espaciado alrededor del texto */
            border-radius: 0.5rem; /* Bordes redondeados */
            display: inline-block; /* Ajusta el fondo solo al ancho del bloque de texto */
            color: white; /* Asegura que el texto sea blanco */
        }
    </style>
</head>
<body class="bg-gray-100 flex background-image">

    <!-- Sidebar -->
    <?php include 'sidebarDOCENTE.php'; ?>

    <!-- Contenido Principal -->
    <div class="flex-1 p-10 ml-0 md:ml-20 lg:ml-5">
        <!-- Bloque con fondo para el texto de bienvenida -->
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold">Bienvenido, <span id="usernameDisplay"></span></h2>
            <p class="mt-2">Has ingresado al panel de Docente.</p>
        </div>
    </div>
</body>
</html>
