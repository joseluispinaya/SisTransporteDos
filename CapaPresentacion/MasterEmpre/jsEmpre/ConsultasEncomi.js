
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
                    <button class="btn btn-soft-success btn-icon btn-sm rounded-circle btn-detalle me-1" title="Lista Encomiendas">
                        <i class="ti ti-box"></i>
                    </button>
                    <button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-notifica" title="Notificacion">
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

let listEncomiendasRpt = [];
let viajeSeleccionadoData = null;

// EVENTO CLIC: VER DETALLE DE ENCOMIENDAS POR VIAJE
$('#tbData tbody').on('click', '.btn-detalle', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    viajeSeleccionadoData = data;

    let textoSms = `Salida: ${data.NombreRuta} (${data.HoraSalidaStr})`;

    // Cambiamos el id al h5 directo quitando problemas de dobles iconos
    $("#modalLabeldetalle").html(`<i class="ti ti-package me-2 text-primary fs-22"></i>${textoSms}`);

    // Cargamos los datos en la tabla interna del modal
    cargarListaEncomiendas(data.IdViaje);

    // Mostrar modal
    $("#modalDetalleOpcion").modal("show");
});

function cargarListaEncomiendas(idViaje) {
    if ($.fn.DataTable.isDataTable("#tbListaEncomi")) {
        $("#tbListaEncomi").DataTable().destroy();
        $('#tbListaEncomi tbody').empty();
    }

    let tablaInterna = $("#tbListaEncomi").DataTable({
        responsive: true,
        searching: true,
        info: false,
        lengthChange: false, // Oculta el selector de cantidad de filas para que sea más compacto
        pageLength: 5,       // Muestra de 5 en 5 para no estirar el modal verticalmente
        "ajax": {
            "url": 'ConsultasEncomi.aspx/ListaEncomiendasViaje',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify({ IdViaje: parseInt(idViaje) });
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    listEncomiendasRpt = json.d.Data; // Almacenamiento seguro para el jsPDF posterior
                    return json.d.Data;
                } else {
                    mostrarAlertaZero("¡Atención!", json.d.Mensaje, "error");
                    return [];
                }
            }
        },
        "columns": [
            // 1. COLUMNA: REMITENTE
            {
                "data": "NombreRemitente",
                "render": function (data, type, row) {
                    return `
                        <div class="fw-bold text-dark fs-13 text-uppercase">${data}</div>
                        <div class="fs-12 text-muted d-flex align-items-center mt-0.5">
                            <i class="ti ti-id me-1 fs-14"></i>CI: ${row.CIRemitente} 
                            <span class="text-secondary mx-1.5">|</span> 
                            <i class="ti ti-map-pin text-warning me-1 fs-14"></i>${row.CiudadOrigen}
                        </div>`;
                }
            },
            // 2. COLUMNA: DESTINATARIO
            {
                "data": "NombreDestinatario",
                "render": function (data, type, row) {
                    return `
                        <div class="fw-bold text-dark fs-13 text-uppercase">${data}</div>
                        <div class="fs-12 text-muted d-flex align-items-center mt-0.5">
                            <i class="ti ti-id me-1 fs-14"></i>CI: ${row.CIDestinatario}
                            <span class="text-secondary mx-1.5">|</span>
                            <i class="ti ti-map-pin-filled text-success me-1 fs-14"></i>${row.CiudadDestino}
                        </div>`;
                }
            },
            // 3. COLUMNA: DETALLE ENVIÓ
            {
                "data": "Detalle",
                "render": function (data, type, row) {
                    let descripcion = data ? data.toUpperCase() : "SIN DETALLE";
                    // Si el peso es 0 (Sobre), ponemos un badge descriptivo
                    let pesoBadge = row.PesoKg > 0
                        ? `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fs-11">${row.PesoKg.toFixed(2)} Kg</span>`
                        : `<span class="badge bg-primary-subtle text-primary border border-primary-subtle fs-11"><i class="ti ti-mail fs-12 align-middle"></i> Sobre/Doc</span>`;

                    return `
                        <div class="text-wrap text-dark fw-medium fs-13 text-uppercase" style="max-width: 220px; line-height: 1.2;">${descripcion}</div>
                        <div class="mt-1">${pesoBadge}</div>`;
                }
            },
            // 4. COLUMNA: INFORMACIÓN FINANCIERA Y LOGÍSTICA
            {
                "data": "NroComprobante",
                "render": function (data, type, row) {
                    // Badge dinámico para Estado de Pago (1: Pagado, 2: Por Cobrar)
                    let pagoBadge = row.EstadoPago === 1
                        ? `<span class="badge bg-success-subtle text-success border border-success-subtle fs-11">Pagado</span>`
                        : `<span class="badge bg-warning-subtle text-warning border border-warning-subtle fs-11">Por Cobrar</span>`;

                    // Badge para Estado de Envío (1: Recepcionado, 2: Entregado, etc.)
                    let envioBadge = row.EstadoEnvio === 2
                        ? `<span class="badge bg-info-subtle text-info border border-info-subtle fs-11">Entregado</span>`
                        : `<span class="badge bg-dark-subtle text-dark border border-dark-subtle fs-11">Recepcionado</span>`;

                    return `
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="fw-bolder font-monospace text-dark fs-12">${data}</span>
                            <span class="fw-bold text-success fs-13">Bs. ${row.MontoCobrado.toFixed(2)}</span>
                        </div>
                        <div class="d-flex gap-1">
                            ${pagoBadge}
                            ${envioBadge}
                        </div>`;
                }
            }
        ],
        "order": [], // Conserva el orden secuencial por ID de tu SP
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// EVENTO CLIC: BOTÓN GENERAR REPORTE (Dentro del Modal)
$("#btnReportes").on("click", function () {
    if (listEncomiendasRpt.length === 0) {
        ToastMaster.fire({
            icon: 'warning',
            title: 'No hay encomiendas registradas en este viaje para generar un manifiesto.'
        });
        return;
    }

    // Llamamos a la función pasándole la data guardada y la lista
    generarManifiestoEncomiendas(viajeSeleccionadoData, listEncomiendasRpt);
});

function generarManifiestoEncomiendas(datos, lista) {

    // CAMBIO CLAVE: orientation a "landscape" (Horizontal)
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.width; // Ahora será ~297mm
    const pageHeight = doc.internal.pageSize.height; // Ahora será ~210mm
    const fechaActual = new Date().toLocaleDateString("es-BO");
    const cantEncomiendas = `Total Paquetes: ${lista.length}`;

    // ==========================================
    // 1. ENCABEZADO DINÁMICO (SaaS Multi-Empresa)
    // ==========================================

    // Título Principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(22, 160, 133); // Color Teal Institucional
    doc.text("MANIFIESTO DE CARGA Y ENCOMIENDAS", pageWidth - 15, 15, { align: "right" });

    // Datos Legales
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(empresaGlobal.RazonSocial.toUpperCase(), pageWidth - 15, 21, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`NIT: ${empresaGlobal.NIT || 'S/N'}`, pageWidth - 15, 26, { align: "right" });
    doc.text(`Cel/Tel: ${empresaGlobal.Telefono || '---'}`, pageWidth - 15, 31, { align: "right" });

    // Línea divisoria
    doc.setDrawColor(22, 160, 133);
    doc.setLineWidth(0.5);
    doc.line(15, 34, pageWidth - 15, 34);

    // --- Bloque de Información del Viaje ---
    doc.setTextColor(0);
    doc.setFontSize(10);

    // Columna 1
    doc.setFont("helvetica", "bold");
    doc.text("RUTA COMERCIAL:", 15, 42);
    doc.setFont("helvetica", "normal");
    doc.text(datos.NombreRuta.toUpperCase(), 50, 42);

    doc.setFont("helvetica", "bold");
    doc.text("UNIDAD (BUS):", 15, 47);
    doc.setFont("helvetica", "normal");
    doc.text(`${datos.TipoBus.toUpperCase()} - PLACA: ${datos.PlacaBus.toUpperCase()}`, 50, 47);

    // Columna 2 (Movida un poco más a la derecha por ser landscape)
    doc.setFont("helvetica", "bold");
    doc.text("FECHA VIAJE:", 150, 42);
    doc.setFont("helvetica", "normal");
    doc.text(datos.FechaSalidaStr, 180, 42);

    doc.setFont("helvetica", "bold");
    doc.text("HORA SALIDA:", 150, 47);
    doc.setFont("helvetica", "normal");
    doc.text(datos.HoraSalidaStr + " Hrs.", 180, 47);

    doc.setFontSize(8.5);
    doc.setTextColor(100);
    doc.text(`Impreso: ${fechaActual} | Origen: Riberalta`, pageWidth - 15, 54, { align: "right" });

    // ==========================================
    // 2. TABLA DE ENCOMIENDAS (AutoTable Landscape)
    // ==========================================
    // Se agrega una columna vacía para que el cliente firme al recibir
    const headers = [["#", "REMITENTE", "DESTINATARIO", "DESTINO", "CONTENIDO Y PESO", "ESTADO Y MONTO", "FIRMA DE RECIBIDO"]];

    const dataReporte = lista.map((item, index) => {
        // Lógica de texto: Identificar si es un sobre o tiene peso
        let textoPeso = item.PesoKg > 0 ? `${item.PesoKg.toFixed(2)} Kg` : `SOBRE/DOC`;

        // Identificar si es por cobrar o pagado para resaltarlo en el reporte
        let textoPago = item.EstadoPago === 1
            ? `PAGADO: Bs. ${item.MontoCobrado.toFixed(2)}`
            : `POR COBRAR: Bs. ${item.MontoCobrado.toFixed(2)}`;

        return [
            (index + 1).toString().padStart(2, '0'),
            `${item.NombreRemitente.toUpperCase()}\nCI: ${item.CIRemitente}`,
            `${item.NombreDestinatario.toUpperCase()}\nCI: ${item.CIDestinatario}\nCel: ${item.CelularDestinatario || 'S/N'}`,
            item.CiudadDestino.toUpperCase(),
            `${item.Detalle.toUpperCase()}\n[ ${textoPeso} ]`,
            `${textoPago}\nComp: ${item.NroComprobante}`,
            "" // Espacio intencionalmente en blanco para firmar
        ];
    });

    doc.autoTable({
        startY: 57,
        head: headers,
        body: dataReporte,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, valign: 'middle' },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            halign: 'center',
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' }, // #
            1: { cellWidth: 45 }, // Remitente
            2: { cellWidth: 50 }, // Destinatario
            3: { cellWidth: 30, halign: 'center' }, // Destino
            4: { cellWidth: 50 }, // Contenido
            5: { cellWidth: 37, fontStyle: 'bold' }, // Estado
            6: { cellWidth: 45 }  // Firma (Espacio amplio para garabatear)
        },
        margin: { left: 15, right: 15 },
        didDrawPage: function (data) {
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

    // Cuadro de Resumen (Derecha)
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth - 80, finalY + 5, 65, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(cantEncomiendas, pageWidth - 20, finalY + 11.5, { align: "right" });

    // Estructura de Firma del Chofer / Bodeguero
    const firmaY = finalY + 35;
    doc.setDrawColor(150);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 35, firmaY, pageWidth / 2 + 35, firmaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("FIRMA RESPONSABLE DE BODEGA / CHOFER", pageWidth / 2, firmaY + 5, { align: "center" });
    doc.text(empresaGlobal.RazonSocial.toUpperCase(), pageWidth / 2, firmaY + 9, { align: "center" });

    // ==========================================
    // 4. INYECCIÓN DEL LOGO
    // ==========================================
    if (empresaGlobal.LogoUrl && empresaGlobal.LogoUrl.trim() !== "") {
        var img = new Image();
        img.src = empresaGlobal.LogoUrl;

        img.onload = function () {
            let formato = empresaGlobal.LogoUrl.toLowerCase().endsWith('.jpg') || empresaGlobal.LogoUrl.toLowerCase().endsWith('.jpeg') ? 'JPEG' : 'PNG';
            doc.setPage(1);
            try {
                doc.addImage(img, formato, 15, 10, 45, 18, undefined, 'FAST');
            } catch (e) {
                console.warn("Error al renderizar el logo:", e);
            }
            doc.save(`Manifiesto_Carga_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
        };

        img.onerror = function () {
            doc.save(`Manifiesto_Carga_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
        };
    } else {
        doc.save(`Manifiesto_Carga_${datos.NombreRuta}_${datos.FechaSalidaStr.replace(/\//g, "-")}.pdf`);
    }
}

// fin