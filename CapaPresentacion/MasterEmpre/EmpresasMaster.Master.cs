using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion.MasterEmpre
{
    public partial class EmpresasMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.AppendHeader("Cache-Control", "no-store, no-cache, must-revalidate");

            if (Session["UsuarioLogueado"] == null || Session["TipoUsuario"] == null)
            {
                Response.Redirect("~/Login.aspx");
                return;
            }

            if (Session["TipoUsuario"].ToString() != "UsuarioEmpresa")
            {
                // En este caso lo mandas de vuelta a su inicio sin botarlo
                Response.Redirect("~/Inicio.aspx");
                return;
            }
        }
    }
}