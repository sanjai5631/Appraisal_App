using EAA.Application;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Services.Services.SelfAppraisal;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SelfAppraisalController : ControllerBase
    {
        private readonly ISelfAppraisal_Services _selfAppraisalService;
        private readonly ErrorHandler _error;

        public SelfAppraisalController(ISelfAppraisal_Services selfAppraisalService, ErrorHandler error)
        {
            _selfAppraisalService = selfAppraisalService;
            _error = error;
        }

        // GET: api/SelfAppraisal/GetAllSelfAppraisal
        [HttpGet("GetAllSelfAppraisal")]
        public IActionResult GetAllSelfAppraisal(int employeeId)
        {
            var response = new ApiResponse<List<SelfAppraisalResponse_DTO>>();
            try
            {
                response = _selfAppraisalService.GetAllSelfAppraisal(employeeId);

                if (response.Data == null || response.Data.Count == 0)
                {
                    response.StatusCode = 404;
                    response.Message = "No self-appraisal cycles found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "SelfAppraisalController -> GetAllSelfAppraisal");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve self-appraisal cycles.";
            }

            return StatusCode(response.StatusCode, response);
        }

        // GET: api/SelfAppraisal/GetSelfAppraisalById?financialYearId=1
        [HttpGet("GetSelfAppraisalById")]
        public IActionResult GetSelfAppraisalById(int financialYearId)
        {
            var response = new ApiResponse<SelfAppraisalResponse_DTO>();
            try
            {
                response = _selfAppraisalService.GetSelfAppraisalById(financialYearId);

                if (response.Data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Self-appraisal cycle not found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"SelfAppraisalController -> GetSelfAppraisalById({financialYearId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve self-appraisal cycle.";
            }

            return StatusCode(response.StatusCode, response);
        }
    }
}
