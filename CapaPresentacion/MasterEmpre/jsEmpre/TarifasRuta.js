
let tablaData;
let idEditar = 0;

$("#btnNuevoRegistro").on("click", function () {

    idEditar = 0;

    //$("#cboCiudadOrigen").val("");
    //$("#cboCiudadDestino").val("");
    //$("#cboTipobus").val("");
    //$("#txtPrePasaje").val("");
    //$("#txtPreKilo").val("");

    $("#cboEstado").val(1).prop("disabled", true);

    // 4. Mostramos el modal
    $("#modalLabeltarifa").text("Nuevo Registro");
    $("#modalTarifa").modal("show");
});

// fin