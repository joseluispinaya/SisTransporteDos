namespace CapaEntidad.Entidades
{
    public class EViaje
    {
        public int IdViaje { get; set; }
        public int IdEmpresa { get; set; }
        public int IdRuta { get; set; }
        public int IdBus { get; set; }

        // Reciben el JSON crudo del frontend
        public string FechaSalidaStr { get; set; } // Ej: "03/05/2026"
        public string HoraSalidaStr { get; set; }  // Ej: "18:30"
    }
}
