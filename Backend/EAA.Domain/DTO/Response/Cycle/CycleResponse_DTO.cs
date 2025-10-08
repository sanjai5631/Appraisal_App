using System;

namespace EAA.Domain.DTO.Response.Cycle
{
    public class CycleResponse_DTO
    {
        public int CycleId { get; set; }

        public string CycleName { get; set; } = null!;

        // Use DateTime for easier JSON serialization
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Status { get; set; } = "Active"; // Active / Inactive

        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public string? CreatedBy { get; set; }  // Creator's name
        public string? ModifiedBy { get; set; } // Modifier's name

        // Financial Year info
        public int FinancialYearId { get; set; }
        public string FinancialYearName { get; set; } = null!;
    }
}
