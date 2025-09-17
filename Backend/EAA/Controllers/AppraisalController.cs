using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Services.Services.Appraisal;
using Microsoft.AspNetCore.Mvc;
using System;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppraisalController : ControllerBase
    {
        private readonly IAppraisal_Services _appraisalService;
        private readonly ErrorHandler _error;

        public AppraisalController(IAppraisal_Services appraisalService, ErrorHandler error)
        {
            _appraisalService = appraisalService;
            _error = error;
        }

        // GET-GetCurrentForm
        [HttpGet]
        [Route("GetCurrentForm")]
        public IActionResult GetCurrentForm(int employeeId, int cycleId)
        {
            var response = new ApiResponse<AppraisalFormResponse_DTO>();
            try
            {
                response = _appraisalService.GetCurrentForm(employeeId, cycleId);
                if (response.Data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Appraisal form not found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> GetCurrentForm");
                response.StatusCode = 500;
                response.Message = "Failed to fetch appraisal form.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // POST-SubmitSelfAppraisal
        [HttpPost]
        [Route("SubmitSelfAppraisal")]
        public IActionResult SubmitSelfAppraisal([FromBody] SelfAppraisalRequest_DTO request)
        {
            var response = new ApiResponse<bool>();
            try
            {
                response = _appraisalService.SubmitSelfAppraisal(request);
                if (!response.Data)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to submit self-appraisal.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> SubmitSelfAppraisal");
                response.StatusCode = 500;
                response.Message = "Error occurred while submitting self-appraisal.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // POST-SubmitManagerAppraisal
        [HttpPost]
        [Route("SubmitManagerAppraisal")]
        public IActionResult SubmitManagerAppraisal([FromBody] AppraisalRequest_DTO request, [FromQuery] int managerId)
        {
            var response = new ApiResponse<bool>();
            try
            {
                response = _appraisalService.SubmitManagerAppraisal(request, managerId);
                if (!response.Data)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to submit manager appraisal.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> SubmitManagerAppraisal");
                response.StatusCode = 500;
                response.Message = "Error occurred while submitting manager appraisal.";
            }
            return StatusCode(response.StatusCode, response);
        }
    }
}
