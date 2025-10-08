using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Request.Mail;
using EAA.Domain.DTO.Response.Appraisal;

namespace EAA.Services.Services.Appraisal
{
    public interface IAppraisal_Services
    {
        ApiResponse<AppraisalResponseDTO>GetCurrentForm(int employeeId, int cycleId);
        ApiResponse<bool> SubmitAppraisal(AppraisalDTO request);
        ApiResponse<bool> SubmitManagerReview(AppraisalDTO request, int managerId);
        ApiResponse<List<UnitAppraisalResponseDTO>> GetUnitAppraisals(int managerId, int? cycleId = null);
        ApiResponse<bool> UpdateAppraisal(int appraisalId, AppraisalDTO request);
        ApiResponse<EmployeeDTO> GetEmployeeById(int employeeId);
        ApiResponse<EmployeeDTO> GetManagerByUnit(int unitId);
    }
}
