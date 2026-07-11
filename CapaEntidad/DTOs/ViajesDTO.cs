namespace CapaEntidad.DTOs
{
    public class ViajesDTO
    {
        public int IdViaje { get; set; }
        public int IdRuta { get; set; }
        public string NombreRuta { get; set; }
        public int IdBus { get; set; }
        public string PlacaBus { get; set; }
        public string TipoBus { get; set; }
        public int IdTipoBus { get; set; }
        public int CapacidadAsientos { get; set; }

        // Reciben el JSON crudo del frontend
        public string FechaSalidaStr { get; set; } // Ej: "03/05/2026"
        public string HoraSalidaStr { get; set; }  // Ej: "18:30"
        public int Estado { get; set; }
        public string EstadoTexto { get; set; }
    }
}
