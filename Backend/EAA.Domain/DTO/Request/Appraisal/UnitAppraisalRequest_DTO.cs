using System;
using System.Collections.Generic;

namespace EAA.Domain.DTO.Response.Appraisal
{
    public class UnitAppraisalResponseDTO
    {
        public int AppraisalId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UnitName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;

        public int CycleId { get; set; }
        public string CycleName { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly DueDate { get; set; }

        public string Status { get; set; } = string.Empty;
        public decimal? OverallSelfScore { get; set; }
        public decimal? OverallSupervisorScore { get; set; }
        public string? OverallAssociateComment { get; set; }
        public string? OverallSupervisorComment { get; set; }

        public List<UnitAppraisalKpiResponseDTO> KpiResponses { get; set; } = new List<UnitAppraisalKpiResponseDTO>();
    }

    public class UnitAppraisalKpiResponseDTO
    {
        public int KpiId { get; set; }
        public string KpiTitle { get; set; } = string.Empty;
        public string KpiDescription { get; set; } = string.Empty;
        public decimal? SelfScore { get; set; }
        public decimal? SupervisorScore { get; set; }
        public string? AssociateComment { get; set; }
        public string? SupervisorComment { get; set; }
    }
}
