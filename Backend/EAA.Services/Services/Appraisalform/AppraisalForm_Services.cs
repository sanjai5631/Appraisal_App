using EAA.Application;
using EAA.Domain.DTO.Request.Template;
using EAA.Domain.DTO.Response.Template;
using EAA.Infrastructure.Logic.AppraisalForm;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EAA.Services.Services.AppraisalForm
{
    public class AppraisalForm_Services : IAppraisalForm_Services
    {
        private readonly IAppraisalForm_infrastructure _appraisalForm;
        private readonly ErrorHandler _error;

        public AppraisalForm_Services(IAppraisalForm_infrastructure appraisalFormInfrastructure, ErrorHandler errorHandler)
        {
            _appraisalForm = appraisalFormInfrastructure;
            _error = errorHandler;
        }

        public ApiResponse<List<TemplateResponse_DTO>> GetAllTemplates()
        {
            var response = new ApiResponse<List<TemplateResponse_DTO>>();
            try
            {
                var templates = _appraisalForm.GetAllTemplates();

                if (templates == null || !templates.Any())
                {
                    response.StatusCode = 404;
                    response.Message = "No templates found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Templates retrieved successfully";
                    response.Data = templates;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalForm_Services -> GetAllTemplates");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve templates";
            }
            return response;
        }

        public ApiResponse<TemplateResponse_DTO> GetTemplateById(int templateId)
        {
            var response = new ApiResponse<TemplateResponse_DTO>();
            try
            {
                var template = _appraisalForm.GetTemplateById(templateId);

                if (template == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Template retrieved successfully";
                    response.Data = template;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalForm_Services -> GetTemplateById");
                response.StatusCode = 500;
                response.Message = "Failed to retrieve template";
            }
            return response;
        }

        public ApiResponse<TemplateResponse_DTO> SaveTemplate(TemplateRequest_DTO request)
        {
            var response = new ApiResponse<TemplateResponse_DTO>();
            try
            {
                var template = _appraisalForm.SaveTemplate(request);

                if (template == null)
                {
                    response.StatusCode = 400;
                    response.Message = "Failed to save template";
                }
                else
                {
                    response.StatusCode = 201;
                    response.Message = "Template saved successfully";
                    response.Data = template;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalForm_Services -> SaveTemplate");
                response.StatusCode = 500;
                response.Message = "Failed to save template";
            }
            return response;
        }

        public ApiResponse<UpdateTemplateResponse_DTO> UpdateTemplate(int templateId, UpdateTemplateRequest_DTO request)
        {
            var response = new ApiResponse<UpdateTemplateResponse_DTO>();
            try
            {
                var updatedTemplate = _appraisalForm.UpdateTemplate(templateId, request);

                if (updatedTemplate == null)
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found or not updated";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Template updated successfully";
                    response.Data = updatedTemplate;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalForm_Services -> UpdateTemplate");
                response.StatusCode = 500;
                response.Message = "Failed to update template";
            }
            return response;
        }

        public ApiResponse<string> DeleteTemplate(int templateId)
        {
            var response = new ApiResponse<string>();
            try
            {
                var result = _appraisalForm.DeleteTemplate(templateId);

                if (string.IsNullOrEmpty(result))
                {
                    response.StatusCode = 404;
                    response.Message = "Template not found";
                }
                else
                {
                    response.StatusCode = 200;
                    response.Message = "Template deleted successfully";
                    response.Data = result;
                }
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalForm_Services -> DeleteTemplate");
                response.StatusCode = 500;
                response.Message = "Failed to delete template";
            }
            return response;
        }
    }
}
