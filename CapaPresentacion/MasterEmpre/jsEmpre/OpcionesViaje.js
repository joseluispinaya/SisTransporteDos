
let tablaData;
const { jsPDF } = window.jspdf;

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
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-detalle me-1" title="Detalle Viaje">
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