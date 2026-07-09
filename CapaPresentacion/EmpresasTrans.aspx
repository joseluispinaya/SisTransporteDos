<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="EmpresasTrans.aspx.cs" Inherits="CapaPresentacion.EmpresasTrans" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
    <style>
        .usuario-perfil {
            width: 135px;
            height: 135px;
            /* border-radius: 50%; */
            object-fit: contain; /* EL CAMBIO MÁGICO: Evita recortes */
            object-position: center; /* Centra el logo en la caja */
            /* Opcional pero recomendado para logos: un fondito muy tenue */
            background-color: #f8f9fa;
            padding: 5px;
            border-radius: 8px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            
            <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
                <div class="d-flex align-items-center">
                    <i class="ti ti-building-store fs-32 me-3"></i>

                    <div>
                        <h4 class="alert-heading mb-1 fw-bold">Directorio de Empresas</h4>
                        <p class="mb-0">Gestión centralizada de operadores de transporte en la terminal.</p>
                    </div>
                </div>

                <div class="mt-3 mt-sm-0">
                    <button type="button" id="btnNuevoRegistro" class="btn btn-primary fw-medium px-4">
                        <i class="ti ti-plus fs-18 align-middle me-1"></i>Registrar Empresa
       
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom" id="tbData" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th>Empresa y Documento</th>
                                    <th>Contacto y Ubicación</th>
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

    <div id="modalAdd" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelTitulos" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            
            <div class="modal-header border-bottom border-dashed pb-3">
                <h5 class="modal-title d-flex align-items-center">
                    <i class="ti ti-building-store text-primary fs-22 me-2"></i>
                    <span id="modalLabelTitulos">Empresa</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body">
                <div class="row g-4"> 
                    <div class="col-md-7">
                        <div class="mb-2">
                            <label for="txtRazonSocial" class="form-label fw-medium">Razón Social <span class="text-danger">*</span></label>
                            <input type="text" id="txtRazonSocial" name="Razon Social" class="form-control form-control-sm model" placeholder="Ej: Flota Yungueña">
                        </div>

                        <div class="row g-3 mb-2">
                            <div class="col-md-6">
                                <label for="txtNIT" class="form-label fw-medium">NIT</label>
                                <input type="text" id="txtNIT" name="NIT" class="form-control form-control-sm model" placeholder="Ingrese el NIT">
                            </div>
                            <div class="col-md-6">
                                <label for="txtTelefono" class="form-label fw-medium">Teléfono</label>
                                <input type="text" id="txtTelefono" name="Telefono" class="form-control form-control-sm model" placeholder="Ej: 71234567">
                            </div>
                        </div>

                        <div class="mb-2">
                            <label for="txtDireccion" class="form-label fw-medium">Dirección</label>
                            <input type="text" id="txtDireccion" name="Direccion" class="form-control form-control-sm model" placeholder="Dirección de la oficina central">
                        </div>

                        <div>
                            <label for="txtFoto" class="form-label fw-medium">Logotipo de la Empresa</label>
                            <input type="file" id="txtFoto" class="form-control form-control-sm" accept="image/*">
                        </div>
                    </div>

                    <div class="col-md-5 d-flex flex-column">
                        <div class="mb-2">
                            <label for="cboEstado" class="form-label fw-medium">Estado del Registro</label>
                            <select class="form-select form-select-sm" id="cboEstado">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                        
                        <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center border border-dashed rounded bg-light p-3 mt-2">
                            <p class="text-muted fs-13 mb-3 fw-medium">Vista previa del logotipo</p>
                            <img src="LogosEmp/logoEmp.jpg" id="imgLogo" alt="Logo Empresa" class="img-fluid rounded" style="max-height: 140px; object-fit: contain;" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer border-top border-dashed pt-3">
                <button type="button" class="btn btn-soft-secondary" data-bs-dismiss="modal">
                    <i class="ti ti-x fs-16 align-middle me-1"></i> Cancelar
                </button>
                <button type="button" id="btnGuardarCambios" class="btn btn-primary">
                    <i class="ti ti-device-floppy fs-16 align-middle me-1"></i> Guardar Registro
                </button>
            </div>
            
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>

    <script src="assets/vendor/datatables/extensiones/js/dataTables.buttons.min.js"></script>
    <script src="assets/vendor/datatables/extensiones/js/jszip.min.js"></script>
    <script src="assets/vendor/datatables/extensiones/js/buttons.html5.min.js"></script>
    <script src="assets/vendor/datatables/extensiones/js/buttons.print.min.js"></script>

    <script src="js/Empresas.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
