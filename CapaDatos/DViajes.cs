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
    public class DViajes
    {
        #region "PATRON SINGLETON"
        private static DViajes instancia = null;
        private DViajes() { }
        public static DViajes GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DViajes();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditViajesProgramados(EViaje objeto, DateTime FechaSalida, TimeSpan HoraSalida)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditViaje", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdViaje", objeto.IdViaje);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@IdRuta", objeto.IdRuta);
                        cmd.Parameters.AddWithValue("@IdBus", objeto.IdBus);

                        cmd.Parameters.AddWithValue("@FechaSalida", FechaSalida);
                        cmd.Parameters.AddWithValue("@HoraSalida", HoraSalida);

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

                    case 4: // El mismo Bus ya tiene otro viaje
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error El Bus ya tiene un viaje programado para esa fecha.";
                        break;

                    case 5: // Fechas pasadas
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error No se pueden programar viajes en fechas pasadas.";
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

        public Respuesta<List<ViajesDTO>> ListaViajesProgramadas(int IdEmpresa)
        {
            try
            {
                List<ViajesDTO> rptLista = new List<ViajesDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarViajes", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ViajesDTO
                                {
                                    IdViaje = Convert.ToInt32(dr["IdViaje"]),
                                    IdRuta = Convert.ToInt32(dr["IdRuta"]),
                                    NombreRuta = dr["NombreRuta"].ToString(),
                                    IdBus = Convert.ToInt32(dr["IdBus"]),
                                    PlacaBus = dr["PlacaBus"].ToString(),
                                    TipoBus = dr["TipoBus"].ToString(),
                                    CapacidadAsientos = Convert.ToInt32(dr["CapacidadAsientos"]),
                                    FechaSalidaStr = Convert.ToDateTime(dr["FechaSalida"]).ToString("dd/MM/yyyy"),
                                    HoraSalidaStr = ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm"),
                                    Estado = Convert.ToInt32(dr["Estado"]),
                                    EstadoTexto = dr["EstadoTexto"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ViajesDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ViajesDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<ViajesDTO>> ListaViajesVentas(int IdEmpresa)
        {
            try
            {
                List<ViajesDTO> rptLista = new List<ViajesDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarViajesVenta", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ViajesDTO
                                {
                                    IdViaje = Convert.ToInt32(dr["IdViaje"]),
                                    IdRuta = Convert.ToInt32(dr["IdRuta"]),
                                    NombreRuta = dr["NombreRuta"].ToString(),
                                    FechaSalidaStr = Convert.ToDateTime(dr["FechaSalida"]).ToString("dd/MM/yyyy"),
                                    HoraSalidaStr = ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm"),
                                    TipoBus = dr["TipoBus"].ToString(),
                                    IdTipoBus = Convert.ToInt32(dr["IdTipoBus"]),
                                    CapacidadAsientos = Convert.ToInt32(dr["CapacidadAsientos"]),
                                    Estado = Convert.ToInt32(dr["Estado"]),
                                    EstadoTexto = dr["EstadoTexto"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ViajesDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ViajesDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<AsientosViajeDTO>> ObtenerAsientosVendidos(int IdViaje, int IdEmpresa)
        {
            try
            {
                List<AsientosViajeDTO> rptLista = new List<AsientosViajeDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerAsientosOcupadosPorViaje", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdViaje", IdViaje);
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new AsientosViajeDTO
                                {
                                    IdBoleto = Convert.ToInt32(dr["IdBoleto"]),
                                    NroAsiento = Convert.ToInt32(dr["NroAsiento"]),
                                    Estado = Convert.ToInt32(dr["Estado"]),
                                    LlevaMenorEdad = Convert.ToBoolean(dr["LlevaMenorEdad"]),
                                    NombrePasajero = dr["NombrePasajero"].ToString(),
                                    CIPasajero = dr["CIPasajero"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<AsientosViajeDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<AsientosViajeDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<TarifarioDTO> ConsultarTarifario(int IdEmpresa, int IdOrigen, int IdDestino, int IdTipoBus)
        {
            try
            {
                TarifarioDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerTarifario", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        comando.Parameters.AddWithValue("@IdOrigen", IdOrigen);
                        comando.Parameters.AddWithValue("@IdDestino", IdDestino);
                        comando.Parameters.AddWithValue("@IdTipoBus", IdTipoBus);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new TarifarioDTO
                                {
                                    PrecioPasaje = Convert.ToDecimal(dr["PrecioPasaje"]),
                                    PrecioKiloEncomienda = Convert.ToDecimal(dr["PrecioKiloEncomienda"])
                                };
                            }
                        }
                    }
                }
                return new Respuesta<TarifarioDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Tarifa obtenida." : "Tarifa no configurada."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<TarifarioDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
