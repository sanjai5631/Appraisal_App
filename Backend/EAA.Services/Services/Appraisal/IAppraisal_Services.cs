using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Appraisal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.Appraisal
{
    public interface IAppraisal_Services
    {
        ApiResponse<AppraisalFormResponse_DTO> GetCurrentForm(int employeeId, int cycleId);
        ApiResponse<bool> SubmitSelfAppraisal(SelfAppraisalRequest_DTO request);
        ApiResponse<bool> SubmitManagerAppraisal(AppraisalRequest_DTO request, int managerId);
    }
}
