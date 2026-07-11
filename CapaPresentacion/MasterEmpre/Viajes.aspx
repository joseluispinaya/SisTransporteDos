<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="Viajes.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.Viajes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    
    <style>
        .select2-container .select2-selection--single {
            height: 38px !important; /* Ajustado al tamaño estándar de Boron */
            padding: 0.35rem 0.5rem;
            border: 1px solid var(--bs-border-color);
            border-radius: var(--bs-border-radius);
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 1.5 !important;
            padding-left: 0px !important;
            color: var(--bs-body-color);
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px !important;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            
            <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
                <div class="d-flex align-items-center mb-3 mb-sm-0">
                    <i class="ti ti-route fs-32 me-3"></i>
                    <div>
                        <h4 class="alert-heading mb-1 fw-bold">Programación de Viajes</h4>
                        <p class="mb-0">Administra los Viajes interdepartamentales y asigne unidades.</p>
                    </div>
                </div>
                
                <div>
                    <button type="button" id="btnNuevore" class="btn btn-primary fw-medium px-4">
                        <i class="ti ti-plus fs-18 align-middle me-1"></i> Nuevo Registro
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom" id="tbData" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th>Ruta de Viaje</th>
                                    <th>Unidad (Bus)</th>
                                    <th>Salida (Fecha y Hora)</th>
                                    <th class="text-center">Estado</th>
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

    <div id="modalAdd" class="modal fade" data-bs-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="modalLabeldetalle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-bottom border-dashed pb-3">
                    <h5 class="modal-title d-flex align-items-center">
                        <i class="ti ti-bus-stop text-primary fs-22 me-2"></i> 
                        <span id="modalLabeldetalle">Detalle del Viaje</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <div class="mb-2">
                        <label for="cboRuta" class="form-label fw-medium">Seleccione Ruta <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0 text-primary" id="addon-rutaselc">
                                <i class="ti ti-road fs-18 me-1"></i>Ruta: 
                            </span>
                            <select class="form-select text-dark fw-medium" id="cboRuta" aria-describedby="addon-rutaselc">
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="cboBus" class="form-label fw-medium">Asignar Bus <span class="text-danger">*</span></label>
                        <select class="form-select" id="cboBus">
                        </select>
                    </div>

                    <div class="p-3 bg-light border border-dashed rounded">
                        <h6 class="fw-bold mb-2 text-primary"><i class="ti ti-calendar-time me-1"></i>Calendario de Salida</h6>

                        <div class="row">
                            <div class="col-md-6">
                                <label for="txtFechaSalida" class="form-label fw-medium">Fecha de Salida <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="ti ti-calendar"></i></span>
                                    <input type="text" id="txtFechaSalida" class="form-control bg-white" placeholder="DD/MM/YYYY" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="timepicker2" class="form-label fw-medium">Hora Exacta <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="ti ti-clock"></i></span>
                                    <input type="text" id="timepicker2" class="form-control bg-white" placeholder="HH:MM">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
                <div class="modal-footer border-top border-dashed pt-3">
                    <button type="button" class="btn btn-soft-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-x fs-16 align-middle me-1"></i> Salir
                    </button>
                    <button type="button" id="btnGuardarCambios" class="btn btn-primary">
                        <i class="ti ti-device-floppy fs-16 align-middle me-1"></i> Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/flatpickr/l10n/es.js"></script>
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>
    <script src="jsEmpre/Viajes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</asp:Content>
