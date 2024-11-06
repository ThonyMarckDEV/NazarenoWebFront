import API_BASE_URL from './urlHelper.js';

const token = localStorage.getItem("jwt");

// Obtener `idUsuario` desde el token
function getIdUsuarioFromToken() {
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.idUsuario;
}

// Función para cargar cursos
function loadCursos() {
    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) {
        showNotification("No se encontró el ID del docente en el token.", "bg-red-500");
        return;
    }

    fetch(`${API_BASE_URL}/api/docente/${idDocente}/cursos`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("cursosContainer");
        container.innerHTML = ""; 

        data.data.forEach(curso => {
            if (!curso.idCurso) {
                console.warn("idCurso no está definido en el curso:", curso);
                showNotification("Error: idCurso no existe para un curso", "bg-red-500");
                return;
            }
        
            const courseCard = document.createElement("div");
            courseCard.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4");
            courseCard.id = `curso-${curso.idCurso}`; // Agrega un ID único al elemento del curso
            courseCard.dataset.nombreCurso = curso.nombreCurso; // Almacena nombre del curso
            courseCard.dataset.seccion = curso.seccion; // Almacena sección
            courseCard.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">${curso.nombreCurso}</h3>
                    <p class="text-sm text-gray-600">Grado: ${curso.nombreGrado} - Sección: ${curso.seccion}</p>
                </div>
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center sm:items-center">
                    <button onclick="openEstudiantesModal(${curso.idCurso})" class="text-gray-500 hover:text-gray-600 text-sm sm:text-base no-underline">
                        Estudiantes matriculados
                    </button>
                    <div class="flex justify-center w-full sm:w-auto">
                        <button onclick="seleccionarCurso(${curso.idCurso})" class="bg-black text-white px-3 py-1 rounded w-full sm:w-auto">
                            Ver Módulos
                        </button>
                    </div>
                </div>
            </div>
        `;
        
            container.appendChild(courseCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los cursos:", error);
        showNotification("Error al cargar los cursos", "bg-red-500");
    });
}

// Función para marcar el curso seleccionado
function seleccionarCurso(idCurso) {
    // Remueve la clase 'curso-seleccionado' de cualquier otro curso
    document.querySelectorAll(".curso-seleccionado").forEach(element => {
        element.classList.remove("curso-seleccionado");
    });

    // Agrega la clase 'curso-seleccionado' al curso actualmente seleccionado
    const cursoSeleccionado = document.querySelector(`#curso-${idCurso}`);
    if (cursoSeleccionado) {
        cursoSeleccionado.classList.add("curso-seleccionado");
    }

    openModulosModal(idCurso);
}

function loadModulos(idCurso) {
    console.log("Cargando módulos para idCurso:", idCurso);
    if (!idCurso) {
        showNotification("Error: idCurso no está definido en loadModulos", "bg-red-500");
        return;
    }


    fetch(`${API_BASE_URL}/api/curso/${idCurso}/modulos`, {
        headers: { 'Authorization': `Bearer ${token}`, "ngrok-skip-browser-warning": "69420" }
    })
    .then(response => response.json())
    .then(data => {
        const moduloContainer = document.getElementById("moduloContainer");
        moduloContainer.innerHTML = ""; 

        data.data.forEach(modulo => {
            const moduloCard = document.createElement("div");
            moduloCard.id = `modulo-${modulo.idModulo}`; // Asignar un id único a cada módulo
            moduloCard.dataset.nombreModulo = modulo.nombre; // Almacenar nombre del módulo

            moduloCard.classList.add(
                "bg-gray-200",
                "rounded-lg",
                "shadow-md",
                "text-sm",
                "p-2",
                "sm:p-4",
                "mb-2",
                "sm:mb-4"
            );

            moduloCard.innerHTML = `
            <div>
                <span class="font-semibold block">${modulo.nombre}</span>
                <div class="flex flex-row sm:flex-row space-x-2 mt-1 sm:mt-2">
                    <button onclick="openMaterialModal(${modulo.idModulo})" 
                        class="bg-black text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-base">
                        Agregar Material
                    </button>
                    <button onclick="openActividadModal(${modulo.idModulo})" 
                        class="bg-gray-300 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-base">
                        Asignar Actividad
                    </button>
                    <button onclick="verModulo(${modulo.idModulo})" 
                        class="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-base">
                        Ver Módulo
                    </button>
                </div>
            </div>
        `;
        moduloContainer.appendChild(moduloCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los módulos:", error);
        showNotification("Error al cargar los módulos", "bg-red-500");
    });
}


function openModulosModal(idCurso) {
    console.log("Abriendo modal para idCurso:", idCurso);
    if (!idCurso) {
        showNotification("Error: idCurso no está definido en openModulosModal", "bg-red-500");
        return;
    }

    // Obtener el curso seleccionado
    const curso = document.querySelector(`#curso-${idCurso}`); // Asume que el curso tiene un id único en el HTML
    const nombreCurso = curso ? curso.dataset.nombreCurso : "";
    const seccion = curso ? curso.dataset.seccion : "";

    // Guardar nombreCurso y seccion en el modal de materiales
    const materialModal = document.getElementById("materialModal");
    if (materialModal) {
        materialModal.dataset.nombreCurso = nombreCurso;
        materialModal.dataset.seccion = seccion;
    }

    loadModulos(idCurso);
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "block";
}

// Cerrar modal de módulos
function closeModulosModal() {
    const modal = document.getElementById("modulosModal");
    if (modal) modal.style.display = "none";
}

// Abrir modal para agregar material
function openMaterialModal(idModulo) {
    const modal = document.getElementById("materialModal");
    if (!modal) {
        showNotification("Error: No se encontró el modal de Material en el DOM", "bg-red-500");
        return;
    }

    // Obtener el nombre del módulo desde la tarjeta de módulo
    const moduloElement = document.querySelector(`#modulo-${idModulo}`);
    const nombreModulo = moduloElement ? moduloElement.dataset.nombreModulo : "";

    // Guardar idModulo y nombre del módulo en el modal
    document.getElementById("modalIdModulo").value = idModulo;
    modal.dataset.nombreModulo = nombreModulo; // Almacenar el nombre del módulo

    // Mostrar el modal
    modal.style.display = "block";
}

function openActividadModal(idModulo) {
    const modal = document.getElementById("actividadModal");
    if (!modal) {
        showNotification("Error: No se encontró el modal de Actividad en el DOM", "bg-red-500");
        return;
    }

    // Obtener el nombre del módulo desde la tarjeta de módulo
    const moduloElement = document.querySelector(`#modulo-${idModulo}`);
    const nombreModulo = moduloElement ? moduloElement.dataset.nombreModulo : "";

    // Obtener el curso seleccionado y sus datos
    const nombreCurso = document.querySelector(".curso-seleccionado").dataset.nombreCurso; // Asegúrate de agregar esta clase cuando el curso esté seleccionado
    const seccion = document.querySelector(".curso-seleccionado").dataset.seccion;

    // Guardar idModulo y nombre del módulo en el modal de actividades
    document.getElementById("actividadIdModulo").value = idModulo;
    modal.dataset.nombreCurso = nombreCurso;
    modal.dataset.seccion = seccion;
    modal.dataset.nombreModulo = nombreModulo;

    // Mostrar el modal de actividades
    modal.style.display = "block";
}

// Cerrar modal de actividad
function closeActividadModal() {
    limpiarCamposActividad(); // Llama a la función para limpiar los campos
    const modal = document.getElementById("actividadModal");
    if (modal) modal.style.display = "none";
}

// Función para limpiar los campos del modal de actividad
function limpiarCamposActividad() {
    document.getElementById("actividadTitulo").value = "";
    document.getElementById("actividadDescripcion").value = "";
    document.getElementById("actividadFechaVencimiento").value = "";
}

// Función para enviar actividad y crear un anuncio
function enviarActividad() {
    const idModulo = document.getElementById("actividadIdModulo").value;
    const titulo = document.getElementById("actividadTitulo").value;
    const descripcion = document.getElementById("actividadDescripcion").value;

    // Obtener la fecha actual en la zona horaria local
    const today = new Date();
    const fecha = today.toLocaleDateString('en-CA'); // Formato 'YYYY-MM-DD'

    const fechaVencimientoInput = document.getElementById("actividadFechaVencimiento");
    const fecha_vencimiento = fechaVencimientoInput ? fechaVencimientoInput.value : ""; 

    // Validar que la fecha de vencimiento no esté vacía
    if (!fecha_vencimiento) {
        showNotification("La fecha de vencimiento es requerida", "bg-red-500");
        return;
    }
    
    // Mostrar el loader al enviar el formulario
     document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/actividades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descripcion, fecha, fecha_vencimiento, idModulo })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
    })
    .then(data => {
        closeActividadModal(); // Cerrar el modal al enviar la actividad
        showNotification(data.message, "bg-green-500");
        limpiarCamposActividad(); // Llama a la función para limpiar los campos

        // Obtener los datos del curso y módulo para el anuncio
        const actividadModal = document.getElementById("actividadModal");
        const nombreCurso = actividadModal.dataset.nombreCurso;
        const seccion = actividadModal.dataset.seccion;
        const nombreModulo = actividadModal.dataset.nombreModulo;
        const idDocente = getIdUsuarioFromToken();

        // Validar que los datos estén presentes antes de enviar el anuncio
        if (!nombreCurso || !seccion || !nombreModulo) {
            showNotification("Faltan datos del curso, sección o módulo para el anuncio", "bg-red-500");
            return;
        }

        // Crear el mensaje de descripción para el anuncio
        const descripcionAnuncio = `El docente ha asignado una actividad en: ${nombreModulo}`;

        // Enviar el anuncio a la API
        fetch(`${API_BASE_URL}/api/anuncios`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                nombreCurso, 
                seccion, 
                descripcion: descripcionAnuncio, 
                idDocente 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor al enviar el anuncio');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showNotification("Anuncio creado correctamente", "bg-green-500");
            } else {
                showNotification("Error al crear el anuncio", "bg-red-500");
            }
        })
        .catch(error => {
            console.error('Error al enviar anuncio:', error);
            showNotification("Error al enviar anuncio", "bg-red-500");
        });
    })
    .catch(error => {
        console.error('Error al asignar actividad:', error);
        showNotification("Error al enviar actividad", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}


// Función para enviar material y crear un anuncio
function enviarMaterial() {
    const idModulo = document.getElementById("modalIdModulo").value;
    const nombre = document.getElementById("materialNombre").value;
    const archivo = document.getElementById("materialArchivo").files[0];
    const idDocente = getIdUsuarioFromToken();

    if (!archivo) {
        showNotification("Selecciona un archivo para subir", "bg-red-500");
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('archivo', archivo);
    formData.append('idModulo', idModulo);

    // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/materiales`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor al enviar material");
        }
        return response.json();
    })
    .then(data => {
        closeMaterialModal();
        showNotification(data.message, "bg-green-500");
        limpiarCamposMaterial();

        // Construir la información para el anuncio
        const extension = archivo.name.split('.').pop(); // Obtener extensión del archivo
        const nombreConExtension = `${nombre}.${extension}`; // Nombre del archivo con extensión
        const descripcion = `Material agregado: ${nombreConExtension}`;

        // Definir materialModal aquí para asegurar que esté inicializado
        const materialModal = document.getElementById("materialModal");
        const nombreCurso = materialModal.dataset.nombreCurso;
        const seccion = materialModal.dataset.seccion;
        const nombreModulo = materialModal.dataset.nombreModulo; // Obtener nombre del módulo

        // Verificar que los datos estén presentes
        if (!nombreCurso || !seccion || !nombreModulo) {
            showNotification("Faltan datos del curso, sección o módulo para el anuncio", "bg-red-500");
            return;
        }


        // Enviar anuncio automáticamente
        fetch(`${API_BASE_URL}/api/anuncios`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                nombreCurso, 
                seccion, 
                descripcion: `${descripcion} , en: ${nombreModulo}`, 
                idDocente 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor al enviar el anuncio');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showNotification("Anuncio creado correctamente", "bg-green-500");
            } else {
                showNotification("Error al crear el anuncio", "bg-red-500");
            }
        })
        .catch(error => {
            console.error('Error al enviar anuncio:', error);
            showNotification("Error al enviar anuncio", "bg-red-500");
        });
    })
    .catch(error => {
        console.error("Error al agregar material:", error);
        showNotification("Error al agregar material", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

// Función para limpiar los campos del modal de material
function limpiarCamposMaterial() {
    document.getElementById("materialNombre").value = "";
    document.getElementById("materialArchivo").value = "";
}

// Cerrar modal de material
function closeMaterialModal() {
    const modal = document.getElementById("materialModal");
    if (modal) modal.style.display = "none";
}

// Define una variable global al principio de tu archivo JavaScript
let currentModuloId = null;

function verModulo(idModulo) {
    currentModuloId = idModulo; // Actualiza el id actual del módulo
    const materialContainer = document.getElementById("materialContainer");
    const actividadContainer = document.getElementById("actividadContainer");

    if (!materialContainer || !actividadContainer) {
        console.error("Los contenedores de materiales y actividades no están en el DOM.");
        return;
    }

    materialContainer.innerHTML = "<h3 class='font-semibold text-lg mb-2'>Materiales:</h3>";
    actividadContainer.innerHTML = "<h3 class='font-semibold text-lg mb-2'>Actividades:</h3>";

    // Cargar materiales
    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/materialesAsignadas`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(material => {
            const materialCard = document.createElement("div");
            materialCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "mb-4", "flex", "items-center", "justify-between");

            const extensionArchivo = material.ruta.split('.').pop();
            const nombreConExtension = `${material.nombre}.${extensionArchivo}`;
            const rutaCompletaMaterial = `${API_BASE_URL}/api/descargar/${encodeURIComponent(material.ruta)}`;

            materialCard.innerHTML = `
                <div class="flex items-center space-x-4">
                    <span class="font-semibold text-gray-800">${nombreConExtension}</span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="eliminarMaterial(${material.idMaterial}, ${idModulo})" class="bg-red-500 text-white p-2 rounded">
                        Eliminar
                    </button>
                </div>
            `;
            materialContainer.appendChild(materialCard);
        });
    })
    .catch(error => console.error("Error al cargar los materiales:", error));

    // Cargar actividades
    fetch(`${API_BASE_URL}/api/modulo/${idModulo}/actividadesAsignadas`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        data.data.forEach(actividad => {
            const actividadCard = document.createElement("div");
            actividadCard.classList.add(
                "bg-gray-100",
                "rounded-lg",
                "shadow-md",
                "p-4",
                "mb-4",
                "flex",
                "flex-col"
            );
            
            actividadCard.innerHTML = `
                <div>
                    <h3 class="font-semibold text-gray-800">${actividad.titulo}</h3>
                    <p class="text-gray-700">${actividad.descripcion}</p>
                    <p class="text-sm text-gray-600"><strong>Fecha de Entrega:</strong> ${actividad.fecha_vencimiento}</p>
                </div>
                <div class="flex flex-nowrap space-x-2 mt-4">
                    <button onclick="eliminarActividad(${actividad.idActividad}, ${idModulo})" class="bg-red-500 text-white px-2 py-1 rounded text-sm flex-shrink-0">
                        Eliminar
                    </button>
                    <button onclick="abrirModalActualizarActividad(${actividad.idActividad}, ${idModulo}, '${actividad.titulo}', '${actividad.descripcion}', '${actividad.fecha_vencimiento}')" class="bg-yellow-500 text-white px-2 py-1 rounded text-sm flex-shrink-0">
                        Actualizar
                    </button>
                </div>
            `;
            actividadContainer.appendChild(actividadCard);
        });
    })
    .catch(error => console.error("Error al cargar las actividades:", error));

    const modal = document.getElementById("moduloModal");
    if (modal) modal.style.display = "block";
}

function eliminarMaterial(idMaterial) {
    if (!idMaterial) {
        console.error("idMaterial no definido");
        showNotification("Error: idMaterial no está definido", "bg-red-500");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este material?")) return;

    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/material/${idMaterial}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar el material");
        return response.json();
    })
    .then(data => {
        showNotification(data.message, "bg-green-500");
        verModulo(currentModuloId); // Recargar el módulo para reflejar los cambios
    })
    .catch(error => {
        console.error("Error al eliminar el material:", error);
        showNotification("Error al eliminar el material", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

function eliminarActividad(idActividad) {
    if (!idActividad) {
        console.error("idActividad no definido");
        showNotification("Error: idActividad no está definido", "bg-red-500");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar esta actividad?")) return;

    // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/actividad/${idActividad}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar la actividad");
        return response.json();
    })
    .then(data => {
        showNotification(data.message, "bg-green-500");
        verModulo(currentModuloId); // Recargar el módulo para reflejar los cambios
    })
    .catch(error => {
        console.error("Error al eliminar la actividad:", error);
        showNotification("Error al eliminar la actividad", "bg-red-500");
    })    
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}

function guardarActividadActualizada() {
    const idActividad = document.getElementById("actividadIdActualizar").value;
    const idModulo = document.getElementById("actividadModuloIdActualizar").value;
    const titulo = document.getElementById("actividadTituloActualizar").value;
    const descripcion = document.getElementById("actividadDescripcionActualizar").value;
    const fecha_vencimiento = document.getElementById("actividadFechaVencimientoActualizar").value;

    console.log("Datos para enviar a actualizarActividad:", { titulo, descripcion, fecha_vencimiento });
    
    // Mostrar el loader al enviar el formulario
    document.getElementById("loadingScreen").classList.remove("hidden");

    fetch(`${API_BASE_URL}/api/actualizaractividad/${idActividad}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descripcion, fecha_vencimiento })
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al actualizar la actividad");
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification(data.message, "bg-green-500");
            cerrarModal('modalActualizarActividad');
            verModulo(idModulo);
        } else {
            showNotification(data.message, "bg-red-500");
        }
    })
    .catch(error => {
        console.error("Error al actualizar la actividad:", error);
        showNotification("Error al actualizar la actividad", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
   });
}


