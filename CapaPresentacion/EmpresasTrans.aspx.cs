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
    public partial class EmpresasTrans : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EEmpresa>> ListaEmpresas()
        {
            return NEmpresa.GetInstance().ListaEmpresas();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditEmpresa(EEmpresa objeto, string base64Image)
        {
            try
            {
                // 1. Manejo del logo
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/LogosEmp/";
                        objeto.LogoUrl = Utilidades.GetInstance().UploadPhoto(stream, folder);
                    }
                }
                else
                {
                    objeto.LogoUrl = "";
                }

                return NEmpresa.GetInstance().GuardarOrEditEmpresa(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}