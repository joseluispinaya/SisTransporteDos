
const ToastLogin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// Mostrar/Ocultar contraseña
$("#btnVerClave").on("click", function () {
    let inputClave = $("#txtClave");
    let icono = $(this).find("i");

    if (inputClave.attr("type") === "password") {
        inputClave.attr("type", "text");
        icono.removeClass("ti-eye").addClass("ti-eye-off");
    } else {
        inputClave.attr("type", "password");
        icono.removeClass("ti-eye-off").addClass("ti-eye");
    }
});

$('#btnIngresar').on('click', function () {

    $('#btnIngresar').prop('disabled', true);
    let usuario = $("#txtUsuario").val().trim();
    let clave = $("#txtClave").val().trim();

    //VALIDACIONES DE USUARIO
    if (usuario === "" || clave === "") {
        ToastLogin.fire({
            icon: 'warning',
            title: 'Complete los datos para iniciar sesion.'
        });

        $('#btnIngresar').prop('disabled', false);
        return;
    }

    loginSistema(usuario, clave);
})

function loginSistema(usuario, clave) {

    $.ajax({
        url: "Login.aspx/Logeo",
        type: "POST",
        data: JSON.stringify({ Correo: usuario, Clave: clave }),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $.LoadingOverlay("show");
        },
        success: function (response) {
            $.LoadingOverlay("hide");
            if (response.d.Estado) {

                const dato = response.d.Data;

                sessionStorage.clear();
                sessionStorage.setItem('userTrans', JSON.stringify(dato));
                Swal.fire({
                    icon: 'success',
                    title: '¡Acceso Autorizado!',
                    text: '¡Bienvenido al sistema usuario!',
                    showConfirmButton: false,
                    timer: 2000
                });

                $("#txtUsuario, #txtClave").val("");

                setTimeout(() => window.location.href = response.d.Valor, 2200);
            } else {
                Swal.fire({ title: "Mensaje", text: response.d.Mensaje, icon: "warning" });
                $("#txtUsuario").val("");
                $("#txtClave").val("");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            Swal.fire({ title: "Error", text: "Error de comunicación con el servidor.", icon: "error" });
        },
        complete: function () {
            $('#btnIngresar').prop('disabled', false);
        }
    });
}

//finn