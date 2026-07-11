
// VARIABLES GLOBALES

let viajeSeleccionadoId = 0; // Variable global indispensable para el botón Guardar posterior
let tipoBusSeleccionadoId = 0;
let capacidadBusSeleccionado = 0;

$(document).ready(function () {
    cargarViajesParaVenta();
    cargarBuscadorClientes();
});

function cargarViajesParaVenta() {
    $.ajax({
        url: "VentaPasajes.aspx/ListaViajesVentas",
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
                        // Color del reloj: Verde si está Programado, Amarillo si ya está En Ruta
                        let badgeClass = item.Estado === 1 ? "bg-success-subtle text-success border-success-subtle" : "bg-warning-subtle text-warning border-warning-subtle";

                        // Pasamos el IdViaje Y la CapacidadAsientos en el onclick
                        html += `
                        <div class="list-group-item viaje-item p-3" onclick="seleccionarViaje(this, ${item.IdViaje}, ${item.CapacidadAsientos}, ${item.IdRuta}, ${item.IdTipoBus}, '${item.NombreRuta}')">
                            <h6 class="mb-2 fw-bold text-dark">
                                <i class="ti ti-map-2 text-primary me-1 fs-15"></i>${item.NombreRuta}
                            </h6>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fs-13 text-muted fw-medium">
                                    <i class="ti ti-calendar-event me-1"></i>${item.FechaSalidaStr}
                                </span>
                                <span class="badge ${badgeClass} border px-2 py-1">
                                    <i class="ti ti-clock me-1"></i>${item.HoraSalidaStr}
                                </span>
                            </div>
                            
                            <!-- 3. Botón del Tipo de Bus (Abajo, ocupando el 100% del ancho para evitar quiebres) -->
                            <button class="btn btn-sm btn-soft-info border-info rounded-pill w-100 d-flex justify-content-center align-items-center mt-1">
                                <i class="ti ti-steering-wheel me-1 fs-15"></i> Bus ${item.TipoBus}
                            </button>

                        </div>
                        `;
                    });
                    $("#listaViajesDisponibles").html(html);
                } else {
                    // Si no hay viajes disponibles
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

function seleccionarViaje(elemento, idViaje, asientos, idRuta, idTipoBus, nombreTitulo) {
    $('.viaje-item').removeClass('active');
    $(elemento).addClass('active');

    viajeSeleccionadoId = idViaje;
    tipoBusSeleccionadoId = idTipoBus; // Guardamos el tipo de bus
    capacidadBusSeleccionado = asientos; // ¡Guardamos la capacidad real!

    // Por seguridad, cada que cambiamos de viaje, reseteamos y bloqueamos el precio
    $("#txtPrecio").val("0.00").prop("readonly", true).removeClass("bg-warning-subtle");

    // ¡TU CÓDIGO NUEVO AQUÍ! Mostramos el título
    $("#lblRuta").text("Pasaje para: " + nombreTitulo);

    $("#panelVenta").hide();

    // Mostramos un spinner mientras consultamos la BD
    $("#contenedorBus").html('<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted fs-13">Cargando distribución de asientos...</p></div>').show();

    // Llamamos a la base de datos
    obtenerAsientosVendidos(idViaje, asientos);

    // 2. ¡Llamamos a tu función para cargar los destinos!
    cargarCiudadeDestino(idRuta);
}

function obtenerAsientosVendidos(idViaje, totalAsientos) {
    const request = { IdViaje: parseInt(idViaje) };

    $.ajax({
        url: "VentaPasajes.aspx/ObtenerAsientosVendidos",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Dibujamos todo el esqueleto del bus vacío (tu función original)
                mostrarDiseno(totalAsientos);

                // 2. Pintamos de colores los asientos que ya están ocupados
                const ocupados = response.d.Data;

                if (ocupados && ocupados.length > 0) {
                    $.each(ocupados, function (i, asiento) {

                        // Buscamos el DIV del asiento específico usando su atributo data-nro
                        let $divAsiento = $(`.seat[data-nro='${asiento.NroAsiento}']`);

                        if (asiento.Estado === 1) { // 1 = Reservado
                            $divAsiento.addClass("asiento-reservado").removeClass("text-primary border-primary");
                            $divAsiento.attr("title", `Asiento ${asiento.NroAsiento} - Reservado por: ${asiento.NombrePasajero}`);

                        } else if (asiento.Estado === 2) { // 2 = Vendido
                            $divAsiento.addClass("asiento-vendido").removeClass("text-primary border-primary");
                            $divAsiento.attr("title", `Asiento ${asiento.NroAsiento} - Vendido a: ${asiento.NombrePasajero}`);
                        }
                    });
                }
            } else {
                mostrarAlertaZero("¡Error!", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            mostrarAlertaZero("¡Atención!", "Error de comunicación con el servidor.", "error");
        }
    });
}

$(document).on("click", ".seat", function () {

    // ¡SEGURIDAD! Si el asiento está reservado o vendido, bloqueamos el clic
    if ($(this).hasClass("asiento-vendido") || $(this).hasClass("asiento-reservado")) {
        ToastMaster.fire({ icon: 'warning', title: 'Este asiento ya se encuentra ocupado.' });
        return;
    }

    // 1. Limpiamos selecciones previas 
    $(".seat").removeClass("selected");

    // 2. Marcamos el asiento actual como seleccionado
    $(this).addClass("selected");

    // 3. Extraemos el número del asiento
    let numeroAsiento = $(this).data("nro");

    // 4. PASAMOS EL DATO AL FORMULARIO
    $("#txtNroAsiento").val(numeroAsiento); // Input oculto para armar la data de guardado
    $("#lblNumeroAsientoVisual").text(numeroAsiento < 10 ? '0' + numeroAsiento : numeroAsiento); // Vista en grande para el usuario

    // 5. MOSTRAMOS EL PANEL DE VENTA CON ANIMACIÓN
    $("#panelVenta").fadeIn(300);

    // 6. Scroll suave automático
    setTimeout(() => {
        $("#panelVenta")[0].scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
});

function mostrarDiseno(cantidadAsi) {
    const contenedor = $("#contenedorBus");
    contenedor.empty();

    const numAsientos = parseInt(cantidadAsi);

    // 1. Iniciamos el HTML con el contorno del bus y el volante a la IZQUIERDA
    let htmlBus = `
        <div class="bus-wrapper">
            <div class="bus-container">
                <div class="driver-area">
                    <i class="ti ti-steering-wheel steering-wheel" title="Volante del Chofer"></i>
                    
                    <span class="text-muted fw-semibold d-flex align-items-center" style="font-size: 0.7rem; writing-mode: vertical-rl; transform: rotate(180deg);">
                        <i class="ti ti-door-enter fs-5 mb-1"></i> Puerta
                    </span>
                </div>
                <div class="seats-area">
    `;

    let asientoActual = 1;
    const totalFilas = Math.ceil(numAsientos / 4);

    // 2. Iteramos para crear las columnas (que representan las filas de la flota)
    for (let fila = 1; fila <= totalFilas; fila++) {
        htmlBus += `<div class="seat-column">`;

        // Bloque Superior (Lado de la ventana y pasillo izquierdo)
        htmlBus += `<div class="d-flex flex-column gap-1">`;
        if (asientoActual <= numAsientos) htmlBus += generarAsientoHTML(asientoActual++);
        if (asientoActual <= numAsientos) htmlBus += generarAsientoHTML(asientoActual++);
        htmlBus += `</div>`;

        // Pasillo Central (Espacio vacío)
        htmlBus += `<div class="seat-aisle"></div>`;

        // Bloque Inferior (Pasillo derecho y ventana)
        htmlBus += `<div class="d-flex flex-column gap-1">`;
        if (asientoActual <= numAsientos) htmlBus += generarAsientoHTML(asientoActual++);
        if (asientoActual <= numAsientos) htmlBus += generarAsientoHTML(asientoActual++);
        htmlBus += `</div>`;

        htmlBus += `</div>`; // Cierra la seat-column
    }

    // 3. Cerramos el bus
    htmlBus += `
                </div>
            </div>
        </div>
    `;

    // 4. Inyectamos y mostramos
    contenedor.html(htmlBus).hide().fadeIn(300);
}

function generarAsientoHTML(nro) {
    let nroFormateado = nro < 10 ? '0' + nro : nro;
    return `
        <div class="seat shadow-sm" data-nro="${nro}" title="Asiento Nro ${nro}">
            ${nroFormateado}
        </div>
    `;
}

// Configuración del Select2 para clientes
function cargarBuscadorClientes() {
    $("#cboBuscarPasajero").select2({

        ajax: {
            type: "POST",
            url: "Clientes.aspx/FiltroClientes",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                // params.term es lo que el usuario va escribiendo
                return JSON.stringify({ busqueda: params.term || "" });
            },
            processResults: function (data) {
                // 1. VALIDACIÓN: ¿Respondió bien el WebMethod? (Estado == true)
                if (!data.d.Estado) {
                    // Mostramos el mensaje que mandó C# (Ej: "Su sesión ha expirado" o error del Catch)
                    mostrarAlertaZero("Atención", data.d.Mensaje, "warning");

                    // Retornamos un array vacío para que Select2 no colapse
                    return { results: [] };
                }

                // 2. Si todo está bien, mapeamos los datos
                return {
                    results: data.d.Data.map((item) => ({
                        id: item.IdCliente,
                        text: item.Nombres + ' - ' + item.Apellidos,
                        nroci: item.NroCi,
                        celu: item.Celular,
                        dataCompleta: item // Guardamos todo el objeto por si lo ocupas al seleccionar
                    }))
                };
            },
            // 3. VALIDACIÓN DE RED: Por si se corta el internet o falla el servidor
            error: function (xhr, ajaxOptions, thrownError) {
                // IGNORAR SI EL ERROR ES PORQUE SELECT2 CANCELÓ LA PETICIÓN VIEJA
                if (xhr.status === 0 || thrownError === 'abort') {
                    return; // Salimos silenciosamente sin mostrar alerta
                }

                // Si es un error real (500, 404, etc.), sí mostramos la alerta
                console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
                mostrarAlertaZero("Error de Conexión", "No se pudo comunicar con el servidor.", "error");
            }
        },
        language: "es",
        placeholder: 'Buscar por Nombre o CI...',
        minimumInputLength: 3,
        templateResult: formatoResultados
    });
}

function formatoResultados(data) {
    if (data.loading) return data.text;

    // logo a mostrar
    var imagenMostrar = '../Imagenes/perfil.png';

    var contenedor = $(
        `<div class="d-flex align-items-center">
            <img src="${imagenMostrar}" style="height:40px; width:40px; margin-right:10px; border-radius:50%; object-fit:cover;"/>
            <div>
                <div style="font-weight: bold;">${data.text}</div>
                <div style="font-size: 0.85em; color: #666;">CI: ${data.nroci} | Cel: ${data.celu}</div>
            </div>
         </div>`
    );

    return contenedor;
}

// Evento al SELECCIONAR cliente pasajero
$("#cboBuscarPasajero").on("select2:select", function (e) {
    const data = e.params.data.dataCompleta;
    $("#txtIdCliente").val(data.IdCliente);
    $("#txtNroCi").val(data.NroCi);
    $("#txtNomPasa").val(data.Nombres + " " + data.Apellidos);

    $("#cboBuscarPasajero").val(null).trigger("change");
});

// registra cliente si no esta registrado mediante un modal
$("#btnAddClient").on("click", function () {

});

// lista de ciudades segun la ruta
function cargarCiudadeDestino(idRuta) {

    $("#cboDestino").html('<option value="">Cargando destinos...</option>');
    var request = {
        IdRuta: parseInt(idRuta)
    };

    $.ajax({
        url: "TerminalParada.aspx/ListaRutasParadasRP",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Destino</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCiudad}">${row.NombreCiudad}</option>`;
                });

                $("#cboDestino").html(opcionesHTML);

            } else {
                $("#cboDestino").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboDestino").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboDestino").on("change", function () {

    let idDestino = $(this).val();

    // Si vuelve a la opción por defecto ("-- Seleccione --"), reseteamos a 0.00
    if (!idDestino) {
        $("#txtPrecio").val("0.00").prop("readonly", true).removeClass("bg-warning-subtle");
        return;
    }

    // Le mostramos un estado de "Buscando..."
    $("#txtPrecio").val("...").prop("readonly", true);

    const request = {
        IdDestino: parseInt(idDestino),
        IdTipoBus: parseInt(tipoBusSeleccionadoId)
    };

    $.ajax({
        url: "VentaPasajes.aspx/ConsultarTarifario",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        // ... código anterior del AJAX ...
        success: function (response) {
            if (response.d.Estado && response.d.Data != null) {

                // EXITO: Encontró el precio.
                let precioBoleto = response.d.Data.PrecioPasaje;
                $("#txtPrecio").val(precioBoleto.toFixed(2)).prop("readonly", true).removeClass("bg-warning-subtle");

            } else {
                // ==========================================
                // MANEJO DE ERRORES INTELIGENTE USANDO 'Valor'
                // ==========================================

                if (response.d.Valor === "MISMO_DESTINO") {

                    // REGLA: Reseteamos el precio y el combo, mostramos alerta fuerte
                    $("#txtPrecio").val("0.00").prop("readonly", true).removeClass("bg-warning-subtle");
                    $("#cboDestino").val("");
                    mostrarAlertaZero("¡Destino Inválido!", response.d.Mensaje, "warning");

                } else if (response.d.Valor === "SIN_SESION") { // <--- ¡AQUÍ ESTÁ TU NUEVA VALIDACIÓN!

                    // REGLA: Sesión expirada. Bloqueamos todo, mostramos alerta de error y lo mandamos al Login.
                    $("#txtPrecio").val("0.00").prop("readonly", true);
                    mostrarAlertaTimer("¡Sesión Expirada!", response.d.Mensaje, "error", 2000);

                    // Redirigir al login después de 2 segundos
                    setTimeout(function () {
                        //window.location.replace('Login.aspx');
                        window.location.href = "Login.aspx";
                    }, 2200);

                } else {

                    // FALLBACK NORMAL: Tarifa no configurada en la BD (dejamos ingresar manual)
                    $("#txtPrecio").val("").prop("readonly", false).addClass("bg-warning-subtle").focus();

                    ToastMaster.fire({
                        icon: 'warning',
                        title: 'Por favor ingrese el precio manualmente.'
                    });
                }
            }
        },
        error: function (xhr) {
            $("#txtPrecio").val("").prop("readonly", false).addClass("bg-warning-subtle").focus();
            mostrarAlertaZero("¡Error!", "Problema de conexión. Ingrese el precio manualmente.", "error");
        }
    });
});

// fin