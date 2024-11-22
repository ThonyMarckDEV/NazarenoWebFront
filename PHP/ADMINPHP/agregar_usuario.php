<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1, minimum-scale=1">
    <title>Agregar Usuario</title>
    <link rel="icon" href="../../img/C.E.B.E.LOGO.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        /* Imagen de fondo */
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
        <h2 class="text-2xl font-semibold mb-6 text-white mt-1">Agregar Usuario</h2>

        <!-- Formulario -->
        <form id="userForm" class="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 w-full md:w-auto sm:mx-auto"> <!-- Tamaño más pequeño en móviles -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

         <!-- Nombre de Usuario (Solo lectura) -->
            <div>
                <label for="username" class="block text-gray-700 font-semibold">Nombre de Usuario</label>
                <input type="text" id="username" name="username" readonly class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed focus:outline-none">
            </div>

            <!-- Rol (Obligatorio) -->
            <div>
                <label for="rol" class="block text-gray-700 font-semibold">Rol</label>
                <select id="rol" name="rol" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="admin">admin</option>
                    <option value="estudiante">estudiante</option>
                    <option value="docente">docente</option>
                </select>
            </div>

            <!-- Nombres (Obligatorio) -->
            <div>
                <label for="nombres" class="block text-gray-700 font-semibold">Nombres <span class="text-red-500">*</span></label>
                <input type="text" id="nombres" name="nombres" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

           <!-- Apellidos (Obligatorio) -->
            <div>
                <label for="apellidos" class="block text-gray-700 font-semibold">Apellidos <span class="text-red-500">*</span></label>
                <input 
                    type="text" 
                    id="apellidos" 
                    name="apellidos" 
                    required 
                    pattern="^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)+$" 
                    title="Debe ingresar dos apellidos separados por un espacio" 
                    class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
            </div>

            <!-- DNI (Obligatorio) -->
            <div>
                <label for="dni" class="block text-gray-700 font-semibold">DNI <span class="text-red-500">*</span></label>
                <input 
                    type="text" 
                    id="dni" 
                    name="dni" 
                    maxlength="8" 
                    required 
                    pattern="\d{8}" 
                    class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                >
            </div>

            <!-- Correo (Obligatorio) -->
            <div>
                <label for="correo" class="block text-gray-700 font-semibold">Correo <span class="text-red-500">*</span></label>
                <input type="email" id="correo" name="correo" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Edad (Opcional) -->
            <div>
                <label for="edad" class="block text-gray-700 font-semibold">Edad <span class="text-gray-500">(Opcional)</span></label>
                <input type="text" id="edad" name="edad" class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Teléfono (Opcional) -->
            <div>
                <label for="telefono" class="block text-gray-700 font-semibold">Teléfono <span class="text-gray-500">(Opcional)</span></label>
                <input 
                    type="text" 
                    id="telefono" 
                    name="telefono" 
                    maxlength="9" 
                    pattern="\d{9}" 
                    class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                >
            </div>


                <!-- Departamento -->
                <div>
                    <label for="departamento" class="block text-gray-700 font-semibold">Departamento (Opcional)</label>
                    <select id="departamento" name="departamento" required class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccione un Departamento</option>
                        <option value="Amazonas">Amazonas</option>
                        <option value="Áncash">Áncash</option>
                        <option value="Apurímac">Apurímac</option>
                        <option value="Arequipa">Arequipa</option>
                        <option value="Ayacucho">Ayacucho</option>
                        <option value="Cajamarca">Cajamarca</option>
                        <option value="Callao">Callao</option>
                        <option value="Cusco">Cusco</option>
                        <option value="Huancavelica">Huancavelica</option>
                        <option value="Huánuco">Huánuco</option>
                        <option value="Ica">Ica</option>
                        <option value="Junín">Junín</option>
                        <option value="La Libertad">La Libertad</option>
                        <option value="Lambayeque">Lambayeque</option>
                        <option value="Lima">Lima</option>
                        <option value="Loreto">Loreto</option>
                        <option value="Madre de Dios">Madre de Dios</option>
                        <option value="Moquegua">Moquegua</option>
                        <option value="Pasco">Pasco</option>
                        <option value="Piura">Piura</option>
                        <option value="Puno">Puno</option>
                        <option value="San Martín">San Martín</option>
                        <option value="Tacna">Tacna</option>
                        <option value="Tumbes">Tumbes</option>
                        <option value="Ucayali">Ucayali</option>
                    </select>
                </div>

               <!-- Contraseña (Obligatoria) -->
                <div>
                    <label for="password" class="block text-gray-700 font-semibold">
                        Contraseña <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        minlength="8" 
                        class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mínimo 6 caracteres"
                    >
                </div>

                <!-- Confirmar Contraseña (Obligatoria) -->
                <div>
                    <label for="password_confirmation" class="block text-gray-700 font-semibold">
                        Confirmar Contraseña <span class="text-red-500">*</span>
                    </label>
                    <input 
                        type="password" 
                        id="password_confirmation" 
                        name="password_confirmation" 
                        required 
                        minlength="8" 
                        class="w-full px-2 py-1 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Repite la contraseña"
                    >
                </div>

            </div>

            <!-- Botón de Enviar -->
            <button type="button" onclick="submitForm()" class="w-full bg-black text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                Registrar Usuario
            </button>
        </form>


        <!-- Tabla de Usuarios -->
        <h3 class="text-xl font-semibold mb-4 mt-10 text-white">Listado de Usuarios</h3>

        
        <!-- Campo de búsqueda -->
        <div class="mb-4">
            <input type="text" id="searchInput" placeholder="Buscar usuarios..." class="border p-2 rounded w-full sm:w-1/2">
        </div>
        
        <div class="overflow-x-auto sm:px-4">
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm sm:text-base">
                <thead>
                    <tr class="bg-gray-200 text-gray-600 uppercase leading-normal">
                        <th class="p-2 sm:p-3 text-left">ID</th>
                        <th class="p-2 sm:p-3 text-left">Nombre de Usuario</th>
                        <th class="p-2 sm:p-3 text-left">Rol</th>
                        <th class="p-2 sm:p-3 text-left">Correo</th>
                        <th class="p-2 sm:p-3 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody id="userTableBody" class="text-gray-700 font-light">
                    <!-- Contenido dinámico generado por JavaScript -->
                </tbody>
            </table>
        </div>


    </div>
    <!-- Script para enviar datos en formato JSON -->
    <script type="module" src="../../js/register.js"></script>
    <!-- Script para listar, eliminar y editar usuarios -->
    <script type="module" src="../../js/gestionarUsuarios.js"></script>
</body>
</html>
