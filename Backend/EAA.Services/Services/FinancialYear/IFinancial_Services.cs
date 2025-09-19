using EAA.Application;
using EAA.Domain.DTO.Request.Financial;
using EAA.Domain.DTO.Response.Financial;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAA.Services.Services.FinancialYear
{
    public interface IFinancial_Services
    {
        ApiResponse<List<FinancialYearResponse_DTO>> GetAllFinancialYears();
        ApiResponse<FinancialYearResponse_DTO> GetFinancialYearById(int financialYearId);
        ApiResponse<FinancialYearResponse_DTO> SaveFinancialYear(FinancialYearRequest_DTO financialYearRequest);
        ApiResponse<FinancialYearResponse_DTO> UpdateFinancialYear(int financialYearId, FinancialYearRequest_DTO updateRequest);
        ApiResponse<string> DeleteFinancialYear(int financialYearId);
    }
}
