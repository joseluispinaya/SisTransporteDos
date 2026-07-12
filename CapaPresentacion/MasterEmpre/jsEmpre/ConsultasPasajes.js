
let tablaData;
let viajeSeleccionadoId = 0;

$(document).ready(function () {
    // 1. Inicializar Select2 Avanzado para listado en Dropdown del Viaje
    $("#cboViajesDisponibles").select2({
        width: '100%',
        placeholder: "-- Seleccione una Salida --",
        templateResult: formatoResultadosViaje,   // Maqueta la lista desplegada
        templateSelection: formatoSeleccionViaje   // Maqueta la opción elegida
    });

    // Cargar combo inicial de Rutas
    cargarRutass();

    // 2. EVENTO CHANGE REACTIVO: Cuando cambia la ruta o el estado, buscamos los viajes automáticamente
    $("#cboRutasTable, #cboEstadosTable").on("change", function () {
        // Limpiamos la tabla de pasajeros por si había datos de una consulta anterior
        if ($.fn.DataTable.isDataTable("#tbAsientosVendidos")) {
            tablaData.clear().draw();
        }
        $("#lblRuta").text("Esperando selección de salida...");
        viajeSeleccionadoId = 0;

        // Disparamos la carga del Select2 de viajes
        cargarViajesDropdown();
    });

    // 3. EVENTO CHANGE EN EL VIAJE: Al elegir el viaje, pintamos los pasajeros inmediatamente
    $("#cboViajesDisponibles").on("change", function () {
        let idViaje = $(this).val();
        let textoSeleccionado = $("#cboViajesDisponibles option:selected").text();

        if (!idViaje) {
            viajeSeleccionadoId = 0;
            $("#lblRuta").text("Esperando selección de salida...");
            if ($.fn.DataTable.isDataTable("#tbAsientosVendidos")) {
                tablaData.clear().draw();
            }
            return;
        }

        viajeSeleccionadoId = parseInt(idViaje);
        $("#lblRuta").html(`<i class="ti ti-bus text-primary me-1"></i> Control de Manifiesto: Salida Planificada`);

        // Ejecutamos la consulta directa a la tabla
        cargarListaPasajeros(viajeSeleccionadoId);
    });
});

// Carga de Rutas del Servidor
function cargarRutass() {
    $("#cboRutasTable").html('<option value="">Cargando...</option>');
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
                $("#cboRutasTable").html(opcionesHTML);
            } else {
                $("#cboRutasTable").html('<option value="">Error al cargar</option>');
            }
        },
        error: function () {
            $("#cboRutasTable").html('<option value="">Error de conexión</option>');
        }
    });
}

// NUEVA FUNCIÓN: Almacena los Viajes en un Select2 Dinámico
function cargarViajesDropdown() {
    let idRuta = $("#cboRutasTable").val();
    let estado = $("#cboEstadosTable").val();

    if (idRuta === "") {
        $("#cboViajesDisponibles").html('<option value="">-- Primero elya una Ruta --</option>').trigger('change');
        return;
    }

    $("#cboViajesDisponibles").html('<option value="">Buscando salidas...</option>').trigger('change');

    const request = {
        IdRuta: parseInt(idRuta),
        Estado: parseInt(estado)
    };

    $.ajax({
        url: "ConsultasPasajes.aspx/ListaViajesDetalles",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value=""></option>'; // Necesario para el placeholder de Select2
                const lista = response.d.Data;

                if (lista != null && lista.length > 0) {
                    $.each(lista, function (i, item) {
                        opcionesHTML += `
                            <option value="${item.IdViaje}"
                                    data-ruta="${item.NombreRuta}"
                                    data-fecha="${item.FechaSalidaStr}"
                                    data-hora="${item.HoraSalidaStr}"
                                    data-bus="${item.TipoBus}"
                                    data-placa="${item.PlacaBus}"
                                    data-estado="${item.Estado}">
                                Horario: ${item.HoraSalidaStr} | Bus: ${item.TipoBus}
                            </option>`;
                    });
                    $("#cboViajesDisponibles").html(opcionesHTML).trigger('change');
                } else {
                    $("#cboViajesDisponibles").html('<option value="">No hay salidas con este criterio</option>').trigger('change');
                }
            } else {
                $("#cboViajesDisponibles").html('<option value="">Error en el servidor</option>').trigger('change');
            }
        },
        error: function () {
            $("#cboViajesDisponibles").html('<option value="">Error de comunicación</option>').trigger('change');
        }
    });
}

