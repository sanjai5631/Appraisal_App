using EAA.Application;
using EAA.Domain.DTO.Request.Cycle;
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
                    .Select(c => new CycleResponse_DTO
                    {
                        CycleId = c.CycleId,
                        CycleName = c.CycleName,
                        StartDate = c.StartDate,
                        EndDate = c.EndDate,
                        Status = c.Status.StatusName,
                        CreatedOn = c.CreatedOn,
                        ModifiedOn = c.ModifiedOn,
                        CreatedBy = c.CreatedByNavigation.Name,
                        ModifiedBy = c.ModifiedByNavigation.Name
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
                    .FirstOrDefault(c => c.CycleId == cycleId);

                if (cycle == null) return null;

                return new CycleResponse_DTO
                {
                    CycleId = cycle.CycleId,
                    CycleName = cycle.CycleName,
                    StartDate = cycle.StartDate,
                    EndDate = cycle.EndDate,
                    Status = cycle.Status?.StatusName,
                    CreatedOn = cycle.CreatedOn,
                    ModifiedOn = cycle.ModifiedOn,
                    CreatedBy = cycle.CreatedByNavigation?.Name,
                    ModifiedBy = cycle.ModifiedByNavigation?.Name
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
                var hr = _context.TblEmployees
                    .Include(e => e.Role)
                    .FirstOrDefault(e => e.EmployeeId == request.CreatedBy);

                if (hr == null || hr.Role?.RoleName != "HR")
                {
                    _error.Capture(new Exception("Unauthorized"), "Only HR can create cycles");
                    return null;
                }

                var cycle = new TblAppraisalCycle
                {
                    CycleName = request.CycleName,
                    StartDate = DateOnly.FromDateTime(request.StartDate),  
                    EndDate = DateOnly.FromDateTime(request.EndDate),   
                    StatusId = request.StatusId,
                    CreatedBy = request.CreatedBy,
                    CreatedOn = DateTime.Now
                };

                _context.TblAppraisalCycles.Add(cycle);
                _context.SaveChanges();

                return GetCycleById(cycle.CycleId);
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_infrastructure -> SaveCycle");
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

                // Apply updates safely
                cycle.CycleName = !string.IsNullOrWhiteSpace(request.CycleName)
                    ? request.CycleName
                    : cycle.CycleName;

                if (request.StartDate != default(DateTime))
                    cycle.StartDate = DateOnly.FromDateTime(request.StartDate);

                if (request.EndDate != default(DateTime))
                    cycle.EndDate = DateOnly.FromDateTime(request.EndDate);


                cycle.StatusId = request.StatusId ?? cycle.StatusId;
                cycle.ModifiedBy = request.ModifiedBy;
                cycle.ModifiedOn = DateTime.Now;

                _context.SaveChanges();

                // Map to response DTO
                return new UpdateCycleResponse_DTO
                {
                    CycleId = cycle.CycleId,
                    CycleName = cycle.CycleName,
                    StartDate = cycle.StartDate,
                    EndDate = cycle.EndDate,
                    StatusId = cycle.StatusId,
                    ModifiedBy = cycle.ModifiedBy ?? 0,
                    ModifiedOn = cycle.ModifiedOn ?? DateTime.Now,
                    Message = "Cycle updated successfully."
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Cycle_infrastructure -> UpdateCycle");
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
                _error.Capture(ex, "Error in Cycle_infrastructure -> DeleteCycle");
                return $"Error deleting cycle: {ex.Message}";
            }
        }
    }
}
