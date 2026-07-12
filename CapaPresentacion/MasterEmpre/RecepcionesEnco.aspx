<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="RecepcionesEnco.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.RecepcionesEnco" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        /* Ajustes para Select2 en el Theme Boron */
        .select2-container .select2-selection--single {
            height: 39px !important;
            padding: 0.35rem 0.5rem;
            border: 1px solid var(--bs-border-color);
            border-radius: var(--bs-border-radius);
            background-color: var(--bs-light);
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 1.6 !important;
            padding-left: 0px !important;
            color: var(--bs-body-color);
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 37px !important;
        }

        /* Efecto Neobrutalista para la Lista de Viajes */
        .viaje-item {
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border-left: 4px solid transparent !important;
        }
        .viaje-item:hover {
            background-color: var(--bs-secondary-bg-subtle);
            border-left-color: var(--bs-primary) !important;
        }
        .viaje-item.active {
            background-color: var(--bs-primary-bg-subtle);
            border-left-color: var(--bs-primary) !important;
        }
    </style>
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
                        <span><i class="ti ti-bus-stop text-primary me-2"></i>Salidas</span>
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
                    <h5 id="lblRuta" class="card-title text-primary mb-0 fw-bold">Registrando encomienda para...</h5>
                </div>
                
                <div class="card-body">
                    <div class="row g-3 mb-3">
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

                    <hr class="border-secondary border-opacity-25 border-dashed my-4">

                    <div class="row g-3 mb-4">
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
                        
                        <div class="col-md-5 mb-3 mb-md-0">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-2">Estado del Pago</label>
                            <div class="d-flex gap-4">
                                <div class="form-check custom-radio">
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
                        </div>

                        <div class="col-md-4 mb-3 mb-md-0">
                            <label class="form-label text-muted fs-12 fw-bold text-uppercase mb-1">Monto Calculado</label>
                            <div class="input-group flex-nowrap">
                                <span class="input-group-text bg-success text-white border-success fw-bold">Bs.</span>
                                <input type="text" class="form-control fw-bold fs-18 text-success border-success" id="txtPrecioTotal" readonly value="0.00">
                            </div>
                            <div class="form-text fs-11 mt-1 text-muted fw-medium">
                                <i class="ti ti-info-circle me-1"></i> Tarifa: Bs. <span id="lblPrecioKilo">0.00</span> por Kg.
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
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="jsEmpre/RecepcionEnco.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
