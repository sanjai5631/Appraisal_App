using EAA.Domain.DTO.Request.GetAllAppraisal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.SelfAppraisal
{
    public class GetAppraisalByEmployeeCycleDTO
    {
        public int AppraisalId { get; set; }
        public int EmployeeId { get; set; }
        public string EmpCode { get; set; }
        public string EmployeeName { get; set; }
        public int? CycleId { get; set; }
        public string CycleName { get; set; }
        public string FinancialYear { get; set; }
        public string Status { get; set; }
        public decimal? OverallSelfScore { get; set; }
        public decimal? OverallSupervisorScore { get; set; }
        public string OverallAssociateComment { get; set; }
        public string OverallSupervisorComment { get; set; }
        public string FinalRating { get; set; }

        public List<KpiResponse_DTO> KPIs { get; set; } = new List<KpiResponse_DTO>();
    }
}