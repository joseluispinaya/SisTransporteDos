<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="TarifasRuta.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.TarifasRuta" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
                <h4 class="header-title">Registro de Tarifas</h4>
            </div>

            <div class="card-body">

                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div>
                        <h5 class="mb-0 text-dark">Directorio de Asignacion de Tarifas</h5>
                        <p class="text-muted fs-13 mb-0">Administra los precios segun origen y destino.</p>
                    </div>
                    <div>
                        <button type="button" id="btnNuevoRegistro" class="btn btn-primary rounded-pill fw-medium px-3">
                            <i class="ti ti-plus fs-18 align-middle me-1"></i>Nuevo Registro
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-sm table-hover align-middle border-bottom" id="tbTarifas" style="width: 100%">
                        <thead class="table-light">
                            <tr>
                                <th>Id</th>
                                <th>Ruta (Origen <i class="ti ti-arrow-right mx-1"></i>Destino)</th>
                                <th>Tipo de Bus & Pasaje</th>
                                <th>Precio Encomienda</th>
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

<div id="modalTarifa" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabeltarifa" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabeltarifa">Tarifas</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="row">
                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Origen</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-map-pin"></i></span>
                            <select class="form-select" id="cboCiudadOrigen">
                            </select>
                        </div>
                    </div>

                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Destino</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-map-pin"></i></span>
                            <select class="form-select" id="cboCiudadDestino">
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Tipo de Bus</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-bus"></i></span>
                            <select class="form-select" id="cboTipobus">
                            </select>
                        </div>
                    </div>
                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Estado</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-settings"></i></span>
                            <select class="form-select" id="cboEstado">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">

                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Precio Pasaje</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-receipt-dollar me-1"></i>(Bs.)</span>
                            <input type="number" class="form-control" id="txtPrePasaje">
                        </div>
                    </div>

                    <div class="mb-1 col-md-6">
                        <label class="form-label text-muted fs-13 mb-1">Precio Kilo</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text"><i class="ti ti-report-money me-1"></i>Kg/(Bs.)</span>
                            <input type="number" class="form-control" id="txtPreKilo">
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                <button type="button" id="btnGuardarTarifa" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
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

    <script src="jsEmpre/TarifasRuta.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
