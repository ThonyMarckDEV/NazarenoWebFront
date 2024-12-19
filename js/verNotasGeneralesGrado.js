// reportar.js

import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js'; 

document.addEventListener('DOMContentLoaded', async () => {

    showLoadingOverlay();
    
    await verificarYRenovarToken();

    const gradoTableBody = document.querySelector('#grado-table-body');
    const notasTableBody = document.querySelector('#notas-table-body');
    const notasModal = document.querySelector('#notas-modal');
    const closeNotasModalButton = document.querySelector('#close-notas-modal');

    // Cerrar el modal de notas
    closeNotasModalButton.addEventListener('click', () => {
        notasModal.classList.add('hidden');
    });
    
    // Obtener los grados
    fetch(`${API_BASE_URL}/api/grados`)
        .then(response => response.json())
        .then(data => {

            hideLoadingOverlay();

            gradoTableBody.innerHTML = data
                .map(grado => `
                    <tr class="border-b hover:bg-gray-100">
                        <td class="hidden">${grado.idGrado}</td>
                        <td class="p-2">${grado.nombreGrado}</td>
                        <td class="p-2">${grado.nivel}</td>
                        <td class="p-2">${grado.seccion}</td>
                        <td class="p-2 text-center">
                            <button class="view-alumnos bg-blue-500 text-white px-2 py-1 rounded mr-2" data-idgrado="${grado.idGrado}">Ver Alumnos</button>
                            <button class="view-notas bg-green-500 text-white px-2 py-1 rounded" data-idgrado="${grado.idGrado}" data-nombregrado="${grado.nombreGrado}" data-seccion="${grado.seccion}">Ver Notas Generales</button>
                        </td>
                    </tr>
                `)
                .join('');

            // Agregar eventos para "Ver Notas Generales"
            document.querySelectorAll('.view-notas').forEach(button => {
                button.addEventListener('click', () => {
                    const idGrado = button.getAttribute('data-idgrado');
                    const nombreGrado = button.getAttribute('data-nombregrado'); // Obtener el nombre del grado
                    const seccion = button.getAttribute('data-seccion'); // Obtener la sección

                    fetch(`${API_BASE_URL}/api/grados/${idGrado}/notas`)
                        .then(response => response.json())
                        .then(notas => {
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

                        

                            // **Agregar funcionalidad de exportación a Excel**
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

                                // Generar el nombre del archivo
                                const nombreCompletoGrado = `${nombreGrado} ${seccion}`;

                                // Sanear y formatear el nombre del grado y sección
                                const nombreGradoSanitizado = nombreCompletoGrado.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');

                                // Obtener la fecha actual
                                const fechaHoy = new Date();
                                const dia = String(fechaHoy.getDate()).padStart(2, '0');
                                const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
                                const año = fechaHoy.getFullYear();
                                const fechaFormateada = `${dia}-${mes}-${año}`;

                                // Generar el nombre del archivo
                                const nombreArchivo = `Notas_Generales_${nombreGradoSanitizado}_${fechaFormateada}.xlsx`;

                                // Generar el archivo Excel
                                XLSX.writeFile(wb, nombreArchivo);
                            });
                        })
                        .catch(error => console.error('Error al cargar notas:', error));
                });
            });
        })
        .catch(
            error => console.error('Error al cargar grados:', error

        )).finally(()=>{
            hideLoadingOverlay();
       });
});
