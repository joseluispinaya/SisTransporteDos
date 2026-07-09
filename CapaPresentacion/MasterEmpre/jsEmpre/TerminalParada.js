
let tablaDataCiud;
let idEditarCiud = 0;

let tablaDataRuta;
let idEditarRuta = 0;

let tablaDataRutPara;
let idEditarRutPara = 0;

$(document).ready(function () {
    listaCiudadesPara();
    listaRutas();
    cargarTodasRutas();
    cargarCiudadescbo();
});

function cargarTodasRutas() {

    let combosRutas = $("#cboRutasTable, #cboRutabus");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosRutas.html('<option value="">Cargando Rutas...</option>');

    $.ajax({
        url: "TerminalParada.aspx/ListaRutas",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione una Ruta --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRuta}">${row.NombreRuta}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosRutas.html(opcionesHTML);

            } else {
                combosRutas.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosRutas.html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarCiudadescbo() {

    $("#cboCiudadPa").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "TerminalParada.aspx/ListaCiudadesParada",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Ciudad --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCiudad}">${row.Nombre}</option>`;
                });

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdTipoBus}">${row.NombreTipo}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboCiudadPa").html(opcionesHTML);

            } else {
                $("#cboCiudadPa").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboCiudadPa").html('<option value="">Error de conexión</option>');
        }
    });
}

// rutas
function listaRutas() {
    //if ($.fn.DataTable.isDataTable("#tbRutas")) {
    //    $("#tbRutas").DataTable().destroy();
    //    $('#tbRutas tbody').empty();
    //}

    tablaDataRuta = $("#tbRutas").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'TerminalParada.aspx/ListaRutas',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}"; // Como tu WebMethod usa Sesión, no necesita parámetros de entrada
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    mostrarAlertaZero("¡Atención!", json.d.Mensaje, "error");
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdRuta", "visible": false, "searchable": false },
            {
                "data": "NombreRuta",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-map-pin-filled align-text-top fs-14 text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "data": "Estado",
                "className": "text-center",
                render: function (data) {
                    if (data) {
                        return `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-12">
                                    <i class="ti ti-user-check me-1"></i>Activo
                                </span>`;
                    } else {
                        return `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-12">
                                    <i class="ti ti-user-x me-1"></i>Inactivo
                                </span>`;
                    }
                }
            },
            {
                "defaultContent": '<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar"><i class="ti ti-pencil-plus"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbRutas tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaDataRuta.row(fila).data();
    idEditarRuta = data.IdRuta;
    $("#txtNombreRuta").val(data.NombreRuta);
    $("#cboEstadoRuta").val(data.Estado ? 1 : 0).prop("disabled", false);
    $("#modalLabelrutas").text("Editar Ruta");
    $("#modalRutas").modal("show");

});

$("#btnNuevaRuta").on("click", function () {

    idEditarRuta = 0;
    $("#txtNombreRuta").val("");
    $("#cboEstadoRuta").val(1).prop("disabled", true);

    $("#modalLabelrutas").text("Nueva Ruta");

    $("#modalRutas").modal("show");

})

$("#btnGuardarRegRuta").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarRegRuta').prop('disabled', true);

    if ($("#txtNombreRuta").val().trim() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe completar el campo Ruta'
        });

        $("#txtNombreRuta").focus();
        $('#btnGuardarRegRuta').prop('disabled', false);
        return;
    }

    const objeto = {
        IdRuta: idEditarRuta,
        NombreRuta: $("#txtNombreRuta").val().trim(),
        Estado: ($("#cboEstadoRuta").val() === "1" ? true : false)
    }

    $("#modalRutas").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "TerminalParada.aspx/GuardarOrEditRutas",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalRutas").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalRutas").modal("hide");

                // Recargamos la tabla suavemente sin perder la página actual
                if (tablaDataRuta) {
                    tablaDataRuta.ajax.reload(null, false);
                }
                idEditarRuta = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalRutas").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarRegRuta').prop('disabled', false);
        }
    });

});

// Ciudades paradas
function listaCiudadesPara() {

    tablaDataCiud = $("#tbTerminales").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'TerminalParada.aspx/ListaCiudadesParada',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}"; // Como tu WebMethod usa Sesión, no necesita parámetros de entrada
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdCiudad", "visible": false, "searchable": false },
            {
                "data": "Nombre",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-map-pin-filled align-text-top fs-14 text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "data": "Estado",
                "className": "text-center",
                render: function (data) {
                    // Badges modernos (subtle) de Bootstrap 5
                    if (data === true)
                        return '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="ti ti-check me-1"></i>Activo</span>';
                    else
                        return '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><i class="ti ti-x me-1"></i>Inactivo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar"><i class="ti ti-pencil-plus"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbTerminales tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaDataCiud.row(fila).data();
    idEditarCiud = data.IdCiudad;
    $("#txtNombreCiudadPa").val(data.Nombre);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);
    $("#modalLabelterminal").text("Editar Ciudad");
    $("#modalTerminal").modal("show");

});

