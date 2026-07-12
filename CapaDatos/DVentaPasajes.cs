using CapaEntidad.DTOs;
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
    public class DVentaPasajes
    {
        #region "PATRON SINGLETON"
        private static DVentaPasajes instancia = null;
        private DVentaPasajes() { }
        public static DVentaPasajes GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DVentaPasajes();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> RegistrarBoleto(BoletoDTO obj, int idOrigen)
        {
            try
            {
                int idGenerado = 0;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_RegistrarBoleto", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;

                        comando.Parameters.AddWithValue("@IdEmpresa", obj.IdEmpresa);
                        comando.Parameters.AddWithValue("@IdViaje", obj.IdViaje);
                        comando.Parameters.AddWithValue("@IdOrigen", idOrigen);
                        comando.Parameters.AddWithValue("@IdDestino", obj.IdDestino);
                        comando.Parameters.AddWithValue("@IdPasajero", obj.IdPasajero);
                        comando.Parameters.AddWithValue("@LlevaMenorEdad", obj.LlevaMenorEdad);
                        comando.Parameters.AddWithValue("@NroAsiento", obj.NroAsiento);
                        // comando.Parameters.AddWithValue("@CostoPasaje", obj.CostoPasaje);

                        // Buena Práctica: Tipar el decimal para evitar problemas de conversión
                        comando.Parameters.Add(new SqlParameter("@CostoPasaje", SqlDbType.Decimal) { Value = obj.CostoPasaje });

                        comando.Parameters.AddWithValue("@Estado", obj.Estado);

                        // Configuración del parámetro de SALIDA (OUTPUT)
                        SqlParameter paramResultado = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        comando.Parameters.Add(paramResultado);

                        con.Open();
                        comando.ExecuteNonQuery();

                        // Recuperamos el ID del boleto devuelto por SQL
                        idGenerado = Convert.ToInt32(paramResultado.Value);
                    }
                }

                return new Respuesta<int>
                {
                    Estado = idGenerado > 0,
                    Data = idGenerado,
                    Mensaje = idGenerado > 0 ? "Registro exitoso." : "No se pudo completar el registro."
                };
            }
            catch (SqlException sqlEx)
            {
                // Capturamos la excepción nativa de SQL. 
                // sqlEx.Message contendrá el RAISERROR ("El asiento seleccionado ya no está disponible...")
                return new Respuesta<int>
                {
                    Estado = false,
                    Data = 0,
                    Mensaje = sqlEx.Message
                };
            }
            catch (Exception ex)
            {
                // Captura cualquier otro error de código C# (ej. pérdida de red, valores nulos)
                return new Respuesta<int>
                {
                    Estado = false,
                    Data = 0,
                    Mensaje = "Error en el sistema: " + ex.Message
                };
            }
        }

        public Respuesta<BoletoImpresionDTO> ObtenerDetalleBoletoImpresion(int idBoleto, int idEmpresa)
        {
            try
            {
                BoletoImpresionDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerDetalleBoletoImpresion", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdBoleto", idBoleto);
                        comando.Parameters.AddWithValue("@IdEmpresa", idEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new BoletoImpresionDTO
                                {
                                    IdBoleto = Convert.ToInt32(dr["IdBoleto"]),
                                    NroComprobante = dr["NroComprobante"].ToString(),

                                    EmpresaNombre = dr["EmpresaNombre"].ToString(),
                                    EmpresaNIT = dr["EmpresaNIT"].ToString(),
                                    EmpresaDireccion = dr["EmpresaDireccion"].ToString(),
                                    EmpresaTelefono = dr["EmpresaTelefono"].ToString(),
                                    EmpresaLogoUrl = dr["EmpresaLogoUrl"].ToString(),

                                    Estado = Convert.ToInt32(dr["Estado"]),
                                    TipoTransaccion = dr["TipoTransaccion"].ToString(),
                                    CIPasajero = dr["CIPasajero"].ToString(),
                                    NombrePasajero = dr["NombrePasajero"].ToString(),
                                    CiudadOrigen = dr["CiudadOrigen"].ToString(),
                                    CiudadDestino = dr["CiudadDestino"].ToString(),
                                    // Formateamos Fecha y Hora directamente aquí para JS
                                    FechaSalidaStr = Convert.ToDateTime(dr["FechaSalida"]).ToString("dd/MM/yyyy"),
                                    HoraSalidaStr = ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm"),
                                    TipoBus = dr["TipoBus"].ToString(),
                                    PlacaBus = dr["PlacaBus"].ToString(),
                                    NroAsiento = Convert.ToInt32(dr["NroAsiento"]),
                                    LlevaMenorEdad = Convert.ToBoolean(dr["LlevaMenorEdad"]),
                                    CostoPasaje = Convert.ToDecimal(dr["CostoPasaje"])
                                };
                            }
                        }
                    }
                }

                return new Respuesta<BoletoImpresionDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Datos obtenidos." : "No se encontró el boleto."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<BoletoImpresionDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<ViajesDTO>> ListaViajesDetalles(int IdEmpresa, int IdRuta, int Estado)
        {
            try
            {
                List<ViajesDTO> rptLista = new List<ViajesDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarViajesDetalles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        comando.Parameters.AddWithValue("@IdRuta", IdRuta);
                        comando.Parameters.AddWithValue("@Estado", Estado);
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
                                    // v.HoraSalidaStr = ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm");
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
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ViajesDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<PasajeroViajeDTO>> ListaPasajerosViaje(int IdViaje, int IdEmpresa)
        {
            try
            {
                List<PasajeroViajeDTO> rptLista = new List<PasajeroViajeDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarPasajerosPorViaje", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdViaje", IdViaje);
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PasajeroViajeDTO
                                {
                                    IdBoleto = Convert.ToInt32(dr["IdBoleto"]),
                                    NroAsiento = Convert.ToInt32(dr["NroAsiento"]),
                                    IdPasajero = Convert.ToInt32(dr["IdPasajero"]),
                                    NombreCliente = dr["NombreCliente"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    CiudadOrigen = dr["CiudadOrigen"].ToString(),
                                    CiudadDestino = dr["CiudadDestino"].ToString(),
                                    CostoPasaje = Convert.ToDecimal(dr["CostoPasaje"]),
                                    LlevaMenorEdad = Convert.ToBoolean(dr["LlevaMenorEdad"]),
                                    NroComprobante = dr["NroComprobante"].ToString(),
                                    Estado = Convert.ToInt32(dr["Estado"]),
                                    EstadoTexto = dr["EstadoTexto"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PasajeroViajeDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<PasajeroViajeDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> PagarReserva(int IdBoleto, int IdEmpresa)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_PagarReserva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // 2. Parámetro
                        cmd.Parameters.AddWithValue("@IdBoleto", IdBoleto);
                        cmd.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);

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

                // 5. Interpretación de la respuesta
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Pago registrado exitosamente.";
                        break;

                    case 2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El boleto no existe.";
                        break;

                    case 3:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Este boleto ya fue pagado y emitido anteriormente.";
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

        public Respuesta<int> EliminarReserva(int IdBoleto, int IdEmpresa)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_EliminarReserva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // 2. Parámetro
                        cmd.Parameters.AddWithValue("@IdBoleto", IdBoleto);
                        cmd.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);

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

                // 5. Interpretación de la respuesta
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Reserva eliminada exitosamente.";
                        break;

                    case 2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "La reserva no existe o ya fue eliminada.";
                        break;

                    case 3:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "No se puede eliminar un boleto que ya tiene un comprobante de venta.";
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
