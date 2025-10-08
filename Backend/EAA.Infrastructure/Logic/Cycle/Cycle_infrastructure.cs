using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
using EAA.Domain.DTO.Request.Mail;
using EAA.Domain.DTO.Response.Cycle;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EAA.Infrastructure.Logic.Cycle
{
    public class Cycle_infrastructure : ICycle_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public Cycle_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        // Get all cycles
        public List<CycleResponse_DTO> GetAllCycles()
        {
            try
            {
                return _context.TblAppraisalCycles
                    .Include(c => c.CreatedByNavigation)
                    .Include(c => c.ModifiedByNavigation)
                    .Include(c => c.Status)
                    .Include(c => c.Financialyear)
                    .Select(c => new CycleResponse_DTO
                    {
                        CycleId = c.CycleId,
                        CycleName = c.CycleName,
                        StartDate = c.StartDate.ToDateTime(TimeOnly.MinValue),
                        EndDate = c.EndDate.ToDateTime(TimeOnly.MinValue),
                        Status = c.Status != null ? c.Status.StatusName : null,
                        CreatedOn = c.CreatedOn,
                        ModifiedOn = c.ModifiedOn,
                        CreatedBy = c.CreatedByNavigation != null ? c.CreatedByNavigation.Name : null,
                        ModifiedBy = c.ModifiedByNavigation != null ? c.ModifiedByNavigation.Name : null,
                        FinancialYearId = c.Financialyearid??0,
                        FinancialYearName = c.Financialyear != null ? c.Financialyear.Yearname : null
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_infrastructure -> GetAllCycles");
                return new List<CycleResponse_DTO>();
            }
        }


        // Get cycle by ID
        public CycleResponse_DTO GetCycleById(int cycleId)
        {
            try
            {
                var cycle = _context.TblAppraisalCycles
                    .Include(c => c.CreatedByNavigation)
                    .Include(c => c.ModifiedByNavigation)
                    .Include(c => c.Status)
                    .Include(c => c.Financialyear)
                    .FirstOrDefault(c => c.CycleId == cycleId);

                if (cycle == null) return null;

                return new CycleResponse_DTO
                {
                    CycleId = cycle.CycleId,
                    CycleName = cycle.CycleName,
                    StartDate = cycle.StartDate.ToDateTime(TimeOnly.MinValue),
                    EndDate = cycle.EndDate.ToDateTime(TimeOnly.MinValue),
                    Status = cycle.Status?.StatusName,
                    CreatedOn = cycle.CreatedOn,
                    ModifiedOn = cycle.ModifiedOn,
                    CreatedBy = cycle.CreatedByNavigation?.Name,
                    ModifiedBy = cycle.ModifiedByNavigation?.Name,
                    FinancialYearId = cycle.Financialyearid??0,
                    FinancialYearName = cycle.Financialyear?.Yearname
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_infrastructure -> GetCycleById");
                return null;
            }
        }

        // Create cycle
        public CycleResponse_DTO SaveCycle(CycleRequest_DTO request)
        {
            try
            {
                // ✅ Validate financial year
                var financialYear = _context.TblFinancialyears
                    .FirstOrDefault(f => f.Financialyearid == request.Financialyearid);
                if (financialYear == null)
                {
                    _error.Capture(new Exception("Invalid Financial Year"), "SaveCycle");
                    return null;
                }

                // ✅ Optional: validate HR role
                var hr = _context.TblEmployees
                    .FirstOrDefault(e => e.EmployeeId == request.CreatedBy);
                if (hr == null /* || hr.Role?.RoleName != "HR" */)
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR can create cycles");
                    return null;
                }

                // ✅ Save cycle
                var cycle = new TblAppraisalCycle
                {
                    CycleName = request.CycleName,
                    StartDate = DateOnly.FromDateTime(request.StartDate),
                    EndDate = DateOnly.FromDateTime(request.EndDate),
                    StatusId = request.StatusId ?? 1,
                    Financialyearid = request.Financialyearid,
                    CreatedBy = request.CreatedBy,
                    CreatedOn = DateTime.Now
                };

                _context.TblAppraisalCycles.Add(cycle);
                _context.SaveChanges();

                // ✅ Map to DTO with names for email readability
                return new CycleResponse_DTO
                {
                    CycleId = cycle.CycleId,
                    CycleName = cycle.CycleName,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Status = cycle.StatusId == 1 ? "Active" : "Inactive",
                    CreatedOn = cycle.CreatedOn,
                    CreatedBy = hr.Name,
                    FinancialYearId = financialYear.Financialyearid,
                    FinancialYearName = financialYear.Yearname
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in SaveCycle");
                return null;
            }
        }



        // Update cycle
        public UpdateCycleResponse_DTO UpdateCycle(int cycleId, UpdateCycleRequest_DTO request)
        {
            try
            {
                var cycle = _context.TblAppraisalCycles.FirstOrDefault(c => c.CycleId == cycleId);
                if (cycle == null) return null;

                var hr = _context.TblEmployees
                    .Include(e => e.Role)
                    .FirstOrDefault(e => e.EmployeeId == request.ModifiedBy);

                if (hr == null || hr.Role?.RoleName != "HR")
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR can update cycles");
                    return null;
                }

                // Update basic fields
                cycle.CycleName = !string.IsNullOrWhiteSpace(request.CycleName) ? request.CycleName : cycle.CycleName;
                if (request.StartDate != default)
                    cycle.StartDate = DateOnly.FromDateTime(request.StartDate);
                if (request.EndDate != default)
                    cycle.EndDate = DateOnly.FromDateTime(request.EndDate);

                // Auto-update status based on EndDate
                if (cycle.EndDate < DateOnly.FromDateTime(DateTime.Today))
                {
                    cycle.StatusId = 2; // Inactive
                }
                else
                {
                    cycle.StatusId = request.StatusId ?? cycle.StatusId;
                }

                cycle.Financialyearid = request.Financialyearid ?? cycle.Financialyearid;
                cycle.ModifiedBy = request.ModifiedBy;
                cycle.ModifiedOn = DateTime.Now;

                _context.SaveChanges();

                return new UpdateCycleResponse_DTO
                {
                    CycleId = cycle.CycleId,
                    CycleName = cycle.CycleName,
                    StartDate = cycle.StartDate.ToDateTime(TimeOnly.MinValue),
                    EndDate = cycle.EndDate.ToDateTime(TimeOnly.MinValue),
                    StatusId = cycle.StatusId,
                    ModifiedBy = cycle.ModifiedBy ?? 0,
                    ModifiedOn = cycle.ModifiedOn ?? DateTime.Now,
                    FinancialYearId = cycle.Financialyearid,
                    FinancialYearName = cycle.Financialyear?.Yearname,
                    Message = "Cycle updated successfully."
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in Cycle_infrastructure -> UpdateCycle({cycleId})");
                return null;
            }
        }


        // Delete cycle
        public string DeleteCycle(int cycleId)
        {
            try
            {
                var cycle = _context.TblAppraisalCycles.FirstOrDefault(c => c.CycleId == cycleId);
                if (cycle == null) return "Cycle not found";

                _context.TblAppraisalCycles.Remove(cycle);
                _context.SaveChanges();

                return "Cycle deleted successfully";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, $"Error in Cycle_infrastructure -> DeleteCycle({cycleId})");
                return $"Error deleting cycle: {ex.Message}";
            }
        }

        public EmployeeDTO GetEmployeeById(int employeeId)
        {
            var emp = _context.TblEmployees
                .FirstOrDefault(e => e.EmployeeId == employeeId);

            if (emp == null) return null!;

            return new EmployeeDTO
            {
                EmployeeId = emp.EmployeeId,
                Name = emp.Name,
                Email = emp.Email
            };
        }

        public List<EmployeeDTO> GetAllManagers()
        {
            return _context.TblEmployees
                .Where(e => e.Role.RoleName == "Manager") // Assuming Role navigation property exists
                .Select(e => new EmployeeDTO
                {
                    EmployeeId = e.EmployeeId,
                    Name = e.Name,
                    Email = e.Email
                })
                .ToList();
        }
    }
}
