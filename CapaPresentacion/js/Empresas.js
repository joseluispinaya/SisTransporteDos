

let tablaData;
let idEditar = 0;

function listaEmpresas() {
    //if ($.fn.DataTable.isDataTable("#tbRutas")) {
    //    $("#tbRutas").DataTable().destroy();
    //    $('#tbRutas tbody').empty();
    //}

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'EmpresasTrans.aspx/ListaEmpresas',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
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
            { "data": "IdEmpresa", "visible": false, "searchable": false },
            {
                "data": "RazonSocial",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-map-pin-filled align-text-top fs-14 text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "data": "NIT",
                render: function (data) {
                    return `<span class="badge p-1 bg-light text-dark fs-14 me-1"><i class="ti ti-id align-text-top fs-14 me-1"></i>${data}</span>`;
                }
            },
            { "data": "Direccion" },
            {
                "data": "Telefono",
                render: function (data) {
                    // Validar si tiene celular, si no, mostrar un guión o mensaje
                    let numero = data ? data : '<span class="text-muted fst-italic">Sin registro</span>';

                    if (data) {
                        return `
                            <div class="d-flex align-items-center gap-1">
                                <a href="tel:${data}" class="text-success text-decoration-none fw-medium">
                                    <i class="ti ti-device-mobile-message fs-16"></i> ${numero}
                                </a>
                            </div>`;
                    }
                    return numero;

                }
            },
            {
                "defaultContent": '<button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-2"><i class="ti ti-pencil-plus"></i></button>' +
                    '<button class="btn btn-soft-info btn-icon btn-sm rounded-circle btn-detalle"><i class="ti ti-eye"></i></button>',
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
    idEditar = data.IdEmpresa;

    $("#txtRazonSocial").val(data.RazonSocial);
    $("#txtNIT").val(data.NIT);
    $("#txtDireccion").val(data.Direccion);
    $("#txtTelefono").val(data.Telefono);

    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#imgUsureg").attr("src", data.FotoUrl || "Imagenes/sinImagen.png");
    $("#txtFoto").val("");

    $("#modalLabelTitulos").text("Editar Registro");
    $("#modalAdd").modal("show");
});

const TAMANO_MAXIMO = 2 * 1024 * 1024; // 4 MB en bytes

function mostrarImagenSeleccionada(input) {
    let file = input.files[0];
    let reader = new FileReader();

    // Si NO se seleccionó archivo (ej: presionaron "Cancelar")
    if (!file) {
        resetearVistaFoto(input);
        return;
    }

    // Validación: si no es imagen, mostramos error
    if (!esImagen(file)) {
        ToastMaster.fire({
            icon: 'error',
            title: 'El archivo seleccionado no es una imagen válida.'
        });
        resetearVistaFoto(input);
        return;
    }

    // 3. Validación: Tamaño máximo
    if (file.size > TAMANO_MAXIMO) {
        ToastMaster.fire({
            icon: 'error',
            title: 'La imagen supera el tamaño máximo permitido de 2 MB.'
        });
        resetearVistaFoto(input);
        return;
    }

    // Si todo es válido → mostrar vista previa
    reader.onload = (e) => $('#imgUsureg').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

// Función auxiliar para limpiar (DRY - Don't Repeat Yourself)
function resetearVistaFoto(input) {
    $('#imgUsureg').attr('src', "Imagenes/sinImagen.png");
    input.value = ""; // Limpia el input file
}

$('#txtFoto').change(function () {
    mostrarImagenSeleccionada(this);
});

$("#btnNuevoRegistro").on("click", function () {

    idEditar = 0;

    $("#txtRazonSocial").val("");
    $("#txtNIT").val("");
    $("#txtTelefono").val("");
    $("#txtDireccion").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $('#imgUsureg').attr('src', "Imagenes/sinImagen.png");
    $("#txtFoto").val("");

    // 4. Mostramos el modal
    $("#modalLabelTitulos").text("Nuevo Registro");
    $("#modalAdd").modal("show");
});

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    const inputs = $("#modalAdd input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        ToastMaster.fire({
            icon: 'warning',
            title: mensaje
        });
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdEmpresa: idEditar,
        RazonSocial: $("#txtRazonSocial").val().trim(),
        NIT: $("#txtNIT").val().trim(),
        Direccion: $("#txtDireccion").val().trim(),
        Telefono: $("#txtTelefono").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false),
        LogoUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
    };

    //let ver = objeto.IdRegional;

    // 3. PROCESAR EL INPUT FILE
    const fileInput = document.getElementById('txtFoto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Extraemos solo el texto Base64, quitando la cabecera (data:image/jpeg;base64,)
            const base64String = e.target.result.split(',')[1];

            // Disparamos el AJAX enviando la imagen
            enviarAjaxEmpresa(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxEmpresa(objeto, "");
    }
});

function enviarAjaxEmpresa(objeto, base64String) {
    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "EmpresasTrans.aspx/GuardarOrEditEmpresa",
        data: JSON.stringify({ objeto: objeto, base64Image: base64String }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");

            mostrarAlertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención', // Título dinámico
                response.d.Mensaje, // Texto del servidor
                response.d.Valor // Icono (success/error/warning) 
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
            habilitarBoton();
        }
    });
}

// fin