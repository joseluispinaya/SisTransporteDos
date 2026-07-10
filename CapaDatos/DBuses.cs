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
    public class DBuses
    {
        #region "PATRON SINGLETON"
        private static DBuses instancia = null;
        private DBuses() { }
        public static DBuses GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DBuses();
            }
            return instancia;
        }
        #endregion

        // choferes
        public Respuesta<List<EChofer>> ListaChoferes(int IdEmpresa)
        {
            try
            {
                List<EChofer> rptLista = new List<EChofer>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaChoferes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EChofer
                                {
                                    IdChofer = Convert.ToInt32(dr["IdChofer"]),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    NombreCompleto = dr["NombreCompleto"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    NroLicencia = dr["NroLicencia"].ToString(),
                                    TipoSangre = dr["TipoSangre"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EChofer>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EChofer>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> GuardarOrEditChoferes(EChofer objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditChofer", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // 2. Parámetros del Docente
                        cmd.Parameters.AddWithValue("@IdChofer", objeto.IdChofer);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@NombreCompleto", objeto.NombreCompleto);
                        cmd.Parameters.AddWithValue("@NroCi", objeto.NroCi);
                        cmd.Parameters.AddWithValue("@Celular", objeto.Celular);
                        cmd.Parameters.AddWithValue("@NroLicencia", objeto.NroLicencia);
                        cmd.Parameters.AddWithValue("@TipoSangre", objeto.TipoSangre);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        // 4. Parámetro de Salida
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

                // 5. Interpretación de la respuesta (Igual que con Carreras y Grados)
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El Carnet de Identidad ya está registrado en esta empresa.";
                        break;

                    case 2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El Número de Licencia ya se encuentra registrado en esta empresa.";
                        break;

                    case 3:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 4:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación en la base de datos.";
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

        public Respuesta<List<EChofer>> FiltroChoferes(int IdEmpresa, string Busqueda)
        {
            try
            {
                List<EChofer> rptLista = new List<EChofer>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_FiltroChoferes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        comando.Parameters.AddWithValue("@Busqueda", Busqueda);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EChofer
                                {
                                    IdChofer = Convert.ToInt32(dr["IdChofer"]),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    NombreCompleto = dr["NombreCompleto"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    NroLicencia = dr["NroLicencia"].ToString(),
                                    TipoSangre = dr["TipoSangre"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EChofer>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EChofer>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        // tipo de bus
        public Respuesta<int> GuardarOrEditTipoBuses(ETipoBus objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditTipoBuses", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // 2. Parámetros del Docente
                        cmd.Parameters.AddWithValue("@IdTipoBus", objeto.IdTipoBus);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@NombreTipo", objeto.NombreTipo);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        // 4. Parámetro de Salida
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

                // 5. Interpretación de la respuesta (Igual que con Carreras y Grados)
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Ya existe un registro con el mismo Tipo de bus.";
                        break;

                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación en la base de datos.";
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

        public Respuesta<List<ETipoBus>> ListaTipoBuses(int IdEmpresa)
        {
            try
            {
                List<ETipoBus> rptLista = new List<ETipoBus>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaTipoBuses", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ETipoBus
                                {
                                    IdTipoBus = Convert.ToInt32(dr["IdTipoBus"]),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ETipoBus>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ETipoBus>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        // buses
        public Respuesta<List<BusesDTO>> ListaBuses(int IdEmpresa)
        {
            try
            {
                List<BusesDTO> rptLista = new List<BusesDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaBuses", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new BusesDTO
                                {
                                    IdBus = Convert.ToInt32(dr["IdBus"]),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    Placa = dr["Placa"].ToString(),
                                    IdTipoBus = Convert.ToInt32(dr["IdTipoBus"]),
                                    IdChofer = Convert.ToInt32(dr["IdChofer"]),
                                    CapacidadAsientos = Convert.ToInt32(dr["CapacidadAsientos"]),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    NombreCompleto = dr["NombreCompleto"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<BusesDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<BusesDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> GuardarOrEditBuses(EBuses objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditBuses", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // 2. Parámetros del Docente
                        cmd.Parameters.AddWithValue("@IdBus", objeto.IdBus);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@Placa", objeto.Placa);
                        cmd.Parameters.AddWithValue("@IdTipoBus", objeto.IdTipoBus);
                        cmd.Parameters.AddWithValue("@IdChofer", objeto.IdChofer);
                        cmd.Parameters.AddWithValue("@CapacidadAsientos", objeto.CapacidadAsientos);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

                        // 4. Parámetro de Salida
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

                // 5. Interpretación de la respuesta (Igual que con Carreras y Grados)
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Ya existe un registro con la misma placa.";
                        break;

                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0:
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación en la base de datos.";
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

    }
}
