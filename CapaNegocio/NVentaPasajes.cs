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
    public class NVentaPasajes
    {
        #region "PATRON SINGLETON"
        private static NVentaPasajes instancia = null;
        private NVentaPasajes() { }
        public static NVentaPasajes GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NVentaPasajes();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> RegistrarBoleto(BoletoDTO obj, int idOrigen)
        {
            return DVentaPasajes.GetInstance().RegistrarBoleto(obj, idOrigen);
        }

        public Respuesta<BoletoImpresionDTO> ObtenerDetalleBoletoImpresion(int idBoleto, int idEmpresa)
        {
            return DVentaPasajes.GetInstance().ObtenerDetalleBoletoImpresion(idBoleto, idEmpresa);
        }

        public Respuesta<List<ViajesDTO>> ListaViajesDetalles(int IdEmpresa, int IdRuta, int Estado)
        {
            return DVentaPasajes.GetInstance().ListaViajesDetalles(IdEmpresa, IdRuta, Estado);
        }

        public Respuesta<List<PasajeroViajeDTO>> ListaPasajerosViaje(int IdViaje, int IdEmpresa)
        {
            return DVentaPasajes.GetInstance().ListaPasajerosViaje(IdViaje, IdEmpresa);
        }

        public Respuesta<int> PagarReserva(int IdBoleto, int IdEmpresa)
        {
            return DVentaPasajes.GetInstance().PagarReserva(IdBoleto, IdEmpresa);
        }

        public Respuesta<int> EliminarReserva(int IdBoleto, int IdEmpresa)
        {
            return DVentaPasajes.GetInstance().EliminarReserva(IdBoleto, IdEmpresa);
        }

    }
}
