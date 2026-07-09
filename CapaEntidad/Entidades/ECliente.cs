namespace CapaEntidad.Entidades
{
    public class ECliente
    {
        public int IdCliente { get; set; }
        public string NroCi { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string ClaveHash { get; set; }
        public char Genero { get; set; }
        public string Celular { get; set; }
    }
}
