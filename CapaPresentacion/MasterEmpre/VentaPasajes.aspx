<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="VentaPasajes.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.VentaPasajes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/css/miestilo.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
        <div class="d-flex align-items-center">
            <i class="ti ti-ticket fs-32 me-3"></i>
            <div>
                <h4 class="alert-heading mb-1 fw-bold">Taquilla de Ventas</h4>
                <p class="mb-0">Emisión de boletos y reservas para las salidas programadas.</p>
            </div>
        </div>
        <div class="mt-2 mt-sm-0 text-end">
            <span class="badge bg-white text-primary fs-14 px-3 py-2 border border-primary">
                <i class="ti ti-map-pin me-1"></i> Origen: Riberalta
            </span>
        </div>
    </div>

    <div class="row">
        <div class="col-xl-3">
            <div class="card">
                <div class="card-header border-bottom border-dashed bg-light">
                    <h5 class="card-title mb-0 d-flex justify-content-between align-items-center text-dark">
                        <span><i class="ti ti-bus-stop text-primary me-2"></i>Salidas</span>
                        <span class="badge bg-danger-subtle text-danger">Riberalta</span>
                    </h5>
                </div>
                <div class="card-body p-0">
                    <div class="list-group list-group-flush" id="listaViajesDisponibles">
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-9">
            <div class="card">
                <div class="card-header border-bottom border-dashed bg-light d-flex flex-wrap justify-content-between align-items-center">
                    <h5 class="card-title mb-0 text-dark">
                        <i class="ti ti-layout-grid-add text-primary me-2"></i>Distribución de Asientos
                    </h5>

                    <div class="d-flex gap-3 fs-13 fw-medium mt-2 mt-sm-0">
                        <span class="d-flex align-items-center text-muted"><i class="ti ti-circle-filled text-success me-1 fs-16"></i>Libre</span>
                        <span class="d-flex align-items-center text-muted"><i class="ti ti-circle-filled text-warning me-1 fs-16"></i>Reservado</span>
                        <span class="d-flex align-items-center text-muted"><i class="ti ti-circle-filled text-danger me-1 fs-16"></i>Vendido</span>
                    </div>
                </div>
                
                <div class="card-body bg-light-subtle d-flex align-items-center justify-content-center" style="min-height: 300px;">
                    <div id="contenedorBus" class="w-100 d-flex justify-content-center" style="display: none;">
                        <div class="text-center text-muted">
                            <i class="ti ti-steering-wheel fs-48 mb-2 text-secondary opacity-50"></i>
                            <p class="fs-15">Seleccione una salida de la lista para visualizar el bus.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-4" id="panelVenta" style="display: none;">

        <div class="col-xl-3">
            <div class="card">
                <div class="card-header border-bottom border-dashed">
                    <h6 class="card-title mb-0"><i class="ti ti-settings me-1"></i> Opciones del Boleto</h6>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center border border-dashed p-2 rounded mb-3 bg-light">
                        <div>
                            <span class="d-block fw-medium text-dark fs-13"><i class="ti ti-baby-carriage me-1 text-primary"></i> Lleva bebé/menor</span>
                            <span class="fs-11 text-muted">Comparten el mismo asiento</span>
                        </div>
                        <div class="form-check form-switch form-switch-md mb-0">
                            <input type="checkbox" class="form-check-input" id="switchMenor">
                        </div>
                    </div>

                    <p class="text-muted fw-bold mb-2 fs-13">TIPO DE TRANSACCIÓN</p>
                    <div class="btn-group w-100 btn-group-toggle" role="group">
                        <input type="radio" class="btn-check" name="tipoTransaccion" id="radioVenta" autocomplete="off" checked>
                        <label class="btn btn-outline-primary fw-medium" for="radioVenta">Venta</label>

                        <input type="radio" class="btn-check" name="tipoTransaccion" id="radioReserva" autocomplete="off">
                        <label class="btn btn-outline-warning fw-medium" for="radioReserva">Reserva</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-9">
            <div class="card border-primary border-2"> <div class="card-header border-bottom border-dashed bg-primary-subtle">
                    <h5 id="lblRuta" class="card-title mb-0 fw-bold">Esperando selección...</h5>
                </div>
                
                <div class="card-body">
                    <div class="row align-items-end mb-4">
                        <div class="col-md-5 mb-3 mb-md-0">
                            <label class="form-label fw-medium mb-1">Buscar Pasajero (CI o Nombre) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <select id="cboBuscarPasajero" class="form-control select2">
                                    <option value="">Buscar...</option>
                                </select>
                                <%--<button id="btnAddClient" type="button" class="btn btn-primary" title="Registrar nuevo cliente">
                                    <i class="ti ti-user-plus"></i>
                                </button>--%>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3 mb-md-0">
                            <label class="form-label fw-medium mb-1">Nombres del Pasajero</label>
                            <input type="text" id="txtNomPasa" class="form-control bg-light" readonly placeholder="Autocompletado...">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-medium mb-1">Documento CI</label>
                            <input type="text" id="txtNroCi" class="form-control bg-light" readonly placeholder="---">
                        </div>
                    </div>
                    
                    <input id="txtIdCliente" value="0" type="hidden" />

                    <div class="row align-items-center bg-light border border-dashed rounded p-3">
                        <div class="col-md-2 mb-3 mb-md-0 text-center">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-1">Nro. Asiento</label>
                            <div class="fs-1 text-primary fw-bolder lh-1" id="lblNumeroAsientoVisual">--</div>
                            <input type="hidden" id="txtNroAsiento" value="0">
                        </div>

                        <div class="col-md-4 mb-3 mb-md-0">
                            <label class="form-label fw-medium mb-1">Destino del Pasajero <span class="text-danger">*</span></label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-white"><i class="ti ti-map-pin"></i></span>
                                <select class="form-select border-start-0" id="cboDestino"></select>
                            </div>
                        </div>

                        <div class="col-md-3 mb-3 mb-md-0">
                            <label class="form-label fw-medium mb-1">Monto a Cobrar</label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-success text-white border-success fw-bold">Bs.</span>
                                <input type="text" class="form-control fw-bold fs-16 text-success border-success" id="txtPrecio" readonly value="0.00">
                            </div>
                        </div>

                        <div class="col-md-3 mt-3 mt-md-0">
                            <button type="button" id="btnRegistrarPasaje" class="btn btn-success w-100 py-3 fs-15 fw-bold shadow-none">
                                <i class="ti ti-check fs-20 me-2 align-middle"></i>CONFIRMAR
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="ticket-termico" class="d-none d-print-block text-dark">
        <div class="text-center mb-2">
            <h4 class="fw-bolder mb-0 text-dark">TRANS FLOTA YUNGUEÑA</h4>
            <p class="mb-0"><span class="fs-12 fw-bold">Sucursal : </span>Riberalta</p>
            <span class="fs-12">Sistema de Boletos</span>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="text-center mb-2">
            <h5 class="fw-bold mb-0 text-dark" id="tck_Tipo">BOLETO DE VIAJE</h5>
            <span class="fs-14 fw-medium" id="tck_Comprobante">RIB-000000</span>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="fs-13">
            <div class="d-flex justify-content-between"><span class="fw-bold">Fecha Salida:</span><span id="tck_Fecha">--/--/----</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Hora Salida:</span><span id="tck_Hora">--:--</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Tipo Bus:</span><span id="tck_Bus">----</span></div>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="d-flex justify-content-center gap-2 fs-14 fw-bolder">
            <span id="tck_Origen">---</span><i class="ti ti-arrow-narrow-right fs-13"></i><span id="tck_Destino">---</span>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="fs-13">
            <div class="d-flex justify-content-between"><span class="fw-bold">Pasajero:</span><span id="tck_Pasajero">----</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Nro. CI:</span><span id="tck_CI">---</span></div>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fs-16 fw-bold">ASIENTO:</span><span class="fs-16 fw-bolder" id="tck_Asiento">00</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
            <span class="fs-16 fw-bold">TOTAL:</span><span class="fs-16 fw-bolder">Bs. <span id="tck_Precio">0.00</span></span>
        </div>
        <div class="border-top border-top-dashed border-dark my-2"></div>
        <div class="text-center fs-11 mt-2">
            <p class="mb-1">Presentarse 30 min. antes.</p>
            <p class="mb-0 fw-bold">¡Buen viaje!</p>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="jsEmpre/VentaPasajes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
