using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
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
    }
}
