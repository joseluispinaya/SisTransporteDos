<%@ Page Title="" Language="C#" MasterPageFile="~/MasterEmpre/EmpresasMaster.Master" AutoEventWireup="true" CodeBehind="ConsultasPasajes.aspx.cs" Inherits="CapaPresentacion.MasterEmpre.ConsultasPasajes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../assets/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="../assets/vendor/datatables/extensiones/css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />

    <style>
        .select2-container .select2-selection--single {
            height: 38px !important; /* Ajustado al tamaño estándar de Boron */
            padding: 0.35rem 0.5rem;
            border: 1px solid var(--bs-border-color);
            border-radius: var(--bs-border-radius);
        }

        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 1.5 !important;
            padding-left: 0px !important;
            color: var(--bs-body-color);
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px !important;
        }

        @media print {
            /* 1. Hacemos "transparente" todo el contenido, sin destruir el <form> de ASP.NET */
            body * {
                visibility: hidden;
            }

            /* 2. Hacemos visible ÚNICAMENTE el ticket y todo lo que esté adentro */
            #ticket-termico, #ticket-termico * {
                visibility: visible;
            }

            /* 3. Posicionamos el ticket en la esquina superior izquierda para la impresora */
            #ticket-termico {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 80mm !important;
                padding: 5mm !important;
                margin: 0 !important;
                font-family: 'Courier New', Courier, monospace !important;
                -webkit-print-color-adjust: exact; /* Fuerza a Chrome/Edge a imprimir el logo con colores/contrastes nítidos */
                print-color-adjust: exact;
            }

            /* 4. Aseguramos que los bordes punteados se impriman bien en blanco y negro */
            .border-top-dashed {
                border-top: 1.5px dashed #000 !important;
                height: 0px;
            }

            /* 5. Le decimos a Chrome/Edge el tamaño exacto del papel */
            @page {
                size: 80mm auto;
                margin: 0;
            }
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="alert alert-primary d-flex flex-wrap justify-content-between align-items-center p-3 mb-4" role="alert">
        <div class="d-flex align-items-center">
            <i class="ti ti-shield-search fs-32 me-3"></i>
            <div>
                <h4 class="alert-heading mb-1 fw-bold">Consulta de Pasajeros</h4>
                <p class="mb-0">Monitoreo de ocupación, validación de reservas y auditoría de boletos emitidos.</p>
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
                        <div class="col-md-4">
                            <label for="cboRutasTable" class="form-label fw-medium mb-1">Ruta Comercial</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted"><i class="ti ti-road"></i></span>
                                <select class="form-select border-start-0 fw-medium" id="cboRutasTable">
                                </select>
                            </div>
                        </div>

                        <div class="col-md-3">
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

                        <div class="col-md-5">
                            <label for="cboViajesDisponibles" class="form-label fw-medium mb-1">Seleccione la Salida Específica</label>
                            <select class="form-select" id="cboViajesDisponibles">
                                <%--<option value="">-- Primero elija una Ruta --</option>--%>
                            </select>
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
                        <table class="table table-hover align-middle border-bottom" id="tbAsientosVendidos" style="width: 100%">
                            <thead class="table-light">
                                <tr>
                                    <th>Pasajero y Documento</th>
                                    <th>Ruta Comercial</th>
                                    <th>Detalle Financiero & Asiento</th>
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

    <div id="modalDetalleBoleto" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalLabeldetalle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-bottom border-dashed pb-3">
                    <h5 class="modal-title d-flex align-items-center" id="modalLabeldetalle">
                        <i class="ti ti-info-square-rounded text-primary fs-22 me-2"></i>Detalles
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input id="txtIdBoleto" value="0" type="hidden" />
                    
                    <div class="mb-3">
                        <label class="form-label fw-medium">Pasajero Asignado</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted"><i class="ti ti-user"></i></span>
                            <input type="text" class="form-control bg-light fw-medium" id="txtPasajeroDetalle" readonly>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Nro. Asiento</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted"><i class="ti ti-armchair"></i></span>
                                <input type="text" class="form-control bg-light text-center fw-bold text-primary" id="txtNroAsientoModal" readonly>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Estado del Boleto</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light text-muted"><i class="ti ti-click"></i></span>
                                <input type="text" class="form-control bg-light text-center fw-bold" id="txtEstadoActual" readonly>
                            </div>
                        </div>
                    </div>

                    <div id="divAccionesReserva" class="mt-4 pt-3 border-top border-dashed d-none">
                        <h6 class="text-center text-muted fw-bold fs-11 text-uppercase mb-3">Acciones Administrativas de Reserva</h6>
                        <div class="d-flex gap-2">
                            <button type="button" id="btnConfirmarPago" class="btn btn-success flex-fill py-2 fw-medium">
                                <i class="ti ti-cash me-1 fs-16 align-middle"></i> Procesar Pago
                            </button>
                            <button type="button" id="btnAnularReserva" class="btn btn-danger flex-fill py-2 fw-medium">
                                <i class="ti ti-trash me-1 fs-16 align-middle"></i> Anular Reserva
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top border-dashed pt-3">
                    <button type="button" class="btn btn-soft-secondary" data-bs-dismiss="modal">
                        <i class="ti ti-x fs-16 align-middle me-1"></i> Cerrar Panel
                    </button>
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
            <h5 class="fw-bold mb-0 text-dark" id="tck_Tipo">BOLETO DE VIAJE</h5>
            <span class="fs-14 fw-bolder" id="tck_Comprobante">RIB-000000</span>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="fs-13">
            <div class="d-flex justify-content-between"><span class="fw-bold">Fecha Salida:</span><span id="tck_Fecha">--/--/----</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Hora Salida:</span><span id="tck_Hora">--:--</span></div>
            <div class="d-flex justify-content-between"><span class="fw-bold">Tipo Bus:</span><span id="tck_Bus">----</span></div>
        </div>

        <div class="border-top border-top-dashed border-dark my-2"></div>

        <div class="d-flex justify-content-center gap-2 fs-14 fw-bolder text-uppercase">
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
            <p class="mb-1">Presentarse 30 min. antes de la salida.</p>
            <p class="mb-0 fw-bold">¡Gracias por su preferencia, buen viaje!</p>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="../assets/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../assets/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="../assets/vendor/datatables/extensiones/js/dataTables.responsive.min.js"></script>
    <script src="jsEmpre/ConsultasPasajes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
