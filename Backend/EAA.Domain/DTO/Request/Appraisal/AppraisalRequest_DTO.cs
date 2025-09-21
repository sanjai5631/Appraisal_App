using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EAA.Domain.DTO.Request.Appraisal
{
    public class KPIRequestDTO
    {
        [Required]
        public int KpiId { get; set; }

        public int ResponseId { get; set; }

        [Range(0, 5, ErrorMessage = "Score must be between 0 and 5")]
        public decimal SelfScore { get; set; }           

        [Range(0, 5, ErrorMessage = "Score must be between 0 and 5")]
        public decimal SupervisorScore { get; set; }    

        public string? AssociateComment { get; set; }    
        public string? SupervisorComment { get; set; }   
    }

    public class AppraisalDTO
    {
        public int? AppraisalId { get; set; }         

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int CycleId { get; set; }

        public int? TemplateId { get; set; }

        [Required]
        public List<KPIRequestDTO> KPIResponses { get; set; } = new List<KPIRequestDTO>();

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
