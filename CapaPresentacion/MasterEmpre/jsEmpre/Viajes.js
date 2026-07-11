
let tablaData;
let idEditar = 0;

$(document).ready(function () {

    listaViajesProgramados();
    cargarRutasFlota();

    // 1. INICIALIZAR DATEPICKER EN ESPAÑOL GLOBAL
    flatpickr("#txtFechaSalida", {
        dateFormat: "d/m/Y",
        defaultDate: "today",
        allowInput: true,
        locale: "es" // ¡Solo pones "es" y listo! Ya lee el archivo es.js
    });

    // 2. INICIALIZAR TIMEPICKER NATIVO
    flatpickr("#timepicker2", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultDate: "12:00",
        locale: "es" // También se lo puedes poner aquí por consistencia
    });

    // Inicializar Select2 para Bus
    $("#cboBus").select2({
        dropdownParent: $('#modalAdd'),
        width: '100%',
        placeholder: "-- Seleccione un Bus --",
        //allowClear: true,
        templateResult: formatoResultadosBus, // Dibuja la lista desplegada
        templateSelection: formatoSeleccionBus  // Dibuja el cajoncito cerrado
    });

    cargarBuses();
});

function listaViajesProgramados() {

    tablaData = $("#tbData").DataTable({
        responsive: true,
        searching: true,
        info: false,
        "ajax": {
            "url": 'Viajes.aspx/ListaViajesProgramadas',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}";
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
            // 1. COLUMNA RUTA
            {
                "data": "NombreRuta",
                render: function (data) {
                    return `
                        <div class="d-flex align-items-center fw-medium text-dark">
                            <i class="ti ti-map-2 text-danger fs-18 me-2"></i> ${data}
                        </div>`;
                }
            },

            // 2. COLUMNA UNIDAD (Placa, Tipo y Asientos)
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

            // 3. COLUMNA SALIDA (Fecha y Hora)
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

            // 4. COLUMNA ESTADO (Dinámico)
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

            // 5. COLUMNA OPCIONES
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar" title="Editar Viaje">
                        <i class="ti ti-pencil"></i>
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

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // NUEVA VALIDACIÓN DE SEGURIDAD
    if (data.Estado !== 1) {
        // Personalizamos un poco el mensaje para que el usuario entienda el motivo
        mostrarAlertaZero(
            "¡Atención!",
            "Solo se pueden modificar los viajes en estado 'Programado'. Este viaje ya está " + data.EstadoTexto + ".",
            "warning"
        );
        return; // ¡Este return es clave! Detiene todo el proceso para que no se abra el modal
    }
    // ==========================================

    // Si pasa la validación, procedemos a llenar los datos
    idEditar = data.IdViaje;
    $("#cboRuta").val(data.IdRuta);
    $("#cboBus").val(data.IdBus.toString()).trigger("change");
    $("#txtFechaSalida").val(data.FechaSalidaStr);
    $("#timepicker2").val(data.HoraSalidaStr);

    $("#modalLabeldetalle").text("Editar Viaje");
    $("#modalAdd").modal("show");

});

// FUNCIONES PARA LAS PLANTILLAS DE SELECT2
function formatoResultadosBus(estado) {
    // Si no tiene id (es el placeholder vacío), devolvemos el texto normal
    if (!estado.id) {
        return estado.text;
    }

    // Extraemos la información que guardamos en los atributos data-*
    let placa = estado.element.dataset.placa;
    let tipo = estado.element.dataset.tipo;
    let asientos = estado.element.dataset.asientos;
    let chofer = estado.element.dataset.chofer;

    // Construimos un diseño HTML usando las clases de Bootstrap y los íconos de tu template
    let $html = $(`
        <div class="d-flex flex-column py-1 border-bottom border-light">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-success"><i class="ti ti-bus me-1 text-muted"></i> Placa: ${placa}</span>
                <span class="badge bg-primary-subtle text-primary fs-11">${tipo}</span>
            </div>
            <span class="text-muted fs-12 mb-1"><i class="ti ti-steering-wheel me-1"></i> Chofer: ${chofer}</span>
            <span class="text-success fw-semibold fs-12"><i class="ti ti-users me-1"></i> Capacidad: ${asientos} Asientos</span>
        </div>
    `);

    return $html;
}

function formatoSeleccionBus(estado) {
    // Si no tiene id (es el placeholder vacío), devolvemos el texto normal
    if (!estado.id) {
        return estado.text;
    }

    let placa = estado.element.dataset.placa;
    let tipo = estado.element.dataset.tipo;
    let chofer = estado.element.dataset.chofer;

    // Validación rápida por si la data viene vacía o nula
    let nombreChofer = chofer ? chofer : "Chofer no asignado";

    // Cómo se verá el texto una vez que el usuario seleccionó una opción
    return $(`
        <span>
            <i class="ti ti-bus me-1 text-primary"></i> <b class="text-dark">${placa}</b> 
            <span class="text-muted ms-1 fs-13">(${tipo})</span>
            
            <span class="text-muted mx-2">|</span>
            
            <span class="fs-13 text-secondary">
                <i class="ti ti-steering-wheel me-1"></i>${nombreChofer}
            </span>
        </span>
    `);
}

function cargarBuses() {
    $("#cboBus").html('<option value=""></option>').trigger('change');

    $.ajax({
        url: "Conductores.aspx/ListaBuses", // Revisa que la URL sea la correcta
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value=""></option>';

                $.each(response.d.Data, function (i, row) {
                    // AQUÍ ESTÁ LA MAGIA: Guardamos la data extra en atributos 'data-'
                    opcionesHTML += `
                        <option value="${row.IdBus}" 
                                data-placa="${row.Placa}" 
                                data-tipo="${row.NombreTipo}" 
                                data-asientos="${row.CapacidadAsientos}" 
                                data-chofer="${row.NombreCompleto}">
                            ${row.Placa}
                        </option>`;
                });

                $("#cboBus").html(opcionesHTML).trigger('change');

            } else {
                $("#cboBus").html('<option value="">Error al cargar</option>').trigger('change');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboBus").html('<option value="">Error de conexión</option>').trigger('change');
        }
    });
}

