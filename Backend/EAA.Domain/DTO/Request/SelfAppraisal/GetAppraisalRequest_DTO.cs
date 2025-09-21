using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.SelfAppraisal
{
    public class GetAppraisalRequest_DTO
    {
            public int ManagerId { get; set; }          // Optional, can verify manager role
            public int? DepartmentId { get; set; }      // Fetch appraisals by department
            public int? UnitId { get; set; }            // Fetch appraisals by unit
            public string? Status { get; set; }         // Optional: SelfCompleted, SupervisorCompleted

    }
}
