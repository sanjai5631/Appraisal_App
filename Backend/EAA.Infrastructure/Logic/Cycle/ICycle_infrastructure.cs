using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Response.Cycle;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.Cycle
{
    public interface ICycle_infrastructure
    {
        List<CycleResponse_DTO> GetAllCycles();
        CycleResponse_DTO GetCycleById(int cycleId);
        CycleResponse_DTO SaveCycle(CycleRequest_DTO request);
        UpdateCycleResponse_DTO UpdateCycle(int cycleId, UpdateCycleRequest_DTO request);
        string DeleteCycle(int cycleId);
    }
}
