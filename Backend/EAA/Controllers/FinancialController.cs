using EAA.Application;
using EAA.Domain.DTO.Request.Financial;
using EAA.Services.Services.FinancialYear;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialController : ControllerBase
    {
        private readonly IFinancial_Services _financialYearService;
        private readonly ErrorHandler _error;

        public FinancialController(IFinancial_Services financialYearService, ErrorHandler error)
        {
            _financialYearService = financialYearService;
            _error = error;
        }

        // GET
        [HttpGet]
        [Route("GetAllFinancialYears")]
        public IActionResult GetAllFinancialYears()
        {
            try
            {
                return Ok(_financialYearService.GetAllFinancialYears());
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In FinancialController -> GetAllFinancialYears");
                return BadRequest(new { Message = "Failed to fetch all financial years." });
            }
        }

        // GET by Id
        [HttpGet]
        [Route("GetFinancialYearById")]
        public IActionResult GetFinancialYearById([FromQuery, Required] int FinancialYearId)
        {
            try
            {
                return Ok(_financialYearService.GetFinancialYearById(FinancialYearId));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In FinancialController -> GetFinancialYearById");
                return BadRequest(new { Message = "Failed to fetch financial year details." });
            }
        }

        // POST
        [HttpPost]
        [Route("CreateFinancialYear")]
        public IActionResult CreateFinancialYear([FromBody] FinancialYearRequest_DTO request)
        {
            try
            {
                return Ok(_financialYearService.SaveFinancialYear(request));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In FinancialController -> CreateFinancialYear");
                return BadRequest(new { Message = "Failed to create financial year." });
            }
        }

        // PUT
        [HttpPut]
        [Route("UpdateFinancialYear")]
        public IActionResult UpdateFinancialYear([FromQuery, Required] int financialYearId, [FromBody] FinancialYearRequest_DTO request)
        {
            try
            {
                return Ok(_financialYearService.UpdateFinancialYear(financialYearId, request));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In FinancialController -> UpdateFinancialYear");
                return BadRequest(new { Message = "Failed to update financial year." });
            }
        }

        // DELETE
        [HttpDelete]
        [Route("DeleteFinancialYear")]
        public IActionResult DeleteFinancialYear( int financialYearId)
        {
            try
            {
                return Ok(_financialYearService.DeleteFinancialYear(financialYearId));
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error In FinancialController -> DeleteFinancialYear");
                return BadRequest(new { Message = "Failed to delete financial year." });
            }
        }
    }
}
