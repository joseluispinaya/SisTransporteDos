
// ==========================================
// VARIABLES GLOBALES
// ==========================================
let viajeSeleccionadoId = 0;
let tipoBusSeleccionadoId = 0;

$(document).ready(function () {
    cargarViajesParaEncomiendas();
    cargarBuscadoresClientes(); // Inicializa Remitente y Destinatario

    // Evento dinámico: Calcula el total cada vez que el usuario escribe el peso
    $("#txtPeso").on("input", calcularMontoTotal);
});

// ==========================================
// 1. CARGA DE VIAJES Y SELECCIÓN
// ==========================================
function cargarViajesParaEncomiendas() {
    $.ajax({
        url: "VentaPasajes.aspx/ListaViajesVentas", // Puedes usar el mismo WebMethod si trae lo necesario
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const lista = response.d.Data;
                let html = '';

                if (lista != null && lista.length > 0) {
                    $.each(lista, function (i, item) {
                        let badgeClass = item.Estado === 1 ? "bg-success-subtle text-success border-success-subtle" : "bg-warning-subtle text-warning border-warning-subtle";

                        // Ya no enviamos la "capacidad", pero sí el IdRuta y el IdTipoBus
                        html += `
                        <div class="list-group-item viaje-item p-3 shadow-sm mb-2 rounded border" onclick="seleccionarViaje(this, ${item.IdViaje}, ${item.IdRuta}, ${item.IdTipoBus}, '${item.NombreRuta}')">
                            <h6 class="mb-2 fw-bold text-dark">
                                <i class="ti ti-map-2 me-1 fs-15"></i>${item.NombreRuta}
                            </h6>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fs-13 text-muted fw-medium">
                                    <i class="ti ti-calendar-event me-1"></i>${item.FechaSalidaStr}
                                </span>
                                <span class="badge ${badgeClass} border px-2 py-1">
                                    <i class="ti ti-clock me-1"></i>${item.HoraSalidaStr}
                                </span>
                            </div>
                            <button class="btn btn-sm btn-soft-info border-info rounded-pill w-100 d-flex justify-content-center align-items-center mt-1">
                                <i class="ti ti-steering-wheel me-1 fs-15"></i> Bus ${item.TipoBus}
                            </button>
                        </div>
                        `;
                    });
                    $("#listaViajesDisponibles").html(html);
                } else {
                    $("#listaViajesDisponibles").html(`
                        <div class="p-4 text-center text-muted">
                            <i class="ti ti-bus-stop fs-4 mb-2 d-block"></i>
                            <p class="mb-0 fs-13">No hay salidas disponibles para hoy.</p>
                        </div>
                    `);
                }
            } else {
                console.error("Error backend:", response.d.Mensaje);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        }
    });
}

function seleccionarViaje(elemento, idViaje, idRuta, idTipoBus, nombreTitulo) {
    // Sombrear el item seleccionado
    $('.viaje-item').removeClass('active');
    $(elemento).addClass('active');

    // Guardar variables globales
    viajeSeleccionadoId = idViaje;
    tipoBusSeleccionadoId = idTipoBus;

    // Limpiar el formulario para la nueva encomienda
    $("#cboRemitente").val(null).trigger("change");
    $("#cboDestinatario").val(null).trigger("change");
    $("#txtDetalle").val("");
    $("#txtPeso").val("");
    $("#lblPrecioKilo").text("0.00");
    $("#txtPrecioTotal").val("0.00");
    $("#pagoPagado").prop("checked", true); // Por defecto pagado

    // Actualizar Título
    $("#lblRuta").html(`<i class="ti ti-package me-2"></i>Registrando carga para: <span class="text-dark">${nombreTitulo}</span>`);

    // 1. Forzamos a ocultar el panel de espera agregando la clase d-none
    $("#panelEsperando").addClass("d-none").removeClass("d-flex");

    // 2. Mostramos el formulario quitando d-none
    $("#panelEncomienda").removeClass("d-none");

    // Cargar destinos de esa ruta
    cargarCiudadeDestino(idRuta);
}

