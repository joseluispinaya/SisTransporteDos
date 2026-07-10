<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="Conductores.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.Conductores" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Pequeño truco CSS para el ícono gigante de fondo en las tarjetas */
        .bg-icon-transport {
            position: absolute;
            right: -15px;
            bottom: -15px;
            font-size: 6rem;
            opacity: 0.15;
            transform: rotate(-10deg);
            transition: all 0.3s ease;
        }
        /* Efecto hover para que la tarjeta se sienta viva */
        .card-transport:hover .bg-icon-transport {
            transform: rotate(0deg) scale(1.1);
            opacity: 0.25;
        }

        .card-transport {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

            .card-transport:hover {
                transform: translateY(-3px);
                box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
            }

        /* 1. Reducir la altura del contenedor principal de Select2 */
        .select2-container .select2-selection--single {
            height: 31px !important; /* Altura estándar de form-control-sm en Bootstrap 5 */
            padding: 0.25rem 0.5rem; /* Ajustar el padding interno */
            border: 1px solid #343a40; /* Borde estándar (ajusta al color de tu template si es necesario) */
            border-radius: var(--bs-border-radius-sm); /* Respetar el borde redondeado pequeño de Bootstrap */
        }

        /* 2. Alinear verticalmente el texto seleccionado adentro */
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 1.5 !important;
            padding-left: 0px !important;
            color: #495057; /* Color de texto estándar */
        }

        /* 3. Alinear la flechita de la derecha */
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 29px !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <div class="col-lg-3">
        <!-- Widget Choferes (Azul Ruta) -->
        <div class="card card-transport text-bg-primary border-0 shadow-sm mb-3 position-relative overflow-hidden cursor-pointer">
            <i class="ti ti-steering-wheel bg-icon-transport text-white"></i>
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <span class="avatar avatar-md bg-white text-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                            <i class="ti ti-user-scan fs-22"></i>
                        </span>
                    </div>
                    <div class="flex-grow-1 ms-3 text-white">
                        <p class="text-uppercase fs-12 fw-semibold mb-1 text-white-50">Personal Activo</p>
                        <h4 class="mb-0 text-white">12 <span class="fs-14 fw-normal">Choferes</span></h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Widget tipo de Buses (Gris Asfalto / Dark) -->
        <div class="card card-transport text-bg-primary border-0 shadow-sm mb-3 position-relative overflow-hidden cursor-pointer">
            <i class="ti ti-affiliate bg-icon-transport text-white"></i>
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <span class="avatar avatar-md bg-white text-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                            <i class="ti ti-adjustments fs-22"></i>
                        </span>
                    </div>
                    <div class="flex-grow-1 ms-3 text-white">
                        <p class="text-uppercase fs-12 fw-semibold mb-1 text-white-50">Tipo Flotas</p>
                        <h4 class="mb-0 text-white">5 <span class="fs-14 fw-normal">Categorias</span></h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Widget Buses (Gris Asfalto / Dark) -->
        <div class="card card-transport text-bg-primary border-0 shadow-sm mb-3 position-relative overflow-hidden cursor-pointer">
            <i class="ti ti-bus bg-icon-transport text-white"></i>
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <span class="avatar avatar-md bg-white text-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                            <i class="ti ti-road fs-22"></i>
                        </span>
                    </div>
                    <div class="flex-grow-1 ms-3 text-white">
                        <p class="text-uppercase fs-12 fw-semibold mb-1 text-white-50">Flota Vehicular</p>
                        <h4 class="mb-0 text-white">10 <span class="fs-14 fw-normal">Buses</span></h4>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="col-lg-9">
        <div class="card">
            <div class="card-header bg-light d-flex align-items-center justify-content-between pt-3 pb-0 border-bottom-0">
                <h4 class="header-title mb-0 text-uppercase fw-bold text-muted"><i class="ti ti-layout-dashboard me-1"></i>Gestión de Buses</h4>

                <ul class="nav nav-tabs card-header-tabs border-bottom-0" style="margin-bottom: -1px;">
                    <li class="nav-item">
                        <a href="#home-ct" data-bs-toggle="tab" aria-expanded="true" class="nav-link active fw-medium">
                            <i class="ti ti-id d-md-none d-block"></i>
                            <span class="d-none d-md-block"><i class="ti ti-users me-1"></i>Choferes</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#tipobus-ct" data-bs-toggle="tab" aria-expanded="false" class="nav-link fw-medium">
                            <i class="ti ti-adjustments d-md-none d-block"></i>
                            <span class="d-none d-md-block"><i class="ti ti-adjustments me-1"></i>Tipo Buses</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#profile-ct" data-bs-toggle="tab" aria-expanded="false" class="nav-link fw-medium">
                            <i class="ti ti-bus-stop d-md-none d-block"></i>
                            <span class="d-none d-md-block"><i class="ti ti-bus me-1"></i>Buses</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="card-body pt-4">
                <div class="tab-content">

                    <!-- TAB CHOFERES -->
                    <div class="tab-pane show active" id="home-ct">
                        <!-- EL NUEVO ACTION TOOLBAR (Adiós al botón centrado) -->
                        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                            <div>
                                <h5 class="mb-0 text-dark">Directorio de Choferes</h5>
                                <p class="text-muted fs-13 mb-0">Administra las licencias y datos del personal.</p>
                            </div>
                            <div>
                                <button type="button" id="btnNuevoChofer" class="btn btn-primary rounded-pill fw-medium px-3">
                                    <i class="ti ti-user-plus fs-18 align-middle me-1"></i>Registrar Chofer
                                </button>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle" id="tbChofer" style="width: 100%">
                                <thead class="table-light">
                                    <tr>
                                        <th class="rounded-start">Id</th>
                                        <th>Conductor</th>
                                        <th>Credenciales</th>
                                        <th>Estado</th>
                                        <th class="text-center rounded-end">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- TAB tipo BUSES -->
                    <div class="tab-pane" id="tipobus-ct">
                        <!-- EL NUEVO ACTION TOOLBAR PARA BUSES -->
                        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                            <div>
                                <h5 class="mb-0 text-dark">Tipo de Buses</h5>
                                <p class="text-muted fs-13 mb-0">Registro de los tipos de buses.</p>
                            </div>
                            <div>
                                <button type="button" id="btnNuevoTipoBus" class="btn btn-dark rounded-pill fw-medium px-3">
                                    <i class="ti ti-bus fs-18 align-middle me-1"></i>Nuevo Registro
                                </button>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle" id="tbTipoBuses" style="width: 100%">
                                <thead class="table-light">
                                    <tr>
                                        <th class="rounded-start">Id</th>
                                        <th>Descripcion</th>
                                        <th>Estado</th>
                                        <th class="text-center rounded-end">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- TAB BUSES -->
                    <div class="tab-pane" id="profile-ct">
                        <!-- EL NUEVO ACTION TOOLBAR PARA BUSES -->
                        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                            <div>
                                <h5 class="mb-0 text-dark">Inventario de Buses</h5>
                                <p class="text-muted fs-13 mb-0">Control de unidades y capacidad de asientos.</p>
                            </div>
                            <div>
                                <button type="button" id="btnNuevoBus" class="btn btn-dark rounded-pill fw-medium px-3">
                                    <i class="ti ti-bus fs-18 align-middle me-1"></i>Registrar Bus
                                </button>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle" id="tbBuses" style="width: 100%">
                                <thead class="table-light">
                                    <tr>
                                        <th class="rounded-start">Id</th>
                                        <th>Nro Placa</th>
                                        <th>Datos Bus</th>
                                        <th>Estado</th>
                                        <th class="text-center rounded-end">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<div id="modalChofer" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelchofer" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabelchofer">Chofer</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="input-group input-group-sm mb-2">
                    <div class="input-group-text">Nombre Completo</div>
                    <input type="text" class="form-control validze" id="txtNombreChofer" name="Nombre Completo" placeholder="Nombre Completo">
                </div>

                <div class="row">
                    <div class="mb-1 col-md-6">
                        <label for="txtNroLicencia" class="col-form-label col-form-label-sm">Nro Licencia</label>
                        <input type="text" id="txtNroLicencia" name="Nro Licencia" class="form-control form-control-sm validze">
                    </div>
                    <div class="mb-1 col-md-6">
                        <label for="txtTipoSangre" class="col-form-label col-form-label-sm">Tipo Sangre</label>
                        <input type="text" id="txtTipoSangre" name="Tipo de sangre" class="form-control form-control-sm validze">
                    </div>
                </div>

                <div class="row">
                    <div class="mb-1 col-md-4">
                        <label for="txtNroCi" class="col-form-label col-form-label-sm">Nro CI</label>
                        <input type="text" id="txtNroCi" name="Nro CI" class="form-control form-control-sm validze">
                    </div>
                    <div class="mb-1 col-md-4">
                        <label for="txtNroCel" class="col-form-label col-form-label-sm">Nro Cel</label>
                        <input type="number" id="txtNroCel" name="Nro Cel" class="form-control form-control-sm validze">
                    </div>
                    <div class="mb-1 col-md-4">
                        <label for="cboEstado" class="col-form-label col-form-label-sm">Estado</label>
                        <select class="form-select form-select-sm" id="cboEstado">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                <button type="button" id="btnGuardarChofer" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
            </div>
        </div>
    </div>
