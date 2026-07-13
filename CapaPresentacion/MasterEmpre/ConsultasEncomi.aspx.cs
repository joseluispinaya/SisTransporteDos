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
    public partial class ConsultasEncomi : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<EncomiendasViajeDTO>> ListaEncomiendasViaje(int IdViaje)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            // 2. Validamos si es null (Sesión expirada)
            if (usuario == null)
            {
                return new Respuesta<List<EncomiendasViajeDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // 3. Usamos el IdEmpresa directamente del objeto
                return NEncomienda.GetInstance().ListaEncomiendasViaje(IdViaje, usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<List<EncomiendasViajeDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

    }
}