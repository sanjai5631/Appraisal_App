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

    }
}
