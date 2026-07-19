<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="Notificaciones.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.Notificaciones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <div class="card mb-4">
                <div class="card-header border-bottom border-dashed bg-light">
                    <h5 class="card-title text-dark mb-0"><i class="ti ti-filter me-2 text-primary"></i>Criterios de Búsqueda</h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-5">
                            <label for="cboRutasTable" class="form-label fw-medium mb-1">Ruta Comercial</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted"><i class="ti ti-road"></i></span>
                                <select class="form-select border-start-0 fw-medium" id="cboRutasTable">
                                </select>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label for="cboEstadosTable" class="form-label fw-medium mb-1">Estado del Viaje</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-info"><i class="ti ti-activity"></i></span>
                                <select class="form-select border-start-0 fw-medium" id="cboEstadosTable">
                                    <option value="1">1. Programados</option>
                                    <option value="2">2. En Ruta</option>
                                    <option value="3">3. Finalizados</option>
                                    <option value="0">0. Cancelados</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <button type="button" id="btnBuscar" class="btn btn-dark w-100 rounded-pill fw-medium py-3 fs-15 fw-bold">
                                <i class="ti ti-search fs-20 align-middle me-2"></i>BUSCAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header border-bottom border-dashed bg-light d-flex flex-wrap justify-content-between align-items-center">
                    <h5 class="card-title mb-0 text-dark">
                        <i class="ti ti-layout-grid-add me-2"></i>Resultado de la consulta
                    </h5>

                    <div class="d-flex gap-3 fs-13 fw-medium mt-2 mt-sm-0">
                        <span class="d-flex align-items-center text-muted"><i class="ti ti-eye text-success me-1 fs-16"></i>Envio de Notificaciones</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle border-bottom" id="tbData" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th class="rounded-start">Ruta de Viaje</th>
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

    <div id="modalNotificacion" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabelnoti" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <%--<div class="modal-header">
                    <h5 class="modal-title" id="modalLabelnoti">Notificacion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>--%>
                <div class="modal-body">
                    <input id="txtIdViajePro" value="0" type="hidden" />
                    <div class="text-center mb-2">
                        <i class="ti ti-message-dots h1 text-info"></i>
                        <h4 class="mt-2">Notificacion</h4>
                        <p id="txtTituloSms" class="mt-2">Esperando</p>
                    </div>
                    <%--<div class="mb-1">
                        <label for="txtTituloSms" class="form-label">Titulo SMS</label>
                        <input type="text" id="txtTituloSms" class="form-control form-control-sm" readonly>
                    </div>--%>
                    <div class="mb-1">
                        <label for="txtMensaje" class="form-label">Mensaje</label>
                        <textarea class="form-control" id="txtMensaje" rows="2"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                    <button type="button" id="btnEnviarYa" class="btn btn-sm btn-success"><i class="ti ti-send fs-16 align-middle me-1"></i>Enviar</button>
                </div>
            </div>
        </div>
    </div>

    <div id="mdNotificacion" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-body p-3">
                    <div class="text-center mb-2">
                        <i class="ti ti-message-dots h1 text-info"></i>
                        <h4 class="mt-2">Notificacion</h4>
                        <p id="lblTituloPrue" class="mt-3">Esperando</p>
                    </div>

                    <%--<div class="mb-1">
                        <label for="txtTokenPushPrue" class="form-label">Token SMS</label>
                        <input type="text" id="txtTokenPushPrue" class="form-control form-control-sm">
                    </div>--%>

                    <div class="mb-3">
                        <label for="txtMensajePrueba" class="form-label">Mensaje</label>
                        <textarea class="form-control" id="txtMensajePrueba" rows="3"></textarea>
                    </div>

                    <div class="d-flex justify-content-center mb-2">
                        <button type="button" class="btn btn-sm btn-secondary me-2" data-bs-dismiss="modal">
                            <i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Cancelar
                        </button>
                        <button type="button" id="btnEnvioNotPrueba" class="btn btn-sm btn-info">
                            <i class="ti ti-send fs-16 align-middle me-1"></i>Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>

    <script src="jsEmpre/Notificaciones.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
