using EAA.Application;
using EAA.Domain.DTO.Request.Template;
using EAA.Domain.DTO.Response.Template;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.AppraisalForm
{
    public class AppraisalForm_infrastructure : IAppraisalForm_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public AppraisalForm_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        public List<TemplateResponse_DTO> GetAllTemplates()
        {
            try
            {
                return _context.TblAppraisalTemplates
                    .Include(t => t.Department)
                    .Include(t => t.TblTemplateKpis)
                        .ThenInclude(tk => tk.Kpi)
                    .Select(t => new TemplateResponse_DTO
                    {
                        TemplateId = t.TemplateId,
                        TemplateName = t.TemplateName,
                        TemplateDescription = t.Description,
                        DepartmentName = t.Department != null ? t.Department.DeptName : null,
                        Kpis = t.TblTemplateKpis.Select(tk => new TemplateKpiResponse_DTO
                        {
                            KpiId = tk.KpiId ?? 0,
                            KpiTitle = tk.Kpi.Title,
                            KpiDescription = tk.Kpi.Description,
                            KpiWeightage = tk.Weightage??0
                        }).ToList()
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalTemplate_Infrastructure -> GetAllTemplates");
                return new List<TemplateResponse_DTO>();
            }
        }

        public TemplateResponse_DTO GetTemplateById(int templateId)
        {
            try
            {
                var t = _context.TblAppraisalTemplates
                    .Include(t => t.Department)
                    .Include(t => t.TblTemplateKpis)
                        .ThenInclude(tk => tk.Kpi)
                    .FirstOrDefault(t => t.TemplateId == templateId);

                if (t == null) return null!;

                return new TemplateResponse_DTO
                {
                    TemplateId = t.TemplateId,
                    TemplateName = t.TemplateName,
                    TemplateDescription = t.Description,
                    DepartmentName = t.Department?.DeptName,
                    Kpis = t.TblTemplateKpis.Select(tk => new TemplateKpiResponse_DTO
                    {
                        KpiId = tk.KpiId ?? 0,
                        KpiTitle = tk.Kpi.Title,
                        KpiDescription = tk.Kpi.Description,
                        KpiWeightage = tk.Weightage??0
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in AppraisalTemplate_Infrastructure -> GetTemplateById({templateId})");
                return null!;
            }
        }

        public TemplateResponse_DTO SaveTemplate(TemplateRequest_DTO request)
        {
            try
            {
                var template = new TblAppraisalTemplate
                {
                    TemplateName = request.TemplateName,
                    DepartmentId = request.DepartmentId,
                    Description = request.Description,
                    IsActive = true,
                    CreatedOn = DateTime.Now,
                    TblTemplateKpis = request.Kpis.Select(k => new TblTemplateKpi
                    {
                        KpiId = k.KpiId,
                        Weightage = k.Weightage,

                    }).ToList()
                };

                _context.TblAppraisalTemplates.Add(template);
                _context.SaveChanges();

                return GetTemplateById(template.TemplateId);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in AppraisalTemplate_Infrastructure -> SaveTemplate");
                return null!;
            }
        }

        public UpdateTemplateResponse_DTO UpdateTemplate(int templateId, UpdateTemplateRequest_DTO request)
        {
            try
            {
                var template = _context.TblAppraisalTemplates
                    .Include(t => t.TblTemplateKpis)
                    .FirstOrDefault(t => t.TemplateId == templateId);

                if (template == null) return null!;

                template.TemplateName = request.TemplateName;
                template.Description = request.Description;
                template.DepartmentId = request.DepartmentId;
                template.IsActive = request.IsActive;
                template.ModifiedOn = DateTime.Now;

                // Remove old KPIs and add new ones
                _context.TblTemplateKpis.RemoveRange(template.TblTemplateKpis);
                template.TblTemplateKpis = request.Kpis.Select(k => new TblTemplateKpi
                {
                    TemplateId = templateId,
                    KpiId = k.KpiId,
                    Weightage = k.Weightage
                }).ToList();

                _context.SaveChanges();

                return new UpdateTemplateResponse_DTO
                {
                    TemplateId = template.TemplateId,
                    TemplateName = template.TemplateName,
                    TemplateDescription = template.Description,
                    DepartmentName = template.Department?.DeptName,
                    Kpis = template.TblTemplateKpis.Select(tk => new TemplateKpiResponse_DTO
                    {
                        KpiId = tk.KpiId ?? 0,
                        KpiTitle = tk.Kpi.Title,
                        KpiDescription = tk.Kpi.Description,
                        KpiWeightage = tk.Weightage??0
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in AppraisalTemplate_Infrastructure -> UpdateTemplate({templateId})");
                return null!;
            }
        }

        public string DeleteTemplate(int templateId)
        {
            try
            {
                var template = _context.TblAppraisalTemplates
                    .Include(t => t.TblTemplateKpis)
                    .FirstOrDefault(t => t.TemplateId == templateId);

                if (template == null) return "Template not found";

                _context.TblTemplateKpis.RemoveRange(template.TblTemplateKpis);
                _context.TblAppraisalTemplates.Remove(template);
                _context.SaveChanges();

                return "Template deleted successfully";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in AppraisalTemplate_Infrastructure -> DeleteTemplate({templateId})");
                return $"Error deleting template: {ex.Message}";
            }
        }

        public TemplateResponse_DTO GetByDeptId(int departmentId, int employeeId, int cycleId)
        {
            try
            {
                // Get template by department
                var template = _context.TblAppraisalTemplates
                    .Include(t => t.Department)
                    .Include(t => t.TblTemplateKpis)
                        .ThenInclude(tk => tk.Kpi)
                    .FirstOrDefault(t => t.DepartmentId == departmentId);

                if (template == null)
                    return null;

                // Get appraisal for this employee + cycle + template
                var appraisal = _context.TblAppraisals
                    .Include(a => a.TblAppraisalResponses)
                    .FirstOrDefault(a => a.EmployeeId == employeeId
                                         && a.CycleId == cycleId
                                         && a.TemplateId == template.TemplateId);

                // Map KPI responses
                var kpiResponses = template.TblTemplateKpis.Select(tk =>
                {
                    var response = appraisal?.TblAppraisalResponses
                                           .FirstOrDefault(r => r.KpiId == tk.KpiId);

                    return new TemplateKpiResponse_DTO
                    {
                        
                        KpiId = tk.KpiId ?? 0,
                        KpiTitle = tk.Kpi?.Title ?? "",
                        KpiDescription = tk.Kpi?.Description ?? "",
                        KpiWeightage = tk.Weightage ?? 0,
                        AgileScore = (int)(response?.SelfScore ?? 0),
                        SupervisorScore = (int)(response?.SupervisorScore ?? 0m),
                        AssociateComment = response?.AssociateComment ?? "",
                        SupervisorComment = response?.SupervisorComment ?? ""
                    };
                }).ToList();

                // Build DTO with overall comments
                return new TemplateResponse_DTO
                {
                    TemplateId = template.TemplateId,
                    TemplateName = template.TemplateName,
                    TemplateDescription = template.Description,
                    DepartmentName = template.Department?.DeptName ?? "",
                    Kpis = kpiResponses,
                    OverallAssociateComment = appraisal?.OverallAssociateComment ?? "",    
                    OverallSupervisorComment = appraisal?.OverallSupervisorComment ?? ""  
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in AppraisalTemplate_Infrastructure -> GetByDeptId({departmentId}, {employeeId}, {cycleId})");
                return null;
            }
        }

    }


}



