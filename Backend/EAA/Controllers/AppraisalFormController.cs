using EAA.Application;
using EAA.Domain.DTO.Request.Template;
using EAA.Domain.DTO.Response.Template;
using EAA.Services.Services.AppraisalForm;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace EAA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppraisalFormController : ControllerBase
    {
        private readonly IAppraisalForm_Services _appraisalFormService;
        private readonly ErrorHandler _error;

        public AppraisalFormController(IAppraisalForm_Services appraisalFormService, ErrorHandler error)
        {
            _appraisalFormService = appraisalFormService;
            _error = error;
        }

        // GET: api/AppraisalForm/GetAllTemplates
        [HttpGet]
        [Route("GetAllTemplates")]
        public IActionResult GetAllTemplates()
        {
            var response = new ApiResponse<List<TemplateResponse_DTO>>();
            try
            {
                response = _appraisalFormService.GetAllTemplates();
                if (response.Data == null || !response.Data.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No templates found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> GetAllTemplates");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve templates.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // GET: api/AppraisalForm/GetTemplateById
        [HttpGet]
        [Route("GetTemplateById")]
        public IActionResult GetTemplateById(int templateId)
        {
            var response = new ApiResponse<TemplateResponse_DTO>();
            try
            {
                response = _appraisalFormService.GetTemplateById(templateId);
                if (response.Data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> GetTemplateById");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve template.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // POST: api/AppraisalForm/SaveTemplate
        [HttpPost]
        [Route("SaveTemplate")]
        public IActionResult SaveTemplate([FromBody] TemplateRequest_DTO request)
        {
            var response = new ApiResponse<TemplateResponse_DTO>();
            try
            {
                response = _appraisalFormService.SaveTemplate(request);
                if (response.Data == null)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to save template.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> SaveTemplate");
                response.StatusCode = 500;
                response.Message = "Error occurred while saving template.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // PUT: api/AppraisalForm/UpdateTemplate
        [HttpPut]
        [Route("UpdateTemplate")]
        public IActionResult UpdateTemplate(int templateId, [FromBody] UpdateTemplateRequest_DTO request)
        {
            var response = new ApiResponse<UpdateTemplateResponse_DTO>();
            try
            {
                response = _appraisalFormService.UpdateTemplate(templateId, request);
                if (response.Data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found or not updated.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> UpdateTemplate");
                response.StatusCode = 500;
                response.Message = "Failed to update template.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // DELETE: api/AppraisalForm/DeleteTemplate
        [HttpDelete]
        [Route("DeleteTemplate")]
        public IActionResult DeleteTemplate(int templateId)
        {
            var response = new ApiResponse<string>();
            try
            {
                response = _appraisalFormService.DeleteTemplate(templateId);
                if (string.IsNullOrEmpty(response.Data))
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> DeleteTemplate");
                response.StatusCode = 500;
                response.Message = "Failed to delete template.";
            }
            return StatusCode(response.StatusCode, response);
        }

        // GET: api/AppraisalForm/GetTemplateByDeptId
        [HttpGet]
        [Route("GetTemplateByDeptId")]
        public IActionResult GetTemplateByDeptId(int departmentId, int employeeId, int cycleId)
        {
            var response = new ApiResponse<TemplateResponse_DTO>();
            try
            {
                response = _appraisalFormService.GetByDeptId(departmentId, employeeId, cycleId);
                if (response.Data == null)
                {
                    response.StatusCode = 404;
                    response.Message = "No template found for the given department.";
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "AppraisalFormController -> GetTemplateByDeptId");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve template.";
            }
            return StatusCode(response.StatusCode, response);
        }

    }
}
