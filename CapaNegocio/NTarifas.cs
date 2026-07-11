using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NTarifas
    {
        #region "PATRON SINGLETON"
        private static NTarifas instancia = null;
        private NTarifas() { }
        public static NTarifas GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NTarifas();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<TarifasDTO>> ListaTarifas(int IdEmpresa)
        {
            return DTarifas.GetInstance().ListaTarifas(IdEmpresa);
        }

        public Respuesta<int> GuardarOrEditTarifarios(TarifasDTO objeto)
        {
            return DTarifas.GetInstance().GuardarOrEditTarifarios(objeto);
        }

    }
}
