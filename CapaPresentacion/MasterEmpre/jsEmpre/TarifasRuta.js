

let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listaTarifario();
    cargarTodasCiudades();
    cargarTipoBuses();
});

function listaTarifario() {

    tablaData = $("#tbTarifas").DataTable({
        responsive: true,
        searching: true,
        info: false,
        "ajax": {
            "url": 'TarifasRuta.aspx/ListaTarifas',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}"; // Mi WebMethod usa Sesión, no necesita parámetros de entrada
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
            // COLUMNA RUTA (Fusionada: Origen -> Destino)
            {
                "data": null, // Usamos null para tener acceso a toda la fila (row)
                render: function (data, type, row) {
                    return `
                        <div class="d-flex align-items-center fw-medium text-dark">
                            <i class="ti ti-map-pin text-warning me-1 fs-15"></i> ${row.CiudadOrigen}
                            <i class="ti ti-arrow-narrow-right text-muted mx-2"></i>
                            <i class="ti ti-map-pin-filled text-success me-1 fs-15"></i> ${row.CiudadDestino}
                        </div>`;
                }
            },

            // COLUMNA TIPO BUS Y PRECIO PASAJE
            {
                "data": "NombreTipo",
                render: function (data, type, row) {
                    // Formateamos para asegurar que siempre muestre 2 decimales (Ej: 50.00)
                    let precio = parseFloat(row.PrecioPasaje).toFixed(2);
                    return `
                        <div class="d-flex flex-column">
                            <span class="fw-bold text-dark"><i class="ti ti-bus me-1 text-muted"></i>Bus ${data}</span>
                            <span class="text-success fw-semibold" style="font-size: 0.85em;">
                                <i class="ti ti-cash me-1"></i>Pasaje: ${precio} Bs.
                            </span>
                        </div>`;
                }
            },

            // COLUMNA ENCOMIENDA
            {
                "data": "PrecioKiloEncomienda",
                render: function (data) {
                    let precio = parseFloat(data).toFixed(2);
                    return `
                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle fs-12 px-2 py-1">
                            <i class="ti ti-package me-1"></i>${precio} Bs. / Kg
                        </span>`;
                }
            },

            // COLUMNA ESTADO (Activo/Inactivo)
            {
                "data": "Estado",
                "className": "text-center",
                render: function (data) {
                    if (data === true) {
                        return `<span class="badge bg-success-subtle text-success fs-12"><i class="ti ti-check me-1"></i>Activo</span>`;
                    } else {
                        return `<span class="badge bg-danger-subtle text-danger fs-12"><i class="ti ti-x me-1"></i>Inactivo</span>`;
                    }
                }
            },

            // COLUMNA OPCION
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar" title="Editar">
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

function cargarTipoBuses() {

    $("#cboTipobus").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Conductores.aspx/ListaTipoBuses",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione un Tipo --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTipoBus}">${row.NombreTipo}</option>`;
                });

                $("#cboTipobus").html(opcionesHTML);

            } else {
                $("#cboTipobus").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboTipobus").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasCiudades() {

    let combosCiudadess = $("#cboCiudadOrigen, #cboCiudadDestino");

    combosCiudadess.prop('disabled', true).html('<option value="">Cargando Ciudades...</option>');

    //combosCiudadess.html('<option value="">Cargando Ciudades...</option>');

    $.ajax({
        url: "TerminalParada.aspx/ListaCiudadesParada",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione una Ciudad --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCiudad}">${row.Nombre}</option>`;
                });

                // Carga las opciones y vuelve a habilitar
                combosCiudadess.html(opcionesHTML).prop('disabled', false);

                //combosCiudadess.html(opcionesHTML);

            } else {
                combosCiudadess.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosCiudadess.html('<option value="">Error de conexión</option>');
        }
    });
}


$('#tbTarifas tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdTarifa;
    $("#cboCiudadOrigen").val(data.IdOrigen);
    $("#cboCiudadDestino").val(data.IdDestino);
    $("#cboTipobus").val(data.IdTipoBus);

    $("#txtPrePasaje").val(data.PrecioPasaje);
    $("#txtPreKilo").val(data.PrecioKiloEncomienda);

    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);
    $("#modalLabeltarifa").text("Editar Tarifa");
    $("#modalTarifa").modal("show");

});

$("#btnNuevoRegistro").on("click", function () {

    idEditar = 0;

    $("#cboCiudadOrigen").val("");
    $("#cboCiudadDestino").val("");
    $("#cboTipobus").val("");
    $("#txtPrePasaje").val("");
    $("#txtPreKilo").val("");

    $("#cboEstado").val(1).prop("disabled", true);

    // 4. Mostramos el modal
    $("#modalLabeltarifa").text("Nuevo Registro");
    $("#modalTarifa").modal("show");
});

$("#btnGuardarTarifa").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarTarifa').prop('disabled', true);

    let idOrigen = $("#cboCiudadOrigen").val();
    let idDestino = $("#cboCiudadDestino").val();
    let idTipoBus = $("#cboTipobus").val();

    // Obtenemos los valores en texto
    let pasaje = $("#txtPrePasaje").val().trim().replace(',', '.');
    let preKilo = $("#txtPreKilo").val().trim().replace(',', '.');

    // Los convertimos a decimales (flotantes) de JavaScript
    let pasajeDecimal = parseFloat(pasaje);
    let preKiloDecimal = parseFloat(preKilo);

    // Validación Precio Pasaje (Vacío, no numérico, o menor/igual a 0)
    if (pasaje === "" || isNaN(pasajeDecimal) || pasajeDecimal <= 0) {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe ingresar un precio de pasaje válido mayor a 0'
        });

        $("#txtPrePasaje").focus();
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    // Validación Precio Kilo
    if (preKilo === "" || isNaN(preKiloDecimal) || preKiloDecimal <= 0) {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe ingresar un precio por kilo válido mayor a 0'
        });

        $("#txtPreKilo").focus();
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    if (idOrigen === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar ciudad de Origen.'
        });
        $("#cboCiudadOrigen").focus();
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    if (idDestino === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar ciudad de Destino.'
        });
        $("#cboCiudadDestino").focus();
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    if (idOrigen === idDestino) {
        ToastMaster.fire({
            icon: 'warning',
            title: 'La ciudad de Origen y Destino no pueden ser la misma.'
        });
        $("#cboCiudadDestino").focus(); // Mandamos el foco al destino para que lo cambie
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    if (idTipoBus === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar un Tipo de Bus.'
        });
        $("#cboTipobus").focus();
        $('#btnGuardarTarifa').prop('disabled', false);
        return;
    }

    // Armamos el objeto enviando los decimales ya convertidos
    const objeto = {
        IdTarifa: idEditar,
        IdOrigen: parseInt(idOrigen),
        IdDestino: parseInt(idDestino),
        IdTipoBus: parseInt(idTipoBus),
        PrecioPasaje: pasajeDecimal,          // Enviamos el decimal limpio
        PrecioKiloEncomienda: preKiloDecimal,  // Enviamos el decimal limpio
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    }

    $("#modalTarifa").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "TarifasRuta.aspx/GuardarOrEditTarifarios",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalTarifa").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalTarifa").modal("hide");

                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalTarifa").find("div.modal-content").LoadingOverlay("hide");
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnGuardarTarifa').prop('disabled', false);
        }
    });

});

// fin