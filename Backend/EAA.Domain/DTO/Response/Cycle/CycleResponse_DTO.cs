using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.Cycle
{
    public class CycleResponse_DTO
    {
        public int CycleId { get; set; }
        public string CycleName { get; set; } = null!;
        public DateOnly StartDate { get; set; }           
        public DateOnly EndDate { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedBy { get; set; }
    }

}
