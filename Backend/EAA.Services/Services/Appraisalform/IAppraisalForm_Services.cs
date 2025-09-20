using EAA.Application;
using EAA.Domain.DTO.Request.Template;
using EAA.Domain.DTO.Response.Template;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.AppraisalForm
{
    public interface IAppraisalForm_Services
    {
        ApiResponse<List<TemplateResponse_DTO>> GetAllTemplates();
        ApiResponse<TemplateResponse_DTO> GetTemplateById(int templateId);
        ApiResponse<TemplateResponse_DTO> SaveTemplate(TemplateRequest_DTO request);
        ApiResponse <TemplateResponse_DTO> GetByDeptId(int departmentId, int employeeId, int cycleId);
        ApiResponse<UpdateTemplateResponse_DTO> UpdateTemplate(int templateId, UpdateTemplateRequest_DTO request);
        ApiResponse<string> DeleteTemplate(int templateId);
    }
}