function abrirModalActualizarActividad(idActividad, idModulo, tituloActual, descripcionActual, fechaActual) {
    document.getElementById("actividadIdActualizar").value = idActividad;
    document.getElementById("actividadModuloIdActualizar").value = idModulo;
    document.getElementById("actividadTituloActualizar").value = tituloActual;
    document.getElementById("actividadDescripcionActualizar").value = descripcionActual;
    document.getElementById("actividadFechaVencimientoActualizar").value = fechaActual;

    document.getElementById("modalActualizarActividad").classList.remove("hidden");
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");

    if (modalId === 'modalActualizarActividad') {
        // Limpiar los campos del modal de actualización
        document.getElementById("actividadTituloActualizar").value = '';
        document.getElementById("actividadDescripcionActualizar").value = '';
        document.getElementById("actividadFechaVencimientoActualizar").value = '';
    } else if (modalId === 'actividadModal') {
        // Limpiar los campos del modal de creación de actividad
        document.getElementById("actividadTitulo").value = '';
        document.getElementById("actividadDescripcion").value = '';
        document.getElementById("actividadFechaVencimiento").value = '';
    }
}

function closeMaterialActividadModal() {
    const modal = document.getElementById("moduloModal");
    if (modal) modal.style.display = "none";
}

// Función asincrónica para cargar la foto de perfil
async function loadFotoPerfil(idUsuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/alumnos/${idUsuario}/foto-perfil`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Retorna la URL completa de la foto de perfil proporcionada por Laravel o null si no existe
        return data.data.perfil || null;
    } catch (error) {
        console.error("Error al cargar la foto de perfil:", error);
        return null; // En caso de error, regresa null sin ruta predeterminada
    }
}

// Función para abrir el modal de estudiantes matriculados
function openEstudiantesModal(idCurso) {
    const modal = document.getElementById("estudiantesModal");
    const estudiantesContainer = document.getElementById("estudiantesContainer");

    // Mostrar el "loading screen" antes de cargar estudiantes
    document.getElementById("loadingScreen").classList.remove("hidden");

    // Mostrar el modal
    modal.classList.remove("hidden");

    // Limpiar contenido previo
    estudiantesContainer.innerHTML = "<p class='text-center text-gray-600'>Cargando estudiantes...</p>";

    // Obtener idDocente desde el token
    const idDocente = getIdUsuarioFromToken();
    if (!idDocente) {
        estudiantesContainer.innerHTML = "<p class='text-center text-red-500'>Error de autenticación.</p>";
        document.getElementById("loadingScreen").classList.add("hidden"); // Ocultar el loading screen en caso de error
        return;
    }

    // Realizar la petición a la API para obtener estudiantes
    fetch(`${API_BASE_URL}/api/cursos/${idCurso}/estudiantes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420"
        }
    })
    .then(response => response.json())
    .then(data => {
        estudiantesContainer.innerHTML = ""; // Limpiar el mensaje de carga

        if (data.success && data.data.length > 0) {
            // Crear una lista de promesas para cargar todas las fotos de perfil
            const cargarEstudiantes = data.data.map(async (estudiante) => {
                const estudianteCard = document.createElement("div");

                // Añadir clases para una disposición horizontal y tamaño adecuado
                estudianteCard.classList.add("flex", "items-center", "space-x-4", "p-2", "border-b");

                // Crear la imagen de perfil
                const perfilImg = document.createElement("img");
                perfilImg.classList.add("w-10", "h-10", "rounded-full", "object-cover", "cursor-pointer");
                perfilImg.alt = `${estudiante.nombreCompleto}`;

                // Obtener la foto de perfil del estudiante usando su idUsuario
                const fotoPerfil = await loadFotoPerfil(estudiante.idUsuario);
                perfilImg.src = fotoPerfil ? fotoPerfil : `${window.location.origin}/img/default-profile.jpg`;

                // Añadir evento para abrir la imagen en el modal ampliado
                perfilImg.onclick = () => openImageModal(perfilImg.src);

                // Crear el contenedor de información
                const infoContainer = document.createElement("div");
                infoContainer.classList.add("flex", "flex-col");

                // Añadir el nombre y el departamento
                const nombre = document.createElement("p");
                nombre.classList.add("text-sm", "sm:text-base", "font-semibold");
                nombre.textContent = estudiante.nombreCompleto;

                const departamento = document.createElement("p");
                departamento.classList.add("text-sm", "text-gray-600");
                departamento.textContent = estudiante.departamento;

                // Añadir los elementos al contenedor de información
                infoContainer.appendChild(nombre);
                infoContainer.appendChild(departamento);

                // Añadir la imagen y la información al contenedor de estudiante
                estudianteCard.appendChild(perfilImg);
                estudianteCard.appendChild(infoContainer);

                // Añadir la tarjeta al contenedor de estudiantes
                estudiantesContainer.appendChild(estudianteCard);
            });

            // Esperar a que todas las fotos de perfil de los estudiantes se hayan cargado
            return Promise.all(cargarEstudiantes);
        } else {
            estudiantesContainer.innerHTML = "<p class='text-center text-gray-600'>No hay estudiantes matriculados en este curso.</p>";
        }
    })
    .catch(error => {
        console.error("Error al obtener estudiantes:", error);
        estudiantesContainer.innerHTML = "<p class='text-center text-red-500'>Error al cargar los estudiantes.</p>";
    })
    .finally(() => {
        // Ocultar el "loading screen" después de que todos los estudiantes y sus fotos hayan cargado
        document.getElementById("loadingScreen").classList.add("hidden");
    });
}

