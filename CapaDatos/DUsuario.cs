using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DUsuario
    {
        #region "PATRON SINGLETON"
        private static DUsuario instancia = null;
        private DUsuario() { }
        public static DUsuario GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DUsuario();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuarios objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditUsuarios", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdUsuario", objeto.IdUsuario);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@IdRol", objeto.IdRol);
                        cmd.Parameters.AddWithValue("@NroCi", objeto.NroCi);

                        cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);

                        cmd.Parameters.AddWithValue("@Celular", objeto.Celular);
                        cmd.Parameters.AddWithValue("@Correo", objeto.Correo);

                        // Blindaje contra nulos en la Clave (Si es Update, puede que venga nula. La mandamos vacía para que el SP la ignore)
                        cmd.Parameters.AddWithValue("@Clave", string.IsNullOrEmpty(objeto.Clave) ? "" : objeto.Clave);

                        // Lo que hiciste con FotoUrl está perfecto porque el SP usa ISNULL(@FotoUrl, '')
                        cmd.Parameters.AddWithValue("@FotoUrl", string.IsNullOrEmpty(objeto.FotoUrl) ? "" : objeto.FotoUrl);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        resultadoCodigo = Convert.ToInt32(outputParam.Value);
                    }
                }

                response.Data = resultadoCodigo;

                switch (resultadoCodigo)
                {
                    case 1: // Duplicado
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Ya existe el NroCi para esta empresa";
                        break;

                    case 2: // Registro Nuevo
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3: // Actualización
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 4:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El correo ya está en uso en el sistema.";
                        break;

                    case 0: // Error
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación.";
                        break;
                }
            }
            catch (Exception ex)
            {
                //response.Data = 0;
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<ERol>> ListaRoles()
        {
            try
            {
                List<ERol> rptLista = new List<ERol>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_Roles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ERol
                                {
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ERol>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ERol>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<EUsuarios>> ObtenerUsuariosEmpresa(int IdEmpresa)
        {
            try
            {
                List<EUsuarios> rptLista = new List<EUsuarios>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaUsuarios", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EUsuarios
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    NombreEmpresa = dr["NombreEmpresa"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),

                                    Celular = dr["Celular"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    FotoUrl = dr["FotoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EUsuarios>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EUsuarios>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<EUsuarios> LoginUsuario(string Correo)
        {
            try
            {
                EUsuarios obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_LoginUsuario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@Correo", Correo);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new EUsuarios
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    NombreEmpresa = dr["NombreEmpresa"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),

                                    Celular = dr["Celular"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    Clave = dr["Clave"].ToString(),
                                    FotoUrl = dr["FotoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                };
                            }
                        }
                    }
                }

                return new Respuesta<EUsuarios>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Bienvenido usuario" : "Usuario o Contraseña incorrectos."
                };
            }
            catch (Exception)
            {
                return new Respuesta<EUsuarios>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error en el servidor. Intente más tarde.",
                    Data = null
                };
            }
        }

    }
}
