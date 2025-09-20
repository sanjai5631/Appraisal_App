using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.SelfAppraisal
{
    public class SelfAppraisalResponse_DTO
    {
        public int FinancialYearId { get; set; }   // Linked financial year
        public string FinancialYearName { get; set; }
        public int AppraisalId { get; set; }
        public int CycleId { get; set; }
        public string CycleName { get; set; }      // Cycle name
        public DateTime PublishDate { get; set; }  // Start date of the cycle
        public DateTime DueDate { get; set; }      // End date of the cycle
        public string Status { get; set; }
    }
}
