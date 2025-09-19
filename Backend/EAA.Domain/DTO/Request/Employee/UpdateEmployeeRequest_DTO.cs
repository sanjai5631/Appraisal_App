using System;
using System.ComponentModel.DataAnnotations;

namespace EAA.Domain.DTO.Request.Employee
{
    public class UpdateEmployeeRequest_DTO
    {
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string? Name { get; set; }

        // Foreign key IDs instead of string names
        [Required(ErrorMessage = "GenderId is required.")]
        public int? GenderId { get; set; }

        [StringLength(50, ErrorMessage = "Religion cannot exceed 50 characters.")]
        public string? Religion { get; set; }

        [Phone(ErrorMessage = "Invalid phone number.")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters.")]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "RoleId is required.")]
        public int? RoleId { get; set; }

        [Required(ErrorMessage = "QualificationId is required.")]
        public int? QualificationId { get; set; }

        [DataType(DataType.Date)]
        public DateOnly? Dob { get; set; }

        [DataType(DataType.Date)]
        public DateTime? JoiningDate { get; set; }

        [Required(ErrorMessage = "UnitId is required.")]
        public int? UnitId { get; set; }

        [Required(ErrorMessage = "Department is required.")]
        public int? DeptId { get; set; }   // Department reassignment

        public bool? IsActive { get; set; }

        [Required(ErrorMessage = "ModifiedBy (HR EmployeeId) is required.")]
        public int ModifiedBy { get; set; }
    }
}
