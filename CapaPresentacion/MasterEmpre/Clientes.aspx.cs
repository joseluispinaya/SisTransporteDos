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
    public partial class Clientes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ClienteDTO>> ListaClientesPaginado(int Omitir, int TamanoPagina, string Buscar)
        {
            return NCliente.GetInstance().ListaClientesPaginado(Omitir, TamanoPagina, Buscar);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditClientes(ECliente objeto)
        {
            try
            {
                // Manejo de la clave
                if (objeto.IdCliente == 0)
                {
                    objeto.ClaveHash = Utilidades.GetInstance().Hash(objeto.NroCi);
                }
                else
                {
                    objeto.ClaveHash = "";
                }

                return NCliente.GetInstance().GuardarOrEditClientes(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<List<ClienteDTO>> FiltroClientes(string busqueda)
        {
            return NCliente.GetInstance().FiltroClientes(busqueda);
        }

    }
}