// ==========================================
// 2. CONFIGURACIÓN DE SELECT2 (CLIENTES)
// ==========================================
function cargarBuscadoresClientes() {
    // Objeto de configuración general para no repetir código
    let configSelect2 = {
        ajax: {
            type: "POST",
            url: "Clientes.aspx/FiltroClientes",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return JSON.stringify({ busqueda: params.term || "" });
            },
            processResults: function (data) {
                if (!data.d.Estado) {
                    mostrarAlertaZero("Atención", data.d.Mensaje, "warning");
                    return { results: [] };
                }
                return {
                    results: data.d.Data.map((item) => ({
                        id: item.IdCliente,
                        text: item.Nombres + ' ' + item.Apellidos,
                        nroci: item.NroCi,
                        celu: item.Celular,
                        dataCompleta: item
                    }))
                };
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status === 0 || thrownError === 'abort') return;
                mostrarAlertaZero("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
        },
        language: "es",
        minimumInputLength: 3,
        templateResult: formatoResultadosCliente
    };

    // Inicializar AMBOS selects con la misma configuración
    $("#cboRemitente").select2(Object.assign({}, configSelect2, { placeholder: 'Buscar Remitente...' }));
    $("#cboDestinatario").select2(Object.assign({}, configSelect2, { placeholder: 'Buscar Destinatario...' }));
}

function formatoResultadosCliente(data) {
    if (data.loading) return data.text;
    var imagenMostrar = '../Imagenes/perfil.png';
    return $(`
        <div class="d-flex align-items-center">
            <img src="${imagenMostrar}" class="rounded-circle shadow-sm" style="height:40px; width:40px; margin-right:10px; object-fit:cover;"/>
            <div>
                <div class="fw-bold text-success fs-14">${data.text}</div>
                <div class="fs-12 text-muted"><i class="ti ti-id me-1"></i>CI: ${data.nroci} | <i class="ti ti-phone me-1"></i>${data.celu}</div>
            </div>
         </div>
    `);
}

// ==========================================
// 3. DESTINOS Y CÁLCULO DE PRECIOS
// ==========================================
function cargarCiudadeDestino(idRuta) {
    $("#cboDestino").html('<option value="">Cargando destinos...</option>');
    $.ajax({
        url: "TerminalParada.aspx/ListaRutasParadasRP",
        type: "POST",
        data: JSON.stringify({ IdRuta: parseInt(idRuta) }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value="">Seleccione Destino...</option>';
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCiudad}">${row.NombreCiudad}</option>`;
                });
                $("#cboDestino").html(opcionesHTML);
            } else {
                $("#cboDestino").html('<option value="">Error al cargar</option>');
            }
        }
    });
}

$("#cboDestino").on("change", function () {
    let idDestino = $(this).val();

    if (!idDestino) {
        $("#lblPrecioKilo").text("0.00");
        calcularMontoTotal();
        return;
    }

    $("#lblPrecioKilo").text("...");

    const request = {
        IdDestino: parseInt(idDestino),
        IdTipoBus: parseInt(tipoBusSeleccionadoId)
    };

    $.ajax({
        url: "VentaPasajes.aspx/ConsultarTarifario", // Usamos la misma función de tarifarios
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado && response.d.Data != null) {
                // ATENCIÓN: Aquí sacamos PrecioKiloEncomienda, NO PrecioPasaje
                let precioKilo = response.d.Data.PrecioKiloEncomienda;
                $("#lblPrecioKilo").text(precioKilo.toFixed(2));
                calcularMontoTotal();
            } else {
                $("#lblPrecioKilo").text("0.00");
                calcularMontoTotal();

                if (response.d.Valor === "MISMO_DESTINO") {
                    $("#cboDestino").val("");
                    mostrarAlertaZero("¡Destino Inválido!", response.d.Mensaje, "warning");
                } else if (response.d.Valor === "SIN_SESION") {
                    mostrarAlertaTimer("¡Sesión Expirada!", response.d.Mensaje, "error", 2000);
                    setTimeout(() => window.location.href = "Login.aspx", 2200);
                } else {
                    ToastMaster.fire({ icon: 'warning', title: 'Tarifa de carga no configurada.' });
                }
            }
        }
    });
});

// FUNCIÓN DE CALCULADORA EN TIEMPO REAL
function calcularMontoTotal() {
    // Reemplazamos coma por punto por si usan el teclado numérico latino
    let pesoStr = $("#txtPeso").val().trim().replace(',', '.');
    let peso = parseFloat(pesoStr) || 0;

    let precioKiloStr = $("#lblPrecioKilo").text().trim().replace(',', '.');
    let precioKilo = parseFloat(precioKiloStr) || 0;

    let totalCalculado = peso * precioKilo;

    // Mostramos el total
    $("#txtPrecioTotal").val(totalCalculado.toFixed(2));
}

