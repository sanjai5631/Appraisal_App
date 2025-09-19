using System;

namespace EAA.Domain.DTO.Response.Cycle
{
    public class UpdateCycleResponse_DTO
    {
        public int CycleId { get; set; }
        public string CycleName { get; set; } = null!;

        public DateTime StartDate { get; set; }  // easier JSON serialization
        public DateTime EndDate { get; set; }

        public int? StatusId { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;

        public string Message { get; set; } = "Cycle updated successfully.";

        // Optional: include financial year info
        public int? FinancialYearId { get; set; }
        public string? FinancialYearName { get; set; }
    }
}
