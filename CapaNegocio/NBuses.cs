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
    public class NBuses
    {
        #region "PATRON SINGLETON"
        private static NBuses instancia = null;
        private NBuses() { }
        public static NBuses GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NBuses();
            }
            return instancia;
        }
        #endregion

        // choferes
        public Respuesta<List<EChofer>> ListaChoferes(int IdEmpresa)
        {
            return DBuses.GetInstance().ListaChoferes(IdEmpresa);
        }

        public Respuesta<int> GuardarOrEditChoferes(EChofer objeto)
        {
            return DBuses.GetInstance().GuardarOrEditChoferes(objeto);
        }

        public Respuesta<List<EChofer>> FiltroChoferes(int IdEmpresa, string Busqueda)
        {
            return DBuses.GetInstance().FiltroChoferes(IdEmpresa, Busqueda);
        }

        // tipo de bus
        public Respuesta<int> GuardarOrEditTipoBuses(ETipoBus objeto)
        {
            return DBuses.GetInstance().GuardarOrEditTipoBuses(objeto);
        }

        public Respuesta<List<ETipoBus>> ListaTipoBuses(int IdEmpresa)
        {
            return DBuses.GetInstance().ListaTipoBuses(IdEmpresa);
        }

        // buses
        public Respuesta<List<BusesDTO>> ListaBuses(int IdEmpresa)
        {
            return DBuses.GetInstance().ListaBuses(IdEmpresa);
        }

        public Respuesta<int> GuardarOrEditBuses(EBuses objeto)
        {
            return DBuses.GetInstance().GuardarOrEditBuses(objeto);
        }

    }
}
