using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.Financial
{
    public class FinancialYearResponse_DTO
    {
        public int FinancialYearId { get; set; }
        public string YearName { get; set; } = null!;
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }
}
