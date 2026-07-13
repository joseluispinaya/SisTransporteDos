<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="RecepcionesEnco.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.RecepcionesEnco" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/css/encomiendas.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4 border border-primary" role="alert">
        <div class="d-flex align-items-center">
            <i class="ti ti-package fs-32 me-3"></i>
            <div>
                <h4 class="alert-heading mb-1 fw-bold">Recepción de Encomiendas</h4>
                <p class="mb-0">Registro, facturación y despacho de carga y paquetería.</p>
            </div>
        </div>
        <div class="mt-2 mt-sm-0 text-end">
            <span class="badge bg-white text-primary fs-14 px-3 py-2 border border-primary shadow-sm">
                <i class="ti ti-map-pin me-1"></i> Origen: Riberalta
            </span>
        </div>
    </div>

    <div class="row">
        <div class="col-xl-3 mb-4 mb-xl-0">
            <div class="card">
                <div class="card-header border-bottom border-dashed bg-light">
                    <h5 class="card-title mb-0 d-flex justify-content-between align-items-center text-dark">
                        <span><i class="ti ti-bus-stop me-2"></i>Salidas</span>
                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Riberalta</span>
                    </h5>
                </div>
                <div class="card-body p-0">
                    <div class="list-group list-group-flush" id="listaViajesDisponibles">
                        </div>
                </div>
            </div>
        </div>

        <div class="col-xl-9">
            
            <div id="panelEsperando" class="card d-flex align-items-center justify-content-center bg-light-subtle">
                <div class="text-center text-muted py-5">
                    <i class="ti ti-box fs-48 mb-2 opacity-50"></i>
                    <p class="fs-16 fw-medium">Seleccione una salida de la lista para registrar la encomienda.</p>
                </div>
            </div>

            <div id="panelEncomienda" class="card border-primary border-2 d-none">
                <div class="card-header border-bottom border-dashed bg-primary-subtle">
                    <h5 id="lblRuta" class="card-title mb-0 fw-bold">Registrando encomienda para...</h5>
                </div>
                
                <div class="card-body">
                    <div class="row g-3 mb-2">
                        <div class="col-md-6">
                            <label class="form-label fw-bold mb-1 text-dark"><i class="ti ti-user-up text-primary me-1"></i> Remitente (Quien envía) <span class="text-danger">*</span></label>
                            <div class="input-group shadow-sm">
                                <select id="cboRemitente" class="form-control select2">
                                    <option value="">Buscar Remitente...</option>
                                </select>
                                <%--<button id="btnAddRemitente" type="button" class="btn btn-primary border-start-0" title="Nuevo Remitente">
                                    <i class="ti ti-user-plus"></i>
                                </button>--%>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-bold mb-1 text-dark"><i class="ti ti-user-down text-info me-1"></i> Destinatario (Quien recibe) <span class="text-danger">*</span></label>
                            <div class="input-group shadow-sm">
                                <select id="cboDestinatario" class="form-control select2">
                                    <option value="">Buscar Destinatario...</option>
                                </select>
                                <%--<button id="btnAddDestinatario" type="button" class="btn btn-info text-white border-start-0" title="Nuevo Destinatario">
                                    <i class="ti ti-user-plus"></i>
                                </button>--%>
                            </div>
                        </div>
                    </div>

                    <hr class="border-secondary border-opacity-25 border-dashed my-3">

                    <div class="row g-3 mb-3">
                        <div class="col-md-4">
                            <label class="form-label fw-medium mb-1">Ciudad Destino <span class="text-danger">*</span></label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-light"><i class="ti ti-map-pin text-muted"></i></span>
                                <select class="form-select border-start-0" id="cboDestino"></select>
                            </div>
                        </div>

                        <div class="col-md-5">
                            <label class="form-label fw-medium mb-1">Detalle del Contenido <span class="text-danger">*</span></label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-light"><i class="ti ti-file-description text-muted"></i></span>
                                <input type="text" id="txtDetalle" class="form-control border-start-0" placeholder="Ej: 1 Caja grande de zapatos, 2 Sobres...">
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label fw-medium mb-1">Peso Exacto <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="number" id="txtPeso" class="form-control text-center fw-bold text-dark fs-15" placeholder="0.00" min="0.1" step="0.1">
                                <span class="input-group-text bg-light text-muted fw-bold">Kg.</span>
                            </div>
                        </div>
                    </div>

                    <div class="row align-items-center bg-light border border-dashed rounded p-2 shadow-sm">
                        
                        <div class="col-md-3 mb-3 mb-md-0 border-end border-dashed">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-1">Tipo de Tarifa</label>
                            <div class="form-check custom-radio mb-1">
                                <input class="form-check-input" type="radio" name="radioTipoTarifa" id="tarifaPeso" value="peso" checked>
                                <label class="form-check-label fw-bold text-dark" for="tarifaPeso">
                                    <i class="ti ti-scale me-1"></i>Por Peso
                                </label>
                            </div>
                            <div class="form-check custom-radio">
                                <input class="form-check-input" type="radio" name="radioTipoTarifa" id="tarifaManual" value="manual">
                                <label class="form-check-label fw-bold text-primary" for="tarifaManual">
                                    <i class="ti ti-mail me-1"></i>Manual
                                </label>
                            </div>
                        </div>

                        <div class="col-md-3 mb-3 mb-md-0">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-1">Estado del Pago</label>
                            <div class="form-check custom-radio mb-1">
                                <input class="form-check-input" type="radio" name="radioEstadoPago" id="pagoPagado" value="1" checked>
                                <label class="form-check-label fw-bold text-success" for="pagoPagado">
                                    <i class="ti ti-cash me-1"></i>Pagado
                                </label>
                            </div>

                            <div class="form-check custom-radio">
                                <input class="form-check-input" type="radio" name="radioEstadoPago" id="pagoPorCobrar" value="2">
                                <label class="form-check-label fw-bold text-warning" for="pagoPorCobrar">
                                    <i class="ti ti-truck-delivery me-1"></i>Por Cobrar
                                </label>
                            </div>
                        </div>


                        <div class="col-md-3 mb-3 mb-md-0">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-1" id="lblTituloMonto">Monto Calculado</label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-success text-white border-success fw-bold">Bs.</span>
                                <input type="number" step="0.50" min="0" class="form-control fw-bold fs-18 text-success border-success" id="txtPrecioTotal" readonly value="0.00">
                            </div>
                            <div class="form-text fs-11 mt-1 text-muted fw-medium" id="lblInfoTarifa">
                                <i class="ti ti-info-circle me-1"></i>Tarifa Bs. <span id="lblPrecioKilo">0.00</span> por Kg.
                            </div>
                        </div>

                        <div class="col-md-3 mt-3 mt-md-0">
                            <button type="button" id="btnRegistrarEncomienda" class="btn btn-primary w-100 py-3 fs-15 fw-bold shadow-none text-nowrap">
                                <i class="ti ti-check fs-20 me-2 align-middle"></i>CONFIRMAR
                            </button>
                        </div>

                    </div> 

                </div>
            </div>
        </div>
    </div>

    <div id="ticket-termico" class="d-none d-print-block text-dark">
        <div class="text-center mb-1">
            <div class="text-center mb-2" id="tck_ContenedorLogo" style="display: none;">
                <img src="../LogosEmp/logoEmp.jpg" id="tck_EmpresaLogo" alt="Logo" style="max-width: 130px; height: auto; object-fit: contain;" />
            </div>
            <h4 class="fw-bolder mb-0 text-dark text-uppercase" id="tck_EmpresaNombre">EMPRESA DE TRANSPORTE</h4>
            <p class="mb-0 fs-12 text-dark" id="tck_EmpresaDetalle">NIT: -- | Tel: --</p>
            <p class="mb-0 fs-11 text-muted text-wrap" id="tck_EmpresaDireccion" style="line-height: 1.2;">Dirección...</p>
            <span class="fs-12 fw-bold d-block mt-1">Terminal de Salida: Riberalta</span>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="text-center mb-2">
            <h5 class="fw-bold mb-0 text-dark" id="tck_Tipo">GUÍA DE ENCOMIENDA</h5>
            <span class="fs-14 fw-bolder" id="tck_Comprobante">ENC-000000</span>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="fs-13">
            <div class="d-flex justify-content-between"><span class="fw-bold">Fecha Envío:</span><span id="tck_Fecha">--/--/----</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Hora Salida:</span><span id="tck_Hora">--:--</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Tipo Bus:</span><span id="tck_Bus">----</span></div>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="d-flex justify-content-center gap-2 fs-14 fw-bolder text-uppercase">
            <span id="tck_Origen">---</span><i class="ti ti-arrow-narrow-right fs-13"></i><span id="tck_Destino">---</span>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="fs-13">
            <div class="mb-1"><span class="fw-bold">REMITENTE:</span></div>
            <div class="ps-2 mb-2 text-wrap">
                <span id="tck_Remitente" class="d-block text-uppercase">----</span>
                <span class="text-muted fs-12">CI: <span id="tck_CIRemitente">---</span></span>
            </div>

            <div class="mb-1"><span class="fw-bold">DESTINATARIO:</span></div>
            <div class="ps-2 text-wrap">
                <span id="tck_Destinatario" class="d-block text-uppercase">----</span>
                <span class="text-muted fs-12">CI: <span id="tck_CIDestinatario">---</span> | Telf: <span id="tck_CelDestinatario">---</span></span>
            </div>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="fs-13">
            <span class="fw-bold d-block mb-1">CONTENIDO:</span>
            <p class="text-wrap ps-2 mb-1 text-uppercase" id="tck_Detalle" style="line-height: 1.2;">---</p>
            <div class="d-flex justify-content-between px-2 bg-light border border-dashed rounded py-1 mt-2">
                <span class="fw-bold text-dark">PESO REGISTRADO:</span>
                <span class="fw-bolder text-dark"><span id="tck_Peso">0.00</span> Kg.</span>
            </div>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="d-flex justify-content-between align-items-center">
            <span class="fs-16 fw-bold">TOTAL NETO:</span>
            <span class="fs-16 fw-bolder">Bs. <span id="tck_Precio">0.00</span></span>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="text-center fs-11 mt-2">
            <%--<p class="mb-1">Verificar su encomienda al momento de recibirla.</p>--%>
            <p class="mb-0 fw-bold">¡Gracias por depositar su confianza en nosotros!</p>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="jsEmpre/RecepcionEnco.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
