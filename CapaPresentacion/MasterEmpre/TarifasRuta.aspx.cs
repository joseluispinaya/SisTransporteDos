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
    public partial class TarifasRuta : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<TarifasDTO>> ListaTarifas()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<TarifasDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NTarifas.GetInstance().ListaTarifas(usuari.IdEmpresa);
            }
            catch (Exception)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<TarifasDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditTarifarios(TarifasDTO objeto)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                objeto.IdEmpresa = usuari.IdEmpresa;

                return NTarifas.GetInstance().GuardarOrEditTarifarios(objeto);
            }
            catch (Exception)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

    }
}