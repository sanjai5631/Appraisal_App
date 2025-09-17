using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace EAA.Domain.DTO.Request.Auth
{
    public class EmployeeLoginRequest_DTO
    {
        [Required(ErrorMessage = "Employee Code is required.")]
        [StringLength(20, ErrorMessage = "Employee Code cannot exceed 20 characters.")]
        public string EmpCode { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters and maximum 50.")]
        public string Password { get; set; } = null!;
    }
}

