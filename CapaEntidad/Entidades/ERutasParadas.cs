namespace CapaEntidad.Entidades
{
    public class ERutasParadas
    {
        public int IdRutaParada { get; set; }
        public int IdEmpresa { get; set; }
        public int IdRuta { get; set; }
        public int IdCiudad { get; set; }
        public string NombreCiudad { get; set; }
        public int Orden { get; set; }
    }
}
