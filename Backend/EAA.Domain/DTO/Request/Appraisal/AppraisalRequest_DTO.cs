using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EAA.Domain.DTO.Request.Employee
{
    // Individual KPI response for self-appraisal
    public class SelfKPIRequestDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "KPI Id must be greater than 0")]
        public int KpiId { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Score must be between 0 and 100")]
        public decimal Score { get; set; }

        [MaxLength(500, ErrorMessage = "Comments cannot exceed 500 characters")]
        public string Comments { get; set; } = string.Empty;
    }

    // Request to submit self-appraisal
    public class SelfAppraisalRequest_DTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "EmployeeId must be greater than 0")]
        public int EmployeeId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CycleId must be greater than 0")]
        public int CycleId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one KPI response is required")]
        public List<SelfKPIRequestDTO> KPIResponses { get; set; } = new List<SelfKPIRequestDTO>();
    }

    // Optional: For manager/HR submission
    public class AppraisalRequest_DTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "EmployeeId must be greater than 0")]
        public int EmployeeId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CycleId must be greater than 0")]
        public int CycleId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one KPI response is required")]
        public List<SelfKPIRequestDTO> KPIResponses { get; set; } = new List<SelfKPIRequestDTO>();

        [MaxLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        public string? Status { get; set; }   // "Submitted", "Reviewed", etc.
    }
}
