using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Appraisal;

namespace EAA.Infrastructure.Logic.Appraisal
{
    public interface IAppraisal_infrastructure
    {
        AppraisalFormResponse_DTO GetCurrentForm(int employeeId, int cycleId);
        bool SubmitSelfAppraisal(SelfAppraisalRequest_DTO request);
        bool SubmitManagerAppraisal(AppraisalRequest_DTO request, int managerId);
    }
}
