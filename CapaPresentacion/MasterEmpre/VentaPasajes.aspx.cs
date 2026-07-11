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
    public partial class VentaPasajes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<AsientosViajeDTO>> ObtenerAsientosVendidos(int IdViaje)
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<AsientosViajeDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            // Llamamos a la capa de datos
            return NViajes.GetInstance().ObtenerAsientosVendidos(IdViaje, usuari.IdEmpresa);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<List<ViajesDTO>> ListaViajesVentas()
        {
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
                return new Respuesta<List<ViajesDTO>> { Estado = false, Mensaje = "Sesión expirada" };

            EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];

            // Llamamos a la capa de datos
            return NViajes.GetInstance().ListaViajesVentas(usuari.IdEmpresa);
        }

        [WebMethod(EnableSession = true)]
        public static Respuesta<TarifarioDTO> ConsultarTarifario(int IdDestino, int IdTipoBus)
        {
            // 1. Validar Sesión
            if (HttpContext.Current.Session["UsuarioLogueado"] == null)
            {
                return new Respuesta<TarifarioDTO> { Estado = false, Valor = "SIN_SESION", Mensaje = "Su sesión ha expirado. Recargue la página." };
            }

            try
            {
                // Obtener el IdCiudad de la sesión (Seguro)
                EUsuarios usuari = (EUsuarios)HttpContext.Current.Session["UsuarioLogueado"];
                int ciudadOrigen = 1;

                // VALIDACIÓN CLAVE: Origen y Destino no pueden ser el mismo
                if (ciudadOrigen == IdDestino)
                {
                    return new Respuesta<TarifarioDTO>
                    {
                        Estado = false,
                        Valor = "MISMO_DESTINO", // Usamos tu propiedad Valor como "Código de Error"
                        Mensaje = "El pasajero no puede viajar a la misma ciudad donde se encuentra."
                    };
                }

                return NViajes.GetInstance().ConsultarTarifario(usuari.IdEmpresa, ciudadOrigen, IdDestino, IdTipoBus);
            }
            catch (Exception ex)
            {
                // Captura cualquier error no previsto en la capa de presentación
                return new Respuesta<TarifarioDTO> { Estado = false, Mensaje = "Ocurrió un error inesperado: " + ex.Message };
            }
        }

    }
}