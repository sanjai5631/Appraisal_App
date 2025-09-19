using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.SelfAppraisal
{
    public class SelfAppraisalRequest_DTO
    {
        public int? FinancialYearId { get; set; }  // Link to financial year
        public int CycleId { get; set; }
        public string CycleName { get; set; }      // Name of the appraisal cycle
        public DateTime PublishDate { get; set; }  // Start date of the cycle
        public DateTime DueDate { get; set; }      // End date of the cycle
    }
}