$("#btnRegistrarEncomienda").on("click", function () {

    // 1. Validación de Flujo: ¿Se seleccionó un viaje?
    if (viajeSeleccionadoId === 0) {
        ToastMaster.fire({ icon: 'warning', title: 'Debe seleccionar una salida del panel izquierdo.' });
        return;
    }

    // 2. Recolección de Datos del Formulario
    let idRemitente = $("#cboRemitente").val();
    let idDestinatario = $("#cboDestinatario").val();
    let idDestino = $("#cboDestino").val();
    let detalleCarga = $("#txtDetalle").val().trim();
    let estadoPago = $('input[name="radioEstadoPago"]:checked').val(); // 1 o 2

    // Parseo seguro de números (por si el usuario usa comas en vez de puntos)
    let pesoStr = $("#txtPeso").val().trim().replace(',', '.');
    let montoStr = $("#txtPrecioTotal").val().trim().replace(',', '.');

    let pesoKg = parseFloat(pesoStr);
    let montoCobrado = parseFloat(montoStr);

    // 3. Validaciones de Reglas de Negocio
    if (!idRemitente) {
        ToastMaster.fire({ icon: 'warning', title: 'Debe buscar y seleccionar un Remitente.' });
        $("#cboRemitente").select2('open');
        return;
    }

    if (!idDestinatario) {
        ToastMaster.fire({ icon: 'warning', title: 'Debe buscar y seleccionar un Destinatario.' });
        $("#cboDestinatario").select2('open');
        return;
    }

    if (idRemitente === idDestinatario) {
        ToastMaster.fire({ icon: 'warning', title: 'El remitente y destinatario no pueden ser la misma persona.' });
        return;
    }

    if (!idDestino) {
        ToastMaster.fire({ icon: 'warning', title: 'Debe seleccionar la ciudad de destino.' });
        $("#cboDestino").focus();
        return;
    }

    if (detalleCarga === "") {
        ToastMaster.fire({ icon: 'warning', title: 'Debe ingresar el detalle o contenido del paquete.' });
        $("#txtDetalle").focus();
        return;
    }

    if (isNaN(pesoKg) || pesoKg <= 0) {
        ToastMaster.fire({ icon: 'warning', title: 'Ingrese un peso válido mayor a 0 Kg.' });
        $("#txtPeso").focus();
        return;
    }

    if (isNaN(montoCobrado) || montoCobrado < 0) {
        ToastMaster.fire({ icon: 'error', title: 'Error en el cálculo del monto. Verifique el peso y el destino.' });
        return;
    }

    // 4. SweetAlert de Confirmación (Previene registros por clic accidental)
    let textoPago = estadoPago === "1" ? "PAGADO" : "POR COBRAR";

    Swal.fire({
        title: '¿Confirmar Encomienda?',
        html: `Se registrará el envío con un total de <b>Bs. ${montoCobrado.toFixed(2)}</b>.<br>Estado: <b class="${estadoPago === '1' ? 'text-success' : 'text-warning'}">${textoPago}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="ti ti-check me-1"></i> Sí, Registrar',
        cancelButtonText: '<i class="ti ti-x me-1"></i> Cancelar',
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-primary me-2 mt-2",
            cancelButton: "btn btn-soft-secondary mt-2"
        }
    }).then((result) => {
        if (result.isConfirmed) {

            // Bloqueamos el botón y mostramos el spinner
            let $btn = $("#btnRegistrarEncomienda");
            let textoOriginal = $btn.html();
            $btn.prop("disabled", true).html('<i class="spinner-border spinner-border-sm me-2 align-middle"></i>Procesando...');

            // Construimos el DTO para C#
            const request = {
                objeto: {
                    IdViaje: viajeSeleccionadoId,
                    IdRemitente: parseInt(idRemitente),
                    IdDestinatario: parseInt(idDestinatario),
                    IdDestino: parseInt(idDestino),
                    Detalle: detalleCarga,
                    PesoKg: pesoKg,
                    MontoCobrado: montoCobrado,
                    EstadoPago: parseInt(estadoPago)
                }
            };

            // 5. Petición AJAX al WebMethod
            $.ajax({
                url: "RecepcionesEnco.aspx/RegistroRecepEncomienda",
                type: "POST",
                data: JSON.stringify(request),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    // Restauramos el botón
                    $btn.prop("disabled", false).html(textoOriginal);

                    if (response.d.Estado) {
                        let idNuevaEncomienda = response.d.Data; // El ID devuelto por SCOPE_IDENTITY()

                        ToastMaster.fire({ icon: 'success', title: 'Encomienda registrada con éxito.' });

                        // Limpiamos los campos para recibir el siguiente paquete rápidamente
                        $("#cboRemitente").val(null).trigger("change");
                        $("#cboDestinatario").val(null).trigger("change");
                        $("#txtDetalle").val("");
                        $("#txtPeso").val("");
                        $("#txtPrecioTotal").val("0.00");

                        // Opcional: enfocar de nuevo al remitente por si el cliente tiene otro paquete
                        $("#cboRemitente").select2('open');

                        // 6. IMPRIMIR TICKET DE ENCOMIENDA
                        imprimirTicketEncomienda(idNuevaEncomienda); 

                    } else {
                        mostrarAlertaZero("¡Atención!", response.d.Mensaje, "warning");
                    }
                },
                error: function (xhr) {
                    $btn.prop("disabled", false).html(textoOriginal);
                    mostrarAlertaZero("¡Error!", "Problema de comunicación con el servidor.", "error");
                }
            });
        }
    });
});

function imprimirTicketEncomienda(idNuevaEncomienda) {
    const request = {
        IdEncomienda: parseInt(idNuevaEncomienda)
    };

    $.ajax({
        url: "RecepcionesEnco.aspx/ObtenerDetalleEncomiendaImpresion",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const d = response.d.Data; // Alias corto para legibilidad del mapeo

                // ========================================================
                // 1. CONTROL DE CABECERA EXCLUSIVA DESDE VARIABLE GLOBAL
                // ========================================================
                $("#tck_EmpresaNombre").text(empresaGlobal.RazonSocial.toUpperCase());

                let nitTexto = empresaGlobal.NIT ? `NIT: ${empresaGlobal.NIT}` : "NIT: S/N";
                let telTexto = empresaGlobal.Telefono ? ` | Tel: ${empresaGlobal.Telefono}` : "";
                $("#tck_EmpresaDetalle").text(nitTexto + telTexto);
                $("#tck_EmpresaDireccion").text(empresaGlobal.Direccion || "Dirección no registrada");

                // Renderizado dinámico del Logo Corporativo
                if (empresaGlobal.LogoUrl && empresaGlobal.LogoUrl.trim() !== "") {
                    $("#tck_EmpresaLogo").attr("src", empresaGlobal.LogoUrl);
                    $("#tck_ContenedorLogo").show();
                } else {
                    $("#tck_ContenedorLogo").hide();
                }

                // ========================================================
                // 2. INYECCIÓN DE DATOS DE BASE DE DATOS (PROCEDIMIENTO)
                // ========================================================
                $("#tck_Tipo").text(d.TipoTransaccion); // "GUÍA DE ENCOMIENDA - PAGADO" o "POR COBRAR"
                $("#tck_Comprobante").text(d.NroComprobante);

                $("#tck_Fecha").text(d.FechaSalidaStr);
                $("#tck_Hora").text(d.HoraSalidaStr);
                $("#tck_Bus").text(d.TipoBus + ' | ' + d.PlacaBus);

                $("#tck_Origen").text(d.CiudadOrigen.toUpperCase());
                $("#tck_Destino").text(d.CiudadDestino.toUpperCase());

                // Mapeo del Remitente
                $("#tck_Remitente").text(d.NombreRemitente.toUpperCase());
                $("#tck_CIRemitente").text(d.CIRemitente);

                // Mapeo del Destinatario (Datos críticos de localización)
                $("#tck_Destinatario").text(d.NombreDestinatario.toUpperCase());
                $("#tck_CIDestinatario").text(d.CIDestinatario);
                $("#tck_CelDestinatario").text(d.CelularDestinatario || "S/N");

                // Datos físicos y financieros de la Carga
                $("#tck_Detalle").text(d.Detalle.toUpperCase());
                $("#tck_Peso").text(d.PesoKg.toFixed(2));
                $("#tck_Precio").text(d.MontoCobrado.toFixed(2));

                // Retardo óptimo de 250ms para renderizado gráfico del Logo
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