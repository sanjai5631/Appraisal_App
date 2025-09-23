using EAA.Application;
using EAA.Domain.DTO.Request.GetAllAppraisal;
using EAA.Domain.DTO.Request.SelfAppraisal;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Infrastructure.Logic.SelfAppraisal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.SelfAppraisal
{
    public class SelfAppraisal_Services : ISelfAppraisal_Services
    {
        private readonly ISelfAppraisal_infrastructure _selfAppraisal;
        private readonly ErrorHandler _error;

        public SelfAppraisal_Services(ISelfAppraisal_infrastructure selfAppraisalInfrastructure, ErrorHandler errorHandler)
        {
            _selfAppraisal = selfAppraisalInfrastructure;
            _error = errorHandler;
        }

        public ApiResponse<List<GetAppraisalDetailResponse_DTO>> GetAllAppraisal()
        {
            var response = new ApiResponse<List<GetAppraisalDetailResponse_DTO>>();

            try
            {
                var data = _selfAppraisal.GetAllAppraisal();

                if (data == null || !data.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No appraisals found";
                    response.Data = new List<GetAppraisalDetailResponse_DTO>();
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Appraisals retrieved successfully";
                    response.Data = data;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SelfAppraisal_Services -> GetAllAppraisal");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisals";
                response.Data = new List<GetAppraisalDetailResponse_DTO>();
            }

            return response;
        }


        // Get all self-appraisal cycles
        public ApiResponse<List<SelfAppraisalResponse_DTO>> GetAllSelfAppraisal(int employeeId)
        {
            var response = new ApiResponse<List<SelfAppraisalResponse_DTO>>();

            try
            {
                var data = _selfAppraisal.GetAllSelfAppraisal(employeeId);

                if (data == null || !data.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No appraisal cycles found";
                    response.Data = new List<SelfAppraisalResponse_DTO>();
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Appraisal cycles retrieved successfully";
                    response.Data = data;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SelfAppraisal_Services -> GetAllSelfAppraisal");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisal cycles";
            }

            return response;
        }

        public ApiResponse<List<GetAppraisalDetailResponse_DTO>> GetAppraisalById(int appraisalId)
        {
            var response = new ApiResponse<List<GetAppraisalDetailResponse_DTO>>();

            try
            {
                // Call the infrastructure layer to get appraisal(s) by ID
                var data = _selfAppraisal.GetAppraisalById(appraisalId);

                if (data == null || !data.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "Appraisal not found";
                    response.Data = new List<GetAppraisalDetailResponse_DTO>();
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Appraisal retrieved successfully";
                    response.Data = data;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in SelfAppraisal_Services -> GetAppraisalById({appraisalId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisal";
                response.Data = new List<GetAppraisalDetailResponse_DTO>();
            }

            return response;
        }


        // Get a single self-appraisal cycle by financialYearId
        public ApiResponse<SelfAppraisalResponse_DTO> GetSelfAppraisalById(int financialYearId)
        {
            var response = new ApiResponse<SelfAppraisalResponse_DTO>();

            try
            {
                var data = _selfAppraisal.GetSelfAppraisalById(financialYearId);

                if (data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Appraisal cycle not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Appraisal cycle retrieved successfully";
                    response.Data = data;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in SelfAppraisal_Services -> GetSelfAppraisalById({financialYearId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisal cycle";
            }

            return response;
        }
        public ApiResponse<List<GetAppraisalResponse_DTO>> GetAppraisal(int employeeId)
        {
            var response = new ApiResponse<List<GetAppraisalResponse_DTO>>();

            try
            {
                // Call the infrastructure layer to get appraisal data
                var data = _selfAppraisal.GetAppraisal(employeeId);

                if (data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Employee appraisal not found";
                    response.Data = null;
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employee appraisal retrieved successfully";
                    response.Data = data;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in SelfAppraisal_Services -> GetAppraisal({employeeId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve employee appraisal";
                response.Data = null;
            }

            return response;
        }
    }
}