// Maquetación Select2: Lista Desplegada
function formatoResultadosViaje(item) {
    if (!item.id) return item.text;

    let d = item.element.dataset;
    let badgeColor = d.estado === "1" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning";
    let estadoTexto = d.estado === "1" ? "Programado" : (d.estado === "2" ? "En Ruta" : (d.estado === "3" ? "Finalizado" : "Cancelado"));

    return $(`
        <div class="d-flex flex-column py-1 border-bottom border-light">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold"><i class="ti ti-clock me-1 text-muted"></i> Salida: ${d.hora}</span>
                <span class="badge ${badgeColor} fs-11">${estadoTexto}</span>
            </div>
            <span class="text-muted fs-12 mb-1"><i class="ti ti-calendar me-1"></i> Fecha: ${d.fecha}</span>
            <span class="text-secondary fw-semibold fs-12"><i class="ti ti-steering-wheel me-1"></i> Flota: ${d.bus} <span class="text-muted">(${d.placa})</span></span>
        </div>
    `);
}

// Maquetación Select2: Caja Cerrada
function formatoSeleccionViaje(item) {
    if (!item.id) return item.text;
    let d = item.element.dataset;
    return $(`<span><i class="ti ti-bus me-1 text-primary"></i> <b>Salida: ${d.hora}</b> <span class="text-muted ms-1 fs-13">(${d.fecha} - Bus ${d.bus})</span></span>`);
}

