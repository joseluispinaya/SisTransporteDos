using CapaDatos;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NEmpresa
    {
        #region "PATRON SINGLETON"
        private static NEmpresa instancia = null;
        private NEmpresa() { }
        public static NEmpresa GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NEmpresa();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditEmpresa(EEmpresa objeto)
        {
            return DEmpresa.GetInstance().GuardarOrEditEmpresa(objeto);
        }

        public Respuesta<List<EEmpresa>> ListaEmpresas()
        {
            return DEmpresa.GetInstance().ListaEmpresas();
        }
    }
}