$("#btnNuevaTerminal").on("click", function () {

    idEditarCiud = 0;
    $("#txtNombreCiudadPa").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $("#modalLabelterminal").text("Nueva Ciudad");

    $("#modalTerminal").modal("show");

})

$("#btnGuardarRegCiudad").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarRegCiudad').prop('disabled', true);

    if ($("#txtNombreCiudadPa").val().trim() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe completar el campo Ciudad Terminal'
        });

        $("#txtNombreCiudadPa").focus();
        $('#btnGuardarRegCiudad').prop('disabled', false);
        return;
    }

    const objeto = {
        IdCiudad: idEditarCiud,
        Nombre: $("#txtNombreCiudadPa").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    }

    $("#modalTerminal").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "TerminalParada.aspx/GuardarOrEditCiudadParada",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalTerminal").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalTerminal").modal("hide");
                //listaCiudadesPara();

                // Recargamos la tabla suavemente sin perder la página actual
                if (tablaDataCiud) {
                    tablaDataCiud.ajax.reload(null, false);
                }
                idEditarCiud = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalTerminal").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarRegCiudad').prop('disabled', false);
        }
    });

});

// Rutas paradas

$("#cboRutasTable").on("change", function () {

    // Verificamos si la tabla ya fue inicializada alguna vez
    if ($.fn.DataTable.isDataTable("#tbRutaParadas")) {
        // Si ya existe, simplemente le decimos que se recargue. 
        // ¡Automáticamente leerá el nuevo valor del select!
        tablaDataRutPara.ajax.reload();
    } else {
        // Si es la primera vez que seleccionan algo, dibujamos la tabla
        listaRutasParadas();
    }

});

// Ya NO recibe parámetro
function listaRutasParadas() {

    tablaDataRutPara = $("#tbRutaParadas").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'TerminalParada.aspx/ListaRutasParadasRP',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                // ¡LA MAGIA ESTÁ AQUÍ!
                // En vez de usar una variable estática, leemos el select en tiempo real
                let idRutaSeleccionada = $("#cboRutasTable").val();

                // Si por algún motivo es nulo o vacío, mandamos 0
                let request = {
                    IdRuta: parseInt(idRutaSeleccionada) || 0
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    mostrarAlertaZero("¡Atención!", json.d.Mensaje, "error");
                    return [];
                }
            }
        },
        "columns": [
            // ... Tus columnas se quedan EXACTAMENTE IGUAL ...
            { "data": "IdRutaParada", "visible": false, "searchable": false },
            {
                "data": "NombreCiudad",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-map-pin-filled align-text-top fs-14 text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "data": "Orden",
                "className": "text-center",
                render: function (data) {
                    return `<span class="badge p-1 bg-success fs-14 me-1"><i class="ti ti-hash align-text-top fs-14 me-1"></i>${data}</span>`;
                }
            },
            {
                "defaultContent": '<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-2"><i class="ti ti-pencil-plus"></i></button>' +
                    '<button class="btn btn-soft-danger btn-icon btn-sm rounded-circle btn-eliminar"><i class="ti ti-trash"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$("#btnNuevaOrdenRp").on("click", function () {
    // 1. Obtenemos qué ruta está mirando el usuario en la tabla
    let idRutaActual = $("#cboRutasTable").val();

    if (idRutaActual === "" || idRutaActual == null) {
        mostrarAlertaZero("Atención", "Primero seleccione una ruta de la lista.", "warning");
        return;
    }

    // 2. Limpiamos variables de edición y campos
    idEditarRutPara = 0; // Tu variable global para saber si es 0 (Nuevo) o >0 (Editar)
    $("#txtOrden").val("");
    $("#cboCiudadPa").val("");

    // 3. Pre-seleccionamos la ruta y la BLOQUEAMOS
    $("#cboRutabus").val(idRutaActual).prop("disabled", true);

    // 4. Mostramos el modal
    $("#modalLabelrutapara").text("Nueva Parada");
    $("#modalRutaPara").modal("show");
});

