namespace CapaEntidad.Entidades
{
    public class EBuses
    {
        public int IdBus { get; set; }
        public int IdEmpresa { get; set; }
        public string Placa { get; set; }
        public int IdTipoBus { get; set; }
        public int IdChofer { get; set; }
        public int CapacidadAsientos { get; set; }
        public bool Estado { get; set; }
    }
}
