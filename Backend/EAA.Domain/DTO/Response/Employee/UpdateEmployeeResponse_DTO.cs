using System;

namespace EAA.Domain.DTO.Response.Employee
{
    public class UpdateEmployeeResponse_DTO
    {
        public int EmployeeId { get; set; }               // Auto-generated
        public string EmpCode { get; set; } = null!;      // HR-assigned
        public string Name { get; set; } = null!;
        public string? Gender { get; set; }               // From TblGender
        public string? Religion { get; set; }
        public string? Phone { get; set; }
        public string Email { get; set; } = null!;
        public string? Role { get; set; }                 // From TblRole
        public string? Qualification { get; set; }        // From TblQualification
        public DateOnly? Dob { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? Unit { get; set; }                 // From TblUnit
        public string? Department { get; set; }           // From TblDepartment
        public bool IsActive { get; set; }                // Default true
        public bool IsDeleted { get; set; }               // Default false
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? CreatedBy { get; set; }            // HR/Manager name
        public string? ModifiedBy { get; set; }           // HR/Manager name
    }
}
