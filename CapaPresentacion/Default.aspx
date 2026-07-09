<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CapaPresentacion.Default" %>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Viajes Interdepartamentales | Inicio</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css">
    <link href="assets/css/default.css" rel="stylesheet" type="text/css" />
</head>
<body>

    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="assets/images/logo-dark2.png" alt="Logo Terminal">
            </a>
            <button class="navbar-toggler navbar-dark border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <!-- <li class="nav-item">
                        <a class="nav-link d-flex align-items-center" href="#"><i class="ti ti-search fs-5 me-1"></i> Consultas</a>
                    </li> -->
                    <li class="nav-item ms-lg-4 mt-3 mt-lg-0">
                        <a href="Login.aspx" class="btn btn-login">
                            <i class="ti ti-user-circle me-1"></i> Iniciar Sesión
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <section class="hero-section">
        <div class="container">
            <span class="badge bg-primary-subtle text-dark border border-info px-3 py-2 rounded-pill mb-3">
                <i class="ti ti-bus me-1"></i> Flotas Modernas y Seguras
            </span>
            <h1 class="display-4 fw-bold mb-3">Conectando la Amazonía <br> <span class="text-gradient">con los Andes</span></h1>
            <p class="lead mx-auto mb-5" style="max-width: 600px;">
                Adquiere tus pasajes en línea. Disfruta de un viaje cómodo con seguimiento satelital desde Riberalta hasta la sede de gobierno.
            </p>
            <button class="btn btn-info btn-lg rounded-pill px-5 fw-bold text-dark" style="background: linear-gradient(90deg, #00f2fe, #4facfe); border: none;">
                Nuestras Rutas <i class="ti ti-arrow-right ms-2"></i>
            </button>
        </div>
    </section>

    <div class="roadmap-section">
        <div class="roadmap-wrapper">
            
            <svg class="roadmap-svg" viewBox="0 0 1200 300" preserveAspectRatio="none">
                <path class="roadmap-path" d="M 145,230 L 372,70 L 600,230 L 828,70 L 1055,230" />
                <path class="roadmap-path-animated" d="M 145,230 L 372,70 L 600,230 L 828,70 L 1055,230" />
            </svg>

            <div class="roadmap-item">
                <div class="roadmap-card">
                    <div class="card-header-custom">
                        <div class="icon-box"><i class="ti ti-map-pin fs-4"></i></div>
                        <div class="badge-ver">VER</div>
                    </div>
                    <p class="city-name">Riberalta</p>
                    <p class="city-desc">Punto de partida</p>
                </div>
            </div>

            <div class="roadmap-item">
                <div class="roadmap-card">
                    <div class="card-header-custom">
                        <div class="icon-box"><i class="ti ti-trees fs-4"></i></div>
                        <div class="badge-ver">VER</div>
                    </div>
                    <p class="city-name">Santa Rosa</p>
                    <p class="city-desc">Escala Técnica</p>
                </div>
            </div>

            <div class="roadmap-item">
                <div class="roadmap-card">
                    <div class="card-header-custom">
                        <div class="icon-box"><i class="ti ti-map-pin fs-4"></i></div>
                        <div class="badge-ver">VER</div>
                    </div>
                    <p class="city-name">Rurrenabaque</p>
                    <p class="city-desc">Turismo VIP</p>
                </div>
            </div>

            <div class="roadmap-item">
                <div class="roadmap-card">
                    <div class="card-header-custom">
                        <div class="icon-box"><i class="ti ti-mountain fs-4"></i></div>
                        <div class="badge-ver">VER</div>
                    </div>
                    <p class="city-name">Caranavi</p>
                    <p class="city-desc">Entrada a los Yungas</p>
                </div>
            </div>

            <div class="roadmap-item">
                <div class="roadmap-card">
                    <div class="card-header-custom">
                        <div class="icon-box"><i class="ti ti-building-skyscraper fs-4"></i></div>
                        <div class="badge-ver">VER</div>
                    </div>
                    <p class="city-name">La Paz</p>
                    <p class="city-desc">Destino Final</p>
                </div>
            </div>

        </div>
    </div>

    <section class="container mt-5 pt-5 mb-5">
        <div class="row g-5">
            
            <div class="col-lg-5 position-relative vertical-timeline-container">
                <div class="vertical-line"></div>
                
                <div class="v-timeline-item">
                    <div class="v-timeline-dot cyan-dot"></div>
                    <div class="v-timeline-card cyan-card">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="mb-0 text-cyan fw-bold" style="letter-spacing: 0.5px;">TERMINAL I: RIBERALTA</h6>
                                <span class="badge badge-custom badge-cyan mt-2"><i class="ti ti-point-filled"></i> DIARIO</span>
                            </div>
                            <h4 class="mb-0 text-cyan fw-bold">NORMAL</h4>
                        </div>
                        <p class="text-gray small mb-0 mt-3">Nuestro servicio económico con salidas diarias. Cuenta con asientos reclinables, ideal para tramos cortos con total seguridad.</p>
                    </div>
                </div>

                <div class="v-timeline-item">
                    <div class="v-timeline-dot orange-dot"></div>
                    <div class="v-timeline-card orange-card">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="mb-0 text-orange fw-bold" style="letter-spacing: 0.5px;">TERMINAL II: SANTA ROSA</h6>
                                <span class="badge badge-custom badge-orange mt-2"><i class="ti ti-clock"></i> 19:30 HRS</span>
                            </div>
                            <div class="text-end">
                                <h4 class="mb-0 text-white fw-bold">SEMI CAMA</h4>
                                <small class="text-gray" style="font-size: 11px;">o Normal</small>
                            </div>
                        </div>
                        <p class="text-gray small mb-0 mt-3">Mayor confort para tus viajes interdepartamentales con asientos reclinables a 140 grados, aire acondicionado y calefacción.</p>
                    </div>
                </div>
                
                <div class="v-timeline-item">
                    <div class="v-timeline-dot blues-dot"></div>
                    <div class="v-timeline-card blues-card">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0 text-primary fw-bold" style="letter-spacing: 0.5px;">TERMINAL III: RURRENABAQUE</h6>
                            <div class="text-end">
                                <h4 class="mb-0 text-white fw-bold">Bs 120</h4>
                                <small class="text-gray" style="font-size: 11px;">Boleto Leito</small>
                            </div>
                        </div>
                        <p class="text-gray small mb-0 mt-2">Servicio premium nocturno. Asientos tipo cama a 160°, mantas, refrigerio y la máxima comodidad garantizada hasta tu destino.</p>
                    </div>
                </div>
                
                <div class="v-timeline-item">
                    <div class="v-timeline-dot gray-dot"></div>
                    <div class="v-timeline-card gray-card">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0 text-danger fw-bold" style="letter-spacing: 0.5px;">TERMINAL IV: CARANAVI</h6>
                            <div class="text-end">
                                <h4 class="mb-0 text-white fw-bold">Bs 150</h4>
                                <small class="text-gray" style="font-size: 11px;">Leito VIP</small>
                            </div>
                        </div>
                        <p class="text-gray small mb-0 mt-2">La experiencia definitiva de viaje. Asientos individuales reclinables a 180°, servicio a bordo y atención personalizada.</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-7 ps-lg-5 mt-5 mt-lg-0">
                <div class="support-badge">
                    <i class="ti ti-heart"></i> Viaja con Nosotros
                </div>
                
                <h1 class="display-4 fw-bold mb-4">Tu Comodidad es <span class="text-highlight-orange">nuestra ruta</span></h1>
                
                <p class="text-secondary fs-5 mb-5 lh-base">
                    Conectamos los mejores destinos con una flota <strong class="text-white">moderna, segura y <br> puntual</strong>. Disfruta de un viaje placentero mientras nosotros <br> nos encargamos de llevarte con bien a tu destino.
                </p>

                <ul class="list-unstyled support-list mb-5">
                    <li class="mb-4 d-flex align-items-start">
                        <i class="ti ti-check text-cyan fs-4 me-3"></i>
                        <span class="text-white fs-6">Contamos con salidas diarias y <span class="text-cyan">horarios flexibles</span> para ti.</span>
                    </li>
                    <li class="mb-4 d-flex align-items-start">
                        <i class="ti ti-check text-success fs-4 me-3"></i>
                        <span class="text-white fs-6">Diferentes niveles de confort: <span class="text-success">Normal, Semi Cama y Leito</span>.</span>
                    </li>
                    <li class="mb-4 d-flex align-items-start">
                        <i class="ti ti-check text-highlight-orange fs-4 me-3"></i>
                        <span class="text-white fs-6">Conductores profesionales y <span class="text-highlight-orange">monitoreo GPS</span> en ruta.</span>
                    </li>
                </ul>

                <div class="d-flex align-items-center mb-2">
                    <div class="green-dot-small me-2"></div>
                    <small class="text-gray">Lo que dicen nuestros pasajeros</small>
                </div>
                
                <div class="contribution-card p-4 rounded-4 mb-2">
                    <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                        <div>
                            <span class="text-cyan fw-bold fs-5">Carlos Mendoza</span>
                            <span class="text-gray ms-2" style="font-size: 13px;">Viajó en</span>
                            <span class="text-highlight-orange fw-bold ms-2 fs-5">Leito VIP</span>
                        </div>
                        <span class="text-gray mt-2 mt-sm-0" style="font-size: 11px; letter-spacing: 1px;">#VIAJEROFRECUENTE</span>
                    </div>
                    <p class="text-gray mb-0 small fst-italic">"Excelente servicio, el bus salió a la hora exacta y pude descansar cómodamente todo el viaje."</p>
                </div>
                <small class="text-gray" style="font-size: 12px;">Compra tus pasajes hoy y sé nuestro próximo pasajero.</small>
            </div>

        </div>
    </section>

    <footer class="py-4 text-center mt-5" style="border-top: 1px solid rgba(255,255,255,0.05);">
        <p class="text-secondary mb-0">© 2026 Sistema de Control de Viajes. Todos los derechos reservados.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
