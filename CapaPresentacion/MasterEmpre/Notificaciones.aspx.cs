using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterEmpre
{
    public partial class Notificaciones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<NotificaViajeDTO>> ListaNotificacionViaje(int IdViaje)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<List<NotificaViajeDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };

            return NViajes.GetInstance().ListaNotificacionViaje(IdViaje, usuario.IdEmpresa);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<NotificacionDestinoDTO>> ListaNotificacionEncoViaje(int IdViaje)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<List<NotificacionDestinoDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };

            return NViajes.GetInstance().ListaNotificacionEncoViaje(IdViaje, usuario.IdEmpresa);
        }

        [WebMethod]
        public static Respuesta<bool> EnvioNotificacionPrueba(List<NotificaViajeDTO> listaNoti, string Titulo, string Mensaje)
        {
            if (listaNoti == null || listaNoti.Count == 0)
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se registró ningún horario. Por favor, agregue al menos un día."
                };
            }

            if (string.IsNullOrEmpty(Titulo) || string.IsNullOrEmpty(Mensaje))
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "Ingrese los parámetros requeridos (Token, Título y Mensaje)."
                };
            }

            System.Threading.Thread.Sleep(2000);

            // 2. Creamos la respuesta
            Respuesta<bool> response = new Respuesta<bool>
            {
                Estado = true,
                Valor = "success",
                Mensaje = "El Mensaje se envio correctamente. (Prueba Simulada)",
                Data = true
            };

            return response;
        }

        [WebMethod]
        public static Respuesta<bool> EnvioNotificacionPruebaDos(string expoPushToken, string titulo, string mensaje)
        {
            try
            {
                if (string.IsNullOrEmpty(expoPushToken) || string.IsNullOrEmpty(titulo) || string.IsNullOrEmpty(mensaje))
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "Ingrese los parámetros requeridos (Token, Título y Mensaje)."
                    };
                }

                bool exito = Utilidades.GetInstance().EnviarNotificacionExpo(expoPushToken, titulo, mensaje);

                // 4. GUARDAR EN BASE DE DATOS
                return new Respuesta<bool>
                {
                    Estado = exito,
                    Valor = exito ? "success" : "warning",
                    Mensaje = exito ? "Mensaje enviado correctamente" : "Error al enviar el mensaje intente mas tarde"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<bool> EnviarAvisoGeneralPrueba(List<NotificacionAvisosDTO> listaTokenClientes, string titulo, string mensaje)
        {
            if (listaTokenClientes == null || listaTokenClientes.Count == 0)
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No hay clientes para notificar."
                };
            }

            if (string.IsNullOrEmpty(titulo) || string.IsNullOrEmpty(mensaje))
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "Ingrese los parámetros requeridos (Título y Mensaje)."
                };
            }

            System.Threading.Thread.Sleep(2000);

            // 2. Creamos la respuesta
            Respuesta<bool> response = new Respuesta<bool>
            {
                Estado = true,
                Valor = "success",
                Mensaje = "El Mensaje se envio correctamente. (Prueba Simulada)",
                Data = true
            };

            return response;
        }

        [WebMethod]
        public static Respuesta<bool> EnviarAvisoGeneral(List<NotificacionAvisosDTO> listaTokenClientes, string titulo, string mensaje)
        {
            try
            {
                if (listaTokenClientes == null || listaTokenClientes.Count == 0)
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "No hay clientes para notificar."
                    };
                }

                if (string.IsNullOrEmpty(titulo) || string.IsNullOrEmpty(mensaje))
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "Ingrese los parámetros requeridos (Título y Mensaje)."
                    };
                }

                bool exito = Utilidades.GetInstance().EnviarNotificacionAviso(listaTokenClientes, titulo, mensaje);

                return new Respuesta<bool>
                {
                    Estado = exito,
                    Valor = exito ? "success" : "warning",
                    Mensaje = exito ? "Notificaciones enviadas correctamente" : "Hubo un problema al enviar algunas notificaciones."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<bool> NotificarLoteEncomiendas(List<NotificacionDestinoDTO> listaDestinos, string titulo, string mensaje)
        {
            try
            {
                if (listaDestinos == null || listaDestinos.Count == 0)
                {
                    return new Respuesta<bool> { Estado = false, Mensaje = "No hay destinos para notificar." };
                }

                if (string.IsNullOrEmpty(titulo) || string.IsNullOrEmpty(mensaje))
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Mensaje = "Ingrese los parámetros requeridos (Título y Mensaje)."
                    };
                }

                // Llamamos al nuevo método dinámico
                bool exito = Utilidades.GetInstance().EnviarNotificacionesEncomiendasDinamicas(
                    listaDestinos,
                    titulo,
                    mensaje,
                    "El placer de estar a tu servicio."
                );

                return new Respuesta<bool>
                {
                    Estado = exito,
                    Mensaje = exito ? "Notificaciones enviadas correctamente" : "Hubo un problema al enviar algunas notificaciones."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool> { Estado = false, Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}