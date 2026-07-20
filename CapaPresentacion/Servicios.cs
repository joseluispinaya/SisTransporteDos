using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace CapaPresentacion
{
    public class Servicios
    {
        private static readonly string UrlBase = "https://localhost:44325/api";

        // REGLA DE ORO: HttpClient debe ser estático y de solo lectura.
        // Instanciar un HttpClient nuevo por cada petición puede agotar los sockets del servidor (Socket Exhaustion).
        private static readonly HttpClient _httpClient = new HttpClient();

        #region "PATRON SINGLETON"
        private static Servicios _instancia = null;

        private Servicios() { }

        public static Servicios GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Servicios();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<List<EChofer>> ListaChoferesServicio(int idEmpresa)
        {
            // 1. Preparamos una respuesta por defecto en caso de que la API esté caída
            Respuesta<List<EChofer>> rpt = new Respuesta<List<EChofer>>()
            {
                Estado = false,
                Data = new List<EChofer>(),
                Mensaje = "Error desconocido al intentar conectar con la API."
            };

            try
            {
                // 2. Construimos la URL agregando el parámetro GET que espera tu [FromUri]
                // (Asumo que el controlador tiene el prefijo "conductores" según tu código JS anterior)
                string url = $"{UrlBase}/conductores/listaChoferes?idEmpresa={idEmpresa}";

                // 3. Ejecutamos la petición GET. 
                // Usamos GetAwaiter().GetResult() porque tu WebMethod llamador es síncrono.
                var response = _httpClient.GetAsync(url).GetAwaiter().GetResult();

                if (response.IsSuccessStatusCode)
                {
                    // 4. Leemos el contenido JSON que devolvió la API
                    string jsonResponse = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    // 5. ¡La magia de Newtonsoft! Deserializa el JSON exactamente a la estructura de tu clase Respuesta genérica
                    rpt = JsonConvert.DeserializeObject<Respuesta<List<EChofer>>>(jsonResponse);
                }
                else
                {
                    rpt.Mensaje = $"El servidor API rechazó la solicitud. Código HTTP: {(int)response.StatusCode}";
                }
            }
            catch (Exception)
            {
                // Aquí podrías guardar 'ex.Message' en un archivo de log de texto para ti como desarrollador.
                // Console.WriteLine(ex.Message); // Ejemplo

                rpt.Estado = false;
                // Mensaje amigable y profesional para el cliente final
                rpt.Mensaje = "No se pudo establecer conexión con el servidor principal de la API. Por favor, verifique su conexión o intente nuevamente más tarde.";
            }

            return rpt;
        }

        public Respuesta<List<BusesDTO>> ListaBusesServicio(int idEmpresa)
        {
            // 1. Preparamos una respuesta por defecto en caso de que la API esté caída
            Respuesta<List<BusesDTO>> rpt = new Respuesta<List<BusesDTO>>()
            {
                Estado = false,
                Data = new List<BusesDTO>(),
                Mensaje = "Error desconocido al intentar conectar con la API."
            };

            try
            {
                // 2. Construimos la URL agregando el parámetro GET que espera tu [FromUri]
                // (Asumo que el controlador tiene el prefijo "conductores" según tu código JS anterior)
                string url = $"{UrlBase}/buses/listaBuses?idEmpresa={idEmpresa}";

                // 3. Ejecutamos la petición GET. 
                // Usamos GetAwaiter().GetResult() porque tu WebMethod llamador es síncrono.
                var response = _httpClient.GetAsync(url).GetAwaiter().GetResult();

                if (response.IsSuccessStatusCode)
                {
                    // 4. Leemos el contenido JSON que devolvió la API
                    string jsonResponse = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    // 5. ¡La magia de Newtonsoft! Deserializa el JSON exactamente a la estructura de tu clase Respuesta genérica
                    rpt = JsonConvert.DeserializeObject<Respuesta<List<BusesDTO>>>(jsonResponse);
                }
                else
                {
                    rpt.Mensaje = $"El servidor API rechazó la solicitud. Código HTTP: {(int)response.StatusCode}";
                }
            }
            catch (Exception)
            {
                // Aquí podrías guardar 'ex.Message' en un archivo de log de texto para ti como desarrollador.
                // Console.WriteLine(ex.Message); // Ejemplo

                rpt.Estado = false;
                // Mensaje amigable y profesional para el cliente final
                rpt.Mensaje = "No se pudo establecer conexión con el servidor principal de la API. Por favor, verifique su conexión o intente nuevamente más tarde.";
            }

            return rpt;
        }

    }
}