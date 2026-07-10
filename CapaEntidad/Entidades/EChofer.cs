namespace CapaEntidad.Entidades
{
    public class EChofer
    {
        public int IdChofer { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreCompleto { get; set; }
        public string NroCi { get; set; }
        public string Celular { get; set; }
        public string NroLicencia { get; set; }
        public string TipoSangre { get; set; }
        public bool Estado { get; set; }
    }
}
