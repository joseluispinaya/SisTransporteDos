
let tablaData;
let idEditar = 0;

$(document).ready(function () {

    cargarRoles();
    cargarTodasLasEmpresas();
});

function cargarRoles() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboRol").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "UsuariosEmpresa.aspx/ListaRoles",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRol}">${row.NombreRol}</option>`;
                });

                $("#cboRol").html(opcionesHTML);

            } else {
                $("#cboRol").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboRol").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasLasEmpresas() {
    // 1. Agrupamos TODOS los IDs de los selects que necesitan Departamentos separados por coma
    let combosEmpresa = $("#cboFiltroEmpresa, #cboEmpresa");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosEmpresa.html('<option value="">Cargando Empresas...</option>');

    $.ajax({
        url: "EmpresasTrans.aspx/ListaEmpresas",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdEmpresa}">${row.RazonSocial}</option>`;
                });

                combosEmpresa.html(opcionesHTML);

            } else {
                combosEmpresa.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosEmpresa.html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboFiltroEmpresa").on("change", function () {

    if ($.fn.DataTable.isDataTable("#tbData")) {
        tablaData.ajax.reload();
    } else {
        listaUsuariosEmpresa();
    }

});

// NO recibe parámetro
function listaUsuariosEmpresa() {

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'UsuariosEmpresa.aspx/ObtenerUsuariosEmpresa',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let idEmpresaSeleccionada = $("#cboFiltroEmpresa").val();

                let request = {
                    IdEmpresa: parseInt(idEmpresaSeleccionada) || 0
                };
                return JSON.stringify(request);
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
            // 1. COLUMNA: FOTO + NOMBRES + CORREO/CELULAR
            {
                "data": null,
                render: function (data, type, row) {
                    let fotoUrl = row.FotoUrl ? row.FotoUrl : "Imagenes/sinImagen.png";
                    let nombreCompleto = row.Nombres + " " + row.Apellidos;

                    return `
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0 me-3">
                                <img src="${fotoUrl}" alt="Avatar" class="rounded-circle border border-2 border-white shadow-sm" style="width: 45px; height: 45px; object-fit: cover;">
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-bold text-dark fs-15 mb-1">${nombreCompleto}</span>
                                <div class="d-flex align-items-center gap-3">
                                    <span class="text-muted fs-13"><i class="ti ti-mail text-secondary me-1"></i>${row.Correo}</span>
                                    <span class="text-muted fs-13"><i class="ti ti-phone text-secondary me-1"></i>${row.Celular}</span>
                                </div>
                            </div>
                        </div>`;
                }
            },

            // 2. COLUMNA: DOCUMENTO CI
            {
                "data": "NroCi",
                render: function (data) {
                    return `<span class="badge border border-secondary text-secondary fs-13 px-2 py-1">
                                <i class="ti ti-id me-1"></i>${data}
                            </span>`;
                }
            },

            // 3. COLUMNA: EMPRESA Y ROL
            {
                "data": null,
                render: function (data, type, row) {
                    return `
                        <div class="d-flex flex-column gap-1 align-items-start">
                            <span class="badge bg-info-subtle text-info fs-12 px-2 py-1">
                                <i class="ti ti-building me-1"></i>${row.NombreEmpresa}
                            </span>
                            <span class="badge bg-info-subtle text-info fs-12 px-2 py-1">
                                <i class="ti ti-user-shield me-1"></i>${row.NombreRol}
                            </span>
                        </div>`;
                }
            },

            // 4. COLUMNA: ESTADO
            {
                "data": "Estado",
                "className": "text-center",
                render: function (data) {
                    if (data) {
                        return `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-12">
                                    <i class="ti ti-user-check me-1"></i>Activo
                                </span>`;
                    } else {
                        return `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-12">
                                    <i class="ti ti-user-x me-1"></i>Bloqueado
                                </span>`;
                    }
                }
            },

            // 5. COLUMNA: OPCIONES
            {
                "defaultContent": `
                    <button class="btn btn-soft-primary btn-icon btn-sm rounded-circle btn-editar me-1" title="Editar Usuario">
                        <i class="ti ti-pencil fs-16"></i>
                    </button>`,
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
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
    idEditar = data.IdUsuario;

    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtCorreo").val(data.Correo);
    $("#txtCelular").val(data.Celular);
    $("#txtNroCi").val(data.NroCi);

    $("#cboEmpresa").val(data.IdEmpresa);
    $("#cboRol").val(data.IdRol);

    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#imgFoto").attr("src", data.FotoUrl || "Imagenes/sinImagen.png");
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
    reader.onload = (e) => $('#imgFoto').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function resetearVistaFoto(input) {
    $('#imgFoto').attr('src', "Imagenes/sinImagen.png");
    input.value = ""; // Limpia el input file
}

$('#txtFoto').change(function () {
    mostrarImagenSeleccionada(this);
});

$("#btnNuevoRegistro").on("click", function () {

    idEditar = 0;

    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCorreo").val("");
    $("#txtCelular").val("");
    $("#txtNroCi").val("");

    $("#cboRol").val("");
    $("#cboEmpresa").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $('#imgFoto').attr('src', "Imagenes/sinImagen.png");
    $("#txtFoto").val("");

    $("#modalLabelTitulos").text("Nuevo Registro");

    $("#modalAdd").modal("show");

})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    let idEmpresa = $("#cboEmpresa").val();
    let idRol = $("#cboRol").val();

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

    if (idEmpresa === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar una Empresa.'
        });
        $("#cboEmpresa").focus();
        habilitarBoton();
        return;
    }

    if (idRol === "") {
        ToastMaster.fire({
            icon: 'warning',
            title: 'Debe seleccionar un Rol.'
        });
        $("#cboRol").focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdUsuario: idEditar,
        IdEmpresa: parseInt(idEmpresa),
        IdRol: parseInt(idRol),
        NroCi: $("#txtNroCi").val().trim(),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        Celular: $("#txtCelular").val().trim(),
        Correo: $("#txtCorreo").val().trim(),
        Estado: ($("#cboEstado").val() === "1" ? true : false),
        FotoUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
    };

    const fileInput = document.getElementById('txtFoto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Extraemos solo el texto Base64, quitando la cabecera (data:image/jpeg;base64,)
            const base64String = e.target.result.split(',')[1];

            // Disparamos el AJAX enviando la imagen
            enviarAjaxUsuario(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxUsuario(objeto, "");
    }
});

function enviarAjaxUsuario(objeto, base64String) {
    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "UsuariosEmpresa.aspx/GuardarOrEditUsuarios",
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

                $("#cboFiltroEmpresa").val(objeto.IdEmpresa);
                $("#cboFiltroEmpresa").trigger("change");

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