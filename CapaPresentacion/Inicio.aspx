<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Inicio.aspx.cs" Inherits="CapaPresentacion.Inicio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/css/inicioze.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
    <!-- BANNER HERO (Imagen de Portada) -->
    <div class="col-12 mb-4 mt-3">
        <div class="inicio-hero-card shadow-lg">
            <img src="Imagenes/portadaApp.jpg" class="inicio-hero-img" alt="Flota conectando destinos">
            <div class="inicio-hero-overlay">
                <h1 class="text-white fw-bolder display-5 mb-2" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Sistema de Administración
                </h1>
                <p class="text-white-50 fs-18 fw-medium mb-0" style="max-width: 600px;">
                    Control total de rutas, terminales y boletaje. Conectando la Amazonía con todo el país.
                </p>
            </div>
        </div>
    </div>
</div>

<div class="row align-items-center mb-4">

    <!-- COLUMNA IZQUIERDA: Timeline de Terminales (Diseño oscuro/neón) -->
    <div class="col-lg-5 col-md-6 mb-4 mb-md-0">
        <div class="inicio-timeline">

            <!-- Tarjeta 1: Riberalta -->
            <div class="inicio-timeline-item">
                <div class="inicio-timeline-indicator bg-info"></div>
                <div class="card shadow-none inicio-service-card card-border-cyan">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="text-info mb-0 fw-bold">TERMINAL I: RIBERALTA</h5>
                            <span class="fs-18 fw-bolder text-info">NORMAL</span>
                        </div>
                        <span class="badge bg-soft-info text-info mb-3 rounded-pill">
                            <i class="ti ti-calendar-event me-1"></i>DIARIO
                        </span>
                        <p class="text-muted fs-14 mb-0">
                            Nuestro servicio económico con salidas diarias. Cuenta con asientos reclinables, ideal para tramos cortos con total seguridad.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tarjeta 2: Santa Rosa -->
            <div class="inicio-timeline-item">
                <div class="inicio-timeline-indicator bg-warning"></div>
                <div class="card shadow-none inicio-service-card card-border-orange">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="text-warning mb-0 fw-bold text-truncate pe-2">TERMINAL II: SANTA ROSA</h5>
                            <span class="fs-18 fw-bolder text-body-emphasis">LEITO</span>
                        </div>
                        <span class="badge border border-warning text-warning mb-3 rounded-pill">
                            <i class="ti ti-clock me-1"></i>19:30 HRS
                        </span>
                        <p class="text-muted fs-14 mb-0">
                            Mayor confort para tus viajes interdepartamentales con asientos reclinables a 140 grados, aire acondicionado y calefacción.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- COLUMNA DERECHA: Textos Promocionales e Informativos -->
    <div class="col-lg-7 col-md-6">
        <div class="ps-lg-5 ps-md-3">

            <!-- Etiqueta superior -->
            <span class="badge border border-warning text-warning rounded-pill px-3 py-2 mb-3 fs-13 fw-semibold">
                <i class="ti ti-heart text-warning me-1"></i>Gestión y Control
            </span>

            <!-- Título Principal -->
            <h1 class="display-5 fw-bolder mb-3 text-body-emphasis lh-sm">Tu Comodidad es
                <br>
                <span class="text-warning">nuestra ruta</span>
            </h1>

            <!-- Párrafo descriptivo -->
            <p class="fs-16 text-muted mb-4 pe-lg-5">
                Conectamos los mejores destinos con una flota <span class="fw-bold text-body-emphasis">moderna, segura y puntual</span>. 
            Disfruta de la administración optimizada de nuestras rutas mientras garantizamos el mejor viaje a nuestros pasajeros.
            </p>

            <!-- Lista con Checkmarks -->
            <div class="d-flex flex-column gap-3 fs-15 text-muted">
                <div class="d-flex align-items-start">
                    <i class="ti ti-check text-info fs-22 me-2"></i>
                    <span>Supervisión de salidas diarias y <span class="text-info fw-semibold">horarios flexibles</span>.</span>
                </div>
                <div class="d-flex align-items-start">
                    <i class="ti ti-check text-success fs-22 me-2"></i>
                    <span>Diferentes niveles de confort controlados: <span class="text-success fw-semibold">Normal, Semi Cama y Leito</span>.</span>
                </div>
                <div class="d-flex align-items-start">
                    <i class="ti ti-check text-primary fs-22 me-2"></i>
                    <span>Emisión de boletos interdepartamentales en tiempo real.</span>
                </div>
            </div>

        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
</asp:Content>
