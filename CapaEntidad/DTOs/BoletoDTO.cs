namespace CapaEntidad.DTOs
{
    public class BoletoDTO
    {
        public int IdViaje { get; set; }
        public int IdEmpresa { get; set; }
        public int IdDestino { get; set; }
        public int IdPasajero { get; set; }
        public bool LlevaMenorEdad { get; set; }
        public int NroAsiento { get; set; }
        public decimal CostoPasaje { get; set; }
        public int Estado { get; set; }
    }
}
