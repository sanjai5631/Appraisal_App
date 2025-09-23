using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Services.Services.Appraisal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        [HttpGet("GetByUnitId")]
        public IActionResult GetUnitAppraisals([FromQuery] int managerId, [FromQuery] int? cycleId = null)
        {
            try
            {
                var response = _appraisalService.GetUnitAppraisals(managerId, cycleId);

                if (response.Data == null || !response.Data.Any())
                {
                    return NotFound(new ApiResponse<List<UnitAppraisalResponseDTO>>
                    {
                        StatusCode = 404,
                        Message = "No appraisals found for the given filters.",
                        Data = new List<UnitAppraisalResponseDTO>()
                    });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> GetUnitAppraisals");
                return StatusCode(500, new ApiResponse<List<UnitAppraisalResponseDTO>>
                {
                    StatusCode = 500,
                    Message = "Error occurred while retrieving unit appraisals.",
                    Data = new List<UnitAppraisalResponseDTO>()
                });
            }
        }

        [HttpPut]
        [Route("UpdateAppraisal")]
        public IActionResult UpdateAppraisal(int appraisalId, [FromBody] AppraisalDTO request)
        {
            try
            {
                var response = _appraisalService.UpdateAppraisal(appraisalId, request);

                if (response.Data)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        StatusCode = 200,
                        Message = "Appraisal updated successfully",
                        Data = true
                    });
                }
                else
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        StatusCode = 400,
                        Message = "Failed to update appraisal",
                        Data = false
                    });
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalController -> UpdateAppraisal");
                return StatusCode(500, new ApiResponse<bool>
                {
                    StatusCode = 500,
                    Message = "Error updating appraisal",
                    Data = false
                });
            }
        }


    }
}