</div>

<div id="modalTipoBus" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabeltipoBu" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabeltipoBu">Tipo Bus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-1">
                    <label for="txtNombreTipoBu" class="form-label mb-1">Tipo de Bus</label>
                    <input type="text" id="txtNombreTipoBu" name="Tipo de Bus" class="form-control form-control-sm">
                </div>
                <div class="mb-1">
                    <label for="cboEstadoTipob" class="form-label fw-medium mb-1">Estado</label>
                    <select class="form-select form-select-sm" id="cboEstadoTipob">
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                <button type="button" id="btnGuardarRegTipob" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
            </div>
        </div>
    </div>
</div>

    <div id="modalBus" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelbus" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header border-bottom border-dashed pb-3">
                    <h5 class="modal-title d-flex align-items-center">
                        <i class="ti ti-bus text-primary fs-22 me-2"></i>
                        <span id="modalLabelbus">Bus</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="row g-4">

                        <div class="col-md-6">

                            <!-- <hr class="border-secondary border-opacity-25 border-dashed my-3"> -->

                            <div class="row g-3 mb-2">
                                <div class="col-md-6">
                                    <label for="txtNroPlaca" class="form-label fw-medium">Nro de Placa <span class="text-danger">*</span></label>
                                    <input type="text" id="txtNroPlaca" name="Nro de Placa" class="form-control form-control-sm" placeholder="Ej: ABC-123">
                                </div>
                                <div class="col-md-6">
                                    <label for="txtNroAsiento" class="form-label fw-medium">Nro de Asientos <span class="text-danger">*</span></label>
                                    <input type="number" id="txtNroAsiento" name="Nro de Asientos" class="form-control form-control-sm" placeholder="Ej: 45" min="0">
                                </div>
                            </div>

                            <div class="row g-3 mb-2">
                                <div class="col-md-6">
                                    <label for="cboTipobus" class="form-label fw-medium">Tipo de Bus <span class="text-danger">*</span></label>
                                    <select id="cboTipobus" name="Rol" class="form-select form-select-sm">
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="cboEstadoBuss" class="form-label fw-medium">Estado</label>
                                    <select class="form-select form-select-sm" id="cboEstadoBuss">
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div class="col-md-6 d-flex flex-column">

                            <div class="mb-2">
                                <%--<label for="cboBuscarChofer" class="form-label fw-medium">Buscar Conductor</label>--%>
                                <select id="cboBuscarChofer" class="form-control" style="width: 100%;">
                                    <option value="">Buscar Conductor...</option>
                                </select>
                            </div>
                            <input id="txtIdChofer" value="0" type="hidden" />

                            <div class="d-flex align-items-center border border-dashed rounded p-2 gap-3">
                                <div class="rounded bg-light avatar-xl d-flex align-items-center justify-content-center">
                                    <img src="../Imagenes/imgselect.png" alt="" class="avatar-xl">
                                </div>
                                <div>
                                    <a href="#!" class="text-dark fw-medium fs-15">Datos del Conductor</a>
                                    <p class="text-muted fw-medium fs-14 my-1" id="lblNombreChofer">Esperando...</p>
                                    <p class="text-muted fw-medium fs-14 my-1"><span class="text-dark">Nro CI : </span><span id="lblNroCi">Esperando...</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Cancelar</button>
                    <button type="button" id="btnGuardarBus" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
                </div>

            </div>
        </div>
    </div>


