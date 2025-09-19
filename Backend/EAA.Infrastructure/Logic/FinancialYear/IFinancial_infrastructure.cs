using EAA.Domain.DTO.Request.Financial;
using EAA.Domain.DTO.Response.Financial;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Infrastructure.Logic.FinancialYear
{
    public interface IFinancial_infrastructure
    {
        List<FinancialYearResponse_DTO> GetAllFinancialYears();
        FinancialYearResponse_DTO GetFinancialYearById(int financialYearId);
        FinancialYearResponse_DTO SaveFinancialYear(FinancialYearRequest_DTO financialYearRequest);
        FinancialYearResponse_DTO UpdateFinancialYear(int financialYearId, FinancialYearRequest_DTO updateRequest);
        string DeleteFinancialYear(int financialYearId);
    }
}
