
let tablaData;
const { jsPDF } = window.jspdf;
let viajeCambioData = null;
let totalAsientosOcupados = 0;

$(document).ready(function () {
    cargarRutass();

    // Inicializar Select2 para Bus
    $("#cboBus").select2({
        dropdownParent: $('#mdCambioBus'),
        width: '100%',
        placeholder: "-- Seleccione un Bus --",
        //allowClear: true,
        templateResult: formatoResultadosBus,
        templateSelection: formatoSeleccionBus
    });

    cargarBuses();
});

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

// EVENTO: SELECCIÓN VISUAL DEL BUS EN EL SELECT2
$("#cboBus").on("change", function () {
    let $selected = $(this).find(':selected');
    let val = $(this).val();

    // Si se limpia el select, volvemos al estado inicial "Esperando..."
    if (!val) {
        $("#lblNombreChofer").text("Esperando...");
        $("#lblNroAsien").text("Esperando...");
        $("#lblNroplaca").text("Esperando...");
        return;
    }

    let chofer = $selected.data("chofer") || "No asignado";
    let placa = $selected.data("placa");
    let asientos = $selected.data("asientos");

    // Pintamos los datos en el recuadro azul (divDetalleVerifi)
    $("#lblNombreChofer").text(chofer);
    $("#lblNroAsien").text(asientos);
    $("#lblNroplaca").text(placa);
});

