namespace CapaEntidad.DTOs
{
    public class BoletoImpresionDTO
    {
        public int IdBoleto { get; set; }
        public string NroComprobante { get; set; }

        public string EmpresaNombre { get; set; }
        public string EmpresaNIT { get; set; }
        public string EmpresaDireccion { get; set; }
        public string EmpresaTelefono { get; set; }
        public string EmpresaLogoUrl { get; set; }

        public int Estado { get; set; }
        public string TipoTransaccion { get; set; }

        public string CIPasajero { get; set; }
        public string NombrePasajero { get; set; }

        public string CiudadOrigen { get; set; }
        public string CiudadDestino { get; set; }

        public string FechaSalidaStr { get; set; }
        public string HoraSalidaStr { get; set; }

        public string TipoBus { get; set; }
        public string PlacaBus { get; set; }
        public int NroAsiento { get; set; }

        public bool LlevaMenorEdad { get; set; }
        public decimal CostoPasaje { get; set; }
    }
}
