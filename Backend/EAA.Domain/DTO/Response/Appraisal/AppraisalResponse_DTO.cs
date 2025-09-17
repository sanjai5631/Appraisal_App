using System;
using System.Collections.Generic;

namespace EAA.Domain.DTO.Response.Appraisal
{
    public class AppraisalKPIResponse_DTO
    {
        public int KpiId { get; set; }
        public decimal? SelfScore { get; set; }
        public string? SelfComments { get; set; }
        public decimal? ManagerScore { get; set; }
        public string? ManagerComments { get; set; }
    }

    public class AppraisalFormResponse_DTO
    {
        public int EmployeeId { get; set; }
        public int CycleId { get; set; }
        public List<AppraisalKPIResponse_DTO> KpiResponses { get; set; } = new List<AppraisalKPIResponse_DTO>();
        public string Status { get; set; } = "Not Started";
    }

    public class AppraisalActionResponse_DTO
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
