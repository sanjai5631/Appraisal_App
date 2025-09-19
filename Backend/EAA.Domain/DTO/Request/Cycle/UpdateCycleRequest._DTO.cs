using System;
using System.ComponentModel.DataAnnotations;

namespace EAA.Domain.DTO.Request.Cycle
{
    public class UpdateCycleRequest_DTO
    {
        [Required(ErrorMessage = "Cycle ID is required.")]
        public int CycleId { get; set; }

        [Required(ErrorMessage = "Cycle name is required.")]
        [StringLength(100, ErrorMessage = "Cycle name cannot exceed 100 characters.")]
        public string CycleName { get; set; } = null!;

        [Required(ErrorMessage = "Start date is required.")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        // Optional: link cycle to a financial year
        public int? Financialyearid { get; set; }

        // Optional: status of the cycle
        public int? StatusId { get; set; }

        public int ModifiedBy { get; set; }
    }
}
