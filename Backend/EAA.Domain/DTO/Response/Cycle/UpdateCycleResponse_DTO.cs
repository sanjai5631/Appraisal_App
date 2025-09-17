using System;

namespace EAA.Domain.DTO.Response.Cycle
{
    public class UpdateCycleResponse_DTO
    {
        public int CycleId { get; set; }
        public string CycleName { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int? StatusId { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;
        public string Message { get; set; } = "Cycle updated successfully.";
    }
}
