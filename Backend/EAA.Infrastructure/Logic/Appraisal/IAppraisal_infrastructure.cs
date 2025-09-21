using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Response.Appraisal;

namespace EAA.Infrastructure.Logic.Appraisal
{
    public interface IAppraisal_infrastructure
    {
      
        AppraisalResponseDTO GetCurrentForm(int employeeId, int cycleId);

        bool SubmitAppraisal(AppraisalDTO request);

        bool SubmitManagerReview(AppraisalDTO request, int managerId);

        List<UnitAppraisalResponseDTO> GetUnitAppraisals(int managerId, int? cycleId = null);

        bool UpdateAppraisal(int appraisalId, AppraisalDTO request);
    }
}
