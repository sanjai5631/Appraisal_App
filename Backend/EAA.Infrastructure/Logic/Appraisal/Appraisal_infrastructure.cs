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

        public Appraisal_infrastructure(DbAppraisalContext context)
        {
            _context = context;
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

        // Submit a self-appraisal (or new appraisal)
        public bool SubmitAppraisal(AppraisalDTO request)
         {
            TblAppraisal appraisal;

            if (request.AppraisalId.HasValue)
            {
                appraisal = _context.TblAppraisals
                    .Include(a => a.TblAppraisalResponses)
                    .FirstOrDefault(a => a.AppraisalId == request.AppraisalId.Value);

                if (appraisal == null)
                    return false;

                // Update existing appraisal
                appraisal.OverallSelfScore = request.OverallSelfScore;
                appraisal.Status = request.Status ?? "Pending";
                appraisal.ModifiedOn = DateTime.Now;
                appraisal.ModifiedBy = request.CreatedBy;

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
                    CreatedOn = DateTime.Now,
                    CreatedBy = request.CreatedBy
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
    }
}
