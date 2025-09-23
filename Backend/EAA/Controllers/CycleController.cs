using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Response.Cycle;
using EAA.Services.Services.Cycle;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CycleController : ControllerBase
    {
        private readonly ICycle_Services _cycleService;
        private readonly ErrorHandler _error;

        public CycleController(ICycle_Services cycleService, ErrorHandler error )
        {
            _cycleService = cycleService;
            _error = error;
        }

        // GET
        [HttpGet]
        [Route("GetAllCycles")]
        public IActionResult GetAllCycles()
        {
            try
            {
                return Ok(_cycleService.GetAllCycles());
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> GetAllCycle");
                return BadRequest(new { Message = "Failed to fetch all cycle details." });
            }
        }

        // GET
        [HttpGet]
        [Route("GetCycleById")]
        public IActionResult GetCycleById(int CycleId)
        {
            try
            {
                return Ok(_cycleService.GetCycleById(CycleId));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> GetCycle");
                return BadRequest(new { Message = "Failed to fetch cycle details." });
            }
        }

        // POST
        [HttpPost]
        [Route("CreateCycle")]
        public IActionResult SaveCycle([FromBody] CycleRequest_DTO request)
        {
            try
            {
                return Ok(_cycleService.SaveCycle(request));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> CreateCycle");
                return BadRequest(new { Message = "Failed to save cycle details." });
            }
        }

        // PUT
        [HttpPut]
        [Route("UpdateCycle")]
        public IActionResult UpdateCycle([FromQuery, Required] int CycleId, [FromBody] UpdateCycleRequest_DTO request)
        {
            try
            {
                return Ok(_cycleService.UpdateCycle(CycleId, request));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> UpdateCycle");
                return BadRequest(new { Message = "Failed to Update cycle details." });
            }
        }

        // DELETE
        [HttpDelete]
        [Route("DeleteCycle")]
        public IActionResult DeleteCycle(int CycleId)
        {
            try
            {
                return Ok(_cycleService.DeleteCycle(CycleId));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> DeleteCycle");
                return BadRequest(new { Message = "Failed to delete cycle details." });
            }
        }
    }
}
