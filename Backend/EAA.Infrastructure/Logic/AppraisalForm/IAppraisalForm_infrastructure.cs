using EAA.Domain.DTO.Request.Template;
using EAA.Domain.DTO.Response.Template;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.AppraisalForm
{
    public interface IAppraisalForm_infrastructure
    {
        List<TemplateResponse_DTO> GetAllTemplates();
        TemplateResponse_DTO GetTemplateById(int templateId);
        TemplateResponse_DTO GetByDeptId(int departmentId, int employeeId, int cycleId);
        TemplateResponse_DTO SaveTemplate(TemplateRequest_DTO request);
        UpdateTemplateResponse_DTO UpdateTemplate(int templateId, UpdateTemplateRequest_DTO request);
        string DeleteTemplate(int templateId);
    }
}
