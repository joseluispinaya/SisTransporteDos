<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="CapaPresentacion.Login" %>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Sistema de Operaciones</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css">
    <link href="assets/vendor/sweetalert2/sweetalert2.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Reseteo básico */
        body, html {
            height: 100%;
            margin: 0;
            background-color: #121212;
        }

        /* Contenedor principal: Imagen de fondo a pantalla completa */
        .bg-login {
            /* El linear-gradient oscurece la imagen para que la tarjeta blanca resalte */
            background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('Imagenes/imglogin.png');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px; /* Margen de seguridad para celulares */
        }

        /* La tarjeta central flotante */
        .card-login {
            background-color: rgba(255, 255, 255, 0.96); /* Blanco casi sólido pero translúcido */
            backdrop-filter: blur(10px); /* Efecto vidrio esmerilado detrás de la tarjeta */
            border-radius: 24px;
            padding: 2.5rem;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.3);
        }

        /* Estilos de los inputs */
        .input-group-text {
            background-color: transparent;
            border-right: none;
            color: #6c757d;
            border-radius: 10px 0 0 10px;
        }

        .form-control.with-icon {
            border-left: none;
            border-radius: 0 10px 10px 0;
            padding-left: 0.5rem;
        }

        .form-control:focus {
            box-shadow: none;
            border-color: #dee2e6;
        }

        /* Efecto cuando el usuario hace clic en el input */
        .input-group:focus-within {
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
            border-radius: 10px;
        }

            .input-group:focus-within .input-group-text,
            .input-group:focus-within .form-control,
            .input-group:focus-within .btn-toggle-pass {
                border-color: #0d6efd;
                color: #0d6efd;
            }

        .btn-toggle-pass {
            border-left: none;
            border-radius: 0 10px 10px 0;
            background: transparent;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }

            .btn-toggle-pass:hover {
                color: #0d6efd;
                background-color: transparent;
            }

        .btn-login {
            border-radius: 10px;
            padding: 12px;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>

    <div class="bg-login">

        <div class="card-login">
            <div class="text-center mb-4">
                <div class="mb-3 d-inline-block">
                    <i class="ti ti-steering-wheel text-primary" style="font-size: 3.5rem;"></i>
                </div>
                <h3 class="fw-bold text-dark mb-1">Acceso al Sistema</h3>
                <p class="text-muted small">Gestión de Transporte y Encomiendas</p>
            </div>

            <div class="mb-3">
                <label for="txtUsuario" class="form-label fw-bold text-secondary small text-uppercase">Nro CI o Correo</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-user fs-5"></i></span>
                    <input type="text" class="form-control with-icon" id="txtUsuario" placeholder="Ingrese su usuario" value="marcolopz@yopmail.com">
                </div>
            </div>

            <div class="mb-4">
                <label for="txtClave" class="form-label fw-bold text-secondary small text-uppercase">Contraseña</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-lock fs-5"></i></span>
                    <input type="password" class="form-control with-icon" id="txtClave" placeholder="••••••••" value="987654321">
                    <button class="btn btn-toggle-pass" type="button" id="btnVerClave">
                        <i class="ti ti-eye fs-5"></i>
                    </button>
                </div>
            </div>

            <div class="d-grid mt-4">
                <button type="button" class="btn btn-primary btn-login fw-bold shadow-sm" id="btnIngresar">
                    Iniciar Sesión <i class="ti ti-arrow-right ms-2"></i>
                </button>
            </div>
        </div>

    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="assets/vendor/sweetalert2/sweetalert2.min.js"></script>
    <script src="assets/vendor/loadingoverlay/loadingoverlay.min.js"></script>
    <script src="js/Login.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</body>
</html>
