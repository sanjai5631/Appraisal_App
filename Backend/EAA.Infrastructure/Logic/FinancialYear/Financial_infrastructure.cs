using EAA.Application;
using EAA.Domain.DTO.Request.Financial;
using EAA.Domain.DTO.Response.Financial;
using EAA.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EAA.Infrastructure.Logic.FinancialYear
{
    public class Financial_infrastructure : IFinancial_infrastructure
    {
        private readonly DbAppraisalContext _context;
        private readonly ErrorHandler _error;

        public Financial_infrastructure(DbAppraisalContext context, ErrorHandler error)
        {
            _context = context;
            _error = error;
        }

        // GET all financial years
        public List<FinancialYearResponse_DTO> GetAllFinancialYears()
        {
            try
            {
                return _context.TblFinancialyears
                    .Select(f => new FinancialYearResponse_DTO
                    {
                        FinancialYearId = f.Financialyearid,
                        YearName = f.Yearname,
                        StartYear = f.Startyear,
                        EndYear = f.Endyear
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_infrastructure -> GetAllFinancialYears");
                return new List<FinancialYearResponse_DTO>();
            }
        }

        // GET financial year by ID
        public FinancialYearResponse_DTO GetFinancialYearById(int financialYearId)
        {
            try
            {
                var f = _context.TblFinancialyears
                    .FirstOrDefault(x => x.Financialyearid == financialYearId);

                if (f == null)
                {
                    _error.Capture(new Exception("Not found"), $"Financial_infrastructure -> GetFinancialYearById({financialYearId})");
                    return null;
                }

                return new FinancialYearResponse_DTO
                {
                    FinancialYearId = f.Financialyearid,
                    YearName = f.Yearname,
                    StartYear = f.Startyear,
                    EndYear = f.Endyear
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_infrastructure -> GetFinancialYearById");
                return null;
            }
        }

        // SAVE financial year
        public FinancialYearResponse_DTO SaveFinancialYear(FinancialYearRequest_DTO financialYearRequest)
        {
            try
            {
                var entity = new TblFinancialyear
                {
                    Yearname = financialYearRequest.YearName,
                    Startyear = financialYearRequest.StartYear,
                    Endyear = financialYearRequest.EndYear
                };

                _context.TblFinancialyears.Add(entity);
                _context.SaveChanges();

                return new FinancialYearResponse_DTO
                {
                    FinancialYearId = entity.Financialyearid,
                    YearName = entity.Yearname,
                    StartYear = entity.Startyear,
                    EndYear = entity.Endyear
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_infrastructure -> SaveFinancialYear");
                return null;
            }
        }

        // UPDATE financial year
        public FinancialYearResponse_DTO UpdateFinancialYear(int financialYearId, FinancialYearRequest_DTO updateRequest)
        {
            try
            {
                var entity = _context.TblFinancialyears
                    .FirstOrDefault(f => f.Financialyearid == financialYearId);

                if (entity == null)
                {
                    _error.Capture(new Exception("Not found"), $"Financial_infrastructure -> UpdateFinancialYear({financialYearId})");
                    return null;
                }

                entity.Yearname = updateRequest.YearName;
                entity.Startyear = updateRequest.StartYear;
                entity.Endyear = updateRequest.EndYear;

                _context.SaveChanges();

                return new FinancialYearResponse_DTO
                {
                    FinancialYearId = entity.Financialyearid,
                    YearName = entity.Yearname,
                    StartYear = entity.Startyear,
                    EndYear = entity.Endyear
                };
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_infrastructure -> UpdateFinancialYear");
                return null;
            }
        }

        // DELETE financial year
        public string DeleteFinancialYear(int financialYearId)
        {
            try
            {
                var entity = _context.TblFinancialyears
                    .FirstOrDefault(f => f.Financialyearid == financialYearId);

                if (entity == null) return "Financial year not found";

                _context.TblFinancialyears.Remove(entity);
                _context.SaveChanges();

                return "Financial year deleted successfully";
            }
            catch (Exception ex)
            {
                _error.Capture(ex, "Error in Financial_infrastructure -> DeleteFinancialYear");
                return $"Error deleting financial year: {ex.Message}";
            }
        }
    }
}
