using CapaEntidad.DTOs;
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
    public class DCliente
    {
        #region "PATRON SINGLETON"
        private static DCliente instancia = null;
        private DCliente() { }
        public static DCliente GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DCliente();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ClienteDTO>> ListaClientesPaginado(int Omitir, int TamanoPagina, string Buscar)
        {
            try
            {
                List<ClienteDTO> rptLista = new List<ClienteDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarClientesPaginado", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Omitir", Omitir);
                        cmd.Parameters.AddWithValue("@TamanoPagina", TamanoPagina);
                        // Si Buscar es null, mandamos cadena vacía para evitar errores en SQL
                        cmd.Parameters.AddWithValue("@Buscar", Buscar ?? "");

                        con.Open();

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ClienteDTO
                                {
                                    IdCliente = Convert.ToInt32(dr["IdCliente"]),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),

                                    Genero = Convert.ToChar(dr["Genero"].ToString()),
                                    Celular = dr["Celular"].ToString(),
                                    // Mapeo de los campos de paginación
                                    TotalRegistros = Convert.ToInt32(dr["TotalRegistros"]),
                                    TotalFiltrados = Convert.ToInt32(dr["TotalFiltrados"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ClienteDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ClienteDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarOrEditClientes(ECliente objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditClientes", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdCliente", objeto.IdCliente);
                        cmd.Parameters.AddWithValue("@NroCi", objeto.NroCi);

                        cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);

                        cmd.Parameters.AddWithValue("@ClaveHash", string.IsNullOrEmpty(objeto.ClaveHash) ? "" : objeto.ClaveHash);
                        cmd.Parameters.AddWithValue("@Genero", objeto.Genero);
                        cmd.Parameters.AddWithValue("@Celular", objeto.Celular);

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
                        response.Mensaje = "Ocurrio un problema el NroCi ya existe";
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

        public Respuesta<List<ClienteDTO>> FiltroClientes(string Busqueda)
        {
            try
            {
                List<ClienteDTO> rptLista = new List<ClienteDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_FiltroClientes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@Busqueda", Busqueda);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ClienteDTO
                                {
                                    IdCliente = Convert.ToInt32(dr["IdCliente"]),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),

                                    Genero = Convert.ToChar(dr["Genero"].ToString()),
                                    Celular = dr["Celular"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ClienteDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ClienteDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
