using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.User
{
    public class EmployeeRequest_DTO
    {
        [Required(ErrorMessage = "Employee Code is required.")]
        [StringLength(20, ErrorMessage = "Employee Code cannot exceed 20 characters.")]
        public string EmpCode { get; set; } = null!;   // HR assigns

        [Required(ErrorMessage = "Employee name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = null!;

        public int? GenderId { get; set; }

        [StringLength(50, ErrorMessage = "Religion cannot exceed 50 characters.")]
        public string? Religion { get; set; }

        [Phone(ErrorMessage = "Invalid phone number.")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 50 characters.")]
        public string Password { get; set; } = null!;

        public int? RoleId { get; set; }

        public int? QualificationId { get; set; }

        [DataType(DataType.Date)]
        public DateOnly? Dob { get; set; }

        [DataType(DataType.Date)]
        public DateTime? JoiningDate { get; set; }

        public int? UnitId { get; set; }

        [Required(ErrorMessage = "Department is required.")]
        public int? DeptId { get; set; }   // Department assignment

        public bool? IsActive { get; set; } = true;

        public int CreatedBy { get; set; }   // HR EmployeeId
    }
}