$('#tbRutaParadas tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaDataRutPara.row(fila).data();
    idEditarRutPara = data.IdRutaParada;

    // 3. Llenamos los datos en el modal
    $("#txtOrden").val(data.Orden);
    $("#cboCiudadPa").val(data.IdCiudad);

    // 4. ¡LA CLAVE! Seleccionamos la ruta actual del registro y DESBLOQUEAMOS el select
    $("#cboRutabus").val(data.IdRuta).prop("disabled", false);

    // 5. Mostramos el modal
    $("#modalLabelrutapara").text("Editar Parada");
    $("#modalRutaPara").modal("show");
});

$('#tbRutaParadas tbody').on('click', '.btn-eliminar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaDataRutPara.row(fila).data();
    const idRutaParada = data.IdRutaParada;

    Swal.fire({
        title: '¿Está seguro?',
        text: `Se eliminará la ciudad ${data.NombreCiudad} de esta ruta.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, Cancelar',
        buttonsStyling: false,
        // 1. ACTIVAMOS EL LOADER NATIVO
        showLoaderOnConfirm: true,
        customClass: {
            confirmButton: "btn btn-danger me-2 mt-2",
            cancelButton: "btn btn-primary mt-2"
        },
        // 2. EVITAMOS QUE EL USUARIO CIERRE LA ALERTA DANDO CLIC AFUERA MIENTRAS CARGA
        allowOutsideClick: () => !Swal.isLoading(),

        // 3. LA MAGIA: METEMOS EL AJAX AQUÍ ADENTRO
        preConfirm: () => {
            // Retornamos una "Promesa" para que SweetAlert sepa cuándo termina
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "TerminalParada.aspx/EliminarRutaParadaRPrueba",
                    data: JSON.stringify({ IdRutaParada: parseInt(idRutaParada) }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        // Si todo va bien, le pasamos la respuesta de tu C# a SweetAlert
                        resolve(response);
                    },
                    error: function (xhr) {
                        console.log(xhr.responseText);
                        // Si falla la red o el servidor, detenemos el loader
                        reject(new Error("Error de comunicación con el servidor."));
                    }
                });
            }).catch(error => {
                // Si hubo un error (reject), mostramos el texto rojo dentro del mismo SweetAlert
                Swal.showValidationMessage(`<i class="ti ti-alert-triangle me-1"></i> ${error.message}`);
            });
        }
    }).then((result) => {
        // 4. ESTO SE EJECUTA CUANDO EL AJAX TERMINÓ CON ÉXITO
        if (result.isConfirmed) {

            // La respuesta de tu servidor viene guardada en "result.value"
            let response = result.value;

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            // Recargamos la tabla si fue exitoso
            if (response.d.Estado && tablaDataRutPara) {
                tablaDataRutPara.ajax.reload(null, false);
            }
        }
        // Si hizo clic en Cancelar, result.isDismissed será true, 
        // y el SweetAlert simplemente se cerrará sin hacer nada más.
    });
});

$("#btnGuardarRutaPara").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarRutaPara').prop('disabled', true);

    // obtengo el valor de cboRutabus
    let idRuta = $("#cboRutabus").val();

    let orden = $("#txtOrden").val();

    if (orden === "" || isNaN(orden) || parseInt(orden) <= 0) {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe ingresar un numero de orden valido mayor a 0'
        });

        $("#txtOrden").focus();
        $('#btnGuardarRutaPara').prop('disabled', false);
        return;
    }

    if (idRuta === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar una ruta.'
        });
        $("#cboRutabus").focus();
        $('#btnGuardarRutaPara').prop('disabled', false);
        return;
    }


    if ($("#cboCiudadPa").val() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar una Ciudad.'
        });
        $("#cboCiudadPa").focus();
        $('#btnGuardarRutaPara').prop('disabled', false);
        return;
    }

    const objeto = {
        IdRutaParada: idEditarRutPara,
        IdRuta: parseInt(idRuta),
        //IdRuta: parseInt($("#cboRutabus").val()),
        IdCiudad: parseInt($("#cboCiudadPa").val()),
        Orden: parseInt(orden)
    }

    $("#modalRutaPara").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "TerminalParada.aspx/GuardarOrEditRutasParadasRP",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalRutaPara").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalRutaPara").modal("hide");

                // si todo bien antes de que recargue asigno mi idRuta a cboRutasTable
                $("#cboRutasTable").val(idRuta);

                if (tablaDataRutPara) {
                    tablaDataRutPara.ajax.reload(null, false);
                }
                idEditarRutPara = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalRutaPara").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarRutaPara').prop('disabled', false);
        }
    });

});


// fin