
// Configuramos diferentes SweetAlert de forma global
const ToastMaster = Swal.mixin({
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

function mostrarAlerta(titulo, mensaje, icono, claseBoton = "btn btn-primary") {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        confirmButtonText: "Ok",
        buttonsStyling: false, // Esto es importante en tu plantilla para usar los botones de Bootstrap
        customClass: {
            confirmButton: claseBoton
        }
    });
}

function mostrarAlertaZero(titulo, mensaje, icono) {

    let btnClass = 'btn-primary';

    // Asignamos el color del botón
    if (icono === 'success') btnClass = 'btn-success';
    else if (icono === 'warning') btnClass = 'btn-warning';
    else if (icono === 'error') btnClass = 'btn-danger';
    else if (icono === 'info') btnClass = 'btn-info';

    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        confirmButtonText: "Ok",
        buttonsStyling: false, // Esto es importante en tu plantilla para usar los botones de Bootstrap
        customClass: {
            confirmButton: 'btn ' + btnClass
        }
    });
}

function mostrarAlertaTimer(titulo, mensaje, icono, tiempo = 3000) {
    let btnClass = 'btn-primary';

    // Asignamos el color del botón según el ícono para mantener coherencia
    if (icono === 'success') btnClass = 'btn-success';
    else if (icono === 'warning') btnClass = 'btn-warning';
    else if (icono === 'error') btnClass = 'btn-danger';
    else if (icono === 'info') btnClass = 'btn-info';

    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        timer: tiempo,
        timerProgressBar: true,
        showConfirmButton: true, // Muestra el botón por si el usuario quiere cerrar antes
        confirmButtonText: "Entendido",
        buttonsStyling: false,
        showCloseButton: true, // La 'X' en la esquina superior derecha
        customClass: {
            //confirmButton: 'btn ' + btnClass + ' mt-2'
            confirmButton: 'btn ' + btnClass
        }
    });
}

function mostrarAlertaTimerNew(titulo, mensaje, tiempo = 2500) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        timer: tiempo,
        timerProgressBar: true,
        showConfirmButton: false, // Oculta el botón "Ok"
        showCloseButton: true,    // Muestra la 'X' para cerrar
        didOpen: () => {
            Swal.showLoading();   // Activa el spinner de carga de SweetAlert
        }
    });
}

function mostrarAlertaTimerConContador(titulo, tiempo = 2500) {
    let timerInterval;

    Swal.fire({
        title: titulo,
        // Ojo aquí: usamos 'html' en lugar de 'text' e incluimos la etiqueta <b>
        html: "Se cerrará en <b></b> milisegundos.",
        timer: tiempo,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            Swal.showLoading(); // Activa el spinner

            // Capturamos la etiqueta <b> para inyectarle el tiempo restante
            const b = Swal.getHtmlContainer().querySelector('b');
            timerInterval = setInterval(() => {
                if (b) {
                    b.textContent = Swal.getTimerLeft(); // Actualiza los números en vivo
                }
            }, 100);
        },
        willClose: () => {
            // Limpiamos el intervalo cuando se cierra para no consumir memoria
            clearInterval(timerInterval);
        }
    });
}

function mostrarAlertaConfirmacion(titulo, mensaje, icono = 'warning', textoConfirmar = 'Sí, continuar', textoCancelar = 'Cancelar') {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoCancelar,
        buttonsStyling: false,
        showCloseButton: true,
        customClass: {
            // El me-2 (margin-end) separa los botones, tal como lo hace tu template
            confirmButton: "btn btn-primary me-2 mt-2",
            cancelButton: "btn btn-danger mt-2"
        }
    });
}