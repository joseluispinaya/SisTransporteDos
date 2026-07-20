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
    public partial class Conductores : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<EChofer>> ListaChoferesApi()
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<List<EChofer>> { Estado = false, Mensaje = "Sesión expirada" };

            try
            {
                return Servicios.GetInstance().ListaChoferesServicio(usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<List<EChofer>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<BusesDTO>> ListaBusesApi()
        {
            var usuario = SesionHelper.UsuarioLogueado;

            if (usuario == null)
                return new Respuesta<List<BusesDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            try
            {
                return Servicios.GetInstance().ListaBusesServicio(usuario.IdEmpresa);
            }
            catch (Exception)
            {
                return new Respuesta<List<BusesDTO>> { Estado = false, Mensaje = "Ocurrió un error interno en el servidor. Intente nuevamente" };
            }
        }

        // choferes
        [WebMethod(EnableSession = true)]
        public static Respuesta<List<EChofer>> ListaChoferes()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<EChofer>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NBuses.GetInstance().ListaChoferes(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<EChofer>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditChoferes(EChofer objeto)
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

                return NBuses.GetInstance().GuardarOrEditChoferes(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<EChofer>> FiltroChoferes(string busqueda)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<EChofer>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            // Llamamos a la capa de datos
            return NBuses.GetInstance().FiltroChoferes(usuari.IdEmpresa, busqueda);
        }

        // tipo buses
        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ETipoBus>> ListaTipoBuses()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<ETipoBus>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NBuses.GetInstance().ListaTipoBuses(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<ETipoBus>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditTipoBuses(ETipoBus objeto)
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

                return NBuses.GetInstance().GuardarOrEditTipoBuses(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        // buses
        [WebMethod(EnableSession = true)]
        public static Respuesta<List<BusesDTO>> ListaBuses()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<BusesDTO>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NBuses.GetInstance().ListaBuses(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<BusesDTO>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditBuses(EBuses objeto)
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

                return NBuses.GetInstance().GuardarOrEditBuses(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}