// DataTables de Pasajeros (Se mantiene tu lógica intacta, solo adaptada visualmente a Boron)
function cargarListaPasajeros(idViaje) {
    if ($.fn.DataTable.isDataTable("#tbAsientosVendidos")) {
        $("#tbAsientosVendidos").DataTable().destroy();
        $('#tbAsientosVendidos tbody').empty();
    }

    tablaData = $("#tbAsientosVendidos").DataTable({
        responsive: true,
        searching: true,
        info: false,
        "ajax": {
            "url": 'ConsultasPasajes.aspx/ListaPasajerosViaje',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify({ IdViaje: parseInt(idViaje) });
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": "NombreCliente",
                "render": function (data, type, row) {
                    return `<div class="fw-bold text-dark fs-14">${data}</div>
                            <div class="fs-12 text-muted"><i class="ti ti-id me-1"></i>CI: ${row.NroCi}</div>`;
                }
            },
            {
                "data": null, // Usamos null para tener acceso a toda la fila (row)
                "render": function (data, type, row) {
                    return `
                        <div class="d-flex align-items-center fw-medium text-dark">
                            <i class="ti ti-map-pin text-warning me-1 fs-15"></i> ${row.CiudadOrigen}
                            <i class="ti ti-arrow-narrow-right text-muted mx-2"></i>
                            <i class="ti ti-map-pin-filled text-success me-1 fs-15"></i> ${row.CiudadDestino}
                        </div>`;
                }
            },
            {
                "data": "Estado",
                "render": function (data, type, row) {
                    let estadoBadge = '';
                    if (data === 1) estadoBadge = `<span class="badge bg-warning-subtle text-warning border border-warning-subtle fs-12 px-2 py-1">Reserva</span>`;
                    else if (data === 2) estadoBadge = `<span class="badge bg-success-subtle text-success border border-success-subtle fs-12 px-2 py-1">Vendido</span>`;
                    else estadoBadge = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle fs-12 px-2 py-1">Cancelado</span>`;

                    let menorIcon = row.LlevaMenorEdad ? `<i class="ti ti-baby-carriage fs-15 text-info ms-1" title="Compartido con menor"></i>` : '';
                    let asientoFormateado = row.NroAsiento.toString().padStart(2, '0');

                    return `<div class="d-flex flex-column gap-1">
                                <div><span class="fw-bolder text-success fs-14">Bs. ${row.CostoPasaje.toFixed(2)}</span> ${menorIcon}</div>
                                <div class="d-flex align-items-center gap-2">
                                    ${estadoBadge} <span class="fs-13 text-dark fw-bold">Asiento #${asientoFormateado}</span>
                                </div>
                            </div>`;
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    let btnImprimir = (row.Estado === 1 || row.Estado === 2)
                        ? `<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle me-1 btn-imprimir" title="Reimprimir"><i class="ti ti-printer fs-16"></i></button>`
                        : '';
                    let btnDetalle = `<button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-detalle" title="Gestionar"><i class="ti ti-settings fs-16"></i></button>`;
                    return `<div class="text-center">${btnImprimir}${btnDetalle}</div>`;
                },
                "orderable": false,
                "searchable": false
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// EVENTO: BOTÓN IMPRIMIR
$('#tbAsientosVendidos tbody').on('click', '.btn-imprimir', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // Llamas a tu función de impresión pasándole el IdBoleto que está en la fila
    imprimirTicket(data.IdBoleto);
});

// EVENTO: BOTÓN DETALLE
$('#tbAsientosVendidos tbody').on('click', '.btn-detalle', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    let asientoFormateado = data.NroAsiento.toString().padStart(2, '0');
    let textoSms = `Gestión de Asiento #${asientoFormateado}`;

    //mostrarAlertaZero("¡Mensaje!", textoSms, "info");

    // Llenamos los datos
    $("#txtIdBoleto").val(data.IdBoleto);
    $("#txtPasajeroDetalle").val(data.NombreCliente);
    $("#txtNroAsientoModal").val(asientoFormateado);
    $("#txtEstadoActual").val(data.EstadoTexto);

    // LA MAGIA: Mostrar u ocultar botones según el Estado
    if (data.Estado === 1) { // 1 = Reserva
        $("#divAccionesReserva").removeClass("d-none");
    } else { // 2 = Vendido, 0 = Cancelado
        $("#divAccionesReserva").addClass("d-none");
    }

    // Mostrar modal
    $("#modalLabeldetalle").html(`<i class="ti ti-ticket me-2 text-primary"></i>${textoSms}`);
    $("#modalDetalleBoleto").modal("show");
});

// EVENTO: PAGAR RESERVA
$("#btnConfirmarPago").on("click", function () {
    let idBoleto = $("#txtIdBoleto").val();
    let texto = $("#modalLabeldetalle").text().replace("Gestión de ", ""); // Extrae "Asiento #05"


    if (idBoleto === "0" || idBoleto === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Ocurrió un error, intente nuevamente.'
        });
        return;
    }

    // 1. SweetAlert de Confirmación
    Swal.fire({
        title: '¿Registrar Pago?',
        text: `Se emitirá el comprobante de venta para el ${texto}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="ti ti-check me-1"></i> Sí, procesar pago',
        cancelButtonText: '<i class="ti ti-x me-1"></i> Cancelar',
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-success me-2 mt-2", // <-- CORREGIDO: Verde para éxito/ingreso
            cancelButton: "btn btn-soft-secondary mt-2" // <-- Estilo Boron suave
        }
    }).then((result) => {
        if (result.isConfirmed) {

            // Bloqueamos el botón para evitar que la secretaria haga doble clic por accidente
            let $btn = $("#btnConfirmarPago");
            let textoOriginal = $btn.html();
            $btn.prop("disabled", true).html('<i class="spinner-border spinner-border-sm me-1"></i>Procesando...');

            // 2. Petición AJAX al WebMethod
            $.ajax({
                url: "ConsultasPasajes.aspx/PagarReserva", // Asegúrate de que el WebMethod se llame exactamente así
                type: "POST",
                data: JSON.stringify({ IdBoleto: parseInt(idBoleto) }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    // Restauramos el botón
                    $btn.prop("disabled", false).html(textoOriginal);

                    if (response.d.Estado) {
                        ToastMaster.fire({ icon: 'success', title: 'Pago registrado con éxito.' });

                        // b) Cerramos el modal
                        $("#modalDetalleBoleto").modal("hide");
                        $("#txtIdBoleto").val("0");

                        // c) Recargamos la tabla de pasajeros para que desaparezca el botón de "Pagar"
                        cargarListaPasajeros(viajeSeleccionadoId);

                        // e) Imprimimos el ticket que acaba de generarse
                        imprimirTicket(idBoleto);

                    } else {
                        // Si es caso 2 o 3, mostramos el warning/error que mandó C#
                        mostrarAlertaTimer('Atención', response.d.Mensaje, response.d.Valor);
                    }
                },
                error: function (xhr) {
                    $btn.prop("disabled", false).html(textoOriginal);
                    mostrarAlertaTimer('Error', 'Problema de comunicación con el servidor.', 'error');
                }
            });
        }
    });
});

// EVENTO: ANULAR RESERVA
$("#btnAnularReserva").on("click", function () {
    let idBoleto = $("#txtIdBoleto").val();
    let texto = $("#modalLabeldetalle").text().replace("Gestión de ", "");

    if (idBoleto === "0" || idBoleto === "") {
        ToastMaster.fire({ icon: 'warning', title: 'Ocurrió un error, intente nuevamente.' });
        return;
    }

    // 1. SweetAlert de Confirmación
    Swal.fire({
        title: '¿Anular Reserva?',
        text: `Se liberará el ${texto}. Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="ti ti-trash me-1"></i> Sí, Anular',
        cancelButtonText: '<i class="ti ti-x me-1"></i> Cancelar',
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-danger me-2 mt-2", // <-- ROJO: Correcto para eliminación
            cancelButton: "btn btn-soft-secondary mt-2"
        }
    }).then((result) => {
        if (result.isConfirmed) {

            // Bloqueamos el botón para evitar que la secretaria haga doble clic por accidente
            let $btn = $("#btnAnularReserva");
            let textoOriginal = $btn.html();
            $btn.prop("disabled", true).html('<i class="spinner-border spinner-border-sm me-1"></i>Procesando...');

            // 2. Petición AJAX al WebMethod
            $.ajax({
                url: "ConsultasPasajes.aspx/EliminarReserva", // Asegúrate de que el WebMethod se llame exactamente así
                type: "POST",
                data: JSON.stringify({ IdBoleto: parseInt(idBoleto) }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    // Restauramos el botón
                    $btn.prop("disabled", false).html(textoOriginal);

                    if (response.d.Estado) {
                        // a) Mostramos la alerta usando las variables mágicas de tu C#
                        mostrarAlertaTimer('¡Excelente!', response.d.Mensaje, response.d.Valor);

                        // b) Cerramos el modal
                        $("#modalDetalleBoleto").modal("hide");
                        $("#txtIdBoleto").val("0");

                        cargarListaPasajeros(viajeSeleccionadoId);

                    } else {
                        // Si es caso 2 o 3, mostramos el warning/error que mandó C#
                        mostrarAlertaTimer('Atención', response.d.Mensaje, response.d.Valor);
                    }
                },
                error: function (xhr) {
                    $btn.prop("disabled", false).html(textoOriginal);
                    mostrarAlertaTimer('Error', 'Problema de comunicación con el servidor.', 'error');
                }
            });
        }
    });
});

