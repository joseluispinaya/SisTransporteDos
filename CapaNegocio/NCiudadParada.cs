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
    public class NCiudadParada
    {
        #region "PATRON SINGLETON"
        private static NCiudadParada instancia = null;
        private NCiudadParada() { }
        public static NCiudadParada GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NCiudadParada();
            }
            return instancia;
        }
        #endregion

        // CIUDADES_PARADAS
        public Respuesta<int> GuardarOrEditCiudadParada(ECiudadParada objeto)
        {
            return DCiudadParada.GetInstance().GuardarOrEditCiudadParada(objeto);
        }

        public Respuesta<List<ECiudadParada>> ListaCiudadesParada()
        {
            return DCiudadParada.GetInstance().ListaCiudadesParada();
        }

        // rutas
        public Respuesta<int> GuardarOrEditRutas(ERuta objeto)
        {
            return DCiudadParada.GetInstance().GuardarOrEditRutas(objeto);
        }

        public Respuesta<List<ERuta>> ListaRutas(int IdEmpresa)
        {
            return DCiudadParada.GetInstance().ListaRutas(IdEmpresa);
        }

        // el metodo de lista RUTAS_PARADAS el de la magia
        public Respuesta<List<ERutasParadas>> ListaRutasParadasRP(int IdRuta, int IdEmpresa)
        {
            return DCiudadParada.GetInstance().ListaRutasParadasRP(IdRuta, IdEmpresa);
        }

        public Respuesta<int> GuardarOrEditRutasParadasRP(ERutasParadas objeto)
        {
            return DCiudadParada.GetInstance().GuardarOrEditRutasParadasRP(objeto);
        }

        public Respuesta<int> EliminarRutaParadaRP(int IdRutaParada, int IdEmpresa)
        {
            return DCiudadParada.GetInstance().EliminarRutaParadaRP(IdRutaParada, IdEmpresa);
        }

    }
}