function cargarBuses() {
    $("#cboBus").html('<option value=""></option>').trigger('change');

    $.ajax({
        url: "Conductores.aspx/ListaBuses",
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
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-cambiobus me-1" title="Cambio de Bus">
                        <i class="ti ti-eye"></i>
                    </button>
                    <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-reportes me-1" title="Lista Pasajeros">
                        <i class="ti ti-printer"></i>
                    </button>
                    <button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-estado" title="Cambiar Estado">
                        <i class="ti ti-settings"></i>
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

// EVENTO: ABRIR MODAL CAMBIO DE BUS
$('#tbData tbody').on('click', '.btn-cambiobus', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    if (data.Estado !== 1) {
        mostrarAlertaZero("¡Atención!", "Solo se pueden modificar los viajes en estado 'Programado'. Este viaje ya está " + data.EstadoTexto + ".", "warning");
        return;
    }

    // 1. Guardamos la data general del viaje
    viajeCambioData = data;

    // 2. Efecto visual de carga en el botón presionado (opcional pero recomendado)
    let $btnFila = $(this);
    let textoOriginalBtn = $btnFila.html();
    $btnFila.html('<i class="spinner-border spinner-border-sm align-middle"></i>').prop('disabled', true);

    // 3. LA CONSULTA AJAX ANTES DE ABRIR EL MODAL
    $.ajax({
        url: "VentaPasajes.aspx/ObtenerAsientosVendidos", // URL que proporcionaste
        type: "POST",
        data: JSON.stringify({ IdViaje: parseInt(data.IdViaje) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            // Restauramos el botón de la tabla
            $btnFila.html(textoOriginalBtn).prop('disabled', false);

            if (response.d.Estado) {
                // Contamos cuántos asientos están ocupados (Vendidos + Reservados)
                const ocupados = response.d.Data;
                totalAsientosOcupados = (ocupados && ocupados.length > 0) ? ocupados.length : 0;

                // 4. PREPARAMOS EL MODAL
                let textoSms = `Salida: ${data.NombreRuta} (${data.PlacaBus})`;
                $("#lblBusDato").text(textoSms);
                $("#txtNroAsientos").val(data.CapacidadAsientos);

                // Estado inicial de los paneles
                $("#divNuevoBus").show();
                $("#divDetalleVerifi").addClass("d-none").hide();

                // Limpiamos el Select2
                $("#cboBus").val("").trigger("change");

                // 5. ¡AHORA SÍ ABRIMOS EL MODAL!
                $("#mdCambioBus").modal("show");

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

// EVENTO: VERIFICACIÓN MATEMÁTICA Y COMPARACIÓN
$("#btnVerificar").on("click", function () {
    let idNuevoBus = $("#cboBus").val();

    if (!idNuevoBus) {
        ToastMaster.fire({ icon: 'warning', title: 'Debe seleccionar un Bus de la lista.' });
        $("#cboBus").select2('open');
        return;
    }

    if (parseInt(idNuevoBus) === viajeCambioData.IdBus) {
        mostrarAlertaZero("Atención", "El bus seleccionado es el mismo que ya está asignado al viaje.", "warning");
        return;
    }

    let $selected = $("#cboBus").find(':selected');
    let asientosNuevos = parseInt($selected.data("asientos"));
    let asientosViejos = parseInt($("#txtNroAsientos").val());

    // ==========================================
    // LÓGICA MATEMÁTICA CON ASIENTOS REALES
    // ==========================================

    // ESCENARIO 3: BLOQUEO TOTAL (El bus nuevo es tan pequeño que la gente se queda parada)
    if (asientosNuevos < totalAsientosOcupados) {
        Swal.fire({
            title: '¡Operación Imposible!',
            html: `No puede asignar este bus.<br><br>
                   El nuevo vehículo solo tiene <b>${asientosNuevos} asientos</b>, pero actualmente ya hay <b>${totalAsientosOcupados} pasajeros</b> registrados (vendidos o reservados) para este viaje.`,
            icon: 'error',
            confirmButtonText: 'Entendido',
            customClass: { confirmButton: "btn btn-danger mt-2" },
            buttonsStyling: false
        });
        return; // Cortamos la ejecución aquí
    }

    // ESCENARIO 2: ADVERTENCIA (El bus es más pequeño que el original, pero la gente sí cabe)
    if (asientosNuevos < asientosViejos) {
        Swal.fire({
            title: '¡Capacidad Reducida!',
            html: `El bus original tenía <b>${asientosViejos} asientos</b> y el nuevo solo tiene <b>${asientosNuevos}</b>.<br><br>
                   Los ${totalAsientosOcupados} pasajeros actuales <b>SÍ CABEN</b>, pero reducirá su capacidad de ventas futuras para este viaje.<br>¿Desea continuar?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<i class="ti ti-check me-1"></i> Sí, continuar',
            cancelButtonText: '<i class="ti ti-x me-1"></i> Cancelar',
            customClass: {
                confirmButton: "btn btn-warning me-2 mt-2",
                cancelButton: "btn btn-soft-secondary mt-2"
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarPanelConfirmacion();
            }
        });
        return;
    }

    // ESCENARIO 1: ÉXITO DIRECTO (El bus es igual o más grande)
    mostrarPanelConfirmacion();
});

// FUNCION: Mostrar el panel de confirmación
function mostrarPanelConfirmacion() {
    // 1. Ocultamos suavemente el combo del bus
    $("#divNuevoBus").slideUp(300, function () {
        // 2. EL TRUCO: Lo ocultamos con JS, le quitamos la atadura de Bootstrap, y lo deslizamos
        $("#divDetalleVerifi").hide().removeClass("d-none").slideDown(300);
    });
}

// EVENTO: Botón para retroceder
$("#btnRetrocederBus").on("click", function () {
    // 1. Ocultamos suavemente el detalle
    $("#divDetalleVerifi").slideUp(300, function () {
        // 2. Limpieza: Le devolvemos su clase original por si cerramos el modal
        $(this).addClass("d-none").css("display", "");

        // 3. Volvemos a mostrar el combo
        $("#divNuevoBus").slideDown(300);
    });
});

$("#btnConfirmar").on("click", function () {

    mostrarAlertaZero("¡Atención!", "En proceso de desarrollo....", "warning");
});

$('#tbData tbody').on('click', '.btn-estado', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    let textoSms = `Ruta ${data.NombreRuta}`;

    //mostrarAlertaZero("¡Mensaje!", textoSms, "info");

    // Llenamos los datos
    $("#txtIdViajePro").val(data.IdViaje);
    $("#txtPlacaDetalle").val(data.PlacaBus);
    $("#txtTipoBus").val(data.TipoBus);
    $("#txtEstadoActual").val(data.EstadoTexto);
    $("#txtFechaSa").val(data.FechaSalidaStr);

    // LA MAGIA: Mostrar u ocultar botones según el Estado
    if (data.Estado === 1) { // 1 = Programado
        $("#divAccionesProgra").removeClass("d-none");
    } else if (data.Estado === 2) { // 2 = En Ruta
        $("#divAccionesRuta").removeClass("d-none");
    } else { // 3 = Finalizado, 0 = Cancelado
        $("#divAccionesProgra").addClass("d-none");
        $("#divAccionesRuta").addClass("d-none");
    }

    // Mostrar modal
    $("#modalLabeldetalle").text(textoSms);
    $("#modalDetalleOpcion").modal("show");
});


// EVENTO: BOTÓN REPORTES (Manifiesto de Pasajeros)
$('#tbData tbody').on('click', '.btn-reportes', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    $.ajax({
        url: "ConsultasPasajes.aspx/ListaPasajerosViaje",
        type: "POST",
        data: JSON.stringify({ IdViaje: parseInt(data.IdViaje) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const listaPasa = response.d.Data;
                if (listaPasa.length < 1) {
                    ToastMaster.fire({
                        icon: 'warning',
                        title: 'No se puede generar un reporte vacío. Verifique que existan pasajeros.'
                    });
                } else {
                    // Pasamos los datos del viaje y la lista de pasajeros
                    generarReportePasajeros(data, listaPasa);
                }
            } else {
                mostrarAlertaTimer("¡Atención!", response.d.Mensaje, "warning");
            }
        },
        error: function () {
            mostrarAlertaTimer("¡Atención!", "Error de comunicación con el servidor.", "error");
        }
    });
});

function generarReportePasajeros(datos, lista) {
    // IMPORTANTE: Al usar la versión UMD de jsPDF, se debe inicializar así:
    //const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const fechaActual = new Date().toLocaleDateString("es-BO");
    const cantPasa = `Total Pasajeros: ${lista.length}`;

    // ==========================================
    // 1. ENCABEZADO DINÁMICO (SaaS Multi-Empresa)
    // ==========================================

    // Título Principal (Derecha) - Se dibuja primero para asegurar el flujo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(22, 160, 133); // Color Teal Institucional
    doc.text("PLANILLA DE CONTROL DE VIAJE", pageWidth - 15, 15, { align: "right" });

    // Datos Legales Dinámicos desde la variable Global de la Empresa
    doc.setTextColor(0); // Negro sólido
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(empresaGlobal.RazonSocial.toUpperCase(), pageWidth - 15, 21, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`NIT: ${empresaGlobal.NIT || 'S/N'}`, pageWidth - 15, 26, { align: "right" });
    doc.text(`Cel/Tel: ${empresaGlobal.Telefono || '---'}`, pageWidth - 15, 31, { align: "right" });

    // Línea divisoria decorativa neobrutalista
    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.5);
    doc.line(15, 34, pageWidth - 15, 34);

    // --- Bloque de Información del Viaje (Dos Columnas) ---
    doc.setTextColor(0);
    doc.setFontSize(10);

    // Columna 1: Ruta y Unidad
    doc.setFont("helvetica", "bold");
    doc.text("RUTA COMERCIAL:", 15, 42);
    doc.setFont("helvetica", "normal");
    doc.text(datos.NombreRuta.toUpperCase(), 50, 42);

    doc.setFont("helvetica", "bold");
    doc.text("UNIDAD (BUS):", 15, 47);
    doc.setFont("helvetica", "normal");
    doc.text(`${datos.TipoBus.toUpperCase()} - PLACA: ${datos.PlacaBus.toUpperCase()}`, 50, 47);

    // Columna 2: Fecha y Horarios de Salida
    doc.setFont("helvetica", "bold");
    doc.text("FECHA VIAJE:", 120, 42);
    doc.setFont("helvetica", "normal");
    doc.text(datos.FechaSalidaStr, 150, 42);

    doc.setFont("helvetica", "bold");
    doc.text("HORA SALIDA:", 120, 47);
    doc.setFont("helvetica", "normal");
    doc.text(datos.HoraSalidaStr + " Hrs.", 150, 47);

    doc.setFontSize(8.5);
    doc.setTextColor(100);
    doc.text(`Doc. Digital: ${fechaActual} | Origen: Riberalta`, pageWidth - 15, 54, { align: "right" });

    // ==========================================
    // 2. TABLA DE PASAJEROS (AutoTable)
    // ==========================================
    const headers = [["#", "PASAJEROS", "NRO. (CI)", "DESTINO", "ASIENTO Y ESTADO"]];

    const dataReporte = lista.map((item, index) => [
        (index + 1).toString().padStart(2, '0'),
        item.NombreCliente.toUpperCase(),
        item.NroCi,
        item.CiudadDestino.toUpperCase(),
        `ASIENTO ${item.NroAsiento.toString().padStart(2, '0')} - ${item.EstadoTexto.toUpperCase()}`
    ]);

    doc.autoTable({
        startY: 57,
        head: headers,
        body: dataReporte,
        theme: 'grid',
        styles: { fontSize: 8.5, cellPadding: 2.5, valign: 'middle' },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 65 },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 35 },
            4: { cellWidth: 45, halign: 'center' }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
            // Enumeración automática de páginas al pie del reporte
            const str = "Página " + doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(str, pageWidth - 20, pageHeight - 10);
        }
    });

    // ==========================================
    // 3. RESUMEN, CUADRO DE FIRMAS Y CIERRE
    // ==========================================
    let finalY = doc.lastAutoTable.finalY;
    if (finalY + 45 > pageHeight) {
        doc.addPage();
        finalY = 20;
    }

    // Cuadro de Resumen Inferior Derecho
    doc.setFillColor(245, 245, 245);
    doc.rect(130, finalY + 5, 65, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(cantPasa, 190, finalY + 11.5, { align: "right" });

    // Estructura de Firma de Autorización Legal
    const firmaY = finalY + 35;
    doc.setDrawColor(150);
    doc.setLineWidth(0.3);
    doc.line(70, firmaY, 140, firmaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("FIRMA ENCARGADO DE TURNO", pageWidth / 2, firmaY + 5, { align: "center" });
    doc.text(empresaGlobal.RazonSocial.toUpperCase(), pageWidth / 2, firmaY + 9, { align: "center" });

    // ==========================================
    // 4. INYECCIÓN DEL LOGO (Asíncrona y Segura)
    // ==========================================
    // Cargamos el logo al final para evitar que un retraso de red con la imagen bloquee el renderizado de la data
    if (empresaGlobal.LogoUrl && empresaGlobal.LogoUrl.trim() !== "") {
        var img = new Image();
        img.src = empresaGlobal.LogoUrl;

        img.onload = function () {
            // Detectamos si es un JPG analizando la extensión
            let formato = empresaGlobal.LogoUrl.toLowerCase().endsWith('.jpg') || empresaGlobal.LogoUrl.toLowerCase().endsWith('.jpeg') ? 'JPEG' : 'PNG';

            // Inyectamos retrospectivamente el logo en la primera página
            doc.setPage(1);
            try {
                // Ajustado proporcionalmente para logos horizontales de taquillas
                doc.addImage(img, formato, 15, 10, 45, 18, undefined, 'FAST');
            } catch (e) {
                console.warn("Error al renderizar el logo de la empresa en el PDF:", e);
            }
            // Guardamos el documento finalizado una vez cargado el logo
            doc.save(`Planilla_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
        };

        img.onerror = function () {
            // Si la imagen falla (404 o problemas de red), descargamos el PDF de todas formas con la data intacta
            console.warn("No se pudo cargar el archivo del logo desde la URL especificada.");
            doc.save(`Planilla_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
        };
    } else {
        // Si la empresa no tiene configurado un logo, guardamos el archivo de inmediato
        doc.save(`Planilla_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
    }
}

// fin