function imprimirTicket(idBoletoNuevo) {
    const request = {
        IdBoleto: parseInt(idBoletoNuevo)
    };

    $.ajax({
        url: "VentaPasajes.aspx/ObtenerDetalleBoletoImpresion",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const datosBoleto = response.d.Data;

                // 1. LLENADO DE DATOS DINÁMICOS DE LA EMPRESA (SaaS)
                $("#tck_EmpresaNombre").text(datosBoleto.EmpresaNombre.toUpperCase());

                let nitTexto = datosBoleto.EmpresaNIT ? `NIT: ${datosBoleto.EmpresaNIT}` : "NIT: S/N";
                let telTexto = datosBoleto.EmpresaTelefono ? ` | Tel: ${datosBoleto.EmpresaTelefono}` : "";
                $("#tck_EmpresaDetalle").text(nitTexto + telTexto);
                $("#tck_EmpresaDireccion").text(datosBoleto.EmpresaDireccion || "Dirección no registrada");

                // Lógica Inteligente para el Logo Horizontal
                if (datosBoleto.EmpresaLogoUrl && datosBoleto.EmpresaLogoUrl.trim() !== "") {
                    $("#tck_EmpresaLogo").attr("src", datosBoleto.EmpresaLogoUrl);
                    $("#tck_ContenedorLogo").show();
                } else {
                    $("#tck_ContenedorLogo").hide(); // Ocultamos el bloque si la empresa no tiene logo
                }

                // 2. LLENADO DE DATOS GENERALES DEL BOLETO
                $("#tck_Tipo").text(datosBoleto.TipoTransaccion);
                $("#tck_Comprobante").text(datosBoleto.NroComprobante);
                $("#tck_Fecha").text(datosBoleto.FechaSalidaStr);
                $("#tck_Hora").text(datosBoleto.HoraSalidaStr);
                $("#tck_Bus").text(datosBoleto.TipoBus + ' | ' + datosBoleto.PlacaBus);

                $("#tck_Origen").text(datosBoleto.CiudadOrigen.toUpperCase());
                $("#tck_Destino").text(datosBoleto.CiudadDestino.toUpperCase());

                $("#tck_Pasajero").text(datosBoleto.NombrePasajero.toUpperCase());
                $("#tck_CI").text(datosBoleto.CIPasajero);

                // Controlamos el asiento y el menor de edad
                let textoAsiento = datosBoleto.NroAsiento.toString();
                if (datosBoleto.LlevaMenorEdad) {
                    textoAsiento += " (+BEBÉ)";
                }
                $("#tck_Asiento").text(textoAsiento);
                $("#tck_Precio").text(datosBoleto.CostoPasaje.toFixed(2));

                // Retardo óptimo de 250ms para que el navegador renderice la imagen del logo antes de imprimir
                setTimeout(function () {
                    window.print();
                }, 250);

            } else {
                mostrarAlertaTimer("¡Atención!", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            mostrarAlertaZero("¡Atención!", "Error de comunicación al generar el comprobante.", "error");
        }
    });
}

// fin