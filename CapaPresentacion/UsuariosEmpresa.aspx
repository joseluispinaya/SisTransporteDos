<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="UsuariosEmpresa.aspx.cs" Inherits="CapaPresentacion.UsuariosEmpresa" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/vendor/datatables/extensiones/css/buttons.dataTables.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            
            <div class="alert alert-primary d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3" role="alert">

                <div>
                    <h4 class="mb-1 fw-bold text-dark d-flex align-items-center">
                        <i class="ti ti-users-group fs-22 me-2"></i>Gestión de Usuarios
                    </h4>
                    <p class="text-muted mb-0 fs-14">Administración de personal y accesos al sistema.</p>
                </div>

                <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-2">

                    <div class="input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="ti ti-building text-muted"></i>
                        </span>
                        <select id="cboFiltroEmpresa" class="form-select bg-light border-start-0 fw-medium" style="min-width: 240px;">
                            <option value="0">Seleccione una empresa...</option>
                        </select>
                    </div>

                    <button type="button" id="btnNuevoRegistro" class="btn btn-primary fw-medium text-nowrap">
                        <i class="ti ti-user-plus fs-18 align-middle me-1"></i>Nuevo Usuario
                    </button>

                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom" id="tbData" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th>Usuario y Contacto</th>
                                    <th>Documento (CI)</th>
                                    <th>Empresa y Rol</th>
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
                        <i class="ti ti-user-circle text-primary fs-22 me-2"></i>
                        <span id="modalLabelTitulos">Usuario</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <div class="row g-4">
                        
                        <div class="col-md-7">
                            
                            <div class="row g-3 mb-2">
                                <div class="col-md-6">
                                    <label for="cboEmpresa" class="form-label fw-medium">Empresa <span class="text-danger">*</span></label>
                                    <select id="cboEmpresa" name="Empresa" class="form-select form-select-sm">
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="cboRol" class="form-label fw-medium">Rol del Sistema <span class="text-danger">*</span></label>
                                    <select id="cboRol" name="Rol" class="form-select form-select-sm">
                                    </select>
                                </div>
                            </div>

                            <hr class="border-secondary border-opacity-25 border-dashed my-3">

                            <div class="row g-3 mb-2">
                                <div class="col-md-6">
                                    <label for="txtNombres" class="form-label fw-medium">Nombres <span class="text-danger">*</span></label>
                                    <input type="text" id="txtNombres" name="Nombres" class="form-control form-control-sm model" placeholder="Ej: Juan">
                                </div>
                                <div class="col-md-6">
                                    <label for="txtApellidos" class="form-label fw-medium">Apellidos <span class="text-danger">*</span></label>
                                    <input type="text" id="txtApellidos" name="Apellidos" class="form-control form-control-sm model" placeholder="Ej: Pérez">
                                </div>
                            </div>

                            <div class="row g-3 mb-2">
                                <div class="col-md-6">
                                    <label for="txtNroCi" class="form-label fw-medium">Nro. de CI <span class="text-danger">*</span></label>
                                    <input type="text" id="txtNroCi" name="CI" class="form-control form-control-sm model" placeholder="Documento de identidad">
                                    <div class="form-text text-info fs-12 mt-1">
                                        <i class="ti ti-info-circle"></i> Usado como contraseña.
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txtCelular" class="form-label fw-medium">Celular <span class="text-danger">*</span></label>
                                    <input type="text" id="txtCelular" name="Celular" class="form-control form-control-sm model" placeholder="Ej: 71234567">
                                </div>
                            </div>

                            <div class="mb-2">
                                <label for="txtCorreo" class="form-label fw-medium">Correo Electrónico <span class="text-danger">*</span></label>
                                <input type="email" id="txtCorreo" name="Correo" class="form-control form-control-sm model" placeholder="usuario@empresa.com">
                            </div>

                        </div>

                        <div class="col-md-5 d-flex flex-column">
                            <div class="mb-2">
                                <label for="cboEstado" class="form-label fw-medium">Estado del Usuario</label>
                                <select class="form-select form-select-sm" id="cboEstado">
                                    <option value="1">Activo</option>
                                    <option value="0">Bloqueado / Inactivo</option>
                                </select>
                            </div>
                            
                            <div class="mb-2">
                                <label for="txtFoto" class="form-label fw-medium">Fotografía (Opcional)</label>
                                <input type="file" id="txtFoto" class="form-control form-control-sm" accept="image/*">
                            </div>

                            <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center border border-dashed rounded bg-light p-3 mt-1">
                                <p class="text-muted fs-13 mb-3 fw-medium">Vista previa</p>
                                <img src="Imagenes/sinImagen.png" id="imgFoto" alt="Foto Usuario" class="img-fluid rounded-circle border border-2 border-white shadow-sm" style="width: 120px; height: 120px; object-fit: cover;" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer border-top border-dashed pt-3">
                    <button type="button" class="btn btn-soft-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-x fs-16 align-middle me-1"></i> Cancelar
                    </button>
                    <button type="button" id="btnGuardarCambios" class="btn btn-primary">
                        <i class="ti ti-device-floppy fs-16 align-middle me-1"></i> Guardar Usuario
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

    <script src="js/UsuariosEmpresa.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
