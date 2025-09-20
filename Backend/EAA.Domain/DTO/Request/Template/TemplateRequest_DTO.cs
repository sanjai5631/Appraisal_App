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
        public int? KpiId { get; set; } 
        public string KpiTitle { get; set; } = null!;
        public string KpiDescription { get; set; } = null!;
        public decimal Weightage { get; set; }
        public int AgileScore { get; set; }
        public int SupervisorScore { get; set; }
        public string? AssociateComment { get; set; }
        public string? SupervisorComment { get; set; }
    }

    public class UpdateTemplateRequest_DTO : TemplateRequest_DTO
    {
        public bool? IsActive { get; set; }
    }
}
