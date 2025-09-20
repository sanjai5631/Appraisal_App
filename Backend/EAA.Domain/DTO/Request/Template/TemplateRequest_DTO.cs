using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.Template
{
    public class TemplateRequest_DTO
    {
        public string TemplateName { get; set; } = null!;
        public int? DepartmentId { get; set; }
        public string? Description { get; set; }
        public List<TemplateKpiRequest_DTO> Kpis { get; set; } = new();
    }

    public class TemplateKpiRequest_DTO
    {
        public int KpiId { get; set; }
        public decimal Weightage { get; set; }
    }

    public class UpdateTemplateRequest_DTO : TemplateRequest_DTO
    {
        public bool? IsActive { get; set; }
    }
}
