using EAA.Application;
using EAA.Domain.DTO.Request.Appraisal;
using EAA.Domain.DTO.Response.Appraisal;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace EAA.Infrastructure.Logic.Appraisal
{
    public class Appraisal_infrastructure : IAppraisal_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly IEmailService _emailService;

        public Appraisal_infrastructure(DbAppraisalContext context,IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Fetch the current appraisal form for an employee in a cycle
        public AppraisalResponseDTO GetCurrentForm(int employeeId, int cycleId)
        {
            var appraisal = _context.TblAppraisals
                .Include(a => a.TblAppraisalResponses)
                .FirstOrDefault(a => a.EmployeeId == employeeId && a.CycleId == cycleId);

            if (appraisal == null)
            {
                return new AppraisalResponseDTO
                {
                    EmployeeId = employeeId,
                    CycleId = cycleId,
                    KPIResponses = new System.Collections.Generic.List<KpiResponseDTO>()
                };
            }

            return new AppraisalResponseDTO
            {
                AppraisalId = appraisal.AppraisalId,
                EmployeeId = appraisal.EmployeeId ?? 0,
                CycleId = appraisal.CycleId ?? 0,
                TemplateId = appraisal.TemplateId,
                OverallSelfScore = appraisal.OverallSelfScore,
                OverallSupervisorScore = appraisal.OverallSupervisorScore,
                FinalRating = appraisal.FinalRating,
                Status = appraisal.Status,
                KPIResponses = appraisal.TblAppraisalResponses.Select(r => new KpiResponseDTO
                {
                    KpiId = r.KpiId ?? 0,
                    SelfScore = r.SelfScore ?? 0,
                    SupervisorScore = r.SupervisorScore ?? 0,
                    AssociateComment = r.AssociateComment,
                    SupervisorComment = r.SupervisorComment
                }).ToList()
            };
        }

        public List<UnitAppraisalResponseDTO> GetUnitAppraisals(int managerId, int? cycleId = null)
        {
            // 1. Get the manager's unit
            var manager = _context.TblEmployees.FirstOrDefault(e => e.EmployeeId == managerId);
            if (manager == null || manager.UnitId == null)
                return new List<UnitAppraisalResponseDTO>();

            var unitId = manager.UnitId;

            // 2. Get all employees in the manager's unit
            var employeesInUnit = _context.TblEmployees
                .Where(e => e.UnitId == unitId && e.IsActive == true)
                .Select(e => new
                {
                    e.EmployeeId,
                    e.Name,
                    e.EmpCode,
                    e.Email,
                    UnitName = e.Unit!.UnitName,
                    DepartmentName = e.Dept!.DeptName
                })
                .ToList();

            // 3. Get appraisals for these employees
            var employeeIds = employeesInUnit.Select(e => e.EmployeeId).ToList();

            var appraisalsQuery = _context.TblAppraisals
                .Where(a => a.EmployeeId.HasValue && employeeIds.Contains(a.EmployeeId.Value));

            if (cycleId.HasValue)
                appraisalsQuery = appraisalsQuery.Where(a => a.CycleId == cycleId.Value);

            var appraisals = appraisalsQuery
                .Include(a => a.Cycle)
                .Include(a => a.TblAppraisalResponses)
                    .ThenInclude(r => r.Kpi)
                .Include(a => a.Employee)
                .ToList();

            // 4. Map to DTO
            var result = appraisals.Select(a =>
            {
                var emp = employeesInUnit.FirstOrDefault(e => e.EmployeeId == a.EmployeeId);

                return new UnitAppraisalResponseDTO
                {
                    AppraisalId = a.AppraisalId,
                    EmployeeId = a.EmployeeId!.Value,
                    EmployeeName = emp?.Name ?? "",
                    EmployeeCode = emp?.EmpCode ?? "",
                    Email = emp?.Email ?? "",
                    UnitName = emp?.UnitName ?? "",
                    DepartmentName = emp?.DepartmentName ?? "",
                    CycleId = a.CycleId ?? 0,
                    CycleName = a.Cycle?.CycleName ?? "",
                    StartDate = a.Cycle.StartDate,
                    DueDate = a.Cycle.EndDate,
                    Status = a.Status ?? "",
                    OverallSelfScore = a.OverallSelfScore,
                    OverallSupervisorScore = a.OverallSupervisorScore,
                    OverallAssociateComment = a.OverallAssociateComment,
                    OverallSupervisorComment = a.OverallSupervisorComment,
                    KpiResponses = a.TblAppraisalResponses.Select(r => new UnitAppraisalKpiResponseDTO
                    {
                        KpiId = r.KpiId ?? 0,
                        KpiTitle = r.Kpi?.Title ?? "",
                        KpiDescription = r.Kpi?.Description ?? "",
                        SelfScore = r.SelfScore,
                        SupervisorScore = r.SupervisorScore,
                        AssociateComment = r.AssociateComment,
                        SupervisorComment = r.SupervisorComment
                    }).ToList()
                };
            }).ToList();

            return result;
        }



        // Submit a self-appraisal (or new appraisal)
        public bool SubmitAppraisal(AppraisalDTO request)
        {
            TblAppraisal appraisal;

            if (request.AppraisalId.HasValue)
            {
                // Update existing appraisal
                appraisal = _context.TblAppraisals
                    .Include(a => a.TblAppraisalResponses)
                    .FirstOrDefault(a => a.AppraisalId == request.AppraisalId.Value);

                if (appraisal == null)
                    return false;

                appraisal.OverallSelfScore = request.OverallSelfScore;
                appraisal.Status = request.Status ?? "Pending";
                appraisal.ModifiedOn = DateTime.Now;
                appraisal.ModifiedBy = request.CreatedBy;
                appraisal.OverallAssociateComment = request.OverallAssociateComment;
                appraisal.OverallSupervisorComment = request.OverallSupervisorComment;
                appraisal.OverallSupervisorScore = request.OverallSupervisorScore;
                appraisal.FinalRating = request.FinalRating;

                // Remove old KPI responses
                _context.TblAppraisalResponses.RemoveRange(appraisal.TblAppraisalResponses);
            }
            else
            {
                // New appraisal
                appraisal = new TblAppraisal
                {
                    EmployeeId = request.EmployeeId,
                    CycleId = request.CycleId,
                    TemplateId = request.TemplateId,
                    Status = request.Status ?? "Pending",
                    OverallSelfScore = request.OverallSelfScore,
                    OverallSupervisorScore = request.OverallSupervisorScore,
                    FinalRating = request.FinalRating,
                    CreatedOn = DateTime.Now,
                    CreatedBy = request.CreatedBy,
                    OverallAssociateComment = request.OverallAssociateComment,
                    OverallSupervisorComment = request.OverallSupervisorComment,
                };
                _context.TblAppraisals.Add(appraisal);
            }

            // Add KPI responses
            foreach (var kpi in request.KPIResponses)
            {
                appraisal.TblAppraisalResponses.Add(new TblAppraisalResponse
                {
                    KpiId = kpi.KpiId,
                    SelfScore = kpi.SelfScore,
                    SupervisorScore = kpi.SupervisorScore,
                    AssociateComment = kpi.AssociateComment,
                    SupervisorComment = kpi.SupervisorComment,
                    CreatedOn = DateTime.Now,
                    CreatedBy = request.CreatedBy
                });
            }

            _context.SaveChanges();

            // ✅ Send email to manager
            var employee = _context.TblEmployees.FirstOrDefault(e => e.EmployeeId == request.EmployeeId);
            if (employee?.Email != null)
            {
                var subject = $"Appraisal Submitted by {employee.Name}";
                var body = $"<p>Employee <strong>{employee.Name}</strong> has submitted their appraisal for cycle {request.CycleId}.</p>" +
                           $"<p><a href='https://yourapp.com/appraisals/{appraisal.AppraisalId}'>Click here to review</a></p>";

                // Injected IEmailService (assume _emailService is available in this class)
                _emailService.SendEmailAsync(employee.Email, subject, body).GetAwaiter().GetResult();
            }

            return true;
        }


        // Submit a manager review for an existing appraisal
        public bool SubmitManagerReview(AppraisalDTO request, int managerId)
        {
            var appraisal = _context.TblAppraisals
                .Include(a => a.TblAppraisalResponses)
                .FirstOrDefault(a => a.AppraisalId == request.AppraisalId);

            if (appraisal == null)
                return false;

            appraisal.OverallSupervisorScore = request.OverallSupervisorScore;
            appraisal.Status = request.Status ?? "Completed";
            appraisal.FinalRating = request.FinalRating;
            appraisal.ModifiedOn = DateTime.Now;
            appraisal.ModifiedBy = managerId;

            foreach (var kpi in request.KPIResponses)
            {
                var existing = appraisal.TblAppraisalResponses
                    .FirstOrDefault(r => r.KpiId == kpi.KpiId);
                if (existing != null)
                {
                    existing.SupervisorScore = kpi.SupervisorScore;
                    existing.SupervisorComment = kpi.SupervisorComment;
                    existing.ModifiedOn = DateTime.Now;
                    existing.ModifiedBy = managerId;
                }
            }

            _context.SaveChanges();
            return true;
        }

        public bool UpdateAppraisal(int appraisalId, AppraisalDTO request)
        {
            var appraisal = _context.TblAppraisals
                .Include(a => a.TblAppraisalResponses)
                .FirstOrDefault(a => a.AppraisalId == appraisalId);

            if (appraisal == null) return false;

            // Update main appraisal fields
            appraisal.Status = request.Status ?? appraisal.Status;
            appraisal.OverallSelfScore = request.OverallSelfScore;

            // Calculate OverallSupervisorScore automatically from KPI responses
            appraisal.OverallSupervisorScore = request.KPIResponses?.Sum(k => k.SupervisorScore) ?? 0;
            appraisal.FinalRating = request.FinalRating;
            appraisal.OverallAssociateComment = request.OverallAssociateComment;
            appraisal.OverallSupervisorComment = request.OverallSupervisorComment;
            appraisal.ModifiedOn = DateTime.Now;
            appraisal.ModifiedBy = request.ModifiedBy;

            // Update or add KPI responses
            foreach (var kpi in request.KPIResponses)
            {
                var response = _context.TblAppraisalResponses
                    .FirstOrDefault(a => a.ResponseId == kpi.ResponseId);

                if (response != null)
                {
                    // Update existing response
                    response.KpiId = kpi.KpiId;
                    response.SelfScore = kpi.SelfScore;
                    response.SupervisorScore = kpi.SupervisorScore;
                    response.AssociateComment = kpi.AssociateComment;
                    response.SupervisorComment = kpi.SupervisorComment;
                    response.ModifiedOn = DateTime.Now;
                    response.ModifiedBy = request.ModifiedBy;
                }
                else
                {
                    // Create new response if it doesn't exist
                    response = new TblAppraisalResponse
                    {
                        KpiId = kpi.KpiId,
                        SelfScore = kpi.SelfScore,
                        SupervisorScore = kpi.SupervisorScore,
                        AssociateComment = kpi.AssociateComment,
                        SupervisorComment = kpi.SupervisorComment,
                        CreatedOn = DateTime.Now,
                        CreatedBy = request.ModifiedBy,
                        AppraisalId = appraisalId
                    };
                    _context.TblAppraisalResponses.Add(response);
                }
            }

            // Save all changes at once
            _context.SaveChanges();

            return true;
        }
    }
}
