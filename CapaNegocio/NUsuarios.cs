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
    public class NUsuarios
    {
        #region "PATRON SINGLETON"
        private static NUsuarios instancia = null;
        private NUsuarios() { }
        public static NUsuarios GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NUsuarios();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuarios objeto)
        {
            return DUsuario.GetInstance().GuardarOrEditUsuarios(objeto);
        }

        public Respuesta<List<ERol>> ListaRoles()
        {
            return DUsuario.GetInstance().ListaRoles();
        }

        public Respuesta<List<EUsuarios>> ObtenerUsuariosEmpresa(int IdEmpresa)
        {
            return DUsuario.GetInstance().ObtenerUsuariosEmpresa(IdEmpresa);
        }

        public Respuesta<EUsuarios> LoginUsuario(string Correo)
        {
            return DUsuario.GetInstance().LoginUsuario(Correo);
        }
    }
}
