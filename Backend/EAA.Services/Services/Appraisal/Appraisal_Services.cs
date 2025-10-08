using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Request.Mail;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Infrastructure.Logic.Appraisal;
using System;

namespace EAA.Services.Services.Appraisal
{
    public class Appraisal_Services : IAppraisal_Services
    {
        private readonly IAppraisal_infrastructure _appraisalInfra;
        private readonly ErrorHandler _error;

        public Appraisal_Services(IAppraisal_infrastructure appraisalInfra, ErrorHandler error)
        {
            _appraisalInfra = appraisalInfra;
            _error = error;
        }

        // Fetch current appraisal form
        public ApiResponse<AppraisalResponseDTO> GetCurrentForm(int employeeId, int cycleId)
        {
            var response = new ApiResponse<AppraisalResponseDTO>();
            try
            {
                var form = _appraisalInfra.GetCurrentForm(employeeId, cycleId);
                response.Data = form;
                response.StatusCode = 200;
                response.Message = form != null ? "Appraisal form retrieved successfully" : "No appraisal form found";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> GetCurrentForm");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisal form";
            }
            return response;
        }

        public ApiResponse<EmployeeDTO> GetEmployeeById(int employeeId)
        {
            var response = new ApiResponse<EmployeeDTO>();
            try
            {
                var employee = _appraisalInfra.GetEmployeeById(employeeId);
                if (employee == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Employee not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Employee fetched successfully";
                    response.Data = employee;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Appraisal_Services -> GetEmployeeById");
                response.StatusCode = 500;
                response.Message = "Failed to fetch employee";
            }
            return response;
        }

        public ApiResponse<EmployeeDTO> GetManagerByUnit(int unitId)
        {
            var response = new ApiResponse<EmployeeDTO>();
            try
            {
                var manager = _appraisalInfra.GetManagerByUnit(unitId);
                if (manager == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Manager not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Manager fetched successfully";
                    response.Data = manager;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Appraisal_Services -> GetManagerByUnit");
                response.StatusCode = 500;
                response.Message = "Failed to fetch manager";
            }
            return response;
        }

        public ApiResponse<List<UnitAppraisalResponseDTO>> GetUnitAppraisals(int managerId, int? cycleId = null)
        {
            var response = new ApiResponse<List<UnitAppraisalResponseDTO>>();
            try
            {
                var result = _appraisalInfra.GetUnitAppraisals(managerId, cycleId);

                response.Data = result;
                response.StatusCode = (result != null && result.Any()) ? 200 : 404;
                response.Message = (result != null && result.Any())
                    ? "Unit appraisals retrieved successfully"
                    : "No appraisals found for the given filters.";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Appraisal_Services -> GetUnitAppraisals(managerId: {managerId}, cycleId: {cycleId})");
                response.StatusCode = 500;
                response.Message = "Error retrieving unit appraisals";
            }
            return response;
        }

        // Submit self-appraisal or new appraisal
        public ApiResponse<bool> SubmitAppraisal(AppraisalDTO request)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = _appraisalInfra.SubmitAppraisal(request);
                response.Data = result;
                response.StatusCode = result ? 200 : 400;
                response.Message = result ? "Self-appraisal submitted successfully" : "Failed to submit self-appraisal";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> SubmitAppraisal");
                response.StatusCode = 500;
                response.Message = "Error submitting self-appraisal";
            }
            return response;
        }

        // Submit manager review
        public ApiResponse<bool> SubmitManagerReview(AppraisalDTO request, int managerId)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = _appraisalInfra.SubmitManagerReview(request, managerId);
                response.Data = result;
                response.StatusCode = result ? 200 : 400;
                response.Message = result ? "Manager appraisal submitted successfully" : "Failed to submit manager appraisal";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> SubmitManagerReview");
                response.StatusCode = 500;
                response.Message = "Error submitting manager appraisal";
            }
            return response;
        }
        //Update Appraisal
        public ApiResponse<bool> UpdateAppraisal(int appraisalId, AppraisalDTO request)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = _appraisalInfra.UpdateAppraisal(appraisalId, request); 
                response.Data = result;
                response.StatusCode = result ? 200 : 400;
                response.Message = result ? "Appraisal updated successfully" : "Failed to update appraisal";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> UpdateAppraisal");
                response.StatusCode = 500;
                response.Message = "Error updating appraisal";
            }
            return response;
        }

    }
}
