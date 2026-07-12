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
    public partial class ConsultasPasajes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ViajesDTO>> ListaViajesDetalles(int IdRuta, int Estado)
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
                return NVentaPasajes.GetInstance().ListaViajesDetalles(usuario.IdEmpresa, IdRuta, Estado);
            }
            catch (Exception)
            {
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<PasajeroViajeDTO>> ListaPasajerosViaje(int IdViaje)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            // 2. Validamos si es null (Sesión expirada)
            if (usuario == null)
            {
                return new Respuesta<List<PasajeroViajeDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 3. Usamos el IdEmpresa directamente del objeto
                return NVentaPasajes.GetInstance().ListaPasajerosViaje(IdViaje, usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<List<PasajeroViajeDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> PagarReserva(int IdBoleto)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            // 2. Validamos si es null (Sesión expirada)
            if (usuario == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 3. Usamos el IdEmpresa directamente del objeto
                return NVentaPasajes.GetInstance().PagarReserva(IdBoleto, usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> EliminarReserva(int IdBoleto)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            // 2. Validamos si es null (Sesión expirada)
            if (usuario == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 3. Usamos el IdEmpresa directamente del objeto
                return NVentaPasajes.GetInstance().EliminarReserva(IdBoleto, usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

    }
}