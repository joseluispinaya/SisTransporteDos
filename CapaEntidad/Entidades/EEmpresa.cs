namespace CapaEntidad.Entidades
{
    public class EEmpresa
    {
        public int IdEmpresa { get; set; }
        public string RazonSocial { get; set; }
        public string NIT { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string LogoUrl { get; set; }
        public bool Estado { get; set; }
    }
}
