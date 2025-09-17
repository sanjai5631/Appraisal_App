using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Domain.DTO.Request.Employee
{
    public class UpdateEmployeeRequest_DTO
    {
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string? Name { get; set; }

        [StringLength(10, ErrorMessage = "Gender cannot exceed 10 characters.")]
        public string? Gender { get; set; }

        [StringLength(50, ErrorMessage = "Religion cannot exceed 50 characters.")]
        public string? Religion { get; set; }

        [Phone(ErrorMessage = "Invalid phone number.")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string? Email { get; set; }

        [StringLength(50, ErrorMessage = "Role cannot exceed 50 characters.")]
        public string? Role { get; set; }

        [StringLength(100, ErrorMessage = "Qualification cannot exceed 100 characters.")]
        public string? Qualification { get; set; }

        [DataType(DataType.Date)]
        public DateOnly? Dob { get; set; }

        [DataType(DataType.Date)]
        public DateTime? JoiningDate { get; set; }

        [StringLength(100, ErrorMessage = "Unit cannot exceed 100 characters.")]
        public string? Unit { get; set; }

        public bool? IsActive { get; set; }

        [Required(ErrorMessage = "ModifiedBy (HR EmployeeId) is required.")]
        public int ModifiedBy { get; set; }
    }

}

