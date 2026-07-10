namespace CapaEntidad.DTOs
{
    public class BusesDTO
    {
        public int IdBus { get; set; }
        public int IdEmpresa { get; set; }
        public string Placa { get; set; }
        public int IdTipoBus { get; set; }
        public int IdChofer { get; set; }
        public int CapacidadAsientos { get; set; }
        public string NombreTipo { get; set; }
        public string NroCi { get; set; }
        public string NombreCompleto { get; set; }
        public bool Estado { get; set; }
    }
}
