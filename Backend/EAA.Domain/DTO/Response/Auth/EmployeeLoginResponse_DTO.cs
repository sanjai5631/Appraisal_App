using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Response.Auth
{
    public class EmployeeLoginResponse_DTO
    {
        public string Token { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string EmpCode { get; set; } = null!;
        public int EmployeeId { get; set; }
        public int? DeptId { get; set; }
    }

}
