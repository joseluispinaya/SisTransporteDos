
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listaClientes();
});

function listaClientes() {

    tablaData = $("#tbData").DataTable({
        // Muestra el mensaje "Procesando..." nativo de DataTables
        "processing": true,
        "serverSide": true,  // ACTIVA EL MODO PAGINACIÓN EN EL SERVIDOR
        "responsive": true,
        "ajax": {
            "url": `${API_BASE_URL2}/clientes/listaClientesPaginado`,
            "type": "GET",
            "dataType": "json",
            "data": function (d) {

                // GUARDAMOS EL DRAW EN UNA VARIABLE GLOBAL TEMPORAL (o en el mismo 'd')
                // para poder leerlo después en el dataFilter
                window.currentDraw = d.draw;

                // 'd' es el objeto gigante que DataTables intenta enviar por defecto.
                return {
                    omitir: d.start,               // Cuántos registros saltar (Página actual)
                    tamanoPagina: d.length,        // Cuántos registros mostrar (Ej: 10, 25, 50)
                    buscar: d.search.value || ""   // Lo que el usuario escribió en la caja de búsqueda
                };
            },
            "dataFilter": function (data) {
                var json = JSON.parse(data);

                // Extraemos los totales de la primera fila (si hay datos)
                var totalRecords = 0;
                var totalFiltered = 0;

                if (json.Estado && json.Data.length > 0) {
                    totalRecords = json.Data[0].TotalRegistros;
                    totalFiltered = json.Data[0].TotalFiltrados;
                }

                // Transformamos tu objeto "Respuesta" al formato que DataTables exige
                var respuestaDataTables = {
                    // No es estrictamente necesario en WebForms, pero es buena práctica
                    //draw: 0,
                    draw: window.currentDraw, // <-- ¡AHORA SÍ LE DEVOLVEMOS SU DRAW ORIGINAL!
                    recordsTotal: totalRecords,       // Total real en BD
                    recordsFiltered: totalFiltered,   // Total después de aplicar el buscador
                    data: json.Estado ? json.Data : [] // La lista de clientes real
                };

                return JSON.stringify(respuestaDataTables);
            },
            "error": function (xhr, error, thrown) {
                console.log("Error status:", xhr.status, "Detalles:", thrown);
                // 1. Mostramos tu alerta global
                mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor. La API podría estar apagada.", "error");

                $("#tbData_processing").hide();
                // 3. Inyectamos un mensaje amigable en la tabla (Colspan 4 porque tienes 4 columnas visibles)
                $("#tbData tbody").html(`
                    <tr>
                        <td colspan="4" class="text-center text-muted py-4">
                            <i class="ti ti-wifi-off fs-24 d-block mb-1 text-danger"></i>
                            No se pudieron cargar los datos debido a un error de conexión.
                        </td>
                    </tr>
                `);
            }
        },
        "columns": [
            { "data": "IdCliente", "visible": false, "searchable": false },

            // 1. COLUMNA CLIENTE (Avatar + Nombres y Apellidos)
            {
                "data": null,
                render: function (data, type, row) {
                    // Seleccionar color/ícono de avatar según el género ('M' o 'F')
                    let avatarColor = row.Genero === 'M' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger';
                    let iconName = row.Genero === 'M' ? 'ti-user' : 'ti-user-circle'; // O cualquier otro ícono que prefieras


                    return `
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm d-inline-block align-middle me-2">
                                <div class="avatar-title ${avatarColor} rounded fs-18">
                                    <i class="ti ${iconName}"></i>
                                </div>
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-semibold text-dark">${row.Nombres} ${row.Apellidos}</span>
                                <span class="text-muted fs-12">Cliente</span>
                            </div>
                        </div>`;
                }
            },

            // 2. COLUMNA DOCUMENTO (CI)
            {
                "data": "NroCi",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-id align-text-top fs-14 me-1"></i>${data}</span>`;
                }
            },

            // 3. COLUMNA CONTACTO (Celular)
            {
                "data": "Celular",
                render: function (data) {
                    // Validar si tiene celular, si no, mostrar un guión o mensaje
                    let numero = data ? data : '<span class="text-muted fst-italic">Sin registro</span>';

                    if (data) {
                        return `
                            <div class="d-flex align-items-center gap-1">
                                <a href="tel:${data}" class="text-success text-decoration-none fw-medium">
                                    <i class="ti ti-device-mobile-message fs-16"></i> ${numero}
                                </a>
                            </div>`;
                    }
                    return numero;

                }
            },

            // 4. COLUMNA OPCIONES
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-1" title="Editar">
                        <i class="ti ti-pencil"></i>
                    </button>
                    <button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-detalle" title="Ver Detalles">
                        <i class="ti ti-eye"></i>
                    </button>`,
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        // IMPORTANTE: En modo Server-Side con tu SP actual, no estamos manejando ordenamiento dinámico por columnas,
        // así que desactivamos el ordenamiento inicial para que no choque con el ORDER BY DESC de tu SP.
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

function listaClientesOriginal() {
    //if ($.fn.DataTable.isDataTable("#tbData")) {
    //    $("#tbData").DataTable().destroy();
    //    $('#tbData tbody').empty();
    //}

    tablaData = $("#tbData").DataTable({
        // Muestra el mensaje "Procesando..." nativo de DataTables
        "processing": true,  
        "serverSide": true,  // ACTIVA EL MODO PAGINACIÓN EN EL SERVIDOR
        "responsive": true,
        "ajax": {
            "url": 'Clientes.aspx/ListaClientesPaginado',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {

                // GUARDAMOS EL DRAW EN UNA VARIABLE GLOBAL TEMPORAL (o en el mismo 'd')
                // para poder leerlo después en el dataFilter
                window.currentDraw = d.draw;

                // 'd' es el objeto gigante que DataTables intenta enviar por defecto.
                // Aquí lo transformamos para que encaje EXACTAMENTE con los parámetros de tu WebMethod en C#
                var parametros = {
                    Omitir: d.start,               // Cuántos registros saltar (Página actual)
                    TamanoPagina: d.length,        // Cuántos registros mostrar (Ej: 10, 25, 50)
                    Buscar: d.search.value || ""   // Lo que el usuario escribió en la caja de búsqueda
                };
                return JSON.stringify(parametros);
            },
            "dataFilter": function (data) {
                // Aquí interceptamos la respuesta cruda de tu WebMethod antes de que DataTables la lea
                var json = JSON.parse(data);

                // Extraemos los totales de la primera fila (si hay datos)
                var totalRecords = 0;
                var totalFiltered = 0;

                if (json.d.Estado && json.d.Data.length > 0) {
                    totalRecords = json.d.Data[0].TotalRegistros;
                    totalFiltered = json.d.Data[0].TotalFiltrados;
                }

                // Transformamos tu objeto "Respuesta" al formato que DataTables exige
                var respuestaDataTables = {
                    // No es estrictamente necesario en WebForms, pero es buena práctica
                    //draw: 0,
                    draw: window.currentDraw, // <-- ¡AHORA SÍ LE DEVOLVEMOS SU DRAW ORIGINAL!
                    recordsTotal: totalRecords,       // Total real en BD
                    recordsFiltered: totalFiltered,   // Total después de aplicar el buscador
                    data: json.d.Estado ? json.d.Data : [] // La lista de clientes real
                };
                //console.log(JSON.stringify(respuestaDataTables));

                return JSON.stringify(respuestaDataTables);
            }
        },
        "columns": [
            { "data": "IdCliente", "visible": false, "searchable": false },

            // 1. COLUMNA CLIENTE (Avatar + Nombres y Apellidos)
            {
                "data": null,
                render: function (data, type, row) {
                    // Seleccionar color/ícono de avatar según el género ('M' o 'F')
                    let avatarColor = row.Genero === 'M' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger';
                    let iconName = row.Genero === 'M' ? 'ti-user' : 'ti-user-circle'; // O cualquier otro ícono que prefieras


                    return `
                        <div class="d-flex align-items-center">
                            <div class="avatar-sm d-inline-block align-middle me-2">
                                <div class="avatar-title ${avatarColor} rounded fs-18">
                                    <i class="ti ${iconName}"></i>
                                </div>
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-semibold text-dark">${row.Nombres} ${row.Apellidos}</span>
                                <span class="text-muted fs-12">Cliente</span>
                            </div>
                        </div>`;
                }
            },

            // 2. COLUMNA DOCUMENTO (CI)
            {
                "data": "NroCi",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-id align-text-top fs-14 me-1"></i>${data}</span>`;
                }
            },

            // 3. COLUMNA CONTACTO (Celular)
            {
                "data": "Celular",
                render: function (data) {
                    // Validar si tiene celular, si no, mostrar un guión o mensaje
                    let numero = data ? data : '<span class="text-muted fst-italic">Sin registro</span>';

                    if (data) {
                        return `
                            <div class="d-flex align-items-center gap-1">
                                <a href="tel:${data}" class="text-success text-decoration-none fw-medium">
                                    <i class="ti ti-device-mobile-message fs-16"></i> ${numero}
                                </a>
                            </div>`;
                    }
                    return numero;

                }
            },

            // 4. COLUMNA OPCIONES
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-1" title="Editar">
                        <i class="ti ti-pencil"></i>
                    </button>
                    <button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-detalle" title="Ver Detalles">
                        <i class="ti ti-eye"></i>
                    </button>`,
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        // IMPORTANTE: En modo Server-Side con tu SP actual, no estamos manejando ordenamiento dinámico por columnas,
        // así que desactivamos el ordenamiento inicial para que no choque con el ORDER BY DESC de tu SP.
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdCliente;
    $("#txtNroCi").val(data.NroCi);
    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtNroCel").val(data.Celular);

    $("#cboGenero").val(data.Genero === "M" ? 1 : 0);

    $("#modalLabelcliente").text("Editar Cliente");
    $("#modalAdd").modal("show");

});


$("#btnNuevoRegistro").on("click", function () {

    idEditar = 0;

    $("#txtNroCi").val("");
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtNroCel").val("");
    $("#cboGenero").val(1);

    // 4. Mostramos el modal
    $("#modalLabelcliente").text("Nuevo Registro");
    $("#modalAdd").modal("show");
});

$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Detalles del Cliente: ${data.Nombres}.`;
    mostrarAlertaZero("¡Mensaje!", textoSms, "info");

});


$("#btnGuardarRegis").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarRegis').prop('disabled', true);

    const inputs = $("#modalAdd input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        ToastMaster.fire({
            icon: 'warning',
            title: mensaje
        });
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        $('#btnGuardarRegis').prop('disabled', false);
        return;
    }

    const objeto = {
        IdCliente: idEditar,
        NroCi: $("#txtNroCi").val().trim(),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        Celular: $("#txtNroCel").val().trim(),
        Genero: ($("#cboGenero").val() === "1" ? "M" : "F")
    }

    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Clientes.aspx/GuardarOrEditClientes",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalAdd").modal("hide");
                //listaClientes();

                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarRegis').prop('disabled', false);
        }
    });

});

// fin