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
            <div class="card">
                <div class="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
                    <h4 class="header-title">Registro de Empresas</h4>
                </div>

                <div class="card-body">

                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div>
                            <h5 class="mb-0 text-dark">Directorio de Registro</h5>
                            <p class="text-muted fs-13 mb-0">Administra las empresas de transporte.</p>
                        </div>
                        <div>
                            <button type="button" id="btnNuevoRegistro" class="btn btn-primary rounded-pill fw-medium px-3">
                                <i class="ti ti-plus fs-18 align-middle me-1"></i>Nuevo Registro
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle border-bottom" id="tbData" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th>Id</th>
                                    <th>Empresas</th>
                                    <th>Documento (RIF)</th>
                                    <th>Direccion</th>
                                    <th>Contacto</th>
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
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelTitulos">Empresa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-7">

                            <div class="mb-2">
                                <label for="txtRazonSocial" class="form-label">Razon Social</label>
                                <input type="text" id="txtRazonSocial" name="Razon Social" class="form-control form-control-sm model">
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    
                                    <div class="mb-2">
                                        <label for="txtNIT" class="form-label">NIT</label>
                                        <input type="text" id="txtNIT" name="NIT" class="form-control form-control-sm model">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label for="txtTelefono" class="form-label">Telefono</label>
                                        <input type="text" id="txtTelefono" name="Telefono" class="form-control form-control-sm model">
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="mb-2">
                                <label for="txtDireccion" class="form-label">Direccion</label>
                                <input type="text" id="txtDireccion" name="Direccion" class="form-control form-control-sm model">
                            </div>

                            <div class="mb-1">
                                <label for="txtFoto" class="form-label">Seleccione imagen</label>
                                <input type="file" id="txtFoto" class="form-control form-control-sm" accept="image/*">
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="mb-2">
                                <label for="cboEstado" class="form-label">Estado</label>
                                <select class="form-select form-select-sm" id="cboEstado">
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>
                            <h5 class="text-dark fw-medium text-center mt-2">Foto seleccionada</h5>
                            <div class="text-center mt-3 mb-1">
                                <img src="Imagenes/sinImagen.png" id="imgUsureg" alt="image" class="img-fluid rounded-circle usuario-perfil" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnGuardarCambios" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
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
