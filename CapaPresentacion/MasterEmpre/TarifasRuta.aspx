<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="TarifasRuta.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.TarifasRuta" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
<div class="row">
    <div class="col-lg-12">
        
        <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
            <div class="d-flex align-items-center mb-3 mb-md-0">
                <i class="ti ti-cash-banknote fs-32 me-3"></i>
                <div>
                    <h4 class="alert-heading mb-1 fw-bold">Gestión de Tarifas</h4>
                    <p class="mb-0">Administra los precios de pasajes y encomiendas según la ruta y tipo de bus.</p>
                </div>
            </div>
            
            <div>
                <button type="button" id="btnNuevoRegistro" class="btn btn-primary fw-medium px-4">
                    <i class="ti ti-plus fs-18 align-middle me-1"></i> Nueva Tarifa
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover align-middle border-bottom" id="tbTarifas" style="width: 100%">
                        <thead class="table-light">
                            <tr>
                                <th>Ruta (Origen <i class="ti ti-arrow-right mx-1"></i> Destino)</th>
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
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            
            <div class="modal-header border-bottom border-dashed pb-3">
                <h5 class="modal-title d-flex align-items-center">
                    <i class="ti ti-receipt-2 text-primary fs-22 me-2"></i> 
                    <span id="modalLabeltarifa">Detalles de Tarifa</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body">

                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Ciudad Origen <span class="text-danger">*</span></label>
                        <select class="form-select" id="cboCiudadOrigen">
                            </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Ciudad Destino <span class="text-danger">*</span></label>
                        <select class="form-select" id="cboCiudadDestino">
                            </select>
                    </div>
                </div>

                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Tipo de Bus <span class="text-danger">*</span></label>
                        <select class="form-select" id="cboTipobus">
                            </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Estado</label>
                        <select class="form-select" id="cboEstado">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>

                <hr class="border-secondary border-opacity-25 border-dashed my-3">

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-medium">Precio Pasaje <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted"><i class="ti ti-currency-dollar"></i></span>
                            <input type="number" class="form-control" id="txtPrePasaje" placeholder="0.00" step="0.01" min="0">
                            <span class="input-group-text bg-light text-muted fw-medium">Bs.</span>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">Precio Encomienda <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted"><i class="ti ti-package"></i></span>
                            <input type="number" class="form-control" id="txtPreKilo" placeholder="0.00" step="0.01" min="0">
                            <span class="input-group-text bg-light text-muted fw-medium">Bs./Kg</span>
                        </div>
                    </div>
                </div>

            </div>
            
            <div class="modal-footer border-top border-dashed pt-3">
                <button type="button" class="btn btn-soft-secondary" data-bs-dismiss="modal">
                    <i class="ti ti-x fs-16 align-middle me-1"></i> Cancelar
                </button>
                <button type="button" id="btnGuardarTarifa" class="btn btn-primary">
                    <i class="ti ti-device-floppy fs-16 align-middle me-1"></i> Guardar Tarifa
                </button>
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