<%--<div id="modalBus" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelbus" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabelbus">Bus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="row">
                    <div class="mb-3 col-md-5">
                        <div class="input-group input-group-sm">
                            <div class="input-group-text">Placa</div>
                            <input type="text" class="form-control" id="txtNroPlaca" placeholder="Nro placa">
                        </div>
                    </div>
                    <div class="mb-3 col-md-7">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text" id="addon-tipobus">
                                <i class="ti ti-car-4wd"></i>Tipo
                            </span>
                            <select class="form-select" id="cboTipobus" aria-describedby="addon-tipobus">
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-3 col-md-5">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text" id="groupnrosilla"><i class="ti ti-armchair"></i> Asientos</span>
                            <input type="number" class="form-control" id="txtNroAsiento" aria-label="NroAsiento"
                                aria-describedby="groupnrosilla">
                        </div>
                    </div>
                    <div class="mb-3 col-md-7">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text" id="addon-estadobu">
                                <i class="ti ti-car-4wd"></i>Estado
                            </span>
                            <select class="form-select" id="cboEstadoBuss" aria-describedby="addon-estadobu">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-2 col-md-7">
                        <select id="cboBuscarChofer" class="form-control form-control-sm" style="width: 100%;">
                            <option value="">Buscar Chofer...</option>
                        </select>
                    </div>
                    <div class="mb-2 col-md-5">
                        <div class="input-group input-group-sm">
                            <div class="input-group-text">CI</div>
                            <input type="text" class="form-control" id="txtCiChoferSelec" readonly>
                        </div>
                    </div>
                </div>

                <div class="input-group input-group-sm mt-2">
                    <div class="input-group-text">Nombre Chofer</div>
                    <input type="text" class="form-control" id="txtChoferSelec" readonly>
                </div>
                <input id="txtIdChofer" value="0" type="hidden" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                <button type="button" id="btnGuardarBus" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
            </div>
        </div>
    </div>
</div>--%>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.buttons.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/jszip.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/buttons.html5.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/buttons.print.min.js"></script>

    <script src="../assets/vendor/select2/js/i18n/es.js"></script>

    <script src="jsEmpre/Conductores.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
