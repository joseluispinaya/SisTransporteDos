namespace CapaEntidad.DTOs
{
    public class EncomiendaImpresionDTO
    {
        public int IdEncomienda { get; set; }
        public string NroComprobante { get; set; }
        public string TipoTransaccion { get; set; }

        public string CIRemitente { get; set; }
        public string NombreRemitente { get; set; }
        public string CelularRemitente { get; set; }

        public string CIDestinatario { get; set; }
        public string NombreDestinatario { get; set; }
        public string CelularDestinatario { get; set; }

        public string CiudadOrigen { get; set; }
        public string CiudadDestino { get; set; }

        public string FechaSalidaStr { get; set; }
        public string HoraSalidaStr { get; set; }

        public string TipoBus { get; set; }
        public string PlacaBus { get; set; }

        public string Detalle { get; set; }
        public decimal PesoKg { get; set; }
        public decimal MontoCobrado { get; set; }
    }
}
