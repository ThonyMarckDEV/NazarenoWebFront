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
                    <div>
                        <button onclick="seleccionarCurso(${curso.idCurso})" class="bg-black text-white px-3 py-1 rounded w-full sm:w-auto">Ver Módulos</button>
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

        // Mostrar el loader al enviar el formulario
        document.getElementById("loadingScreen").classList.remove("hidden");

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
                    </div>
                </div>
            `;
            moduloContainer.appendChild(moduloCard);
        });
    })
    .catch(error => {
        console.error("Error al cargar los módulos:", error);
        showNotification("Error al cargar los módulos", "bg-red-500");
    })
    .finally(()=>{
        // Ocultar el loader después de la operación
        document.getElementById("loadingScreen").classList.add("hidden");
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


// Cerrar modal de material
function closeMaterialModal() {
    const modal = document.getElementById("materialModal");
    if (modal) modal.style.display = "none";
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
                descripcion, 
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
window.seleccionarCurso = seleccionarCurso; // Añadir esta línea