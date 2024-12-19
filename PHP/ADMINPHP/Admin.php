<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <title>Panel de Administración</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .background-image {
            background-image: url('../../img/cebe.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: fixed; /* Fija el fondo */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; /* Envía el fondo al fondo de la capa */
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
<body class=" flex">

  <!-- Fondo Fijo -->
  <div class="background-image"></div>

    <!-- Sidebar -->
    <?php include 'sidebarAdmin.php'; ?>

   <!-- Contenido Principal -->
    <div class="flex-1 p-4 ml-0 md:ml-10 lg:ml-5">
        <!-- Bloque con fondo para el texto de bienvenida -->
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold">Bienvenido, <span id="usernameDisplay"></span></h2>
            <p class="mt-2">Has ingresado al panel de Administrador.</p>
        </div>
    </div>
</body>
</html>