function cargarRutasFlota() {

    $("#cboRuta").html('<option value="">Cargando...</option>');

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

                $("#cboRuta").html(opcionesHTML);

            } else {
                $("#cboRuta").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboRuta").html('<option value="">Error de conexión</option>');
        }
    });
}

// NUEVO REGISTRO
$("#btnNuevore").on("click", function () {
    idEditar = 0;

    $("#cboRuta").val("");
    $("#cboBus").val("").trigger('change');

    // Flatpickr tiene un método nativo para resetear a hoy
    document.querySelector("#txtFechaSalida")._flatpickr.setDate("today");
    document.querySelector("#timepicker2")._flatpickr.setDate("12:00");

    $("#modalLabeldetalle").text("Nuevo Registro");
    $("#modalAdd").modal("show");
});


$("#btnGuardarCambios").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    let idBusSeleccionado = $("#cboBus").val();
    let fechaSalidaStr = $("#txtFechaSalida").val().trim();
    let horaSalidaStr = $("#timepicker2").val().trim();

    // Validar formato de Fecha estricto (dd/mm/yyyy)
    const regexFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexFecha.test(fechaSalidaStr)) {
        ToastMaster.fire({ icon: 'warning', title: 'Ingrese una fecha válida (dd/mm/yyyy).' });
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }

    // Validar formato de Hora estricto (HH:mm en formato 24h)
    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(horaSalidaStr)) {
        ToastMaster.fire({ icon: 'warning', title: 'Ingrese una hora válida (HH:mm).' });
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }

    // VALIDACIÓN LÓGICA DE TIEMPO (VIAJES EN EL PASADO)

    // Cortamos la fecha y la hora para armar un objeto Date exacto
    let partesFecha = fechaSalidaStr.split('/');
    let partesHora = horaSalidaStr.split(':');

    // Date(Año, Mes (0-11), Día, Hora, Minuto, Segundo)
    let fechaViajeExacta = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0],
        partesHora[0],
        partesHora[1],
        0
    );

    let ahora = new Date(); // Captura la fecha y hora de este mismo segundo

    // SOLO validamos viajes pasados si es un NUEVO registro (tal cual tu SQL)
    if (idEditar === 0) {
        if (fechaViajeExacta < ahora) {
            ToastMaster.fire({
                icon: 'warning',
                title: 'La fecha y hora de salida no pueden ser en el pasado.'
            });
            $('#btnGuardarCambios').prop('disabled', false);
            return;
        }
    }

    if ($("#cboRuta").val() === "") {
        ToastMaster.fire({ icon: 'warning', title: 'Debe seleccionar una Ruta.' });
        $("#cboRuta").focus();
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }

    if (idBusSeleccionado === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar un Bus.'
        });
        $("#cboBus").select2('open'); // Esto abre el select2 automáticamente para que elija
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }

    const objeto = {
        IdViaje: idEditar,
        IdRuta: parseInt($("#cboRuta").val()),
        IdBus: parseInt(idBusSeleccionado),
        FechaSalidaStr: fechaSalidaStr,
        HoraSalidaStr: horaSalidaStr
    }

    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Viajes.aspx/GuardarOrEditViajesProgramados",
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
            $('#btnGuardarCambios').prop('disabled', false);
        }
    });

});

// fin