using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterEmpre
{
    public partial class Usuarios : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<EUsuarios>> ObtenerUsuariosEmpresa()
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<List<EUsuarios>> { Estado = false, Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                return NUsuarios.GetInstance().ObtenerUsuariosEmpresa(usuari.IdEmpresa);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<List<EUsuarios>> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<int> GuardarOrEditUsuarios(EUsuarios objeto, string base64Image)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                var utilidades = Utilidades.GetInstance();

                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

                objeto.IdEmpresa = usuari.IdEmpresa;

                // 1. Manejo de la foto
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/Imagenes/";
                        objeto.FotoUrl = utilidades.UploadPhoto(stream, folder);
                    }
                }
                else
                {
                    objeto.FotoUrl = "";
                }

                // 2. Manejo de la clave
                if (objeto.IdUsuario == 0)
                {
                    objeto.Clave = utilidades.Hash(objeto.NroCi);
                }
                else
                {
                    objeto.Clave = "";
                }

                return NUsuarios.GetInstance().GuardarOrEditUsuarios(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}