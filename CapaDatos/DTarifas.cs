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
    public class DTarifas
    {
        #region "PATRON SINGLETON"
        private static DTarifas instancia = null;
        private DTarifas() { }
        public static DTarifas GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DTarifas();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<TarifasDTO>> ListaTarifas(int IdEmpresa)
        {
            try
            {
                List<TarifasDTO> rptLista = new List<TarifasDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaTarifas", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEmpresa", IdEmpresa);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new TarifasDTO
                                {
                                    IdTarifa = Convert.ToInt32(dr["IdTarifa"]),
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    IdOrigen = Convert.ToInt32(dr["IdOrigen"]),
                                    IdDestino = Convert.ToInt32(dr["IdDestino"]),
                                    IdTipoBus = Convert.ToInt32(dr["IdTipoBus"]),
                                    PrecioPasaje = Convert.ToDecimal(dr["PrecioPasaje"]),
                                    PrecioKiloEncomienda = Convert.ToDecimal(dr["PrecioKiloEncomienda"]),
                                    CiudadOrigen = dr["CiudadOrigen"].ToString(),
                                    CiudadDestino = dr["CiudadDestino"].ToString(),
                                    NombreTipo = dr["NombreTipo"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<TarifasDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<TarifasDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> GuardarOrEditTarifarios(TarifasDTO objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditTarifarios", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdTarifa", objeto.IdTarifa);
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@IdOrigen", objeto.IdOrigen);

                        cmd.Parameters.AddWithValue("@IdDestino", objeto.IdDestino);
                        cmd.Parameters.AddWithValue("@IdTipoBus", objeto.IdTipoBus);

                        cmd.Parameters.AddWithValue("@PrecioPasaje", objeto.PrecioPasaje);
                        cmd.Parameters.AddWithValue("@PrecioKiloEncomienda", objeto.PrecioKiloEncomienda);

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
                        response.Mensaje = "Error Ya existe una tarifa para esta ruta y tipo de bus.";
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

                    case 4: // Son iguales
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error el Origen y Destino son iguales.";
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

    }
}
