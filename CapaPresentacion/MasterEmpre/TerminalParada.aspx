<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="TerminalParada.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.TerminalParada" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
    <style>
        /* Efecto hover para que la tarjeta se sienta interactiva */
        .card-mapa {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

            .card-mapa:hover {
                transform: translateY(-4px);
                box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
            }
        /* Asegurar que la imagen se adapte perfectamente a las esquinas superiores de la tarjeta */
        .img-portada-mapa {
            width: 100%;
            object-fit: cover;
            border-top-left-radius: var(--bs-card-inner-border-radius);
            border-top-right-radius: var(--bs-card-inner-border-radius);
            /* Opcional: Un ligero oscurecimiento para que contraste mejor en modo claro/oscuro */
            filter: contrast(1.05) saturate(1.1);
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-3">
            <div class="card card-mapa mb-3">

                <!-- shadow-sm border-0 Contenedor relativo para poder superponer elementos a la imagen -->
                <div class="position-relative">
                    <!-- AQUI PONES LA RUTA DE TU IMAGEN -->
                    <img src="../Imagenes/rutasFlotas.png" alt="Mapa de Conexiones Bolivia" class="img-fluid img-portada-mapa">

                    <!-- Etiqueta Flotante sobre la imagen (Esquina superior derecha) -->
                    <span class="position-absolute top-0 end-0 m-2 badge bg-primary shadow-sm text-uppercase fw-semibold px-2 py-1" style="opacity: 0.9;">
                        <i class="ti ti-map-pin me-1"></i>Red Nacional
                    </span>
                </div>

                <!-- Cuerpo de la tarjeta con la descripción -->
                <div class="card-body bg-light-subtle text-center border-top border-light">
                    <h5 class="card-title fw-bold text-dark mb-1">Control de Rutas</h5>
                    <p class="text-muted fs-13 mb-3">
                        Gestión centralizada de ciudades, paradas y trayectos interdepartamentales.
                    </p>

                    <!-- Pequeños badges estilo "Leyenda" para acompañar el diseño -->
                    <div class="d-flex justify-content-center flex-wrap gap-2">
                        <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-11">
                            <i class="ti ti-location"></i>Destinos
                        </span>
                        <span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fs-11">
                            <i class="ti ti-route"></i>Conexiones
                        </span>
                    </div>
                </div>

            </div>
        </div>
        <div class="col-lg-9">
            <div class="card">
                <div class="card-header border-bottom border-dashed d-flex align-items-center">
                    <h4 class="header-title">Panel de Terminales y Rutas</h4>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-9">
                            <div class="tab-content" id="v-pills-tabContent-right">
                                <div class="tab-pane fade active show" id="v-pills-home2" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                        <div>
                                            <h5 class="mb-0 text-dark">Directorio de Terminales</h5>
                                            <p class="text-muted fs-13 mb-0">Administra las distintas terminales.</p>
                                        </div>
                                        <div>
                                            <button type="button" id="btnNuevaTerminal" class="btn btn-primary rounded-pill fw-medium px-3">
                                                <i class="ti ti-user-plus fs-18 align-middle me-1"></i>Registrar Terminal
                                            </button>
                                        </div>
                                    </div>

                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover align-middle" id="tbTerminales" style="width: 100%">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Terminales</th>
                                                    <th>Estado</th>
                                                    <th class="text-center rounded-end">Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="v-pills-profile2" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                        <div>
                                            <h5 class="mb-0 text-dark">Directorio de Rutas</h5>
                                            <p class="text-muted fs-13 mb-0">Administra las rutas interdepartamentales.</p>
                                        </div>
                                        <div>
                                            <button type="button" id="btnNuevaRuta" class="btn btn-primary rounded-pill fw-medium px-3">
                                                <i class="ti ti-user-plus fs-18 align-middle me-1"></i>Registrar Ruta
                                            </button>
                                        </div>
                                    </div>

                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover align-middle" id="tbRutas" style="width: 100%">
                                            <thead class="table-light">
                                                <tr>
                                                    <th class="rounded-start">Id</th>
                                                    <th>Rutas</th>
                                                    <th class="text-center">Estado</th>
                                                    <th class="text-center rounded-end">Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <%--<tr>
                                                    <td class="fw-bold">#1</td>
                                                    <td><i class="ti ti-map-pin text-success me-1"></i>Riberalta - La Paz</td>
                                                    <td class="text-center">
                                                        <button class="btn btn-sm btn-soft-info btn-icon"><i class="ti ti-pencil"></i></button>
                                                    </td>
                                                </tr>--%>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="v-pills-settings2" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                                    <div class="mb-3 pb-3 border-bottom">

                                        <!-- ARRIBA: Títulos -->
                                        <div class="mb-3">
                                            <h5 class="mb-0 text-dark">Orden de Rutas y Paradas</h5>
                                            <p class="text-muted fs-13 mb-0">Seleccione una ruta para ver y administrar sus paradas.</p>
                                        </div>

                                        <!-- ABAJO: Filtro y Botón Lado a Lado -->
                                        <div class="d-flex flex-wrap flex-md-nowrap align-items-center gap-2">

                                            <!-- Select (Crecerá para ocupar el espacio sobrante) -->
                                            <div class="input-group flex-grow-1">
                                                <span class="input-group-text bg-white border-end-0 text-primary" id="addon-rutatable">
                                                    <i class="ti ti-road fs-18"></i>
                                                </span>
                                                <select class="form-select text-dark fw-medium" id="cboRutasTable" aria-describedby="addon-rutatable">
                                                </select>
                                            </div>

                                            <!-- Botón (No se encogerá gracias a flex-shrink-0 y text-nowrap) -->
                                            <button type="button" id="btnNuevaOrdenRp" class="btn btn-dark rounded-pill fw-medium px-3 text-nowrap flex-shrink-0">
                                                <i class="ti ti-map-pin-plus fs-18 align-middle me-1"></i>Nueva Parada
                                            </button>

                                        </div>
                                    </div>

                                    <div class="table-responsive">
                                        <table class="table table-sm table-hover align-middle" id="tbRutaParadas" style="width: 100%">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Ciudad/Parada</th>
                                                    <th>Nro. Orden</th>
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

                        <div class="col-sm-3 mt-2 mt-sm-0">
                            <div class="nav flex-column nav-pills nav-pills-secondary" id="v-pills-tab2" role="tablist" aria-orientation="vertical">
                                <a class="nav-link p-2 active show" id="v-pills-home-tab2" data-bs-toggle="pill"
                                    href="#v-pills-home2" role="tab" aria-controls="v-pills-home2" aria-selected="true">
                                    <i class="ti ti-map-pin fs-18 me-1"></i>
                                    <span class="d-none d-md-inline-block">Terminales</span>
                                </a>
                                <a class="nav-link p-2" id="v-pills-profile-tab2" data-bs-toggle="pill" href="#v-pills-profile2"
                                    role="tab" aria-controls="v-pills-profile2" aria-selected="false">
                                    <i class="ti ti-device-ipad-pin fs-18 me-1"></i>
                                    <span class="d-none d-md-inline-block">Rutas</span>
                                </a>
                                <a class="nav-link p-2" id="v-pills-settings-tab2" data-bs-toggle="pill"
                                    href="#v-pills-settings2" role="tab" aria-controls="v-pills-settings2"
                                    aria-selected="false">
                                    <i class="ti ti-droplet-pin fs-18 me-1"></i>
                                    <span class="d-none d-md-inline-block">Rt. Paradas</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="modalTerminal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelterminal" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelterminal">Terminales</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-1">
                        <label for="txtNombreCiudadPa" class="form-label mb-1">Ciudad Terminal</label>
                        <input type="text" id="txtNombreCiudadPa" name="Ciudad Terminal" class="form-control form-control-sm">
                    </div>
                    <div class="mb-1">
                        <label for="cboEstado" class="form-label mb-1">Estado</label>
                        <select class="form-select form-select-sm" id="cboEstado">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnGuardarRegCiudad" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="modalRutas" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelrutas" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelrutas">Rutas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-1">
                        <label for="txtNombreRuta" class="form-label mb-1">Ingrese Ruta</label>
                        <input type="text" id="txtNombreRuta" name="Ruta" class="form-control form-control-sm">
                    </div>
                    <div class="mb-1">
                        <label for="cboEstadoRuta" class="form-label fw-medium mb-1">Estado Ruta</label>
                        <select class="form-select form-select-sm" id="cboEstadoRuta">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnGuardarRegRuta" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="modalRutaPara" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelrutapara" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelrutapara">Rutas - Paradas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="input-group input-group-sm mb-2">
                        <span class="input-group-text" id="addon-rutabus">
                            <i class="ti ti-road me-1"></i>Seleccione una Ruta
                        </span>
                        <select class="form-select text-dark" id="cboRutabus" aria-describedby="addon-rutabus">
                        </select>
                    </div>

                    <div class="row">
                        <div class="mb-1 col-md-7">
                            <label class="form-label text-muted fs-13 mb-1">Seleccione Ciudad</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text"><i class="ti ti-map-pin"></i></span>
                                <select class="form-select" id="cboCiudadPa">
                                </select>
                            </div>
                        </div>

                        <div class="mb-1 col-md-5">
                            <label class="form-label text-muted fs-13 mb-1">Nro. Orden</label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text text-success fw-bold">Nro.</span>
                                <input type="number" class="form-control" id="txtOrden">
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnGuardarRutaPara" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.buttons.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/jszip.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/buttons.html5.min.js"></script>
    <script src="../assets/vendor/datatables/extensiones/js/buttons.print.min.js"></script>

    <script src="jsEmpre/TerminalParada.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
