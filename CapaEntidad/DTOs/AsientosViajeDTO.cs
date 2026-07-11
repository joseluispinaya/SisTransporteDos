namespace CapaEntidad.DTOs
{
    public class AsientosViajeDTO
    {
        public int IdBoleto { get; set; }
        public int NroAsiento { get; set; }
        public int Estado { get; set; }
        public bool LlevaMenorEdad { get; set; }
        public string NombrePasajero { get; set; }
        public string CIPasajero { get; set; }
    }
}
