using CapaEntidad.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace CapaPresentacion
{
    public class Utilidades
    {
        #region "PATRON SINGLETON"
        private static Utilidades _instancia = null;

        private Utilidades()
        {

        }

        public static Utilidades GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Utilidades();
            }
            return _instancia;
        }
        #endregion

        public string UploadPhoto(MemoryStream stream, string folder)
        {
            string rutaa = "";

            try
            {
                stream.Position = 0;

                var guid = Guid.NewGuid().ToString();
                var file = $"{guid}.jpg";

                var fullPath = $"{folder}{file}";
                var path = Path.Combine(HttpContext.Current.Server.MapPath(folder), file);

                // Guardar la imagen en el sistema de archivos
                File.WriteAllBytes(path, stream.ToArray());

                // Verificar si el archivo fue guardado correctamente
                if (File.Exists(path))
                {
                    rutaa = fullPath;
                }
            }
            catch (IOException)
            {
                rutaa = "";
            }
            catch (Exception)
            {
                rutaa = "";
            }
            return rutaa;
        }

        public string Hash(string password)
        {
            // Validamos que no nos envíen contraseñas vacías
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            // Encripta la contraseña. BCrypt genera y aplica el "Salt" automáticamente
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string hash)
        {
            // Validamos que ninguno de los dos sea nulo o vacío
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
                return false;

            // Verifica si la contraseña en texto plano coincide con el hash de la BD
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public bool EnviarNotificacionExpo(string expoPushToken, string titulo, string mensaje)
        {
            // 1. Validamos que el token tenga el formato correcto de Expo
            if (string.IsNullOrWhiteSpace(expoPushToken) || !expoPushToken.StartsWith("ExponentPushToken"))
            {
                return false;
            }

            try
            {
                // 2. Armamos el objeto anónimo con la estructura que exige Expo
                var mensajeNoti = new
                {
                    to = expoPushToken,
                    title = titulo,
                    body = mensaje,
                    sound = "default",
                    data = new { codigo = "0", descripcion = "Esta es una prueba enviada del backend." }
                };

                // 3. Serializamos a JSON usando Newtonsoft.Json
                string jsonPayload = JsonConvert.SerializeObject(mensajeNoti);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // 4. Hacemos la petición POST a los servidores de Expo
                using (var http = new HttpClient())
                {
                    // Expo recomienda estos headers
                    http.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    // Llamada síncrona (igual que tu código de OpenAI)
                    var response = http
                        .PostAsync("https://exp.host/--/api/v2/push/send", content)
                        .GetAwaiter()
                        .GetResult();

                    // Si responde StatusCode 200 (OK), el envío fue exitoso
                    return response.IsSuccessStatusCode;
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes registrar el error en consola o log si lo deseas
                Console.WriteLine("Error al enviar notificación Push: " + ex.Message);
                return false;
            }
        }

        public bool EnviarNotificacionAviso(List<NotificacionAvisosDTO> listaTokenClientes, string titulo, string mensaje)
        {
            if (listaTokenClientes == null || listaTokenClientes.Count == 0) return false;

            // 2. Filtramos tokens inválidos y armamos el array de mensajes individuales
            var mensajes = listaTokenClientes
                .Where(d => !string.IsNullOrWhiteSpace(d.ExpoPushToken) && d.ExpoPushToken.StartsWith("ExponentPushToken"))
                .Select(d => new
                {
                    to = d.ExpoPushToken,
                    title = titulo,
                    body = mensaje,
                    sound = "default",
                    // AQUÍ ESTÁ LA MAGIA: personalizar lo que recibe cada token
                    data = new
                    {
                        codigo = "0",
                        descripcion = d.Descripcion
                    }
                }).ToList();

            if (mensajes.Count == 0) return false;

            try
            {
                // 3. Serializamos y enviamos todo de un solo golpe a Expo
                string jsonPayload = JsonConvert.SerializeObject(mensajes);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                using (var http = new HttpClient())
                {
                    http.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    var response = http
                        .PostAsync("https://exp.host/--/api/v2/push/send", content)
                        .GetAwaiter()
                        .GetResult();

                    return response.IsSuccessStatusCode;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al enviar notificaciones dinámicas: " + ex.Message);
                return false;
            }
        }

        public bool EnviarNotificacionesEncomiendasDinamicas(List<NotificacionDestinoDTO> destinos, string titulo, string mensaje, string descripcion)
        {
            // 1. Validamos que la lista no esté vacía
            if (destinos == null || destinos.Count == 0) return false;

            // 2. Filtramos tokens inválidos y armamos el array de mensajes individuales
            var mensajes = destinos
                .Where(d => !string.IsNullOrWhiteSpace(d.ExpoPushToken) && d.ExpoPushToken.StartsWith("ExponentPushToken"))
                .Select(d => new
                {
                    to = d.ExpoPushToken,
                    title = titulo,
                    body = mensaje,
                    sound = "default",
                    // AQUÍ ESTÁ LA MAGIA: Cada token recibe su propio IdEncomienda
                    data = new
                    {
                        codigo = "1",
                        idEncomienda = d.IdEncomienda,
                        descripcion
                    }
                }).ToList();

            if (mensajes.Count == 0) return false;

            try
            {
                // 3. Serializamos y enviamos todo de un solo golpe a Expo
                string jsonPayload = JsonConvert.SerializeObject(mensajes);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                using (var http = new HttpClient())
                {
                    http.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    var response = http
                        .PostAsync("https://exp.host/--/api/v2/push/send", content)
                        .GetAwaiter()
                        .GetResult();

                    return response.IsSuccessStatusCode;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al enviar notificaciones dinámicas: " + ex.Message);
                return false;
            }
        }

    }
}