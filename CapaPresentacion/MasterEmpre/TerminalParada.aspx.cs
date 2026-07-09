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
    public partial class TerminalParada : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ECiudadParada>> ListaCiudadesParada()
        {
            return NCiudadParada.GetInstance().ListaCiudadesParada();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditCiudadParada(ECiudadParada objeto)
        {
            return NCiudadParada.GetInstance().GuardarOrEditCiudadParada(objeto);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ERuta>> ListaRutas()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<ERuta>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NCiudadParada.GetInstance().ListaRutas(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<ERuta>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditRutas(ERuta objeto)
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

                return NCiudadParada.GetInstance().GuardarOrEditRutas(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        // RUTAS PARADAS
        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ERutasParadas>> ListaRutasParadasRP(int IdRuta)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<ERutasParadas>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NCiudadParada.GetInstance().ListaRutasParadasRP(IdRuta, usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<ERutasParadas>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditRutasParadasRP(ERutasParadas objeto)
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

                return NCiudadParada.GetInstance().GuardarOrEditRutasParadasRP(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> EliminarRutaParadaRP(int IdRutaParada)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NCiudadParada.GetInstance().EliminarRutaParadaRP(IdRutaParada, usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}