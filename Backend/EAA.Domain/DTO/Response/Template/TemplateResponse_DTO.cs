using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.Template
{
    public class TemplateResponse_DTO
    {
        public int TemplateId { get; set; }
        public string TemplateName { get; set; } = null!;
        public string? TemplateDescription { get; set; }
        public string? DepartmentName { get; set; }
        public List<TemplateKpiResponse_DTO> Kpis { get; set; } = new();
    }

    public class TemplateKpiResponse_DTO
    {
        public int KpiId { get; set; }
        public string KpiTitle { get; set; } = null!;
        public string? KpiDescription { get; set; }
        public decimal? KpiWeightage { get; set; }
    }

    public class UpdateTemplateResponse_DTO : TemplateResponse_DTO { }
}

