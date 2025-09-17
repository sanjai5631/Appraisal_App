using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Response.Cycle;
using System.Collections.Generic;

namespace EAA.Services.Services.Cycle
{
    public interface ICycle_Services
    {
        ApiResponse<List<CycleResponse_DTO>> GetAllCycles();
        ApiResponse<CycleResponse_DTO> GetCycleById(int cycleId);
        ApiResponse<CycleResponse_DTO> SaveCycle(CycleRequest_DTO request);
        ApiResponse<UpdateCycleResponse_DTO> UpdateCycle(int cycleId, UpdateCycleRequest_DTO request);
        ApiResponse<string> DeleteCycle(int cycleId);
    }
}
