namespace CapaEntidad.DTOs
{
    public class ClienteDTO
    {
        public int IdCliente { get; set; }
        public string NroCi { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public char Genero { get; set; }
        public string Celular { get; set; }
        // --- Propiedades extra para DataTables Server-Side ---
        public int TotalRegistros { get; set; }
        public int TotalFiltrados { get; set; }
    }
}
