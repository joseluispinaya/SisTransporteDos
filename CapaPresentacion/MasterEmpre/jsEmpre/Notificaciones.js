

let tablaData;
let viajeCambioData = null;
let listNotifiEnv = [];

$(document).ready(function () {
    cargarRutass();
});

function cargarRutass() {

    $("#cboRutasTable").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "TerminalParada.aspx/ListaRutas",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione una Ruta --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRuta}">${row.NombreRuta}</option>`;
                });

                $("#cboRutasTable").html(opcionesHTML);

            } else {
                $("#cboRutasTable").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboRutasTable").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#btnBuscar").on("click", function () {

    if ($("#cboRutasTable").val() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar una Ruta'
        });
        $("#cboRutasTable").focus();
        return;
    }

    viajesProgramados();

})

function viajesProgramados() {

    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().destroy();
        $('#tbData tbody').empty();
    }

    const request = {
        IdRuta: parseInt($("#cboRutasTable").val()),
        Estado: parseInt($("#cboEstadosTable").val())
    };

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'ConsultasPasajes.aspx/ListaViajesDetalles',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
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
            {
                "data": "NombreRuta",
                render: function (data) {
                    return `
                        <div class="d-flex align-items-center fw-medium text-dark">
                            <i class="ti ti-map-2 text-danger fs-18 me-2"></i> ${data}
                        </div>`;
                }
            },
            {
                "data": null,
                render: function (data, type, row) {
                    return `
                        <div class="d-flex flex-column">
                            <span class="fw-bold text-dark"><i class="ti ti-bus me-1 text-success"></i>Placa: ${row.PlacaBus}</span>
                            <span class="text-muted fs-12">${row.TipoBus} • ${row.CapacidadAsientos} Asientos</span>
                        </div>`;
                }
            },
            {
                "data": null,
                render: function (data, type, row) {
                    return `
                        <div class="d-flex flex-column">
                            <span class="fw-semibold text-dark"><i class="ti ti-calendar-event me-1"></i>${row.FechaSalidaStr}</span>
                            <span class="text-danger fw-bold fs-13"><i class="ti ti-clock me-1"></i>${row.HoraSalidaStr} hrs.</span>
                        </div>`;
                }
            },
            {
                "data": "Estado",
                "className": "text-center",
                render: function (data, type, row) {
                    let badgeClass = "";
                    let icon = "";

                    // Evaluamos el número del estado que viene de tu BD para pintar el color
                    switch (data) {
                        case 1: // Programado
                            badgeClass = "bg-primary-subtle text-dark";
                            icon = "ti-calendar-check";
                            break;
                        case 2: // En Ruta
                            badgeClass = "bg-warning-subtle text-warning";
                            icon = "ti-steering-wheel";
                            break;
                        case 3: // Finalizado
                            badgeClass = "bg-success-subtle text-success";
                            icon = "ti-flag-checkered";
                            break;
                        case 0: // Cancelado
                            badgeClass = "bg-danger-subtle text-danger";
                            icon = "ti-x";
                            break;
                        default:
                            badgeClass = "bg-secondary-subtle text-secondary";
                            icon = "ti-help";
                            break;
                    }

                    return `<span class="badge ${badgeClass} fs-12 px-2 py-1 border border-light"><i class="ti ${icon} me-1"></i>${row.EstadoTexto}</span>`;
                }
            },
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-notificacion me-1" title="Notificacion Encomienda">
                        <i class="ti ti-eye"></i>
                    </button>
                    <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-mensajes" title="Notificacion Personalizada">
                        <i class="ti ti-message"></i>
                    </button>`,
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

$('#tbData tbody').on('click', '.btn-mensajes', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // 1. Guardamos la data general del viaje
    viajeCambioData = data;

    // 2. Efecto visual de carga en el botón presionado (opcional pero recomendado)
    let $btnFila = $(this);
    let textoOriginalBtn = $btnFila.html();
    $btnFila.html('<i class="spinner-border spinner-border-sm align-middle"></i>').prop('disabled', true);

    // 3. LA CONSULTA AJAX ANTES DE ABRIR EL MODAL
    $.ajax({
        url: "Notificaciones.aspx/ListaNotificacionViaje",
        type: "POST",
        data: JSON.stringify({ IdViaje: parseInt(data.IdViaje) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            // Restauramos el botón de la tabla
            $btnFila.html(textoOriginalBtn).prop('disabled', false);

            if (response.d.Estado) {
                // la lista de pasajeros solo trae NombreCliente y ExpoPushToken
                const listaPasajeros = response.d.Data;

                listNotifiEnv = listaPasajeros;

                let tituloSms = `Notificacion para el Viaje ${data.NombreRuta} del ${data.FechaSalidaStr}.`;
                $("#lblTituloPrue").text(tituloSms);
                $("#txtMensajePrueba").val("");
                $("#mdNotificacion").modal("show");

            } else {
                mostrarAlertaZero("¡Error!", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            $btnFila.html(textoOriginalBtn).prop('disabled', false);
            console.log(xhr.responseText);
            mostrarAlertaZero("¡Atención!", "Error al consultar los asientos vendidos.", "error");
        }
    });
});

$("#btnEnvioNotPrueba").on("click", function () {

    let $btn = $(this);
    let $txtMensaje = $("#txtMensajePrueba");

    $btn.prop('disabled', true);

    if ($txtMensaje.val().trim() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Por favor, ingrese el mensaje a enviar'
        });
        $txtMensaje.focus();
        $btn.prop('disabled', false);
        return;
    }

    // Capturamos el mensaje que escribiste en la caja de texto (ya lo validamos arriba)
    let mensajePersonalizado = $txtMensaje.val().trim();

    // 1. Armamos la base de los datos del viaje
    let descripcionBase = `el Viaje ${viajeCambioData.NombreRuta} del ${viajeCambioData.FechaSalidaStr} a horas ${viajeCambioData.HoraSalidaStr}`;
    // 2. Filtramos y mapeamos la lista
    let listaMapeados = listNotifiEnv
        .filter(item => item.ExpoPushToken && item.ExpoPushToken.trim() !== "") // Evitamos procesar clientes sin token
        .map(item => {
            // Limpiamos el nombre o usamos un genérico si viene vacío
            let nombreCliente = item.NombreCliente ? item.NombreCliente.trim() : "Pasajero";

            return {
                ExpoPushToken: item.ExpoPushToken,
                // AQUÍ LA MAGIA DINÁMICA: Concatenamos el mensaje que escribiste en el modal
                Descripcion: `Aviso: Estimado/a ${nombreCliente}, respecto a ${descripcionBase}. ${mensajePersonalizado}`
            };
        });

    // Validamos si después de filtrar quedaron clientes con token
    if (listaMapeados.length === 0) {
        mostrarAlertaZero("Atención", "Ningún pasajero de este viaje tiene la aplicación instalada para recibir notificaciones.", "warning");
        $btn.prop('disabled', false);
        return;
    }

    // 3. Preparamos el request
    let tituloNot = empresaGlobal.RazonSocial ? `Flota: ${empresaGlobal.RazonSocial}` : "Aviso de Viaje";

    const request = {
        listaTokenClientes: listaMapeados,
        titulo: tituloNot,
        mensaje: $txtMensaje.val().trim()
    };

    let $modalContent = $("#mdNotificacion").find("div.modal-content");
    $modalContent.LoadingOverlay("show");

    // 4. Enviamos al servidor
    $.ajax({
        type: "POST",
        url: "Notificaciones.aspx/EnviarAvisoGeneral",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $modalContent.LoadingOverlay("hide");

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdNotificacion").modal("hide");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $modalContent.LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $btn.prop('disabled', false);
        }
    });
});


let listNotifiEncom = [];

$('#tbData tbody').on('click', '.btn-notificacion', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // 1. Guardamos la data general del viaje
    viajeCambioData = data;

    // 2. Efecto visual de carga en el botón presionado (opcional pero recomendado)
    let $btnFila = $(this);
    let textoOriginalBtn = $btnFila.html();
    $btnFila.html('<i class="spinner-border spinner-border-sm align-middle"></i>').prop('disabled', true);

    // 3. LA CONSULTA AJAX ANTES DE ABRIR EL MODAL
    $.ajax({
        url: "Notificaciones.aspx/ListaNotificacionEncoViaje", // URL que proporcionaste
        type: "POST",
        data: JSON.stringify({ IdViaje: parseInt(data.IdViaje) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            // Restauramos el botón de la tabla
            $btnFila.html(textoOriginalBtn).prop('disabled', false);

            if (response.d.Estado) {
                const listaNoti = response.d.Data;

                listNotifiEncom = listaNoti;

                let tituloSms = `Notificacion para el Viaje ${data.NombreRuta} del ${data.FechaSalidaStr}.`;

                // Llenamos los datos
                $("#txtIdViajePro").val(data.IdViaje);
                $("#txtTituloSms").text(tituloSms);
                $("#txtMensaje").val("");

                // Mostrar modal
                //$("#modalLabelnoti").text(tituloSms);
                $("#modalNotificacion").modal("show");

            } else {
                mostrarAlertaZero("¡Error!", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            $btnFila.html(textoOriginalBtn).prop('disabled', false);
            console.log(xhr.responseText);
            mostrarAlertaZero("¡Atención!", "Error al consultar los asientos vendidos.", "error");
        }
    });
});

$("#btnEnviarYa").on("click", function () {
    let $btn = $(this);
    let $txtMensaje = $("#txtMensaje");

    $btn.prop('disabled', true);

    if ($txtMensaje.val().trim() === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Por favor, ingrese el mensaje a enviar'
        });
        $txtMensaje.focus();
        $btn.prop('disabled', false);
        return;
    }

    // Validamos si después de filtrar quedaron clientes con token
    if (listNotifiEncom.length === 0) {
        mostrarAlertaZero("Atención", "Ningún pasajero de este viaje tiene la aplicación instalada para recibir notificaciones.", "warning");
        $btn.prop('disabled', false);
        return;
    }

    let tituloNot = empresaGlobal.RazonSocial ? `Flota: ${empresaGlobal.RazonSocial}` : "Aviso de Viaje";

    // 2. Armamos el request con el nombre del parámetro que espera el WebMethod
    const request = {
        listaDestinos: listNotifiEncom,
        titulo: tituloNot,
        mensaje: $txtMensaje.val().trim()
    };

    $("#modalNotificacion").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Notificaciones.aspx/NotificarLoteEncomiendas",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalNotificacion").find("div.modal-content").LoadingOverlay("hide");

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Estado ? 'success' : 'warning'
            );

            if (response.d.Estado) {
                $("#modalNotificacion").modal("hide");
                $("#txtIdViajePro").val("0");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalNotificacion").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $btn.prop('disabled', false);
        }
    });
});

$("#btnEnviarYaNew").on("click", function () {
    $('#btnEnviarYa').prop('disabled', true);

    // 1. Mapeamos la lista original para que coincida con NotificacionDestinoDTO
    const destinosMapeados = listNotifiEnv.map(item => {
        return {
            ExpoPushToken: item.ExpoPushTokenRemite,
            IdEncomienda: item.IdEncomiendaViaje.toString() // Aseguramos que sea string como espera el DTO
        };
    });

    // 2. Armamos el request con el nombre del parámetro que espera el WebMethod
    const request = {
        listaDestinos: destinosMapeados
    };

    $("#modalNotificacion").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Notificaciones.aspx/NotificarLoteEncomiendas",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalNotificacion").find("div.modal-content").LoadingOverlay("hide");

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Estado ? 'success' : 'warning'
            );

            if (response.d.Estado) {
                $("#modalNotificacion").modal("hide");
                $("#txtIdViajePro").val("0");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalNotificacion").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnEnviarYa').prop('disabled', false);
        }
    });
});

// fin