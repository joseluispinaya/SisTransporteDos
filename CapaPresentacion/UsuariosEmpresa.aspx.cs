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

namespace CapaPresentacion
{
    public partial class UsuariosEmpresa : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ERol>> ListaRoles()
        {
            return NUsuarios.GetInstance().ListaRoles();
        }

        [WebMethod]
        public static Respuesta<List<EUsuarios>> ObtenerUsuariosEmpresa(int IdEmpresa)
        {
            return NUsuarios.GetInstance().ObtenerUsuariosEmpresa(IdEmpresa);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditUsuarios(EUsuarios objeto, string base64Image)
        {
            try
            {
                var utilidades = Utilidades.GetInstance();

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