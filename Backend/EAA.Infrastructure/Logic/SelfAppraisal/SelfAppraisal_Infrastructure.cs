using EAA.Application;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EAA.Infrastructure.Logic.SelfAppraisal
{
    public class SelfAppraisal_Infrastructure : ISelfAppraisal_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public SelfAppraisal_Infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        // Get all self-appraisal cycles with linked financial year
        public List<SelfAppraisalResponse_DTO> GetAllSelfAppraisal()
        {
            try
            {
                var result = _context.TblAppraisalCycles
                    .Where(c => c.Financialyear != null) // ensure linked financial year exists
                    .Select(c => new SelfAppraisalResponse_DTO
                    {
                        CycleId = c.CycleId,
                        CycleName = c.CycleName,
                        PublishDate = c.StartDate.ToDateTime(TimeOnly.MinValue), // convert DateOnly to DateTime
                        DueDate = c.EndDate.ToDateTime(TimeOnly.MinValue),
                        FinancialYearId = c.Financialyear.Financialyearid
                    })
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SelfAppraisal_Infrastructure -> GetAllSelfAppraisal");
                return new List<SelfAppraisalResponse_DTO>();
            }
        }

        // Get specific self-appraisal by financial year ID
        public SelfAppraisalResponse_DTO GetSelfAppraisalById(int financialYearId)
        {
            try
            {
                var result = _context.TblAppraisalCycles
                    .Where(c => c.Financialyear.Financialyearid == financialYearId)
                    .Select(c => new SelfAppraisalResponse_DTO
                    {
                        CycleId = c.CycleId,
                        CycleName = c.CycleName,
                        PublishDate = c.StartDate.ToDateTime(TimeOnly.MinValue),
                        DueDate = c.EndDate.ToDateTime(TimeOnly.MinValue),
                        FinancialYearId = c.Financialyear.Financialyearid
                    })
                    .FirstOrDefault();

                return result;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in SelfAppraisal_Infrastructure -> GetSelfAppraisalById({financialYearId})");
                return null;
            }
        }
    }
}
