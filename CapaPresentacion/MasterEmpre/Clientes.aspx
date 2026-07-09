<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="Clientes.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.Clientes" %>
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
                    <h4 class="header-title">Registro de Clientes</h4>
                </div>

                <div class="card-body">

                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div>
                            <h5 class="mb-0 text-dark">Directorio de Registro</h5>
                            <p class="text-muted fs-13 mb-0">Administra los clientes de la empresa de trasporte.</p>
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
                                    <th>Clientes</th>
                                    <th>Documento (CI)</th>
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

    <div id="modalAdd" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelcliente" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelcliente">Cliente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="row">
                        <div class="mb-1 col-md-6">
                            <label for="txtNombres" class="form-label mb-1 text-muted fw-semibold">Nombres</label>
                            <input type="text" id="txtNombres" name="Nombres" class="form-control form-control-sm model">
                        </div>

                        <div class="mb-1 col-md-6">
                            <!-- <label class="form-label text-muted fs-13 mb-1">Destino</label> -->
                            <label for="txtApellidos" class="form-label mb-1 text-muted fw-semibold">Apellidos</label>
                            <input type="text" id="txtApellidos" name="Apellidos" class="form-control form-control-sm model">
                        </div>
                    </div>

                    <div class="row">
                        <div class="mb-1 col-md-4">
                            <label for="txtNroCi" class="form-label mb-1 text-muted fw-semibold">Nro CI</label>
                            <input type="text" id="txtNroCi" name="Nro CI" class="form-control form-control-sm model">
                        </div>

                        <div class="mb-1 col-md-4">
                            <label for="txtNroCel" class="form-label mb-1 text-muted fw-semibold">Nro Cel</label>
                            <input type="number" id="txtNroCel" name="Nro Cel" class="form-control form-control-sm model">
                        </div>

                        <div class="mb-1 col-md-4">
                            <label for="cboGenero" class="form-label mb-1 text-muted fw-semibold">Genero</label>
                            <select class="form-select form-select-sm" id="cboGenero">
                                <option value="1">Masculino</option>
                                <option value="0">Femenino</option>
                            </select>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnGuardarRegis" class="btn btn-sm btn-success"><i class="ti ti-device-floppy fs-16 align-middle me-1"></i>Guardar</button>
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

    <script src="jsEmpre/Clientes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
