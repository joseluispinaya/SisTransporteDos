<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="OpcionesViaje.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.OpcionesViaje" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
        <div class="d-flex align-items-center">
            <i class="ti ti-shield-search fs-32 me-3"></i>
            <div>
                <h4 class="alert-heading mb-1 fw-bold">Consulta de Pasajeros por Viaje</h4>
                <p class="mb-0">Seleccione una ruta y estado para ver un detalle de viajes programados.</p>
            </div>
        </div>
    </div>

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
                <div class="card-header border-bottom border-dashed bg-light">
                    <h5 id="lblRuta" class="card-title text-primary mb-0 fw-bold">Esperando selección de salida...</h5>
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

    <div id="modalDetalleOpcion" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabeldetalle" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabeldetalle">Detalles</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input id="txtIdViajePro" value="0" type="hidden" />

                    <div class="row">
                        <div class="mb-2 col-md-6">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text"><i class="ti ti-bus me-1"></i>Bus</span>
                                <input type="text" class="form-control bg-light" id="txtPlacaDetalle" readonly>
                            </div>
                        </div>

                        <div class="mb-2 col-md-6">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text"><i class="ti ti-armchair me-1"></i>Tipo</span>
                                <input type="text" class="form-control bg-light text-center" id="txtTipoBus" readonly>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="mb-2 col-md-6">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text"><i class="ti ti-calendar-event me-1"></i>Salida</span>
                                <input type="text" class="form-control bg-light text-center" id="txtFechaSa" readonly>
                            </div>
                        </div>

                        <div class="mb-2 col-md-6">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text"><i class="ti ti-activity"></i></span>
                                <input type="text" class="form-control bg-light text-center" id="txtEstadoActual" readonly>
                            </div>
                        </div>
                    </div>

                    <div id="divAccionesProgra" class="mt-3 pt-3 border-top border-dashed d-none">
                        <h5 class="text-center text-muted fs-12 mb-2">Acciones de Viaje</h5>
                        <div class="d-flex justify-content-center">
                            <button type="button" id="btnEnRuta" class="btn btn-success flex-fill"><i class="ti ti-road me-1"></i>En Ruta</button>
                        </div>
                    </div>

                    <div id="divAccionesRuta" class="mt-3 pt-3 border-top border-dashed d-none">
                        <h5 class="text-center text-muted fs-12 mb-2">Acciones de Viaje</h5>
                        <div class="d-flex justify-content-center">
                            <button type="button" id="btnFinalizar" class="btn btn-danger flex-fill"><i class="ti ti-trash me-1"></i>Finalizar</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal"><i class="ti ti-square-rounded-x fs-16 align-middle me-1"></i>Salir</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

    <script src="jsEmpre/OpcionesViaje.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
