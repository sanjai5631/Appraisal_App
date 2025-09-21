using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.SelfAppraisal;
using EAA.Domain.DTO.Response.Employee;
using EAA.Domain.DTO.Response.SelfAppraisal;
using EAA.Domain.DTO.Response.User;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
                    .Include(ac => ac.TblAppraisals)
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
                                    .Where(a => a.CycleId == c.CycleId && a.EmployeeId == employeeId)
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



        public List<GetAppraisalResponse_DTO >GetAppraisal(int employeeId)
        {
            try
            {
                var unitId = _context.TblEmployees
                    .Where(a => a.EmployeeId == employeeId)
                    .FirstOrDefault().UnitId;

                return _context.TblAppraisals
                    .Include(a => a.Employee)       // TblEmployee
                    .Where(a => a.Employee.UnitId == unitId)
                    .Include(a => a.Cycle)
                    .ThenInclude(c => c.Financialyear).Select
                    (appraisal =>   new GetAppraisalResponse_DTO
                    {
                        AppraisalId = appraisal.AppraisalId,
                        EmployeeId = appraisal.EmployeeId ?? 0,
                        EmpCode = appraisal.Employee.EmpCode,
                        EmployeeName = appraisal.Employee.Name,
                        CycleId = appraisal.CycleId,
                        CycleName = appraisal.Cycle.CycleName,
                        FinancialYear = appraisal.Cycle.Financialyear.Yearname ?? string.Empty,
                        Status = appraisal.Status,
                        OverallSelfScore = appraisal.OverallSelfScore,
                        OverallAssociateComment = appraisal.OverallAssociateComment,
                        OverallSupervisorScore = appraisal.OverallSupervisorScore,
                        OverallSupervisorComment = appraisal.OverallSupervisorComment,
                        FinalRating = appraisal.FinalRating
                    }).ToList();
               
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in GetAppraisal");
                return null;
            }
        }

        public List<EmployeeByUnitResponseDTO> GetEmployeesByUnit(EmployeesByUnitRequestDTO request)
        {
            var query = _context.TblEmployees
                .Where(e => e.UnitId == request.UnitId);

            var employees = query
                .Select(e => new EmployeeByUnitResponseDTO
                {
                    EmployeeId = e.EmployeeId,
                    EmployeeName = e.Name,
                    EmployeeCode = e.EmpCode,
                    Email = e.Email,
                    Role = e.Role != null ? e.Role.RoleName : "",
                    DepartmentName = e.Dept != null ? e.Dept.DeptName : "",
                    UnitName = e.Unit != null ? e.Unit.UnitName : ""
                })
                .ToList();

            return employees;
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
