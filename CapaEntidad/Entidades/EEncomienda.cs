namespace CapaEntidad.Entidades
{
    public class EEncomienda
    {
        public int IdViaje { get; set; }
        public int IdEmpresa { get; set; }
        public int IdRemitente { get; set; }
        public int IdDestinatario { get; set; }
        public int IdDestino { get; set; }
        public string Detalle { get; set; }
        public decimal PesoKg { get; set; }
        public decimal MontoCobrado { get; set; }
        public int EstadoPago { get; set; }
    }
}
