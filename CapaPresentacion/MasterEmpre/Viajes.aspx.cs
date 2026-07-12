using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterEmpre
{
    public partial class Viajes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ViajesDTO>> ListaViajesProgramadas()
        {
            // 1. Obtenemos el usuario con una sola línea limpia
            var usuario = SesionHelper.UsuarioLogueado;

            // 2. Validamos si es null (Sesión expirada)
            if (usuario == null)
            {
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 3. Usamos el IdEmpresa directamente del objeto
                return NViajes.GetInstance().ListaViajesProgramadas(usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ViajesDTO>> ListaViajesProgramadasOriginal()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NViajes.GetInstance().ListaViajesProgramadas(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditViajesProgramados(EViaje objeto)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.FechaSalidaStr, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaSalida))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 2. Validar y convertir Hora de forma segura
                if (!TimeSpan.TryParse(objeto.HoraSalidaStr, out TimeSpan horaSalida))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora no es válido. Debe ser HH:mm." };
                }

                objeto.IdEmpresa = usuari.IdEmpresa;

                return NViajes.GetInstance().GuardarOrEditViajesProgramados(objeto, fechaSalida, horaSalida);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}