// Función para abrir el modal de imagen ampliada
function openImageModal(imageSrc) {
    document.getElementById("modalProfileImage").src = imageSrc;
    document.getElementById("imageModal").classList.remove("hidden");
}

// Función para cerrar el modal de imagen ampliada
function closeImageModal() {
    document.getElementById("imageModal").classList.add("hidden");
}

// Función para cerrar el modal de estudiantes matriculados
function closeEstudiantesModal() {
    document.getElementById("estudiantesModal").classList.add("hidden");
}

// Función para mostrar notificaciones
function showNotification(message, bgColor) {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white font-semibold text-center ${bgColor} rounded shadow-md`;
    notification.style.display = "block";

    setTimeout(() => { 
        notification.style.display = "none"; 
    }, 5000); // Ocultar después de 5 segundos
}



// Cargar cursos al iniciar la página
document.addEventListener("DOMContentLoaded", loadCursos);

// Hacer funciones accesibles en el ámbito global
window.openModulosModal = openModulosModal;
window.closeModulosModal = closeModulosModal;
window.openMaterialModal = openMaterialModal;
window.openActividadModal = openActividadModal;
window.closeMaterialModal = closeMaterialModal;
window.closeActividadModal = closeActividadModal;
window.enviarActividad = enviarActividad;
window.enviarMaterial = enviarMaterial;
window.eliminarMaterial = eliminarMaterial;
window.eliminarActividad = eliminarActividad;
window.closeMaterialActividadModal = closeMaterialActividadModal;
window.seleccionarCurso = seleccionarCurso;
window.verModulo = verModulo;
window.abrirModalActualizarActividad = abrirModalActualizarActividad;
window.cerrarModal = cerrarModal;
window.guardarActividadActualizada = guardarActividadActualizada;
// Hacer las nuevas funciones accesibles globalmente
window.openEstudiantesModal = openEstudiantesModal;
window.closeEstudiantesModal = closeEstudiantesModal;
window.closeImageModal = closeImageModal;