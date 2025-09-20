using EAA.Application;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
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
        public List<SelfAppraisalResponse_DTO> GetAllSelfAppraisal(int employeeId)
        {
            try
            {
                var result = _context.TblAppraisalCycles
                    .Include(ac=>ac.TblAppraisals)
                    .Where(c => c.Financialyear != null) // ensure linked financial year exists
                    .Select(c => new SelfAppraisalResponse_DTO
                    {
                        CycleId = c.CycleId,
                        CycleName = c.CycleName,
                        PublishDate = c.StartDate.ToDateTime(TimeOnly.MinValue), // convert DateOnly to DateTime
                        DueDate = c.EndDate.ToDateTime(TimeOnly.MinValue),
                        FinancialYearId = c.Financialyear.Financialyearid,
                        FinancialYearName = c.Financialyear.Yearname,
                        
                        Status = c.TblAppraisals
                                    .Where(a => a.CycleId ==c.CycleId && a.EmployeeId == employeeId)
                                    .OrderByDescending(a => a.AppraisalId) // latest if multiple
                                    .Select(a => a.Status)
                                    .FirstOrDefault() ?? "Start",
                        AppraisalId = c.TblAppraisals
                        .Where(a => a.CycleId == c.CycleId && a.EmployeeId == employeeId)
                        .OrderByDescending(a => a.AppraisalId)
                        .Select(a => a.AppraisalId)
                        .FirstOrDefault() // returns 0 if none found

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
                        FinancialYearId = c.Financialyear.Financialyearid,
                        FinancialYearName = c.Financialyear.Yearname
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
