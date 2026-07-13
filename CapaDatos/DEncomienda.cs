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
    public class DEncomienda
    {
        #region "PATRON SINGLETON"
        private static DEncomienda instancia = null;
        private DEncomienda() { }
        public static DEncomienda GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DEncomienda();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> RegistroRecepEncomienda(EEncomienda obj, int idOrigen)
        {
            try
            {
                int idGenerado = 0;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_RegistrarEncomienda", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;

                        comando.Parameters.AddWithValue("@IdEmpresa", obj.IdEmpresa);
                        comando.Parameters.AddWithValue("@IdViaje", obj.IdViaje);
                        comando.Parameters.AddWithValue("@IdRemitente", obj.IdRemitente);
                        comando.Parameters.AddWithValue("@IdDestinatario", obj.IdDestinatario);
                        comando.Parameters.AddWithValue("@IdOrigen", idOrigen);
                        comando.Parameters.AddWithValue("@IdDestino", obj.IdDestino);
                        comando.Parameters.AddWithValue("@Detalle", obj.Detalle);
                        comando.Parameters.Add(new SqlParameter("@PesoKg", SqlDbType.Decimal) { Value = obj.PesoKg });
                        comando.Parameters.Add(new SqlParameter("@MontoCobrado", SqlDbType.Decimal) { Value = obj.MontoCobrado });
                        comando.Parameters.AddWithValue("@EstadoPago", obj.EstadoPago);

                        SqlParameter paramResultado = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        comando.Parameters.Add(paramResultado);

                        con.Open();
                        comando.ExecuteNonQuery();

                        // Recuperamos el ID
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
                // sqlEx.Message contendrá el RAISERROR
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

        public Respuesta<EncomiendaImpresionDTO> ObtenerDetalleEncomiendaImpresion(int idEncomienda, int idEmpresa)
        {
            try
            {
                EncomiendaImpresionDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerDetalleEncomiendaImpresion", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEncomienda", idEncomienda);
                        comando.Parameters.AddWithValue("@IdEmpresa", idEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new EncomiendaImpresionDTO
                                {
                                    IdEncomienda = Convert.ToInt32(dr["IdEncomienda"]),
                                    NroComprobante = dr["NroComprobante"].ToString(),
                                    TipoTransaccion = dr["TipoTransaccion"].ToString(),

                                    // Datos del Remitente (Quien envía)
                                    CIRemitente = dr["CIRemitente"].ToString(),
                                    NombreRemitente = dr["NombreRemitente"].ToString(),
                                    CelularRemitente = dr["CelularRemitente"].ToString(),

                                    // Datos del Destinatario (Quien recibe)
                                    CIDestinatario = dr["CIDestinatario"].ToString(),
                                    NombreDestinatario = dr["NombreDestinatario"].ToString(),
                                    CelularDestinatario = dr["CelularDestinatario"].ToString(),

                                    CiudadOrigen = dr["CiudadOrigen"].ToString(),
                                    CiudadDestino = dr["CiudadDestino"].ToString(),

                                    // Formateamos Fecha y Hora directamente aquí para JS
                                    FechaSalidaStr = Convert.ToDateTime(dr["FechaSalida"]).ToString("dd/MM/yyyy"),
                                    HoraSalidaStr = ((TimeSpan)dr["HoraSalida"]).ToString(@"hh\:mm"),

                                    TipoBus = dr["TipoBus"].ToString(),
                                    PlacaBus = dr["PlacaBus"].ToString(),

                                    Detalle = dr["Detalle"].ToString(),
                                    PesoKg = Convert.ToDecimal(dr["PesoKg"]),
                                    MontoCobrado = Convert.ToDecimal(dr["MontoCobrado"])
                                };
                            }
                        }
                    }
                }

                return new Respuesta<EncomiendaImpresionDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Datos obtenidos." : "No se encontró el boleto."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<EncomiendaImpresionDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<EncomiendasViajeDTO>> ListaEncomiendasViaje(int IdViaje, int IdEmpresa)
        {
            try
            {
                List<EncomiendasViajeDTO> rptLista = new List<EncomiendasViajeDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarEncomiendasPorViaje", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdViaje", IdViaje);
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EncomiendasViajeDTO
                                {
                                    IdEncomienda = Convert.ToInt32(dr["IdEncomienda"]),
                                    NroComprobante = dr["NroComprobante"].ToString(),

                                    // Datos del Remitente (Quien envía)
                                    NombreRemitente = dr["NombreRemitente"].ToString(),
                                    CIRemitente = dr["CIRemitente"].ToString(),

                                    // Datos del Destinatario (Quien recibe)
                                    NombreDestinatario = dr["NombreDestinatario"].ToString(),
                                    CIDestinatario = dr["CIDestinatario"].ToString(),
                                    CelularDestinatario = dr["CelularDestinatario"].ToString(),

                                    CiudadOrigen = dr["CiudadOrigen"].ToString(),
                                    CiudadDestino = dr["CiudadDestino"].ToString(),

                                    Detalle = dr["Detalle"].ToString(),
                                    PesoKg = Convert.ToDecimal(dr["PesoKg"]),
                                    MontoCobrado = Convert.ToDecimal(dr["MontoCobrado"]),
                                    EstadoPago = Convert.ToInt32(dr["EstadoPago"]),
                                    EstadoPagoTexto = dr["EstadoPagoTexto"].ToString(),
                                    EstadoEnvio = Convert.ToInt32(dr["EstadoEnvio"]),
                                    EstadoEnvioTexto = dr["EstadoEnvioTexto"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EncomiendasViajeDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EncomiendasViajeDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
