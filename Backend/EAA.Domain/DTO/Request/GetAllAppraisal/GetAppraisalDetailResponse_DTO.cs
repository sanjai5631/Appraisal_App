using System;
using System.Collections.Generic;

namespace EAA.Domain.DTO.Request.GetAllAppraisal
{
    public class GetAppraisalDetailResponse_DTO
    {
        public int AppraisalId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string UnitName { get; set; } = string.Empty;
        public string CycleName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal? OverallSelfScore { get; set; }
        public decimal? OverallSupervisorScore { get; set; }
        public string FinalRating { get; set; } = string.Empty;
        public string OverallAssociateComment { get; set; } = string.Empty;
        public string OverallSupervisorComment { get; set; } = string.Empty;

        public List<KpiResponse_DTO> KpiResponses { get; set; } = new List<KpiResponse_DTO>();
    }

    public class KpiResponse_DTO
    {
        public int KpiId { get; set; }
        public string KpiName { get; set; } = string.Empty;
        public decimal? SelfScore { get; set; }
        public decimal? SupervisorScore { get; set; }
        public string AssociateComment { get; set; } = string.Empty;
        public string SupervisorComment { get; set; } = string.Empty;
    }
}
