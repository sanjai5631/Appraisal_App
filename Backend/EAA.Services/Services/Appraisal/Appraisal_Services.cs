using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Infrastructure.Logic.Appraisal;
using System;
using System.Collections.Generic;

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

        public ApiResponse<AppraisalFormResponse_DTO> GetCurrentForm(int employeeId, int cycleId)
        {
            var response = new ApiResponse<AppraisalFormResponse_DTO>();
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

        public ApiResponse<bool> SubmitSelfAppraisal(SelfAppraisalRequest_DTO request)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = _appraisalInfra.SubmitSelfAppraisal(request);
                response.Data = result;
                response.StatusCode = result ? 200 : 400;
                response.Message = result ? "Self-appraisal submitted successfully" : "Failed to submit self-appraisal";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> SubmitSelfAppraisal");
                response.StatusCode = 500;
                response.Message = "Error submitting self-appraisal";
            }
            return response;
        }

        public ApiResponse<bool> SubmitManagerAppraisal(AppraisalRequest_DTO request, int managerId)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = _appraisalInfra.SubmitManagerAppraisal(request, managerId);
                response.Data = result;
                response.StatusCode = result ? 200 : 400;
                response.Message = result ? "Manager appraisal submitted successfully" : "Failed to submit manager appraisal";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_Services -> SubmitManagerAppraisal");
                response.StatusCode = 500;
                response.Message = "Error submitting manager appraisal";
            }
            return response;
        }
    }
}
