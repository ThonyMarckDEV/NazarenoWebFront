// alumnos.js

import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js'; // Descomenta si es necesario

document.addEventListener('DOMContentLoaded', async () => {

    const modal = document.querySelector('#alumnos-modal');
    const alumnosTableBody = document.querySelector('#alumnos-table-body');
    const closeModalButton = document.querySelector('#close-modal');

    const cursosModal = document.querySelector('#cursos-modal');
    const cursosTableBody = document.querySelector('#cursos-table-body');
    const closeCursosModalButton = document.querySelector('#close-cursos-modal');

    const notasCursoModal = document.querySelector('#notas-curso-modal');
    const notasCursoTableBody = document.querySelector('#notas-curso-table-body');
    const closeNotasCursoModalButton = document.querySelector('#close-notas-curso-modal');

    // Cerrar el modal de alumnos
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cerrar el modal de cursos
    closeCursosModalButton.addEventListener('click', () => {
        cursosModal.classList.add('hidden');
    });

    // Cerrar el modal de notas del curso
    closeNotasCursoModalButton.addEventListener('click', () => {
        notasCursoModal.classList.add('hidden');
    });

    // Agregar eventos para "Ver Alumnos"
    document.addEventListener('click', async(event) => {

        await verificarYRenovarToken();

        if (event.target && event.target.classList.contains('view-alumnos')) {
            const button = event.target;
            const idGrado = button.getAttribute('data-idgrado');

            fetch(`${API_BASE_URL}/api/grados/${idGrado}/alumnos`)
                .then(response => response.json())
                .then(alumnos => {
                    alumnosTableBody.innerHTML = alumnos
                        .map(alumno => `
                            <tr class="border-b hover:bg-gray-100">
                                <td class="hidden">${alumno.idUsuario}</td>
                                <td class="p-2">
                                    <img src="${alumno.perfil ? `${API_BASE_URL}/storage/${alumno.perfil}` : `${API_BASE_URL}/storage/profiles/default.jpg`}"
                                         alt="${alumno.nombres}"
                                         class="w-10 h-10 rounded-full">
                                </td>
                                <td class="p-2">${alumno.nombres}</td>
                                <td class="p-2">${alumno.apellidos}</td>
                                <td class="p-2 text-center">
                                    <button class="ver-cursos bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        data-idusuario="${alumno.idUsuario}"
                                        data-nombrealumno="${alumno.nombres} ${alumno.apellidos}"
                                        data-idgrado="${idGrado}">Ver Cursos</button>
                                    <button class="ver-notas-alumno bg-green-500 text-white px-2 py-1 rounded"
                                        data-idusuario="${alumno.idUsuario}"
                                        data-nombrealumno="${alumno.nombres} ${alumno.apellidos}">Ver Notas Generales</button>
                                </td>
                            </tr>
                        `)
                        .join('');
                    modal.classList.remove('hidden');

                    // Agregar eventos para "Ver Cursos"
                    agregarEventosVerCursos();
                    // Agregar eventos para "Ver Notas Generales"
                    agregarEventosVerNotasGenerales();
                })
                .catch(error => console.error('Error al cargar alumnos:', error));
        }
    });

    // Función para agregar eventos a los botones "Ver Cursos"
    function agregarEventosVerCursos() {

        document.querySelectorAll('.ver-cursos').forEach(button => {

            button.addEventListener('click', async() => {

                await verificarYRenovarToken(); 

                const idUsuario = button.getAttribute('data-idusuario');
                const nombreAlumno = button.getAttribute('data-nombrealumno');
                const idGrado = button.getAttribute('data-idgrado');

                fetch(`${API_BASE_URL}/api/alumnos/${idUsuario}/grados/${idGrado}/cursos`)
                    .then(response => response.json())
                    .then(cursos => {
                        cursosTableBody.innerHTML = cursos
                            .map(curso => `
                                <tr class="border-b hover:bg-gray-100">
                                    <td class="hidden">${curso.idCurso}</td>
                                    <td class="p-2">${curso.nombreCurso}</td>
                                    <td class="p-2 text-center">
                                        <button class="ver-notas-curso bg-blue-500 text-white px-2 py-1 rounded"
                                            data-idcurso="${curso.idCurso}"
                                            data-idusuario="${idUsuario}"
                                            data-nombrecurso="${curso.nombreCurso}"
                                            data-nombrealumno="${nombreAlumno}">Ver Notas</button>
                                    </td>
                                </tr>
                            `)
                            .join('');
                        cursosModal.classList.remove('hidden');

                        // Agregar eventos para "Ver Notas" en los cursos
                        agregarEventosVerNotasCurso();
                    })
                    .catch(error => console.error('Error al cargar cursos:', error));
            });
        });
    }

    // Función para agregar eventos a los botones "Ver Notas" en los cursos
    function agregarEventosVerNotasCurso() {
        document.querySelectorAll('.ver-notas-curso').forEach(button => {

            button.addEventListener('click', async() => {

                await verificarYRenovarToken(); 

                const idCurso = button.getAttribute('data-idcurso');
                const idUsuario = button.getAttribute('data-idusuario');
                const nombreCurso = button.getAttribute('data-nombrecurso');
                const nombreAlumno = button.getAttribute('data-nombrealumno');

                fetch(`${API_BASE_URL}/api/alumnos/${idUsuario}/cursos/${idCurso}/notas`)
                    .then(response => response.json())
                    .then(notas => {
                        notasCursoTableBody.innerHTML = notas
                            .map(nota => `
                                <tr class="border-b hover:bg-gray-100">
                                    <td class="p-2">
                                        <img src="${nota.foto_perfil ? `${API_BASE_URL}/storage/${nota.foto_perfil}` : `${API_BASE_URL}/storage/profiles/default.jpg`}"
                                            alt="${nota.nombres}"
                                            class="w-10 h-10 rounded-full">
                                    </td>
                                    <td class="p-2">${nota.nombres}</td>
                                    <td class="p-2">${nota.apellidos}</td>
                                    <td class="p-2">${nota.titulo_actividad}</td>
                                    <td class="p-2">${nota.nota}</td>
                                    <td class="p-2">${nota.fecha_subida}</td>
                                    <td class="p-2">${nota.fecha_vencimiento}</td>
                                </tr>
                            `)
                            .join('');
                        notasCursoModal.classList.remove('hidden');

                        // Actualizar el título del modal
                        document.querySelector('#modal-curso-title').textContent = `Notas del Curso: ${nombreCurso}`;

                        // Agregar funcionalidad de exportación a Excel
                        configurarExportacionNotasCurso(nombreAlumno, nombreCurso);
                    })
                    .catch(error => console.error('Error al cargar notas:', error));
            });
        });
    }

    // Función para configurar la exportación de notas del curso a Excel
    function configurarExportacionNotasCurso(nombreAlumno, nombreCurso) {
        let exportarExcelButton = document.querySelector('#exportar-notas-curso-excel');

        // Evitar múltiples eventos
        exportarExcelButton.replaceWith(exportarExcelButton.cloneNode(true));
        exportarExcelButton = document.querySelector('#exportar-notas-curso-excel');

        exportarExcelButton.addEventListener('click', () => {
            // Clonar la tabla y eliminar la columna de fotos
            const tableClone = document.querySelector('#notas-curso-table').cloneNode(true);

            // Eliminar la columna de fotos del thead
            tableClone.querySelectorAll('thead tr').forEach(tr => {
                tr.deleteCell(0);
            });

            // Eliminar las celdas de fotos del tbody
            tableClone.querySelectorAll('tbody tr').forEach(tr => {
                tr.deleteCell(0);
            });

            // Convertir la tabla modificada a una hoja de cálculo
            const wb = XLSX.utils.table_to_book(tableClone, { sheet: "Notas" });

            // Obtener la fecha actual
            const fechaHoy = new Date();
            const dia = String(fechaHoy.getDate()).padStart(2, '0');
            const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
            const año = fechaHoy.getFullYear();
            const fechaFormateada = `${dia}-${mes}-${año}`;

            // Sanear y formatear el nombre del alumno y curso
            const nombreAlumnoSanitizado = nombreAlumno.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
            const nombreCursoSanitizado = nombreCurso.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');

            // Generar el nombre del archivo
            const nombreArchivo = `Notas_${nombreAlumnoSanitizado}_${nombreCursoSanitizado}_${fechaFormateada}.xlsx`;

            // Generar el archivo Excel
            XLSX.writeFile(wb, nombreArchivo);
        });
    }

    // Función para agregar eventos a los botones "Ver Notas Generales" de los alumnos
    function agregarEventosVerNotasGenerales() {
        document.querySelectorAll('.ver-notas-alumno').forEach(button => {

            button.addEventListener('click', async() => {

                await verificarYRenovarToken();

                const idUsuario = button.getAttribute('data-idusuario');
                const nombreAlumno = button.getAttribute('data-nombrealumno');

                fetch(`${API_BASE_URL}/api/alumnos/${idUsuario}/notas`)
                    .then(response => response.json())
                    .then(notas => {
                        // Reutilizamos el modal de notas generales
                        const notasModal = document.querySelector('#notas-modal');
                        const notasTableBody = document.querySelector('#notas-table-body');
                        const closeNotasModalButton = document.querySelector('#close-notas-modal');

                        // Cerrar el modal de notas
                        closeNotasModalButton.addEventListener('click', () => {
                            notasModal.classList.add('hidden');
                        });

                        notasTableBody.innerHTML = notas
                            .map(nota => `
                                <tr class="border-b hover:bg-gray-100">
                                    <td class="p-2">
                                        <img src="${nota.foto_perfil ? `${API_BASE_URL}/storage/${nota.foto_perfil}` : `${API_BASE_URL}/storage/profiles/default.jpg`}"
                                            alt="${nota.nombres}"
                                            class="w-10 h-10 rounded-full">
                                    </td>
                                    <td class="p-2">${nota.nombres}</td>
                                    <td class="p-2">${nota.apellidos}</td>
                                    <td class="p-2">${nota.titulo_actividad}</td>
                                    <td class="p-2">${nota.nota}</td>
                                    <td class="p-2">${nota.fecha_subida}</td>
                                    <td class="p-2">${nota.fecha_vencimiento}</td>
                                    <td class="p-2">${nota.curso}</td>
                                </tr>
                            `)
                            .join('');
                        notasModal.classList.remove('hidden');

                        // Actualizar el título del modal
                        document.querySelector('#notas-modal h3').textContent = `Notas Generales de ${nombreAlumno}`;

                        // Agregar funcionalidad de exportación a Excel
                        configurarExportacionNotasAlumno(nombreAlumno);
                    })
                    .catch(error => console.error('Error al cargar notas generales del alumno:', error));
            });
        });
    }

    // Función para configurar la exportación de notas generales del alumno a Excel
    function configurarExportacionNotasAlumno(nombreAlumno) {
        let exportarExcelButton = document.querySelector('#exportar-excel');

        // Evitar múltiples eventos
        exportarExcelButton.replaceWith(exportarExcelButton.cloneNode(true));
        exportarExcelButton = document.querySelector('#exportar-excel');

        exportarExcelButton.addEventListener('click', () => {
            // Clonar la tabla y eliminar la columna de fotos
            const tableClone = document.querySelector('#notas-table').cloneNode(true);

            // Eliminar la columna de fotos del thead
            tableClone.querySelectorAll('thead tr').forEach(tr => {
                tr.deleteCell(0);
            });

            // Eliminar las celdas de fotos del tbody
            tableClone.querySelectorAll('tbody tr').forEach(tr => {
                tr.deleteCell(0);
            });

            // Convertir la tabla modificada a una hoja de cálculo
            const wb = XLSX.utils.table_to_book(tableClone, { sheet: "Notas" });

            // Obtener la fecha actual
            const fechaHoy = new Date();
            const dia = String(fechaHoy.getDate()).padStart(2, '0');
            const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
            const año = fechaHoy.getFullYear();
            const fechaFormateada = `${dia}-${mes}-${año}`;

            // Sanear y formatear el nombre del alumno
            const nombreAlumnoSanitizado = nombreAlumno.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');

            // Generar el nombre del archivo
            const nombreArchivo = `Notas_Generales_${nombreAlumnoSanitizado}_${fechaFormateada}.xlsx`;

            // Generar el archivo Excel
            XLSX.writeFile(wb, nombreArchivo);
        });
    }
});
