using System;
using System.Collections.Generic;

namespace EAA.Domain.DTO.Response.Appraisal
{
    public class KpiResponseDTO
    {
        public int KpiId { get; set; }
        public decimal SelfScore { get; set; }
        public decimal SupervisorScore { get; set; }
        public string? AssociateComment { get; set; }
        public string? SupervisorComment { get; set; }
    }

    public class AppraisalResponseDTO
    {
        public int AppraisalId { get; set; }
        public int EmployeeId { get; set; }
        public int CycleId { get; set; }
        public int? TemplateId { get; set; }

        public List<KpiResponseDTO> KPIResponses { get; set; } = new List<KpiResponseDTO>();

        public decimal? OverallSelfScore { get; set; }
        public decimal? OverallSupervisorScore { get; set; }
        public string? FinalRating { get; set; }
        public string? Status { get; set; }
        public string? OverallAssociateComment { get; set; }
        public string? OverallSupervisorComment { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
    }
}
