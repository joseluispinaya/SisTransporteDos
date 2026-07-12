namespace CapaEntidad.DTOs
{
    public class PasajeroViajeDTO
    {
        public int IdBoleto { get; set; }
        public int NroAsiento { get; set; }
        public int IdPasajero { get; set; }

        public string NombreCliente { get; set; }
        public string NroCi { get; set; }

        public string CiudadOrigen { get; set; }
        public string CiudadDestino { get; set; }

        public decimal CostoPasaje { get; set; }
        public bool LlevaMenorEdad { get; set; }
        public string NroComprobante { get; set; }

        public int Estado { get; set; }
        public string EstadoTexto { get; set; }
    }
}
