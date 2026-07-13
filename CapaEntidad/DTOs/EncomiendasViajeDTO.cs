namespace CapaEntidad.DTOs
{
    public class EncomiendasViajeDTO
    {
        public int IdEncomienda { get; set; }
        public string NroComprobante { get; set; }

        public string NombreRemitente { get; set; }
        public string CIRemitente { get; set; }

        public string NombreDestinatario { get; set; }
        public string CIDestinatario { get; set; }
        public string CelularDestinatario { get; set; }

        public string CiudadOrigen { get; set; }
        public string CiudadDestino { get; set; }

        public string Detalle { get; set; }
        public decimal PesoKg { get; set; }
        public decimal MontoCobrado { get; set; }
        public int EstadoPago { get; set; }
        public string EstadoPagoTexto { get; set; }
        public int EstadoEnvio { get; set; }
        public string EstadoEnvioTexto { get; set; }

    }
}
