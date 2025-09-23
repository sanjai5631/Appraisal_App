using EAA.Application;
using EAA.Domain.DTO.Request.GetAllAppraisal;
using EAA.Domain.DTO.Response.SelfAppraisal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.SelfAppraisal
{
    public interface ISelfAppraisal_Services
    {
        ApiResponse<List<SelfAppraisalResponse_DTO>> GetAllSelfAppraisal(int employeeId);

        ApiResponse<SelfAppraisalResponse_DTO> GetSelfAppraisalById(int financialYearId);

        ApiResponse<List<GetAppraisalDetailResponse_DTO>> GetAllAppraisal();

        ApiResponse<List<GetAppraisalDetailResponse_DTO>> GetAppraisalById(int appraisalId);

        ApiResponse<List<GetAppraisalResponse_DTO>> GetAppraisal(int employeeId);
    }
}
