namespace CapaEntidad.DTOs
{
    public class TarifasDTO
    {
        public int IdTarifa { get; set; }
        public int IdEmpresa { get; set; }
        public int IdOrigen { get; set; }
        public int IdDestino { get; set; }
        public int IdTipoBus { get; set; }
        public decimal PrecioPasaje { get; set; }
        public decimal PrecioKiloEncomienda { get; set; }
        public string CiudadOrigen { get; set; }
        public string CiudadDestino { get; set; }
        public string NombreTipo { get; set; }
        public bool Estado { get; set; }
    }
}
