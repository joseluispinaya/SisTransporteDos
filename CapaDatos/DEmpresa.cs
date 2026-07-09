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
    public class DEmpresa
    {
        #region "PATRON SINGLETON"
        private static DEmpresa instancia = null;
        private DEmpresa() { }
        public static DEmpresa GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DEmpresa();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditEmpresa(EEmpresa objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditEmpresa", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdEmpresa", objeto.IdEmpresa);
                        cmd.Parameters.AddWithValue("@RazonSocial", objeto.RazonSocial);

                        cmd.Parameters.AddWithValue("@NIT", objeto.NIT);
                        cmd.Parameters.AddWithValue("@Direccion", objeto.Direccion);

                        cmd.Parameters.AddWithValue("@Telefono", objeto.Telefono);
                        cmd.Parameters.AddWithValue("@LogoUrl", string.IsNullOrEmpty(objeto.LogoUrl) ? "" : objeto.LogoUrl);
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
                        response.Mensaje = "Ya existe una empresa con esta RazonSocial o NIT";
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

        public Respuesta<List<EEmpresa>> ListaEmpresas()
        {
            try
            {
                List<EEmpresa> rptLista = new List<EEmpresa>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaEmpresas", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EEmpresa
                                {
                                    IdEmpresa = Convert.ToInt32(dr["IdEmpresa"]),
                                    RazonSocial = dr["RazonSocial"].ToString(),
                                    NIT = dr["NIT"].ToString(),
                                    Direccion = dr["Direccion"].ToString(),
                                    Telefono = dr["Telefono"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EEmpresa>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EEmpresa>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

    }
}
