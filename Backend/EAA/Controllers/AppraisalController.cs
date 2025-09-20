using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Services.Services.Appraisal;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

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

        // GET: api/Appraisal/GetCurrentForm?employeeId=1&cycleId=1
        [HttpGet("GetCurrentForm")]
        public IActionResult GetCurrentForm(int employeeId, int cycleId)
        {
            try
            {
                var response = _appraisalService.GetCurrentForm(employeeId, cycleId);

                if (response.Data == null)
                {
                    return NotFound(new ApiResponse<AppraisalResponseDTO>
                    {
                        StatusCode = 404,
                        Message = "Appraisal form not found.",
                        Data = null
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> GetCurrentForm");
                return StatusCode(500, new ApiResponse<AppraisalResponseDTO>
                {
                    StatusCode = 500,
                    Message = "Failed to fetch appraisal form.",
                    Data = null
                });
            }
        }

        // POST: api/Appraisal/SubmitSelfAppraisal
        [HttpPost("SubmitSelfAppraisal")]
        public IActionResult SubmitAppraisal([FromBody] AppraisalDTO request)
        {
            try
            {
                var createdBy = User.FindFirstValue("EmployeeId");
                request.CreatedBy = Convert.ToInt32(createdBy);
                var response = _appraisalService.SubmitAppraisal(request);

                if (!response.Data)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        StatusCode = 400,
                        Message = "Failed to submit self-appraisal.",
                        Data = false
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> SubmitSelfAppraisal");
                return StatusCode(500, new ApiResponse<bool>
                {
                    StatusCode = 500,
                    Message = "Error occurred while submitting self-appraisal.",
                    Data = false
                });
            }
        }

        // POST: api/Appraisal/SubmitManagerAppraisal?managerId=5
        [HttpPost("SubmitManagerAppraisal")]
        public IActionResult SubmitManagerReview([FromBody] AppraisalDTO request, [FromQuery] int managerId)
        {
            try
            {
                var response = _appraisalService.SubmitManagerReview(request, managerId);

                if (!response.Data)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        StatusCode = 400,
                        Message = "Failed to submit manager appraisal.",
                        Data = false
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> SubmitManagerAppraisal");
                return StatusCode(500, new ApiResponse<bool>
                {
                    StatusCode = 500,
                    Message = "Error occurred while submitting manager appraisal.",
                    Data = false
                });
            }
        }
    }
}
