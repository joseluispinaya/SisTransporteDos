using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
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
    public partial class RecepcionesEnco : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> RegistroRecepEncomiendaPrueba(EEncomienda objeto)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<int> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };

            if (objeto == null)
            {
                return new Respuesta<int> { Estado = false, Mensaje = "No hay datos" };
            }

            objeto.IdEmpresa = usuario.IdEmpresa;

            return new Respuesta<int>
            {
                Estado = true,
                Data = 1,
                Mensaje = "Prueba de Registro exitoso."
            };
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> RegistroRecepEncomienda(EEncomienda objeto)
        {
            var usuario = SesionHelper.UsuarioLogueado;
            int idOrigen = 1;

            if (usuario == null)
                return new Respuesta<int> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };

            objeto.IdEmpresa = usuario.IdEmpresa;

            return NEncomienda.GetInstance().RegistroRecepEncomienda(objeto, idOrigen);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<EncomiendaImpresionDTO> ObtenerDetalleEncomiendaImpresion(int IdEncomienda)
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<EncomiendaImpresionDTO> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };

            return NEncomienda.GetInstance().ObtenerDetalleEncomiendaImpresion(IdEncomienda, usuario.IdEmpresa);
        }

    }
}