using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.GetAllAppraisal;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Infrastructure.Logic.SelfAppraisal;
using EAA.Services.Services.SelfAppraisal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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


        [HttpGet]
        [Route("GetAllAppraisal")]
        public IActionResult GetAllAppraisal()
        {
            var response = new ApiResponse<List<GetAppraisalDetailResponse_DTO>>();
            try
            {
                response = _selfAppraisalService.GetAllAppraisal();

                if (response.Data == null || response.Data.Count == 0)
                {
                    response.StatusCode = 404;
                    response.Message = "No appraisals found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "SelfAppraisalController -> GetAllAppraisal");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisals.";
            }

            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        [Route("GetAppraisalById")]
        public IActionResult GetAppraisalById(int appraisalId)
        {
            var response = new ApiResponse<List<GetAppraisalDetailResponse_DTO>>();
            try
            {
                response = _selfAppraisalService.GetAppraisalById(appraisalId);

                if (response.Data == null || response.Data.Count == 0)
                {
                    response.StatusCode = 404;
                    response.Message = $"Appraisal with ID {appraisalId} not found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"SelfAppraisalController -> GetAppraisalById({appraisalId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve appraisal.";
            }

            return StatusCode(response.StatusCode, response);
        }

        [HttpGet]
        [Route("GetEmployeeById")]
        public IActionResult GetAppraial(int employeeId)
        {
            var response = new ApiResponse<List<GetAppraisalResponse_DTO>>();
            try
            {
                response = _selfAppraisalService.GetAppraisal(employeeId);

                if (response.Data == null || response.Data.Count == 0)
                {
                    response.StatusCode = 404;
                    response.Message = $"No appraisals found for employee ID {employeeId}.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"SelfAppraisalController -> GetAppraial({employeeId})");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve employee appraisal.";
            }

            return StatusCode(response.StatusCode, response);
        }
    }
}
