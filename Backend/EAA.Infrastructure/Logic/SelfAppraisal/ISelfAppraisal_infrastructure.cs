using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.GetAllAppraisal;
using EAA.Domain.DTO.Request.SelfAppraisal;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.SelfAppraisal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.SelfAppraisal
{
    public interface ISelfAppraisal_infrastructure
    {
        List<SelfAppraisalResponse_DTO> GetAllSelfAppraisal(int employeeId);
        SelfAppraisalResponse_DTO GetSelfAppraisalById(int financialYearId);
        List<GetAppraisalDetailResponse_DTO> GetAllAppraisal();
        List<GetAppraisalDetailResponse_DTO> GetAppraisalById(int appraisalId);
        List<GetAppraisalResponse_DTO> GetAppraisal(int employeeId);

    }
}
