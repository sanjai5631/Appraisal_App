using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Request.GetAllAppraisal;
using EAA.Domain.DTO.Request.SelfAppraisal;
using EAA.Domain.DTO.Response.Appraisal;
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

        public List<GetAppraisalDetailResponse_DTO> GetAllAppraisal()
        {
            try
            {
                var appraisals = _context.TblAppraisals
                    .Include(a => a.Employee)
                        .ThenInclude(e => e.Unit)
                    .Include(a => a.Cycle)
                    .Include(a => a.TblAppraisalResponses)
                        .ThenInclude(r => r.Kpi)
                    .Select(a => new GetAppraisalDetailResponse_DTO
                    {
                        AppraisalId = a.AppraisalId,
                        EmployeeName = a.Employee != null ? a.Employee.Name : string.Empty,
                        UnitName = a.Employee != null && a.Employee.Unit != null ? a.Employee.Unit.UnitName : string.Empty,
                        CycleName = a.Cycle != null ? a.Cycle.CycleName : string.Empty,
                        Status = a.Status != null ? a.Status : "Start",
                        FinalRating = a.FinalRating != null ? a.FinalRating : string.Empty,
                        OverallSelfScore = a.OverallSelfScore,
                        OverallSupervisorScore = a.OverallSupervisorScore,
                        OverallAssociateComment = a.OverallAssociateComment != null ? a.OverallAssociateComment : string.Empty,
                        OverallSupervisorComment = a.OverallSupervisorComment != null ? a.OverallSupervisorComment : string.Empty,
                        KpiResponses = a.TblAppraisalResponses.Select(r => new KpiResponse_DTO
                        {
                            KpiId = r.KpiId ?? 0,
                            KpiName = r.Kpi != null ? r.Kpi.Title : string.Empty,
                            SelfScore = r.SelfScore,
                            SupervisorScore = r.SupervisorScore,
                            AssociateComment = r.AssociateComment != null ? r.AssociateComment : string.Empty,
                            SupervisorComment = r.SupervisorComment != null ? r.SupervisorComment : string.Empty
                        }).ToList()
                    })
                    .ToList();

                return appraisals;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SelfAppraisal_Infrastructure -> GetAllAppraisal");
                return new List<GetAppraisalDetailResponse_DTO>();
            }
        }

        public List<GetAppraisalResponse_DTO> GetAppraisal(int employeeId)
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
                    (appraisal => new GetAppraisalResponse_DTO
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

        public List<GetAppraisalDetailResponse_DTO> GetAppraisalById(int appraisalId)
        {
            try
            {
                var appraisal = _context.TblAppraisals
                    .Include(a => a.Employee)
                        .ThenInclude(e => e.Unit)
                    .Include(a => a.Cycle)
                    .Include(a => a.TblAppraisalResponses)
                        .ThenInclude(r => r.Kpi)
                    .Where(a => a.AppraisalId == appraisalId)
                    .Select(a => new GetAppraisalDetailResponse_DTO
                    {
                        AppraisalId = a.AppraisalId,
                        EmployeeName = a.Employee != null ? a.Employee.Name : string.Empty,
                        UnitName = a.Employee != null && a.Employee.Unit != null ? a.Employee.Unit.UnitName : string.Empty,
                        CycleName = a.Cycle != null ? a.Cycle.CycleName : string.Empty,
                        Status = a.Status != null ? a.Status : "Start",
                        FinalRating = a.FinalRating != null ? a.FinalRating : string.Empty,
                        OverallSelfScore = a.OverallSelfScore,
                        OverallSupervisorScore = a.OverallSupervisorScore,
                        OverallAssociateComment = a.OverallAssociateComment != null ? a.OverallAssociateComment : string.Empty,
                        OverallSupervisorComment = a.OverallSupervisorComment != null ? a.OverallSupervisorComment : string.Empty,
                        KpiResponses = a.TblAppraisalResponses.Select(r => new KpiResponse_DTO
                        {
                            KpiId = r.KpiId ?? 0,
                            KpiName = r.Kpi != null ? r.Kpi.Title : string.Empty,
                            SelfScore = r.SelfScore,
                            SupervisorScore = r.SupervisorScore,
                            AssociateComment = r.AssociateComment != null ? r.AssociateComment : string.Empty,
                            SupervisorComment = r.SupervisorComment != null ? r.SupervisorComment : string.Empty
                        }).ToList()
                    })
                    .ToList();

                return appraisal;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SelfAppraisal_Infrastructure -> GetAppraisalById");
                return new List<GetAppraisalDetailResponse_DTO>();
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


            //get by employee id an cycle
           public List<GetAppraisalByEmployeeCycleDTO> GetAppraisalByEmployeeAndCycle(int employeeId, int cycleId)
{
    try
    {
        var appraisals = _context.TblAppraisals
            .Include(a => a.Employee)
            .Include(a => a.Cycle)
            .Include(a => a.TblAppraisalResponses)
                .ThenInclude(r => r.Kpi)
            .Where(a => a.EmployeeId == employeeId && a.CycleId == cycleId)
            .Select(a => new GetAppraisalByEmployeeCycleDTO
            {
                AppraisalId = a.AppraisalId,
                EmployeeId = a.EmployeeId ?? 0,
                EmpCode = a.Employee.EmpCode,
                EmployeeName = a.Employee.Name,
                CycleId = a.CycleId,
                CycleName = a.Cycle.CycleName,
                FinancialYear = a.Cycle.Financialyear.Yearname ?? string.Empty,
                Status = a.Status,
                OverallSelfScore = a.OverallSelfScore,
                OverallSupervisorScore = a.OverallSupervisorScore,
                OverallAssociateComment = a.OverallAssociateComment,
                OverallSupervisorComment = a.OverallSupervisorComment,
                FinalRating = a.FinalRating,
                KPIs = a.TblAppraisalResponses.Select(r => new KpiResponse_DTO
                {
                    KpiId = r.KpiId ?? 0,
                    KpiName = r.Kpi != null ? r.Kpi.Title : string.Empty,
                    SelfScore = r.SelfScore,
                    SupervisorScore = r.SupervisorScore,
                    AssociateComment = r.AssociateComment ?? string.Empty,
                    SupervisorComment = r.SupervisorComment ?? string.Empty
                }).ToList()
            })
            .ToList();

        return appraisals;
    }
    catch (Exception ex)
    {
        _error.Capture(ex, $"Error in GetAppraisalByEmployeeAndCycle({employeeId}, {cycleId})");
        return new List<GetAppraisalByEmployeeCycleDTO>();
    }
}


    }
}
