using EAA.Application;
using EAA.Domain.DTO.Request.Employee;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace EAA.Infrastructure.Logic.Appraisal
{
    public class Appraisal_infrastructure : IAppraisal_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public Appraisal_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        // Get current appraisal form for employee + cycle
        public AppraisalFormResponse_DTO GetCurrentForm(int employeeId, int cycleId)
        {
            try
            {
                var appraisal = _context.TblAppraisals
                    .Include(a => a.TblAppraisalResponses)
                    .FirstOrDefault(a => a.EmployeeId == employeeId && a.CycleId == cycleId);

                if (appraisal == null)
                    return new AppraisalFormResponse_DTO
                    {
                        EmployeeId = employeeId,
                        CycleId = cycleId,
                        Status = "Not Started",
                        KpiResponses = new List<AppraisalKPIResponse_DTO>()
                    };

                var kpiResponses = appraisal.TblAppraisalResponses
                    .Select(r => new AppraisalKPIResponse_DTO
                    {
                        KpiId = r.KpiId ?? 0,
                        SelfScore = r.SelfScore,
                        SelfComments = r.AssociateComment ?? string.Empty,
                        ManagerScore = r.SupervisorScore,
                        ManagerComments = r.SupervisorComment ?? string.Empty
                    })
                    .ToList();

                return new AppraisalFormResponse_DTO
                {
                    EmployeeId = employeeId,
                    CycleId = cycleId,
                    Status = appraisal.Status ?? "Pending",
                    KpiResponses = kpiResponses
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_infrastructure -> GetCurrentForm");
                return new AppraisalFormResponse_DTO
                {
                    EmployeeId = employeeId,
                    CycleId = cycleId,
                    Status = "Error",
                    KpiResponses = new List<AppraisalKPIResponse_DTO>()
                };
            }
        }

        // Submit self-appraisal
        public bool SubmitSelfAppraisal(SelfAppraisalRequest_DTO request)
        {
            try
            {
                var appraisal = _context.TblAppraisals
                    .FirstOrDefault(a => a.EmployeeId == request.EmployeeId && a.CycleId == request.CycleId);

                if (appraisal == null)
                {
                    appraisal = new TblAppraisal
                    {
                        EmployeeId = request.EmployeeId,
                        CycleId = request.CycleId,
                        Status = "Submitted",
                        CreatedOn = DateTime.Now
                    };
                    _context.TblAppraisals.Add(appraisal);
                    _context.SaveChanges();
                }

                foreach (var kpi in request.KPIResponses)
                {
                    var response = new TblAppraisalResponse
                    {
                        AppraisalId = appraisal.AppraisalId,
                        KpiId = kpi.KpiId,
                        SelfScore = kpi.Score,
                        AssociateComment = kpi.Comments,
                        CreatedOn = DateTime.Now
                    };
                    _context.TblAppraisalResponses.Add(response);
                }

                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_infrastructure -> SubmitSelfAppraisal");
                return false;
            }
        }

        // Submit manager/HR appraisal
        public bool SubmitManagerAppraisal(AppraisalRequest_DTO request, int managerId)
        {
            try
            {
                var appraisal = _context.TblAppraisals
                    .Include(a => a.TblAppraisalResponses)
                    .FirstOrDefault(a => a.EmployeeId == request.EmployeeId && a.CycleId == request.CycleId);

                if (appraisal == null)
                {
                    _error.Capture(new Exception("Appraisal not found"), "SubmitManagerAppraisal");
                    return false;
                }

                foreach (var kpi in request.KPIResponses)
                {
                    var response = appraisal.TblAppraisalResponses
                        .FirstOrDefault(r => r.KpiId == kpi.KpiId);

                    if (response != null)
                    {
                        response.SupervisorScore = kpi.Score;
                        response.SupervisorComment = kpi.Comments;
                        response.ModifiedOn = DateTime.Now;
                        response.ModifiedBy = managerId;
                    }
                    else
                    {
                        var newResponse = new TblAppraisalResponse
                        {
                            AppraisalId = appraisal.AppraisalId,
                            KpiId = kpi.KpiId,
                            SupervisorScore = kpi.Score,
                            SupervisorComment = kpi.Comments,
                            CreatedOn = DateTime.Now,
                            CreatedBy = managerId
                        };
                        _context.TblAppraisalResponses.Add(newResponse);
                    }
                }

                appraisal.Status = request.Status ?? "Reviewed";
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Appraisal_infrastructure -> SubmitManagerAppraisal");
                return false;
            }
        }
    }
}
