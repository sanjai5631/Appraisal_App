using EAA.Application;
using EAA.Domain.DTO.Request.Financial;
using EAA.Domain.DTO.Response.Financial;
using EAA.Infrastructure.Logic.FinancialYear;

namespace EAA.Services.Services.FinancialYear
{
    public class Financial_Services : IFinancial_Services
    {
        private readonly IFinancial_infrastructure _financial;
        private readonly ErrorHandler _error;

        public Financial_Services(IFinancial_infrastructure financialInfrastructure, ErrorHandler errorHandler)
        {
            _financial = financialInfrastructure;
            _error = errorHandler;
        }

        public ApiResponse<List<FinancialYearResponse_DTO>> GetAllFinancialYears()
        {
            var response = new ApiResponse<List<FinancialYearResponse_DTO>>();
            try
            {
                var years = _financial.GetAllFinancialYears();

                if (years == null || !years.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No financial years found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Financial years retrieved successfully";
                    response.Data = years;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_Services -> GetAllFinancialYears");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve financial years";
            }
            return response;
        }

        public ApiResponse<FinancialYearResponse_DTO> GetFinancialYearById(int financialYearId)
        {
            var response = new ApiResponse<FinancialYearResponse_DTO>();
            try
            {
                var year = _financial.GetFinancialYearById(financialYearId);

                if (year == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Financial year not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Financial year retrieved successfully";
                    response.Data = year;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_Services -> GetFinancialYearById");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve financial year";
            }
            return response;
        }

        public ApiResponse<FinancialYearResponse_DTO> SaveFinancialYear(FinancialYearRequest_DTO financialYearRequest)
        {
            var response = new ApiResponse<FinancialYearResponse_DTO>();
            try
            {
                var year = _financial.SaveFinancialYear(financialYearRequest);

                if (year == null)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to save financial year";
                }
                else
                {
                    response.StatusCode = 201;
                    response.Message = "Financial year saved successfully";
                    response.Data = year;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_Services -> SaveFinancialYear");
                response.StatusCode = 500;
                response.Message = "Failed to save financial year";
            }
            return response;
        }

        public ApiResponse<FinancialYearResponse_DTO> UpdateFinancialYear(int financialYearId, FinancialYearRequest_DTO updateRequest)
        {
            var response = new ApiResponse<FinancialYearResponse_DTO>();
            try
            {
                var updatedYear = _financial.UpdateFinancialYear(financialYearId, updateRequest);

                if (updatedYear == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Financial year not found or not updated";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Financial year updated successfully";
                    response.Data = updatedYear;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_Services -> UpdateFinancialYear");
                response.StatusCode = 500;
                response.Message = "Failed to update financial year";
            }
            return response;
        }

        public ApiResponse<string> DeleteFinancialYear(int financialYearId)
        {
            var response = new ApiResponse<string>();
            try
            {
                var result = _financial.DeleteFinancialYear(financialYearId);

                if (string.IsNullOrEmpty(result))
                {
                    response.StatusCode = 404;
                    response.Message = "Financial year not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Financial year deleted successfully";
                    response.Data = result;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_Services -> DeleteFinancialYear");
                response.StatusCode = 500;
                response.Message = "Failed to delete financial year";
            }
            return response;
        }
    }
}
