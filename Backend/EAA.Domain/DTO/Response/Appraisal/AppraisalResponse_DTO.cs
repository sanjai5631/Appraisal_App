using System;
using System.Collections.Generic;

namespace EAA.Domain.DTO.Response.Appraisal
{
    // Individual KPI response for an appraisal
    public class AppraisalKPIResponse_DTO
    {
        public int KpiId { get; set; }

        // Self-assessment
        public decimal? SelfScore { get; set; }
        public string? SelfComments { get; set; }

        // Manager/HR assessment
        public decimal? ManagerScore { get; set; }
        public string? ManagerComments { get; set; }
    }

    // Appraisal form returned to frontend
    public class AppraisalFormResponse_DTO
    {
        public int EmployeeId { get; set; }
        public int CycleId { get; set; }

        // KPI details
        public List<AppraisalKPIResponse_DTO> KpiResponses { get; set; } = new List<AppraisalKPIResponse_DTO>();

        // Status: Not Started, Submitted, Reviewed, Completed
        public string Status { get; set; } = "Not Started";

        // Optional overall scores
        public decimal? OverallSelfScore { get; set; }
        public decimal? OverallSupervisorScore { get; set; }
        public string? FinalRating { get; set; }
    }

    // Response for actions like submit, update, etc.
    public class AppraisalActionResponse_DTO
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
