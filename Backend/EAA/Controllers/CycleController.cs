using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Response.Cycle;
using EAA.Domain.Models;
using EAA.Services.Services.Cycle;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CycleController : ControllerBase
    {
        private readonly ICycle_Services _cycleService;
        private readonly IEmailService _emailService;
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public CycleController(ICycle_Services cycleService, ErrorHandler error, IEmailService emailService,DbAppraisalContext dbAppraisal )
        {
            _cycleService = cycleService;
            _error = error;
            _emailService = emailService;
            _context = dbAppraisal;
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
        public async Task<IActionResult> SaveCycle([FromBody] CycleRequest_DTO request)
        {
            try
            {
                // ✅ Get logged-in user's EmployeeId from JWT
                var createdByClaim = User.FindFirstValue("EmployeeId");
                if (string.IsNullOrEmpty(createdByClaim))
                    return Unauthorized(new { Message = "EmployeeId claim missing in token." });

                request.CreatedBy = Convert.ToInt32(createdByClaim);

                // ✅ Save cycle using service
                var savedCycleResponse = _cycleService.SaveCycle(request);

                if (savedCycleResponse.StatusCode != 201 || savedCycleResponse.Data == null)
                    return BadRequest(new { Message = savedCycleResponse.Message ?? "Failed to save cycle." });

                var savedCycle = savedCycleResponse.Data; // CycleResponse_DTO

                // ✅ Notify HR creator
                var creatorResponse = _cycleService.GetEmployeeById(request.CreatedBy);
                if (creatorResponse.StatusCode == 200 && creatorResponse.Data != null && !string.IsNullOrEmpty(creatorResponse.Data.Email))
                {
                    var creator = creatorResponse.Data;
                    var subject = $"New Appraisal Cycle Created: {savedCycle.CycleName}";
                    var body = $@"
                        <p>Dear {creator.Name},</p>
                        <p>You have created a new appraisal cycle <strong>{savedCycle.CycleName}</strong>.</p>
                        <p>Start Date: {savedCycle.StartDate:dd MMM yyyy}<br/>
                        End Date: {savedCycle.EndDate:dd MMM yyyy}<br/>
                        Financial Year: {savedCycle.FinancialYearName}</p>";

                    await _emailService.SendEmailAsync(creator.Email, subject, body);
                }

                // ✅ Notify all employees of all units
                var employeesToNotify = _context.TblEmployees.ToList(); // All employees
                foreach (var emp in employeesToNotify)
                {
                    if (!string.IsNullOrEmpty(emp.Email))
                    {
                        var subject = $"New Appraisal Cycle: {savedCycle.CycleName}";
                        var body = $@"
                            <p>Dear {emp.Name},</p>
                            <p>A new appraisal cycle <strong>{savedCycle.CycleName}</strong> has been created for your unit.</p>
                            <p>Start Date: {savedCycle.StartDate:dd MMM yyyy}<br/>
                            End Date: {savedCycle.EndDate:dd MMM yyyy}</p>";

                        await _emailService.SendEmailAsync(emp.Email, subject, body);
                    }
                }

                // ✅ Optionally notify all managers
                var managersResponse = _cycleService.GetAllManagers();
                if (managersResponse.StatusCode == 200 && managersResponse.Data != null)
                {
                    foreach (var manager in managersResponse.Data)
                    {
                        if (!string.IsNullOrEmpty(manager.Email))
                        {
                            var subject = $"New Appraisal Cycle Started: {savedCycle.CycleName}";
                            var body = $@"
                            <p>Dear {manager.Name},</p>
                            <p>A new appraisal cycle <strong>{savedCycle.CycleName}</strong> has been created.</p>
                            <p>Start Date: {savedCycle.StartDate:dd MMM yyyy}<br/>
                            End Date: {savedCycle.EndDate:dd MMM yyyy}<br/>
                            Financial Year: {savedCycle.FinancialYearName}</p>
                            <p><a href='https://yourapp.com/cycles/{savedCycle.CycleId}'>View Cycle</a></p>";

                            await _emailService.SendEmailAsync(manager.Email, subject, body);
                        }
                    }
                }

                return Ok(savedCycle);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In CycleController -> CreateCycle");
                return StatusCode(500, new { Message = "Failed to save cycle details." });
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
