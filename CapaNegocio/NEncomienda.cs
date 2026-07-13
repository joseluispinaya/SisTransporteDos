using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NEncomienda
    {
        #region "PATRON SINGLETON"
        private static NEncomienda instancia = null;
        private NEncomienda() { }
        public static NEncomienda GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NEncomienda();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> RegistroRecepEncomienda(EEncomienda obj, int idOrigen)
        {
            return DEncomienda.GetInstance().RegistroRecepEncomienda(obj, idOrigen);
        }

        public Respuesta<EncomiendaImpresionDTO> ObtenerDetalleEncomiendaImpresion(int idEncomienda, int idEmpresa)
        {
            return DEncomienda.GetInstance().ObtenerDetalleEncomiendaImpresion(idEncomienda, idEmpresa);
        }

        public Respuesta<List<EncomiendasViajeDTO>> ListaEncomiendasViaje(int IdViaje, int IdEmpresa)
        {
            return DEncomienda.GetInstance().ListaEncomiendasViaje(IdViaje, IdEmpresa);
        }

    }
}
