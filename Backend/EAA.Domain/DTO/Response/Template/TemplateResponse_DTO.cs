namespace EAA.Domain.DTO.Response.Template
{
    // Response DTO for a template
    public class TemplateResponse_DTO
    {
        public int TemplateId { get; set; }               
        public string TemplateName { get; set; } = null!; 
        public string? TemplateDescription { get; set; }   
        public string? DepartmentName { get; set; }       
        public List<TemplateKpiResponse_DTO> Kpis { get; set; } = new();
        public string? OverallAssociateComment { get; set; }
        public string? OverallSupervisorComment { get; set; }
    }

    // Response DTO for individual KPI in a template
    public class TemplateKpiResponse_DTO
    {
        public int KpiId { get; set; }                    
        public string KpiTitle { get; set; } = null!;   
        public string KpiDescription { get; set; } = null!; 
        public decimal KpiWeightage { get; set; }         
        public int AgileScore { get; set; }               
        public int SupervisorScore { get; set; }          
        public string? AssociateComment { get; set; }    
        public string? SupervisorComment { get; set; }    
    }

    // Response DTO for UpdateTemplate action
    public class UpdateTemplateResponse_DTO : TemplateResponse_DTO
    {
        public bool? IsActive { get; set; }            
    }
}
